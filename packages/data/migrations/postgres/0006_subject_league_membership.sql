-- Expand existing subject JSON before deploying nested-membership readers.
-- Keep leagueId/conferenceId so the previous workers can still decode these
-- rows during deployment. A later catalog-version bump writes nested-only JSON
-- after all old workers have retired. Do not combine that seed with this rollout.
-- This migration updates existing rows only: no NCAA subjects, users,
-- subscriptions, events, or feeds are inserted, deleted, or reassigned.

-- Reviewed affiliations for the 124 existing professional team subject IDs.
-- These are a fixed migration snapshot, not inferred from names or UUID ranges.
WITH affiliations (league_id, conference_id, subject_ids) AS (
  VALUES
    ('nba', 'east', ARRAY[
      '00000000-0000-4000-8000-000000000101', -- Atlanta Hawks
      '00000000-0000-4000-8000-000000000102', -- Boston Celtics
      '00000000-0000-4000-8000-000000000103', -- Brooklyn Nets
      '00000000-0000-4000-8000-000000000104', -- Charlotte Hornets
      '00000000-0000-4000-8000-000000000105', -- Chicago Bulls
      '00000000-0000-4000-8000-000000000106', -- Cleveland Cavaliers
      '00000000-0000-4000-8000-000000000109', -- Detroit Pistons
      '00000000-0000-4000-8000-000000000112', -- Indiana Pacers
      '00000000-0000-4000-8000-000000000116', -- Miami Heat
      '00000000-0000-4000-8000-000000000117', -- Milwaukee Bucks
      '00000000-0000-4000-8000-000000000120', -- New York Knicks
      '00000000-0000-4000-8000-000000000122', -- Orlando Magic
      '00000000-0000-4000-8000-000000000123', -- Philadelphia 76ers
      '00000000-0000-4000-8000-000000000128', -- Toronto Raptors
      '00000000-0000-4000-8000-000000000130'  -- Washington Wizards
    ]),
    ('nba', 'west', ARRAY[
      '00000000-0000-4000-8000-000000000107', -- Dallas Mavericks
      '00000000-0000-4000-8000-000000000108', -- Denver Nuggets
      '00000000-0000-4000-8000-000000000110', -- Golden State Warriors
      '00000000-0000-4000-8000-000000000111', -- Houston Rockets
      '00000000-0000-4000-8000-000000000113', -- LA Clippers
      '00000000-0000-4000-8000-000000000114', -- Los Angeles Lakers
      '00000000-0000-4000-8000-000000000115', -- Memphis Grizzlies
      '00000000-0000-4000-8000-000000000118', -- Minnesota Timberwolves
      '00000000-0000-4000-8000-000000000119', -- New Orleans Pelicans
      '00000000-0000-4000-8000-000000000121', -- Oklahoma City Thunder
      '00000000-0000-4000-8000-000000000124', -- Phoenix Suns
      '00000000-0000-4000-8000-000000000125', -- Portland Trail Blazers
      '00000000-0000-4000-8000-000000000126', -- Sacramento Kings
      '00000000-0000-4000-8000-000000000127', -- San Antonio Spurs
      '00000000-0000-4000-8000-000000000129'  -- Utah Jazz
    ]),
    ('nfl', 'afc', ARRAY[
      '00000000-0000-4000-8000-000000000203', -- Baltimore Ravens
      '00000000-0000-4000-8000-000000000204', -- Buffalo Bills
      '00000000-0000-4000-8000-000000000207', -- Cincinnati Bengals
      '00000000-0000-4000-8000-000000000208', -- Cleveland Browns
      '00000000-0000-4000-8000-000000000210', -- Denver Broncos
      '00000000-0000-4000-8000-000000000213', -- Houston Texans
      '00000000-0000-4000-8000-000000000214', -- Indianapolis Colts
      '00000000-0000-4000-8000-000000000215', -- Jacksonville Jaguars
      '00000000-0000-4000-8000-000000000216', -- Kansas City Chiefs
      '00000000-0000-4000-8000-000000000217', -- Las Vegas Raiders
      '00000000-0000-4000-8000-000000000218', -- Los Angeles Chargers
      '00000000-0000-4000-8000-000000000220', -- Miami Dolphins
      '00000000-0000-4000-8000-000000000222', -- New England Patriots
      '00000000-0000-4000-8000-000000000225', -- New York Jets
      '00000000-0000-4000-8000-000000000227', -- Pittsburgh Steelers
      '00000000-0000-4000-8000-000000000231'  -- Tennessee Titans
    ]),
    ('nfl', 'nfc', ARRAY[
      '00000000-0000-4000-8000-000000000201', -- Arizona Cardinals
      '00000000-0000-4000-8000-000000000202', -- Atlanta Falcons
      '00000000-0000-4000-8000-000000000205', -- Carolina Panthers
      '00000000-0000-4000-8000-000000000206', -- Chicago Bears
      '00000000-0000-4000-8000-000000000209', -- Dallas Cowboys
      '00000000-0000-4000-8000-000000000211', -- Detroit Lions
      '00000000-0000-4000-8000-000000000212', -- Green Bay Packers
      '00000000-0000-4000-8000-000000000219', -- Los Angeles Rams
      '00000000-0000-4000-8000-000000000221', -- Minnesota Vikings
      '00000000-0000-4000-8000-000000000223', -- New Orleans Saints
      '00000000-0000-4000-8000-000000000224', -- New York Giants
      '00000000-0000-4000-8000-000000000226', -- Philadelphia Eagles
      '00000000-0000-4000-8000-000000000228', -- San Francisco 49ers
      '00000000-0000-4000-8000-000000000229', -- Seattle Seahawks
      '00000000-0000-4000-8000-000000000230', -- Tampa Bay Buccaneers
      '00000000-0000-4000-8000-000000000232'  -- Washington Commanders
    ]),
    ('mlb', 'al', ARRAY[
      '00000000-0000-4000-8000-200000000108', -- Angels
      '00000000-0000-4000-8000-200000000110', -- Orioles
      '00000000-0000-4000-8000-200000000111', -- Red Sox
      '00000000-0000-4000-8000-200000000114', -- Guardians
      '00000000-0000-4000-8000-200000000116', -- Tigers
      '00000000-0000-4000-8000-200000000117', -- Astros
      '00000000-0000-4000-8000-200000000118', -- Royals
      '00000000-0000-4000-8000-200000000133', -- Athletics
      '00000000-0000-4000-8000-200000000136', -- Mariners
      '00000000-0000-4000-8000-200000000139', -- Rays
      '00000000-0000-4000-8000-200000000140', -- Rangers
      '00000000-0000-4000-8000-200000000141', -- Blue Jays
      '00000000-0000-4000-8000-200000000142', -- Twins
      '00000000-0000-4000-8000-200000000145', -- White Sox
      '00000000-0000-4000-8000-200000000147'  -- Yankees
    ]),
    ('mlb', 'nl', ARRAY[
      '00000000-0000-4000-8000-200000000109', -- Diamondbacks
      '00000000-0000-4000-8000-200000000112', -- Cubs
      '00000000-0000-4000-8000-200000000113', -- Reds
      '00000000-0000-4000-8000-200000000115', -- Rockies
      '00000000-0000-4000-8000-200000000119', -- Dodgers
      '00000000-0000-4000-8000-200000000120', -- Nationals
      '00000000-0000-4000-8000-200000000121', -- Mets
      '00000000-0000-4000-8000-200000000134', -- Pirates
      '00000000-0000-4000-8000-200000000135', -- Padres
      '00000000-0000-4000-8000-200000000137', -- Giants
      '00000000-0000-4000-8000-200000000138', -- Cardinals
      '00000000-0000-4000-8000-200000000143', -- Phillies
      '00000000-0000-4000-8000-200000000144', -- Braves
      '00000000-0000-4000-8000-200000000146', -- Marlins
      '00000000-0000-4000-8000-200000000158'  -- Brewers
    ]),
    ('nhl', 'east', ARRAY[
      '00000000-0000-4000-8000-000000000302', -- Boston Bruins
      '00000000-0000-4000-8000-000000000303', -- Buffalo Sabres
      '00000000-0000-4000-8000-000000000305', -- Carolina Hurricanes
      '00000000-0000-4000-8000-000000000308', -- Columbus Blue Jackets
      '00000000-0000-4000-8000-000000000310', -- Detroit Red Wings
      '00000000-0000-4000-8000-000000000312', -- Florida Panthers
      '00000000-0000-4000-8000-000000000315', -- Montreal Canadiens
      '00000000-0000-4000-8000-000000000317', -- New Jersey Devils
      '00000000-0000-4000-8000-000000000318', -- New York Islanders
      '00000000-0000-4000-8000-000000000319', -- New York Rangers
      '00000000-0000-4000-8000-000000000320', -- Ottawa Senators
      '00000000-0000-4000-8000-000000000321', -- Philadelphia Flyers
      '00000000-0000-4000-8000-000000000322', -- Pittsburgh Penguins
      '00000000-0000-4000-8000-000000000326', -- Tampa Bay Lightning
      '00000000-0000-4000-8000-000000000327', -- Toronto Maple Leafs
      '00000000-0000-4000-8000-000000000331'  -- Washington Capitals
    ]),
    ('nhl', 'west', ARRAY[
      '00000000-0000-4000-8000-000000000301', -- Anaheim Ducks
      '00000000-0000-4000-8000-000000000304', -- Calgary Flames
      '00000000-0000-4000-8000-000000000306', -- Chicago Blackhawks
      '00000000-0000-4000-8000-000000000307', -- Colorado Avalanche
      '00000000-0000-4000-8000-000000000309', -- Dallas Stars
      '00000000-0000-4000-8000-000000000311', -- Edmonton Oilers
      '00000000-0000-4000-8000-000000000313', -- Los Angeles Kings
      '00000000-0000-4000-8000-000000000314', -- Minnesota Wild
      '00000000-0000-4000-8000-000000000316', -- Nashville Predators
      '00000000-0000-4000-8000-000000000323', -- San Jose Sharks
      '00000000-0000-4000-8000-000000000324', -- Seattle Kraken
      '00000000-0000-4000-8000-000000000325', -- St. Louis Blues
      '00000000-0000-4000-8000-000000000328', -- Utah Mammoth
      '00000000-0000-4000-8000-000000000329', -- Vancouver Canucks
      '00000000-0000-4000-8000-000000000330', -- Vegas Golden Knights
      '00000000-0000-4000-8000-000000000332'  -- Winnipeg Jets
    ])
)
UPDATE subjects AS subject
SET details = subject.details || jsonb_build_object(
  'league', jsonb_build_object(
    'id', affiliations.league_id,
    'conferenceId', affiliations.conference_id
  )
)
FROM affiliations
WHERE subject._tag = 'sports_team'
  AND subject.id = ANY(affiliations.subject_ids)
  AND subject.details->>'leagueId' = affiliations.league_id
  AND NOT (subject.details ? 'league');

--> statement-breakpoint

-- Preserve already-declared affiliations on other legacy team rows, if valid.
-- The validation below refuses unmapped rows rather than guessing a conference.
UPDATE subjects
SET details = details || jsonb_build_object(
  'league', jsonb_build_object(
    'id', details->>'leagueId',
    'conferenceId', details->>'conferenceId'
  )
)
WHERE _tag = 'sports_team'
  AND details ? 'conferenceId'
  AND NOT (details ? 'league');

--> statement-breakpoint

UPDATE subjects
SET details = details || jsonb_build_object(
  'league', jsonb_build_object('id', 'ufc')
)
WHERE _tag IN ('mma_fighter', 'mma_tracking')
  AND details->>'leagueId' = 'ufc'
  AND NOT (details ? 'league');

--> statement-breakpoint

-- Alchemy executes the file and its migration bookkeeping in one transaction.
-- Fail the deployment before new workers activate if a row needs manual repair.
-- Do not overwrite an existing malformed nested league with a legacy fallback.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM subjects
    WHERE jsonb_typeof(details->'league') IS DISTINCT FROM 'object'
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
  ) THEN
    RAISE EXCEPTION 'Subject league migration found invalid or unmapped membership; repair the affected subjects before retrying';
  END IF;
END;
$$;
