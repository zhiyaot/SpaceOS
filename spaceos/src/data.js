export const BUILDINGS = {
  skirkanich: { name: 'Skirkanich Hall', floors: 8, devices: 89, abbrev: 'SKI', theme: 'Engineering & Applied Science', saving: '$312', occ: '68%', temp: '71°F' },
  levine:     { name: 'Levine Hall',     floors: 6, devices: 54, abbrev: 'LEV', theme: 'Computer Science & Math',      saving: '$241', occ: '74%', temp: '70°F' },
  towne:      { name: 'Towne Building',  floors: 5, devices: 61, abbrev: 'TWN', theme: 'General Engineering',          saving: '$189', occ: '55%', temp: '72°F' },
  detkin:     { name: 'Detkin Lab',      floors: 4, devices: 38, abbrev: 'DTK', theme: 'Electronics Lab',              saving: '$145', occ: '42%', temp: '69°F' },
  moore:      { name: 'Moore Building',  floors: 9, devices: 72, abbrev: 'MRE', theme: 'Electrical Engineering',       saving: '$278', occ: '61%', temp: '73°F' },
};

export function getFloorData(buildingId, floorIdx) {
  const seed = (buildingId.charCodeAt(0) + floorIdx * 7) % 100;
  return {
    occupied: seed > 35,
    lightOn:  seed > 25,
    temp:     68 + (seed % 8),
    power:    1.2 + (seed % 40) / 10,
    people:   seed > 35 ? 2 + (seed % 15) : 0,
  };
}

export const DEVICE_TEMPLATES = [
  { type: 'light',  name: 'Smart LED Panel',       stats: ['Brightness', '72%',         'Power',   '38W'],        status: 'online',  floor: 1 },
  { type: 'light',  name: 'Emergency Lighting',    stats: ['Mode',       'Standby',      'Power',   '4W'],         status: 'online',  floor: 2 },
  { type: 'hvac',   name: 'HVAC Unit A',            stats: ['Temp',       '72°F',         'Load',    '68%'],        status: 'online',  floor: 3 },
  { type: 'hvac',   name: 'HVAC Unit B',            stats: ['Temp',       '70°F',         'Load',    '45%'],        status: 'online',  floor: 1 },
  { type: 'sensor', name: 'Occupancy Sensor',       stats: ['Status',     'Active',       'Signal',  'Strong'],     status: 'online',  floor: 4 },
  { type: 'sensor', name: 'CO₂ Monitor',            stats: ['CO₂',        '412 ppm',      'Status',  'Normal'],     status: 'online',  floor: 2 },
  { type: 'sensor', name: 'Temp Sensor',            stats: ['Reading',    '71°F',         'Battery', '87%'],        status: 'online',  floor: 5 },
  { type: 'access', name: 'Card Reader — Lobby',    stats: ['Mode',       'Active',       'Events',  '24 today'],   status: 'online',  floor: 1 },
  { type: 'hvac',   name: 'Air Handler 1',          stats: ['CFM',        '2400',         'Status',  'Running'],    status: 'online',  floor: 6 },
  { type: 'light',  name: 'Exterior Lights',        stats: ['Schedule',   'Dusk-dawn',    'Power',   '120W'],       status: 'online',  floor: 1 },
  { type: 'sensor', name: 'Motion Sensor',          stats: ['Last motion','3 min ago',    'Zone',    'Corridor'],   status: 'online',  floor: 3 },
  { type: 'hvac',   name: 'Chiller Unit',           stats: ['Temp',       '44°F',         'Efficiency','COP 4.2'], status: 'offline', floor: 7 },
];

export const NLP_RESPONSES = {
  default: [
    { text: 'Lights off — all floors — weeknights after 9 PM',   color: 'green-rule' },
    { text: 'HVAC to standby — unoccupied zones — within 20 min', color: 'blue-rule'  },
    { text: 'Pre-cool to 68°F — all zones — 30 min before 8 AM', color: 'amber-rule' },
  ],
  pre_cool: [
    { text: 'Set HVAC to 66°F — all floors — 7:30 AM daily',     color: 'amber-rule' },
    { text: 'Return to 70°F — all floors — 8:05 AM daily',       color: 'blue-rule'  },
  ],
  energy: [
    { text: 'Lights off — empty floors — occupancy < 5%',        color: 'green-rule' },
    { text: 'HVAC standby — floors vacant > 30 min',             color: 'amber-rule' },
    { text: 'Dim lights to 40% — all floors — after 6 PM',       color: 'blue-rule'  },
  ],
  warm: [
    { text: 'Set HVAC to 70°F — all floors — 7:45 AM weekdays',  color: 'amber-rule' },
    { text: 'Boost heating — lower floors — 30 min before 8 AM', color: 'blue-rule'  },
  ],
};

export const SETTINGS_SECTIONS = [
  'Building profile',
  'Automation',
  'Notifications',
  'Integrations',
  'Account',
];
