# Render Deployment Guide - EasyAssign

This guide will help you deploy your EasyAssign application to Render.

## Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **PostgreSQL Database**: Render provides free PostgreSQL databases

---

## Step 1: Create PostgreSQL Database on Render

1. Go to your Render Dashboard
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `easyassign-db` (or your preferred name)
   - **Database**: `easyassign`
   - **User**: Auto-generated
   - **Region**: Choose closest to you
   - **Plan**: Free (or paid if needed)
4. Click **"Create Database"**
5. **Important**: Copy the **Internal Database URL** (you'll need this)

---

## Step 2: Deploy Backend API

### Option A: Using render.yaml (Recommended)

1. The `render.yaml` file is already configured in your repository
2. In Render Dashboard, click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and create services
5. Configure environment variables (see below)

### Option B: Manual Setup

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `TimoorKhan58/EasyAssign`
3. Configure the service:

   **Basic Settings:**
   - **Name**: `easyassign-api`
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `server`

   **Build & Deploy:**
   - **Build Command**: `npm install && npm run generate && npm run db:push`
   - **Start Command**: `npm start`

   **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=<Your PostgreSQL Internal Database URL from Step 1>
   JWT_SECRET=<Generate a random secret string>
   ```

4. Click **"Create Web Service"**

---

## Step 3: Deploy Frontend

1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Connect your GitHub repository: `TimoorKhan58/EasyAssign`
3. Configure:

   **Basic Settings:**
   - **Name**: `easyassign-client`
   - **Branch**: `main`
   - **Root Directory**: `client`

   **Build Settings:**
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

   **Environment Variables:**
   ```
   VITE_API_URL=https://easyassign-api.onrender.com/api
   ```
   *(Replace `easyassign-api` with your actual backend service name)*

4. Click **"Create Static Site"**

---

## Step 4: Environment Variables

### Backend Service Environment Variables

Set these in your Render backend service dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `3000` | Server port (Render sets this automatically) |
| `DATABASE_URL` | `postgresql://...` | PostgreSQL connection string from Step 1 |
| `JWT_SECRET` | `your-secret-key` | Random string for JWT token signing |

**To generate JWT_SECRET:**
```bash
# On your local machine
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend Service Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://your-api.onrender.com/api` | Your backend API URL |

---

## Step 5: Database Setup

After the backend service is deployed:

1. The `postinstall` script will automatically run `prisma generate`
2. The build command runs `prisma db push` to sync the schema
3. **Optional**: Seed the database by running:
   ```bash
   # In Render Shell (available in service dashboard)
   cd server
   npm run seed
   ```

---

## Step 6: Update CORS Settings (If Needed)

If you encounter CORS errors, update `server/server.js`:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend.onrender.com',
    'http://localhost:5173' // For local development
  ],
  credentials: true
}));
```

---

## Common Issues & Solutions

### Issue 1: Build Command Error
**Error**: `error Command "npm" not found`

**Solution**: 
- In Render dashboard, go to your service settings
- Update **Build Command** to: `npm install && npm run generate && npm run db:push`
- Make sure you're using `npm` not `yarn`

### Issue 2: Database Connection Error
**Error**: `Error: P1001: Can't reach database server`

**Solutions**:
- Use the **Internal Database URL** (not External) for backend services on Render
- Make sure the database and backend service are in the same region
- Check that `DATABASE_URL` environment variable is set correctly

### Issue 3: Prisma Client Not Generated
**Error**: `PrismaClient is not configured`

**Solution**:
- The `postinstall` script should handle this automatically
- If not, add to build command: `npm install && npm run generate && npm run db:push`

### Issue 4: Frontend Can't Connect to API
**Error**: CORS or network errors

**Solutions**:
- Verify `VITE_API_URL` is set correctly in frontend environment variables
- Check that the backend URL is accessible
- Update CORS settings in `server/server.js`

### Issue 5: Port Already in Use
**Error**: `Port 3000 is already in use`

**Solution**:
- Render automatically sets `PORT` environment variable
- Your `server.js` already uses `process.env.PORT || 3000`, so this should work automatically

---

## Testing Your Deployment

1. **Backend Health Check**: 
   - Visit: `https://your-api.onrender.com/`
   - Should see: "Task Assignment API is running"

2. **API Endpoints**:
   - Test: `https://your-api.onrender.com/api/auth/register`
   - Should return API response

3. **Frontend**:
   - Visit your static site URL
   - Should load the React application
   - Try logging in (create a user first via API)

---

## Local Development with PostgreSQL

If you want to use PostgreSQL locally (recommended for consistency):

1. Install PostgreSQL locally or use a cloud service
2. Update `server/.env`:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/easyassign"
   ```
3. Run:
   ```bash
   cd server
   npm run db:push
   ```

**Note**: The schema is now configured for PostgreSQL. For SQLite local development, you can temporarily change `provider = "sqlite"` in `schema.prisma`, but PostgreSQL is recommended.

---

## Monitoring & Logs

- **View Logs**: In Render dashboard → Your Service → Logs
- **Metrics**: Available in the service dashboard
- **Database**: View in PostgreSQL service dashboard

---

## Updating Your Deployment

After pushing changes to GitHub:

1. Render automatically detects changes
2. Triggers a new build and deployment
3. Monitor the build logs in Render dashboard

**Manual Deploy**: Click "Manual Deploy" → "Deploy latest commit"

---

## Cost

- **Free Tier**: 
  - Web services spin down after 15 minutes of inactivity
  - PostgreSQL database: 90 days free trial, then $7/month
  - Static sites: Always free

- **Paid Plans**: 
  - Web services: $7/month (always on)
  - Better performance and no spin-down

---

## Support

- **Render Docs**: https://render.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Troubleshooting**: Check Render's troubleshooting guide

---

## Quick Checklist

- [ ] PostgreSQL database created on Render
- [ ] Backend service deployed with correct environment variables
- [ ] Frontend service deployed with `VITE_API_URL` set
- [ ] Database schema pushed (`prisma db push` runs in build)
- [ ] CORS configured (if needed)
- [ ] Test backend health endpoint
- [ ] Test frontend loads correctly
- [ ] Test API endpoints from frontend

---

**Your Render Services:**
- Backend API: `https://easyassign-api.onrender.com`
- Frontend: `https://easyassign-client.onrender.com`
- Database: `easyassign-db` (internal access only)

Update the URLs above with your actual service names!

