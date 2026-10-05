import fs from 'fs/promises';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import CouncilMember from './models/CouncilMember.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

// Council members data extracted from CouncilMembers.tsx
const councilData = {
  seniorCouncil: [
    {
      name: "Rishabh M. Sinha",
      position: "President",
      department: "Core",
      email: "rishabhsinha_23bt105@dtu.ac.in",
      linkedin: "https://in.linkedin.com/in/rishabh-mohan-sinha",
      imageUrl: "/team/Rish.jpg",
      order: 1
    },
    {
      name: "Krisha Singhal",
      position: "Vice President",
      department: "Core",
      email: "krishas.0905@gmail.com",
      linkedin: "https://www.linkedin.com/in/krisha-singhal-39739a287",
      imageUrl: "/team/Kri.jpg",
      order: 2
    },
    {
      name: "Hunar Agarwal",
      position: "Vice President",
      department: "Core",
      email: "hunar1502@gmail.com",
      linkedin: "https://www.linkedin.com/in/hunar-aggarwal-ab820427a/",
      imageUrl: "/team/Hunar.jpg",
      order: 3
    },
    {
      name: "Samihan Sharma",
      position: "General Secretary",
      department: "Core",
      email: "samihansharma.2005@gmail.com",
      linkedin: "http://www.linkedin.com/in/samihan-sharma-a0a02a286",
      imageUrl: "/team/Samihan.jpg",
      order: 4
    },
    {
      name: "Saksham Gupta",
      position: "Joint Secretary",
      department: "Core",
      email: "Sakshamgupta_23bt062@dtu.ac.in",
      linkedin: "https://www.linkedin.com/in/saksham-gupta-a6405b272",
      imageUrl: "/team/saksham.jpg",
      order: 5
    },
    {
      name: "Mahim Kamble",
      position: "Treasurer",
      department: "Core",
      email: "kamblemahim76@gmail.com",
      linkedin: "https://www.linkedin.com/in/mahim-kamble-497706252",
      imageUrl: "/team/Mahim.jpg",
      order: 6
    },
    {
      name: "Swayam Dewan",
      position: "Treasurer",
      department: "Core",
      email: "swayamdewan20@gmail.com",
      linkedin: "http://linkedin.com/in/swayam-dewan-30878a29a",
      imageUrl: "/team/swayam.jpg",
      order: 7
    },
    {
      name: "Vannsh Jain",
      position: "Joint Treasurer",
      department: "Core",
      email: "vannshjain_23bt110@dtu.ac.in",
      linkedin: "https://www.linkedin.com/in/vannshjain/",
      imageUrl: "/team/Vansh.JPG",
      order: 8
    }
  ],
  juniorCouncil: [
    { name: "Anushka Sharma", position: "Events Co-Head", department: "Events", imageUrl: "/team/Anu.jpg", linkedin: "https://www.linkedin.com/in/anushka-sharma-177680332", order: 10 },
    { name: "Apeksha Singh", position: "Design Co-Head", department: "Design", imageUrl: "/team/Ape.jpg", linkedin: "https://www.linkedin.com/in/apeksha-singh-a1864531a", order: 11 },
    { name: "Bharti Yadav", position: "Design Co-Head", department: "Design", imageUrl: "/team/Bha.jpg", linkedin: "https://www.linkedin.com/in/bharti-yadav-10970a331", order: 12 },
    { name: "Katyayani Yadav", position: "Events Co-Head", department: "Events", imageUrl: "/team/kat.jpg", linkedin: "https://www.linkedin.com/in/katyayani-yadav-a8a831335", order: 13 },
    { name: "Saba Naaz", position: "Corporate Co-Head", department: "Marketing", imageUrl: "/team/saba.jpg", linkedin: "https://www.linkedin.com/in/saba-naaz-a61369335", order: 14 },
    { name: "Ragya Ranjan", position: "Design Co-Head", department: "Design", imageUrl: "/team/ragya.jpg", linkedin: "https://www.linkedin.com/in/ragya-ranjan-215a04322", order: 15 },
    { name: "Shreya Yadav", position: "Content Co-Head", department: "Content", imageUrl: "/team/Shreya.jpg", linkedin: "https://www.linkedin.com/in/shreya-yadav-bba96530b/", order: 16 },
    { name: "Parth Jeph", position: "Events Co-Head", department: "Events", imageUrl: "/team/parth.jpg", linkedin: "https://www.linkedin.com/in/parth-jeph", order: 17 },
    { name: "Vanshika", position: "Events Co-Head", department: "Events", imageUrl: "/team/van.jpg", linkedin: "https://www.linkedin.com/in/vanshika-dhaka-3b07692b7", order: 18 },
    { name: "Mukund Gupta", position: "Content Co-Head", department: "Content", imageUrl: "/team/Muk.jpg", linkedin: "https://www.linkedin.com/in/mukundgupta7", order: 19 },
    { name: "Hrishit Gupta", position: "Corporate Co-Head", department: "Marketing", imageUrl: "/team/Hris.jpg", linkedin: "https://www.linkedin.com/in/hrishit-gupta-8b801b338", order: 20 },
    { name: "Konica Jindal", position: "Corporate Co-Head", department: "Marketing", imageUrl: "/team/Kon.jpg", linkedin: "https://www.linkedin.com/in/konicajindal", order: 21 },
    { name: "Ojas Bhutani", position: "Corporate Co-Head", department: "Marketing", imageUrl: "/team/bhut.jpg", linkedin: "https://www.linkedin.com/in/ojas-bhutani-4b8372305", order: 22 },
    { name: "Aryaman", position: "Events Co-Head", department: "Events", imageUrl: "/team/Ary.JPG", linkedin: "https://www.linkedin.com/in/aryaman-b-b51585317", order: 23 },
    { name: "Praleen Kaur", position: "Corporate Co-Head", department: "Marketing", imageUrl: "/team/kaur.jpg", linkedin: "https://www.linkedin.com/in/praleen-kaur-a50a71349", order: 24 },
    { name: "Shivam Chaube", position: "Content Co-Head", department: "Content", imageUrl: "/team/Shiv.jpg", linkedin: "https://www.linkedin.com/in/shivam-chaube0608", order: 25 },
    { name: "Nandini", position: "Events Co-Head", department: "Events", imageUrl: "/team/Nan.jpg", linkedin: "https://www.linkedin.com/in/nandinidtu05", order: 26 },
    { name: "Ayushi Pandey", position: "Content Co-Head", department: "Content", imageUrl: "/team/Ayu.jpeg", linkedin: "https://www.linkedin.com/in/ayushi-pandey-9bab26316/", order: 27 }
  ]
};

async function importMembers() {
  try {
    console.log('📋 Starting council members import...\n');

    // Read existing database
    const dbPath = new URL('./db-fallback.json', import.meta.url).pathname.substring(1);
    let db = { councilMembers: [], enquiries: [], settings: {} };
    
    try {
      const data = await fs.readFile(dbPath, 'utf8');
      db = JSON.parse(data);
    } catch (error) {
      console.log('Creating new database file...');
    }

    // Combine senior and junior council
    const allMembers = [...councilData.seniorCouncil, ...councilData.juniorCouncil];

    // Convert to database format
    const membersToImport = allMembers.map((member, index) => ({
      _id: `member_${Date.now()}_${index}`,
      name: member.name,
      position: member.position,
      councilType: member.department === 'Core' ? 'Senior' : 'Junior',
      department: member.department,
      imageUrl: member.imageUrl,
      cloudinaryPublicId: `local_${member.name.toLowerCase().replace(/\s+/g, '_')}`,
      email: member.email || '',
      linkedin: member.linkedin || '',
      order: member.order,
      isActive: true,
      createdAt: new Date().toISOString()
    }));

    // Clear existing members and add new ones
    db.councilMembers = membersToImport;

    // Write to database
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

    console.log('✅ Import Complete!\n');
    console.log(`📊 Statistics:`);
    console.log(`   - Senior Council: ${councilData.seniorCouncil.length} members`);
    console.log(`   - Junior Council: ${councilData.juniorCouncil.length} members`);
    console.log(`   - Total Imported: ${membersToImport.length} members\n`);

    console.log('📦 Members by Department:');
    const byDept = membersToImport.reduce((acc, m) => {
      acc[m.department] = (acc[m.department] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(byDept).forEach(([dept, count]) => {
      console.log(`   - ${dept}: ${count} members`);
    });

    console.log('\n✨ Members are now available in the admin panel!');
    console.log('🌐 Access: http://localhost:5175/admin\n');

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

async function importMembersToMongo() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing from server/.env');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      ...(process.env.MONGODB_DATABASE && { dbName: process.env.MONGODB_DATABASE })
    });

    const allMembers = [...councilData.seniorCouncil, ...councilData.juniorCouncil];
    const operations = allMembers.map((member) => ({
      updateOne: {
        filter: {
          name: member.name,
          position: member.position,
          department: member.department
        },
        update: {
          $setOnInsert: {
            name: member.name,
            position: member.position,
            councilType: member.department === 'Core' ? 'Senior' : 'Junior',
            department: member.department,
            imageUrl: member.imageUrl,
            cloudinaryPublicId: `local_${member.name.toLowerCase().replace(/\s+/g, '_')}`,
            email: member.email || '',
            linkedin: member.linkedin || '',
            order: member.order,
            isActive: true
          }
        },
        upsert: true
      }
    }));

    const result = await CouncilMember.bulkWrite(operations);
    console.log(`✅ MongoDB import complete: ${result.upsertedCount} inserted, ${result.matchedCount} already present.`);
    console.log(`📁 Database: ${mongoose.connection.name}`);
  } finally {
    await mongoose.disconnect();
  }
}

const importTask = process.argv.includes('--mongo') ? importMembersToMongo : importMembers;
importTask().catch((error) => {
  console.error('❌ Import failed:', error.message);
  process.exitCode = 1;
});
