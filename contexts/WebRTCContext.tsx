
import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { UserRole, Device, CallState, SignalingPayload, IncomingCall } from '../types';
import { ICE_SERVERS } from '../constants';

interface WebRTCContextType {
  role: UserRole | null;
  setRole: (role: UserRole) => void;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  callState: CallState;
  devices: Device[];
  registerDevice: (name: string) => void;
  startCall: (deviceId: string) => void;
  answerCall: () => void;
  hangUp: () => void;
  incomingCall: IncomingCall | null;
  currentPeer: Device | null;
  userId: string | null;
}

const WebRTCContext = createContext<WebRTCContextType | undefined>(undefined);

// In a real application, this would be a WebSocket server.
// Here we simulate it using a simple object to dispatch messages
// between components in the same browser window. This is a workaround
// for the no-backend constraint.
const signalingChannel = new EventTarget();

export const WebRTCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callState, setCallState] = useState<CallState>(CallState.IDLE);
  const [devices, setDevices] = useState<Device[]>([]);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [currentPeer, setCurrentPeer] = useState<Device | null>(null);
  
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  const resetState = useCallback(() => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);
    setCallState(CallState.IDLE);
    setIncomingCall(null);
    setCurrentPeer(null);
  }, [localStream]);

  const handleSignaling = useCallback(async (event: Event) => {
    const customEvent = event as CustomEvent<SignalingPayload>;
    const data = customEvent.detail;

    if (data.toId !== userId) return;

    try {
        if (data.type === 'offer' && data.sdp) {
            const callerDevice = devices.find(d => d.id === data.fromId);
            if(callerDevice) {
                setIncomingCall({ from: callerDevice, offer: data.sdp });
                setCallState(CallState.RECEIVING);
            }
        } else if (data.type === 'answer' && data.sdp) {
            if (peerConnection.current && peerConnection.current.signalingState !== 'stable') {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
            }
        } else if (data.type === 'candidate' && data.candidate) {
            if (peerConnection.current) {
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
        }
    } catch (error) {
        console.error("Error handling signaling message:", error);
    }
  }, [userId, devices]);
  
  useEffect(() => {
    signalingChannel.addEventListener('signal', handleSignaling);
    return () => {
      signalingChannel.removeEventListener('signal', handleSignaling);
    };
  }, [handleSignaling]);


  const createPeerConnection = useCallback((peerId: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate && userId) {
        const payload: SignalingPayload = { type: 'candidate', candidate: event.candidate, fromId: userId, toId: peerId };
        signalingChannel.dispatchEvent(new CustomEvent('signal', { detail: payload }));
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pc.onconnectionstatechange = () => {
      if(pc.connectionState === 'connected') {
        setCallState(CallState.CONNECTED);
      }
      if(pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        hangUp();
      }
    };
    
    localStream?.getTracks().forEach(track => pc.addTrack(track, localStream));
    
    return pc;
  }, [localStream, userId]);


  const getMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error("Error accessing media devices.", error);
      alert("Could not access camera and microphone. Please check permissions.");
      return null;
    }
  }, []);

  const registerDevice = (name: string) => {
    const newId = `student-${Date.now()}`;
    const newDevice = { id: newId, name };
    setDevices(prev => [...prev, newDevice]); // Simulate DB
    setUserId(newId);
    getMedia(); // Pre-fetch media for student
  };

  const handleSetRole = (role: UserRole) => {
    setRole(role);
    if(role === 'teacher') {
        const teacherId = `teacher-${Date.now()}`;
        setUserId(teacherId);
        getMedia();
    }
  }

  const startCall = useCallback(async (deviceId: string) => {
    const peer = devices.find(d => d.id === deviceId);
    if (!peer || !userId) return;

    setCurrentPeer(peer);
    
    const stream = localStream || await getMedia();
    if (!stream) return;
    
    peerConnection.current = createPeerConnection(deviceId);
    
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    setCallState(CallState.CALLING);
    
    const payload: SignalingPayload = { type: 'offer', sdp: offer, fromId: userId, toId: deviceId };
    signalingChannel.dispatchEvent(new CustomEvent('signal', { detail: payload }));
  }, [createPeerConnection, devices, getMedia, localStream, userId]);


  const answerCall = useCallback(async () => {
    if (!incomingCall || !userId) return;
    
    const peer = incomingCall.from;
    setCurrentPeer(peer);

    const stream = localStream || await getMedia();
    if (!stream) return;

    peerConnection.current = createPeerConnection(peer.id);
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
    
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    const payload: SignalingPayload = { type: 'answer', sdp: answer, fromId: userId, toId: peer.id };
    signalingChannel.dispatchEvent(new CustomEvent('signal', { detail: payload }));
    
    setIncomingCall(null);
  }, [createPeerConnection, getMedia, incomingCall, localStream, userId]);

  const hangUp = useCallback(() => {
    resetState();
    // After hanging up, re-acquire media for the next call
    getMedia();
  }, [resetState, getMedia]);
  
  const value = {
    role,
    setRole: handleSetRole,
    localStream,
    remoteStream,
    callState,
    devices,
    registerDevice,
    startCall,
    answerCall,
    hangUp,
    incomingCall,
    currentPeer,
    userId,
  };

  return <WebRTCContext.Provider value={value}>{children}</WebRTCContext.Provider>;
};

export const useWebRTC = (): WebRTCContextType => {
  const context = useContext(WebRTCContext);
  if (context === undefined) {
    throw new Error('useWebRTC must be used within a WebRTCProvider');
  }
  return context;
};
