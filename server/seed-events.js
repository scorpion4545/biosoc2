import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import Event from './models/Event.js';

dotenv.config();

const pastEventsSeed = [
  {
    title: "Biotech Synergy",
    date: "February 15, 2025",
    category: "Conference",
    type: "past",
    description: "Our flagship technology conference featuring industry leaders and innovative workshops.",
    longDescription: "Biotech Synergy brought together leading researchers, industry professionals, and students for a day of cutting-edge discussions and hands-on workshops. The event featured keynote speeches from renowned experts, interactive panel discussions, and networking opportunities.",
    location: "Main Auditorium, DTU",
    attendees: 1200,
    coverImage: "/team/BS.jpeg",
    images: [
      { url: "/team/BS.jpeg", caption: "Opening ceremony with keynote speaker" },
      { url: "/team/BT.jpg", caption: "Interactive workshop session" },
      { url: "/team/LR.jpg", caption: "Networking break" },
      { url: "/team/BS.jpeg", caption: "Panel discussion" }
    ],
    highlights: [
      "Keynote speech by Dr. Sarah Chen on CRISPR applications",
      "Interactive workshop on biotechnology techniques",
      "Student research poster presentations",
      "Industry networking session"
    ],
    order: 1
  },
  {
    title: "Biothon",
    date: "February 18, 2025",
    category: "Hackathon",
    type: "past",
    description: "A 4-hour hackathon where teams collaborated to solve real-world problems with creative solutions.",
    longDescription: "Biothon brought together innovative minds for an intensive 4-hour hackathon focused on biotechnology solutions. Teams worked on real-world challenges, from medical diagnostics to environmental conservation.",
    location: "Computer Centre, DTU",
    attendees: 350,
    coverImage: "/team/BT.jpg",
    images: [
      { url: "/team/BT.jpg", caption: "Teams working on their projects" },
      { url: "/team/BS.jpeg", caption: "Project presentations" },
      { url: "/team/LR.jpg", caption: "Winners announcement" },
      { url: "/team/BT.jpg", caption: "Group photo" }
    ],
    highlights: [
      "12 teams participated in the challenge",
      "Projects focused on sustainable biotechnology",
      "Live mentoring sessions",
      "Prizes worth $5000 distributed"
    ],
    order: 2
  },
  {
    title: "Lab Rats",
    date: "February 16, 2025",
    category: "Workshop",
    type: "past",
    description: "Three days of hands-on design workshops focused on UX/UI principles and implementation.",
    longDescription: "Lab Rats workshop series provided hands-on experience in biotechnology lab techniques and experimental design. Participants learned essential skills through practical demonstrations and guided exercises.",
    location: "Biotech Lab 2, DTU",
    attendees: 180,
    coverImage: "/team/LR.jpg",
    images: [
      { url: "/team/LR.jpg", caption: "Workshop in progress" },
      { url: "/team/BS.jpeg", caption: "Lab demonstration" },
      { url: "/team/BT.jpg", caption: "Group activity" },
      { url: "/team/LR.jpg", caption: "Final presentation" }
    ],
    highlights: [
      "Hands-on laboratory techniques",
      "Safety protocols and best practices",
      "Data analysis workshops",
      "Research methodology training"
    ],
    order: 3
  },
  {
    title: "BioTech Workshop",
    date: "January 25, 2025",
    category: "Workshop",
    type: "past",
    description: "Intensive workshop on advanced biotechnology techniques and laboratory practices.",
    longDescription: "An intensive one-day workshop covering advanced biotechnology techniques and modern laboratory practices. Experts shared insights on cutting-edge methodologies and emerging trends.",
    location: "Seminar Hall, DTU",
    attendees: 150,
    coverImage: "/team/BS.jpeg",
    images: [
      { url: "/team/BS.jpeg", caption: "Workshop introduction" },
      { url: "/team/BT.jpg", caption: "Practical session" },
      { url: "/team/LR.jpg", caption: "Equipment training" },
      { url: "/team/BS.jpeg", caption: "Closing ceremony" }
    ],
    highlights: [
      "Advanced biotechnology techniques",
      "Modern laboratory equipment training",
      "Industry best practices",
      "Networking with experts"
    ],
    order: 4
  },
  {
    title: "Research Symposium",
    date: "January 10, 2025",
    category: "Symposium",
    type: "past",
    description: "Student research presentations and networking with industry professionals.",
    longDescription: "The Research Symposium brought together students and industry professionals for a day of knowledge sharing and networking. Students presented their research findings to industry experts.",
    location: "DTU Quadrangle",
    attendees: 200,
    coverImage: "/team/BT.jpg",
    images: [
      { url: "/team/BT.jpg", caption: "Symposium opening" },
      { url: "/team/BS.jpeg", caption: "Poster presentations" },
      { url: "/team/LR.jpg", caption: "Panel session" },
      { url: "/team/BT.jpg", caption: "Awards ceremony" }
    ],
    highlights: [
      "20+ student poster presentations",
      "Industry expert evaluations",
      "Best paper awards",
      "Publication opportunities"
    ],
    order: 5
  }
];

const upcomingEventsSeed = [
  {
    title: "BioQuest '25",
    date: "February 20-22, 2025",
    category: "Annual Tech Fest",
    type: "upcoming",
    description: "The premier annual biotechnology festival featuring competitions, guest lectures, and paper presentations.",
    longDescription: "BioQuest '25 is the premier flagship festival organized by BioSoc-DTU bringing together students, scientists, and industry leaders nationwide.",
    location: "Main Auditorium, DTU",
    attendees: 1500,
    coverImage: "/team/1a.jpg",
    speakers: [
      { name: "Dr. Alena Vance", role: "CRISPR Lead Scientist" },
      { name: "Prof. Rajesh Kumar", role: "Bioprocess Engineer" }
    ],
    schedule: [
      { time: "09:30 AM", activity: "Inauguration Ceremony" },
      { time: "11:00 AM", activity: "Keynote Address on Synthetic Bio" },
      { time: "02:00 PM", activity: "Poster Presentation Rounds" }
    ],
    order: 1
  },
  {
    title: "GenAI in Healthcare",
    date: "March 05, 2025",
    category: "Workshop",
    type: "upcoming",
    description: "Hands-on workshop exploring machine learning and computational bio models in modern medicine.",
    longDescription: "Discover how AI-driven drug discovery algorithms and computational biology are transforming modern medical therapeutics.",
    location: "Biotech Lab 1, DTU",
    attendees: 250,
    coverImage: "/team/3c.jpg",
    speakers: [
      { name: "Siddharth Mehta", role: "Bioinformatics Specialist" }
    ],
    schedule: [
      { time: "10:00 AM", activity: "Introduction to Computational Biology" },
      { time: "01:30 PM", activity: "Hands-on Python & PyTorch Lab" }
    ],
    order: 2
  },
  {
    title: "Bio-Startup Pitch",
    date: "March 15, 2025",
    category: "Competition",
    type: "upcoming",
    description: "Pitch competition for biotech innovations with seed funding and mentorship opportunities.",
    longDescription: "An incubator showcase for budding biotech entrepreneurs to pitch their solutions to venture capitalists and faculty mentors.",
    location: "Incubation Centre, DTU",
    attendees: 400,
    coverImage: "/team/2b.jpg",
    speakers: [
      { name: "Vikram Malhotra", role: "Venture Partner at BioFund" }
    ],
    schedule: [
      { time: "11:00 AM", activity: "Startup Pitch Deck Rounds" },
      { time: "03:00 PM", activity: "Investor Q&A & Awarding" }
    ],
    order: 3
  }
];

const seedEvents = async () => {
  try {
    await connectDB();
    console.log('🌱 Seeding Event Database...');

    // Clear existing events if desired
    await Event.deleteMany({});
    console.log('🧹 Existing events cleared.');

    const createdPast = await Event.insertMany(pastEventsSeed);
    const createdUpcoming = await Event.insertMany(upcomingEventsSeed);

    console.log(`✅ Successfully seeded ${createdPast.length} past events and ${createdUpcoming.length} upcoming events!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    process.exit(1);
  }
};

seedEvents();
