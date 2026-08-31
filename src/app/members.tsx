import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { supabase } from '../lib/supabase';

type Member = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  membership_status: string | null;
  role: string;
};

export default function MembersScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchMembers();
    }, [])
  );

  async function fetchMembers() {
    setLoading(true);
    setMessage('');

    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, membership_status, role')
      .order('first_name', { ascending: true });

    if (error) {
      console.error('MEMBERS ERROR:', error);
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMembers(data ?? []);
    setLoading(false);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading members...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>NESDF Members</Text>

      <Text style={styles.count}>
        {members.length} {members.length === 1 ? 'member' : 'members'}
      </Text>

      {message !== '' && (
        <Text style={styles.error}>{message}</Text>
      )}

      {members.map((member) => {
        const fullName =
          `${member.first_name ?? ''} ${member.last_name ?? ''}`.trim();

        return (
          <Pressable
            key={member.id}
            style={styles.card}
            onPress={() => {
              router.push(`/members/${member.id}`);
            }}
          >
            <Text style={styles.name}>
              {fullName || 'Unnamed Member'}
            </Text>

            <Text style={styles.detail}>
              Membership: {member.membership_status ?? 'Unknown'}
            </Text>

            <Text style={styles.detail}>
              App Role: {member.role}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  count: {
    fontSize: 16,
    marginBottom: 24,
  },

  card: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },

  detail: {
    fontSize: 14,
    marginBottom: 3,
  },

  error: {
    marginBottom: 16,
    fontSize: 16,
  },
});