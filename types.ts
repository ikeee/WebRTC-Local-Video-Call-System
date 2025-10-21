
export type UserRole = 'teacher' | 'student';

export interface Device {
  id: string;
  name: string;
}

export enum CallState {
  IDLE = 'IDLE',
  CALLING = 'CALLING',
  RECEIVING = 'RECEIVING',
  CONNECTED = 'CONNECTED',
}

export interface SignalingPayload {
  type: 'offer' | 'answer' | 'candidate';
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidate;
  fromId: string;
  toId: string;
}

export interface IncomingCall {
    from: Device;
    offer: RTCSessionDescriptionInit;
}
