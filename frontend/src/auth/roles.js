// Role definitions for MediFind LK's client-side role-based access control.
// Keep the string ids in sync with the auth role ids in
// src/features/auth/authContent.js.

export const ROLES = {
  CITIZEN: 'citizen',
  PHARMACIST: 'pharmacist',
  ADMIN: 'admin',
}

export const ROLE_META = {
  [ROLES.CITIZEN]: {
    label: 'Patient / Citizen',
    short: 'Citizen',
    icon: 'person',
    home: '/portal/citizen',
  },
  [ROLES.PHARMACIST]: {
    label: 'Pharmacist',
    short: 'Pharmacist',
    icon: 'medical_services',
    home: '/portal/pharmacist',
  },
  [ROLES.ADMIN]: {
    label: 'System Administrator',
    short: 'Admin',
    icon: 'shield',
    home: '/portal/admin',
  },
}

/** Landing route for a role after sign-in (falls back to the public home). */
export function roleHome(role) {
  return ROLE_META[role]?.home ?? '/'
}

export function roleLabel(role) {
  return ROLE_META[role]?.label ?? 'Unknown role'
}
