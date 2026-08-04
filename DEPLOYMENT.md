# AWS Certification Practice — Deployment

Practice exam simulator covering all current AWS certifications. Deploys as a fully
static site (Vite build) to S3 + CloudFront.

## Deployment

This project uses GitHub Actions to deploy to an S3 bucket with CloudFront, authenticating
to AWS via OIDC (no long-lived AWS keys stored in GitHub).

### Workflows

1. **`deploy.yml`** (`.github/workflows/deploy.yml`) — runs on every push to `main`:
   - `npm ci && npm run build` — `npm run build` merges the already-scraped/generated
     knowledge base (`scripts/kb-data/*.json`, committed in the repo) into
     `src/data/certifications.js` and runs `vite build`. No network calls, no scraping,
     no LLM calls happen here — the build only ever ships whatever KB is already committed.
   - Assumes an AWS IAM role via OIDC (`aws-actions/configure-aws-credentials`), no static
     AWS keys involved.
   - Syncs `dist/` to the S3 bucket and invalidates the CloudFront distribution configured
     via the `S3_BUCKET` / `CLOUDFRONT_DISTRIBUTION_ID` secrets below (not hardcoded, to
     avoid exposing infrastructure details in a public repo).

2. **`update-kb.yml`** (`.github/workflows/update-kb.yml`) — manual only
   (`workflow_dispatch`), never runs automatically:
   - Go to Actions → "Update knowledge base" → "Run workflow" to trigger it on demand.
   - Re-scrapes all AWS exam guides (`npm run kb:scrape`), regenerates practice questions
     with OpenAI if the `OPENAI_API_KEY` repo secret is set (`npm run kb:generate` —
     otherwise this step is skipped and only domains/task statements are refreshed), then
     rebuilds the static bundle (`npm run kb:build`).
   - Commits the refreshed `scripts/kb-data/` and `src/data/certifications.js` straight to
     `main`, which automatically triggers `deploy.yml`.

### Required GitHub secrets

Set these in Settings → Secrets and variables → Actions:

- `AWS_ACCOUNT_ID` — AWS account ID that owns the IAM role.
- `AWS_IAM_ROLE_NAME` — name of the IAM role `deploy.yml` assumes via OIDC. That role
  needs `s3:PutObject`/`GetObject`/`ListBucket`/`DeleteObject` on the target bucket and
  `cloudfront:CreateInvalidation` on the target distribution, plus a trust policy
  allowing `token.actions.githubusercontent.com` for this repo
  (`repo:syscu-es/awscert:ref:refs/heads/main`).
- `S3_BUCKET` — name of the S3 bucket the built site is synced to.
- `CLOUDFRONT_DISTRIBUTION_ID` — ID of the CloudFront distribution to invalidate on deploy.
- `OPENAI_API_KEY` (optional) — only needed for `update-kb.yml` to regenerate practice
  questions. Without it, that workflow still refreshes domains/task statements.

## Local Development

```bash
npm install
npm run dev
```

## Building for Production

```bash
npm run build
```

## Refreshing the knowledge base locally

```bash
npm run kb:scrape      # re-scrape all AWS exam guides
npm run kb:generate    # regenerate practice questions via OpenAI (needs OPENAI_API_KEY)
npm run kb:build        # merge scripts/kb-data/*.json into src/data/certifications.js
```

Or trigger the `update-kb.yml` GitHub Actions workflow instead of running these locally.

## Project Structure

- `src/`: React application source
- `scripts/`: knowledge-base pipeline (scrape AWS exam guides, generate practice
  questions, merge into `src/data/certifications.js`)
- `scripts/kb-data/`: scraped/generated knowledge base, committed — the source of truth
- `public/`: static assets
- `dist/`: build output (created during `npm run build`, not committed)
- `.github/workflows/`: CI/CD (deploy + on-demand KB update)
