// Static content for the landing page. Kept separate so copy/tweaks don't
// require touching component markup.

export const DISTRICTS = [
  { value: 'all', label: 'All Districts (Island-wide)' },
  { value: 'colombo', label: 'Colombo District' },
  { value: 'gampaha', label: 'Gampaha District' },
  { value: 'kandy', label: 'Kandy District' },
  { value: 'galle', label: 'Galle District' },
  { value: 'kalutara', label: 'Kalutara District' },
  { value: 'kurunegala', label: 'Kurunegala District' },
  { value: 'jaffna', label: 'Jaffna District' },
  { value: 'matara', label: 'Matara District' },
  { value: 'anuradhapura', label: 'Anuradhapura District' },
  { value: 'badulla', label: 'Badulla District' },
  { value: 'ratnapura', label: 'Ratnapura District' },
]

export const POPULAR_SEARCHES = [
  'Insulin (Mixtard)',
  'Thyroxine 50mcg',
  'Metformin 500mg',
  'Amoxicillin Syrup',
  'Salbutamol Inhaler',
]

// Mock pharmacy rows shown in the hero's live-results panel (demo only).
export const MOCK_RESULTS = [
  {
    id: 'w-4109',
    nmra: 'NMRA #W-4109',
    name: 'Union Chemists - Colombo 03',
    address: 'R.A. De Mel Mawatha, Kollupitiya • 1.4 km away',
    status: { label: 'In Stock (38 Units)', tone: 'in' },
    verified: 'Verified 12 mins ago',
    phone: '0112574991',
  },
  {
    id: 'w-1844',
    nmra: 'NMRA #W-1844',
    name: 'State Pharmaceuticals Corporation (Osu Sala)',
    address: 'Lipton Circus, Colombo 07 • 2.8 km away',
    status: { label: 'Low Stock (6 Units)', tone: 'low' },
    verified: 'Verified 4 mins ago',
    phone: '0112694965',
  },
]

export const LIVE_STATS = [
  { icon: 'local_pharmacy', value: '1,420+', label: 'Verified Pharmacies', accent: false },
  { icon: 'medication', value: '98,000+', label: 'Medicine Units Tracked', accent: false },
  { icon: 'map', value: '25 / 25', label: 'Districts Covered', accent: false },
  { icon: 'sync', value: '4 mins ago', label: 'Latest Live Sync', accent: true, spin: true },
]

export const CHALLENGES = [
  {
    number: 'Challenge 01',
    tag: 'Fuel & Time Waste',
    icon: 'directions_walk',
    iconWrap: 'bg-primary-container text-secondary-fixed',
    numberClass: 'text-on-tertiary-container',
    title: 'Blind Travelling Between Pharmacies',
    without:
      'Patients physically visit 5+ pharmacies across suburbs, losing vital hours and critical patient stabilization windows.',
    with: 'Real-time geo-located inventory shows the exact stock count and phone number of the closest verified retailer in seconds.',
  },
  {
    number: 'Challenge 02',
    tag: 'Bio-Equivalence',
    icon: 'swap_horiz',
    iconWrap: 'bg-secondary text-on-secondary',
    numberClass: 'text-secondary',
    title: 'Generic vs. Brand Name Confusion',
    without:
      'A pharmacy is out of a specific trade label (e.g. Lipitor), leaving families stranded even though generic Atorvastatin is plentiful.',
    with: 'Instant NMRA-approved bio-equivalent generic suggestions ensure prescriptions are fulfilled safely without unnecessary panic.',
  },
  {
    number: 'Challenge 03',
    tag: 'Emergency Window',
    icon: 'hourglass_top',
    iconWrap: 'bg-primary text-secondary-fixed',
    numberClass: 'text-on-tertiary-container',
    title: 'Critical Time-Sensitive Illnesses',
    without:
      'Patients travel 45 minutes only to find the last vial of refrigerated insulin was sold 10 minutes prior to arrival.',
    with: 'Direct dispensary phone lines and a 2-hour digital stock hold permit guaranteed reservation while in transit.',
  },
]

export const STEPS = [
  {
    number: '01',
    numberClass: 'text-primary/20',
    accentBg: 'bg-primary-container/5',
    iconWrap: 'bg-primary text-on-primary',
    icon: 'search_check',
    title: 'Search Medicine & Location',
    body: 'Enter any brand name or molecular generic formulation. Specify your Sri Lankan district or let geo-location rank options by road distance.',
    note: { icon: 'verified_user', text: 'No app installation or account required' },
  },
  {
    number: '02',
    numberClass: 'text-secondary/20',
    accentBg: 'bg-secondary/5',
    iconWrap: 'bg-secondary text-on-secondary',
    icon: 'phone_in_talk',
    title: 'View Stock & Hold Reservation',
    body: 'Examine live unit counters, price ceilings under NMRA regulations, and telephone the pharmacy directly with 1-tap to secure a 2-hour hold.',
    note: { icon: 'timer', text: 'Emergency 2-hour reservation window' },
  },
  {
    number: '03',
    numberClass: 'text-primary/20',
    accentBg: 'bg-primary-container/5',
    iconWrap: 'bg-primary-container text-secondary-fixed',
    icon: 'update',
    title: 'Pharmacies Keep Stocks Fresh',
    body: 'Licensed pharmacists utilize a lightweight mobile portal or POS sync to deduct dispatched batches in 1-click, guaranteeing accurate community visibility.',
    note: { icon: 'bolt', text: 'Sub-minute sync telemetry' },
  },
]
