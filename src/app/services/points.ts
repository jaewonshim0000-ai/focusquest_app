// ──────────────────────────────────────────────────
// Points Service
// ──────────────────────────────────────────────────

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirebaseDb } from './firebase';
import type { PointBalance, PointSource, PointTransaction } from '@models/index';
import { generateId } from '@utils/constants';

/**
 * Get a user's current point balance.
 */
export async function getPointBalance(userId: string): Promise<PointBalance> {
  const db = getFirebaseDb();
  const balanceDoc = await getDoc(doc(db, 'point_balances', userId));

  if (!balanceDoc.exists()) {
    // Initialize balance for new users
    const initial: PointBalance = { available: 0, lifetime: 0 };
    await setDoc(doc(db, 'point_balances', userId), initial);
    return initial;
  }

  return balanceDoc.data() as PointBalance;
}

/**
 * Award points to a user (from focus sessions, time keeper, or tasks).
 */
export async function awardPoints(
  userId: string,
  amount: number,
  source: PointSource,
  sourceId: string,
  label: string
): Promise<PointTransaction> {
  const db = getFirebaseDb();

  // Update balance atomically
  await updateDoc(doc(db, 'point_balances', userId), {
    available: increment(amount),
    lifetime: increment(amount),
  });

  // Log the transaction
  const transaction: PointTransaction = {
    id: generateId(),
    userId,
    amount,
    source,
    sourceId,
    label,
    timestamp: new Date().toISOString(),
  };

  await addDoc(collection(db, 'users', userId, 'points_ledger'), {
    ...transaction,
    timestamp: serverTimestamp(),
  });

  return transaction;
}

/**
 * Spend points (raffle entry). Returns false if insufficient balance.
 */
export async function spendPoints(
  userId: string,
  amount: number,
  label: string
): Promise<boolean> {
  const db = getFirebaseDb();
  const balance = await getPointBalance(userId);

  if (balance.available < amount) return false;

  await updateDoc(doc(db, 'point_balances', userId), {
    available: increment(-amount),
  });

  await addDoc(collection(db, 'users', userId, 'points_ledger'), {
    id: generateId(),
    userId,
    amount: -amount,
    source: 'raffle_entry',
    sourceId: '',
    label,
    timestamp: serverTimestamp(),
  });

  return true;
}

/**
 * Get recent point transactions for a user.
 */
export async function getRecentTransactions(
  userId: string,
  maxResults: number = 20
): Promise<PointTransaction[]> {
  const db = getFirebaseDb();
  const q = query(
    collection(db, 'users', userId, 'points_ledger'),
    orderBy('timestamp', 'desc'),
    limit(maxResults)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as PointTransaction);
}
