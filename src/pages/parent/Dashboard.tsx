import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useAppState } from '@store/index';

const DashboardPage: React.FC = () => {
  const { state } = useAppState();
  const reviewCount = state.tasks.filter(t => t.status === 'awaiting_review').length;

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Overview</IonTitle></IonToolbar></IonHeader>
      <IonContent fullscreen className="ion-padding fq-ambient">
        <div className="fq-animate-in">
          <h1 style={{ fontFamily: 'var(--fq-serif)', fontStyle: 'italic', fontSize: 32, margin: '16px 0 4px' }}>
            Parent Dashboard
          </h1>
          <p style={{ color: 'var(--fq-text2)', fontSize: 14, marginBottom: 24 }}>
            Overview of {state.user?.displayName === 'Parent' ? "Alex's" : "your child's"} progress
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { icon: '⏱️', value: '2h 15m', label: 'Focus Today', color: 'var(--fq-accent)' },
              { icon: '⭐', value: state.points.available, label: 'Points', color: 'var(--fq-warn)' },
              { icon: '🔥', value: state.streak, label: 'Streak', color: 'var(--fq-orange)' },
              { icon: '📋', value: reviewCount, label: 'Needs Review', color: 'var(--fq-accent2)' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'var(--fq-surface)', border: '1px solid var(--fq-border)',
                borderRadius: 16, padding: 20, textAlign: 'center',
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

          {reviewCount > 0 && (
            <div style={{
              background: 'var(--fq-surface)', border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 20, padding: 20, marginBottom: 16,
            }}>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>
                ⚠️ {reviewCount} task{reviewCount > 1 ? 's' : ''} awaiting your review
              </div>
              <p style={{ fontSize: 13, color: 'var(--fq-text2)' }}>
                Go to Task Manager to approve or reject submitted tasks.
              </p>
            </div>
          )}

          <div style={{ background: 'var(--fq-surface)', border: '1px solid var(--fq-border)', borderRadius: 20, padding: 20 }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Recent Activity</div>
            {state.history.slice(0, 5).map((h, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--fq-border)' : 'none',
              }}>
                <span style={{ fontSize: 18 }}>
                  {h.type === 'focus' ? '🎯' : h.type === 'timekeeper' ? '📵' : '✅'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{h.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--fq-text3)' }}>{h.displayTime}</div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--fq-accent)', fontSize: 14 }}>+{h.points}</div>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default DashboardPage;
