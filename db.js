import fs from 'fs/promises';
import path from 'path';
import mysql from 'mysql2/promise';

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
      category: "Tutoring & Classes",
      contact: "sarah.reads.tutor@example.com",
      link: "http://sarahreadstutoring.example.com"
    },
    {
      id: "ad-music-studio",
      owner: "Emily Clark",
      businessName: "Oak Tree Piano & Violin Studio",
      description: "Private music lessons with flexible daytime slots for homeschooling families. Over 10 years teaching classical piano and violin.",
      category: "Extracurriculars",
      contact: "emily.clark.music@example.com",
      link: "http://oaktreeviolins.example.com"
    },
    {
      id: "ad-nature-coop",
      owner: "Jessica Vance",
      businessName: "Wildwood Nature Explorers Club",
      description: "Weekly outdoor co-op gatherings focusing on survival skills, trail identification, and botanical studies for kids age 6-12.",
      category: "Co-ops & Groups",
      contact: "wildwood.nature.explorers@example.com",
      link: "http://wildwoodnatureexplorers.example.com"
    },
    {
      id: "ad-planners",
      owner: "Amanda Rossi",
      businessName: "Creative Hands Planners & Prints",
      description: "Customizable physical homeschool organizers, record books, and student journals. Hand-bound and customized to your school year.",
      category: "Services & Products",
      contact: "amanda.rossi.crafts@example.com",
      link: "http://creativehandsplanners.example.com"
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
      await fs.writeFile(dbPath, JSON.stringify(seedData, null, 2), 'utf-8');
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
        gradeLevels VARCHAR(255) DEFAULT ''
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
        lng DOUBLE
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
        link VARCHAR(255)
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
        type VARCHAR(50) NOT NULL
      )
    `);

    // Check if tables are empty, and seed if they are
    const [currRows] = await pool.query("SELECT COUNT(*) as count FROM curricula");
    if (currRows[0].count === 0) {
      console.log("Seeding curricula to MySQL...");
      for (const item of seedData.curricula) {
        await pool.query(
          "INSERT INTO curricula VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [item.id, item.name, item.subject, item.delivery, item.grouping, item.cost, item.rating, item.favoritePart, item.answerKey, item.methodology, item.onlineResources, item.selfPaced, item.classParticipation, item.worldview, item.videos, item.description, item.gradeLevels ? item.gradeLevels.join(',') : '']
        );
      }
    }

    const [tripRows] = await pool.query("SELECT COUNT(*) as count FROM fieldtrips");
    if (tripRows[0].count === 0) {
      console.log("Seeding fieldtrips to MySQL...");
      for (const item of seedData.fieldtrips) {
        await pool.query(
          "INSERT INTO fieldtrips VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [item.id, item.name, item.subject, item.cost, item.rating, item.description, item.location, item.gradeRecommendation, item.city || '', item.state || '', item.zip || '', item.websiteUrl || '', item.lat || null, item.lng || null]
        );
      }
    }

    const [adRows] = await pool.query("SELECT COUNT(*) as count FROM businessads");
    if (adRows[0].count === 0) {
      console.log("Seeding businessads to MySQL...");
      for (const item of seedData.businessads) {
        await pool.query(
          "INSERT INTO businessads VALUES (?, ?, ?, ?, ?, ?, ?)",
          [item.id, item.owner, item.businessName, item.description, item.category, item.contact, item.link]
        );
      }
    }

    const [resRows] = await pool.query("SELECT COUNT(*) as count FROM resources");
    if (resRows[0].count === 0) {
      console.log("Seeding resources to MySQL...");
      for (const item of seedData.resources) {
        await pool.query(
          "INSERT INTO resources VALUES (?, ?, ?, ?, ?, ?, ?)",
          [item.id, item.name, item.subject, item.cost, item.link, item.description, item.type]
        );
      }
    }

  } catch (err) {
    console.error("MySQL Table initialization / seeding error: ", err);
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
  const newItem = { ...item, id };

  if (!isMySQL) {
    db.curricula.push(newItem);
    await saveLocalDB(db);
    return newItem;
  } else {
    await db.query(
      "INSERT INTO curricula VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [newItem.id, newItem.name, newItem.subject, newItem.delivery, newItem.grouping, newItem.cost, newItem.rating, newItem.favoritePart, newItem.answerKey, newItem.methodology, newItem.onlineResources ? 1 : 0, newItem.selfPaced ? 1 : 0, newItem.classParticipation ? 1 : 0, newItem.worldview, newItem.videos ? 1 : 0, newItem.description, newItem.gradeLevels ? newItem.gradeLevels.join(',') : '']
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
  const newItem = { ...item, id };

  if (!isMySQL) {
    db.fieldtrips.push(newItem);
    await saveLocalDB(db);
    return newItem;
  } else {
    await db.query(
      "INSERT INTO fieldtrips VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [newItem.id, newItem.name, newItem.subject, newItem.cost, newItem.rating, newItem.description, newItem.location, newItem.gradeRecommendation, newItem.city || '', newItem.state || '', newItem.zip || '', newItem.websiteUrl || '', newItem.lat || null, newItem.lng || null]
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
  const newItem = { ...item, id };

  if (!isMySQL) {
    db.businessads.push(newItem);
    await saveLocalDB(db);
    return newItem;
  } else {
    await db.query(
      "INSERT INTO businessads VALUES (?, ?, ?, ?, ?, ?, ?)",
      [newItem.id, newItem.owner, newItem.businessName, newItem.description, newItem.category, newItem.contact, newItem.link]
    );
    return newItem;
  }
}

export async function getResources() {
  const db = await getDB();
  if (!isMySQL) {
    return db.resources;
  } else {
    const [rows] = await db.query("SELECT * FROM resources");
    return rows;
  }
}

export async function addResource(item) {
  const db = await getDB();
  const id = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
  const newItem = { ...item, id };

  if (!isMySQL) {
    db.resources.push(newItem);
    await saveLocalDB(db);
    return newItem;
  } else {
    await db.query(
      "INSERT INTO resources VALUES (?, ?, ?, ?, ?, ?, ?)",
      [newItem.id, newItem.name, newItem.subject, newItem.cost, newItem.link, newItem.description, newItem.type]
    );
    return newItem;
  }
}
