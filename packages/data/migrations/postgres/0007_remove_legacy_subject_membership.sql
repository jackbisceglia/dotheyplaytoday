-- Contract phase: deploy only after migration 0006 and the nested-reader code
-- are live and all flat-only worker invocations have retired.
-- Remove legacy fields from existing subjects even if absent from the catalog.
-- Event leagueId fields are a separate model and are intentionally unchanged.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM subjects
    WHERE details ?| ARRAY['leagueId', 'conferenceId']
      AND (
        jsonb_typeof(details->'league') IS DISTINCT FROM 'object'
        OR details->>'_tag' IS DISTINCT FROM _tag
        OR (
          CASE
            WHEN _tag IN ('mma_fighter', 'mma_tracking')
              THEN details#>>'{league,id}' = 'ufc'
            WHEN _tag = 'sports_team' THEN
              CASE details#>>'{league,id}'
                WHEN 'nba' THEN details#>>'{league,conferenceId}' IN ('east', 'west')
                WHEN 'nhl' THEN details#>>'{league,conferenceId}' IN ('east', 'west')
                WHEN 'nfl' THEN details#>>'{league,conferenceId}' IN ('afc', 'nfc')
                WHEN 'mlb' THEN details#>>'{league,conferenceId}' IN ('al', 'nl')
                WHEN 'ncaam' THEN details#>>'{league,conferenceId}' IN (
                  'acc', 'aac', 'a10', 'big-east', 'big-ten', 'big-12',
                  'mac', 'mvc', 'mountain-west', 'pac-12', 'sec', 'wcc'
                )
                ELSE false
              END
            ELSE false
          END
        ) IS NOT TRUE
      )
  ) THEN
    RAISE EXCEPTION 'Subject membership cleanup requires valid nested membership; repair affected subjects before retrying';
  END IF;
END;
$$;

--> statement-breakpoint

UPDATE subjects
SET details = details - 'leagueId' - 'conferenceId'
WHERE _tag IN ('sports_team', 'mma_fighter', 'mma_tracking')
  AND details ?| ARRAY['leagueId', 'conferenceId'];
