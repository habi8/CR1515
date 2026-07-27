import {
  startAdvertise,
  startDiscovery,
  stopAdvertise,
  stopDiscovery,
  onPeerFound,
  onPeerLost,
  onInvitationReceived,
  onConnected,
  onDisconnected,
  onTextReceived,
  requestConnection,
  acceptConnection,
  sendText,
  Strategy,
} from 'expo-nearby-connections';

const seenMessageIds = new Set();
let connectedPeers = new Map(); // peerId -> name(your deviceId)

export async function initMesh(myDeviceId, onMessageReceived) {
  // advertise using your deviceId as the "name" so peers can identify you
  await startAdvertise(myDeviceId, Strategy.P2P_CLUSTER);
  await startDiscovery(myDeviceId, Strategy.P2P_CLUSTER);

  // auto-accept all connection requests (fine for hackathon demo)
  onInvitationReceived(({ peerId }) => {
    acceptConnection(peerId);
  });

  // auto-connect to anyone discovered (mesh = connect to everyone in range)
  onPeerFound(({ peerId }) => {
    requestConnection(peerId);
  });

  onConnected(({ peerId, name }) => {
    connectedPeers.set(peerId, name);
  });

  onDisconnected(({ peerId }) => {
    connectedPeers.delete(peerId);
  });

  onPeerLost(({ peerId }) => {
    connectedPeers.delete(peerId);
  });

  onTextReceived(({ peerId, text }) => {
    const message = JSON.parse(text);
    handleIncomingMessage(message, myDeviceId, onMessageReceived);
  });
}

function handleIncomingMessage(message, myId, onMessageReceived) {
  if (seenMessageIds.has(message.msgId)) return;
  seenMessageIds.add(message.msgId);

  if (message.isBroadcast || message.toId === myId) {
    onMessageReceived(message);
  }

  if (message.ttl > 0 && !message.seenBy.includes(myId)) {
    const relayed = {
      ...message,
      ttl: message.ttl - 1,
      seenBy: [...message.seenBy, myId],
    };
    broadcastToAllPeers(relayed);
  }
}

function broadcastToAllPeers(message) {
  const payload = JSON.stringify(message);
  connectedPeers.forEach((_, peerId) => {
    sendText(peerId, payload);
  });
}

export function sendMessage(message) {
  broadcastToAllPeers(message);
}