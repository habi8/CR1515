import { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { ThemedText } from '@/components/themed-text';
import { MeshContext } from '@/src/MeshContext';

export default function MyQRScreen() {
  const { deviceId } = useContext(MeshContext);

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.label}>Your Mesh ID</ThemedText>
      {deviceId && <QRCode value={deviceId} size={220} />}
      <ThemedText type="small" style={styles.idText}>{deviceId}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { marginBottom: 20 },
  idText: { marginTop: 20 },
});