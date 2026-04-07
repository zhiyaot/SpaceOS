export default function Toggle({ on, onChange }) {
  return (
    <div
      className={`toggle${on ? ' on' : ''}`}
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
    />
  );
}
