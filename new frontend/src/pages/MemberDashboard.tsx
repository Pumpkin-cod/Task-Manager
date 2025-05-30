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
}

const MemberDashboard = () => {
  const auth = useAuth();
  const user = auth.user;
  const email = user?.profile?.email ?? "member@example.com";
  const role = "member";

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate currentUser object
  const currentUser = { email, role };

  // Memoized fetch function to prevent infinite re-renders
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/tasks');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const fetchedTasks = await response.json();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch tasks');
      
      // Fallback to mock data in case of error
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Submit Report',
          description: 'Submit your weekly report',
          status: 'Pending',
          assignedTo: email,
          deadline: '2023-10-15',
          updatedAt: '2023-10-10',
        },
      ];
      setTasks(mockTasks);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Function to delete a task
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  // Function to update task status
  const handleStatusUpdate = (taskId: string, newStatus: Task['status']) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
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

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600">Loading tasks...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 max-w-md">
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

          {/* Task List */}
          {!loading && (
            <TaskList
              currentUser={currentUser}
              tasks={tasks}
              onDelete={handleDeleteTask}
              onStatusUpdate={handleStatusUpdate}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default MemberDashboard;