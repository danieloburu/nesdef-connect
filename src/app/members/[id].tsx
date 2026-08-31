import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';

type Member = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  membership_status: string | null;
  role: string;
  joined_at: string | null;
};

type Position = {
  id: number;
  name: string;
};

type MemberPosition = {
  position_id: number;
  positions: {
    name: string;
  } | null;
};

export default function MemberDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [member, setMember] = useState<Member | null>(null);
  const [allPositions, setAllPositions] = useState<Position[]>([]);
  const [memberPositions, setMemberPositions] = useState<MemberPosition[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      loadPage();
    }
  }, [id]);

  async function loadPage() {
    setLoading(true);
    setMessage('');

    await Promise.all([
      fetchMember(),
      fetchAllPositions(),
      fetchMemberPositions(),
    ]);

    setLoading(false);
  }

  async function fetchMember() {
    const { data, error } = await supabase
      .from('profiles')
      .select(
        'id, first_name, last_name, phone, membership_status, role, joined_at'
      )
      .eq('id', id)
      .single();

    if (error) {
      console.error('MEMBER ERROR:', error);
      setMessage(error.message);
      return;
    }

    setMember(data);
  }

  async function fetchAllPositions() {
    const { data, error } = await supabase
      .from('positions')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('POSITIONS ERROR:', error);
      setMessage(error.message);
      return;
    }

    setAllPositions(data ?? []);
  }

  async function fetchMemberPositions() {
    const { data, error } = await supabase
      .from('member_positions')
      .select(`
        position_id,
        positions (
          name
        )
      `)
      .eq('member_id', id);

    if (error) {
      console.error('MEMBER POSITION ERROR:', error);
      setMessage(error.message);
      return;
    }

    setMemberPositions((data as MemberPosition[]) ?? []);
  }

  async function updateMembershipStatus(status: string) {
    setSaving(true);
    setMessage('');

    const { error } = await supabase
      .from('profiles')
      .update({
        membership_status: status,
      })
      .eq('id', id);

    if (error) {
      console.error('STATUS UPDATE ERROR:', error);
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setMember((current) =>
      current
        ? {
            ...current,
            membership_status: status,
          }
        : current
    );

    setSaving(false);
  }

  async function togglePosition(position: Position) {
    const alreadyAssigned = memberPositions.some(
      (memberPosition) =>
        memberPosition.position_id === position.id
    );

    setSaving(true);
    setMessage('');

    if (alreadyAssigned) {
      const { error } = await supabase
        .from('member_positions')
        .delete()
        .eq('member_id', id)
        .eq('position_id', position.id);

      if (error) {
        console.error('REMOVE POSITION ERROR:', error);
        setMessage(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from('member_positions')
        .insert({
          member_id: id,
          position_id: position.id,
          start_date: new Date().toISOString().split('T')[0],
        });

      if (error) {
        console.error('ASSIGN POSITION ERROR:', error);
        setMessage(error.message);
        setSaving(false);
        return;
      }
    }

    await fetchMemberPositions();

    setSaving(false);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading member...
        </Text>
      </View>
    );
  }

  if (!member) {
    return (
      <View style={styles.center}>
        <Text>
          {message || 'Member not found.'}
        </Text>
      </View>
    );
  }

  const fullName =
    `${member.first_name ?? ''} ${member.last_name ?? ''}`.trim();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {fullName || 'Unnamed Member'}
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Membership Status
        </Text>

        <View style={styles.buttonRow}>
          {['active', 'pending', 'inactive'].map((status) => {
            const selected =
              member.membership_status === status;

            return (
              <Pressable
                key={status}
                disabled={saving}
                style={[
                  styles.optionButton,
                  selected && styles.selectedButton,
                ]}
                onPress={() =>
                  updateMembershipStatus(status)
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    selected && styles.selectedText,
                  ]}
                >
                  {status.charAt(0).toUpperCase() +
                    status.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          NESDF Positions
        </Text>

        {allPositions.map((position) => {
          const selected = memberPositions.some(
            (memberPosition) =>
              memberPosition.position_id === position.id
          );

          return (
            <Pressable
              key={position.id}
              disabled={saving}
              style={[
                styles.positionButton,
                selected && styles.selectedButton,
              ]}
              onPress={() => togglePosition(position)}
            >
              <Text
                style={[
                  styles.optionText,
                  selected && styles.selectedText,
                ]}
              >
                {position.name}
                {selected ? ' ✓' : ''}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Joined
        </Text>

        <Text style={styles.value}>
          {member.joined_at ?? 'Not provided'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Phone
        </Text>

        <Text style={styles.value}>
          {member.phone ?? 'Not provided'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          App Role
        </Text>

        <Text style={styles.value}>
          {member.role}
        </Text>
      </View>

      {saving && (
        <Text style={styles.saving}>
          Saving...
        </Text>
      )}

      {message !== '' && (
        <Text style={styles.error}>
          {message}
        </Text>
      )}
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
    marginBottom: 24,
  },

  card: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },

  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
  },

  positionButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    marginBottom: 8,
  },

  selectedButton: {
    backgroundColor: '#222222',
    borderColor: '#222222',
  },

  optionText: {
    fontSize: 15,
  },

  selectedText: {
    color: 'white',
    fontWeight: '600',
  },

  label: {
    fontSize: 14,
    marginBottom: 4,
  },

  value: {
    fontSize: 18,
    fontWeight: '600',
  },

  saving: {
    marginTop: 8,
    fontSize: 15,
  },

  error: {
    marginTop: 12,
    fontSize: 15,
  },
});