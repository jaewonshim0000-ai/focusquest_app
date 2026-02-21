import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useAppState } from '@store/index';

const StudentDashboard: React.FC = () => {
  const { state } = useAppState();

  const stats = [
    { icon: '⭐', value: state.points.available.toLocaleString(), label: 'Available Points', color: 'var(--fq-accent)' },
    { icon: '🔥', value: state.streak, label: 'Day Streak', color: 'var(--fq-orange)' },
    { icon: '🎯', value: state.sessionsToday, label: 'Sessions Today', color: 'var(--fq-accent2)' },
    { icon: '📋', value: state.tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length, label: 'Active Tasks', color: 'var(--fq-pink)' },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <span style={{ fontFamily: 'var(--fq-serif)', fontStyle: 'italic' }}>FocusQuest</span>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding fq-ambient">
        <div className="fq-animate-in">
          <h1 style={{ fontFamily: 'var(--fq-serif)', fontStyle: 'italic', fontSize: 32, margin: '16px 0 4px' }}>
            Good afternoon! 👋
          </h1>
          <p style={{ color: 'var(--fq-text2)', fontSize: 14, marginBottom: 24 }}>
            Keep up the great work — you're on a {state.streak}-day streak!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                background: 'var(--fq-surface)',
                border: '1px solid var(--fq-border)',
                borderRadius: 16,
                padding: 20,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--fq-serif)', fontStyle: 'italic', color: s.color }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: 'var(--fq-text3)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <button
              onClick={() => window.location.hash = '#/student/focus'}
              style={{
                padding: '16px 20px',
                borderRadius: 16,
                border: 'none',
                background: 'linear-gradient(135deg, var(--fq-accent), var(--fq-accent2))',
                color: '#000',
                fontFamily: 'var(--fq-sans)',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🎯 Start Focus
            </button>
            <button
              onClick={() => window.location.hash = '#/student/timekeeper'}
              style={{
                padding: '16px 20px',
                borderRadius: 16,
                border: '1px solid var(--fq-border)',
                background: 'var(--fq-surface2)',
                color: 'var(--fq-text)',
                fontFamily: 'var(--fq-sans)',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              📵 Time Keeper
            </button>
          </div>

          <div style={{ background: 'var(--fq-surface)', border: '1px solid var(--fq-border)', borderRadius: 20, padding: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>Recent Activity</div>
            {state.history.slice(0, 5).map((h, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 0',
                borderBottom: i < 4 ? '1px solid var(--fq-border)' : 'none',
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  background: h.type === 'focus' ? 'rgba(6,214,160,0.12)' :
                    h.type === 'timekeeper' ? 'rgba(0,180,216,0.12)' : 'rgba(124,58,237,0.12)',
                }}>
                  {h.type === 'focus' ? '🎯' : h.type === 'timekeeper' ? '📵' : '✅'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{h.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--fq-text3)' }}>{h.displayTime}</div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--fq-accent)', fontSize: 15 }}>
                  +{h.points}
                </div>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default StudentDashboard;
