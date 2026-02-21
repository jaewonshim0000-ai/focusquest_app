// ──────────────────────────────────────────────────
// FocusQuest Data Models
// ──────────────────────────────────────────────────

export type UserRole = 'student' | 'parent';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  parentUid?: string; // For student accounts, links to parent
  childUids?: string[]; // For parent accounts, links to children
  createdAt: string;
}

// ── Focus Mode ───────────────────────────────────

export interface FocusSession {
  id: string;
  userId: string;
  duration: number; // minutes
  label?: string;
  status: 'active' | 'completed' | 'terminated' | 'emergency';
  pointsEarned: number;
  streakDay: number;
  reflection?: string;
  photoUrl?: string;
  startedAt: string;
  completedAt?: string;
}

// ── Time Keeper ──────────────────────────────────

export interface TimeKeeperEvent {
  id: string;
  userId: string;
  durationMinutes: number;
  milestoneMinutes: number;
  pointsEarned: number;
  achievedAt: string;
}

export interface TimeKeeperMilestone {
  mins: number;
  pts: number;
  label: string;
}

// ── Tasks ────────────────────────────────────────

export type TaskStatus =
  | 'pending'
  | 'in_progress'
  | 'awaiting_review'
  | 'completed'
  | 'rejected'
  | 'overdue'
  | 'cancelled';

export type VerificationType = 'timer' | 'photo' | 'text' | 'manual';

export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskRecurrence = 'daily' | 'weekly' | 'monthly' | null;

export interface Task {
  id: string;
  title: string;
  description?: string;
  points: number;
  verification: VerificationType[];
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
  recurring: TaskRecurrence;
  createdBy: string; // parent UID
  assignedTo: string; // student UID
  minTimerMinutes?: number;
  reflection?: string;
  photoUrl?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// ── Points ───────────────────────────────────────

export type PointSource = 'focus_mode' | 'time_keeper' | 'parent_task';

export interface PointTransaction {
  id: string;
  userId: string;
  amount: number;
  source: PointSource;
  sourceId: string; // session/event/task ID
  label: string;
  timestamp: string;
}

export interface PointBalance {
  available: number;
  lifetime: number;
}

// ── Raffles ──────────────────────────────────────

export type RaffleTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Raffle {
  id: string;
  tier: RaffleTier;
  entryCost: number;
  prizes: string[];
  entryWindowStart: string;
  entryWindowEnd: string;
  totalEntries: number;
  minimumEntries: number;
  status: 'open' | 'closed' | 'drawing' | 'completed' | 'cancelled';
  winnerId?: string;
  winningTicket?: number;
}

export interface RaffleEntry {
  id: string;
  raffleId: string;
  userId: string;
  quantity: number;
  totalCost: number;
  ticketNumbers: number[];
  enteredAt: string;
}

// ── Activity History ─────────────────────────────

export type ActivityType = 'focus' | 'timekeeper' | 'task' | 'raffle';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  label: string;
  points: number;
  duration?: number;
  reflection?: string;
  timestamp: string;
  displayTime: string;
}

// ── Notifications ────────────────────────────────

export type NotificationType =
  | 'task_assigned'
  | 'task_due_24h'
  | 'task_due_2h'
  | 'task_overdue'
  | 'task_approved'
  | 'task_rejected'
  | 'raffle_results'
  | 'streak_at_risk'
  | 'review_needed'
  | 'session_completed'
  | 'emergency_unlock';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, string>;
}

// ── Parent Settings ──────────────────────────────

export interface ParentSettings {
  sleepStartHour: number; // 0-23
  sleepStartMinute: number;
  sleepEndHour: number;
  sleepEndMinute: number;
  dailySessionCap: number;
  requirePhotoWithReflection: boolean;
  prizeCategoriesEnabled: Record<string, boolean>;
  monthlyPrizeBudget: number | null;
  notificationPreferences: Record<string, boolean>;
}
