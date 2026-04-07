import { BUILDINGS } from '../data';

const PAGE_TITLES = {
  control:  'Building Control',
  insights: 'Energy Insights',
  schedule: 'Automation Schedule',
  devices:  'Device Management',
  settings: 'Settings',
};

export default function Topbar({ currentBuilding, activePage }) {
  const b = BUILDINGS[currentBuilding];
  return (
    <div className="topbar">
      <div className="topbar-title">{PAGE_TITLES[activePage]}</div>
      <div className="topbar-stats">
        <div className="stat-chip">
          <div>
            <div className="stat-label">INDOOR AVG TEMP</div>
            <div className="stat-value">{b.temp}</div>
          </div>
        </div>
        <div className="stat-chip">
          <div>
            <div className="stat-label">SAVED THIS MONTH</div>
            <div className="stat-value">{b.saving}</div>
          </div>
        </div>
        <div className="stat-chip">
          <div>
            <div className="stat-label">OCCUPANCY</div>
            <div className="stat-value">{b.occ}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
