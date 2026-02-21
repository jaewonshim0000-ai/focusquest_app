import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useAppState } from '@store/index';

const TimeKeeperPage: React.FC = () => {
  const { state, dispatch } = useAppState();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Time Keeper</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding fq-ambient">
        <div className="fq-animate-in">
          <h1 style={{ fontFamily: 'var(--fq-serif)', fontStyle: 'italic', fontSize: 32, margin: '16px 0 4px' }}>
            Time Keeper 📵
          </h1>
          <p style={{ color: 'var(--fq-text2)', fontSize: 14, marginBottom: 24 }}>
            Stay off your phone to earn milestone rewards.
          </p>
          {/* 
            TODO: Implement full TimeKeeper UI
            See the prototype JSX artifact for the complete implementation.
            This page should use the useAppState() hook for state management
            and call services from @services/ for Firebase operations.
          */}
          <div style={{
            background: 'var(--fq-surface)',
            border: '1px solid var(--fq-border)',
            borderRadius: 20,
            padding: 32,
            textAlign: 'center',
            color: 'var(--fq-text2)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📵</div>
            <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--fq-text)', marginBottom: 8 }}>
              Time Keeper
            </div>
            <div style={{ fontSize: 13 }}>
              Connect Firebase and implement the full UI from the prototype.
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TimeKeeperPage;
