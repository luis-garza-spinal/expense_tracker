# Expensy - Expense Tracking Application

**Expensy** is a React Native expense tracking application built with Expo, using Supabase for backend services (authentication, database), Zustand for state management, and React Navigation for routing.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Installation](#installation)
4. [Project Structure](#project-structure)
5. [Architecture](#architecture)
6. [State Management](#state-management)
7. [Error Handling](#error-handling)
8. [Theme & Design](#theme--design)
9. [Testing](#testing)
10. [Navigation](#navigation)
11. [Screens & Features](#screens--features)
12. [API Configuration](#api-configuration)
13. [Development Commands](#development-commands)

---

## Project Overview

Expensy helps users track and visualize their expenses with features including:

- **Authentication**: Email/password sign-in and sign-up via Supabase
- **Dashboard**: Visualize expenses by period with category breakdown charts
- **Expenses**: Create, list, and delete expense records
- **Reports**: Generate monthly/quarterly/annual expense reports
- **Exports**: Export reports as PDF or Excel (PDF is production-ready)

---

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Expo (v54.0.33) |
| React Native | v0.81.5 |
| React | v19.1.0 |
| Backend | Supabase |
| Navigation | React Navigation (Stack + Bottom Tabs) |
| State Management | Zustand |
| UI Components | React Native Paper, React Native Paper Dates |
| PDF Export | react-native-html-to-pdf |
| Excel Export | react-native-share (planned) |
| Date Handling | date-fns-tz |
| Icons | react-native-vector-icons (Material Design) |
| Security | react-native-dotenv |
| Networking | @expo/ngrok |
| New Architecture | Enabled |

---

## Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your Supabase credentials
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

---

## Project Structure

```
expense_tracker/
├── app/                          # Root app setup & providers
│   ├── providers/                # AuthProvider (Zustand)
│   ├── navigation/               # React Navigation configuration
│   └── App.tsx                  # Root component
├── features/                     # Feature modules
│   ├── auth/                     # Authentication features
│   │   ├── repositories/         # Auth repository (Supabase)
│   │   ├── services/             # Auth service business logic
│   │   └── screens/              # SignIn, SignUp screens
│   ├── balance/                  # Balance/account features
│   │   ├── repositories/         # Balance repository
│   │   ├── services/             # Balance service
│   │   ├── components/           # BalanceCard, AddBalanceForm
│   │   └── screens/              # BalanceScreen
│   ├── expenses/                 # Expense features
│   │   ├── repositories/         # Expense repository
│   │   ├── services/             # Expense service
│   │   ├── types/                # Expense TypeScript types
│   │   ├── components/           # ExpenseForm, ExpenseItem
│   │   └── screens/              # ExpenseList, AddExpense screens
│   ├── dashboard/                # Dashboard/reports
│   │   ├── repositories/         # Dashboard repository
│   │   ├── services/             # ReportService
│   │   ├── components/           # SummaryCard, CategoryChart, RangeSelector
│   │   ├── screens/              # Dashboard, ExpensesDetailsByCategory
│   │   ├── types/                # Report types
│   │   └── stores/               # useDashboardFilters (Zustand)
│   └── export/                   # PDF/Excel export
│       ├── services/             # pdfExportService, excelExportService
│       └── templates/            # pdfTemplate
├── shared/                       # Shared code
│   ├── stores/                   # useAppGlobalStore (Zustand)
│   ├── types/                    # Result<T, E> type
│   ├── utils/                    # Utility functions
│   ├── validators/               # Input validators
│   └── theme/                    # Theme configuration
│       ├── colors.ts
│       ├── typography.ts
│       └── spacing.ts
├── config/                       # Configuration files
│   ├── env.ts                    # Environment config
│   └── supabase.ts              # Supabase client
├── src/                          # Additional source files
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── app.json                      # Expo config
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript config
└── README.md
```

---

## Architecture

### Repository Pattern

Repositories abstract data access from Supabase, following clean architecture principles:

- **AuthRepository**: Manages authentication session state
- **BalanceRepository**: Manages balance/account data
- **ExpenseRepository**: Manages expense CRUD operations
- **DashboardRepository**: Manages report generation

### Service Layer

Services encapsulate business logic and return typed `Result` types:

```typescript
// Returns: { ok: true; data: T } | { ok: false; error: E }
const createReportService = () => ({
  generateReport: (userId, period, start, end) => Result<ReportSummary, Error>,
  getDateRange: (period) => { start, end }
});
```

### Feature Modules

Each feature follows a consistent structure:

```
features/<feature>/
├── repositories/          # Data access (Supabase)
├── services/             # Business logic (returns Result<T,E>)
├── screens/              # React Native screens
├── components/           # Feature-specific UI components
└── types/                # Feature-specific TypeScript types
```

---

## State Management

### Zustand Stores

| Store | Location | Purpose |
|-------|----------|---------|
| **AuthProvider** | `src/app/providers/AuthProvider.tsx` | Global auth state (user, signIn, signUp, signOut) |
| **useAppGlobalStore** | `src/shared/stores/useAppGlobalStore.tsx` | Global app state (refetch data trigger) |
| **useDashboardFilters** | `src/features/dashboard/stores/useDashboardFilters.tsx` | Dashboard filter state (period, date range) |

### Context Usage

```typescript
const { user, signIn, signUp, signOut } = useAuth();
```

---

## Error Handling

### Result Type

All services and repositories return typed `Result` values for consistent error handling:

```typescript
type Result<T, E> =
  | { ok: true; data: T }
  | { ok: false; error: E };
```

Common error types:
- `AuthError` - Authentication failures
- `NetworkError` - Network-related issues
- Feature-specific errors (e.g., `INVALID_CREDENTIALS`)

### Usage Pattern

```typescript
const result = await signInService.signIn(email, password);
if (result.ok) {
  // Success
  const user = result.data;
} else {
  // Handle error
  const errorMsg = result.error.message;
}
```

---

## Theme & Design

### Material Design 3 Light Theme

Customized with brand colors and spacing tokens:

**Colors** (`src/shared/theme/colors.ts`):
- Primary brand color
- Light variants (primaryLight, secondaryLight, etc.)
- Background, surface, surface variant
- Text variants (text, textSecondary)
- Error color

**Typography** (`src/shared/theme/typography.ts`):
- Font sizes (xs, sm, md, lg, xl, xxl)
- Font weights
- Heading scales

**Spacing** (`src/shared/theme/spacing.ts`):
- Spacing tokens (xs, sm, md, lg, xl, xxl)

---

## Testing

Test configuration in `package.json`:

```bash
npm test                      # Run all tests
npm test <file>.test.ts      # Run single test file
```

**Test Tools**:
- Jest (v29.7.0)
- @testing-library/react-native
- React Native Paper test IDs

**Test Patterns**:
- Form validation (email/password inputs)
- Authentication flows
- Expense CRUD operations
- Dashboard report calculations
- UI component test IDs

---

## Navigation

See **[Navigation Documentation](./NAVIGATION.md)** for detailed routing information, screen relationships, and navigation patterns.

---

## Screens & Features

### Authentication Flow

```
┌─────────────────────────────────────────────┐
│         AuthNavigator (Stack)                │
│  ┌──────────────────────────────────────┐   │
│  │   SignInScreen                        │   │
│  │   onNavigateToSignUp → SignUp         │   │
│  └──────────────────────────────────────┘   │
│  ┌──────────────────────────────────────┐   │
│  │   SignUpScreen                        │   │
│  │   onNavigateToSignIn → goBack         │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    ↓
                user → null
```

**SignInScreen** (`src/features/auth/screens/SignInScreen.tsx`):
- Email/password authentication
- Validates input fields
- Handles `INVALID_CREDENTIALS`, `NETWORK_ERROR`, and generic errors
- Navigation to SignUp screen or back button

**SignUpScreen** (`src/features/auth/screens/SignUpScreen.tsx`):
- New user registration
- Navigation back to SignIn on error

### Main App Flow (After Auth)

```
┌──────────────────────────────────────────────────────────┐
│        BottomTabNavigator (Tab Navigator)                │
├──────────────────────────────────────────────────────────┤
│ Home │ Expenses │ Dashboard │ Profile                    │
│   ↓        ↓          ↓          ↓                       │
│ ┌─────────┐ ┌──────────┐ ┌──────────────┐ ┌─────────┐  │
│ │ Balance │ │Expense   │ │Dashboard     │ │ Profile │  │
│ │ Screen  │ │List      │ │Screen        │ │ Screen  │  │
│ └────┬────┘ └───┬──────┘ └──────┬───────┘ └─────┬───┘  │
│      └─────┬────┘               └────────┬──────┘        │
│            ↓                             ↓                 │
│     AddExpense                  Summary Details           │
│     (Stack Navigator)                  (Stack Navigator)  │
└──────────────────────────────────────────────────────────┘
```

**BottomTabNavigator** (`src/app/navigation/BottomTabNavigator.tsx`):
- 4 tabs: Home, Expenses, Dashboard, Profile
- Each tab runs its own stack navigator

**Home Stack** (`src/app/navigation/BottomTabNavigator.tsx`):
- Single screen: BalanceScreen

**Expense Stack** (`src/app/navigation/BottomTabNavigator.tsx`):
- `ExpenseListScreen` → navigate to `AddExpense` via FAB
- `AddExpenseScreen` → navigate back after success

**Dashboard Stack** (`src/app/navigation/BottomTabNavigator.tsx`):
- `DashboardScreen` → navigate to `ExpensesSummaryDetail` via FAB
- `ExpensesDetailsByCategory` (detail screen)

**Profile Screen** (`src/app/navigation/ProfileScreen.tsx`):
- Export reports as PDF/Excel (with date range picker)
- Sign out functionality

### Navigation Patterns

| Component | Navigation Type | Key Feature |
|-----------|-----------------|-------------|
| AuthStack | Native Stack | Authentication screens |
| ExpenseStack | Native Stack | Add/Modify expenses |
| DashboardStack | Native Stack | Dashboard + Details |
| BottomTabNavigator | Tab + Stack | Main app tabs |

**Navigation Methods**:
- `navigation.navigate('ScreenName')` - Navigate to a screen
- `navigation.goBack()` - Go back
- `navigation.navigate('ScreenName', params)` - Navigate with params

---

## API Configuration

### Supabase Setup

Configuration in `src/config/supabase.ts` and `src/config/env.ts`:

```typescript
// .env file
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Supabase Client** (`src/config/supabase.ts`):
```typescript
const { createClient } = require('@supabase/supabase-js');
export const supabase = createClient({
  url: import.meta.env.EXPO_PUBLIC_SUPABASE_URL,
  anonKey: import.meta.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
});
```

---

## Development Commands

**Run the app**:
```bash
npm start              # Expo start (default: web)
npm run ios            # Expo Go on iOS
npm run android        # Expo Go on Android
npm run web            # Expo Go on Web
```

**Run tests**:
```bash
npm test                              # Run all tests
npm test src/features/auth/SignInScreen.test.ts  # Single test file
```

**Setup**:
```bash
npm install                          # Install dependencies
cp .env.example .env                # Copy env template
# Edit .env with Supabase credentials
```

---

## License

proprietary
