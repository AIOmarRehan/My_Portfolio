# Omar Rehan | Portfolio

A modern, fully-responsive AI & Full-Stack Engineer portfolio built with Next.js, featuring an interactive admin dashboard, smooth animations, and a neon-themed design. This is a production-ready portfolio application with real-time database updates, secure authentication, and deployed on Vercel.

---

## Project Overview

This portfolio showcases:
- **Projects** - Machine Learning, Deep Learning, and Full-Stack applications
- **Experience** - Professional work history and roles (sorted by date)
- **Certifications** - Professional credentials and achievements
- **Articles** - Blog posts and technical writing
- **Admin Dashboard** - Secure backend to manage all content in real-time

---

## Tech Stack

### **Frontend Framework**
- **Next.js** - React meta-framework for production
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

### **Backend & Database**
- **Node.js** - Runtime environment
- **Next.js API Routes** - Serverless backend functions
- **Supabase** - PostgreSQL database with real-time capabilities
- **NextAuth** - Authentication layer with Google OAuth

### **UI & Styling**
- **React Icons** - Icon library (Font Awesome, Simple Icons)
  - `react-icons/fa` - Font Awesome icons
  - `react-icons/si` - Simple Icons
- **Tailwind CSS** - Responsive design utilities
- Custom neon theme: Cyan (`#00ffff`) and Magenta (`#ff00ff`)

### **Authentication & Security**
- **NextAuth.js** - OAuth 2.0 authentication
- **Google OAuth** - Single sign-on
- **ADMIN_EMAIL** validation for production security
- Environment-based access control (`NODE_ENV`)
- Middleware token validation

### **Additional Libraries**
- **date-fns** - Date formatting and manipulation
- **axios** - HTTP client (optional, can use fetch)

### **Deployment & DevOps**
- **Vercel** - Hosting platform (auto-deployment from GitHub)
- **GitHub** - Version control
- **Environment Variables** - `.env.local` for secrets

---

## Project Structure

```
MyPortfolio/
├── app/                              # Next.js App Directory
│   ├── admin/                        # Admin Dashboard
│   │   ├── projects/page.tsx         # Project management
│   │   ├── experience/page.tsx       # Experience management
│   │   ├── certifications/page.tsx   # Certificates management
│   │   ├── articles/page.tsx         # Articles management
│   │   └── layout.tsx                # Admin layout & Auth check
│   ├── api/                          # Backend API Routes
│   │   ├── projects/route.ts         # Project CRUD
│   │   ├── experience/route.ts       # Experience CRUD
│   │   ├── certifications/route.ts   # Certificates CRUD
│   │   ├── articles/route.ts         # Articles CRUD
│   │   ├── admin/                    # Admin-only routes
│   │   └── auth/[...nextauth]/       # NextAuth configuration
│   ├── layout.tsx                    # Root layout with metadata
│   ├── page.tsx                      # Home page
│   └── globals.css                   # Global styles
├── components/                       # React Components
│   ├── Header.tsx                    # Navigation header
│   ├── Footer.tsx                    # Footer with social links
│   ├── ScrollToTop.tsx               # Scroll-to-top button
│   ├── ScrollProgress.tsx            # Progress bar
│   ├── InteractiveBackground.tsx     # Particles + custom cursor
│   ├── TagSearchInput.tsx            # Tag autocomplete
│   ├── SessionProvider.tsx           # NextAuth provider
│   └── ...                           # Other components
├── lib/                              # Utility functions
│   ├── supabase.ts                   # Supabase client
│   ├── auth.ts                       # Authentication helpers
│   └── ...
├── models/                           # Database models/schemas
├── data/                             # Static data files
├── public/                           # Static assets
│   ├── app-logo.png                  # Logo
│   ├── favicon.ico                   # Favicon
│   ├── favicon-*.png                 # Favicon variants
│   ├── apple-touch-icon-*.png        # Apple touch icons
│   └── ...
├── middleware.ts                     # Next.js middleware
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # Tailwind CSS config
├── tsconfig.json                     # TypeScript config
├── package.json                      # Dependencies
├── .env.local                        # Environment variables (secret)
└── README.md                     # This file
```

---

## Key Features

### **1. Interactive UI**
- Custom neon gradient cursor (hidden on touch devices)
- Animated particle background
- Smooth scroll-to-top button (fades in/out)
- Progress bar showing scroll position
- Hero section with animated borders
- 100% responsive mobile design

### **2. Smooth Navigation**
- Anchor navigation with smooth scrolling
- Fixed header (96px offset for content)
- Quick-link navigation in header
- Logo click scrolls to top
- Click-to-close mobile menu

### **3. Admin Dashboard**
- Secure authentication (Google OAuth)
- Project management (CRUD operations)
- Experience management with date sorting
- Certificate management
- Article management
- Tag autocomplete system
- Image upload/URL support
- Real-time database updates

### **4. Data Management**
- Experience sorted by date (Present → Past)
- Certificates sorted by date (Recent → Oldest)
- Tag-based filtering and search
- Full-width project descriptions
- Dynamic content rendering

### **5. Performance & Security**
- `force-dynamic` flag for instant updates
- `revalidate = 0` for live data
- Middleware token validation
- Production security (hidden admin routes)
- `/admin` returns 404 in production
- ADMIN_EMAIL validation

### **6. Mobile Responsiveness**
- Full-width on phones (`max-w-none`)
- Max-width on tablet/desktop (`md:max-w-6xl`)
- Touch device cursor handling
- Stacked layout on mobile
- Optimized touch interactions
- Responsive typography and spacing

---

## Getting Started

### **Prerequisites**
- Node.js >= 18
- npm or yarn
- GitHub account
- Supabase account
- Google OAuth credentials

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/AIOmarRehan/MyPortfolio.git
cd MyPortfolio
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=my_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=my_anon_key
SUPABASE_SERVICE_ROLE_KEY=my_service_role_key

NEXTAUTH_SECRET=generate_a_secret
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=my_google_client_id
GOOGLE_CLIENT_SECRET=my_google_client_secret

ADMIN_EMAIL=my_admin_email@gmail.com
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

---

## Database Schema

### **Projects Table**
```sql
id (integer) - Primary key
title (string) - Project title
description (string) - Project description
url (string) - GitHub/link URL
tags (array) - Technology tags
image (string) - Project image URL
created_at (timestamp)
```

### **Experience Table**
```sql
id (integer) - Primary key
title (string) - Job title
company (string) - Company name
start_date (date) - Start date
end_date (date) - End date (null if current)
description (string) - Job description
tags (array) - Skills/technologies
created_at (timestamp)
```

### **Certifications Table**
```sql
id (integer) - Primary key
title (string) - Certification name
issuer (string) - Issuing organization
issue_date (date) - Date earned
url (string) - Certificate link
created_at (timestamp)
```

### **Articles Table**
```sql
id (integer) - Primary key
title (string) - Article title
content (text) - Article content
url (string) - Article URL
tags (array) - Topic tags
published_date (date) - Publication date
created_at (timestamp)
```

---

## Authentication Flow

1. User clicks "Sign In" button
2. NextAuth redirects to Google OAuth
3. User authenticates with Google
4. NextAuth validates against `ADMIN_EMAIL`
5. Session token issued
6. Admin routes check session validity
7. Middleware validates token on protected routes

---

## API Endpoints

### **Public Endpoints**
```
GET  /api/projects          - Fetch all projects
GET  /api/experience        - Fetch all experience
GET  /api/certifications    - Fetch all certifications
GET  /api/articles          - Fetch all articles
```

### **Protected Endpoints (Admin Only)**
```
POST   /api/admin/projects       - Create project
PUT    /api/admin/projects       - Update project
DELETE /api/admin/projects?id=   - Delete project

POST   /api/admin/experience     - Create experience
PUT    /api/admin/experience     - Update experience
DELETE /api/admin/experience?id= - Delete experience

POST   /api/admin/certifications - Create certificate
PUT    /api/admin/certifications - Update certificate
DELETE /api/admin/certifications - Delete certificate

POST   /api/admin/articles       - Create article
PUT    /api/admin/articles       - Update article
DELETE /api/admin/articles       - Delete article
```

---

## Design System

### **Color Palette**
- **Primary Neon**: Cyan `#00ffff`
- **Secondary Neon**: Magenta `#ff00ff`
- **Background**: Dark Gray `#0f0c29`, `#302b63`, `#24243e`
- **Cards**: White `bg-white` with `border-gray-200`
- **Text**: Light Gray `text-gray-100` (light), Black `text-black` (admin)

### **Typography**
- **Font**: System fonts (Tailwind defaults)
- **Headings**: Bold, semibold
- **Body**: Regular
- **Small text**: `text-xs`, `text-sm`

### **Spacing (Tailwind)**
- Padding: `px-4 sm:px-6`, `py-6 sm:py-8`
- Gaps: `gap-4`, `gap-6`
- Margins: `mb-3`, `mb-4`, `mt-2`

### **Animations**
- Smooth scroll: `scroll-behavior: smooth`
- Button hover: `hover:scale-110 transition`
- Fade animations: `opacity-0 → opacity-100`
- Neon shift: `@keyframes neonShift` (3s infinite)

---

## Dependencies Overview

| Package | Version | Purpose |
|---------|---------|---------|
| next | Latest | React framework |
| react | Latest | UI library |
| typescript | Latest  | Type safety |
| tailwindcss | Latest  | CSS framework |
| next-auth | Latest  | Authentication |
| @supabase/supabase-js | Latest | Database client |
| react-icons | Latest | Icon library |
| date-fns | Latest | Date utilities |

---

## Deployment

### **Deploy to Vercel**

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Auto-deploy on every push to main branch

### **Environment Variables for Production**
```env
NEXT_PUBLIC_SUPABASE_URL=production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=production_key
SUPABASE_SERVICE_ROLE_KEY=production_service_key
NEXTAUTH_SECRET=generate_secure_secret
NEXTAUTH_URL=https://my-domain.com
GOOGLE_CLIENT_ID=production_id
GOOGLE_CLIENT_SECRET=production_secret
ADMIN_EMAIL=my_email@gmail.com
NODE_ENV=production
```

### **Production Security Features**
- Admin routes return 404 in production
- Token validation on all protected routes
- ADMIN_EMAIL validation
- Environment-based access control
- Middleware authentication checks

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code (if configured)
npm run format
```

---

## Key Learnings & Implementation Details

### **1. Scroll-to-Top Button**
- Uses `window.scrollY` to detect scroll position
- Threshold set at 300px
- Smooth animation with CSS transitions
- Z-index set to 50 for visibility
- Fades in/out with opacity transitions

### **2. Progress Bar**
- Calculates scroll percentage: `(scrolled / total_height) × 100`
- Updates on every scroll event
- 0.15s transition for smooth width animation
- Neon gradient with glow effect
- Z-index 50 (top of page)

### **3. Custom Cursor**
- Uses media query detection: `(hover: hover) and (pointer: fine)`
- Disabled on touch devices
- Fixed positioning at `(clientX, clientY)`
- Changes size/shape based on element hover
- Pointer events set to `none` (doesn't block clicks)

### **4. Responsive Design**
- Mobile-first approach
- Breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px)
- Full-width on phones, constrained on desktop
- `scroll-margin-top: 96px` for fixed header offset
- Content padding adjusted per screen size

### **5. Real-time Updates**
- `force-dynamic` prevents caching
- `revalidate = 0` for instant DB sync
- Fetch with `credentials: 'include'` for auth
- Form resets after successful submission

---

## Testing

### **Admin Dashboard Testing**
1. Sign in with Google OAuth
2. Navigate to `/admin/projects`
3. Create a new project
4. Upload/link an image
5. Add tags (tested autocomplete)
6. View, edit, and delete operations
7. Verify data appears on homepage

### **Responsive Testing**
1. DevTools mobile view
2. Test on actual devices (phone, tablet)
3. Verify all images load correctly
4. Check touch interactions
5. Test landscape/portrait orientations

---

## Known Limitations & Solutions

| Issue | Solution |
|-------|----------|
| Favicon looks odd | Image must be square (512x512 recommended) |
| Scrollbar visible briefly | Now hidden, replaced with progress bar |
| Page shifts on scroll | `scrollbar-gutter: stable` prevents shifts |
| Custom cursor on touch | Media query disables on coarse pointers |
| Slow DB queries | Added `force-dynamic` & `revalidate = 0` |

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Guide](https://supabase.com/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [React Icons Library](https://react-icons.github.io/react-icons)

---

## Author

**Omar Rehan**
- Email: ai.omar.rehan@gmail.com
- GitHub: [@AIOmarRehan](https://github.com/AIOmarRehan)
- LinkedIn: [Omar Rehan](https://linkedin.com/in/omar-rehan-47b98636a)
- Portfolio: [Omar Rehan Portfolio](https://omar-rehan.vercel.app)

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.