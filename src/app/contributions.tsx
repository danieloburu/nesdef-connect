import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

type Contribution = {
  id: number;
  amount: number | string;
  contribution_type: string;
  contribution_date: string;
};

export default function ContributionsScreen() {
  const [contributions, setContributions] = useState<Contribution[]>([]);

  useEffect(() => {
    fetchContributions();
  }, []);

  async function fetchContributions() {
    const { data, error } = await supabase
      .from('contributions')
      .select('id, amount, contribution_type, contribution_date')
      .order('contribution_date', { ascending: false });

    if (error) {
      console.error('Error loading contributions:', error);
      return;
    }

    setContributions(data ?? []);
  }

  const total = contributions.reduce((sum, contribution) => {
    return sum + Number(contribution.amount);
  }, 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Contributions</Text>

      <Text style={styles.label}>Total Contributed</Text>
      <Text style={styles.total}>${total.toFixed(2)}</Text>

      <Text style={styles.sectionTitle}>Contribution History</Text>

      {contributions.map((contribution) => (
        <View key={contribution.id} style={styles.card}>
          <View>
            <Text style={styles.type}>
              {contribution.contribution_type}
            </Text>

            <Text>{contribution.contribution_date}</Text>
          </View>

          <Text style={styles.amount}>
            ${Number(contribution.amount).toFixed(2)}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
  },

  total: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 35,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  card: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#eeeeee',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  type: {
    fontWeight: 'bold',
    marginBottom: 5,
  },

  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});