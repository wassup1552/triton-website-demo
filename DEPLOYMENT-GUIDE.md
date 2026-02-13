# 🚨 ERROR PREVENTION & DEPLOYMENT GUIDE

## Part 1: Error Checking & Prevention

### 🔍 Common Errors & Solutions

#### **Error 1: "Cannot find module 'express'"**
**Cause:** Dependencies not installed
**Solution:**
```bash
npm install
```

#### **Error 2: "EADDRINUSE: Port 3000 already in use"**
**Cause:** Another application using port 3000
**Solution:**
```bash
# Option A: Kill the process
# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Mac/Linux:
lsof -ti:3000 | xargs kill

# Option B: Change port in server.js
const PORT = 3001; // or 8080, 8000, etc.
```

#### **Error 3: "ENOENT: no such file or directory, open 'orders.xlsx'"**
**Cause:** Excel file doesn't exist yet
**Solution:** Server auto-creates it on first run. If error persists:
```bash
# Restart server - it will recreate the file
```

#### **Error 4: Excel file locked/permission denied**
**Cause:** Excel file open in Microsoft Excel
**Solution:**
```bash
# Close the Excel file in Excel application
# Then restart server
```

#### **Error 5: "Failed to create order" in browser**
**Cause:** Server not running or network issue
**Solution:**
1. Check server is running (terminal should show "Server running on...")
2. Check URL is http://localhost:3000 (not file://)
3. Check browser console (F12) for detailed error

#### **Error 6: Orders not appearing on dashboard**
**Cause:** Multiple possible issues
**Solution:**
```bash
# 1. Check server logs for errors
# 2. Verify order-stats.json exists and is valid JSON
# 3. Delete order-stats.json and restart (will rebuild)
rm order-stats.json
npm start
```

#### **Error 7: Revenue not calculating**
**Cause:** Corrupted stats file
**Solution:**
```bash
# Delete stats file and restart
rm order-stats.json
npm start
```

#### **Error 8: "SyntaxError: Unexpected token" in browser**
**Cause:** JavaScript file not loading properly
**Solution:**
1. Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
2. Clear browser cache
3. Check all .js files are in the same directory

#### **Error 9: Cart not working**
**Cause:** localStorage blocked or wrong URL
**Solution:**
1. Must access via http://localhost:3000 (not file://)
2. Check if browser allows localStorage
3. Clear browser localStorage: F12 → Application → Local Storage → Clear

#### **Error 10: Finish button not working**
**Cause:** Excel file locked or corrupted
**Solution:**
1. Close Excel application
2. Check server console for errors
3. Restart server

---

## Part 2: Pre-Deployment Checklist

### ✅ Before Deploying

- [ ] All files present in project folder
- [ ] `npm install` completed successfully
- [ ] Server runs locally without errors
- [ ] Can place test order successfully
- [ ] Dashboard shows orders correctly
- [ ] Finish button works
- [ ] Excel file downloads correctly
- [ ] Revenue tracking works

### 📁 Required Files
```
triton-restaurant/
├── index.html ✓
├── menu-with-cart.html ✓
├── admin-orders.html ✓
├── styles.css ✓
├── cart-styles.css ✓
├── script.js ✓
├── cart.js ✓
├── server.js ✓
├── package.json ✓
└── assets/
    └── images/ ✓
```

---

## Part 3: IMPORTANT - Netlify Limitations

### ⚠️ CRITICAL ISSUE: Netlify Cannot Host This System

**Netlify is a STATIC site hosting service. Your system needs a BACKEND SERVER.**

**What Netlify CAN host:**
- HTML files ✓
- CSS files ✓
- JavaScript files ✓
- Images ✓

**What Netlify CANNOT host:**
- Node.js server ✗
- Express backend ✗
- File system operations (Excel files) ✗
- Server-side APIs ✗

### 🎯 Your System Requirements:
1. **Node.js server** (server.js) - Needs backend
2. **Excel file creation** - Needs file system access
3. **Order persistence** - Needs database/files
4. **API endpoints** - Needs backend server

**Result:** Your ordering system WILL NOT WORK on Netlify.

---

## Part 4: Correct Hosting Solutions

### Option 1: Heroku (Recommended) - FREE & EASY

**Pros:**
- ✓ Supports Node.js
- ✓ Free tier available
- ✓ Easy deployment
- ✓ Automatic HTTPS
- ✓ Custom domain support

**Cons:**
- ⚠️ Files don't persist (resets every 24hrs)
- Need database for permanent storage

**Steps:**
1. Create Heroku account: https://heroku.com
2. Install Heroku CLI
3. Deploy (see detailed guide below)

### Option 2: Railway.app (Best for Files) - FREE

**Pros:**
- ✓ Supports Node.js
- ✓ Free tier available
- ✓ File persistence (with volumes)
- ✓ Easy deployment
- ✓ Auto HTTPS

**Cons:**
- Limited free hours per month

**Best choice for your system!**

### Option 3: Render (Good Alternative) - FREE

**Pros:**
- ✓ Supports Node.js
- ✓ Free tier
- ✓ Auto HTTPS

**Cons:**
- ⚠️ Files don't persist

### Option 4: DigitalOcean/AWS (Production Ready) - PAID

**Pros:**
- ✓ Full control
- ✓ File persistence
- ✓ Scalable

**Cons:**
- ✗ Not free
- ✗ More complex setup

### Option 5: Local Restaurant Server (Recommended for Small Business)

**Pros:**
- ✓ FREE
- ✓ Full control
- ✓ Files persist
- ✓ No internet required

**Cons:**
- Only accessible on local network

**Best for:** Single restaurant location

---

## Part 5: Deployment Guide - Railway.app (RECOMMENDED)

### Why Railway?
- FREE tier available
- Supports file persistence
- Easy deployment
- Your Excel files will be saved!

### Step-by-Step:

#### 1. Prepare Your Code

**Create `.gitignore` file:**
```bash
# Create this file in your project root
node_modules/
orders.xlsx
order-stats.json
.env
```

**Update `package.json`:**
```json
{
  "name": "triton-restaurant-ordering",
  "version": "1.0.0",
  "description": "Order management system for Triton Restaurant",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": "18.x"
  },
  "keywords": ["restaurant", "orders", "excel"],
  "author": "Triton Restaurant",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "exceljs": "^4.3.0"
  }
}
```

#### 2. Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub (recommended)
3. Verify email

#### 3. Install Railway CLI (Optional but Helpful)
```bash
npm install -g @railway/cli
```

#### 4. Deploy from GitHub (Easiest Method)

**A. Create GitHub Repository:**
```bash
# In your project folder
git init
git add .
git commit -m "Initial commit"
```

**B. Push to GitHub:**
1. Create new repo on GitHub.com
2. Copy the commands shown and run:
```bash
git remote add origin https://github.com/YOUR_USERNAME/triton-restaurant.git
git branch -M main
git push -u origin main
```

**C. Deploy on Railway:**
1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway auto-detects Node.js and deploys!

#### 5. Add Persistent Storage (IMPORTANT!)

**To save Excel files permanently:**
1. In Railway dashboard, click your project
2. Go to "Settings" tab
3. Scroll to "Volumes"
4. Click "+ Add Volume"
5. Set:
   - Mount Path: `/app/data`
   - Size: 1 GB (more than enough)

**Update server.js paths:**
```javascript
// Change these lines:
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.xlsx');
const STATS_FILE = path.join(__dirname, 'data', 'order-stats.json');

// Add at the top of server.js (after const path = require('path')):
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
```

#### 6. Set Environment Variables
1. In Railway dashboard, go to "Variables" tab
2. Add: `PORT` = `3000` (Railway auto-assigns, this is optional)

#### 7. Get Your URL
1. In Railway dashboard, go to "Settings"
2. Click "Generate Domain"
3. You'll get: `your-app.railway.app`

#### 8. Test Your Deployment
```
https://your-app.railway.app/menu-with-cart.html
https://your-app.railway.app/admin-orders.html
```

---

## Part 6: Deployment Guide - Heroku

### Step-by-Step:

#### 1. Install Heroku CLI
**Windows:** Download from https://devcenter.heroku.com/articles/heroku-cli
**Mac:** `brew install heroku/brew/heroku`
**Linux:** `curl https://cli-assets.heroku.com/install.sh | sh`

#### 2. Login
```bash
heroku login
```

#### 3. Create App
```bash
# In your project folder
heroku create triton-restaurant-orders
```

#### 4. Add Procfile
Create file named `Procfile` (no extension):
```
web: node server.js
```

#### 5. Deploy
```bash
git init
git add .
git commit -m "Initial deployment"
git push heroku main
```

#### 6. Open App
```bash
heroku open
```

**⚠️ NOTE:** Files won't persist on Heroku free tier. Need to add PostgreSQL database for permanent storage.

---

## Part 7: Local Network Deployment (EASIEST)

### For Single Restaurant - No Internet Needed!

#### Setup:

1. **Get your computer's IP address:**

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address" (e.g., 192.168.1.5)
```

**Mac/Linux:**
```bash
ifconfig
# Look for "inet" (e.g., 192.168.1.5)
```

2. **Update server.js:**
```javascript
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 Server running on:`);
    console.log(`   Local: http://localhost:${PORT}`);
    console.log(`   Network: http://YOUR_IP:${PORT}`);
});
```

3. **Allow firewall access:**
**Windows:** Windows Defender Firewall → Allow app → Node.js
**Mac:** System Preferences → Security → Firewall → Allow Node

4. **Access from any device on same WiFi:**
```
Kitchen tablet: http://192.168.1.5:3000/admin-orders.html
Waiter phone: http://192.168.1.5:3000/menu-with-cart.html
```

5. **Keep server running:**
```bash
# Keep terminal open or use PM2:
npm install -g pm2
pm2 start server.js
pm2 startup  # Auto-start on boot
pm2 save
```

---

## Part 8: Hybrid Solution (RECOMMENDED)

### Best of Both Worlds:

**Frontend (Netlify):** Static pages only
**Backend (Railway/Heroku):** Order processing

This requires code changes to separate frontend/backend.

**Structure:**
```
Frontend (Netlify):
- index.html
- menu-with-cart.html
- styles.css
- cart.js (modified to call backend API)

Backend (Railway):
- server.js
- Excel files
- API endpoints
```

**Pros:**
- Fast frontend delivery
- Secure backend
- Best performance

**Cons:**
- More complex setup
- Need CORS configuration

---

## Part 9: Recommendation Matrix

| Solution | Cost | Difficulty | Files Persist | Best For |
|----------|------|------------|---------------|----------|
| **Local Network** | FREE | ⭐ Easy | ✓ Yes | Single restaurant |
| **Railway.app** | FREE* | ⭐⭐ Medium | ✓ Yes | Small business online |
| **Heroku** | FREE* | ⭐⭐ Medium | ✗ No** | Testing only |
| **Hybrid** | FREE | ⭐⭐⭐ Hard | ✓ Yes | Multi-location |
| **VPS** | $5-20/mo | ⭐⭐⭐⭐ Hard | ✓ Yes | Enterprise |

*Free tier with limitations
**Need database addon for persistence

---

## Part 10: Quick Decision Tree

**Q1: Do you need online ordering (customers at home)?**
- **No** → Use Local Network (easiest, free, works great!)
- **Yes** → Continue to Q2

**Q2: Is your budget $0?**
- **Yes** → Use Railway.app (free tier)
- **No** → Continue to Q3

**Q3: How many orders per month?**
- **<1000** → Railway.app free tier
- **>1000** → Railway.app paid ($5/mo) or VPS

---

## Part 11: My Recommendation for You

**Best Choice: Local Network Deployment**

**Why:**
1. ✓ **FREE** - No monthly costs
2. ✓ **SIMPLE** - Just run `npm start`
3. ✓ **RELIABLE** - No internet dependency
4. ✓ **PRIVATE** - Data stays on your computer
5. ✓ **FAST** - No server delays
6. ✓ **EXCEL FILES WORK** - Full functionality

**Perfect for:**
- Single restaurant location
- Kitchen staff and waiters on same WiFi
- No online ordering needed

**Setup time:** 5 minutes

---

## Part 12: Step-by-Step Local Network Setup

### Final Setup (Recommended):

```bash
# 1. Install PM2 (keeps server running)
npm install -g pm2

# 2. Start server with PM2
pm2 start server.js --name triton-orders

# 3. Save configuration
pm2 save

# 4. Set auto-start on boot
pm2 startup

# 5. Get your IP address
# Windows: ipconfig
# Mac/Linux: ifconfig

# 6. Access from any device:
# http://YOUR_IP:3000/menu-with-cart.html
# http://YOUR_IP:3000/admin-orders.html
```

**Done! Your system is now running 24/7 on your local network.**

---

## Part 13: Troubleshooting Deployment

### Common Deployment Errors:

**Error:** "Application error" on Heroku/Railway
**Fix:** Check logs: `heroku logs --tail` or Railway dashboard logs

**Error:** "Cannot read file"
**Fix:** Ensure file paths use `__dirname` not absolute paths

**Error:** "Module not found"
**Fix:** Ensure package.json has all dependencies listed

**Error:** Port binding error
**Fix:** Use `process.env.PORT || 3000` in server.js

---

## Summary

**❌ Don't use Netlify** - It can't run Node.js servers

**✅ Do use:**
1. **Local Network** (recommended for single restaurant)
2. **Railway.app** (if you need online access)
3. **Heroku** (for testing only)

**Need help choosing?** Use the decision tree in Part 10!
