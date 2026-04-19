import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useAuth } from '../../../app/providers/AuthProvider';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

interface SignInScreenProps {
  onNavigateToSignUp: () => void;
}

export function SignInScreen({ onNavigateToSignUp }: SignInScreenProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const result = await signIn(email.trim(), password);
    setLoading(false);

    if (!result.ok) {
      switch (result.error) {
        case 'INVALID_CREDENTIALS':
          setError('Invalid email or password. Please try again.');
          break;
        case 'NETWORK_ERROR':
          setError('Network error. Please check your connection.');
          break;
        default:
          setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text variant="headlineLarge" style={styles.title}>
          Expensy
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Sign in to your account
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          style={styles.input}
          mode="outlined"
          testID="email-input"
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          testID="password-input"
        />

        {error ? (
          <HelperText type="error" visible testID="error-message">
            {error}
          </HelperText>
        ) : null}

        <Button
          mode="contained"
          onPress={handleSignIn}
          loading={loading}
          disabled={loading}
          style={styles.button}
          testID="sign-in-button"
        >
          Sign In
        </Button>

        <Button
          mode="text"
          onPress={onNavigateToSignUp}
          style={styles.linkButton}
          testID="navigate-sign-up"
        >
          Don't have an account? Sign Up
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    textAlign: 'center',
    color: colors.primary,
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  subtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  input: {
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
  },
  linkButton: {
    marginTop: spacing.md,
  },
});
