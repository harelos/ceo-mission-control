# CEO Mission Control

Public, mobile-first CEO operating dashboard for Tiger Brands Global.

**Live:** https://tiger-brands-ceo-control.jacobfelipe1.chatgpt.site

## Features

- Editable $5,000 revenue goal for August 31, 2026
- 41 prioritized tasks across P0 / P1 / P2 / P3
- Completion checkboxes, editing, adding, deleting, search, filters, and drag/drop priority moves
- Owner, status, due date, dependencies, next action, notes, and a copyable Agent Prompt for every task
- Daily CEO Log and dated snapshots/history
- JSON export/import for backup and moving data between browsers
- Chargeflow vs Chargeblast decision card with a guarded-rollout recommendation

## Persistence

This public version stores changes in the browser with `localStorage`; it does not pretend to have a shared backend. Use **Export** regularly and **Import** on another device. No Shopify, GitHub, or payment credentials are stored.

The initial current-revenue value is `$1,298.88`, based on the latest verified August snapshot available during setup. It is editable at the top of the dashboard.

## Run locally

```bash
npm install
npm run dev
```

Build with `npm run build`.
