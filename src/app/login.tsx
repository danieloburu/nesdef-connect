import { useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function signIn() {
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      console.error('LOGIN ERROR:', error);
      setMessage(error.message);
      return;
    }

    router.replace('/');
  }

  async function signUp() {
    setLoading(true);
    setMessage('');

    if (
      firstName.trim() === '' ||
      lastName.trim() === '' ||
      email.trim() === '' ||
      password.trim() === ''
    ) {
      setMessage('Please fill out all fields.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        },
      },
    });

    setLoading(false);

    if (error) {
      console.error('SIGNUP ERROR:', error);
      setMessage(error.message);
      return;
    }

    if (data.session) {
      router.replace('/');
    } else {
      setMessage('Account created. Check your email to confirm your account.');
    }
  }

  function switchToCreateAccount() {
    setIsCreatingAccount(true);
    setMessage('');
  }

  function switchToSignIn() {
    setIsCreatingAccount(false);
    setFirstName('');
    setLastName('');
    setMessage('');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NESDF Connect</Text>

      <Text style={styles.subtitle}>
        {isCreatingAccount ? 'Create Account' : 'Member Login'}
      </Text>

      {isCreatingAccount && (
        <>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />

          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {isCreatingAccount ? (
        <>
          <View style={styles.button}>
            <Button
              title={loading ? 'Please wait...' : 'Create Account'}
              onPress={signUp}
              disabled={loading}
            />
          </View>

          <View style={styles.button}>
            <Button
              title="Back to Sign In"
              onPress={switchToSignIn}
              disabled={loading}
            />
          </View>
        </>
      ) : (
        <>
          <View style={styles.button}>
            <Button
              title={loading ? 'Please wait...' : 'Sign In'}
              onPress={signIn}
              disabled={loading}
            />
          </View>

          <View style={styles.button}>
            <Button
              title="Create an Account"
              onPress={switchToCreateAccount}
              disabled={loading}
            />
          </View>
        </>
      )}

      {message !== '' && (
        <Text style={styles.message}>{message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 100,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 20,
    marginBottom: 30,
  },

  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },

  button: {
    marginBottom: 12,
  },

  message: {
    marginTop: 20,
    fontSize: 16,
  },
});