import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BalanceScreen } from '../../features/balance/screens/BalanceScreen';
import { ExpenseListScreen } from '../../features/expenses/screens/ExpenseListScreen';
import { AddExpenseScreen } from '../../features/expenses/screens/AddExpenseScreen';
import { DashboardScreen } from '../../features/dashboard/screens/DashboardScreen';
import { ProfileScreen } from './ProfileScreen';
import { colors } from '../../shared/theme/colors';
import { ExpensesDetailsByCategory } from '../../features/dashboard/screens/ExpensesDetailsByCategory';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Icon } from 'react-native-paper';

const Tab = createBottomTabNavigator();
const ExpenseStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const DashboardStack = createNativeStackNavigator();

function DashboardStackScreen() {
  return (
    <DashboardStack.Navigator screenOptions={{ headerShown: true }}>
      <DashboardStack.Screen name="Dashboard" options={{ title: 'Dashboard' }}>
        {({ navigation }) => {
          return <DashboardScreen onNavigateToSummaryDetails={() => navigation.navigate('ExpensesSummaryDetail')} />
        }}
      </DashboardStack.Screen>
      <DashboardStack.Screen name="ExpensesSummaryDetail" options={{ title: 'ExpensesSummaryDetails' }}>
        {() => {
          return <ExpensesDetailsByCategory />
        }}
      </DashboardStack.Screen>
    </DashboardStack.Navigator>
  )
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: true }}>
      <HomeStack.Screen name="Balance" component={BalanceScreen} options={{ title: 'Home' }} />
    </HomeStack.Navigator>
  );
}

function ExpenseStackScreen() {

  return (
    <ExpenseStack.Navigator screenOptions={{ headerShown: true }}>
      <ExpenseStack.Screen name="ExpenseList">
        {({ navigation }) => {

          return <ExpenseListScreen onNavigateToAdd={() => navigation.navigate('AddExpense')} />;
        }}
      </ExpenseStack.Screen>
      <ExpenseStack.Screen name="AddExpense" options={{ title: 'Add Expense' }}>
        {({ navigation }) => {

          return <AddExpenseScreen onSuccess={() => navigation.goBack()} />;
        }}
      </ExpenseStack.Screen>
    </ExpenseStack.Navigator>
  );
}

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: { backgroundColor: colors.surface },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{ tabBarLabel: 'Home', tabBarIcon: () => <Icon size={25} source="home" /> }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpenseStackScreen}
        options={{ tabBarLabel: 'Expenses', tabBarIcon: () => <Icon size={25} source="bitcoin" /> }}
      />
      <Tab.Screen
        name="DashboardStack"
        component={DashboardStackScreen}
        options={{ tabBarLabel: 'Dashboard', tabBarIcon: () => <Icon size={25} source="chart-bar-stacked" />  }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile', headerShown: true, tabBarIcon: () => <Icon size={25} source="face-man" /> }}
      />
    </Tab.Navigator>
  );
}
