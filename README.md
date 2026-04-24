# Tam Integration — Guide to Popular Molecules

Evidence-based psychedelic substance reference app built for coaches, clients, and the general public.

## What It Does

A single-page React app with four tabs:

| Tab | Description |
|-----|-------------|
| **Dosages + Effects** | Interactive dose slider, intensity-over-time graph, expected effects by dose tier, safety notes, and cited sources |
| **Descriptions + History** | Long-form historical and cultural background for each substance |
| **Resource Library** | All academic sources organized by substance |
| **Trip Reports** | Personal experience journal (stored in browser localStorage) |

## Substances Covered

**Single substances (15):**
Psilocybin · LSD · DMT · Mescaline · Peyote · 5-MeO-DMT · Ayahuasca · Salvinorin A · Ibogaine · MDMA · MDA · Ketamine · PCP · 2C-B · 25I-NBOMe

**Combinations (3):**
Candy Flip (LSD + MDMA) · Jedi Flip (Psilocybin + LSD + MDMA) · Hippie Flip (Psilocybin + MDMA)

**Special features:**
- Ketamine has a multi-ROA selector (Lozenge, Insufflation, IV, IM) with separate dose/pharmacokinetic profiles per route
- - 5-MeO-DMT has a source selector (Synthetic vs. Toad Venom) with separate dose profiles
  -
  - ## Tech Stack
  -
  - - React 18 (Create React App)
    - - All inline styles — no CSS files, no external component libraries
      - - localStorage for trip report persistence
        - - No backend — fully static, no auth, no database
          - - Deployed on Vercel from this GitHub repo
            -
            - ## Local Development
            -
            - ```bash
              npm install
              npm start
              ```

              Opens at `http://localhost:3000`.

              ## Project Structure

              ```
              src/
                App.js      — entire application (components, data, styles)
                index.js    — React entry point
              public/
                index.html  — HTML shell
              ```

              Everything lives in `src/App.js`. See the JSDoc header at the top of that file for a full breakdown of the data schema and component structure.

              ## Adding a New Substance

              1. Add an entry to the `SUBSTANCES` array in `App.js` following the standard schema
              2. 2. Add source entries to `SOURCES`
                 3. 3. Add the substance ID + all source IDs to `SUBSTANCE_SOURCE_MAP`
                    4.
                    5. ## Data Sources
                    6.
                    7. All information is derived from published peer-reviewed literature or primary historical sources. Sources are viewable in-app via the "View Sources" buttons and the Resource Library tab.# tam-reference-guide
