# Marketing rollback

Backup created: 2026-09-09

## Option A — git branch
```bash
cd bridgitus-learning
git checkout backup/marketing-pre-revamp
# or restore files from that branch onto main:
git checkout backup/marketing-pre-revamp -- src/app/\(website\) src/components/Header.tsx src/components/Footer.tsx src/components/Herosection.tsx src/components/Brief.tsx src/components/Cta.tsx src/components/Partners.tsx src/components/TrustedBy.tsx src/components/Offer.tsx src/components/Why.tsx src/app/globals.css
```

## Option B — folder copy
Full copy at:
`/Users/mac/Documents/mywebsites/bridgitus-learning-marketing-backup-20260909/`

Copy `website-app/`, marketing `components/`, `globals.css`, `layout.tsx`, `public/` back into the learning project as needed.
