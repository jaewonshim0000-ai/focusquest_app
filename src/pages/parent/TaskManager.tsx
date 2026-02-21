import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonBadge } from '@ionic/react';
import { useAppState } from '@store/index';

const TaskManagerPage: React.FC = () => {
  const { state } = useAppState();
  const statusGroups = ['pending', 'awaiting_review', 'in_progress', 'completed', 'rejected'] as const;

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Task Manager</IonTitle></IonToolbar></IonHeader>
      <IonContent fullscreen className="ion-padding fq-ambient">
        <div className="fq-animate-in">
          <h1 style={{ fontFamily: 'var(--fq-serif)', fontStyle: 'italic', fontSize: 32, margin: '16px 0 4px' }}>
            Task Manager 📋
          </h1>
          <p style={{ color: 'var(--fq-text2)', fontSize: 14, marginBottom: 20 }}>Create and manage tasks for your child.</p>

          <IonButton
            style={{
              '--background': 'linear-gradient(135deg, var(--fq-accent), var(--fq-accent2))',
              '--border-radius': '14px',
              '--color': '#000',
              marginBottom: 20,
            }}
          >
            + Create New Task
          </IonButton>

          {state.tasks.map(task => (
            <div key={task.id} style={{
              background: 'var(--fq-surface)', border: '1px solid var(--fq-border)',
              borderRadius: 16, padding: 16, marginBottom: 10,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{task.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--fq-text3)', marginTop: 4 }}>
                    {task.verification.join(', ')} {task.dueDate ? `· Due ${task.dueDate}` : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    background: 'rgba(6,214,160,0.12)', color: 'var(--fq-accent)',
                    fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 8, marginBottom: 4,
                  }}>{task.points} pts</div>
                  <div style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 6, fontWeight: 600,
                    textTransform: 'uppercase',
                    background: task.status === 'awaiting_review' ? 'rgba(245,158,11,0.15)' :
                      task.status === 'completed' ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.2)',
                    color: task.status === 'awaiting_review' ? 'var(--fq-warn)' :
                      task.status === 'completed' ? 'var(--fq-success)' : 'var(--fq-text3)',
                  }}>{task.status.replace('_', ' ')}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};
export default TaskManagerPage;
