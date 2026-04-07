# SpaceOS

A building management dashboard for monitoring and controlling lighting, HVAC, occupancy, and devices across multiple campus buildings.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

## Getting Started

The app lives inside the `spaceos/` folder. Navigate into it first, then install dependencies and start the dev server:

```bash
cd spaceos
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Other Commands

All commands below must be run from inside the `spaceos/` directory.

```bash
cd spaceos

npm run build    # production build → spaceos/dist/
npm run preview  # preview the production build locally
npm run lint     # run ESLint
```

## Project Structure

```
spaceos/
├── src/
│   ├── App.jsx                      # Root layout, routing between pages
│   ├── data.js                      # Building definitions + floor data
│   ├── index.css                    # Global CSS variables and resets
│   ├── App.css                      # Component styles
│   └── components/
│       ├── Sidebar.jsx              # Building selector + nav
│       ├── Topbar.jsx               # Header with live stats
│       ├── Toggle.jsx               # Reusable toggle switch
│       └── pages/
│           ├── ControlPage.jsx      # Lighting & HVAC controls + 3D building view
│           ├── IsoBuilding.jsx      # Isometric SVG building model
│           ├── InsightsPage.jsx     # Energy analytics and charts
│           ├── SchedulePage.jsx     # Automation rule scheduler
│           ├── DevicesPage.jsx      # Device inventory
│           └── SettingsPage.jsx     # App settings
```

## Buildings

The app ships with five demo buildings (defined in `src/data.js`):

| ID | Name | Floors |
|----|------|--------|
| `skirkanich` | Skirkanich Hall | 8 |
| `levine` | Levine Hall | 6 |
| `towne` | Towne Building | 5 |
| `detkin` | Detkin Lab | 4 |
| `moore` | Moore Building | 9 |

All data is seeded deterministically from the building ID — no backend required.

## Tech Stack

- **React 18** + **Vite**
- **Chart.js** + **react-chartjs-2** for analytics charts
- Pure SVG for the isometric building model
