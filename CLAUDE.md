# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev        # Start dev server
bun build      # Production build
bun start      # Start production server
bun lint       # Run ESLint
bun lint:fix   # Auto-fix ESLint issues
```

No test suite exists in this project.

## Architecture

Single-page Next.js 16 app (App Router) with one route (`/`). The UI is a Thai name numerology calculator.

**Core data flow:**
1. User inputs first name, last name (Thai or English), and birth day
2. `calcName()` maps each character to a numeric value via `getCharValue()`, sums them → name number
3. `checkKalakinee()` checks if any characters in the name are forbidden for that birth day
4. `getTaksaCategory()` classifies each character under the Taksa system (หลักทักษาปกรณ์)
5. Results are displayed: individual name numbers, combined total, predictions from two traditions ("อีกตำราหนึ่ง"), Kalakinee check, Taksa analysis, and planet power (กำลังดาวพระเคราะห์)

**Key files:**
- `app/page.tsx` — entire UI, all state, result rendering, share/save-as-image logic
- `app/lib/numerology.ts` — all divination logic and data tables

**Numerology systems currently implemented (in `numerology.ts`):**
- เลขศาสตร์ (Thai numerology) — character-to-number mapping for Thai and English letters
- อักษรกาลกิณี (Kalakinee) — inauspicious letters per birth day
- หลักทักษาปกรณ์ (Taksa) — letter categories reflecting planetary influence per birth day
- นิยามความหมายกำลังดาวพระเคราะห์ (Planet power definitions) — predictions keyed to the total number

**URL state:** Results are shareable via query params `?fn=<firstName>&ln=<lastName>&bd=<dayIndex>`. State is initialized from URL on load.

**Save as image:** Uses `html-to-image` to capture a hidden off-screen share card (`shareCardRef`) rendered with inline styles (not Tailwind) for reliable PNG export.

**Styling:** Tailwind CSS v4 with custom color tokens (`primary-*`, `secondary-*`, `accent-*`) defined in `app/globals.css`. Fonts: Noto Sans Thai + Noto Sans Mono via `next/font/google`.
