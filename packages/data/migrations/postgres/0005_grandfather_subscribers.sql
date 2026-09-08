-- Fixed production cohort audited on 2026-09-06, after deployment #115.
-- Reverified read-only on 2026-09-07; see docs/runbooks/production-deploy.md.
-- These ten owner-trusted subscribers predate pending signups. Their created_at
-- is 0004's migration timestamp, not their original signup date.
-- This grants notification eligibility; it proves no mailbox ownership and
-- creates no sessions. New users retain the email_verified = false default.
UPDATE users SET email_verified = true
WHERE id IN (
  '0c8c2077-e526-4ffc-8506-5112a2ff56a9',
  '2137fa32-b3cd-4c75-b3f3-b97291a60fbe',
  '49c8331f-c285-446e-907c-ee871ad5e518',
  '5130b867-9261-4e9c-b199-3d4db601f312',
  '6498a2e7-176a-4024-af8c-fafa718e79cb',
  '9d07f842-dbab-41c2-8a96-864c295a386e',
  'b854dba7-5a50-4bda-a3a3-b3ff7229413b',
  'be7a50ff-a2c8-4fed-ae8f-f78c60f8e846',
  'f0c3316e-ada2-4a5c-a9ed-d3e547f966c3',
  'fde75283-855c-4c63-be11-f38b55bb2ad7'
);
