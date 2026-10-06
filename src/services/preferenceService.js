// ================================================
// TrustSocial – Preference Service
// Future endpoints:
//   GET  /api/preferences
//   PUT  /api/preferences
//   POST /api/preferences/reset
// ================================================

import { MOCK_PREFERENCES } from '../data/mockData';

const PREF_KEY = 'trustsocial_preferences';

function getStored() {
  try {
    const data = localStorage.getItem(PREF_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function getPreferences() {
  await new Promise((r) => setTimeout(r, 300));
  return getStored() || { ...MOCK_PREFERENCES };
}

export async function savePreferences(preferences) {
  await new Promise((r) => setTimeout(r, 500));
  localStorage.setItem(PREF_KEY, JSON.stringify(preferences));
  return preferences;
}

export async function resetPreferences() {
  await new Promise((r) => setTimeout(r, 400));
  localStorage.removeItem(PREF_KEY);
  return { ...MOCK_PREFERENCES };
}

export async function updateInterest(topic, value) {
  await new Promise((r) => setTimeout(r, 200));
  const prefs = getStored() || { ...MOCK_PREFERENCES };
  prefs.interests[topic] = value;
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
  return prefs;
}
