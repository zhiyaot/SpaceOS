import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Filler);

const labels = Array.from({ length: 28 }, (_, i) => 'Apr ' + (i + 1));
const seed = labels.map((_, i) => Math.round(180 + Math.sin(i * 0.4) * 35 + Math.cos(i * 0.7) * 18));
const actual = seed.map(v => Math.round(v * (0.52 + Math.sin(v * 0.1) * 0.07)));

const lineData = {
  labels,
  datasets: [
    {
      label: 'Baseline (kWh)',
      data: seed,
      borderColor: 'rgba(124,92,252,.6)',
      backgroundColor: 'rgba(124,92,252,.06)',
      borderWidth: 1.5,
      pointRadius: 0,
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Actual (kWh)',
      data: actual,
      borderColor: '#00d4ff',
      backgroundColor: 'rgba(0,212,255,.08)',
      borderWidth: 2,
      pointRadius: 0,
      fill: true,
      tension: 0.4,
    },
  ],
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { tooltip: { mode: 'index', intersect: false } },
  scales: {
    x: {
      ticks: { color: '#4a5368', font: { size: 9 }, maxTicksLimit: 7 },
      grid: { color: 'rgba(255,255,255,.04)' },
    },
    y: {
      ticks: { color: '#4a5368', font: { size: 9 } },
      grid: { color: 'rgba(255,255,255,.04)' },
    },
  },
};

const doughnutData = {
  labels: ['HVAC', 'Lighting', 'Equipment', 'Other'],
  datasets: [{
    data: [42, 28, 20, 10],
    backgroundColor: [
      'rgba(0,212,255,.7)',
      'rgba(124,92,252,.7)',
      'rgba(0,230,118,.7)',
      'rgba(255,171,64,.7)',
    ],
    borderColor: 'rgba(255,255,255,.06)',
    borderWidth: 1,
  }],
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: { enabled: true },
    legend: { display: false },
  },
  cutout: '70%',
};

const COST_BARS = [
  { label: 'HVAC',       pct: 72, val: '$224', color: '#00d4ff' },
  { label: 'Lighting',   pct: 48, val: '$149', color: '#7c5cfc' },
  { label: 'Equipment',  pct: 35, val: '$109', color: '#00e676' },
  { label: 'Other',      pct: 18, val: '$56',  color: '#ffab40' },
];

const INSIGHTS = [
  { tag: 'SAVINGS',    cls: 'tag-save',  text: 'Reducing HVAC setpoint by 2°F on Floors 4–6 on nights & weekends could save an additional $47/month.' },
  { tag: 'PREDICTION', cls: 'tag-pred',  text: "Tomorrow's occupancy forecast is 82% — schedule pre-cooling to 69°F by 7:30 AM for optimal comfort." },
  { tag: 'ALERT',      cls: 'tag-alert', text: 'Floor 7 lighting has been on for 14 hrs with no detected occupancy. Scheduling auto-off at 10 PM.' },
  { tag: 'OCCUPANCY',  cls: 'tag-occ',   text: 'Tuesday occupancy peaked at 91% — consider staggered HVAC zones to reduce peak demand charges.' },
];

export default function InsightsPage() {
  return (
    <div className="page">
      {/* Metric cards */}
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-label">Energy Saved</div>
          <div className="metric-value">1,847</div>
          <div style={{ fontSize: 10, color: 'var(--text3)' }}>kWh this month</div>
          <div className="metric-delta pos">▲ 14%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Cost Savings</div>
          <div className="metric-value">$312</div>
          <div style={{ fontSize: 10, color: 'var(--text3)' }}>vs. last month</div>
          <div className="metric-delta pos">▲ $38</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Automation Rate</div>
          <div className="metric-value">84%</div>
          <div style={{ fontSize: 10, color: 'var(--text3)' }}>actions automated</div>
          <div className="metric-delta pos">▲ 6 pts</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Manual Overrides</div>
          <div className="metric-value">17</div>
          <div style={{ fontSize: 10, color: 'var(--text3)' }}>this month</div>
          <div className="metric-delta neg">▲ 3</div>
        </div>
      </div>

      {/* Charts row */}
      <div className="charts-row">
        <div className="chart-wrap">
          <div className="card-title">Energy Usage — April</div>
          <div className="chart-inner">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
        <div className="chart-wrap">
          <div className="card-title">Savings by Category</div>
          <div className="chart-inner">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Insights + cost breakdown */}
      <div className="insights-grid">
        <div>
          <div className="section-title">AI Insights</div>
          <div className="insight-list">
            {INSIGHTS.map((ins, i) => (
              <div key={i} className="insight-item">
                <span className={`insight-tag ${ins.cls}`}>{ins.tag}</span>
                {ins.text}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-title">Cost Breakdown</div>
          <div className="card">
            <div className="cost-bars">
              {COST_BARS.map(bar => (
                <div key={bar.label} className="cost-bar-row">
                  <div className="cost-bar-label">{bar.label}</div>
                  <div className="cost-bar-track">
                    <div
                      className="cost-bar-fill"
                      style={{ width: bar.pct + '%', background: bar.color }}
                    />
                  </div>
                  <div className="cost-bar-val">{bar.val}</div>
                </div>
              ))}
            </div>
            <div className="payback-box">
              <div className="payback-val">2.4 yr</div>
              <div className="payback-label">Estimated payback period at current savings rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
