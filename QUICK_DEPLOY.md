# ⚡ Quick Deployment Guide

## 🚀 Quick Steps

### Backend (Render) - 5 Minutes

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
   - Sign up or log in
   - Click "New +" → "Web Service"

2. **Connect GitHub Repository**
   - Select your repository
   - Authorize Render access

3. **Configure Service:**
   ```
   Name: bug-tracker-api
   Root Directory: server
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Set Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://mernsatck:1234@cluster0.lktiq8c.mongodb.net/bug-tracker?retryWrites=true&w=majority
   NODE_ENV=production
   PORT=5000
   ```

5. **Click "Create Web Service"**
   - Wait 2-5 minutes
   - Copy your service URL (e.g., `https://bug-tracker-api.onrender.com`)

---

### Frontend (Vercel) - 3 Minutes

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
   - Sign up or log in with GitHub
   - Click "Add New..." → "Project"

2. **Import Repository:**
   - Select your repository
   - Configure:
     ```
     Framework Preset: Create React App
     Root Directory: client
     Build Command: npm run build
     Output Directory: build
     ```

3. **Set Environment Variable:**
   ```
   REACT_APP_API_URL=https://your-render-url.onrender.com/api
   ```
   Replace `your-render-url` with your actual Render service URL

4. **Click "Deploy"**
   - Wait 1-3 minutes
   - Your app is live! 🎉

---

## 📝 Checklist

### Before Deployment:
- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas database ready
- [ ] MongoDB Atlas Network Access allows all IPs (`0.0.0.0/0`)

### Backend (Render):
- [ ] Service created
- [ ] Environment variables set
- [ ] Build successful
- [ ] Health check working: `https://your-app.onrender.com/health`

### Frontend (Vercel):
- [ ] Project created
- [ ] Environment variable set (REACT_APP_API_URL)
- [ ] Build successful
- [ ] App loads correctly

### After Deployment:
- [ ] Test creating a bug
- [ ] Test updating a bug
- [ ] Test deleting a bug
- [ ] Test filtering bugs

---

## 🔗 Important URLs

After deployment, you'll have:
- **Backend API:** `https://your-app.onrender.com`
- **Frontend App:** `https://your-project.vercel.app`

Test endpoints:
- Health: `https://your-app.onrender.com/health`
- API: `https://your-app.onrender.com/api/bugs`

---

## 🐛 Common Issues

**Backend not starting?**
- Check Render logs
- Verify MONGODB_URI is correct
- Ensure MongoDB Atlas allows connections

**CORS errors?**
- Update FRONTEND_URL in Render with your Vercel URL
- Restart Render service

**API calls failing?**
- Verify REACT_APP_API_URL includes `/api` at the end
- Check browser console for errors
- Verify backend is running

---

**Need more details?** See `DEPLOYMENT.md` for comprehensive guide.

