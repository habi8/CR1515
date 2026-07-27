import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

const ID_KEY = 'device_mesh_id';

export async function getOrCreateDeviceId() {
  let id = await AsyncStorage.getItem(ID_KEY);
  if (!id) {
    id = uuid.v4();
    await AsyncStorage.setItem(ID_KEY, id);
  }
  return id;
}