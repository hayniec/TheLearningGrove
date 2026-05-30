import fs from 'fs/promises';
import path from 'path';
import mysql from 'mysql2/promise';
import crypto from 'crypto';

export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Determine connection modes and environment parameters
const isMySQL = process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME;

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Seed Data definition with gradeLevels
const seedData = {
  users: [
    {
      id: "parent-1",
      email: "parent@example.com",
      password: "parent123",
      name: "Sarah Jenkins",
      role: "Parent",
      parentId: null
    },
    {
      id: "student-1",
      email: "billy@example.com",
      password: "student123",
      name: "Billy Jenkins",
      role: "Student",
      parentId: "parent-1"
    },
    {
      id: "student-2",
      email: "emma@example.com",
      password: "student123",
      name: "Emma Jenkins",
      role: "Student",
      parentId: "parent-1"
    },
    {
      id: "moderator-1",
      email: "moderator@example.com",
      password: "moderator123",
      name: "Alice Mod",
      role: "Moderator",
      parentId: null
    }
  ],
  curricula: [
    {
      id: "beast-academy",
      name: "Beast Academy",
      subject: "Math",
      delivery: "online",
      grouping: "grade",
      cost: "$$$",
      rating: 5.0,
      favoritePart: "The graphic-novel style guides make highly advanced concepts fun and approachable.",
      answerKey: "provided",
      methodology: "mastery",
      onlineResources: true,
      selfPaced: true,
      classParticipation: false,
      worldview: "secular",
      videos: true,
      description: "A highly rigorous, comic-book styled math curriculum designed to develop deep problem-solving skills for grades 1-5.",
      gradeLevels: ["1", "2", "3", "4", "5"]
    },
    {
      id: "saxon-math-54",
      name: "Saxon Math 5/4",
      subject: "Math",
      delivery: "printable",
      grouping: "grade",
      cost: "$$",
      rating: 4.2,
      favoritePart: "Incremental lessons ensure student retention through constant practice.",
      answerKey: "provided",
      methodology: "spiral",
      onlineResources: false,
      selfPaced: true,
      classParticipation: false,
      worldview: "nonsecular",
      videos: false,
      description: "An incremental, spiral-based math program focusing on fundamentals, constant review, and structured lessons.",
      gradeLevels: ["4", "5"]
    },
    {
      id: "mystery-science",
      name: "Mystery Science",
      subject: "Science",
      delivery: "online",
      grouping: "grade",
      cost: "$$",
      rating: 4.8,
      favoritePart: "Open-and-go video lessons and simple hands-on worksheets make prep nearly zero.",
      answerKey: "provided",
      methodology: "spiral",
      onlineResources: true,
      selfPaced: true,
      classParticipation: false,
      worldview: "secular",
      videos: true,
      description: "Interactive science lessons categorized by grade level, combining video instruction and easy-to-do physical activities.",
      gradeLevels: ["K", "1", "2", "3", "4", "5"]
    },
    {
      id: "story-of-the-world",
      name: "The Story of the World",
      subject: "History",
      delivery: "consumable",
      grouping: "family",
      cost: "$$",
      rating: 4.5,
      favoritePart: "The narrative format makes history read like a collection of stories rather than a dry textbook.",
      answerKey: "extra",
      methodology: "mastery",
      onlineResources: false,
      selfPaced: true,
      classParticipation: false,
      worldview: "nonsecular",
      videos: false,
      description: "A chronological four-volume world history course covering ancient times through the 20th century, highly popular with classical educators.",
      gradeLevels: ["1", "2", "3", "4", "5", "6", "7", "8"]
    },
    {
      id: "torchlight",
      name: "Torchlight Curriculum",
      subject: "Language Arts",
      delivery: "printable",
      grouping: "family",
      cost: "$$",
      rating: 4.7,
      favoritePart: "Rich literature selections and modern, eclectic approach to science and art history.",
      answerKey: "self-graded",
      methodology: "spiral",
      onlineResources: true,
      selfPaced: true,
      classParticipation: false,
      worldview: "secular",
      videos: true,
      description: "A literature-heavy, secular curriculum focusing on global history, quality books, and child-led exploration.",
      gradeLevels: ["K", "1", "2", "3", "4", "5"]
    },
    {
      id: "christian-light-math",
      name: "CLE sunrise Mathematics",
      subject: "Math",
      delivery: "consumable",
      grouping: "grade",
      cost: "$",
      rating: 4.0,
      favoritePart: "Small, digestible daily booklets ('LightUnits') give kids a sense of accomplishment.",
      answerKey: "provided",
      methodology: "spiral",
      onlineResources: false,
      selfPaced: true,
      classParticipation: false,
      worldview: "nonsecular",
      videos: false,
      description: "A structured, highly spiral textbook/workbook system with strong review and clear focus on arithmetic skills.",
      gradeLevels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
    },
    {
      id: "blossom-and-root",
      name: "Blossom & Root Science",
      subject: "Science",
      delivery: "printable",
      grouping: "family",
      cost: "$",
      rating: 4.9,
      favoritePart: "Nature study modules and beautiful hands-on laboratory journals.",
      answerKey: "self-graded",
      methodology: "mastery",
      onlineResources: true,
      selfPaced: true,
      classParticipation: false,
      worldview: "secular",
      videos: false,
      description: "A creative, nature-focused science curriculum blending books, hands-on labs, and outdoor exploration.",
      gradeLevels: ["K", "1", "2", "3", "4", "5"]
    }
  ],
  fieldtrips: [
    {
      id: "museum-of-science",
      name: "Local Science & Innovation Museum",
      subject: "Science",
      cost: "$$",
      rating: 5.0,
      description: "Interactive exhibits covering physics, engineering, and digital arts. Discounts available for homeschool groups on Tuesdays.",
      location: "Downtown Metro Center",
      gradeRecommendation: "Elementary & Middle School",
      city: "Boston",
      state: "MA",
      zip: "02114",
      websiteUrl: "https://www.mos.org",
      lat: 42.3678,
      lng: -71.0711
    },
    {
      id: "heritage-historical-farm",
      name: "Heritage Pioneer Farm & Homestead",
      subject: "History",
      cost: "$",
      rating: 4.6,
      description: "Active living history farm with blacksmithing, sheep shearing, and butter-churning workshops tailored to school children.",
      location: "East County Meadows",
      gradeRecommendation: "All Grades",
      city: "Austin",
      state: "TX",
      zip: "78754",
      websiteUrl: "https://www.pioneerfarm.org",
      lat: 30.3453,
      lng: -97.6322
    },
    {
      id: "discovery-botanical-gardens",
      name: "Discovery Conservatory & Botanical Gardens",
      subject: "Science",
      cost: "$",
      rating: 4.8,
      description: "Fascinating self-guided tour focusing on greenhouse biomes, native desert plants, and butterfly migrations.",
      location: "Westside Heights",
      gradeRecommendation: "All Grades",
      city: "San Francisco",
      state: "CA",
      zip: "94122",
      websiteUrl: "https://www.sfconservatoryofflowers.org",
      lat: 37.7678,
      lng: -122.4697
    },
    {
      id: "university-observatory",
      name: "Summit University Space Observatory",
      subject: "Science",
      cost: "free",
      rating: 4.9,
      description: "Free public viewing nights every Friday. Professional astronomers host telescope guides for parents and older students.",
      location: "University Hill Observatory",
      gradeRecommendation: "Middle & High School",
      city: "Seattle",
      state: "WA",
      zip: "98195",
      websiteUrl: "https://www.astro.washington.edu",
      lat: 47.6538,
      lng: -122.3078
    }
  ],
  businessads: [
    {
      id: "ad-reading-tutoring",
      owner: "Sarah Jenkins, M.Ed.",
      businessName: "Grove City Phonics & Reading Help",
      description: "Specialized phonics tutoring, reading assessments, and dyslexia support for homeschoolers in grades K-5.",
      category: "Academic Services",
      businessType: "Academic Tutoring",
      contact: "sarah.reads.tutor@example.com",
      link: "http://sarahreadstutoring.example.com"
    },
    {
      id: "ad-music-studio",
      owner: "Emily Clark",
      businessName: "Oak Tree Piano & Violin Studio",
      description: "Private music lessons with flexible daytime slots for homeschooling families. Over 10 years teaching classical piano and violin.",
      category: "Creative & Extracurriculars",
      businessType: "Music Lessons",
      contact: "emily.clark.music@example.com",
      link: "http://oaktreeviolins.example.com"
    },
    {
      id: "ad-nature-coop",
      owner: "Jessica Vance",
      businessName: "Wildwood Nature Explorers Club",
      description: "Weekly outdoor co-op gatherings focusing on survival skills, trail identification, and botanical studies for kids age 6-12.",
      category: "Creative & Extracurriculars",
      businessType: "Co-ops & Groups",
      contact: "wildwood.nature.explorers@example.com",
      link: "http://wildwoodnatureexplorers.example.com"
    },
    {
      id: "ad-planners",
      owner: "Amanda Rossi",
      businessName: "Creative Hands Planners & Prints",
      description: "Customizable physical homeschool organizers, record books, and student journals. Hand-bound and customized to your school year.",
      category: "Cottage Industries",
      businessType: "Planners & Paper Goods",
      contact: "amanda.rossi.crafts@example.com",
      link: "http://creativehandsplanners.example.com"
    },
    {
      id: "ad-bakery",
      owner: "Mary Harrison",
      businessName: "The Homestead Bakery & Café",
      description: "A family-owned bakery and café in the heart of downtown. Fresh sourdough bread, pastries, and artisanal coffee. 10% discount for homeschool families on co-op days.",
      category: "Storefronts",
      businessType: "Baked Goods",
      contact: "hello@homesteadbakery.example.com",
      link: ""
    },
    {
      id: "ad-it-support",
      owner: "David Vance",
      businessName: "Oak Tree Tech & IT Support",
      description: "On-site and remote IT support, computer repair, and software help for homeschooling families and small businesses.",
      category: "Cottage Industries",
      businessType: "IT Services",
      contact: "support@oaktreeit.example.com",
      link: ""
    },
    {
      id: "ad-consulting",
      owner: "Dr. Rebecca Hall",
      businessName: "Lighthouse Homeschool Consulting",
      description: "Personalized homeschool consulting, curriculum matching, and high school transcript evaluations to help you navigate your journey with confidence.",
      category: "Academic Services",
      businessType: "Consulting",
      contact: "rebecca@lighthouseconsulting.example.com",
      link: ""
    }
  ],
  resources: [
    {
      id: "res-khan-academy",
      name: "Khan Academy",
      subject: "All Subjects",
      cost: "free",
      link: "https://www.khanacademy.org",
      description: "High-quality, self-paced video lectures and quizzes covering K-12 subjects, heavily used for math and SAT prep.",
      type: "website"
    },
    {
      id: "res-duolingo",
      name: "Duolingo",
      subject: "Foreign Language",
      cost: "free",
      link: "https://www.duolingo.com",
      description: "Gamified vocabulary and speech lessons covering Spanish, French, German, Latin, and 30+ other languages.",
      type: "website"
    },
    {
      id: "res-crash-course",
      name: "Crash Course (YouTube Channel)",
      subject: "History & Science",
      cost: "free",
      link: "https://www.youtube.com/user/crashcourse",
      description: "Fast-paced, animated educational video series hosted by John and Hank Green. Excellent visual supplement for middle & high schoolers.",
      type: "video"
    },
    {
      id: "res-starfall",
      name: "Starfall Education",
      subject: "Language Arts",
      cost: "low-cost",
      link: "https://www.starfall.com",
      description: "Interactive phonics games and reading courses designed specifically for preschool, kindergarten, and early elementary.",
      type: "website"
    },
    {
      id: "res-prodigy",
      name: "Prodigy Math Game",
      subject: "Math",
      cost: "low-cost",
      link: "https://www.prodigygame.com",
      description: "Fantasy battle game that uses curriculum-aligned math problems as active mechanics. Keeps younger students motivated to practice facts.",
      type: "website"
    },
    {
      id: "res-scishow-kids",
      name: "SciShow Kids (YouTube Channel)",
      subject: "Science",
      cost: "free",
      link: "https://www.youtube.com/c/scishowkids",
      description: "Fun, curiosity-driven videos explaining complex scientific questions for younger learners (grades K-3). Hosted by Jessi and Squeaks.",
      type: "video"
    }
  ],
  posts: [
    {
      id: "post-1",
      author: "Sarah Jenkins",
      title: "Welcome to the Grove Community!",
      content: "This is a warm, welcoming space for homeschooling parents to share advice, ask questions, coordinate meetups, and encourage one another. Feel free to introduce yourself!",
      category: "General",
      timestamp: "2026-05-30T10:00:00.000Z"
    },
    {
      id: "post-2",
      author: "Michael Vance",
      title: "Co-op curriculum suggestions for 3rd grade?",
      content: "We are forming a small neighborhood co-op for science experiments next semester. Does anyone have experience using Blossom & Root in a group setting, or suggestions for open-and-go kits?",
      category: "Questions",
      timestamp: "2026-05-30T11:15:00.000Z"
    },
    {
      id: "post-3",
      author: "Emily Clark",
      title: "Park Day Meetup this Friday",
      content: "Let's meet at Oak Tree Park at 1:00 PM this Friday for a casual playdate and parent chat. Kids of all ages are welcome! I'll bring some popsicles.",
      category: "Meetups",
      timestamp: "2026-05-30T12:30:00.000Z"
    }
  ]
};

// --- DATA ACCESS LAYER IMPLEMENTATION ---
let pool = null;

async function getDB() {
  const dbPath = path.resolve('database.json');
  if (!isMySQL) {
    // Local Mode: JSON DB Handling
    try {
      await fs.access(dbPath);
    } catch {
      // Create and Seed database.json
      const seeded = {
        ...seedData,
        users: seedData.users.map(u => ({
          ...u,
          password: hashPassword(u.password)
        })),
        resources: seedData.resources.map(r => ({
          ...r,
          userId: r.userId || 'parent-1',
          approved: r.approved !== undefined ? r.approved : true
        })),
        curricula: seedData.curricula.map(c => ({ ...c, userId: c.userId || 'parent-1' })),
        fieldtrips: seedData.fieldtrips.map(f => ({ ...f, userId: f.userId || 'parent-1' })),
        businessads: seedData.businessads.map(b => ({ ...b, userId: b.userId || 'parent-1' })),
        posts: seedData.posts.map(p => ({ ...p, userId: p.userId || 'parent-1' }))
      };
      await fs.writeFile(dbPath, JSON.stringify(seeded, null, 2), 'utf-8');
    }
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } else {
    // MySQL Mode
    if (!pool) {
      pool = mysql.createPool(dbConfig);
      await initializeMySQLTables();
    }
    return pool;
  }
}

async function saveLocalDB(data) {
  const dbPath = path.resolve('database.json');
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

async function initializeMySQLTables() {
  try {
    // 0. Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL,
        parentId VARCHAR(100),
        FOREIGN KEY (parentId) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // 1. Curricula Table with gradeLevels column
    await pool.query(`
      CREATE TABLE IF NOT EXISTS curricula (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        subject VARCHAR(100) NOT NULL,
        delivery VARCHAR(50) NOT NULL,
        grouping VARCHAR(50) NOT NULL,
        cost VARCHAR(10) NOT NULL,
        rating FLOAT NOT NULL,
        favoritePart TEXT,
        answerKey VARCHAR(50) NOT NULL,
        methodology VARCHAR(50) NOT NULL,
        onlineResources BOOLEAN NOT NULL,
        selfPaced BOOLEAN NOT NULL,
        classParticipation BOOLEAN NOT NULL,
        worldview VARCHAR(50) NOT NULL,
        videos BOOLEAN NOT NULL,
        description TEXT,
        gradeLevels VARCHAR(255) DEFAULT '',
        userId VARCHAR(100) DEFAULT 'parent-1'
      )
    `);

    // 2. Field Trips Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fieldtrips (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        subject VARCHAR(100) NOT NULL,
        cost VARCHAR(10) NOT NULL,
        rating FLOAT NOT NULL,
        description TEXT,
        location VARCHAR(255),
        gradeRecommendation VARCHAR(100),
        city VARCHAR(100),
        state VARCHAR(100),
        zip VARCHAR(20),
        websiteUrl VARCHAR(255),
        lat DOUBLE,
        lng DOUBLE,
        userId VARCHAR(100) DEFAULT 'parent-1'
      )
    `);

    // 3. Business Ads Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS businessads (
        id VARCHAR(100) PRIMARY KEY,
        owner VARCHAR(255) NOT NULL,
        businessName VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        contact VARCHAR(100),
        link VARCHAR(255),
        businessType VARCHAR(100) DEFAULT '',
        userId VARCHAR(100) DEFAULT 'parent-1'
      )
    `);

    // 4. Resources Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS resources (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        subject VARCHAR(100) NOT NULL,
        cost VARCHAR(10) NOT NULL,
        link VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL,
        userId VARCHAR(100) DEFAULT 'parent-1',
        approved TINYINT DEFAULT 1
      )
    `);

    // 5. Community Posts Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(100) PRIMARY KEY,
        author VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        timestamp VARCHAR(100) NOT NULL,
        userId VARCHAR(100) DEFAULT 'parent-1'
      )
    `);

    // Check if tables are empty, and seed if they are
    const [userRows] = await pool.query("SELECT COUNT(*) as count FROM users");
    if (userRows[0].count === 0) {
      console.log("Seeding users to MySQL...");
      for (const item of seedData.users) {
        await pool.query(
          "INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)",
          [item.id, item.email, hashPassword(item.password), item.name, item.role, item.parentId || null]
        );
      }
    }

    const [currRows] = await pool.query("SELECT COUNT(*) as count FROM curricula");
    if (currRows[0].count === 0) {
      console.log("Seeding curricula to MySQL...");
      for (const item of seedData.curricula) {
        await pool.query(
          "INSERT INTO curricula VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [item.id, item.name, item.subject, item.delivery, item.grouping, item.cost, item.rating, item.favoritePart, item.answerKey, item.methodology, item.onlineResources, item.selfPaced, item.classParticipation, item.worldview, item.videos, item.description, item.gradeLevels ? item.gradeLevels.join(',') : '', item.userId || 'parent-1']
        );
      }
    }

    const [tripRows] = await pool.query("SELECT COUNT(*) as count FROM fieldtrips");
    if (tripRows[0].count === 0) {
      console.log("Seeding fieldtrips to MySQL...");
      for (const item of seedData.fieldtrips) {
        await pool.query(
          "INSERT INTO fieldtrips VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [item.id, item.name, item.subject, item.cost, item.rating, item.description, item.location, item.gradeRecommendation, item.city || '', item.state || '', item.zip || '', item.websiteUrl || '', item.lat || null, item.lng || null, item.userId || 'parent-1']
        );
      }
    }

    const [adRows] = await pool.query("SELECT COUNT(*) as count FROM businessads");
    if (adRows[0].count === 0) {
      console.log("Seeding businessads to MySQL...");
      for (const item of seedData.businessads) {
        await pool.query(
          "INSERT INTO businessads VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [item.id, item.owner, item.businessName, item.description, item.category, item.contact, item.link, item.businessType || '', item.userId || 'parent-1']
        );
      }
    }

    const [resRows] = await pool.query("SELECT COUNT(*) as count FROM resources");
    if (resRows[0].count === 0) {
      console.log("Seeding resources to MySQL...");
      for (const item of seedData.resources) {
        await pool.query(
          "INSERT INTO resources VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [item.id, item.name, item.subject, item.cost, item.link, item.description, item.type, item.userId || 'parent-1', item.approved !== undefined ? (item.approved ? 1 : 0) : 1]
        );
      }
    }

    const [postRows] = await pool.query("SELECT COUNT(*) as count FROM posts");
    if (postRows[0].count === 0) {
      console.log("Seeding posts to MySQL...");
      for (const item of seedData.posts) {
        await pool.query(
          "INSERT INTO posts VALUES (?, ?, ?, ?, ?, ?, ?)",
          [item.id, item.author, item.title, item.content, item.category, item.timestamp, item.userId || 'parent-1']
        );
      }
    }

  } catch (err) {
    console.error("MySQL Table initialization / seeding error: ", err);
  }
}

export async function getPosts() {
  const db = await getDB();
  if (!isMySQL) {
    return db.posts || [];
  } else {
    const [rows] = await db.query("SELECT * FROM posts ORDER BY timestamp DESC");
    return rows;
  }
}

export async function addPost(item) {
  const db = await getDB();
  const id = 'post-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000).toString();
  const newItem = { 
    ...item, 
    id, 
    timestamp: new Date().toISOString(),
    userId: item.userId || 'parent-1'
  };

  if (!isMySQL) {
    if (!db.posts) db.posts = [];
    db.posts.push(newItem);
    await saveLocalDB(db);
    return newItem;
  } else {
    await db.query(
      "INSERT INTO posts VALUES (?, ?, ?, ?, ?, ?, ?)",
      [newItem.id, newItem.author, newItem.title, newItem.content, newItem.category, newItem.timestamp, newItem.userId]
    );
    return newItem;
  }
}

// --- PUBLIC DATABASE INTERACTION API ---

export async function getCurricula() {
  const db = await getDB();
  if (!isMySQL) {
    return db.curricula;
  } else {
    const [rows] = await db.query("SELECT * FROM curricula");
    // Convert boolean representation and split string gradeLevels
    return rows.map(r => ({
      ...r,
      onlineResources: !!r.onlineResources,
      selfPaced: !!r.selfPaced,
      classParticipation: !!r.classParticipation,
      videos: !!r.videos,
      gradeLevels: r.gradeLevels ? r.gradeLevels.split(',') : []
    }));
  }
}

export async function addCurriculum(item) {
  const db = await getDB();
  const id = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
  const newItem = { ...item, id, userId: item.userId || 'parent-1' };

  if (!isMySQL) {
    db.curricula.push(newItem);
    await saveLocalDB(db);
    return newItem;
  } else {
    await db.query(
      "INSERT INTO curricula VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [newItem.id, newItem.name, newItem.subject, newItem.delivery, newItem.grouping, newItem.cost, newItem.rating, newItem.favoritePart, newItem.answerKey, newItem.methodology, newItem.onlineResources ? 1 : 0, newItem.selfPaced ? 1 : 0, newItem.classParticipation ? 1 : 0, newItem.worldview, newItem.videos ? 1 : 0, newItem.description, newItem.gradeLevels ? newItem.gradeLevels.join(',') : '', newItem.userId]
    );
    return newItem;
  }
}

export async function getFieldTrips() {
  const db = await getDB();
  if (!isMySQL) {
    return db.fieldtrips;
  } else {
    const [rows] = await db.query("SELECT * FROM fieldtrips");
    return rows;
  }
}

export async function addFieldTrip(item) {
  const db = await getDB();
  const id = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
  const newItem = { ...item, id, userId: item.userId || 'parent-1' };

  if (!isMySQL) {
    db.fieldtrips.push(newItem);
    await saveLocalDB(db);
    return newItem;
  } else {
    await db.query(
      "INSERT INTO fieldtrips VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [newItem.id, newItem.name, newItem.subject, newItem.cost, newItem.rating, newItem.description, newItem.location, newItem.gradeRecommendation, newItem.city || '', newItem.state || '', newItem.zip || '', newItem.websiteUrl || '', newItem.lat || null, newItem.lng || null, newItem.userId]
    );
    return newItem;
  }
}

export async function getBusinessAds() {
  const db = await getDB();
  if (!isMySQL) {
    return db.businessads;
  } else {
    const [rows] = await db.query("SELECT * FROM businessads");
    return rows;
  }
}

export async function addBusinessAd(item) {
  const db = await getDB();
  const id = item.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
  const newItem = { ...item, id, userId: item.userId || 'parent-1' };

  if (!isMySQL) {
    db.businessads.push(newItem);
    await saveLocalDB(db);
    return newItem;
  } else {
    await db.query(
      "INSERT INTO businessads VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [newItem.id, newItem.owner, newItem.businessName, newItem.description, newItem.category, newItem.contact, newItem.link, newItem.businessType || '', newItem.userId]
    );
    return newItem;
  }
}

export async function getResources() {
  const db = await getDB();
  if (!isMySQL) {
    return (db.resources || []).filter(r => r.approved);
  } else {
    const [rows] = await db.query("SELECT * FROM resources WHERE approved = 1");
    return rows;
  }
}

export async function addResource(item) {
  const db = await getDB();
  const id = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
  const newItem = { 
    ...item, 
    id, 
    userId: item.userId || 'parent-1', 
    approved: item.approved !== undefined ? item.approved : false
  };

  if (!isMySQL) {
    db.resources.push(newItem);
    await saveLocalDB(db);
    return newItem;
  } else {
    await db.query(
      "INSERT INTO resources VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [newItem.id, newItem.name, newItem.subject, newItem.cost, newItem.link, newItem.description, newItem.type, newItem.userId, newItem.approved ? 1 : 0]
    );
    return newItem;
  }
}

export async function getUserByEmail(email) {
  const db = await getDB();
  if (!isMySQL) {
    if (!db.users) db.users = [];
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  } else {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0] || null;
  }
}

export async function createUser(user) {
  const db = await getDB();
  const id = 'user-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000).toString();
  const newUser = {
    ...user,
    id,
    password: hashPassword(user.password),
    parentId: user.parentId || null
  };

  if (!isMySQL) {
    if (!db.users) db.users = [];
    db.users.push(newUser);
    await saveLocalDB(db);
    return newUser;
  } else {
    await db.query(
      "INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)",
      [newUser.id, newUser.email, newUser.password, newUser.name, newUser.role, newUser.parentId]
    );
    return newUser;
  }
}

export async function getSubUsers(parentId) {
  const db = await getDB();
  if (!isMySQL) {
    if (!db.users) db.users = [];
    return db.users.filter(u => u.parentId === parentId);
  } else {
    const [rows] = await db.query("SELECT * FROM users WHERE parentId = ?", [parentId]);
    return rows;
  }
}

export async function createSubUser(parentId, subUser) {
  const db = await getDB();
  const id = 'user-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000).toString();
  const newUser = {
    ...subUser,
    id,
    password: hashPassword(subUser.password),
    parentId: parentId
  };

  if (!isMySQL) {
    if (!db.users) db.users = [];
    db.users.push(newUser);
    await saveLocalDB(db);
    return newUser;
  } else {
    await db.query(
      "INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)",
      [newUser.id, newUser.email, newUser.password, newUser.name, newUser.role, newUser.parentId]
    );
    return newUser;
  }
}

export async function getPendingResources() {
  const db = await getDB();
  if (!isMySQL) {
    if (!db.resources) db.resources = [];
    return db.resources.filter(r => !r.approved);
  } else {
    const [rows] = await db.query("SELECT * FROM resources WHERE approved = 0");
    return rows;
  }
}

export async function approveResource(resourceId) {
  const db = await getDB();
  if (!isMySQL) {
    if (!db.resources) db.resources = [];
    const res = db.resources.find(r => r.id === resourceId);
    if (res) {
      res.approved = true;
      await saveLocalDB(db);
      return res;
    }
    return null;
  } else {
    await db.query("UPDATE resources SET approved = 1 WHERE id = ?", [resourceId]);
    const [rows] = await db.query("SELECT * FROM resources WHERE id = ?", [resourceId]);
    return rows[0] || null;
  }
}

export async function rejectResource(resourceId) {
  const db = await getDB();
  if (!isMySQL) {
    if (!db.resources) db.resources = [];
    const index = db.resources.findIndex(r => r.id === resourceId);
    if (index !== -1) {
      const removed = db.resources.splice(index, 1)[0];
      await saveLocalDB(db);
      return removed;
    }
    return null;
  } else {
    const [rows] = await db.query("SELECT * FROM resources WHERE id = ?", [resourceId]);
    await db.query("DELETE FROM resources WHERE id = ?", [resourceId]);
    return rows[0] || null;
  }
}
