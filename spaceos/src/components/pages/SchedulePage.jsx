import { useState, useRef } from 'react';

// ── Prompt parser ──────────────────────────────────────────────────────────
const EXAMPLE_PROMPTS = [
  'Pre-cool to 68°F before 7:30 AM on weekdays',
  'Turn off lights on empty floors after 9 PM',
  'Dim to 30% on weekends after 6 PM',
  'HVAC standby when floors are unoccupied',
  'Save energy during peak hours 2–6 PM',
  'Boost ventilation when CO₂ exceeds 800 ppm',
];

const TRIGGERS = [
  'Occupancy drops below 10%',
  'Time of day',
  'CO₂ level exceeds 800 ppm',
  'Temperature threshold',
  'Manual trigger',
  'Energy demand spike',
];
const ACTIONS = [
  'Turn off lights',
  'Set HVAC to standby',
  'Dim lights to 30%',
  'Lock access doors',
  'Send alert',
  'Pre-cool to setpoint',
  'Boost fan speed',
];

function parseTime(raw, ampm) {
  if (!raw) return null;
  const parts = raw.split(':');
  let h = parseInt(parts[0]);
  const m = parts[1] ? parts[1].padStart(2, '0') : '00';
  if (ampm === 'pm' && h < 12) h += 12;
  if (ampm === 'am' && h === 12) h = 0;
  const ap = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${ap}`;
}

function parsePrompt(text) {
  const t = text.toLowerCase();

  // Systems
  const isLight = /\b(light|bright|dim|led|lamp|illuminat)\b/.test(t);
  const isHVAC  = /\b(hvac|heat|cool|warm|temp|ac|fan|air|ventil|setpoint|degree|°)\b/.test(t);
  const isAll   = /\b(everything|all system|entire|whole building)\b/.test(t);

  // Actions
  const turnOff  = /\b(turn off|shut off|switch off|off|disable|deactivate)\b/.test(t);
  const turnOn   = /\b(turn on|switch on|enable|activate)\b/.test(t);
  const dim      = /\b(dim|reduce bright|lower bright)\b/.test(t);
  const preCool  = /\b(pre.?cool|precool)\b/.test(t);
  const preHeat  = /\b(pre.?heat|preheat|warm up before|warm up at)\b/.test(t);
  const standby  = /\b(standby|eco mode|sleep mode|idle|hibernate)\b/.test(t);
  const boost    = /\b(boost|increase|max|ramp up|full)\b/.test(t);
  const save     = /\b(save|saving|reduce|cut|minimiz|efficien|conserve|lower usage)\b/.test(t);

  // Temperature target
  const tempRx    = t.match(/(\d{2,3})\s*°?\s*f\b/);
  const targetTemp = tempRx ? parseInt(tempRx[1]) : null;

  // Percentage target
  const pctRx    = t.match(/(\d{1,3})\s*%/);
  const targetPct = pctRx ? parseInt(pctRx[1]) : null;

  // Time parsing
  const beforeRx = t.match(/before\s+(\d{1,2}(?::\d{2})?)\s*(am|pm)?/);
  const afterRx  = t.match(/after\s+(\d{1,2}(?::\d{2})?)\s*(am|pm)?/);
  const atRx     = t.match(/(?:^|at|by|@)\s+(\d{1,2}(?::\d{2})?)\s*(am|pm)/);
  const rangeRx  = t.match(/(\d{1,2})\s*[–\-–to]+\s*(\d{1,2})\s*(am|pm)?/);

  const beforeTime = beforeRx ? parseTime(beforeRx[1], beforeRx[2]) : null;
  const afterTime  = afterRx  ? parseTime(afterRx[1],  afterRx[2])  : null;
  const atTime     = atRx     ? parseTime(atRx[1],     atRx[2])     : null;
  const rangeStr   = rangeRx  ? `${rangeRx[1]}–${rangeRx[2]} ${(rangeRx[3] || 'PM').toUpperCase()}` : null;

  // Day type
  const weekdays = /\b(weekday|monday|tuesday|wednesday|thursday|friday|work day|mon.fri)\b/.test(t);
  const weekends = /\b(weekend|saturday|sunday|sat|sun)\b/.test(t);
  const daily    = /\b(daily|every day|all week|each day|always)\b/.test(t);
  const nights   = /\b(night|overnight|evening)\b/.test(t);
  const morning  = /\b(morning|dawn|sunrise)\b/.test(t);
  const dayStr   = weekdays ? 'weekdays' : weekends ? 'weekends' : daily ? 'daily' : nights ? 'evenings' : '';

  // Condition
  const ifEmpty    = /\b(empty|unoccupied|vacant|no one|nobody|no occupan)\b/.test(t);
  const ifOccupied = /\b(occupied|when people|someone|presence|in use)\b/.test(t);
  const ifCO2      = /\b(co2|co₂|carbon|ppm|air quality)\b/.test(t);
  const ifPeak     = /\b(peak|demand spike|high demand|2.?6|pricing)\b/.test(t);

  // Floors / zones
  const upperZone  = /\b(upper|top floor|upper floor|high floor)\b/.test(t);
  const lowerZone  = /\b(lower|ground|basement|bottom floor)\b/.test(t);
  const floorStr   = upperZone ? 'upper floors' : lowerZone ? 'lower floors' : 'all floors';

  // CO₂ threshold
  const co2Rx     = t.match(/(\d{3,4})\s*ppm/);
  const co2Level  = co2Rx ? parseInt(co2Rx[1]) : 800;

  return {
    isLight, isHVAC, isAll, turnOff, turnOn, dim, preCool, preHeat,
    standby, boost, save, targetTemp, targetPct,
    beforeTime, afterTime, atTime, rangeStr,
    weekdays, weekends, daily, nights, morning, dayStr,
    ifEmpty, ifOccupied, ifCO2, ifPeak, floorStr, co2Level,
  };
}

function buildInterpretation(p) {
  const parts = [];

  const systems = [];
  if (p.isLight) systems.push('lighting');
  if (p.isHVAC)  systems.push('HVAC');
  if (p.isAll)   systems.push('all systems');
  if (!systems.length) systems.push('building systems');
  parts.push(`System: ${systems.join(' + ')}`);

  const acts = [];
  if (p.preCool)  acts.push(`pre-cool${p.targetTemp ? ` to ${p.targetTemp}°F` : ''}`);
  if (p.preHeat)  acts.push(`pre-heat${p.targetTemp ? ` to ${p.targetTemp}°F` : ''}`);
  if (p.turnOff)  acts.push('turn off');
  if (p.dim)      acts.push(`dim${p.targetPct ? ` to ${p.targetPct}%` : ' to 30%'}`);
  if (p.standby)  acts.push('set to standby');
  if (p.boost)    acts.push('boost output');
  if (p.save)     acts.push('optimize for energy savings');
  if (!acts.length) acts.push('schedule adjustment');
  parts.push(`Action: ${acts.join(', ')}`);

  const conds = [];
  if (p.beforeTime) conds.push(`before ${p.beforeTime}`);
  if (p.afterTime)  conds.push(`after ${p.afterTime}`);
  if (p.atTime)     conds.push(`at ${p.atTime}`);
  if (p.rangeStr)   conds.push(`during ${p.rangeStr}`);
  if (p.dayStr)     conds.push(p.dayStr);
  if (p.ifEmpty)    conds.push('when unoccupied');
  if (p.ifCO2)      conds.push(`when CO₂ > ${p.co2Level} ppm`);
  if (p.ifPeak)     conds.push('during peak demand hours');
  if (conds.length) parts.push(`Trigger: ${conds.join(', ')}`);

  parts.push(`Scope: ${p.floorStr}`);
  return parts;
}

function generateRules(p) {
  const rules = [];
  const timeStr = p.afterTime ? `after ${p.afterTime}` :
                  p.beforeTime ? `before ${p.beforeTime}` :
                  p.atTime ? `at ${p.atTime}` :
                  p.rangeStr ? `during ${p.rangeStr}` : null;
  const dayRef  = p.dayStr || '';
  const timing  = [timeStr, dayRef].filter(Boolean).join(' — ') || 'on trigger';
  const condRef = p.ifEmpty ? 'when unoccupied' :
                  p.ifCO2   ? `when CO₂ > ${p.co2Level} ppm` :
                  p.ifPeak  ? 'during peak hours (2–6 PM)' : null;
  const scope   = p.floorStr;

  // ── Lighting rules ────────────────────────────────────────────────────────
  if (p.isLight || (!p.isHVAC && !p.isAll)) {
    if (p.turnOff) {
      rules.push({
        text: `Lights off — ${scope} — ${condRef || timing}`,
        color: 'green-rule',
      });
      if (condRef && timeStr) {
        rules.push({
          text: `Emergency / common lights to 10% — corridors — ${timing}`,
          color: 'blue-rule',
        });
      }
    } else if (p.dim) {
      const pct = p.targetPct || 30;
      rules.push({
        text: `Dim lights to ${pct}% — ${scope} — ${condRef || timing}`,
        color: 'blue-rule',
      });
    } else if (p.save) {
      rules.push({
        text: `Lights off — unoccupied floors — within 10 min of vacancy`,
        color: 'green-rule',
      });
      rules.push({
        text: `Dim to 40% — ${scope} — ${timeStr || 'after 6 PM'}`,
        color: 'blue-rule',
      });
    } else if (p.boost || p.turnOn) {
      rules.push({
        text: `Lights on at 100% — ${scope} — ${timing}`,
        color: 'blue-rule',
      });
    }
  }

  // ── HVAC rules ────────────────────────────────────────────────────────────
  if (p.isHVAC || p.isAll) {
    if (p.preCool) {
      const temp = p.targetTemp || 69;
      const time = p.beforeTime || p.atTime || '7:30 AM';
      rules.push({
        text: `Pre-cool to ${temp}°F — ${scope} — ${dayRef || 'daily'} by ${time}`,
        color: 'amber-rule',
      });
      rules.push({
        text: `Return to 72°F — ${scope} — ${dayRef || 'daily'} at 9:00 AM`,
        color: 'blue-rule',
      });
    } else if (p.preHeat) {
      const temp = p.targetTemp || 70;
      const time = p.beforeTime || p.atTime || '7:45 AM';
      rules.push({
        text: `Pre-heat to ${temp}°F — ${scope} — ${dayRef || 'daily'} by ${time}`,
        color: 'amber-rule',
      });
    } else if (p.standby || (p.turnOff && p.isHVAC)) {
      rules.push({
        text: `HVAC standby — ${condRef ? condRef : `${scope} — ${timing}`}`,
        color: 'amber-rule',
      });
    } else if (p.save) {
      rules.push({
        text: `HVAC standby — unoccupied zones — after 20 min vacancy`,
        color: 'amber-rule',
      });
      rules.push({
        text: `Reduce HVAC load 20% — ${scope} — ${p.rangeStr ? `during ${p.rangeStr}` : 'peak hours 2–6 PM'}`,
        color: 'blue-rule',
      });
    } else if (p.ifCO2) {
      rules.push({
        text: `Boost ventilation to 100% — ${scope} — when CO₂ > ${p.co2Level} ppm`,
        color: 'amber-rule',
      });
      rules.push({
        text: `Return fan to 60% — ${scope} — when CO₂ drops below ${Math.round(p.co2Level * 0.8)} ppm`,
        color: 'blue-rule',
      });
    } else if (p.boost) {
      rules.push({
        text: `Fan speed 100% — ${scope} — ${timing}`,
        color: 'blue-rule',
      });
    } else if (p.targetTemp && timeStr) {
      rules.push({
        text: `Set HVAC to ${p.targetTemp}°F — ${scope} — ${timing}`,
        color: 'amber-rule',
      });
    }
  }

  // ── General / mixed / energy ──────────────────────────────────────────────
  if (p.isAll || (p.save && !p.isLight && !p.isHVAC)) {
    if (!rules.find(r => r.color === 'green-rule')) {
      rules.push({
        text: `Lights off — unoccupied floors — occupancy < 5%`,
        color: 'green-rule',
      });
    }
    if (!rules.find(r => r.color === 'amber-rule')) {
      rules.push({
        text: `HVAC standby — vacant zones — within 20 min`,
        color: 'amber-rule',
      });
    }
  }

  if (p.ifPeak && rules.length < 3) {
    rules.push({
      text: `Alert: high-demand pricing — reduce HVAC load — peak hours ${p.rangeStr || '2–6 PM'}`,
      color: 'amber-rule',
    });
  }

  // Fallback if parser found nothing actionable
  if (rules.length === 0) {
    rules.push({
      text: `Schedule rule — ${scope} — ${condRef || timing || 'on trigger'}`,
      color: 'blue-rule',
    });
  }

  return rules.slice(0, 3);
}

// ── Component ──────────────────────────────────────────────────────────────
export default function SchedulePage({ activeRules, onAddRule, onRemoveRule, onClearAll }) {
  const [trigger, setTrigger] = useState(TRIGGERS[0]);
  const [action, setAction]   = useState(ACTIONS[0]);
  const [timeVal, setTimeVal] = useState('');

  const [nlpText, setNlpText]       = useState('');
  const [aiState, setAiState]       = useState('idle'); // idle | thinking | done
  const [interpretation, setInterp] = useState([]);
  const [nlpResults, setNlpResults] = useState(null);
  const [accepted, setAccepted]     = useState(new Set());
  const timerRef = useRef(null);

  function handleGenerate() {
    const trimmed = nlpText.trim();
    if (!trimmed) return;
    setAiState('thinking');
    setNlpResults(null);
    setInterp([]);
    setAccepted(new Set());
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const parsed = parsePrompt(trimmed);
      const rules  = generateRules(parsed);
      const interp = buildInterpretation(parsed);
      setInterp(interp);
      setNlpResults(rules);
      setAiState('done');
    }, 1200);
  }

  function handleAcceptRule(idx) {
    if (!nlpResults) return;
    onAddRule(nlpResults[idx]);
    setAccepted(prev => new Set([...prev, idx]));
  }

  function handleAcceptAll() {
    if (!nlpResults) return;
    nlpResults.forEach(r => onAddRule(r));
    setNlpResults(null);
    setNlpText('');
    setAiState('idle');
    setInterp([]);
    setAccepted(new Set());
  }

  function handleAddRule() {
    const label = `${action} — ${trigger}${timeVal ? ' — ' + timeVal : ''}`;
    onAddRule({ text: label, color: 'blue-rule' });
  }

  function handleExampleChip(chip) {
    setNlpText(chip);
    setNlpResults(null);
    setAiState('idle');
    setInterp([]);
    setAccepted(new Set());
  }

  return (
    <div className="page">
      {/* Active rules banner */}
      <div className="active-rules-bar">
        {activeRules.length === 0 ? (
          <span className="empty-msg">No active rules — add rules below or use the AI scheduler.</span>
        ) : (
          <>
            {activeRules.map((rule, i) => (
              <div key={i} className={`rule-chip ${rule.color || 'blue-rule'}`}>
                {rule.text}
                <button className="chip-x" onClick={() => onRemoveRule(i)}>×</button>
              </div>
            ))}
            <button className="btn-secondary" style={{ marginLeft: 'auto', flexShrink: 0 }} onClick={onClearAll}>
              Clear all
            </button>
          </>
        )}
      </div>

      <div className="schedule-layout">
        {/* Manual rule builder */}
        <div>
          <div className="section-title">Rule Builder</div>
          <div className="card">
            <div className="form-group">
              <label>TRIGGER</label>
              <select value={trigger} onChange={e => setTrigger(e.target.value)}>
                {TRIGGERS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>ACTION</label>
              <select value={action} onChange={e => setAction(e.target.value)}>
                {ACTIONS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>TIME / CONDITION (optional)</label>
              <input
                type="text"
                placeholder="e.g. weekdays after 9 PM"
                value={timeVal}
                onChange={e => setTimeVal(e.target.value)}
              />
            </div>
            <button className="btn-primary" onClick={handleAddRule}>+ Add Rule</button>
          </div>
        </div>

        {/* AI scheduler */}
        <div>
          <div className="section-title">AI Scheduler</div>
          <div className="card">
            {/* Example chips */}
            <div className="example-chips">
              {EXAMPLE_PROMPTS.map(p => (
                <div key={p} className="example-chip" onClick={() => handleExampleChip(p)}>{p}</div>
              ))}
            </div>

            <textarea
              className="nlp-textarea"
              rows={3}
              placeholder="Describe what you want to automate in plain English…"
              value={nlpText}
              onChange={e => setNlpText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
            />
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4, marginBottom: 8 }}>
              ⌘↵ to generate
            </div>

            <button className="btn-primary" onClick={handleGenerate} disabled={aiState === 'thinking'}>
              {aiState === 'thinking' ? 'Analyzing…' : 'Generate Rules'}
            </button>

            {/* Thinking state */}
            {aiState === 'thinking' && (
              <div className="ai-thinking">
                <div className="typing-indicator">
                  <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                </div>
                <span>Parsing prompt and generating rules…</span>
              </div>
            )}

            {/* Results */}
            {aiState === 'done' && nlpResults && (
              <div className="nlp-results">
                {/* Interpretation panel */}
                <div className="ai-interpretation">
                  <div className="ai-interp-title">
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="8" cy="8" r="7"/><line x1="8" y1="5" x2="8" y2="8.5"/>
                      <circle cx="8" cy="11.5" r="0.8" fill="currentColor"/>
                    </svg>
                    Understood as
                  </div>
                  {interpretation.map((line, i) => (
                    <div key={i} className="ai-interp-line">{line}</div>
                  ))}
                </div>

                {/* Generated rules */}
                <div className="ai-rules-label">Generated rules</div>
                {nlpResults.map((r, i) => (
                  <div key={i} className={`nlp-result-item ${r.color}`}>
                    <span className="nlp-result-text">{r.text}</span>
                    <button
                      className={`accept-one-btn ${accepted.has(i) ? 'accepted' : ''}`}
                      onClick={() => handleAcceptRule(i)}
                      disabled={accepted.has(i)}
                    >
                      {accepted.has(i) ? '✓ Added' : '+ Add'}
                    </button>
                  </div>
                ))}
                {nlpResults.length > 1 && (
                  <button className="accept-all-btn" onClick={handleAcceptAll}>
                    Accept All {nlpResults.length} Rules
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
