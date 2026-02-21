import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  useIonRouter,
} from '@ionic/react';
import { useAppState } from '@store/index';

const LoginPage: React.FC = () => {
  const { dispatch } = useAppState();
  const router = useIonRouter();
  const [mode, setMode] = useState<'select' | 'login'>('select');
  const [role, setRole] = useState<'student' | 'parent'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRoleSelect = (selectedRole: 'student' | 'parent') => {
    setRole(selectedRole);
    setMode('login');
  };

  const handleLogin = () => {
    // Demo mode: skip real auth and set a mock user
    dispatch({
      type: 'SET_USER',
      payload: {
        uid: `demo_${role}_1`,
        email: email || `demo@${role}.com`,
        displayName: role === 'student' ? 'Alex' : 'Parent',
        role,
        createdAt: new Date().toISOString(),
        ...(role === 'student' ? { parentUid: 'demo_parent_1' } : { childUids: ['demo_student_1'] }),
      },
    });
    router.push(role === 'student' ? '/student/dashboard' : '/parent/dashboard', 'root');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="fq-ambient">
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}>
          <div style={{
            width: '100%',
            maxWidth: 420,
            background: 'var(--fq-surface)',
            border: '1px solid var(--fq-border)',
            borderRadius: 24,
            padding: '48px 36px',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'var(--fq-serif)',
              fontSize: 48,
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, var(--fq-accent), var(--fq-accent2))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 8,
            }}>
              FocusQuest
            </div>
            <IonText color="medium">
              <p style={{ marginBottom: 32 }}>Build focus habits. Earn real rewards.</p>
            </IonText>

            {mode === 'select' ? (
              <>
                <button
                  onClick={() => handleRoleSelect('student')}
                  style={{
                    width: '100%',
                    padding: 18,
                    borderRadius: 16,
                    border: '1px solid var(--fq-border)',
                    background: 'var(--fq-bg2)',
                    color: 'var(--fq-text)',
                    fontFamily: 'var(--fq-sans)',
                    fontSize: 16,
                    fontWeight: 500,
                    cursor: 'pointer',
                    marginBottom: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 28 }}>📚</span>
                  <div>
                    <div>I'm a Student</div>
                    <div style={{ color: 'var(--fq-text3)', fontSize: 13, fontWeight: 400 }}>
                      Focus sessions, earn points, win prizes
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleRoleSelect('parent')}
                  style={{
                    width: '100%',
                    padding: 18,
                    borderRadius: 16,
                    border: '1px solid var(--fq-border)',
                    background: 'var(--fq-bg2)',
                    color: 'var(--fq-text)',
                    fontFamily: 'var(--fq-sans)',
                    fontSize: 16,
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 28 }}>👨‍👩‍👧</span>
                  <div>
                    <div>I'm a Parent</div>
                    <div style={{ color: 'var(--fq-text3)', fontSize: 13, fontWeight: 400 }}>
                      Assign tasks, monitor progress, manage rewards
                    </div>
                  </div>
                </button>
              </>
            ) : (
              <>
                <IonText>
                  <h3 style={{ marginBottom: 16 }}>
                    {role === 'student' ? '📚 Student Login' : '👨‍👩‍👧 Parent Login'}
                  </h3>
                </IonText>
                <div style={{ marginBottom: 12 }}>
                  <IonInput
                    type="email"
                    placeholder="Email"
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value || '')}
                    style={{
                      '--background': 'var(--fq-bg2)',
                      '--border-radius': '12px',
                      '--padding-start': '16px',
                      border: '1px solid var(--fq-border)',
                      borderRadius: 12,
                    }}
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <IonInput
                    type="password"
                    placeholder="Password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value || '')}
                    style={{
                      '--background': 'var(--fq-bg2)',
                      '--border-radius': '12px',
                      '--padding-start': '16px',
                      border: '1px solid var(--fq-border)',
                      borderRadius: 12,
                    }}
                  />
                </div>
                <IonButton
                  expand="block"
                  onClick={handleLogin}
                  style={{
                    '--background': 'linear-gradient(135deg, var(--fq-accent), var(--fq-accent2))',
                    '--border-radius': '14px',
                    '--color': '#000',
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  Sign In
                </IonButton>
                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={() => setMode('select')}
                  style={{ '--border-radius': '14px' }}
                >
                  Back
                </IonButton>
              </>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
