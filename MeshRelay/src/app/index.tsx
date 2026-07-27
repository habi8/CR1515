import { useContext, useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { MeshContext } from '@/MeshContext';
import { getContacts } from '@/utils/contacts';

type Contact = {
  deviceId: string;
  name: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const { deviceId } = useContext(MeshContext);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    getContacts().then(setContacts);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">Mesh Relay</ThemedText>
        <ThemedText type="small">ID: {deviceId}</ThemedText>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/broadcast')}>
          <ThemedText>Broadcast / SOS Feed</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/my-qr')}>
          <ThemedText>My QR Code</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/scan')}>
          <ThemedText>Add Contact (Scan QR)</ThemedText>
        </TouchableOpacity>

        <ThemedText type="small" style={{ marginTop: Spacing.four }}>Contacts</ThemedText>
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.deviceId}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.contactRow}
              onPress={() => router.push(`/chat/${item.deviceId}`)}
            >
              <ThemedText>{item.name}</ThemedText>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, gap: Spacing.three },
  button: { padding: 14, borderRadius: 8, backgroundColor: '#2563eb1a', marginTop: 8 },
  contactRow: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
});