import { useState } from 'react';
import { DEVICE_TEMPLATES, BUILDINGS } from '../../data';
import Toggle from '../Toggle';

const FILTERS = ['All', 'Lighting', 'HVAC', 'Sensors', 'Access', 'Offline'];

const TYPE_MAP = {
  light:  'Lighting',
  hvac:   'HVAC',
  sensor: 'Sensors',
  access: 'Access',
};

function LightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="#ffab40" strokeWidth="1.5">
      <circle cx="8" cy="6" r="3"/>
      <path d="M6 9.5c0 1.1.9 2 2 2s2-.9 2-2" strokeLinecap="round"/>
      <line x1="8" y1="11.5" x2="8" y2="13"/>
    </svg>
  );
}
function HvacIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="#00d4ff" strokeWidth="1.5">
      <circle cx="8" cy="8" r="5"/>
      <path d="M5 6Q8 8 11 6" strokeLinecap="round"/>
      <path d="M5 10Q8 8 11 10" strokeLinecap="round"/>
    </svg>
  );
}
function SensorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="#00e676" strokeWidth="1.5">
      <circle cx="8" cy="8" r="2"/>
      <path d="M4.5 4.5a4.95 4.95 0 0 0 0 7" strokeLinecap="round"/>
      <path d="M11.5 4.5a4.95 4.95 0 0 1 0 7" strokeLinecap="round"/>
    </svg>
  );
}
function AccessIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="#7c5cfc" strokeWidth="1.5">
      <rect x="3" y="6" width="10" height="8" rx="1"/>
      <path d="M5 6V4a3 3 0 0 1 6 0v2"/>
      <circle cx="8" cy="10" r="1.5" fill="#7c5cfc" stroke="none"/>
    </svg>
  );
}

function DeviceIcon({ type }) {
  if (type === 'light')  return <LightIcon />;
  if (type === 'hvac')   return <HvacIcon />;
  if (type === 'sensor') return <SensorIcon />;
  if (type === 'access') return <AccessIcon />;
  return null;
}

export default function DevicesPage({ currentBuilding }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [toggles, setToggles] = useState(
    Object.fromEntries(DEVICE_TEMPLATES.map((_, i) => [i, true]))
  );

  const b = BUILDINGS[currentBuilding];

  const filtered = DEVICE_TEMPLATES.filter(d => {
    if (activeFilter === 'All')     return true;
    if (activeFilter === 'Offline') return d.status === 'offline';
    return TYPE_MAP[d.type] === activeFilter;
  });

  return (
    <div className="page">
      <div className="filter-pills">
        {FILTERS.map(f => (
          <div
            key={f}
            className={`filter-pill${activeFilter === f ? ' active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </div>
        ))}
      </div>

      <div className="device-grid">
        {filtered.map((d, idx) => {
          const globalIdx = DEVICE_TEMPLATES.indexOf(d);
          return (
            <div key={idx} className={`device-card${d.status === 'offline' ? ' offline' : ''}`}>
              <div className="device-card-head">
                <div className="device-type-icon">
                  <DeviceIcon type={d.type} />
                </div>
                <Toggle
                  on={toggles[globalIdx]}
                  onChange={v => setToggles(t => ({ ...t, [globalIdx]: v }))}
                />
              </div>

              <div className="device-type-label">{TYPE_MAP[d.type]}</div>
              <div className="device-name">{d.name}</div>
              <div className="device-loc">Floor {d.floor} · {b.abbrev}</div>

              <div className="device-stats">
                {[0, 1].map(pair => (
                  <div key={pair}>
                    <div className="device-stat-label">{d.stats[pair * 2]}</div>
                    <div className="device-stat-val">{d.stats[pair * 2 + 1]}</div>
                  </div>
                ))}
              </div>

              <div className="device-footer">
                <div className="status-dot-wrap">
                  <div className={`status-dot ${d.status}`} />
                  <span className="status-text">{d.status}</span>
                </div>
                <button className="config-btn">Configure</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
