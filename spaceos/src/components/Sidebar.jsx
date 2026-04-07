import { BUILDINGS } from '../data';

const NAV_ITEMS = [
  { id: 'control',  label: 'Control',   icon: <ControlIcon /> },
  { id: 'insights', label: 'Insights',  icon: <InsightsIcon /> },
  { id: 'schedule', label: 'Schedule',  icon: <ScheduleIcon />, badge: true },
  { id: 'devices',  label: 'Devices',   icon: <DevicesIcon /> },
  { id: 'settings', label: 'Settings',  icon: <SettingsIcon /> },
];

function ControlIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="6" height="6" rx="1"/>
      <rect x="9" y="1" width="6" height="6" rx="1"/>
      <rect x="1" y="9" width="6" height="6" rx="1"/>
      <rect x="9" y="9" width="6" height="6" rx="1"/>
    </svg>
  );
}
function InsightsIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="1,12 5,7 8,9 12,4 15,6"/>
    </svg>
  );
}
function ScheduleIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="2" width="14" height="13" rx="1.5"/>
      <line x1="5" y1="1" x2="5" y2="4"/>
      <line x1="11" y1="1" x2="11" y2="4"/>
      <line x1="1" y1="6" x2="15" y2="6"/>
    </svg>
  );
}
function DevicesIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="4" width="10" height="8" rx="1"/>
      <line x1="11" y1="8" x2="15" y2="8"/>
      <circle cx="8" cy="8" r="2"/>
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="2.5"/>
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"/>
    </svg>
  );
}

export default function Sidebar({ currentBuilding, onBuildingChange, activePage, onNavChange, activeRules }) {
  const b = BUILDINGS[currentBuilding];
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-hex">S</div>
          <span className="logo-text">SpaceOS</span>
        </div>
        <div className="logo-sub">PENN ENGINEERING BMS</div>
      </div>

      <div className="building-select-wrap">
        <select value={currentBuilding} onChange={e => onBuildingChange(e.target.value)}>
          {Object.entries(BUILDINGS).map(([id, bd]) => (
            <option key={id} value={id}>{bd.name}</option>
          ))}
        </select>
      </div>

      <div className="building-meta">
        <div className="meta-pill">
          <span className="val">{b.floors}</span>
          <span className="lbl">FLOORS</span>
        </div>
        <div className="meta-pill">
          <span className="val">{b.devices}</span>
          <span className="lbl">DEVICES</span>
        </div>
      </div>

      <nav className="nav">
        {NAV_ITEMS.map(item => (
          <div
            key={item.id}
            className={`nav-item${activePage === item.id ? ' active' : ''}`}
            onClick={() => onNavChange(item.id)}
          >
            {item.icon}
            {item.label}
            {item.badge && activeRules.length > 0 && (
              <span className="nav-badge">{activeRules.length}</span>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="avatar">AK</div>
        <div className="footer-info">
          <div className="footer-name">Alex Kim</div>
          <div className="footer-role">Facilities Manager</div>
        </div>
      </div>
    </div>
  );
}
