# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Run the app:**
```bash
npm start
# Or for specific platform:
npm run ios    # Expo Go on iOS
npm run android  # Expo Go on Android
npm run web    # Expo Go on Web
```

**Run tests:**
```bash
npm test
# Run a single test file:
npm test src/features/auth/screens/SignInScreen.test.ts
```

**Setup the project:**
```bash
npm install
cp .env.example .env
# Fill in SUPABASE_URL and SUPABASE_ANON_KEY in .env
```

## Project Overview

**Expensy** is a React Native expense tracking application built with Expo, using Supabase for backend (auth, database) and Zustand for state management.

## Directory Structure

```
expense_tracker/
├── src/
│   ├── app/                          # Root app setup
│   │   ├── providers/                # AuthProvider (Zustand)
│   │   ├── navigation/               # React Navigation configuration
│   │   └── App.tsx                  # Root component
│   ├── features/                     # Feature modules (folder structure)
│   │   ├── auth/                     # Authentication features
│   │   ├── balance/                  # Balance/account features
│   │   ├── expenses/                 # Expense features
│   │   ├── dashboard/                # Dashboard/reports
│   │   └── export/                   # PDF/Excel export
│   └── shared/                       # Shared code
│       ├── types/                    # Type definitions (Result<T,E>)
│       ├── utils/                    # Utility functions
│       ├── validators/               # Input validators
│       ├── theme/                    # Theme configuration (colors, typography, spacing)
│       └── components/               # Shared React components
```

## Feature Architecture

Each feature follows a consistent layer structure:

```
features/<feature>/
├── repositories/          # Data access layer (Supabase)
├── services/             # Business logic (wraps repositories, returns Result<T,E>)
├── screens/              # React Native screens
├── components/           # Feature-specific UI components
└── types/                # Feature-specific TypeScript types
```

### Repository Pattern
Repositories interact with Supabase via `src/config/supabase.ts` which provides `getSupabaseClient()`.

### Result Type
Error handling uses a custom `Result<T, E>` type from `src/shared/types/result.ts`:
```typescript
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }
```

### State Management
- **Global auth state**: `AuthProvider` (Zustand) in `src/app/providers/AuthProvider.tsx`
- **Local state**: React hooks in screens/components
- **Dashboard**: `useDashboardExpenses.tsx` in `src/features/dashboard/stores/`

## Navigation

**Auth stack** (Login/Sign up) → `src/app/navigation/AuthStack.tsx`
**Tab navigator** (Dashboard, Expenses) → `src/app/navigation/BottomTabNavigator.tsx`

## Theme

Customized Material Design 3 light theme in `src/shared/theme/`:
- `colors.ts` - Brand colors
- `typography.ts` - Font sizes/weights
- `spacing.ts` - Spacing tokens

## Testing

Tests use `@testing-library/react-native` and `jest`. Test IDs are set via `testID` prop on components.

Common test patterns:
- Form validation (email/password inputs)
- Authentication flow
- Expense CRUD operations
- Dashboard report calculations
