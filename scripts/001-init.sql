-- Profiles table (created when user logs in with X)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  twitter_handle TEXT UNIQUE NOT NULL,
  twitter_avatar TEXT,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vibecoders table (users who join the board)
CREATE TABLE IF NOT EXISTS vibecoders (
  id SERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bio TEXT,
  stack TEXT,
  portfolio_url TEXT,
  github_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Endorsements table
CREATE TABLE IF NOT EXISTS endorsements (
  id SERIAL PRIMARY KEY,
  endorser_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vibecoder_id INTEGER NOT NULL REFERENCES vibecoders(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(endorser_id, vibecoder_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vibecoders_user_id ON vibecoders(user_id);
CREATE INDEX IF NOT EXISTS idx_endorsements_vibecoder_id ON endorsements(vibecoder_id);
CREATE INDEX IF NOT EXISTS idx_endorsements_endorser_id ON endorsements(endorser_id);
