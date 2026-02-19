# Supabase Setup Instructions

This document contains the SQL commands needed to set up your Supabase database for the portfolio.

## Articles Table

Run this SQL command in your Supabase SQL Editor to create the articles table:

### Steps:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query** button
5. Paste the SQL below and click **Run**

### SQL Command:

```sql
CREATE TABLE articles (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  tags TEXT[],
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_articles_created_at ON articles(created_at DESC);
```

## Experiences Table

Run this SQL command to create the experiences table:

```sql
CREATE TABLE experiences (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date TEXT DEFAULT 'Present',
  description TEXT,
  highlights TEXT[],
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_experiences_start_date ON experiences(start_date DESC);
```

### Add tags column to existing table (if needed):
If you already created the experiences table without the tags column, run this migration:

```sql
ALTER TABLE experiences ADD COLUMN tags TEXT[] DEFAULT ARRAY[]::TEXT[];
```

## Certificates Table

Run this SQL command to create the certificates table:

```sql
CREATE TABLE certificates (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE NOT NULL,
  credential_url TEXT,
  description TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_certificates_issue_date ON certificates(issue_date DESC);
```

### Add tags column to existing certificates table (if needed):
If you already created the certificates table without the tags column, run this migration:

```sql
ALTER TABLE certificates ADD COLUMN tags TEXT[] DEFAULT ARRAY[]::TEXT[];
```

## Using the Experience System

### For Admins:
- **Manage Experience**: Go to `/admin/experience` in your portfolio
- **Create**: Fill out the form with:
  - **Job Title** (required) - e.g., "Senior AI Engineer"
  - **Organization** (required) - e.g., "Tech Company"
  - **Location** (optional) - e.g., "San Francisco, CA"
  - **Start Date** (required)
  - **End Date** - Select "Present" or specify date
  - **Description** (optional) - Short paragraph about the role
  - **Key Highlights** (optional) - Bullet points (one per line)
  - **Technologies/Skills** (optional) - Comma-separated tech stack (e.g., "Python, TensorFlow, React, Node.js")
- **Edit/Delete**: Use the action buttons on the experience list

### For Visitors:
- Experiences are displayed on the homepage in chronological order (newest first)
- Each experience card shows:
  - Job title and organization name
  - Location (if provided)
  - Date range (Start Date - End Date or "Present")
  - Description
  - Key highlights with checkmark bullets
  - Technologies/skills with visual tags (if provided)
  - Smooth animations and hover effects

## Features:
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Chronological sorting (newest/current positions first)
- ✅ Support for "Present" as end date
- ✅ Bullet points/highlights support
- ✅ Admin-only access (protected by JWT)
- ✅ Responsive card layout
- ✅ Server-side rendering for performance

## Quick Links:
- Admin Dashboard: `/admin`
- Experience Management: `/admin/experience`
- Articles Management: `/admin/articles`
- Projects Management: `/admin/projects`
- Public Homepage: `/` (all sections displayed)
- API Endpoints:
  - GET `/api/experience` - Fetch all experiences
  - POST `/api/admin/experience` - Create experience (admin only)
  - PUT `/api/admin/experience` - Update experience (admin only)
  - DELETE `/api/admin/experience?id={id}` - Delete experience (admin only)

