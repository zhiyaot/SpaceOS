import { useState } from 'react';
import './App.css';

import Sidebar from './components/Sidebar';
import Topbar  from './components/Topbar';

import ControlPage  from './components/pages/ControlPage';
import InsightsPage from './components/pages/InsightsPage';
import SchedulePage from './components/pages/SchedulePage';
import DevicesPage  from './components/pages/DevicesPage';
import SettingsPage from './components/pages/SettingsPage';

function Shell({ children }) {
  return <div className="shell">{children}</div>;
}

function Main({ children }) {
  return <div className="main">{children}</div>;
}

export default function App() {
  const [currentBuilding, setCurrentBuilding] = useState('skirkanich');
  const [activePage, setActivePage]           = useState('control');
  const [activeRules, setActiveRules]         = useState([]);

  function handleAddRule(rule) {
    setActiveRules(r => [...r, rule]);
  }

  function handleRemoveRule(idx) {
    setActiveRules(r => r.filter((_, i) => i !== idx));
  }

  function handleClearAll() {
    setActiveRules([]);
  }

  function renderPage() {
    switch (activePage) {
      case 'control':
        return <ControlPage currentBuilding={currentBuilding} />;
      case 'insights':
        return <InsightsPage currentBuilding={currentBuilding} />;
      case 'schedule':
        return (
          <SchedulePage
            activeRules={activeRules}
            onAddRule={handleAddRule}
            onRemoveRule={handleRemoveRule}
            onClearAll={handleClearAll}
          />
        );
      case 'devices':
        return <DevicesPage currentBuilding={currentBuilding} />;
      case 'settings':
        return <SettingsPage currentBuilding={currentBuilding} />;
      default:
        return <ControlPage currentBuilding={currentBuilding} />;
    }
  }

  return (
    <Shell>
      <Sidebar
        currentBuilding={currentBuilding}
        onBuildingChange={setCurrentBuilding}
        activePage={activePage}
        onNavChange={setActivePage}
        activeRules={activeRules}
      />
      <Main>
        <Topbar currentBuilding={currentBuilding} activePage={activePage} />
        {renderPage()}
      </Main>
    </Shell>
  );
}
