import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useAppState } from '@store/index';

const ProgressPage: React.FC = () => {
  const { state } = useAppState();
  const weekData = [
    { day: 'Mon', mins: 45 }, { day: 'Tue', mins: 90 }, { day: 'Wed', mins: 30 },
    { day: 'Thu', mins: 75 }, { day: 'Fri', mins: 60 }, { day: 'Sat', mins: 20 }, { day: 'Sun', mins: 0 },
  ];
  const maxMins = Math.max(...weekData.map(d => d.mins), 1);

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Progress</IonTitle></IonToolbar></IonHeader>
      <IonContent fullscreen className="ion-padding fq-ambient">
        <div className="fq-animate-in">
          <h1 style={{ fontFamily: 'var(--fq-serif)', fontStyle: 'italic', fontSize: 32, margin: '16px 0 4px' }}>Progress 📈</h1>
          <p style={{ color: 'var(--fq-text2)', fontSize: 14, marginBottom: 24 }}>Weekly performance summary</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { icon: '🎯', value: '14', label: 'Sessions', color: 'var(--fq-accent)' },
              { icon: '⏱️', value: '5.3h', label: 'Focus Time', color: 'var(--fq-accent2)' },
              { icon: '⭐', value: '892', label: 'Points Earned', color: 'var(--fq-warn)' },
              { icon: '✅', value: '5', label: 'Tasks Done', color: 'var(--fq-success)' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--fq-surface)', border: '1px solid var(--fq-border)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: s.color, fontFamily: 'var(--fq-serif)', fontStyle: 'italic' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--fq-text3)', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--fq-surface)', border: '1px solid var(--fq-border)', borderRadius: 20, padding: 20 }}>
            <div style={{ fontWeight: 600, marginBottom: 16 }}>Daily Focus Minutes</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120 }}>
              {weekData.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 10, color: 'var(--fq-text2)', fontWeight: 600 }}>{d.mins}m</div>
                  <div style={{
                    width: '100%', borderRadius: '6px 6px 0 0', minHeight: 4,
                    height: `${(d.mins / maxMins) * 100}%`,
                    background: 'linear-gradient(180deg, var(--fq-accent), var(--fq-accent2))',
                  }} />
                  <div style={{ fontSize: 10, color: 'var(--fq-text3)' }}>{d.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default ProgressPage;
