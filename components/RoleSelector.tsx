
import React from 'react';
import { useWebRTC } from '../contexts/WebRTCContext';
import { UserIcon, GraduationCapIcon } from './Icons';

const RoleSelector: React.FC = () => {
  const { setRole } = useWebRTC();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-3xl font-bold mb-8 text-gray-200">Choose Your Role</h2>
      <div className="flex space-x-8">
        <button
          onClick={() => setRole('teacher')}
          className="flex flex-col items-center justify-center w-48 h-48 bg-gray-700 rounded-lg shadow-lg hover:bg-emerald-600 hover:scale-105 transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-emerald-500"
        >
          <UserIcon className="w-20 h-20 mb-4" />
          <span className="text-xl font-semibold">I am a Teacher</span>
        </button>
        <button
          onClick={() => setRole('student')}
          className="flex flex-col items-center justify-center w-48 h-48 bg-gray-700 rounded-lg shadow-lg hover:bg-sky-600 hover:scale-105 transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-sky-500"
        >
          <GraduationCapIcon className="w-20 h-20 mb-4" />
          <span className="text-xl font-semibold">I am a Student</span>
        </button>
      </div>
    </div>
  );
};

export default RoleSelector;
