-- Add demo_video column to projects table
-- Run this SQL in your Supabase SQL Editor

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS demo_video TEXT;

COMMENT ON COLUMN projects.demo_video IS 'Path to demo video stored in /public/demos folder';
