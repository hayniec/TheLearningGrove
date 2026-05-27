# Technical Implementation Plan - The Learning Grove (React & Express Edition)

This document details the development steps and structure for building **The Learning Grove**, a shared, multi-page ready React app powered by an Express backend.

## 1. Directory Structure

```text
The Learning Grove/
├── src/                  # React Frontend Source
│   ├── components/       # UI Components (Modals, Form fields, Rating stars)
│   ├── pages/            # Page Views (Dashboard, Explorer, Community, Resources)
│   ├── App.jsx           # Routing & App State
│   ├── main.jsx          # React Mounting
│   └── index.css         # Natural Forest CSS System & Styles
├── public/               # Static assets
├── index.html            # Vite HTML shell
├── server.js             # Express API Server
├── db.js                 # Unified Data Access Layer (Local & Cloud-ready)
├── database.json         # Persistent JSON database (shared local copy)
├── package.json          # Node dependencies
├── vite.config.js        # Vite & Proxy Server Configuration
├── expectations.md       # Product requirements & user stories
└── implementation_plan.md # Development roadmap (this file)
```

---

## 2. Shared Data Models & Database Strategy

To support global access and deployment on Hostinger, all database queries route through a unified data access layer in `db.js`.
- By default, it operates on `database.json` for zero-setup local development.
- If Hostinger MySQL environment variables are defined (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`), it dynamically initiates a connection pool using the `mysql2` client library and reads/writes from the Hostinger MySQL server instead.


### 2.1 API Endpoints
- **GET `/api/curricula`** - Returns curriculum reviews.
- **POST `/api/curricula`** - Adds a curriculum review.
- **GET `/api/fieldtrips`** - Returns field trips.
- **POST `/api/fieldtrips`** - Adds a field trip.
- **GET `/api/businessads`** - Returns mom-owned business ads.
- **POST `/api/businessads`** - Adds a business ad.

---

## 3. Implementation Roadmap

### Phase 1: Package Configuration & Server Setup
- Setup `package.json` with unified React/Express/Vite dependencies.
- Create `vite.config.js` with API proxy routing.
- Implement `db.js` with seed data fallback.
- Create `server.js` to run static files and REST API endpoints.

### Phase 2: React Structure & Styling
- Create `index.html` and `src/main.jsx`.
- Set up `src/index.css` (custom forest theme layout grids, flexboxes, variables, animations).
- Build page views: Dashboard, Curriculum Explorer, Community Hub, Recommended Resources.

### Phase 3: Live API Integration
- Connect React views to fetch data from `/api/*` endpoints.
- Form submissions linked to backend `POST` APIs with state re-fetching.

### Phase 4: Review & Verification
- Compile and build using `npm run build`.
- Test multi-user concurrency and page responsiveness on mobile viewports.

---

## 4. Future Scale & Permissions Roadmap
When transitioning the database layer to a production cloud engine, we will introduce granular permission tiers to handle user-generated content moderation:
- **Student Role:** Read-only access to curricula, resources, and field trip lists.
- **Parent Role:** Standard read/write access (submit curriculum reviews, post field trips, create business ads).
- **Moderator Role:** Ability to flag, hide, or approve community ads and reviews to maintain quality control.
- **Super Admin Role:** Site owners with full user management and absolute database write/delete overrides.
