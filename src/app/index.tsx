import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NESDEF Connect</Text>

      <Text style={styles.welcome}>Welcome</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>My Contributions</Text>
        <Text style={styles.amount}>$0.00</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Upcoming Events</Text>
        <Text>No upcoming events</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Announcements</Text>
        <Text>No announcements</Text>
      </View>
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