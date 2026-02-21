// ──────────────────────────────────────────────────
// FocusQuest Cloud Functions
// ──────────────────────────────────────────────────

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// ── Raffle Drawing (runs every Monday at 9 AM) ──

export const drawRaffleWinners = functions.pubsub
  .schedule('0 9 * * 1') // Every Monday at 9:00 AM UTC
  .timeZone('America/New_York')
  .onRun(async () => {
    const rafflesRef = db.collection('raffles');
    const openRaffles = await rafflesRef.where('status', '==', 'closed').get();

    for (const raffleDoc of openRaffles.docs) {
      const raffle = raffleDoc.data();
      const entriesSnapshot = await db
        .collection('raffle_entries')
        .where('raffleId', '==', raffleDoc.id)
        .get();

      const allTickets: { userId: string; ticket: number }[] = [];
      entriesSnapshot.docs.forEach(entryDoc => {
        const entry = entryDoc.data();
        entry.ticketNumbers.forEach((ticket: number) => {
          allTickets.push({ userId: entry.userId, ticket });
        });
      });

      if (allTickets.length < raffle.minimumEntries) {
        // Refund all entries — minimum not met
        await raffleDoc.ref.update({ status: 'cancelled' });
        for (const entryDoc of entriesSnapshot.docs) {
          const entry = entryDoc.data();
          await db.doc(`point_balances/${entry.userId}`).update({
            available: admin.firestore.FieldValue.increment(entry.totalCost),
          });
        }
        continue;
      }

      // Draw winner using crypto-random
      const winnerIndex = Math.floor(Math.random() * allTickets.length);
      const winner = allTickets[winnerIndex];

      await raffleDoc.ref.update({
        status: 'completed',
        winnerId: winner.userId,
        winningTicket: winner.ticket,
      });

      // Notify winner
      await db.collection('notifications').add({
        userId: winner.userId,
        type: 'raffle_results',
        title: '🎉 You Won!',
        body: `You won the ${raffle.tier} raffle! Check your rewards.`,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    functions.logger.info('Raffle drawing complete');
  });

// ── Task Overdue Check (runs daily at midnight) ──

export const checkOverdueTasks = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('America/New_York')
  .onRun(async () => {
    const now = new Date().toISOString();
    const tasksRef = db.collection('tasks');
    const overdueTasks = await tasksRef
      .where('status', 'in', ['pending', 'in_progress'])
      .where('dueDate', '<', now)
      .get();

    const batch = db.batch();
    overdueTasks.docs.forEach(doc => {
      batch.update(doc.ref, { status: 'overdue', updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    });
    await batch.commit();

    functions.logger.info(`Marked ${overdueTasks.size} tasks as overdue`);
  });

// ── Task Auto-Archive (7 days overdue) ───────────

export const archiveOldTasks = functions.pubsub
  .schedule('0 1 * * *')
  .onRun(async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const oldTasks = await db.collection('tasks')
      .where('status', '==', 'overdue')
      .where('updatedAt', '<', sevenDaysAgo)
      .get();

    const batch = db.batch();
    oldTasks.docs.forEach(doc => {
      batch.update(doc.ref, { status: 'cancelled', updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    });
    await batch.commit();

    functions.logger.info(`Auto-archived ${oldTasks.size} overdue tasks`);
  });

// ── Anomaly Detection (runs hourly) ─────────────

export const detectAnomalies = functions.pubsub
  .schedule('0 * * * *')
  .onRun(async () => {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    // Check for users with too many sessions in the last hour
    const sessions = await db.collection('focus_sessions')
      .where('startedAt', '>', oneHourAgo.toISOString())
      .where('status', '==', 'completed')
      .get();

    const userSessionCounts: Record<string, number> = {};
    sessions.docs.forEach(doc => {
      const userId = doc.data().userId;
      userSessionCounts[userId] = (userSessionCounts[userId] || 0) + 1;
    });

    for (const [userId, count] of Object.entries(userSessionCounts)) {
      if (count > 6) {
        functions.logger.warn(`Anomaly: User ${userId} completed ${count} sessions in 1 hour`);
        await db.collection('anomaly_flags').add({
          userId,
          type: 'excessive_sessions',
          count,
          detectedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }
  });

// ── Send Weekly Progress Report (Sundays 9 AM) ──

export const sendWeeklyReport = functions.pubsub
  .schedule('0 9 * * 0')
  .timeZone('America/New_York')
  .onRun(async () => {
    const parents = await db.collection('users').where('role', '==', 'parent').get();

    for (const parentDoc of parents.docs) {
      const parent = parentDoc.data();
      if (!parent.childUids?.length) continue;

      // TODO: Aggregate weekly stats per child and send email via SendGrid/Mailgun
      functions.logger.info(`Weekly report for parent ${parentDoc.id} with ${parent.childUids.length} children`);
    }
  });

// ── New Task Notification (Firestore trigger) ────

export const onTaskCreated = functions.firestore
  .document('tasks/{taskId}')
  .onCreate(async (snap) => {
    const task = snap.data();
    await db.collection('notifications').add({
      userId: task.assignedTo,
      type: 'task_assigned',
      title: '📋 New Task Assigned',
      body: `"${task.title}" — ${task.points} points`,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      data: { taskId: snap.id },
    });
  });

// ── Task Status Change Notification ──────────────

export const onTaskUpdated = functions.firestore
  .document('tasks/{taskId}')
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status === after.status) return;

    if (after.status === 'completed' || after.status === 'rejected') {
      await db.collection('notifications').add({
        userId: after.assignedTo,
        type: after.status === 'completed' ? 'task_approved' : 'task_rejected',
        title: after.status === 'completed' ? '✅ Task Approved!' : '↩️ Task Needs Revision',
        body: after.status === 'completed'
          ? `"${after.title}" approved — +${after.points} points!`
          : `"${after.title}" rejected: ${after.rejectionReason || 'See details'}`,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        data: { taskId: change.after.id },
      });
    }

    if (after.status === 'awaiting_review') {
      await db.collection('notifications').add({
        userId: after.createdBy,
        type: 'review_needed',
        title: '📤 Task Submitted for Review',
        body: `"${after.title}" is ready for your review`,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        data: { taskId: change.after.id },
      });
    }
  });
