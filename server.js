import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();
import {
  getCurricula,
  addCurriculum,
  getCurriculumReviews,
  addCurriculumReview,
  getFieldTrips,
  addFieldTrip,
  getBusinessAds,
  addBusinessAd,
  getResources,
  addResource,
  getPosts,
  addPost,
  getUserByEmail,
  createUser,
  getSubUsers,
  createSubUser,
  getPendingResources,
  approveResource,
  rejectResource,
  hashPassword
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and body parsing
app.use(cors());
app.use(express.json());

// API Route Handlers
app.get('/api/curricula', async (req, res) => {
  try {
    const list = await getCurricula();
    res.json(list);
  } catch (err) {
    console.error("GET /api/curricula error: ", err);
    res.status(500).json({ error: "Failed to fetch curricula" });
  }
});

app.post('/api/curricula', async (req, res) => {
  try {
    const list = await getCurricula();
    const duplicate = list.find(c => c.name.toLowerCase() === req.body.name.toLowerCase());
    if (duplicate) {
      return res.status(400).json({ error: "A curriculum with this name already exists. Please find it in the list and add your review there." });
    }
    const newItem = await addCurriculum(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    console.error("POST /api/curricula error: ", err);
    res.status(500).json({ error: "Failed to save curriculum review" });
  }
});

app.get('/api/curricula/:id/reviews', async (req, res) => {
  try {
    const reviews = await getCurriculumReviews(req.params.id);
    res.json(reviews);
  } catch (err) {
    console.error("GET /api/curricula/:id/reviews error: ", err);
    res.status(500).json({ error: "Failed to fetch curriculum reviews" });
  }
});

app.post('/api/curricula/:id/reviews', async (req, res) => {
  try {
    const review = await addCurriculumReview(req.params.id, req.body);
    res.status(201).json(review);
  } catch (err) {
    console.error("POST /api/curricula/:id/reviews error: ", err);
    res.status(500).json({ error: "Failed to add curriculum review" });
  }
});

app.get('/api/fieldtrips', async (req, res) => {
  try {
    const list = await getFieldTrips();
    res.json(list);
  } catch (err) {
    console.error("GET /api/fieldtrips error: ", err);
    res.status(500).json({ error: "Failed to fetch field trips" });
  }
});

app.post('/api/fieldtrips', async (req, res) => {
  try {
    const newItem = await addFieldTrip(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    console.error("POST /api/fieldtrips error: ", err);
    res.status(500).json({ error: "Failed to save field trip" });
  }
});

app.get('/api/businessads', async (req, res) => {
  try {
    const list = await getBusinessAds();
    res.json(list);
  } catch (err) {
    console.error("GET /api/businessads error: ", err);
    res.status(500).json({ error: "Failed to fetch business directory" });
  }
});

app.post('/api/businessads', async (req, res) => {
  try {
    const newItem = await addBusinessAd(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    console.error("POST /api/businessads error: ", err);
    res.status(500).json({ error: "Failed to save business listing" });
  }
});

app.get('/api/resources', async (req, res) => {
  try {
    const list = await getResources();
    res.json(list);
  } catch (err) {
    console.error("GET /api/resources error: ", err);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});

app.post('/api/resources', async (req, res) => {
  try {
    const newItem = await addResource(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    console.error("POST /api/resources error: ", err);
    res.status(500).json({ error: "Failed to save resource" });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const list = await getPosts();
    res.json(list);
  } catch (err) {
    console.error("GET /api/posts error: ", err);
    res.status(500).json({ error: "Failed to fetch community posts" });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const newItem = await addPost(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    console.error("POST /api/posts error: ", err);
    res.status(500).json({ error: "Failed to save community post" });
  }
});

// Authentication & Session Endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields: email, password, name" });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    const newUser = await createUser({
      email,
      password,
      name,
      role: 'Parent',
      parentId: null
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error("POST /api/auth/register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const hashed = hashPassword(password);
    if (user.password !== hashed) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    console.error("POST /api/auth/login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Sub-user (Family) Endpoints
app.get('/api/users/:id/subusers', async (req, res) => {
  try {
    const list = await getSubUsers(req.params.id);
    res.json(list);
  } catch (err) {
    console.error("GET /api/users/:id/subusers error:", err);
    res.status(500).json({ error: "Failed to fetch subusers" });
  }
});

app.post('/api/users/:id/subusers', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: "Missing required fields for subuser" });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    const newSub = await createSubUser(req.params.id, {
      email,
      password,
      name,
      role
    });

    const { password: _, ...subWithoutPassword } = newSub;
    res.status(201).json(subWithoutPassword);
  } catch (err) {
    console.error("POST /api/users/:id/subusers error:", err);
    res.status(500).json({ error: "Failed to create subuser" });
  }
});

// Resource Moderation Endpoints
app.get('/api/resources/pending', async (req, res) => {
  try {
    const list = await getPendingResources();
    res.json(list);
  } catch (err) {
    console.error("GET /api/resources/pending error:", err);
    res.status(500).json({ error: "Failed to fetch pending resources" });
  }
});

app.post('/api/resources/:id/approve', async (req, res) => {
  try {
    const approved = await approveResource(req.params.id);
    if (!approved) {
      return res.status(404).json({ error: "Resource not found" });
    }
    res.json(approved);
  } catch (err) {
    console.error("POST /api/resources/:id/approve error:", err);
    res.status(500).json({ error: "Failed to approve resource" });
  }
});

app.post('/api/resources/:id/reject', async (req, res) => {
  try {
    const rejected = await rejectResource(req.params.id);
    if (!rejected) {
      return res.status(404).json({ error: "Resource not found" });
    }
    res.json(rejected);
  } catch (err) {
    console.error("POST /api/resources/:id/reject error:", err);
    res.status(500).json({ error: "Failed to reject resource" });
  }
});

// Serve compiled React build assets in production
app.use(express.static(path.join(__dirname, 'dist')));

// Wildcard routing to direct any non-API routes to React Router index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
