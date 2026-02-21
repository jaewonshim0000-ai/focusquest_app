// ──────────────────────────────────────────────────
// App State Store (React Context + useReducer)
// ──────────────────────────────────────────────────

import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type {
  User,
  Task,
  ActivityItem,
  PointBalance,
  RaffleEntry,
  ParentSettings,
} from '@models/index';

// ── State Shape ──────────────────────────────────

export interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Student data
  points: PointBalance;
  streak: number;
  sessionsToday: number;
  tasks: Task[];
  history: ActivityItem[];
  raffleEntries: RaffleEntry[];

  // Time Keeper
  timeKeeperActive: boolean;
  timeKeeperElapsed: number; // seconds
  timeKeeperAchieved: number[]; // milestone mins achieved

  // Focus Mode
  focusActive: boolean;
  focusDuration: number;
  focusLabel: string;

  // Parent data
  parentSettings: ParentSettings;

  // UI
  toast: { icon: string; msg: string; pts?: number } | null;
  showConfetti: boolean;
}

const defaultParentSettings: ParentSettings = {
  sleepStartHour: 22,
  sleepStartMinute: 0,
  sleepEndHour: 6,
  sleepEndMinute: 0,
  dailySessionCap: 4,
  requirePhotoWithReflection: false,
  prizeCategoriesEnabled: {
    'Gift Cards': true,
    'Books & Education': true,
    'Games & Toys': true,
    'Tech Accessories': true,
    'Candy & Snacks': false,
    'Clothing': true,
  },
  monthlyPrizeBudget: null,
  notificationPreferences: {
    taskSubmitted: true,
    sessionCompleted: true,
    emergencyUnlock: true,
    weeklyReport: true,
  },
};

export const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  points: { available: 0, lifetime: 0 },
  streak: 0,
  sessionsToday: 0,
  tasks: [],
  history: [],
  raffleEntries: [],
  timeKeeperActive: false,
  timeKeeperElapsed: 0,
  timeKeeperAchieved: [],
  focusActive: false,
  focusDuration: 30,
  focusLabel: '',
  parentSettings: defaultParentSettings,
  toast: null,
  showConfetti: false,
};

// ── Actions ──────────────────────────────────────

export type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_POINTS'; payload: PointBalance }
  | { type: 'AWARD_POINTS'; payload: number }
  | { type: 'SPEND_POINTS'; payload: number }
  | { type: 'SET_STREAK'; payload: number }
  | { type: 'INCREMENT_SESSIONS' }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'ADD_HISTORY'; payload: ActivityItem }
  | { type: 'SET_HISTORY'; payload: ActivityItem[] }
  | { type: 'ADD_RAFFLE_ENTRY'; payload: RaffleEntry }
  | { type: 'TK_START' }
  | { type: 'TK_STOP' }
  | { type: 'TK_TICK' }
  | { type: 'TK_ACHIEVE_MILESTONE'; payload: number }
  | { type: 'FOCUS_START'; payload: { duration: number; label: string } }
  | { type: 'FOCUS_END' }
  | { type: 'SET_PARENT_SETTINGS'; payload: Partial<ParentSettings> }
  | { type: 'SHOW_TOAST'; payload: { icon: string; msg: string; pts?: number } }
  | { type: 'HIDE_TOAST' }
  | { type: 'SHOW_CONFETTI' }
  | { type: 'HIDE_CONFETTI' };

// ── Reducer ──────────────────────────────────────

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_POINTS':
      return { ...state, points: action.payload };
    case 'AWARD_POINTS':
      return {
        ...state,
        points: {
          available: state.points.available + action.payload,
          lifetime: state.points.lifetime + action.payload,
        },
      };
    case 'SPEND_POINTS':
      return {
        ...state,
        points: { ...state.points, available: state.points.available - action.payload },
      };
    case 'SET_STREAK':
      return { ...state, streak: action.payload };
    case 'INCREMENT_SESSIONS':
      return { ...state, sessionsToday: state.sessionsToday + 1 };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
        ),
      };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'ADD_HISTORY':
      return { ...state, history: [action.payload, ...state.history] };
    case 'SET_HISTORY':
      return { ...state, history: action.payload };
    case 'ADD_RAFFLE_ENTRY':
      return { ...state, raffleEntries: [...state.raffleEntries, action.payload] };
    case 'TK_START':
      return { ...state, timeKeeperActive: true, timeKeeperElapsed: 0, timeKeeperAchieved: [] };
    case 'TK_STOP':
      return { ...state, timeKeeperActive: false };
    case 'TK_TICK':
      return { ...state, timeKeeperElapsed: state.timeKeeperElapsed + 1 };
    case 'TK_ACHIEVE_MILESTONE':
      return { ...state, timeKeeperAchieved: [...state.timeKeeperAchieved, action.payload] };
    case 'FOCUS_START':
      return { ...state, focusActive: true, focusDuration: action.payload.duration, focusLabel: action.payload.label };
    case 'FOCUS_END':
      return { ...state, focusActive: false };
    case 'SET_PARENT_SETTINGS':
      return { ...state, parentSettings: { ...state.parentSettings, ...action.payload } };
    case 'SHOW_TOAST':
      return { ...state, toast: action.payload };
    case 'HIDE_TOAST':
      return { ...state, toast: null };
    case 'SHOW_CONFETTI':
      return { ...state, showConfetti: true };
    case 'HIDE_CONFETTI':
      return { ...state, showConfetti: false };
    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}
