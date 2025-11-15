# 🚀 Deployment Guide - Bug Tracker Application

This guide will help you deploy your Bug Tracker application:
- **Backend (Server)** → Render
- **Frontend (Client)** → Vercel

---

## 📋 Prerequisites

Before deploying, make sure you have:
- ✅ MongoDB Atlas account with database set up
- ✅ GitHub account with your code pushed to a repository
- ✅ Render account (free tier available)
- ✅ Vercel account (free tier available)

---

## 🔧 Part 1: Backend Deployment on Render

### Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Ensure your `.env` file is in `.gitignore`** (it should already be)

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository

### Step 3: Configure Backend Service

**Service Settings:**
- **Name:** `bug-tracker-api` (or any name you prefer)
- **Region:** Choose closest to you (e.g., `Oregon (US West)`)
- **Branch:** `main` (or your default branch)
- **Root Directory:** `server`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Step 4: Environment Variables on Render

Click on **"Environment"** tab and add:

```
MONGODB_URI=mongodb+srv://mernsatck:1234@cluster0.lktiq8c.mongodb.net/bug-tracker?retryWrites=true&w=majority
NODE_ENV=production
PORT=5000
```

**Important Notes:**
- Replace `MONGODB_URI` with your actual MongoDB Atlas connection string
- Make sure MongoDB Atlas Network Access allows connections from anywhere (`0.0.0.0/0`)
- Render automatically assigns a port, but we set PORT for consistency

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment to complete (usually 2-5 minutes)
3. Your API will be available at: `https://your-app-name.onrender.com`
4. Test the health endpoint: `https://your-app-name.onrender.com/health`

### Step 6: Update CORS Settings (Important!)

Update your `server/src/app.js` to allow Vercel domain:

```javascript
// Allow requests from Vercel (update with your actual Vercel URL)
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL, // Vercel URL will be set here
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(null, true); // For now, allow all origins in production
    }
  },
  credentials: true
}));
```

**Note:** For production, it's better to restrict CORS to specific domains.

---

## 🎨 Part 2: Frontend Deployment on Vercel

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

Or use Vercel's web interface (recommended for first time).

### Step 2: Prepare Frontend for Deployment

1. **Create `vercel.json` configuration file** (see below)

2. **Update API base URL** in `client/src/services/api.js`:
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
   ```

### Step 3: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Create React App
   - **Root Directory:** `client`
   - **Build Command:** `npm run build` (or `npm install && npm run build`)
   - **Output Directory:** `build`

### Step 4: Environment Variables on Vercel

In Vercel project settings, go to **"Environment Variables"** and add:

```
REACT_APP_API_URL=https://your-app-name.onrender.com/api
```

Replace `your-app-name` with your actual Render service name.

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for deployment (usually 1-3 minutes)
3. Your app will be live at: `https://your-project-name.vercel.app`

---

## 📁 Required Configuration Files

### `vercel.json` (in `client` directory)

Create this file:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "s-maxage=31536000,immutable"
      },
      "dest": "/static/$1"
    },
    {
      "src": "/(.*\\.(js|css|ico|png|jpg|svg))",
      "headers": {
        "cache-control": "s-maxage=31536000,immutable"
      },
      "dest": "/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

---

## 🔄 Post-Deployment Steps

### 1. Update Render Backend with Vercel URL

In Render dashboard, add environment variable:
```
FRONTEND_URL=https://your-project-name.vercel.app
```

### 2. Update CORS in Backend

Your backend should allow requests from your Vercel domain.

### 3. Test the Deployment

1. **Test Backend:**
   - Health: `https://your-app.onrender.com/health`
   - API: `https://your-app.onrender.com/api/bugs`

2. **Test Frontend:**
   - Visit: `https://your-project.vercel.app`
   - Try creating a bug
   - Verify CRUD operations work

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: Application crashes on Render**
- Check logs in Render dashboard
- Verify MongoDB Atlas connection string
- Ensure MongoDB Atlas Network Access allows all IPs (`0.0.0.0/0`)

**Problem: CORS errors**
- Update CORS settings in `server/src/app.js`
- Add Vercel URL to allowed origins
- Check environment variables

**Problem: Environment variables not loading**
- Verify `.env` file is in `.gitignore`
- Add all environment variables in Render dashboard
- Restart the service after adding variables

### Frontend Issues

**Problem: API calls failing**
- Verify `REACT_APP_API_URL` is set correctly in Vercel
- Check browser console for errors
- Ensure backend URL includes `/api` path

**Problem: 404 errors on refresh**
- Ensure `vercel.json` has proper routing configuration
- All routes should redirect to `index.html`

**Problem: Build fails**
- Check build logs in Vercel
- Ensure all dependencies are in `package.json`
- Try clearing build cache in Vercel settings

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** to Git
2. **Use environment variables** for all sensitive data
3. **Restrict CORS** to specific domains in production
4. **Use HTTPS** (both Render and Vercel provide this by default)
5. **Keep MongoDB credentials secure**
6. **Regularly update dependencies**

---

## 📊 Monitoring

### Render
- View logs in Render dashboard
- Set up email alerts for deployment status
- Monitor service uptime

### Vercel
- View analytics in Vercel dashboard
- Check function logs for errors
- Monitor performance metrics

---

## 🆘 Support Resources

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/

---

## ✅ Deployment Checklist

### Backend (Render)
- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] Environment variables set
- [ ] Build command configured
- [ ] Start command configured
- [ ] Deployment successful
- [ ] Health endpoint working
- [ ] API endpoints tested

### Frontend (Vercel)
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Build configuration set
- [ ] Environment variables set
- [ ] `vercel.json` created (if needed)
- [ ] Deployment successful
- [ ] App loads correctly
- [ ] API calls working

---

**Happy Deploying! 🚀**

