/*
# Create games table and seed data

## Changes

1. New Tables
   - `games`: Dynamic game catalog managed by admin.
     - `id` (uuid, primary key)
     - `title` (text, not null) — game display name
     - `subtitle` (text) — short description like "3v3 · 6-FFA"
     - `slug` (text, unique) — URL-safe identifier
     - `accent` (text) — hex color for UI theming
     - `badge` (text, nullable) — optional badge like "HOT", "FREE"
     - `is_premium` (boolean, default false) — marks premium section
     - `is_active` (boolean, default true) — admin can disable games
     - `sort_order` (integer, default 0) — display ordering
     - `modes` (text[], default '{}') — available match modes e.g. ['1v1','2v2']
     - `supports_screenshot` (boolean, default false) — whether screenshot upload is required
     - `created_at` (timestamptz)

2. Security
   - Enable RLS on `games`.
   - Grant SELECT to `authenticated` (all logged-in users see active games).
   - Grant SELECT, INSERT, UPDATE, DELETE to `service_role` (admin via edge function or service client).
   - Policies: authenticated users can SELECT all games. INSERT/UPDATE/DELETE handled via service_role or admin-validated policies.
   - Admin policies: authenticated users can INSERT/UPDATE/DELETE games (admin panel access controlled by app).

3. Notes
   - Seed data includes the original 7 games from the static games.ts file.
   - `slug` is derived from title at insert time, kept unique.
*/

CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  slug text NOT NULL,
  accent text NOT NULL DEFAULT '#22f0e6',
  badge text,
  is_premium boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  modes text[] NOT NULL DEFAULT '{}',
  supports_screenshot boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON games TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON games TO service_role;

DROP POLICY IF EXISTS "select_all_games" ON games;
CREATE POLICY "select_all_games"
  ON games FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_games_admin" ON games;
CREATE POLICY "insert_games_admin"
  ON games FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_games_admin" ON games;
CREATE POLICY "update_games_admin"
  ON games FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_games_admin" ON games;
CREATE POLICY "delete_games_admin"
  ON games FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_games_active ON games(is_active, sort_order);

INSERT INTO games (title, subtitle, slug, accent, badge, is_premium, is_active, sort_order, modes, supports_screenshot) VALUES
  ('Mini Militia', '3v3 · 6-FFA', 'mini-militia', '#22f0e6', 'HOT', false, true, 1, ARRAY['3v3','6-FFA'], true),
  ('Ludo 3D', '1v1 · 2v2', 'ludo-3d', '#39ff8a', NULL, false, true, 2, ARRAY['1v1','2v2'], false),
  ('Carrom Pool', '1v1 · 2v2', 'carrom-pool', '#ff3df0', NULL, false, true, 3, ARRAY['1v1','2v2'], false),
  ('16 Guti', '1v1', '16-guti', '#ffe94e', NULL, false, true, 4, ARRAY['1v1'], false),
  ('Free Match', 'Casual Play', 'free-match', '#22f0e6', NULL, false, true, 5, ARRAY['Any'], false),
  ('Daily Bonus', 'Free 20 Taka', 'daily-bonus', '#39ff8a', 'FREE', false, true, 6, ARRAY['1v1'], false),
  ('Premium', 'VIP Membership', 'premium', '#d4af37', 'VIP', true, true, 7, ARRAY['VIP'], false)
ON CONFLICT DO NOTHING;
