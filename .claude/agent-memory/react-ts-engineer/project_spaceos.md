---
name: SpaceOS project context
description: SpaceOS — Penn Engineering building management dashboard React app in /venture-haha/spaceos
type: project
---

SpaceOS is a React (JavaScript, not TypeScript) building management dashboard for Penn Engineering built with Vite 4 + React 18.

**Why:** Converted from a vanilla HTML/JS single-file app; user requested React migration.

**How to apply:** When working on this project, keep it plain JS (no TypeScript). Node 16 is the system default — use NVM (`export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh"`) to run Node 20 for all npm/build commands.

Key details:
- Location: `/home/zhiyaot/venture-haha/spaceos/`
- Uses chart.js + react-chartjs-2 for Insights charts
- State lives in App.jsx: currentBuilding, activePage, activeRules
- 5 pages: Control, Insights, Schedule, Devices, Settings
- Isometric SVG building is the main visual on ControlPage (IsoBuilding.jsx)
- All CSS in App.css using CSS custom properties defined in index.css
