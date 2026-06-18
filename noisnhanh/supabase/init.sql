-- NoiNhanh Database Schema
-- Copy and paste this entire file into Supabase SQL Editor (https://supabase.com/dashboard/project/kpvsjtcixwstoqcdozop/sql/new)

-- 1. Groups (categories)
CREATE TABLE IF NOT EXISTS groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  name_en TEXT NOT NULL
);

-- 2. Built-in phrases
CREATE TABLE IF NOT EXISTS phrases (
  id BIGSERIAL PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES groups(id),
  english_text TEXT NOT NULL,
  vietnamese_text TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Custom groups (user-created sub-groups)
CREATE TABLE IF NOT EXISTS custom_groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  parent_group_id TEXT NOT NULL REFERENCES groups(id),
  author TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Custom phrases (user-created)
CREATE TABLE IF NOT EXISTS custom_phrases (
  id BIGSERIAL PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES groups(id),
  english_text TEXT NOT NULL,
  vietnamese_text TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  author TEXT NOT NULL DEFAULT '',
  custom_group_id TEXT REFERENCES custom_groups(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Favorites
CREATE TABLE IF NOT EXISTS favorites (
  id BIGSERIAL PRIMARY KEY,
  user_name TEXT NOT NULL,
  phrase_id BIGINT,
  custom_phrase_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_name, phrase_id),
  UNIQUE(user_name, custom_phrase_id)
);

-- Enable Row Level Security (mở cho phép anon key)
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE phrases ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_phrases ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read/write for all tables
CREATE POLICY "Allow anon select groups" ON groups FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon select phrases" ON phrases FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon all custom_groups" ON custom_groups FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all custom_phrases" ON custom_phrases FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all favorites" ON favorites FOR ALL TO anon USING (true) WITH CHECK (true);

-- Create index for faster search
CREATE INDEX IF NOT EXISTS idx_phrases_group_id ON phrases(group_id);
CREATE INDEX IF NOT EXISTS idx_custom_phrases_author ON custom_phrases(author);
CREATE INDEX IF NOT EXISTS idx_custom_phrases_group_id ON custom_phrases(group_id);
CREATE INDEX IF NOT EXISTS idx_custom_groups_parent ON custom_groups(parent_group_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_name);