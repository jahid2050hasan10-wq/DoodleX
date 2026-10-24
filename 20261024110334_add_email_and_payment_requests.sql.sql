/*
# Add email to profiles and create payment_requests table

## Changes

1. Modified Tables
   - `profiles`: Added `email` column (text, nullable) to display user email alongside username.

2. New Tables
   - `payment_requests`: Stores deposit and withdrawal requests with payment method details.
     - `id` (uuid, primary key)
     - `user_id` (uuid, references auth.users, defaults to auth.uid())
     - `type` (text: 'deposit' or 'withdraw')
     - `method` (text: 'bkash', 'nagad', 'rocket', 'upay')
     - `amount` (integer)
     - `trx_id` (text, transaction ID from payment provider)
     - `sender_number` (text, mobile number for sending/receiving)
     - `status` (text: 'pending', 'approved', 'rejected'; defaults to 'pending')
     - `created_at` (timestamptz, defaults to now())

3. Security
   - Enable RLS on `payment_requests`.
   - Grant SELECT, INSERT to `authenticated` (users create and view their own requests).
   - Grant SELECT, UPDATE to `service_role` (admin/approval via edge function or service client).
   - Policies: users can SELECT and INSERT their own payment requests only.
   - Added SELECT policy for profiles so users can see all profiles (for tournament participants).
   - Added INSERT policy for profiles so new users can create their profile on signup.

## Notes
1. The `email` column is nullable to avoid breaking existing rows.
2. `payment_requests.user_id` defaults to `auth.uid()` so inserts work without explicitly passing it.
3. Profile SELECT policy changed from own-only to all-authenticated so users can see who joined tournaments.
*/

-- Add email column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text;

-- Create payment_requests table
CREATE TABLE IF NOT EXISTS payment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('deposit', 'withdraw')),
  method text NOT NULL CHECK (method IN ('bkash', 'nagad', 'rocket', 'upay')),
  amount integer NOT NULL CHECK (amount > 0),
  trx_id text NOT NULL DEFAULT '',
  sender_number text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

-- Grants for payment_requests
GRANT SELECT, INSERT ON payment_requests TO authenticated;
GRANT SELECT, UPDATE ON payment_requests TO service_role;

-- Policies for payment_requests (user can see and create their own)
DROP POLICY IF EXISTS "select_own_payment_requests" ON payment_requests;
CREATE POLICY "select_own_payment_requests"
  ON payment_requests FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_payment_requests" ON payment_requests;
CREATE POLICY "insert_own_payment_requests"
  ON payment_requests FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Update profiles SELECT policy to allow all authenticated users to see profiles
-- (needed for tournament participant lists)
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
  ON profiles FOR SELECT
  TO authenticated USING (true);

-- Add INSERT policy for profiles so signup can create profile
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
  ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- Grant INSERT on profiles to authenticated
GRANT INSERT ON profiles TO authenticated;

-- Grant SELECT on payment_requests to service_role (admin reads all)
-- Already done above

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_payment_requests_user_id ON payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON payment_requests(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_match_participants_match_id ON match_participants(match_id);
