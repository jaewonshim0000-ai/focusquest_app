import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonToggle, IonButton } from '@ionic/react';
import { useAppState } from '@store/index';

const SettingsPage: React.FC = () => {
  const { state, dispatch } = useAppState();
  const s = state.parentSettings;

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Settings</IonTitle></IonToolbar></IonHeader>
      <IonContent fullscreen className="ion-padding fq-ambient">
        <div className="fq-animate-in">
          <h1 style={{ fontFamily: 'var(--fq-serif)', fontStyle: 'italic', fontSize: 32, margin: '16px 0 4px' }}>Settings ⚙️</h1>
          <p style={{ color: 'var(--fq-text2)', fontSize: 14, marginBottom: 24 }}>Configure app behavior and notifications.</p>

          <div style={{ background: 'var(--fq-surface)', border: '1px solid var(--fq-border)', borderRadius: 20, padding: 20, marginBottom: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 16 }}>Time Keeper</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--fq-text2)', marginBottom: 6 }}>Sleep Start</div>
                <input type="time" defaultValue={`${String(s.sleepStartHour).padStart(2,'0')}:${String(s.sleepStartMinute).padStart(2,'0')}`}
                  style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid var(--fq-border)', background: 'var(--fq-bg2)', color: 'var(--fq-text)', fontFamily: 'var(--fq-sans)' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'var(--fq-text2)', marginBottom: 6 }}>Sleep End</div>
                <input type="time" defaultValue={`${String(s.sleepEndHour).padStart(2,'0')}:${String(s.sleepEndMinute).padStart(2,'0')}`}
                  style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid var(--fq-border)', background: 'var(--fq-bg2)', color: 'var(--fq-text)', fontFamily: 'var(--fq-sans)' }} />
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--fq-surface)', border: '1px solid var(--fq-border)', borderRadius: 20, padding: 20, marginBottom: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 16 }}>Focus Mode</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: 'var(--fq-text2)', marginBottom: 6 }}>Daily Session Cap</div>
              <input type="number" min={1} max={10} defaultValue={s.dailySessionCap}
                style={{ width: 100, padding: 12, borderRadius: 12, border: '1px solid var(--fq-border)', background: 'var(--fq-bg2)', color: 'var(--fq-text)', fontFamily: 'var(--fq-sans)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14 }}>Require photo with reflection</span>
              <IonToggle checked={s.requirePhotoWithReflection}
                onIonChange={(e) => dispatch({ type: 'SET_PARENT_SETTINGS', payload: { requirePhotoWithReflection: e.detail.checked } })}
                style={{ '--background-checked': 'var(--fq-accent)' }} />
            </div>
          </div>

          <div style={{ background: 'var(--fq-surface)', border: '1px solid var(--fq-border)', borderRadius: 20, padding: 20, marginBottom: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 16 }}>Notifications</div>
            {Object.entries(s.notificationPreferences).map(([key, enabled]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--fq-border)' }}>
                <span style={{ fontSize: 14 }}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())}</span>
                <IonToggle checked={enabled}
                  onIonChange={(e) => dispatch({ type: 'SET_PARENT_SETTINGS', payload: {
                    notificationPreferences: { ...s.notificationPreferences, [key]: e.detail.checked }
                  }})}
                  style={{ '--background-checked': 'var(--fq-accent)' }} />
              </div>
            ))}
          </div>

          <IonButton expand="block" fill="outline" color="danger" style={{ '--border-radius': '14px' }}
            onClick={() => { dispatch({ type: 'SET_USER', payload: null }); window.location.href = '/login'; }}>
            Sign Out
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default SettingsPage;
