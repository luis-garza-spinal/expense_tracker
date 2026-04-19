import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useAuth } from '../../../app/providers/AuthProvider';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

interface SignUpScreenProps {
  onNavigateToSignIn: () => void;
}

export function SignUpScreen({ onNavigateToSignIn }: SignUpScreenProps) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await signUp(email.trim(), password);
    setLoading(false);

    if (!result.ok) {
      switch (result.error) {
        case 'EMAIL_ALREADY_EXISTS':
          setError('This email is already registered. Try signing in.');
          break;
        case 'WEAK_PASSWORD':
          setError('Password is too weak. Use at least 6 characters.');
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
          Create your account
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

        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          testID="confirm-password-input"
        />

        {error ? (
          <HelperText type="error" visible testID="error-message">
            {error}
          </HelperText>
        ) : null}

        <Button
          mode="contained"
          onPress={handleSignUp}
          loading={loading}
          disabled={loading}
          style={styles.button}
          testID="sign-up-button"
        >
          Sign Up
        </Button>

        <Button
          mode="text"
          onPress={onNavigateToSignIn}
          style={styles.linkButton}
          testID="navigate-sign-in"
        >
          Already have an account? Sign In
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
