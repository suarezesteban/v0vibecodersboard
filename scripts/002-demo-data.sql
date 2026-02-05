-- Insert demo profiles
INSERT INTO profiles (id, twitter_handle, twitter_avatar, name) VALUES
  ('demo-1', 'levelsio', 'https://pbs.twimg.com/profile_images/1661045322646269952/dBnW3OxF_400x400.jpg', 'Pieter Levels'),
  ('demo-2', 'marc_louvion', 'https://pbs.twimg.com/profile_images/1514863683574599681/9k7PqDjA_400x400.jpg', 'Marc Lou'),
  ('demo-3', 'dannypostmaa', 'https://pbs.twimg.com/profile_images/1590049073427513345/3exaborZ_400x400.jpg', 'Danny Postma'),
  ('demo-4', 'taborguner', 'https://pbs.twimg.com/profile_images/1879595177882550272/uKZdKCeA_400x400.jpg', 'Tibo'),
  ('demo-5', 'kaborwot', 'https://pbs.twimg.com/profile_images/1850645367142121472/hKP38_R4_400x400.jpg', 'Kabir')
ON CONFLICT (id) DO NOTHING;

-- Insert demo vibecoders
INSERT INTO vibecoders (user_id, stack, bio, portfolio_url, github_url, available) VALUES
  ('demo-1', 'next.js, ai, postgres, tailwind', 'building in public. nomad. maker of photoai, interiorai', 'https://levelsio.com', 'https://github.com/levelsio', true),
  ('demo-2', 'next.js, supabase, stripe, ai', 'shipped 9 startups. writing about building', 'https://marclou.com', 'https://github.com/Marc-Lou-Org', true),
  ('demo-3', 'next.js, ai, design, tailwind', 'ai product designer. built headlime, profilepicture.ai', 'https://dannypostma.com', 'https://github.com/dannypostma', false),
  ('demo-4', 'react, node, ai, typescript', 'building tweethunter and taplio', 'https://tibo.io', null, true),
  ('demo-5', 'next.js, supabase, vercel, ai', 'design engineer. building cool stuff', 'https://kabir.sh', 'https://github.com/kabir', true)
ON CONFLICT DO NOTHING;

-- Add some demo endorsements
INSERT INTO endorsements (endorser_id, vibecoder_id) 
SELECT 'demo-2', v.id FROM vibecoders v JOIN profiles p ON v.user_id = p.id WHERE p.twitter_handle = 'levelsio'
ON CONFLICT DO NOTHING;

INSERT INTO endorsements (endorser_id, vibecoder_id) 
SELECT 'demo-3', v.id FROM vibecoders v JOIN profiles p ON v.user_id = p.id WHERE p.twitter_handle = 'levelsio'
ON CONFLICT DO NOTHING;

INSERT INTO endorsements (endorser_id, vibecoder_id) 
SELECT 'demo-1', v.id FROM vibecoders v JOIN profiles p ON v.user_id = p.id WHERE p.twitter_handle = 'marc_louvion'
ON CONFLICT DO NOTHING;

INSERT INTO endorsements (endorser_id, vibecoder_id) 
SELECT 'demo-4', v.id FROM vibecoders v JOIN profiles p ON v.user_id = p.id WHERE p.twitter_handle = 'dannypostmaa'
ON CONFLICT DO NOTHING;

INSERT INTO endorsements (endorser_id, vibecoder_id) 
SELECT 'demo-1', v.id FROM vibecoders v JOIN profiles p ON v.user_id = p.id WHERE p.twitter_handle = 'kaborwot'
ON CONFLICT DO NOTHING;
