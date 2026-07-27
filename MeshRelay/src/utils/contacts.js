import AsyncStorage from '@react-native-async-storage/async-storage';

const CONTACTS_KEY = 'mesh_contacts';

export async function getContacts() {
  const raw = await AsyncStorage.getItem(CONTACTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function addContact(name, deviceId) {
  const contacts = await getContacts();
  const exists = contacts.find((c) => c.deviceId === deviceId);
  if (exists) return contacts;

  const updated = [...contacts, { name, deviceId }];
  await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(updated));
  return updated;
}