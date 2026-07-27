import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { addContact } from '@/utils/contacts';

export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission]);

  const handleScan = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    await addContact('New Contact', data);
    router.back();
  };

  if (!permission?.granted) {
    return <ThemedText>Camera permission required</ThemedText>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });