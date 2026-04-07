import { useState } from 'react';
import { BUILDINGS, SETTINGS_SECTIONS } from '../../data';
import Toggle from '../Toggle';

function BuildingProfileSettings({ currentBuilding }) {
  const b = BUILDINGS[currentBuilding];
  const [name, setName] = useState(b.name);
  const [tz, setTz] = useState('America/New_York');
  return (
    <div className="settings-card">
      <div className="card-title" style={{ marginBottom: 16 }}>Building Profile</div>
      <div className="settings-row">
        <div>
          <div className="settings-row-label">Building Name</div>
          <div className="settings-row-sub">Display name across the dashboard</div>
        </div>
        <input className="settings-input" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="settings-row">
        <div>
          <div className="settings-row-label">Abbreviation</div>
          <div className="settings-row-sub">Used in device location labels</div>
        </div>
        <input className="settings-input" value={b.abbrev} readOnly />
      </div>
      <div className="settings-row">
        <div>
          <div className="settings-row-label">Theme / Department</div>
        </div>
        <input className="settings-input" value={b.theme} readOnly />
      </div>
      <div className="settings-row">
        <div>
          <div className="settings-row-label">Timezone</div>
        </div>
        <select className="settings-select" value={tz} onChange={e => setTz(e.target.value)}>
          <option>America/New_York</option>
          <option>America/Chicago</option>
          <option>America/Los_Angeles</option>
          <option>UTC</option>
        </select>
      </div>
    </div>
  );
}

function AutomationSettings() {
  const [autoOff, setAutoOff]       = useState(true);
  const [schedSync, setSchedSync]   = useState(true);
  const [ecoMode, setEcoMode]       = useState(false);
  const [overrideTtl, setOverrideTtl] = useState('60');
  return (
    <div className="settings-card">
      <div className="card-title" style={{ marginBottom: 16 }}>Automation</div>
      <div className="settings-row">
        <div>
          <div className="settings-row-label">Auto lights-off</div>
          <div className="settings-row-sub">Turn off lights when no occupancy detected for 20 min</div>
        </div>
        <Toggle on={autoOff} onChange={setAutoOff} />
      </div>
      <div className="settings-row">
        <div>
          <div className="settings-row-label">Schedule sync</div>
          <div className="settings-row-sub">Sync with Penn academic calendar</div>
        </div>
        <Toggle on={schedSync} onChange={setSchedSync} />
      </div>
      <div className="settings-row">
        <div>
          <div className="settings-row-label">Eco mode</div>
          <div className="settings-row-sub">Reduce HVAC + lighting targets during low-occupancy periods</div>
        </div>
        <Toggle on={ecoMode} onChange={setEcoMode} />
      </div>
      <div className="settings-row">
        <div>
          <div className="settings-row-label">Override TTL</div>
          <div className="settings-row-sub">How long manual overrides remain active (minutes)</div>
        </div>
        <select className="settings-select" value={overrideTtl} onChange={e => setOverrideTtl(e.target.value)}>
          <option value="30">30 min</option>
          <option value="60">60 min</option>
          <option value="120">2 hours</option>
          <option value="480">8 hours</option>
        </select>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [email, setEmail]       = useState(true);
  const [slack, setSlack]       = useState(false);
  const [alerts, setAlerts]     = useState(true);
  const [weekly, setWeekly]     = useState(true);
  return (
    <div className="settings-card">
      <div className="card-title" style={{ marginBottom: 16 }}>Notifications</div>
      <div className="settings-row">
        <div>
          <div className="settings-row-label">Email alerts</div>
          <div className="settings-row-sub">Critical device or occupancy alerts</div>
        </div>
        <Toggle on={email} onChange={setEmail} />
      </div>
      <div className="settings-row">
        <div>
          <div className="settings-row-label">Slack integration</div>
          <div className="settings-row-sub">Post alerts to #facilities channel</div>
        </div>
        <Toggle on={slack} onChange={setSlack} />
      </div>
      <div className="settings-row">
        <div>
          <div className="settings-row-label">Device offline alerts</div>
        </div>
        <Toggle on={alerts} onChange={setAlerts} />
      </div>
      <div className="settings-row">
        <div>
          <div className="settings-row-label">Weekly summary report</div>
          <div className="settings-row-sub">Emailed every Monday at 8 AM</div>
        </div>
        <Toggle on={weekly} onChange={setWeekly} />
      </div>
    </div>
  );
}

function IntegrationsSettings() {
  return (
    <div className="settings-card">
      <div className="card-title" style={{ marginBottom: 16 }}>Integrations</div>
      {[
        { name: 'BACnet/IP', sub: 'Building automation protocol', connected: true },
        { name: 'PECO Energy API', sub: 'Real-time utility pricing', connected: true },
        { name: 'Penn IAM (SSO)', sub: 'Single sign-on', connected: true },
        { name: 'Modbus TCP', sub: 'Legacy device bridge', connected: false },
      ].map(item => (
        <div key={item.name} className="settings-row">
          <div>
            <div className="settings-row-label">{item.name}</div>
            <div className="settings-row-sub">{item.sub}</div>
          </div>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 10,
            background: item.connected ? 'rgba(0,230,118,.1)' : 'rgba(255,82,82,.1)',
            color: item.connected ? 'var(--green)' : 'var(--red)',
          }}>
            {item.connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      ))}
    </div>
  );
}

function AccountSettings() {
  return (
    <div className="settings-card">
      <div className="card-title" style={{ marginBottom: 16 }}>Account</div>
      <div className="settings-row">
        <div>
          <div className="settings-row-label">Name</div>
        </div>
        <input className="settings-input" defaultValue="Alex Kim" />
      </div>
      <div className="settings-row">
        <div>
          <div className="settings-row-label">Email</div>
        </div>
        <input className="settings-input" defaultValue="alexkim@seas.upenn.edu" />
      </div>
      <div className="settings-row">
        <div>
          <div className="settings-row-label">Role</div>
        </div>
        <select className="settings-select" defaultValue="facilities_manager">
          <option value="facilities_manager">Facilities Manager</option>
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>
      <div className="settings-row">
        <div>
          <div className="settings-row-label">Password</div>
          <div className="settings-row-sub">Last changed 42 days ago</div>
        </div>
        <button style={{
          padding: '6px 14px', borderRadius: 6, border: '1px solid var(--border2)',
          background: 'var(--s3)', color: 'var(--text2)', fontSize: 11,
          fontFamily: 'Syne, sans-serif', cursor: 'pointer',
        }}>
          Change password
        </button>
      </div>
    </div>
  );
}

const SECTION_COMPONENTS = {
  'Building profile': BuildingProfileSettings,
  'Automation':       AutomationSettings,
  'Notifications':    NotificationSettings,
  'Integrations':     IntegrationsSettings,
  'Account':          AccountSettings,
};

export default function SettingsPage({ currentBuilding }) {
  const [activeSection, setActiveSection] = useState(SETTINGS_SECTIONS[0]);
  const SectionComp = SECTION_COMPONENTS[activeSection];

  return (
    <div className="page">
      <div className="settings-layout">
        <div className="settings-nav">
          {SETTINGS_SECTIONS.map(s => (
            <div
              key={s}
              className={`settings-nav-item${activeSection === s ? ' active' : ''}`}
              onClick={() => setActiveSection(s)}
            >
              {s}
            </div>
          ))}
        </div>
        <SectionComp currentBuilding={currentBuilding} />
      </div>
    </div>
  );
}
