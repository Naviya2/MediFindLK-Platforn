// Static content for the authentication / login page. Kept separate so copy
// tweaks don't require touching component markup (mirrors landingContent.js).

// The three verification "pillars" shown in the segmented role switcher. Each
// role carries the copy that swaps into the context note, the sign-in CTA and
// the identifier field when it is selected.
export const AUTH_ROLES = [
  {
    id: 'citizen',
    label: 'Patient / Citizen',
    tagline: 'Free search & alerts',
    icon: 'person',
    badge: 'Public',
    badgeClass: 'bg-surface-container-highest/70 text-on-surface-variant',
    contextTitle: 'Patient / Citizen Portal:',
    contextBody:
      'Access voluntary personalised stock notification watchlists and saved prescription refill reminders.',
    cta: 'Sign In as Patient / Public',
    identifierLabel: 'Email or Mobile Number',
    identifierPlaceholder: 'e.g. you@email.com or 077 123 4567',
    canRegister: true,
    register: {
      tab: 'Create Account',
      title: 'Create your patient account',
      subtitle:
        'Save medicine watchlists and get an alert the moment stock changes at a pharmacy near you. Free, and never required to search.',
      cta: 'Create Patient Account',
      needsPharmacyFields: false,
      note: 'We only use your contact details to send the stock alerts you ask for. No prescription upload, ever.',
    },
  },
  {
    id: 'pharmacist',
    label: 'Pharmacist',
    tagline: 'Dispensary inventory',
    icon: 'medical_services',
    badge: 'SLPC Verified',
    badgeClass: 'bg-secondary-container text-on-secondary-container font-bold',
    contextTitle: 'Pharmacist Portal:',
    contextBody:
      'Log in with your Sri Lanka Pharmacy Council (SLPC) registration or National Medicines Regulatory Authority (NMRA) retail credentials.',
    cta: 'Sign In to Pharmacist Dashboard',
    identifierLabel: 'Dispensary Email or SLPC Reg ID',
    identifierPlaceholder: 'e.g. SLPC-2024-8891 or pharmacy email',
    canRegister: true,
    register: {
      tab: 'Register Pharmacy',
      title: 'Register your dispensary',
      subtitle:
        'List your pharmacy on the national network so patients can see your live stock. Portal access opens once your licence is verified.',
      cta: 'Create Pharmacy Account',
      needsPharmacyFields: true,
      note: 'Submitted dispensaries are cross-checked against the SLPC register and NMRA retail licence database before full portal access is granted.',
    },
  },
  {
    id: 'admin',
    label: 'System Admin',
    tagline: 'Regulatory oversight',
    icon: 'shield',
    badge: 'NMRA Direct',
    badgeClass: 'bg-surface-container-highest/70 text-on-surface-variant',
    contextTitle: 'System Administrator Portal:',
    contextBody:
      'Restricted federal audit terminal for NMRA zonal directors and Ministry of Health stock telemetry analysts.',
    cta: 'Access NMRA Telemetry Console',
    identifierLabel: 'Health Ministry / Gov.lk ID',
    identifierPlaceholder: 'e.g. dir.telemetry@health.gov.lk',
    canRegister: false,
    // Admin accounts are provisioned directly by the NMRA — no self sign-up.
  },
]

export const DEFAULT_ROLE_ID = 'pharmacist'

export function getRole(roleId) {
  return AUTH_ROLES.find((role) => role.id === roleId) ?? AUTH_ROLES[0]
}

// Password guidance pills shown under the password field.
export const PASSWORD_RULES = [
  '8+ characters',
  'Alphanumeric & symbol',
  'MFA Linked',
]

export const TRUST_BADGES = [
  { icon: 'lock', label: '256-bit SSL Encrypted' },
  { icon: 'verified', label: 'NMRA Verified Portal' },
  { icon: 'health_and_safety', label: 'SLPC Code 410 Compliant' },
]
