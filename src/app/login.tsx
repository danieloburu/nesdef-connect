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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function signIn() {
    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      console.error('LOGIN ERROR:', error);
      setMessage(error.message);
      return;
    }

    console.log('LOGIN DATA:', data);
    setMessage('Login successful');

    router.replace('/');
  }

  async function signUp() {
    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      console.error('SIGNUP ERROR:', error);
      setMessage(error.message);
      return;
    }

    console.log('SIGNUP DATA:', data);

    if (data.session) {
      setMessage('Account created and signed in.');
      router.replace('/');
    } else {
      setMessage('Account created. Check your email to confirm your account.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NESDEF Connect</Text>
      <Text style={styles.subtitle}>Member Login</Text>

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

      <View style={styles.button}>
        <Button
          title={loading ? 'Please wait...' : 'Sign In'}
          onPress={signIn}
          disabled={loading}
        />
      </View>

      <View style={styles.button}>
        <Button
          title="Create Account"
          onPress={signUp}
          disabled={loading}
        />
      </View>

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