
// Using a public STUN server is good practice even on a LAN, as it helps
// with network address discovery without relying on a TURN server for relaying.
export const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};
