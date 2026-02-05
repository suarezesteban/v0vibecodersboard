-- Delete demo endorsements first (foreign key constraint)
DELETE FROM endorsements WHERE vibecoder_id IN (
  SELECT id FROM vibecoders WHERE user_id IN (
    SELECT id FROM profiles WHERE twitter_handle IN ('levelsio', 'marc_louvion', 'dannypostmaa', 'taborguner', 'kaborwot')
  )
);

-- Delete demo vibecoders
DELETE FROM vibecoders WHERE user_id IN (
  SELECT id FROM profiles WHERE twitter_handle IN ('levelsio', 'marc_louvion', 'dannypostmaa', 'taborguner', 'kaborwot')
);

-- Delete demo profiles
DELETE FROM profiles WHERE twitter_handle IN ('levelsio', 'marc_louvion', 'dannypostmaa', 'taborguner', 'kaborwot');
