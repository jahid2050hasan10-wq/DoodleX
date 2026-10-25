import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase env vars. Please connect your Supabase project.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Game = {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  accent: string;
  badge: string | null;
  is_premium: boolean;
  is_active: boolean;
  sort_order: number;
  modes: string[];
  supports_screenshot: boolean;
  thumbnail_theme: string | null;
  created_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  is_active: boolean;
  created_at: string;
};

export type Profile = {
  id: string;
  username: string;
  email: string | null;
  phone: string;
  balance: number;
  matches_played: number;
  matches_won: number;
   status: string;
  is_admin: boolean;
  banned: boolean;
  created_at: string;
};

export type MatchRow = {
  id: string;
  game_id: string;
  label: string;
  mode: string;
  entry_fee: number;
  first_prize: number;
  second_prize: number;
  slots_filled: number;
  slots_total: number;
  status: string;
  created_by: string | null;
  created_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  type: string;
  label: string;
  amount: number;
  status: string;
  match_id: string | null;
  created_at: string;
};

export type PaymentRequestRow = {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdraw';
  method: string;
  amount: number;
  trx_id: string;
  sender_number: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};
