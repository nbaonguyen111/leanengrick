-- Fix RLS policies for NoiNhanh
-- Copy and run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Allow anon select groups" ON groups;
DROP POLICY IF EXISTS "Allow anon select phrases" ON phrases;
DROP POLICY IF EXISTS "Allow anon all custom_groups" ON custom_groups;
DROP POLICY IF EXISTS "Allow anon all custom_phrases" ON custom_phrases;
DROP POLICY IF EXISTS "Allow anon all favorites" ON favorites;

-- Recreate with correct syntax
CREATE POLICY "anon_select_groups" ON groups FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_groups" ON groups FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_groups" ON groups FOR UPDATE TO anon USING (true);
CREATE POLICY "anon_delete_groups" ON groups FOR DELETE TO anon USING (true);

CREATE POLICY "anon_select_phrases" ON phrases FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_phrases" ON phrases FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_phrases" ON phrases FOR UPDATE TO anon USING (true);
CREATE POLICY "anon_delete_phrases" ON phrases FOR DELETE TO anon USING (true);

CREATE POLICY "anon_select_custom_groups" ON custom_groups FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_custom_groups" ON custom_groups FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_custom_groups" ON custom_groups FOR UPDATE TO anon USING (true);
CREATE POLICY "anon_delete_custom_groups" ON custom_groups FOR DELETE TO anon USING (true);

CREATE POLICY "anon_select_custom_phrases" ON custom_phrases FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_custom_phrases" ON custom_phrases FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_custom_phrases" ON custom_phrases FOR UPDATE TO anon USING (true);
CREATE POLICY "anon_delete_custom_phrases" ON custom_phrases FOR DELETE TO anon USING (true);

CREATE POLICY "anon_select_favorites" ON favorites FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_favorites" ON favorites FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_favorites" ON favorites FOR UPDATE TO anon USING (true);
CREATE POLICY "anon_delete_favorites" ON favorites FOR DELETE TO anon USING (true);