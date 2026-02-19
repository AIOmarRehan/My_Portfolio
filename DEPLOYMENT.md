# Deployment Guide

This guide covers setting up your portfolio application for production deployment on Vercel with:
- Google OAuth authentication
- MongoDB Atlas cloud database
- Secure environment variables

---

## Prerequisites

- GitHub account (to push code)
- Google account (for OAuth)
- Vercel account (connected to GitHub)
- MongoDB Atlas account (free tier)

---

## Step 1: Set Up MongoDB Atlas (Database)

### Create a MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Start Free" and create an account
3. Verify your email

### Create a Free Cluster

1. After login, click **"Create"** to build a database
2. Select **M0 (Free)** cluster tier
3. Choose a cloud provider (AWS, GCP, or Azure)
4. Choose a region closest to you
5. Click **"Create Cluster"**

### Create Database Access (Credentials)

1. In the left sidebar, go to **"Security" → "Database Access"**
2. Click **"Add New Database User"**
3. Set username: `admin`
4. Set password: Generate a strong password and save it safely
5. Select **"Built-in Role"** → **"Atlas Admin"**
6. Click **"Create Database User"**

### Allow Network Access

1. In the left sidebar, go to **"Security" → "Network Access"**
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is safe with authentication. In production, you'd restrict to Vercel IPs.
4. Click **"Confirm"**

### Get Connection String

1. Go to **"Databases"** in the left sidebar
2. Click **"Connect"** on your M0 cluster
3. Choose **"Drivers"** → **"Node.js"**
4. Copy the connection string (it looks like: `mongodb+srv://admin:<password>@cluster.mongodb.net/?retryWrites=true&w=majority`)
5. Replace `<password>` with your actual password
6. Replace the database name (update `/test` to `/portfolio` or similar)

**Example format:**
```
mongodb+srv://admin:MyStrongPassword123@myportfolio.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
```

---

## Step 2: Set Up Google OAuth

### Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **"Select a Project"** → **"New Project"**
3. Name it `Portfolio` and click **"Create"**

### Enable OAuth 2.0

1. In the search bar, search for **"OAuth consent screen"**
2. Click on **"OAuth consent screen"**
3. Select **"External"** and click **"Create"**
4. Fill in:
   - **User type**: External
   - **App name**: Portfolio
   - **User support email**: Your email
   - **Developer contact**: Your email
5. Click **"Save and Continue"** through all tabs (skip optional scopes)
6. Review and click **"Back to Dashboard"**

### Create OAuth Credentials

1. In the left sidebar, go to **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Select **"Web application"**
4. Under **"Authorized redirect URIs"**, add:
   - `http://localhost:3000/api/auth/callback/google` (for local testing)
   - `https://yourdomain.vercel.app/api/auth/callback/google` (replace with your Vercel URL)
5. Click **"Create"**
6. Copy your **Client ID** and **Client Secret** to a safe place

---

## Step 3: Local Setup

### Create `.env.local`

Copy the `.env.local.example` file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
MONGODB_URI=mongodb+srv://admin:YourPassword@cluster.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority

NEXTAUTH_SECRET=generate-a-long-random-string-here
# You can generate this with: openssl rand -base64 32

GOOGLE_CLIENT_ID=your-google-client-id-here

GOOGLE_CLIENT_SECRET=your-google-client-secret-here

ADMIN_EMAIL=your-email@gmail.com

NEXTAUTH_URL=http://localhost:3000
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Or on Windows (PowerShell):
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` and test:
1. Public homepage loads
2. Navigate to `/admin` → Click "Sign in with Google"
3. After sign-in, you should see the admin dashboard
4. Test creating a project in `/admin/projects`

---

## Step 4: Deploy to Vercel

### Push to GitHub

```bash
git init
git add .
git commit -m "Initial portfolio setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

**Make sure `.env.local` is in `.gitignore`** (it already is in this project).

### Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Select your `portfolio` repository
5. Click **"Import"**
6. Under **"Environment Variables"**, add:
   - `MONGODB_URI` = Your MongoDB connection string
   - `NEXTAUTH_SECRET` = Your generated secret
   - `GOOGLE_CLIENT_ID` = Your Google Client ID
   - `GOOGLE_CLIENT_SECRET` = Your Google Client Secret
   - `ADMIN_EMAIL` = Your email
   - `NEXTAUTH_URL` = `https://your-project.vercel.app` (Vercel will auto-assign)
7. Click **"Deploy"**

### Find Your Vercel URL

After deployment, Vercel will show your URL (e.g., `https://poertfolio-7h2j.vercel.app`).

### Update Google OAuth Redirect

1. Go back to [Google Cloud Console](https://console.cloud.google.com)
2. Go to **"Credentials"** → Your OAuth 2.0 client
3. Add your Vercel URL to **"Authorized redirect URIs"**:
   ```
   https://your-project.vercel.app/api/auth/callback/google
   ```
4. Save

---

## Step 5: Security Checklist

- [ ] MongoDB credentials are strong (20+ characters, mix of letters/numbers/symbols)
- [ ] `NEXTAUTH_SECRET` is a random 32-character string
- [ ] `.env.local` is in `.gitignore` (never committed)
- [ ] Admin email is set correctly
- [ ] Only your email can access `/admin`
- [ ] Database requires authentication
- [ ] All environment variables are set on Vercel
- [ ] Middleware protects `/admin/*` routes
- [ ] Public APIs (`/api/projects`, etc.) allow GET only
- [ ] Admin APIs (`/api/admin/*`) check JWT token and email

---

## Managing Content

### Sign In

Navigate to `https://your-domain.vercel.app/admin` and sign in with Google.

### Admin Routes

- `/admin` - Dashboard
- `/admin/projects` - Manage projects
- `/admin/experience` - Manage work experience
- `/admin/certificates` - Manage certifications
- `/admin/articles` - Manage published articles

### Public Routes

- `/` - Homepage with all content
- `/api/projects` - JSON API for projects
- `/api/experience` - JSON API for experience
- `/api/certificates` - JSON API for certificates
- `/api/articles` - JSON API for articles

---

## Troubleshooting

### "MongoDB connection failed"
- Check `MONGODB_URI` in Vercel environment variables
- Verify database user credentials in MongoDB Atlas
- Confirm IP whitelist includes `0.0.0.0/0`

### "OAuth sign-in fails"
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Check redirect URL is added to Google Cloud Console
- Ensure `NEXTAUTH_URL` matches your Vercel domain

### "Access Denied" after sign-in
- Verify `ADMIN_EMAIL` matches the email you're signing in with
- Check it's an exact match (case-sensitive)

### Site is slow or has errors
- Check Vercel deployment logs
- Verify all environment variables are set
- Test locally with `npm run dev`

---

## Custom Domain (Optional)

1. Go to your Vercel project settings
2. In the **"Domains"** section, add your custom domain
3. Follow Vercel's DNS setup instructions
4. Update `NEXTAUTH_URL` to your custom domain in Vercel environment variables
5. Update Google OAuth redirect to your custom domain

---

## Need Help?

- [Next.js Docs](https://nextjs.org/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Vercel Docs](https://vercel.com/docs)
