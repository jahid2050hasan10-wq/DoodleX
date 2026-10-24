/*
# Add thumbnail_theme to games and create announcements table

## Changes

1. Modified Tables
   - `games`: Added `thumbnail_theme` (text, nullable) — names a specific thumbnail art style per game.
     When NULL, the thumbnail auto-generates from the game title hash.

2. New Tables
   - `announcements`: Admin-created announcements displayed to users.
     - `id` (uuid, primary key)
     - `title` (text, not null)
     - `body` (text, not null)
     - `is_active` (boolean, default true) — admin can dismiss announcements
     - `created_at` (timestamptz)

3. Security
   - Enable RLS on `announcements`.
   - Grant SELECT to `authenticated` (all logged-in users see active announcements).
   - Grant SELECT, INSERT, UPDATE, DELETE to `authenticated` (admin manages announcements).
   - Policies: authenticated users can SELECT all announcements; INSERT/UPDATE/DELETE allowed for authenticated (admin panel).

4. Notes
   - `thumbnail_theme` values: 'military', 'ludo', 'carrom', 'guti', 'free', 'premium', or NULL for auto-detect.
   - Existing seeded games get explicit themes.
*/

ALTER TABLE games ADD COLUMN IF NOT EXISTS thumbnail_theme text;

CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON announcements TO authenticated;

DROP POLICY IF EXISTS "select_all_announcements" ON announcements;
CREATE POLICY "select_all_announcements"
  ON announcements FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_announcements" ON announcements;
CREATE POLICY "insert_announcements"
  ON announcements FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_announcements" ON announcements;
CREATE POLICY "update_announcements"
  ON announcements FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_announcements" ON announcements;
CREATE POLICY "delete_announcements"
  ON announcements FOR DELETE
  TO authenticated USING (true);

-- Assign explicit themes to existing seeded games
UPDATE games SET thumbnail_theme = 'military' WHERE slug = 'mini-militia';
UPDATE games SET thumbnail_theme = 'ludo' WHERE slug = 'ludo-3d';
UPDATE games SET thumbnail_theme = 'carrom' WHERE slug = 'carrom-pool';
UPDATE games SET thumbnail_theme = 'guti' WHERE slug = '16-guti';
UPDATE games SET thumbnail_theme = 'free' WHERE slug = 'free-match';
UPDATE games SET thumbnail_theme = 'free' WHERE slug = 'daily-bonus';
UPDATE games SET thumbnail_theme = 'premium' WHERE slug = 'premium';
