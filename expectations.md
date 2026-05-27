# Project Expectations & Product Requirements

This document outlines the expectations, goals, and features of **The Learning Grove**, a premium homeschool community and resource platform.

## 1. Project Overview

- **Project Name:** The Learning Grove
- **Elevator Pitch:** A warm, intuitive, and feature-rich homeschool hub where parents can explore & review curricula, coordinate field trips, connect with local co-ops, browse recommended online resources, and support mom-owned businesses.
- **Core Vision:** To cultivate a thriving "grove" of shared educational knowledge, reducing the isolation of homeschooling and simplifying curriculum selection through structured, parent-driven reviews, community support, and curated recommended online resources.


---

## 2. Target Audience

1. **Homeschooling Parents (Moms & Dads):** Primary users who search for curricula, write reviews, seek field trip ideas, find websites/videos, and look for community connection.
2. **Parent-Entrepreneurs (Mom-Owned Businesses):** Homeschooling parents looking to advertise tutoring, co-op classes, extracurriculars, or local crafts/services.
3. **Local Homeschool Communities:** Co-ops and groups looking to coordinate events and field trips.

---

## 3. Key Features & Functional Requirements

### Phase 1: Core Dashboard & Directories (MVP)
- [ ] **Interactive Curriculum Directory & Explorer:**
  - Search, filter, and view detailed curricula.
  - Review filters & data points:
    - **Subject** (Math, Science, Language Arts, History, etc.)
    - **Delivery Format** (Online, printable, consumable)
    - **Grouping** (Family-based vs. Grade-based)
    - **Grade Levels** (Selectable K through 12, allowing multiple selections)
    - **Cost Range** (Free, $, $$, $$$)
    - **Rating** (1–5 Stars)
    - **Favorite Part** (Text testimonial)
    - **Grading & Answer Keys** (Answer key provided, extra cost, or self-graded)
    - **Methodology** (Spiral review vs. Mastery)
    - **Resources** (Provides online resources, video resources, etc.)
    - **Pacing** (Self-paced vs. Scheduled)
    - **Class Format** (Online class with participation/live vs. pre-recorded/independent)
    - **Worldview** (Secular vs. Nonsecular)
- [ ] **Curriculum Review Submission Form:**
  - A dynamic, user-friendly multi-step form that lets parents write detailed reviews capturing all the fields above.
- [ ] **Community & Moms' Connection Portal:**
  - **Field Trip Planner:** Directory of field trip opportunities (locations, educational subjects aligned, age ranges, reviews).
  - **Moms' Business Directory & Bulletin Board:** A dedicated space for homeschooling moms to connect, organize meetups, and advertise their businesses or tutoring services.
- [ ] **Curated Educational Resources:**
  - Directory of free or low-cost recommended websites categorized by subject.
  - Curated video resources section for supplement learning.

### Phase 2: Future Enhancements
- [ ] **Mobile-Optimized Board Visibility:** Refine specific bulletin board views and connection components to be custom-tailored for visibility on small mobile screens.
- [ ] **Role-Based Access & Moderation:** Integrate a granular permission model separating user roles (Parents, Students, Moderators to manage content flagging, and Super Admins for platform ownership).

---


## 4. User Experience & Design Guidelines

- **Design Aesthetic:** A warm, organic, forest-inspired theme ("The Learning Grove"). We will utilize deep moss/forest greens, soft sage, warm oak accents, and clean ivory card layouts with gentle leaf-shaped borders, subtle shadow depths, and smooth micro-animations.
- **Color Palette:**
  - *Primary Forest Green:* `#1E3F20`
  - *Accent Sage:* `#8CA88E`
  - *Warm Oak:* `#B77C43`
  - *Background Cream:* `#FAF8F5`
  - *Text Charcoal:* `#2D312E`
- **Key Screens/Views:**
  1. **Dashboard Home:** Quick access search bar, statistics, and carousel of featured curricula and upcoming community events.
  2. **Curriculum Explorer:** Sidebar filters matching all the user requirements and grid of curriculum cards.
  3. **Community Hub:** Tabbed view between Field Trips map/list and Moms' Business Board.
  4. **Resources Directory:** Tabs for websites (by subject) and educational video playlists.
  5. **Review Form Modal:** A beautiful multi-step review wizard.

---

## 5. Technical Stack & Architecture

- **Frontend:** React (built with Vite) to allow component-based views, featuring multi-page routing (React Router) for clean navigation and future expansions.
- **Styling:** Premium Vanilla CSS. Custom CSS variables for the organic forest theme, responsive Flexbox/Grid configurations, glassmorphic modal effects, and micro-animations.
- **Backend:** Node.js + Express API server serving production frontend files and handling endpoint routing.
- **Data Layer & Hostinger Hosting:** Dual-mode persistence layer. Local development operates on a persistent `database.json` file. When deployed to **Hostinger**, the app connects to a Hostinger-managed **MySQL** database (which is included in all standard Hostinger packages) via server environment variables, syncing data dynamically for global visitors.

