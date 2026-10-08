-- MMA cards may have only a published date, or no confirmed date yet.
-- JSON details and text discriminants already support additional variants.
ALTER TABLE events ALTER COLUMN starts_at DROP NOT NULL;
ALTER TABLE events ADD CONSTRAINT events_known_sports_start
  CHECK (_tag = 'mma_card' OR starts_at IS NOT NULL);
