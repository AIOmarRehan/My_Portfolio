# 🌐 AI Engineer Portfolio

A secure, full-stack portfolio website built with **Next.js + TypeScript + Tailwind**, featuring:

✅ **Public Portfolio** - Display projects, experience, certifications, and articles  
✅ **Admin Panel** - Manage all content (create, edit, delete)  
✅ **Secure Authentication** - Google OAuth (invite-only)  
✅ **Free Stack** - Next.js (Vercel), MongoDB Atlas, 100% free  
✅ **Production-Ready** - TypeScript, security best practices, environment variables  

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `NEXTAUTH_SECRET`: A random 32-character secret (`openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
- `ADMIN_EMAIL`: Your email (only person who can access `/admin`)
- `NEXTAUTH_URL`: `http://localhost:3000` (for local dev)

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 4. Test Admin Panel

Navigate to http://localhost:3000/admin and sign in with Google.

---

## 📁 Project Structure

```
app/
├── page.tsx                 # Public homepage
├── layout.tsx              # Root layout with Tailwind
├── admin/                  # Admin pages (protected)
│   ├── page.tsx           # Admin dashboard
│   ├── projects/page.tsx  # Manage projects
│   ├── experience/page.tsx
│   ├── certificates/page.tsx
│   └── articles/page.tsx
├── api/
│   ├── projects/route.ts   # Public API (GET only)
│   ├── experience/route.ts
│   ├── certificates/route.ts
│   ├── articles/route.ts
│   ├── admin/             # Admin APIs
│   │   ├── projects/route.ts    # POST, PUT, DELETE
│   │   ├── experience/route.ts
│   │   ├── certificates/route.ts
│   │   └── articles/route.ts
│   └── auth/[...nextauth]/route.ts  # NextAuth handler
lib/
├── mongodb.ts             # Mongoose connection
├── auth.ts               # NextAuth config (Google OAuth)
models/
├── Project.ts            # Mongoose schema
├── Experience.ts
├── Certificate.ts
└── Article.ts
```

---

## 🔐 Security Features

- **Authentication**: Google OAuth only (no password storage)
- **Authorization**: JWT-based sessions; only `ADMIN_EMAIL` can access `/admin`
- **Middleware**: Protects `/admin/*` routes and `/api/admin/*` endpoints
- **Database**: All DB operations server-side only
- **Environment Variables**: Secrets never committed to git

---

## 📝 API Endpoints

### Public (GET only)

- `GET /api/projects` - List all projects
- `GET /api/experience` - List all experience
- `GET /api/certificates` - List all certificates
- `GET /api/articles` - List all articles

### Admin (Protected with JWT)

- `POST /api/admin/projects` - Create project
- `PUT /api/admin/projects` - Update project
- `DELETE /api/admin/projects?id=...` - Delete project
- *(Same pattern for experience, certificates, articles)*

---

## 🌍 Deploy to Vercel

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for step-by-step instructions to:

1. Set up MongoDB Atlas (free tier)
2. Configure Google OAuth
3. Deploy on Vercel (free hobby tier)
4. Add environment variables

---

## 📚 Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB (Atlas), Mongoose ORM
- **Auth**: NextAuth.js (Google OAuth)
- **Deployment**: Vercel
- **TypeScript**: Strict mode enabled

**Total cost**: $0 (100% free tier)

---

## 🛠️ Development

### Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Run ESLint
```

### Add New Content Model

1. Create schema in `models/MyModel.ts`
2. Add API route in `app/api/mymodel/route.ts` (public GET)
3. Add admin API in `app/api/admin/mymodel/route.ts` (POST, PUT, DELETE)
4. Add admin page in `app/admin/mymodel/page.tsx`
5. Display on homepage in `app/page.tsx`

---

## 🔗 Links

- [Next.js Docs](https://nextjs.org/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Vercel Docs](https://vercel.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 📄 License

MIT

---

**Ready to deploy?** Check out [DEPLOYMENT.md](DEPLOYMENT.md) for a complete setup guide.

