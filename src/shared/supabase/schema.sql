-- =============================================================================
-- Expensy App — Supabase Database Schema
-- =============================================================================
--
-- Setup Instructions:
-- 1. Open your Supabase project dashboard at https://app.supabase.com
-- 2. Navigate to the SQL Editor
-- 3. Paste this entire file and click "Run"
-- 4. Verify tables were created under Table Editor
-- 5. Ensure RLS is enabled (green shield icon) on both tables
--
-- Prerequisites:
-- - A Supabase project with Auth enabled
-- - Users sign up via the app (auth.users is managed by Supabase Auth)
--
-- =============================================================================

-- Balances table
CREATE TABLE IF NOT EXISTS balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- Row Level Security Policies
-- =============================================================================

ALTER TABLE balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Balances: users can only access their own balance
CREATE POLICY "Users can view own balance"
  ON balances FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own balance"
  ON balances FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own balance"
  ON balances FOR UPDATE
  USING (auth.uid() = user_id);

-- Expenses: users can only access their own expenses
CREATE POLICY "Users can view own expenses"
  ON expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- Indexes
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_balances_user_id ON balances(user_id);
