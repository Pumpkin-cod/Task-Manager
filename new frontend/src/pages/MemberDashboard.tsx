// src/pages/MemberDashboard.tsx
import { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import {
  ClipboardDocumentListIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';

import TaskList from '../components/TaskList';
import Sidebar from '../pages/Sidebar';  // fixed import path
import Header from '../components/Header';    // add Header


const MemberDashboard = () => {
  const auth = useAuth();
  const user = auth.user;
  const email = user?.profile?.email ?? "member@example.com";
  const role = "member";

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    auth.signoutRedirect();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role={role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <Header
          user={{ email, role }}
          onLogout={handleLogout}
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex flex-col items-center justify-center flex-1 p-6 overflow-y-auto text-center">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <UserCircleIcon className="w-7 h-7 text-indigo-600" />
            Member Dashboard
          </h1>

          <div className="mb-6 flex items-center gap-2 text-gray-600">
            <ClipboardDocumentListIcon className="w-6 h-6 text-blue-500" />
            <span className="text-lg font-semibold">My Assigned Tasks</span>
          </div>

          <TaskList currentUser={{ email, role }} />
        </main>
      </div>
    </div>
  );
};

export default MemberDashboard;

