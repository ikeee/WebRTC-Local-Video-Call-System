
import React from 'react';
import { useWebRTC } from '../contexts/WebRTCContext';
import { CallState } from '../types';
import VideoPlayer from './VideoPlayer';
import { PhoneOffIcon } from './Icons';

const CallInterface: React.FC = () => {
  const { localStream, remoteStream, hangUp, callState, currentPeer } = useWebRTC();

  const getStatusText = () => {
    switch (callState) {
      case CallState.CALLING:
        return `Calling ${currentPeer?.name}...`;
      case CallState.CONNECTED:
        return `Connected with ${currentPeer?.name}`;
      default:
        return 'Connecting...';
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-lg text-lg font-semibold z-20">
        {getStatusText()}
      </div>

      <div className="relative flex-grow bg-black rounded-lg overflow-hidden">
        {remoteStream ? (
          <VideoPlayer stream={remoteStream} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Waiting for connection...</p>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 right-4 w-40 h-30 md:w-64 md:h-48 rounded-lg overflow-hidden border-2 border-white shadow-lg z-10">
          {localStream ? (
            <VideoPlayer stream={localStream} muted={true} />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <p className="text-xs text-white">No local video</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-shrink-0 flex justify-center py-4">
        <button
          onClick={hangUp}
          className="bg-red-500 hover:bg-red-600 text-white font-bold w-20 h-20 rounded-full flex items-center justify-center transition-transform transform hover:scale-105 shadow-2xl"
          aria-label="Hang up"
        >
          <PhoneOffIcon className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
};

export default CallInterface;
