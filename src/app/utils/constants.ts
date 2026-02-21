// ──────────────────────────────────────────────────
// FocusQuest Constants & Utilities
// ──────────────────────────────────────────────────

import type { TimeKeeperMilestone } from '@models/index';

// ── Focus Mode Point Table ───────────────────────

export const POINT_TABLE = [
  { min: 10, max: 14, base: 10, streak: 2 },
  { min: 15, max: 29, base: 20, streak: 4 },
  { min: 30, max: 44, base: 40, streak: 6 },
  { min: 45, max: 59, base: 65, streak: 8 },
  { min: 60, max: 89, base: 100, streak: 10 },
  { min: 90, max: 120, base: 150, streak: 15 },
] as const;

export const FOCUS_PRESETS = [10, 15, 30, 45, 60, 90, 120] as const;
export const MAX_SESSIONS_PER_DAY = 4;
export const MAX_STREAK_BONUS_DAYS = 7;
export const MIN_REFLECTION_LENGTH = 10;
export const MAX_REFLECTION_LENGTH = 200;
export const EMERGENCY_HOLD_SECONDS = 15;
export const SESSION_COOLDOWN_MINUTES = 10;

// ── Time Keeper ──────────────────────────────────

export const TIMEKEEPER_MILESTONES: TimeKeeperMilestone[] = [
  { mins: 30, pts: 5, label: '30 min' },
  { mins: 60, pts: 15, label: '1 hour' },
  { mins: 120, pts: 35, label: '2 hours' },
  { mins: 180, pts: 60, label: '3 hours' },
  { mins: 240, pts: 80, label: '4 hours' },
];

export const TIMEKEEPER_GRACE_SECONDS = 15;

// ── Raffle Tiers ─────────────────────────────────

export const RAFFLE_TIERS = [
  { id: 'bronze' as const, name: 'Bronze', cost: 50, color: '#CD7F32', icon: '🥉', prizes: ['$5 Gift Card', 'Sticker Pack', 'Phone Grip'] },
  { id: 'silver' as const, name: 'Silver', cost: 150, color: '#C0C0C0', icon: '🥈', prizes: ['$15 Gift Card', 'Book', 'Small Toy'] },
  { id: 'gold' as const, name: 'Gold', cost: 400, color: '#FFD700', icon: '🥇', prizes: ['$30 Gift Card', 'Headphones', 'Board Game'] },
  { id: 'platinum' as const, name: 'Platinum', cost: 1000, color: '#E5E4E2', icon: '💎', prizes: ['$50+ Gift Card', 'Backpack', 'Tech Accessory'] },
] as const;

export const MIN_RAFFLE_ENTRIES = 10;
export const MAX_ENTRIES_PER_RAFFLE = 10;

// ── Task Constraints ─────────────────────────────

export const MIN_TASK_POINTS = 5;
export const MAX_TASK_POINTS = 200;
export const MAX_ACTIVE_TASKS = 5;
export const MAX_DAILY_ASSIGNED_POINTS = 500;

// ── Verification Types ───────────────────────────

export const VERIFICATION_TYPES = [
  { id: 'timer' as const, label: 'Timer-Based', icon: '⏱️', desc: 'Must run Focus Mode' },
  { id: 'photo' as const, label: 'Photo Proof', icon: '📸', desc: 'Upload a photo' },
  { id: 'text' as const, label: 'Text Reflection', icon: '✍️', desc: 'Written description' },
  { id: 'manual' as const, label: 'Parent Approval', icon: '👁️', desc: 'Parent reviews & approves' },
] as const;

// ── Utility Functions ────────────────────────────

/**
 * Calculate points earned for a focus session.
 */
export function calculateFocusPoints(durationMinutes: number, streakDays: number): number {
  const tier = POINT_TABLE.find(t => durationMinutes >= t.min && durationMinutes <= t.max);
  if (!tier) return 0;
  const clampedStreak = Math.min(streakDays, MAX_STREAK_BONUS_DAYS);
  return tier.base + tier.streak * clampedStreak;
}

/**
 * Format seconds as MM:SS
 */
export function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/**
 * Format seconds as human-readable (e.g., "1h 23m 45s")
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

/**
 * Generate a unique ID (simple for client-side; Firestore generates real IDs)
 */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Merge class names, filtering out falsy values
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
