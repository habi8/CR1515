import uuid from 'react-native-uuid';

export function createMessage({ fromId, toId, body, isBroadcast = false }) {
  return {
    msgId: uuid.v4(),
    fromId,
    toId: isBroadcast ? 'BROADCAST' : toId,
    isBroadcast,
    body,
    ttl: 10,
    timestamp: Date.now(),
    seenBy: [fromId],
  };
}