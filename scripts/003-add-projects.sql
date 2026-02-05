-- Add projects column to vibecoders (JSON array of {name, url})
ALTER TABLE vibecoders ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]'::jsonb;

-- Update demo data with sample projects
UPDATE vibecoders SET projects = '[
  {"name": "PhotoAI", "url": "https://photoai.com"},
  {"name": "Nomad List", "url": "https://nomadlist.com"}
]'::jsonb WHERE user_id = (SELECT id FROM profiles WHERE twitter_handle = 'levelsio');

UPDATE vibecoders SET projects = '[
  {"name": "ShipFast", "url": "https://shipfa.st"},
  {"name": "ByeDispute", "url": "https://byedispute.com"}
]'::jsonb WHERE user_id = (SELECT id FROM profiles WHERE twitter_handle = 'marc_louvion');

UPDATE vibecoders SET projects = '[
  {"name": "Headshot Pro", "url": "https://headshotpro.com"}
]'::jsonb WHERE user_id = (SELECT id FROM profiles WHERE twitter_handle = 'dannypostmaa');
