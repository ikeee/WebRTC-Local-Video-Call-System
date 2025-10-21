
import React from 'react';
import { useWebRTC } from '../contexts/WebRTCContext';
import { CallState } from '../types';
import VideoPlayer from './VideoPlayer';
import CallInterface from './CallInterface';
import { PhoneIcon, VideoIcon } from './Icons';

const TeacherView: React.FC = () => {
  const { devices, startCall, localStream, callState, currentPeer } = useWebRTC();

  if (callState === CallState.CONNECTED || callState === CallState.CALLING) {
    return <CallInterface />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      <div className="md:col-span-2 bg-gray-700/50 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">Student Devices</h2>
        {devices.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No students have registered yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map(device => (
              <div key={device.id} className="bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-between shadow-md">
                <img src={`https://i.pravatar.cc/100?u=${device.id}`} alt={device.name} className="w-20 h-20 rounded-full mb-3 border-2 border-gray-500"/>
                <span className="font-semibold text-center truncate w-full">{device.name}</span>
                <button 
                  onClick={() => startCall(device.id)}
                  className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-full w-full flex items-center justify-center transition-transform transform hover:scale-105"
                >
                  <PhoneIcon className="w-5 h-5 mr-2" />
                  Call
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-gray-700/50 p-4 rounded-lg flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Your Camera</h2>
        <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg border-2 border-sky-400">
            {localStream ? (
            <VideoPlayer stream={localStream} muted={true} />
            ) : (
            <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-gray-500">
                <VideoIcon className="w-12 h-12 mb-2" />
                <p>Initializing camera...</p>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TeacherView;
