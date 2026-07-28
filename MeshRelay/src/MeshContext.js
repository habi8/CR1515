import React, { createContext, useState, useEffect } from 'react';
import { getOrCreateDeviceId } from './utils/deviceId';
import { initMesh, sendMessage as meshSend } from './services/meshService';
import { requestMeshPermissions } from './utils/permissions';

export const MeshContext = createContext();

export function MeshProvider({ children }) {
  const [deviceId, setDeviceId] = useState(null);
  const [messages, setMessages] = useState([]);

useEffect(() => {
  (async () => {
    console.log('STEP 1: requesting permissions');
    await requestMeshPermissions();
    console.log('STEP 2: permissions done, getting device id');
    const id = await getOrCreateDeviceId();
    console.log('STEP 3: device id =', id);
    setDeviceId(id);
    console.log('STEP 4: starting mesh init');
    await initMesh(id, (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    console.log('STEP 5: mesh init done');
  })();
}, []);

  const sendMessage = (msg) => {
    setMessages((prev) => [...prev, msg]); // show your own sent msg immediately
    meshSend(msg);
  };

  if (!deviceId) return null; // or loading spinner

  return (
    <MeshContext.Provider value={{ deviceId, messages, sendMessage }}>
      {children}
    </MeshContext.Provider>
  );
}