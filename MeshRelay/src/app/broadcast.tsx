import { useContext, useState } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MeshContext } from '@/MeshContext';
import { createMessage } from '@/utils/messageSchema';

type BroadcastMessage = {
  isBroadcast?: boolean;
  body?: string;
  msgId: string;
};

export default function BroadcastScreen() {
  const { deviceId, messages, sendMessage } = useContext(MeshContext);
  const [text, setText] = useState('');

  const broadcasts = (messages as BroadcastMessage[]).filter((m: BroadcastMessage) => m.isBroadcast);

  const handleSend = () => {
    if (!text.trim()) return;
    const msg = createMessage({ fromId: deviceId, toId: 'BROADCAST', body: text, isBroadcast: true });
    sendMessage(msg);
    setText('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={broadcasts}
        keyExtractor={(item) => item.msgId}
        renderItem={({ item }) => (
          <View style={styles.broadcastItem}>
            <ThemedText style={styles.broadcastText}>{item.body}</ThemedText>
          </View>
        )}
      />
      <View style={styles.inputRow}>
        <TextInput style={styles.input} value={text} onChangeText={setText} placeholder="Emergency alert..." />
        <Button title="Send SOS" onPress={handleSend} color="#dc2626" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  broadcastItem: { backgroundColor: '#fee2e2', padding: 10, borderRadius: 6, marginVertical: 4 },
  broadcastText: { color: '#991b1b', fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginRight: 8 },
});