import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { supabase } from '../lib/supabase';

type Profile = {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  membership_status: string | null;
  joined_at: string | null;
};

type Position = {
  name: string;
};

type MemberPosition = {
  positions: Position | null;
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [positions, setPositions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);
    setMessage('');

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage('Unable to load your account.');
      setLoading(false);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select(
        'first_name, last_name, phone, membership_status, joined_at'
      )
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('PROFILE ERROR:', profileError);
      setMessage(profileError.message);
      setLoading(false);
      return;
    }

    const { data: positionData, error: positionError } = await supabase
      .from('member_positions')
      .select(`
        positions (
          name
        )
      `)
      .eq('member_id', user.id);

    if (positionError) {
      console.error('POSITION ERROR:', positionError);
      setMessage(positionError.message);
      setLoading(false);
      return;
    }

    setProfile(profileData);

    const positionNames =
      (positionData as MemberPosition[] | null)
        ?.map((item) => item.positions?.name)
        .filter((name): name is string => Boolean(name)) ?? [];

    setPositions(positionNames);

    setLoading(false);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>{message || 'Profile not found.'}</Text>
      </View>
    );
  }

  const fullName =
    `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>
          {fullName || 'Not provided'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Membership Status</Text>
        <Text style={styles.value}>
          {profile.membership_status ?? 'Unknown'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>NESDF Position</Text>
        <Text style={styles.value}>
          {positions.length > 0
            ? positions.join(', ')
            : 'Member'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Joined</Text>
        <Text style={styles.value}>
          {profile.joined_at ?? 'Not provided'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>
          {profile.phone ?? 'Not provided'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f5f5f5',
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
    marginBottom: 24,
  },

  card: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    marginBottom: 4,
  },

  value: {
    fontSize: 18,
    fontWeight: '600',
  },
});