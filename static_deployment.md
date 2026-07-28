# Static Site Deployment Guide - The Learning Grove

Because we migrated all database queries to execute **directly from the browser client** using Supabase, you do not need Node.js selector support or database server configurations on Hostinger. You can deploy this as a **purely static website** on any basic Shared Hosting plan!

---

## Step 1: Build the Static Assets Locally
Compile the React code into static HTML/JS/CSS assets:
```bash
npm run build
```
This generates a folder named `dist/` in your project root containing all static files.

---

## Step 2: Upload Files to Hostinger hPanel File Manager
1. Log in to your **Hostinger hPanel**.
2. Go to **Websites** -> select your domain name -> click **File Manager** (under Files).
3. Navigate into your website's public directory (usually **`public_html`**).
4. Upload all the **contents** of your local `dist/` directory into `public_html` (so that `index.html` sits directly inside `public_html`).

Your public directory structure should look like this:
```
public_html/
  index.html
  assets/
    index-Dvk3L2Xl.js
    index-CH7WOaxb.css
```

---

## Step 3: Configure URL Rewriting (Recommended)
Since the app uses client-side routing (React Router), you need to tell the web server (Apache/LiteSpeed) to route all requests back to `index.html` so that page refreshes on sub-routes (like `/community` or `/fieldtrips`) don't return a 404 error.

Create a file named **`.htaccess`** directly inside the `public_html` folder on Hostinger using File Manager, and paste this configuration:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## Step 4: Verification
Open your browser and navigate to your domain name:
1. Verify the homepage loads and data is successfully loaded from your Supabase instance.
2. Log in with your email or register a new user, write reviews, and submit field trips to verify database reads/writes.
