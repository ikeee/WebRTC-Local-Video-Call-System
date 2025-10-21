
import React, { useState } from 'react';
import { useWebRTC } from '../contexts/WebRTCContext';
import { CallState } from '../types';
import VideoPlayer from './VideoPlayer';
import CallInterface from './CallInterface';
import { PhoneIncomingIcon, PhoneOffIcon } from './Icons';

const StudentView: React.FC = () => {
  const { userId, registerDevice, localStream, callState, incomingCall, answerCall, hangUp } = useWebRTC();
  const [name, setName] = useState('');

  const handleRegister = () => {
    if (name.trim()) {
      registerDevice(name.trim());
    }
  };

  if (callState === CallState.CONNECTED || callState === CallState.CALLING) {
    return <CallInterface />;
  }

  if (incomingCall) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-800 rounded-lg p-8">
        <div className="animate-pulse mb-4 text-center">
            <img src={`https://i.pravatar.cc/150?u=${incomingCall.from.id}`} alt="Teacher" className="w-32 h-32 rounded-full mx-auto border-4 border-emerald-400"/>
            <h3 className="text-2xl font-bold mt-4">Incoming Call from {incomingCall.from.name}</h3>
        </div>
        <div className="flex space-x-4 mt-8">
          <button onClick={answerCall} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full flex items-center transition-transform transform hover:scale-105">
            <PhoneIncomingIcon className="w-6 h-6 mr-2" />
            Answer
          </button>
          <button onClick={hangUp} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full flex items-center transition-transform transform hover:scale-105">
            <PhoneOffIcon className="w-6 h-6 mr-2" />
            Decline
          </button>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Register Your Device</h2>
        <p className="text-gray-400 mb-6">Enter your name so the teacher can identify you.</p>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
          />
          <button onClick={handleRegister} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg">
            Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-4">You are registered!</h2>
      <p className="text-gray-400 mb-6">Waiting for the teacher to call...</p>
      <div className="w-64 h-48 rounded-lg overflow-hidden shadow-lg border-2 border-emerald-400">
        {localStream ? (
          <VideoPlayer stream={localStream} muted={true} />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <p className="text-gray-500">Initializing camera...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentView;
