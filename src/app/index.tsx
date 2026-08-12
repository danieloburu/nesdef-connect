import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';


export default function HomeScreen() {
  const [totalContributions, setTotalContributions] = useState(0);

  useEffect(() => {
    fetchContributions();
  }, []);

  async function fetchContributions() {
    const { data, error } = await supabase
      .from('contributions')
      .select('amount');

    if (error) {
      console.error('Error loading contributions:', error);
      return;
    }

    const total = data.reduce((sum, contribution) => {
      return sum + Number(contribution.amount);
    }, 0);

    setTotalContributions(total);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NESDEF Connect</Text>

      <Text style={styles.welcome}>Welcome</Text>

      <Pressable
        style={styles.card}
        onPress={() => router.push('/contributions')}
      >
        <Text style={styles.cardTitle}>My Contributions</Text>
        <Text style={styles.amount}>
          ${totalContributions.toFixed(2)}
        </Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Upcoming Events</Text>
        <Text>No upcoming events</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Announcements</Text>
        <Text>No announcements</Text>
      </View>

      <Button
        title="Sign Out"
        onPress={async () => {
          await supabase.auth.signOut();
          router.replace('/login');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#f5f5f5',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  welcome: {
    fontSize: 18,
    marginBottom: 30,
  },

  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },

  amount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});