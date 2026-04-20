# Navigation Documentation

This document provides a complete overview of the application's navigation architecture, screen relationships, and routing patterns.

---

## Overview

Expensy uses **React Navigation** with a combination of:
- `createBottomTabNavigator` - For main app tabs
- `createNativeStackNavigator` - For nested navigation stacks

The navigation structure adapts based on authentication state:
- **Unauthenticated**: Auth stack (SignIn/SignUp)
- **Authenticated**: Bottom tab navigator with 4 main tabs

---

## Navigation Hierarchy

```
App.tsx
  ├── AuthProvider
  │   └── SafeAreaProvider
  │       └── NavigationContainer
  │           └── RootNavigator
  │               ├── AuthNavigator (unauthenticated only)
  │               │   ├── SignInScreen
  │               │   │   └── (navigate to) SignUp
  │               │   └── SignUpScreen
  │               │       └── (go back to) SignIn
  │               └── BottomTabNavigator (authenticated only)
  │                   ├── Home (Tab)
  │                   │   └── HomeStack
  │                   │       └── BalanceScreen
  │                   ├── Expenses (Tab)
  │                   │   └── ExpenseStack
  │                   │       ├── ExpenseListScreen
  │                   │       │   └── (FAB button → navigate to) AddExpense
  │                   │       └── AddExpenseScreen
  │                   │           └── (onSuccess → go back) ExpenseList
  │                   ├── Dashboard (Tab)
  │                   │   └── DashboardStack
  │                   │       ├── DashboardScreen
  │                   │       │   └── (FAB button → navigate to) ExpensesSummaryDetail
  │                   │       └── ExpensesSummaryDetail
  │                   └── Profile (Tab)
  │                       └── ProfileScreen
  │                       ├── (select dates → show) DatePickerModal
  │                       └── (export PDF/Excel → internal logic)
```

---

## Tab Structure

### BottomTabNavigator (Source: `src/app/navigation/BottomTabNavigator.tsx`)

| Tab | Icon | Navigator | Screens |
|-----|------|-----------|---------|
| **Home** | home | HomeStack | BalanceScreen |
| **Expenses** | bitcoin | ExpenseStack | ExpenseListScreen, AddExpenseScreen |
| **Dashboard** | chart-bar-stacked | DashboardStack | DashboardScreen, ExpensesSummaryDetail |
| **Profile** | face-man | - | ProfileScreen |

---

## Navigation Stacks

### Auth Stack (Source: `src/app/App.tsx`)

Used only when user is not authenticated.

| Screen | Route | Navigation Pattern |
|--------|-------|-------------------|
| SignInScreen | SignIn | `navigation.navigate('SignUp')` |
| SignUpScreen | SignUp | `navigation.goBack()` |

### Home Stack (Source: `src/app/navigation/BottomTabNavigator.tsx`)

```typescript
<HomeStack.Navigator screenOptions={{ headerShown: true }}>
  <HomeStack.Screen name="Balance" component={BalanceScreen} options={{ title: 'Home' }} />
</HomeStack.Navigator>
```

### Expense Stack (Source: `src/app/navigation/BottomTabNavigator.tsx`)

```typescript
<ExpenseStack.Navigator screenOptions={{ headerShown: true }}>
  <ExpenseStack.Screen name="ExpenseList">
    {({ navigation }) => (
      <ExpenseListScreen onNavigateToAdd={() => navigation.navigate('AddExpense')} />
    )}
  </ExpenseStack.Screen>
  <ExpenseStack.Screen name="AddExpense" options={{ title: 'Add Expense' }}>
    {({ navigation }) => (
      <AddExpenseScreen onSuccess={() => navigation.goBack()} />
    )}
  </ExpenseStack.Screen>
</ExpenseStack.Navigator>
```

### Dashboard Stack (Source: `src/app/navigation/BottomTabNavigator.tsx`)

```typescript
<DashboardStack.Navigator screenOptions={{ headerShown: true }}>
  <DashboardStack.Screen name="Dashboard" options={{ title: 'Dashboard' }}>
    {({ navigation }) => (
      <DashboardScreen onNavigateToSummaryDetails={() => navigation.navigate('ExpensesSummaryDetail')} />
    )}
  </DashboardStack.Screen>
  <DashboardStack.Screen name="ExpensesSummaryDetail" options={{ title: 'ExpensesSummaryDetails' }}>
    {() => <ExpensesDetailsByCategory />}
  </DashboardStack.Screen>
</DashboardStack.Navigator>
```

---

## Screens by Feature

### 1. Authentication Screens

#### SignInScreen
**File**: `src/features/auth/screens/SignInScreen.tsx`

**Inputs**:
- Email (text input)
- Password (secure text entry)

**Navigation**:
- To SignUp: `navigation.navigate('SignUp')`
- Error: `navigation.goBack()` (via SignUpScreen's `onNavigateToSignIn`)

**Error Handling**:
```typescript
switch (result.error) {
  case 'INVALID_CREDENTIALS':
    setError('Invalid email or password...');
  case 'NETWORK_ERROR':
    setError('Network error...');
  default:
    setError('Something went wrong...');
}
```

#### SignUpScreen
**File**: `src/features/auth/screens/SignUpScreen.tsx`

**Navigation**:
- To SignIn: `navigation.goBack()`

---

### 2. Balance Screen

#### BalanceScreen
**File**: `src/features/balance/screens/BalanceScreen.tsx`

**Purpose**: View account balance

**Navigation**: None (leaf screen in HomeStack)

---

### 3. Expense Screens

#### ExpenseListScreen
**File**: `src/features/expenses/screens/ExpenseListScreen.tsx`

**Inputs**: None

**Navigation**:
- Add new expense: `navigation.navigate('AddExpense')` (from FAB)

**Functionality**:
- Fetches expenses via `expenseService.getExpenses()`
- Displays in FlatList
- Pull-to-refresh
- Delete expense via `ExpenseItem` component

#### AddExpenseScreen
**File**: `src/features/expenses/screens/AddExpenseScreen.tsx`

**Navigation**:
- On success: `navigation.goBack()` to ExpenseListScreen

**Functionality**:
- Form to add new expenses
- Validates expense data

---

### 4. Dashboard Screens

#### DashboardScreen
**File**: `src/features/dashboard/screens/DashboardScreen.tsx`

**Inputs**:
- Period selector (monthly/quarterly/annual/not-selected)
- Date range picker (custom ranges)

**Navigation**:
- View summary details: `navigation.navigate('ExpensesSummaryDetail')` (FAB button)

**Functionality**:
- Fetches report via `reportService.generateReport()`
- Displays summary card and category chart
- Pull-to-refresh

#### ExpensesSummaryDetail
**File**: `src/features/dashboard/screens/ExpensesDetailsByCategory.tsx`

**Navigation**: None (handled in DashboardStack, no parent ref)

**Functionality**:
- Displays expenses grouped by category
- Summary view screen

---

### 5. Profile Screen

#### ProfileScreen
**File**: `src/app/navigation/ProfileScreen.tsx`

**Inputs**:
- Date range picker (for export)

**Navigation**: None (leaf screen in Profile tab)

**Functionality**:
- Displays user email
- Export PDF (generates report, then PDF)
- Export Excel (commented out)
- Sign out (via `useAuth().signOut()`)

---

## Navigation Flow Diagrams

### Unauthenticated Flow
```
┌───────────┐
│   App     │
│  Loaded   │
│  Loading  │
└─────┬─────┘
      │
      ├─── user found → BottomTabNavigator
      │
      └─── user null → AuthNavigator
                    │
                    ├─── SignInScreen
                    │       │
                    │       ├── user found → load auth data
                    │       │
                    │       └── error → show error message
                    │
                    └─── SignUpScreen
                            │
                            └─── back → SignInScreen
```

### Authenticated Flow
```
┌─────────────────┐
│ BottomTab       │
│   Navigator     │
└───────┬─────────┘
        │
        ├─── Home Tab
        │   └── BalanceScreen (view only)
        │
        ├─── Expenses Tab
        │   ├── ExpenseListScreen
        │   │   └── (FAB) → AddExpenseScreen
        │   │           └── (success) → go back
        │   └── AddExpenseScreen
        │
        ├─── Dashboard Tab
        │   ├── DashboardScreen
        │   │   └── (FAB) → ExpensesSummaryDetail
        │   └── ExpensesSummaryDetail
        │
        └─── Profile Tab
            └── ProfileScreen
                └── (export) → internal (no navigation)
                └── (sign out) → null user → unauthenticated
```

---

## Navigation Methods

Common navigation patterns used throughout the app:

| Method | Purpose | Examples |
|--------|---------|----------|
| `navigate('ScreenName')` | Navigate to a named screen | `navigation.navigate('SignUp')` |
| `navigate('ScreenName', params)` | Navigate with screen params | - |
| `goBack()` | Return to parent screen | `navigation.goBack()` (after SignUp) |

**Example Navigation Pattern**:
```typescript
function SignInScreen({ onNavigateToSignUp }: SignInScreenProps) {
  const handleSignIn = async () => {
    const result = await signIn(email, password);
    if (result.ok) {
      // Navigation happens automatically when user changes
    } else {
      // Show error message
    }
  };

  return (
    <Button
      onPress={onNavigateToSignUp}
    >
      Don't have an account? Sign Up
    </Button>
  );
}
```

---

## Navigation Props Pattern

Screens that support navigation typically receive navigation callbacks:

```typescript
// Pattern 1: Callback function prop
interface ExpenseListScreenProps {
  onNavigateToAdd: () => void;
}
export function ExpenseListScreen({ onNavigateToAdd }: ExpenseListScreenProps) {
  return (
    <FAB onPress={onNavigateToAdd} />
  );
}

// Pattern 2: Navigation screen options
<ExpenseStack.Screen name="ExpenseList">
  {({ navigation }) => (
    <ExpenseListScreen onNavigateToAdd={() => navigation.navigate('AddExpense')} />
  )}
</ExpenseStack.Screen>

// Pattern 3: Success callback
interface AddExpenseScreenProps {
  onSuccess: () => void;
}
export function AddExpenseScreen({ onSuccess }: AddExpenseScreenProps) {
  return (
    <Button onPress={handleSuccess}>
      Done
    </Button>
  );
}
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/app/App.tsx` | Root app with AuthNavigator + BottomTabNavigator |
| `src/app/navigation/BottomTabNavigator.tsx` | Main tab navigator with 4 tabs |
| `src/features/auth/screens/SignInScreen.tsx` | Login screen |
| `src/features/auth/screens/SignUpScreen.tsx` | Registration screen |
| `src/features/balance/screens/BalanceScreen.tsx` | View balance |
| `src/features/expenses/screens/ExpenseListScreen.tsx` | List all expenses |
| `src/features/expenses/screens/AddExpenseScreen.tsx` | Add new expense |
| `src/features/dashboard/screens/DashboardScreen.tsx` | Dashboard home |
| `src/features/dashboard/screens/ExpensesDetailsByCategory.tsx` | Category detail view |
| `src/app/navigation/ProfileScreen.tsx` | User profile & exports |

---

## State Management During Navigation

Navigation is decoupled from state management:

- **Auth State**: Managed by `AuthProvider` (Zustand)
  - Updates user state automatically after auth success
- **Dashboard State**: 
  - `useDashboardFilters` - Filter state (period, date range)
  - Report fetched on filter change
- **Expenses State**:
  - `useAppGlobalStore` - Refetch data trigger
- **Profile State**: Local state for export functionality

---

## Testing Navigation

Test navigation via test IDs in component props:

```typescript
// Test navigation callback
onNavigateToAdd: () => void;

// Test IDs set by screen components
testID="sign-in-button"
testID="navigate-sign-up"
testID="add-expense-fab"
testID="export-pdf-button"
```

---

## Notes

1. **Automatic Navigation**: When a user signs in successfully, `useAuth()` updates the user state, automatically switching from `AuthNavigator` to `BottomTabNavigator`.

2. **Protected Routes**: After auth, the `RootNavigator` always shows `BottomTabNavigator` since `user` is no longer null/undefined.

3. **Stack Navigator Options**: All stack navigators use `screenOptions={{ headerShown: true }}` to enable header customization.

4. **Safe Area Handling**: All screens use `SafeAreaView` from `react-native-safe-area-context`.
