// ──────────────────────────────────────────────────
// FocusQuest — Root Application Component
// ──────────────────────────────────────────────────

import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {
  homeOutline,
  timerOutline,
  phonePortraitOutline,
  clipboardOutline,
  trophyOutline,
  barChartOutline,
  settingsOutline,
  giftOutline,
} from 'ionicons/icons';

/* Ionic CSS (required) */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* App theme */
import './theme/global.css';

/* Services */
import { initializeFirebase } from '@services/firebase';
import { initializePushNotifications } from '@services/notifications';

/* Store */
import { AppProvider, useAppState } from '@store/index';

/* Pages */
import LoginPage from '@pages/LoginPage';
import StudentDashboard from '@pages/student/Dashboard';
import FocusModePage from '@pages/student/FocusMode';
import TimeKeeperPage from '@pages/student/TimeKeeper';
import StudentTasksPage from '@pages/student/Tasks';
import RewardsPage from '@pages/student/Rewards';
import HistoryPage from '@pages/student/History';
import ParentDashboard from '@pages/parent/Dashboard';
import ParentTaskManager from '@pages/parent/TaskManager';
import ProgressPage from '@pages/parent/Progress';
import RewardSettings from '@pages/parent/RewardSettings';
import ParentSettings from '@pages/parent/Settings';

setupIonicReact({
  mode: 'ios', // Consistent iOS-style look across platforms
});

// ── Student Tab Navigation ───────────────────────

function StudentTabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/student/dashboard" component={StudentDashboard} />
        <Route exact path="/student/focus" component={FocusModePage} />
        <Route exact path="/student/timekeeper" component={TimeKeeperPage} />
        <Route exact path="/student/tasks" component={StudentTasksPage} />
        <Route exact path="/student/rewards" component={RewardsPage} />
        <Route exact path="/student/history" component={HistoryPage} />
        <Route exact path="/student">
          <Redirect to="/student/dashboard" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="dashboard" href="/student/dashboard">
          <IonIcon icon={homeOutline} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="focus" href="/student/focus">
          <IonIcon icon={timerOutline} />
          <IonLabel>Focus</IonLabel>
        </IonTabButton>
        <IonTabButton tab="timekeeper" href="/student/timekeeper">
          <IonIcon icon={phonePortraitOutline} />
          <IonLabel>Keeper</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tasks" href="/student/tasks">
          <IonIcon icon={clipboardOutline} />
          <IonLabel>Tasks</IonLabel>
        </IonTabButton>
        <IonTabButton tab="rewards" href="/student/rewards">
          <IonIcon icon={trophyOutline} />
          <IonLabel>Rewards</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}

// ── Parent Tab Navigation ────────────────────────

function ParentTabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/parent/dashboard" component={ParentDashboard} />
        <Route exact path="/parent/tasks" component={ParentTaskManager} />
        <Route exact path="/parent/progress" component={ProgressPage} />
        <Route exact path="/parent/rewards" component={RewardSettings} />
        <Route exact path="/parent/settings" component={ParentSettings} />
        <Route exact path="/parent">
          <Redirect to="/parent/dashboard" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="dashboard" href="/parent/dashboard">
          <IonIcon icon={homeOutline} />
          <IonLabel>Overview</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tasks" href="/parent/tasks">
          <IonIcon icon={clipboardOutline} />
          <IonLabel>Tasks</IonLabel>
        </IonTabButton>
        <IonTabButton tab="progress" href="/parent/progress">
          <IonIcon icon={barChartOutline} />
          <IonLabel>Progress</IonLabel>
        </IonTabButton>
        <IonTabButton tab="rewards" href="/parent/rewards">
          <IonIcon icon={giftOutline} />
          <IonLabel>Rewards</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href="/parent/settings">
          <IonIcon icon={settingsOutline} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}

// ── Root Router ──────────────────────────────────

function AppRouter() {
  const { state } = useAppState();

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login" component={LoginPage} />
        <Route path="/student" render={() => <StudentTabs />} />
        <Route path="/parent" render={() => <ParentTabs />} />
        <Route exact path="/">
          {state.isAuthenticated ? (
            <Redirect to={state.user?.role === 'parent' ? '/parent' : '/student'} />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
}

// ── App Wrapper ──────────────────────────────────

export default function App() {
  useEffect(() => {
    // Initialize Firebase on mount
    initializeFirebase();
    // Initialize push notifications
    initializePushNotifications().catch(console.error);
  }, []);

  return (
    <IonApp>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </IonApp>
  );
}
