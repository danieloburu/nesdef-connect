import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>

      <Stack.Screen
        name="index"
        options={{
          title: 'NESDF Connect',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="contributions"
        options={{
          title: 'My Contributions',
        }}
      />

      <Stack.Screen
        name="members"
        options={{
          title: 'Members',
        }}
      />

      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'My Profile',
        }}
      />
    </Stack>
  );
}