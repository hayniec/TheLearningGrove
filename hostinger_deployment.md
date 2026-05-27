# Hostinger Deployment Guide - The Learning Grove

This guide details how to deploy **The Learning Grove** (a full-stack React + Express + MySQL/JSON application) onto **Hostinger Hosting**. Depending on your Hostinger plan, you can deploy using either **Shared/Cloud Web Hosting (Node.js Selector)** or **VPS Hosting**.

---

## 1. Preparing the Application for Production

Before uploading your code, compile the React assets into the production folder.

1. Install dependencies and compile the production bundle:
   ```bash
   npm install
   npm run build
   ```
   This generates the static compiled files inside the `dist/` folder. The Express server (`server.js`) is configured to serve this directory automatically.
2. Ensure `database.json` is ignored or backed up if you are using it locally. In production, we highly recommend switching to **Hostinger MySQL** for concurrent user access and persistence.

---

## 2. Option A: Deploying on Hostinger Shared / Cloud Hosting (hPanel)

Hostinger's Shared and Cloud hosting plans include a **Node.js Selector** which allows you to run Node.js applications directly.

### Step 2.1: Create a MySQL Database on Hostinger
1. Log in to your **Hostinger hPanel**.
2. Navigate to **Databases** -> **MySQL Databases**.
3. Create a new database:
   - **MySQL Database name**: e.g., `u123456_learning_grove`
   - **MySQL Username**: e.g., `u123456_grove_user`
   - **Password**: Create a secure password.
4. Note down these credentials, along with the **MySQL Host** (usually `localhost` or `mysql.hostinger.com`).

### Step 2.2: Set Up the Node.js App
1. Navigate to **Websites** -> **Node.js** in the hPanel.
2. Click **Create Application**.
3. Configure the setup:
   - **App Directory**: `public_html` (or a subdirectory like `public_html/learning-grove`)
   - **Node.js Version**: Select **20.x** (or the latest stable version).
   - **App URL**: Select your domain name.
   - **Startup File**: `server.js`
4. Click **Create**.

### Step 2.3: Upload Project Files
1. Open the Hostinger **File Manager** (under **Files**).
2. Go to your application folder (configured in the step above).
3. Upload the following files and folders:
   - `dist/` (compiled React assets)
   - `server.js` (Express API routing)
   - `db.js` (database interface layer)
   - `package.json` (dependencies manifest)
   - `package-lock.json`
4. *Do NOT upload `node_modules/`* – these will be installed directly on Hostinger's servers to avoid OS mismatch issues.

### Step 2.4: Install Dependencies & Build
1. In the **Node.js** panel on hPanel, locate your application and click **Run npm install** or open the **Terminal/SSH** connection.
2. If using SSH, navigate to your app directory and run:
   ```bash
   npm install --production
   ```

### Step 2.5: Set Up Production Environment Variables
Switch `db.js` into **MySQL Mode** by declaring Hostinger's database environment parameters.
1. In the Hostinger **Node.js Panel**, look for **Environment Variables** (or configure them in your server's startup script or a `.env` file if supported by your runtime).
2. Add the following keys:
   - `DB_HOST` = `localhost` (or the MySQL Host provided by Hostinger)
   - `DB_USER` = `u123456_grove_user` (your Hostinger database username)
   - `DB_PASS` = `your_secure_database_password`
   - `DB_NAME` = `u123456_learning_grove`
   - `DB_PORT` = `3306`
   - `NODE_ENV` = `production`
   - `PORT` = (Hostinger will assign a port dynamically or map traffic to it automatically)
3. Restart the Node.js app from the dashboard. `db.js` will automatically detect these keys, establish a database pool, construct the tables, and seed the initial curricula, field trips, and business ads.

---

## 3. Option B: Deploying on Hostinger VPS Hosting (Virtual Private Server)

If you have a VPS plan, you have complete control over the OS (usually Ubuntu).

### Step 3.1: Server Setup (Ubuntu)
Connect to your Hostinger VPS via SSH and install the required runtimes:
```bash
sudo apt update && sudo apt upgrade -y
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
# Install MySQL Server
sudo apt install mysql-server -y
```

### Step 3.2: Configure MySQL
1. Log in to MySQL:
   ```bash
   sudo mysql
   ```
2. Create database and user:
   ```sql
   CREATE DATABASE learning_grove;
   CREATE USER 'grove_user'@'localhost' IDENTIFIED BY 'your_secure_password';
   GRANT ALL PRIVILEGES ON learning_grove.* TO 'grove_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

### Step 3.3: Clone and Compile App
1. Clone your repository into `/var/www/the-learning-grove`.
2. Create a `.env` file in the root:
   ```env
   DB_HOST=localhost
   DB_USER=grove_user
   DB_PASS=your_secure_password
   DB_NAME=learning_grove
   DB_PORT=3306
   NODE_ENV=production
   PORT=5000
   ```
3. Install dependencies and compile assets:
   ```bash
   npm install
   npm run build
   ```

### Step 3.4: Configure PM2 Process Manager
Keep the Express backend running forever in the background:
```bash
sudo npm install -g pm2
pm2 start server.js --name "learning-grove"
# Set up auto-start on server reboot
pm2 startup
pm2 save
```

### Step 3.5: Nginx Reverse Proxy & SSL (Let's Encrypt)
1. Install Nginx:
   ```bash
   sudo apt install nginx -y
   ```
2. Open `/etc/nginx/sites-available/default` and update the `location /` directive to reverse-proxy traffic to port 5000:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
3. Restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```
4. Secure with Let's Encrypt:
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

---

## 4. Verification

After completing either setup, navigate to your domain name:
1. Verify the homepage loads and the **curricula explorer** fetches entries correctly.
2. Open **Community** -> **Field Trips** and verify that mock field trips display on the Leaflet map.
3. Test **writing a review** and **sharing a field trip** to ensure that write operations write successfully to the database.
