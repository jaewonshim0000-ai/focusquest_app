# FocusQuest

> Student motivation app with focus sessions, passive phone tracking, parent-assigned tasks, and effort-based rewards.

Built with **Ionic React + Capacitor** for iOS & Android deployment via **Appflow**.

---

## Quick Start

```bash
# 1. Clone and install
git clone <your-repo-url>
cd focusquest
npm install

# 2. Set up environment
cp .env.example .env
# Fill in your Firebase config values in .env

# 3. Run locally
npm run dev
# Opens at http://localhost:5173

# 4. Add native platforms
npx cap add android
npx cap add ios
npm run sync
```

## Project Structure

```
focusquest/
├── package.json                # Dependencies & build scripts
├── ionic.config.json           # Appflow project detection
├── capacitor.config.ts         # Native platform config
├── appflow.config.json         # Appflow CI/CD settings
├── vite.config.ts              # Build configuration
├── tsconfig.json               # TypeScript config
├── .env.example                # Required env vars template
├── src/
│   ├── main.tsx                # Entry point
│   ├── App.tsx                 # Root component + routing
│   ├── app/
│   │   ├── services/           # Firebase, auth, points, tasks, notifications
│   │   ├── models/             # TypeScript interfaces
│   │   ├── store/              # React Context + useReducer state
│   │   └── utils/              # Constants, helpers, point calculations
│   ├── pages/
│   │   ├── LoginPage.tsx       # Role selection + auth
│   │   ├── student/            # Student-facing pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── FocusMode.tsx
│   │   │   ├── TimeKeeper.tsx
│   │   │   ├── Tasks.tsx
│   │   │   ├── Rewards.tsx
│   │   │   └── History.tsx
│   │   └── parent/             # Parent-facing pages
│   │       ├── Dashboard.tsx
│   │       ├── TaskManager.tsx
│   │       ├── Progress.tsx
│   │       ├── RewardSettings.tsx
│   │       └── Settings.tsx
│   ├── components/             # Shared UI components
│   └── theme/                  # Global CSS, design tokens
├── functions/                  # Firebase Cloud Functions
│   ├── package.json
│   └── src/index.ts            # Raffle drawing, notifications, anomaly detection
├── android/                    # Capacitor Android project
├── ios/                        # Capacitor iOS project
└── tests/                      # Unit + integration tests
```

## Architecture

### Frontend
- **Ionic React** — Cross-platform UI components with native look-and-feel
- **Capacitor** — Native bridge for device APIs (camera, notifications, etc.)
- **React Context + useReducer** — State management (see `src/app/store/`)
- **Vite** — Fast builds with code splitting

### Backend (Firebase)
- **Authentication** — Email/password with parent-child account linking
- **Firestore** — Real-time database with offline persistence
- **Cloud Storage** — Verification photo storage (encrypted, 90-day auto-delete)
- **Cloud Functions** — Raffle drawings, task lifecycle, notifications, anomaly detection

### Key Services
| Service | File | Purpose |
|---------|------|---------|
| Firebase Init | `services/firebase.ts` | Firebase app initialization + emulator support |
| Auth | `services/auth.ts` | Register, sign in, parent-child linking |
| Points | `services/points.ts` | Earn, spend, query point balances |
| Tasks | `services/tasks.ts` | CRUD for parent-assigned tasks |
| Notifications | `services/notifications.ts` | Push + local notifications |

## Firebase Setup

### 1. Create Firebase Project
```bash
npm install -g firebase-tools
firebase login
firebase init
# Select: Firestore, Functions, Storage, Hosting
```

### 2. Configure Firestore Rules
```
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    // Students can read tasks assigned to them
    match /tasks/{taskId} {
      allow read: if request.auth.uid == resource.data.assignedTo
                  || request.auth.uid == resource.data.createdBy;
      allow create: if request.auth.uid == request.resource.data.createdBy;
      allow update: if request.auth.uid == resource.data.assignedTo
                    || request.auth.uid == resource.data.createdBy;
    }
    // Points are server-managed
    match /point_balances/{userId} {
      allow read: if request.auth.uid == userId;
    }
  }
}
```

### 3. Deploy Cloud Functions
```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

## Appflow Deployment

### Branch Strategy
| Branch | Purpose | Auto-Build | Target |
|--------|---------|------------|--------|
| `main` | Production | Yes | App Store / Google Play |
| `staging` | Pre-release QA | Yes | TestFlight / Internal Track |
| `develop` | Active dev | Yes | Dev builds |
| `feature/*` | Feature work | No | Manual only |

### Environment Variables (set in Appflow dashboard)
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_RAFFLE_SERVICE_URL
VITE_SENTRY_DSN
VITE_FEATURE_RAFFLE_ENABLED
```

### Build & Deploy
```bash
# Web build (for Appflow)
npm run build

# Native sync
npm run build:android
npm run build:ios

# Open in native IDE
npm run open:android
npm run open:ios
```

### iOS Requirements
- Apple Developer Program (Organization)
- Upload to Appflow: Development + Distribution provisioning profiles
- Enable Family Controls entitlement in App ID
- Minimum deployment target: iOS 16.0

### Android Requirements
- Upload keystore to Appflow
- `minSdk 26` (Android 8.0), `targetSdk 34` (Android 14)
- Required permissions in AndroidManifest.xml:
  - `SYSTEM_ALERT_WINDOW`
  - `PACKAGE_USAGE_STATS`
  - `FOREGROUND_SERVICE`
  - `POST_NOTIFICATIONS`

## Testing

```bash
# Run unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Lint + type check
npm run lint
npm run type-check
```

## Features Overview

### Student Features
- **Focus Mode** — Timer-locked study sessions (10–120 min), streak bonuses, reflection prompts
- **Time Keeper** — Passive phone-free tracking with milestone rewards
- **Assigned Tasks** — Complete parent-created tasks for bonus points
- **Rewards** — Spend points on raffle entries (Bronze/Silver/Gold/Platinum tiers)

### Parent Features
- **Dashboard** — At-a-glance child progress overview
- **Task Manager** — Create tasks with custom points, verification methods, due dates
- **Progress Reports** — Weekly charts, session reflections, point breakdowns
- **Reward Controls** — Toggle prize categories, manage subscription
- **Settings** — Sleep hours, session caps, notification preferences

### Point Economy
| Source | Points | Daily Cap |
|--------|--------|-----------|
| Focus Mode | 10–150/session | 4 sessions |
| Time Keeper | 5–80/milestone | Varies |
| Parent Tasks | 5–200/task | No cap |

## License

Proprietary. All rights reserved.
