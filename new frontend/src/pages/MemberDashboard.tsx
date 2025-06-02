import { useEffect, useState, useCallback } from 'react';
import { useAuth } from 'react-oidc-context';
import {
  ClipboardDocumentListIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';

import TaskList from '../components/TaskList';
import Sidebar from '../pages/Sidebar';
import Header from '../components/Header';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Complete';
  assignedTo: string;
  deadline: string;
  updatedAt: string;
  createdAt: string; 
}

const MemberDashboard = () => {
  const auth = useAuth();
  const user = auth.user;
  const email = user?.profile?.email ?? " ";
  const role = "member";

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUser = { email, role };

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
  
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tasks`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
      const fetchedTasks = await response.json();
      const assignedTasks = fetchedTasks.filter((task: Task) => task.assignedTo === email);
      setTasks(assignedTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [email]);
  

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleStatusUpdate = (taskId: string, updatedFields: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, ...updatedFields } : task
      )
    );
  };

  const handleLogout = () => {
    auth.signoutRedirect();
  };

  const handleRetry = () => {
    fetchTasks();
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar role={role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header
          user={{ email, role }}
          onLogout={handleLogout}
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <UserCircleIcon className="w-7 h-7 text-indigo-600" />
              Member Dashboard
            </h1>

            <div className="mb-6 flex items-center gap-2 text-gray-600">
              <ClipboardDocumentListIcon className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-semibold">My Assigned Tasks</span>
            </div>

            {loading && (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-gray-600">Loading tasks...</span>
              </div>
            )}

            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                  <div className="text-sm">
                    <h3 className="text-red-800 font-medium">Error loading tasks</h3>
                    <p className="text-red-700 mt-1">{error}</p>
                  </div>
                </div>
                <button
                  onClick={handleRetry}
                  className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded transition-colors"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && (
              <TaskList
                currentUser={currentUser}
                tasks={tasks}
                onDelete={handleDeleteTask}
                onStatusUpdate={handleStatusUpdate}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MemberDashboard;
