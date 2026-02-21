// ──────────────────────────────────────────────────
// Tasks Service
// ──────────────────────────────────────────────────

import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { getFirebaseDb } from './firebase';
import type { Task, TaskStatus, VerificationType, TaskPriority, TaskRecurrence } from '@models/index';
import { MAX_ACTIVE_TASKS, MAX_TASK_POINTS, MIN_TASK_POINTS } from '@utils/constants';

export interface CreateTaskInput {
  title: string;
  description?: string;
  points: number;
  verification: VerificationType[];
  dueDate?: string;
  priority: TaskPriority;
  recurring: TaskRecurrence;
  minTimerMinutes?: number;
  assignedTo: string;
}

/**
 * Create a new task assigned by parent to student.
 * Returns the created task or throws if constraints are violated.
 */
export async function createTask(
  parentUid: string,
  input: CreateTaskInput
): Promise<Task> {
  const db = getFirebaseDb();

  // Validate point range
  const clampedPoints = Math.max(MIN_TASK_POINTS, Math.min(MAX_TASK_POINTS, input.points));

  // Check active task count (advisory warning, not blocking)
  const activeTasks = await getTasksByStudent(input.assignedTo, ['pending', 'in_progress']);
  const overLimit = activeTasks.length >= MAX_ACTIVE_TASKS;

  const now = new Date().toISOString();
  const task: Omit<Task, 'id'> = {
    title: input.title.slice(0, 80),
    description: input.description?.slice(0, 300),
    points: clampedPoints,
    verification: input.verification,
    dueDate: input.dueDate,
    priority: input.priority,
    status: 'pending',
    recurring: input.recurring,
    createdBy: parentUid,
    assignedTo: input.assignedTo,
    minTimerMinutes: input.minTimerMinutes,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(collection(db, 'tasks'), {
    ...task,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { ...task, id: docRef.id };
}

/**
 * Update task status (used by both students and parents).
 */
export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
  extra?: { reflection?: string; photoUrl?: string; rejectionReason?: string }
): Promise<void> {
  const db = getFirebaseDb();
  const updates: Record<string, unknown> = {
    status,
    updatedAt: serverTimestamp(),
  };

  if (extra?.reflection) updates.reflection = extra.reflection;
  if (extra?.photoUrl) updates.photoUrl = extra.photoUrl;
  if (extra?.rejectionReason) updates.rejectionReason = extra.rejectionReason;
  if (status === 'completed') updates.completedAt = serverTimestamp();

  await updateDoc(doc(db, 'tasks', taskId), updates);
}

/**
 * Delete a task. If in progress, parent must choose partial points or no points.
 */
export async function deleteTask(taskId: string): Promise<void> {
  const db = getFirebaseDb();
  await updateDoc(doc(db, 'tasks', taskId), {
    status: 'cancelled',
    updatedAt: serverTimestamp(),
  });
}

/**
 * Get tasks for a student, optionally filtered by status.
 */
export async function getTasksByStudent(
  studentUid: string,
  statuses?: TaskStatus[]
): Promise<Task[]> {
  const db = getFirebaseDb();
  let q = query(
    collection(db, 'tasks'),
    where('assignedTo', '==', studentUid),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  let tasks = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Task));

  if (statuses && statuses.length > 0) {
    tasks = tasks.filter(t => statuses.includes(t.status));
  }

  return tasks;
}

/**
 * Get tasks created by a parent.
 */
export async function getTasksByParent(parentUid: string): Promise<Task[]> {
  const db = getFirebaseDb();
  const q = query(
    collection(db, 'tasks'),
    where('createdBy', '==', parentUid),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Task));
}

/**
 * Subscribe to real-time task updates for a student.
 */
export function subscribeToStudentTasks(
  studentUid: string,
  callback: (tasks: Task[]) => void
): Unsubscribe {
  const db = getFirebaseDb();
  const q = query(
    collection(db, 'tasks'),
    where('assignedTo', '==', studentUid),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, snapshot => {
    const tasks = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Task));
    callback(tasks);
  });
}

/**
 * Subscribe to real-time task updates for a parent's children.
 */
export function subscribeToParentTasks(
  parentUid: string,
  callback: (tasks: Task[]) => void
): Unsubscribe {
  const db = getFirebaseDb();
  const q = query(
    collection(db, 'tasks'),
    where('createdBy', '==', parentUid),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, snapshot => {
    const tasks = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Task));
    callback(tasks);
  });
}
