import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import CouncilMember from './models/CouncilMember.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const teamDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/team');
const uploadEnabled = process.argv.includes('--upload');

function getLocalImagePath(imageUrl) {
  const localPath = imageUrl.split(/[?#]/, 1)[0];
  const match = localPath.match(/^\/?team\/(.+)$/i);

  if (!match) return null;

  const relativePath = decodeURIComponent(match[1]).split('/').join(path.sep);
  const filePath = path.resolve(teamDirectory, relativePath);
  const pathFromTeamDirectory = path.relative(teamDirectory, filePath);

  if (pathFromTeamDirectory.startsWith('..') || path.isAbsolute(pathFromTeamDirectory)) {
    throw new Error(`Image path escapes public/team: ${imageUrl}`);
  }

  return filePath;
}

async function migrateImages() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing from server/.env');
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials are missing from server/.env');
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    ...(process.env.MONGODB_DATABASE && { dbName: process.env.MONGODB_DATABASE })
  });

  try {
    const members = await CouncilMember.find({ imageUrl: /^\/?team\//i }).sort({ order: 1 });
    const files = [];
    const missingFiles = [];

    for (const member of members) {
      const filePath = getLocalImagePath(member.imageUrl);
      try {
        const stats = await fs.stat(filePath);
        if (!stats.isFile()) throw new Error('Path is not a file');
        files.push({ member, filePath });
      } catch {
        missingFiles.push({ name: member.name, imageUrl: member.imageUrl });
      }
    }

    console.log(`Database: ${mongoose.connection.name}`);
    console.log(`Local images found: ${files.length}`);
    console.log(`Missing local images: ${missingFiles.length}`);

    for (const missing of missingFiles) {
      console.error(`Missing: ${missing.name} (${missing.imageUrl})`);
    }

    if (!uploadEnabled) {
      console.log('Dry run only. Re-run with --upload to upload and update MongoDB.');
      return;
    }

    let uploaded = 0;
    let failed = 0;

    for (const { member, filePath } of files) {
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'biosoc/council-members',
          public_id: `member_${member._id}`,
          overwrite: true,
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        });

        const update = await CouncilMember.updateOne(
          { _id: member._id, imageUrl: member.imageUrl },
          {
            $set: {
              imageUrl: result.secure_url,
              cloudinaryPublicId: result.public_id
            }
          }
        );

        if (update.modifiedCount !== 1) {
          failed += 1;
          console.error(`Not updated (record changed during upload): ${member.name}`);
          continue;
        }

        uploaded += 1;
        console.log(`Uploaded: ${member.name}`);
      } catch (error) {
        failed += 1;
        console.error(`Failed: ${member.name} - ${error.message}`);
      }
    }

    console.log(`Migration finished: ${uploaded} uploaded, ${failed} failed, ${missingFiles.length} missing files.`);
    if (failed || missingFiles.length) process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

migrateImages().catch(async (error) => {
  console.error(`Image migration failed: ${error.message}`);
  await mongoose.disconnect();
  process.exitCode = 1;
});