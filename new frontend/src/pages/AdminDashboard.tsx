import { useState } from 'react';
import { useAuth } from 'react-oidc-context'; 
import {
  PlusCircleIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/solid';

import CreateTaskModal from '../components/modals/CreateTaskModal';
import CreateTeamModal from '../components/modals/CreateTeamModal';
import TaskList from '../components/TaskList';
import Sidebar from '../pages/Sidebar'; 
import Header from '../components/Header'; 
import { createTask, createTeam } from '../utils/api';

const AdminDashboard = () => {
  const auth = useAuth();
  const user = auth.user;
  const email = user?.profile?.email ?? "admin@example.com";
  const role = "admin";

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Match the expected Task type for CreateTaskModal
  type Task = {
    title: string;
    description: string;
    deadline: string;
    assignedTo?: string;
  };

  // type TeamData = {
  //   name: string;
  //   members: string[];
  // };

  const handleLogout = () => {
    auth.signoutRedirect();
  };

  const handleCreateTask = async (task: Task) => {
    try {
      await createTask(task);
      setShowTaskModal(false);
      // Optionally, trigger a refresh for TaskList if supported
    } catch {
      alert('Failed to create task');
    }
  };

  const handleCreateTeam = (teamName: string) => {
    const team = { name: teamName, members: [] };
    createTeam(team)
      .then(() => setShowTeamModal(false))
      .catch(() => alert('Failed to create team'));
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
          <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2 justify-center">
            <ClipboardDocumentCheckIcon className="w-7 h-7 text-blue-600" />
            Admin Dashboard
          </h1>

          <p className="text-gray-600 text-lg mb-2">Welcome, {email}</p>
          <p className="text-gray-500 mb-6">
            As an admin, you can manage tasks and teams.
          </p>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setShowTaskModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Create Task
            </button>
            <button
              onClick={() => setShowTeamModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              <UsersIcon className="w-5 h-5" />
              Create Team
            </button>
          </div>

          {/* Task List Section with Heading */}
          <div className="w-full max-w-3xl bg-white rounded shadow p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-left text-blue-700 flex items-center gap-2">
              <ClipboardDocumentCheckIcon className="w-6 h-6 text-blue-500" />
              All Tasks
            </h2>
            <TaskList currentUser={{ email, role }} />
          </div>

          {/* Modals */}
          <CreateTaskModal
            isOpen={showTaskModal}
            onClose={() => setShowTaskModal(false)}
            onCreateTask={handleCreateTask}
          />
          <CreateTeamModal
            isOpen={showTeamModal}
            onClose={() => setShowTeamModal(false)}
            onCreateTeam={handleCreateTeam}
          />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;