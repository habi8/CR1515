import React, { createContext, useState, useEffect } from 'react';
import { getOrCreateDeviceId } from '../utils/deviceId';
import { initMesh, sendMessage as meshSend } from '../services/meshService';
import { requestMeshPermissions } from '../utils/permissions';

export const MeshContext = createContext();

export function MeshProvider({ children }) {
  const [deviceId, setDeviceId] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    (async () => {
      await requestMeshPermissions();
      const id = await getOrCreateDeviceId();
      setDeviceId(id);
      await initMesh(id, (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
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