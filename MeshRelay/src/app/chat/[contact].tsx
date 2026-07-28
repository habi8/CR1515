import { useContext, useState } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { MeshContext } from '@/MeshContext';
import { createMessage } from '@/utils/messageSchema';

type ChatMessage = {
  isBroadcast?: boolean;
  fromId?: string;
  toId?: string;
  msgId: string;
  body?: string;
};

export default function ChatScreen() {
  const { contact: contactDeviceId } = useLocalSearchParams<{ contact: string }>();
  const { deviceId, messages, sendMessage } = useContext(MeshContext);
  const [text, setText] = useState('');

  const chatMessages = (messages as ChatMessage[]).filter(
    (m: ChatMessage) =>
      !m.isBroadcast &&
      ((m.fromId === contactDeviceId && m.toId === deviceId) ||
        (m.fromId === deviceId && m.toId === contactDeviceId))
  );

  const handleSend = () => {
    if (!text.trim()) return;
    const msg = createMessage({ fromId: deviceId, toId: contactDeviceId, body: text });
    sendMessage(msg);
    setText('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chatMessages}
        keyExtractor={(item) => item.msgId}
        renderItem={({ item }) => (
          <ThemedText style={item.fromId === deviceId ? styles.myMsg : styles.theirMsg}>
            {item.body}
          </ThemedText>
        )}
      />
      <View style={styles.inputRow}>
        <TextInput style={styles.input} value={text} onChangeText={setText} placeholder="Message..." />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  myMsg: { alignSelf: 'flex-end', backgroundColor: '#dbeafe', padding: 8, borderRadius: 6, marginVertical: 4 },
  theirMsg: { alignSelf: 'flex-start', backgroundColor: '#f3f4f6', padding: 8, borderRadius: 6, marginVertical: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginRight: 8 },
});