import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonToggle, IonItem, IonLabel, IonList } from '@ionic/react';
import { useAppState } from '@store/index';

const RewardSettingsPage: React.FC = () => {
  const { state, dispatch } = useAppState();
  const categories = Object.entries(state.parentSettings.prizeCategoriesEnabled);
  const icons: Record<string, string> = {
    'Gift Cards': '💳', 'Books & Education': '📚', 'Games & Toys': '🎮',
    'Tech Accessories': '🔌', 'Candy & Snacks': '🍬', 'Clothing': '👕',
  };

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Rewards</IonTitle></IonToolbar></IonHeader>
      <IonContent fullscreen className="ion-padding fq-ambient">
        <div className="fq-animate-in">
          <h1 style={{ fontFamily: 'var(--fq-serif)', fontStyle: 'italic', fontSize: 32, margin: '16px 0 4px' }}>Reward Settings 🎁</h1>
          <p style={{ color: 'var(--fq-text2)', fontSize: 14, marginBottom: 24 }}>Control which prize categories your child can enter.</p>

          <div style={{ background: 'var(--fq-surface)', border: '1px solid var(--fq-border)', borderRadius: 20, padding: 20, marginBottom: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 16 }}>Prize Categories</div>
            {categories.map(([cat, enabled]) => (
              <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--fq-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{icons[cat] || '🎁'}</span>
                  <span>{cat}</span>
                </div>
                <IonToggle
                  checked={enabled}
                  onIonChange={(e) => {
                    dispatch({ type: 'SET_PARENT_SETTINGS', payload: {
                      prizeCategoriesEnabled: { ...state.parentSettings.prizeCategoriesEnabled, [cat]: e.detail.checked }
                    }});
                  }}
                  style={{ '--background-checked': 'var(--fq-accent)' }}
                />
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--fq-surface)', border: '1px solid var(--fq-border)', borderRadius: 20, padding: 20 }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Subscription</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 500 }}>FocusQuest Premium</div>
                <div style={{ fontSize: 13, color: 'var(--fq-text3)' }}>Monthly Plan</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fq-accent)' }}>$7.99/mo</div>
                <div style={{ fontSize: 12, color: 'var(--fq-text3)' }}>Next: Mar 20, 2026</div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default RewardSettingsPage;
