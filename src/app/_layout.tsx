import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'NESDEF Connect',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="contributions"
        options={{
          title: 'My Contributions',
        }}
      />
    </Stack>


  );
}