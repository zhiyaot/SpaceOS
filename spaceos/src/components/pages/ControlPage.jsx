import { useState } from 'react';
import { BUILDINGS, getFloorData } from '../../data';
import Toggle from '../Toggle';
import IsoBuilding from './IsoBuilding';

export default function ControlPage({ currentBuilding }) {
  const b = BUILDINGS[currentBuilding];
  const [selectedFloor, setSelectedFloor] = useState(Math.floor(b.floors / 2));
  const [hvacTemp, setHvacTemp] = useState(72);
  const [hvacMode, setHvacMode] = useState('Cool');
  const [brightness, setBrightness] = useState(75);
  const [fanSpeed, setFanSpeed] = useState(60);
  const [lights, setLights] = useState({ upper: true, mid: true, lower: false, common: true });
  const [hvacA, setHvacA] = useState(true);
  const [hvacB, setHvacB] = useState(false);

  const fd = getFloorData(currentBuilding, selectedFloor + 1);

  return (
    <div className="page">
      <div className="ctrl-layout">
        {/* Left: building panel */}
        <div className="ctrl-building-panel">
          {/* Floor strip */}
          <div className="floor-strip-wrap">
            <div className="floor-strip">
              {Array.from({ length: b.floors }, (_, i) => {
                const fdata = getFloorData(currentBuilding, i + 1);
                let cls = 'floor-pill';
                if (i === selectedFloor) cls += ' selected';
                else if (fdata.occupied) cls += ' occupied';
                return (
                  <div key={i} className={cls} onClick={() => setSelectedFloor(i)}
                    title={fdata.occupied ? `Floor ${i+1} — ${fdata.people} people` : `Floor ${i+1} — Empty`}>
                    F{i + 1}
                    {fdata.occupied && <span className="pill-occ-dot" />}
                  </div>
                );
              })}
            </div>
            <div className="floor-strip-legend">
              <span className="legend-item legend-selected"><span className="legend-dot" />Selected</span>
              <span className="legend-item legend-occ"><span className="legend-dot" />Occupied</span>
              <span className="legend-item legend-empty"><span className="legend-dot" />Empty</span>
            </div>
          </div>

          {/* Isometric building */}
          <div className="iso-wrap">
            <IsoBuilding
              buildingId={currentBuilding}
              floors={b.floors}
              selectedFloor={selectedFloor}
              onFloorSelect={setSelectedFloor}
              abbrev={b.abbrev}
              lights={lights}
              brightness={brightness}
              hvacMode={hvacMode}
              hvacA={hvacA}
              hvacB={hvacB}
              hvacTemp={hvacTemp}
              fanSpeed={fanSpeed}
            />
          </div>

          {/* Floor info bar */}
          <div className="floor-info-bar">
            <div>
              <div className="fi-label">FLOOR</div>
              <div className="fi-value">Floor {selectedFloor + 1}</div>
            </div>
            <div>
              <div className="fi-label">TEMP</div>
              <div className="fi-value">{fd.temp}°F</div>
            </div>
            <div>
              <div className="fi-label">POWER</div>
              <div className="fi-value">{fd.power.toFixed(1)} kW</div>
            </div>
            <div>
              <div className="fi-label">STATUS</div>
              <div>
                <span className={`fi-badge ${fd.occupied ? 'occ' : 'empty'}`}>
                  {fd.occupied ? `${fd.people} people` : 'Empty'}
                </span>
              </div>
            </div>
            <div>
              <div className="fi-label">LIGHTS</div>
              <div className="fi-value">{fd.lightOn ? 'On' : 'Off'}</div>
            </div>
          </div>
        </div>

        {/* Right: controls */}
        <div className="ctrl-sidebar">
          {/* Lighting card */}
          <div className="card">
            <div className="card-title">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="7" r="4"/>
                <line x1="8" y1="1" x2="8" y2="3"/>
                <line x1="8" y1="11" x2="8" y2="13"/>
                <line x1="2" y1="7" x2="4" y2="7"/>
                <line x1="12" y1="7" x2="14" y2="7"/>
                <line x1="3.5" y1="2.5" x2="5" y2="4"/>
                <line x1="11" y1="10" x2="12.5" y2="11.5"/>
                <line x1="12.5" y1="2.5" x2="11" y2="4"/>
                <line x1="5" y1="10" x2="3.5" y2="11.5"/>
                <line x1="8" y1="13" x2="8" y2="15"/>
              </svg>
              Lighting
            </div>

            <div className="slider-row">
              <label>Brightness</label>
              <input
                type="range" min={0} max={100} value={brightness}
                onChange={e => setBrightness(+e.target.value)}
              />
              <span className="slider-val">{brightness}%</span>
            </div>

            <div className="toggle-row">
              <div>
                <div className="toggle-row-label">Upper Floors</div>
                <div className="toggle-row-sub">Floors {Math.ceil(b.floors * 0.67) + 1}–{b.floors}</div>
              </div>
              <Toggle on={lights.upper} onChange={v => setLights(l => ({ ...l, upper: v }))} />
            </div>
            <div className="toggle-row">
              <div>
                <div className="toggle-row-label">Mid Floors</div>
                <div className="toggle-row-sub">Floors {Math.ceil(b.floors * 0.34) + 1}–{Math.ceil(b.floors * 0.67)}</div>
              </div>
              <Toggle on={lights.mid} onChange={v => setLights(l => ({ ...l, mid: v }))} />
            </div>
            <div className="toggle-row">
              <div>
                <div className="toggle-row-label">Lower Floors</div>
                <div className="toggle-row-sub">Floors 1–{Math.ceil(b.floors * 0.34)}</div>
              </div>
              <Toggle on={lights.lower} onChange={v => setLights(l => ({ ...l, lower: v }))} />
            </div>
            <div className="toggle-row">
              <div>
                <div className="toggle-row-label">Common Areas</div>
                <div className="toggle-row-sub">Lobbies, corridors</div>
              </div>
              <Toggle on={lights.common} onChange={v => setLights(l => ({ ...l, common: v }))} />
            </div>

            <div className="quick-btns">
              <button className="quick-btn" onClick={() => setLights({ upper: true, mid: true, lower: true, common: true })}>
                All On
              </button>
              <button className="quick-btn" onClick={() => setLights({ upper: false, mid: false, lower: false, common: false })}>
                All Off
              </button>
            </div>
          </div>

          {/* HVAC card */}
          <div className="card">
            <div className="card-title">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="8" r="5"/>
                <line x1="8" y1="3" x2="8" y2="13"/>
                <path d="M5 5.5 Q8 8 11 5.5"/>
                <path d="M5 10.5 Q8 8 11 10.5"/>
              </svg>
              HVAC
            </div>

            <div className="hvac-temp-display">
              <button className="hvac-temp-btn" onClick={() => setHvacTemp(t => t - 1)}>−</button>
              <div>
                <span className="hvac-temp-val">{hvacTemp}</span>
                <span className="hvac-temp-unit">°F</span>
              </div>
              <button className="hvac-temp-btn" onClick={() => setHvacTemp(t => t + 1)}>+</button>
            </div>

            <div className="mode-pills">
              {['Cool', 'Heat', 'Fan', 'Auto'].map(m => (
                <div
                  key={m}
                  className={`mode-pill${hvacMode === m ? ' active' : ''}`}
                  onClick={() => setHvacMode(m)}
                >
                  {m}
                </div>
              ))}
            </div>

            <div className="toggle-row">
              <div>
                <div className="toggle-row-label">HVAC Unit A</div>
                <div className="toggle-row-sub">Primary unit</div>
              </div>
              <Toggle on={hvacA} onChange={setHvacA} />
            </div>
            <div className="toggle-row">
              <div>
                <div className="toggle-row-label">HVAC Unit B</div>
                <div className="toggle-row-sub">Secondary unit</div>
              </div>
              <Toggle on={hvacB} onChange={setHvacB} />
            </div>

            <div className="slider-row" style={{ marginTop: '10px' }}>
              <label>Fan Speed</label>
              <input
                type="range" min={0} max={100} value={fanSpeed}
                onChange={e => setFanSpeed(+e.target.value)}
              />
              <span className="slider-val">{fanSpeed}%</span>
            </div>
          </div>

          {/* Alerts card */}
          <div className="card">
            <div className="card-title">Alerts</div>
            <div className="alert-row warn">
              <div className="alert-dot" />
              <span>High demand alert — Red day pricing active. Consider reducing HVAC load during peak hours (2–6 PM).</span>
            </div>
            <div className="alert-row ok">
              <div className="alert-dot" />
              <span>Floors 2–3 are in eco mode — saving 18% vs. baseline. Automation working as scheduled.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
