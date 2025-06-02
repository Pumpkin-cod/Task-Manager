import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import {
  PlusCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

import CreateTaskModal from "../components/modals/CreateTaskModal";
import CreateTeamModal from "../components/modals/CreateTeamModal";
import TaskList from "../components/TaskList";
import Sidebar from "../pages/Sidebar";
import Header from "../components/Header";
import { createTask, createTeam, getTasks, deleteTask, updateTaskStatus } from "../utils/api";
import type { CreateTaskFormProps } from '../components/forms/CreateTaskForm';

// Define the Task interface to match your TaskList component
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Complete';
  assignedTo: string;
  deadline: string;
  updatedAt?: string;
  createdAt: string; 
}

const AdminDashboard = () => {
  const auth = useAuth();
  const userObj = auth.user;
  const email = userObj?.profile?.email ?? "";
  const role = "admin";

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from API on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await getTasks();
      
      // Transform API data to match Task interface if needed
      const transformedTasks = fetchedTasks.map((task: {
        id?: string;
        _id?: string;
        title: string;
        description?: string;
        deadline?: string;
        dueDate?: string;
        assignedTo?: string;
        status?: string;
        createdAt?: string;
      }) => ({
        id: task.id || task._id || Math.random().toString(36).substr(2, 9),
        title: task.title,
        description: task.description,
        deadline: task.deadline || task.dueDate,
        assignedTo: task.assignedTo,
        status: task.status || 'Pending',
        createdAt: task.createdAt || new Date().toISOString()
      }));
      
      
      setTasks(transformedTasks);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("Failed to load tasks. Please try again.");
      
      // Fallback to mock data if API fails
      setTasks([
        {
          id: '1',
          title: "Sample Task",
          description: "This is a sample task for demonstration.",
          deadline: "2024-12-31",
          assignedTo: "user@example.com",
          status: "Pending",
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.signoutRedirect();
  };

  const handleCreateTask: CreateTaskFormProps['onCreate'] = async (task) => {
    try {
      await createTask(task);
      setShowTaskModal(false);
      // Refresh tasks after creating a new one
      await loadTasks();
    } catch (err) {
      console.error("Failed to create task:", err);
      alert("Failed to create task. Please try again.");
    }
  };

  const handleCreateTeam = async (teamName: string) => {
    try {
      const team = { name: teamName, members: [] };
      await createTeam(team);
      setShowTeamModal(false);
      alert("Team created successfully!");
    } catch (err) {
      console.error("Failed to create team:", err);
      alert("Failed to create team. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await deleteTask(taskId);
      // Remove task from local state
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert("Failed to delete task. Please try again.");
    }
  };

  const handleStatusUpdate = async (taskId: string, updatedFields: Partial<Task>) => {
    try {
      if (!updatedFields.status) return;
  
      await updateTaskStatus(taskId, updatedFields.status); 
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, ...updatedFields } : task
        )
      );
    } catch (err) {
      console.error("Failed to update task status:", err);
      alert("Failed to update task status. Please try again.");
    }
  };
  

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          role="admin"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex flex-col flex-1">
          <Header
            user={{ email, role }}
            onLogout={handleLogout}
            onMenuClick={() => setSidebarOpen((prev) => !prev)}
          />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading tasks...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        role="admin"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Header
          user={{ email, role }}
          onLogout={handleLogout}
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
        />

        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
          {/* Welcome Message */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {email}</h1>
            <p className="text-gray-600 text-lg">As an admin, you can manage tasks and teams.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setShowTaskModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Create Task
            </button>
            <button
              onClick={() => setShowTeamModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              <UsersIcon className="w-5 h-5" />
              Create Team
            </button>
            <button
              onClick={loadTasks}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {/* Task List Table */}
          <div className="mb-6">
            <TaskList
              currentUser={{ email, role }}
              tasks={tasks}
              onDelete={handleDeleteTask}
              onStatusUpdate={handleStatusUpdate}
            />
          </div>

          {/* Modals */}
          {showTaskModal && (
            <CreateTaskModal
              isOpen={showTaskModal}
              onClose={() => setShowTaskModal(false)}
              onCreateTask={handleCreateTask}
            />
          )}

          {showTeamModal && (
            <CreateTeamModal
              isOpen={showTeamModal}
              onClose={() => setShowTeamModal(false)}
              onCreateTeam={handleCreateTeam}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;