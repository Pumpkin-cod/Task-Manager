import React, { useEffect, useState } from 'react';
import CreateTaskModal from '../components/modals/CreateTaskModal';
import CreateTeamModal from '../components/modals/CreateTeamModal';
import AssignTaskModal from '../components/modals/AssignTaskModal';
/* import NotifyMemberModal from '../components/modals/NotifyMemberModal'; */

const sidebarNav = [
  { label: 'Home', icon: '🏠' },
  { label: 'My Tasks', icon: '🗒️' },
  { label: 'Inbox', icon: '📥' },
];

const createMenuItems = [
  { label: 'Task', icon: '📝' },
  { label: 'Team', icon: '👥' },
  { label: 'Assign Task', icon: '📌' },
  { label: 'Notify Member', icon: '📣' },
];

type TaskItem = {
  id: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: string;
};

type DashboardProps = {
  role: 'admin' | 'member';
  memberName?: string;
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
  children?: React.ReactNode;
};

const Dashboard: React.FC<DashboardProps> = ({
  role,
  memberName,
  sidebarOpen,
  onCloseSidebar,
}) => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  // const [showNotifyModal, setShowNotifyModal] = useState(false);

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>('');

  useEffect(() => {
    if (role === 'admin') {
      fetch('/api/tasks')
        .then((res) => res.json())
        .then(setTasks)
        .catch(() => setTasks([]));

      fetch('/api/teams')
        .then((res) => res.json())
        .then(setTeams)
        .catch(() => setTeams([]));
    }
  }, [role]);

  const handleMenuClick = (label: string) => {
    setShowCreateMenu(false);
    switch (label) {
      case 'Task':
        setShowTaskModal(true);
        break;
      case 'Team':
        setShowTeamModal(true);
        break;
      case 'Assign Task':
        setShowAssignModal(true);
        break;
      case 'Notify Member':
        // setShowNotifyModal(true);
        break;
    }
  };

  const handleCreateTask = async (task: Omit<TaskItem, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      const newTask = await res.json();
      setTasks((prev) => [newTask, ...prev]);
    } catch {
      alert('Failed to create task');
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch {
      alert('Failed to delete task');
    }
  };

  const handleStatusChange = async (id: number, newStatus: TaskItem['status']) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
      );
    } catch {
      alert('Failed to update status');
    }
  };

  const handleSaveEdit = async (id: number) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editedTitle }),
      });
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, title: editedTitle } : task))
      );
      setEditingTaskId(null);
      setEditedTitle('');
    } catch {
      alert('Failed to save task edit');
    }
  };

  const stats = [
    { label: 'Total Tasks', value: tasks.length },
    { label: 'Completed', value: tasks.filter((t) => t.status === 'Completed').length },
    { label: 'Pending', value: tasks.filter((t) => t.status === 'Pending').length },
    { label: 'In Progress', value: tasks.filter((t) => t.status === 'In Progress').length },
  ];

  return (
    <div className="relative min-h-screen flex bg-gray-50 pt-[72px]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={onCloseSidebar}
        />
      )}

      <aside
        className={`fixed top-[72px] left-0 h-[calc(100%-72px)] w-64 bg-white shadow-lg z-40 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex-1 flex flex-col pt-6">
          {role === 'admin' && (
            <div className="px-4 mb-2 relative">
              <button
                className="w-full flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setShowCreateMenu((prev) => !prev)}
              >
                <span className="text-xl font-bold">+</span>
                <span>Create</span>
              </button>
              {showCreateMenu && (
                <div className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-lg z-40 border">
                  <ul>
                    {createMenuItems.map((item) => (
                      <li
                        key={item.label}
                        className="flex items-center gap-2 py-3 px-5 hover:bg-blue-50 cursor-pointer"
                        onClick={() => handleMenuClick(item.label)}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <nav className="flex-1 py-2">
            <ul>
              {sidebarNav.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-blue-100 cursor-pointer"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-6 md:ml-64 w-full max-w-5xl mx-auto">
        <header>
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-gray-600">
            Welcome {role === 'admin' ? 'Admin' : memberName || 'Member'}
          </p>
        </header>

        {role === 'admin' ? (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {stats.map((s) => (
                <div key={s.label} className="bg-white p-4 rounded shadow text-center">
                  <div className="text-xl font-bold">{s.value}</div>
                  <div className="text-gray-500">{s.label}</div>
                </div>
              ))}
            </section>

            <section className="bg-white shadow rounded-lg p-4 mt-6">
              <h2 className="text-lg font-semibold mb-4">Recent Tasks</h2>
              {tasks.length === 0 ? (
                <p className="text-gray-500">No tasks yet.</p>
              ) : (
                <table className="w-full table-auto text-sm text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Created At</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => {
                      const isEditing = editingTaskId === task.id;
                      return (
                        <tr key={task.id} className="border-b">
                          <td className="py-3 px-4">
                            {isEditing ? (
                              <input
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(task.id)}
                                className="border px-2 py-1 rounded w-full"
                                autoFocus
                              />
                            ) : (
                              task.title
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              className="border rounded px-2 py-1"
                              value={task.status}
                              onChange={(e) =>
                                handleStatusChange(task.id, e.target.value as TaskItem['status'])
                              }
                            >
                              <option value="Pending">⏳ Pending</option>
                              <option value="In Progress">🚧 In Progress</option>
                              <option value="Completed">✅ Completed</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-gray-500">
                            {new Date(task.createdAt).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 space-x-2">
                            {isEditing ? (
                              <button
                                className="text-green-600"
                                onClick={() => handleSaveEdit(task.id)}
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                className="text-blue-600"
                                onClick={() => {
                                  setEditingTaskId(task.id);
                                  setEditedTitle(task.title);
                                }}
                              >
                                Edit
                              </button>
                            )}
                            <button
                              className="text-red-600"
                              onClick={() =>
                                confirm('Delete this task?') && handleDeleteTask(task.id)
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </section>
          </>
        ) : (
          <section className="mt-10 text-center text-gray-600">
            <p>Go to <strong>My Tasks</strong> to view your assigned work.</p>
          </section>
        )}
      </main>

      {/* Modals */}
      <CreateTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onCreateTask={handleCreateTask}
      />
      <CreateTeamModal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        onCreateTeam={async (name) => {
          try {
            const res = await fetch('/api/teams', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, members: [] }),
            });
            const data = await res.json();
            setTeams((prev) => [...prev, data.name]);
          } catch {
            alert('Failed to create team.');
          }
        }}
      />
      <AssignTaskModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        teams={teams}
        onAssignTask={async (assignedTask) => {
          // You can implement your logic here, for now just add to tasks
          setTasks((prev) => [
            {
              id: Date.now(), // generate a numeric id
              title: assignedTask.title,
              description: assignedTask.description,
              status: assignedTask.status as TaskItem['status'],
              createdAt: new Date().toISOString(),
            },
            ...prev,
          ]);
        }}
      />
      {/* <NotifyMemberModal
        isOpen={showNotifyModal}
        onClose={() => setShowNotifyModal(false)}
      /> */}
    </div>
  );
};

export default Dashboard;
