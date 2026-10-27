# FairShift – Decent Work Platform (SDG 8)
Prompt Wars 2026 × SRM ACM. One codebase, two interfaces (Worker / Admin), two sectors (Construction Site, College Campus).

## Features
- **Tamper-evident attendance ledger**: check-ins are hash-chained; any later edit is detected and shown to the worker.
- **Talking payslip** built from the ledger, in English / Tamil / Hindi, with read-aloud.
- **Anonymous reports** (typed or voice). Admins see details only after 3+ similar reports, protecting identity.
- **Work passport**: a worker exports a code proving their verified shifts; an employer in any sector pastes it into the Admin view to verify it. Edited codes or altered ledgers are rejected.
- **3D particle hero** (canvas, no dependencies) morphs a hard hat, a chain and a globe, and reacts to the pointer.
- **Live earnings ticker, 7-day fatigue heatmap and a passport seal** make pay, overtime and burnout visible at a glance.
- **Fatigue and quit-risk flags** (>12h shift, 6+ days in a row, <10h rest) from per-sector rules.

## Sector use cases
- Construction: daily-wage shifts, 8h cap, 2x overtime, hazards such as scaffolds and cranes.
- College: campus staff, 9h cap, 1.5x overtime, hazards in hostels, canteens and labs.
Adding a sector means adding one config entry in `src/core.js`.

## Run, test, deploy
    npm test                     # unit tests (Node 18+, no dependencies)
    npx serve .                  # local preview
    gcloud run deploy fairshift --source . --region asia-south1 --allow-unauthenticated

## Notes
Fonts (Anton, Playfair Display, Manrope, Noto Sans Tamil and Devanagari) load from Google Fonts and fall back to system fonts offline.
No secrets or backend; data is in-memory demo data. Production would use SHA-256 and a server-side database with real authentication.
