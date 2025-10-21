
import React from 'react';
import { WebRTCProvider, useWebRTC } from './contexts/WebRTCContext';
import RoleSelector from './components/RoleSelector';
import StudentView from './components/StudentView';
import TeacherView from './components/TeacherView';

const AppContent: React.FC = () => {
  const { role } = useWebRTC();

  const renderContent = () => {
    switch (role) {
      case 'student':
        return <StudentView />;
      case 'teacher':
        return <TeacherView />;
      default:
        return <RoleSelector />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-400">LAN Video Classroom</h1>
          <p className="text-gray-400 mt-2">A WebRTC-powered local video communication system</p>
        </header>
        <main className="bg-gray-800 rounded-2xl shadow-2xl p-6 min-h-[600px] flex flex-col">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <WebRTCProvider>
      <AppContent />
    </WebRTCProvider>
  );
};

export default App;
