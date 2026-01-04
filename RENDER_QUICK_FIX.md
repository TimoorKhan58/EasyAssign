# Quick Fix for Render Deployment Error

## The Error
```
error Command "npm" not found.
==> Build failed
```

## The Problem
Your Render service has the build command set to `yarn npm install`, which is incorrect.

## Immediate Fix (In Render Dashboard)

1. Go to your Render Dashboard
2. Click on your **backend service** (the one that's failing)
3. Go to **Settings** → **Build & Deploy**
4. Update the **Build Command** to:
   ```
   cd server && npm install && npm run generate && npm run db:push
   ```
5. Click **Save Changes**
6. Click **Manual Deploy** → **Deploy latest commit**

## Alternative: Use render.yaml (Recommended)

The repository now includes a `render.yaml` file. To use it:

1. Delete your current service in Render (or keep it if you prefer manual setup)
2. In Render Dashboard, click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository: `TimoorKhan58/EasyAssign`
4. Render will automatically detect `render.yaml` and create the services
5. You'll still need to set the `DATABASE_URL` environment variable (see below)

## Required Environment Variables

In your Render backend service, set these environment variables:

1. Go to **Environment** tab in your service
2. Add these variables:

   ```
   NODE_ENV=production
   DATABASE_URL=<Your PostgreSQL Database URL>
   JWT_SECRET=<Generate a random string>
   ```

### Getting DATABASE_URL

1. In Render Dashboard, go to your **PostgreSQL** database service
2. Copy the **Internal Database URL** (use Internal, not External)
3. It looks like: `postgresql://user:password@host:5432/dbname`

### Generating JWT_SECRET

Run this locally:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use any random string generator.

## After Fixing

1. The build should complete successfully
2. Check the **Logs** tab to verify the service started
3. Test the API: `https://your-service.onrender.com/`
4. Should see: "Task Assignment API is running"

## Still Having Issues?

1. Check the **Logs** tab for detailed error messages
2. Verify all environment variables are set
3. Make sure PostgreSQL database is created and running
4. See `DEPLOYMENT.md` for complete deployment guide

