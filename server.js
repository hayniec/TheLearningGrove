import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getCurricula,
  addCurriculum,
  getFieldTrips,
  addFieldTrip,
  getBusinessAds,
  addBusinessAd,
  getResources,
  addResource
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
    const newItem = await addCurriculum(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    console.error("POST /api/curricula error: ", err);
    res.status(500).json({ error: "Failed to save curriculum review" });
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

// Serve compiled React build assets in production
app.use(express.static(path.join(__dirname, 'dist')));

// Wildcard routing to direct any non-API routes to React Router index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
