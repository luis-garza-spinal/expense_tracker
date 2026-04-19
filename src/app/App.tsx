import React from 'react';
import { PaperProvider, MD3LightTheme, ActivityIndicator } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './providers/AuthProvider';
import { SignInScreen } from '../features/auth/screens/SignInScreen';
import { SignUpScreen } from '../features/auth/screens/SignUpScreen';
import { BottomTabNavigator } from './navigation/BottomTabNavigator';
import { colors } from '../shared/theme/colors';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const theme = {
  ...MD3LightTheme,
  roundness: 2.0,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryLight,
    secondary: colors.secondary,
    secondaryContainer: colors.secondaryLight,
    background: colors.background,
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    error: colors.error,
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: colors.text,
    onSurface: colors.text,
    onError: '#FFFFFF',
  },
};

const AuthStack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn">
        {({ navigation }) => (
          <SignInScreen onNavigateToSignUp={() => navigation.navigate('SignUp')} />
        )}
      </AuthStack.Screen>
      <AuthStack.Screen name="SignUp">
        {({ navigation }) => (
          <SignUpScreen onNavigateToSignIn={() => navigation.goBack()} />
        )}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return user ? <BottomTabNavigator /> : <AuthNavigator />;
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <SafeAreaProvider>
        <NavigationContainer>
            <StatusBar
              style="dark" />
            <RootNavigator />
        </NavigationContainer>
        </SafeAreaProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
