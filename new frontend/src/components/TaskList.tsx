import React, { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import api from "../services/api";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import type { Task } from "../types"; 

// type Task = {
//   id: string;
//   title: string;
//   description: string;
//   assignedTo: string;
//   status: string;
//   deadline: string;
//   updatedAt: string;
// };

type User = {
  email: string;
  role: "admin" | "member";
};

type TeamMember = {
  id: string;
  name: string;
  email: string;
};

interface TaskListProps {
  currentUser: User;
}

const TaskList: React.FC<TaskListProps> = ({ currentUser }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasksAndMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const [taskRes, memberRes] = await Promise.all([
        api.get<Task[]>("/tasks"),
        api.get<TeamMember[]>("/users"),
      ]);
      setTasks(taskRes.data);
      setTeamMembers(memberRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks or team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksAndMembers();
  }, []);

  const updateTaskStatus = async (taskId: string, status: string): Promise<void> => {
    try {
      await api.put("/tasks", { id: taskId, status });
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, status, updatedAt: new Date().toISOString().split("T")[0] }
            : task
        )
      );
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const createTask = async (task: Omit<Task, "id" | "updatedAt">): Promise<Task> => {
    const response = await api.post<Task>("/tasks", task);
    return response.data;
  };

  const handleCreateTask = async (task: {
    title: string;
    description: string;
    assignedTo: string;
    deadline: string;
    status: string;
  }) => {
    try {
      await createTask(task);
      await fetchTasksAndMembers();
      setShowCreate(false);
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  // --- NEW: Update task (PUT)
  const handleEditTask = async (updatedTask: Task) => {
    try {
      await api.put("/tasks", updatedTask);
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      setEditingTask(null);
    } catch (err) {
      console.error("Error editing task:", err);
    }
  };

  // --- NEW: Delete task (DELETE)
  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const filteredTasks =
    currentUser.role === "admin"
      ? tasks
      : tasks.filter((task) => task.assignedTo === currentUser.email);

  if (loading) return <div className="text-center mt-8">Loading tasks...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Task List</h2>

      {filteredTasks.length === 0 ? (
        <div className="text-gray-500 text-center">No tasks found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 text-left">Title</th>
                <th className="py-2 px-3 text-left">Description</th>
                <th className="py-2 px-3 text-left">Assigned To</th>
                <th className="py-2 px-3 text-left">Status</th>
                <th className="py-2 px-3 text-left">Deadline</th>
                <th className="py-2 px-3 text-left">Last Updated</th>
                {(currentUser.role === "member" || currentUser.role === "admin") && (
                  <th className="py-2 px-3 text-left">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className={
                    new Date(task.deadline) < new Date() && task.status !== "Completed"
                      ? "bg-red-100"
                      : ""
                  }
                >
                  <td className="py-2 px-3">
                    {editingTask?.id === task.id ? (
                      <input
                        type="text"
                        className="border rounded px-2 py-1 w-full"
                        defaultValue={task.title}
                        onChange={(e) =>
                          setEditingTask((prev) =>
                            prev ? { ...prev, title: e.target.value } : prev
                          )
                        }
                      />
                    ) : (
                      task.title
                    )}
                  </td>
                  <td className="py-2 px-3">
                    {editingTask?.id === task.id ? (
                      <textarea
                        className="border rounded px-2 py-1 w-full"
                        defaultValue={task.description}
                        onChange={(e) =>
                          setEditingTask((prev) =>
                            prev ? { ...prev, description: e.target.value } : prev
                          )
                        }
                      />
                    ) : (
                      task.description
                    )}
                  </td>
                  <td className="py-2 px-3">
                    {editingTask?.id === task.id ? (
                      <select
                        className="border rounded px-2 py-1 w-full"
                        value={editingTask.assignedTo}
                        onChange={(e) =>
                          setEditingTask((prev) =>
                            prev ? { ...prev, assignedTo: e.target.value } : prev
                          )
                        }
                      >
                        {teamMembers.map((member) => (
                          <option key={member.email} value={member.email}>
                            {member.name} ({member.email})
                          </option>
                        ))}
                      </select>
                    ) : (
                      teamMembers.find((m) => m.email === task.assignedTo)?.name || task.assignedTo
                    )}
                  </td>
                  <td className="py-2 px-3">
                    {editingTask?.id === task.id ? (
                      <select
                        className="border rounded px-2 py-1 w-full"
                        value={editingTask.status}
                        onChange={(e) =>
                          setEditingTask((prev) =>
                            prev ? { ...prev, status: e.target.value } : prev
                          )
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    ) : (
                      task.status
                    )}
                  </td>
                  <td className="py-2 px-3">
                    {editingTask?.id === task.id ? (
                      <input
                        type="date"
                        className="border rounded px-2 py-1 w-full"
                        value={editingTask.deadline}
                        onChange={(e) =>
                          setEditingTask((prev) =>
                            prev ? { ...prev, deadline: e.target.value } : prev
                          )
                        }
                      />
                    ) : (
                      task.deadline
                    )}
                  </td>
                  <td className="py-2 px-3">{task.updatedAt}</td>
                  <td className="py-2 px-3 space-x-2">
                    {currentUser.role === "member" && (
                      <select
                        className="border rounded px-2 py-1"
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                        disabled={task.status === "Completed"}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    )}

                    {currentUser.role === "admin" && (
                      <>
                        {editingTask?.id === task.id ? (
                          <>
                            <button
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                              onClick={() => editingTask && handleEditTask(editingTask)}
                            >
                              Save
                            </button>
                            <button
                              className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 ml-2"
                              onClick={() => setEditingTask(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit Task"
                              onClick={() => setEditingTask(task)}
                            >
                              <PencilSquareIcon className="h-5 w-5 inline" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 ml-4"
                              title="Delete Task"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <TrashIcon className="h-5 w-5 inline" />
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {currentUser.role === "admin" && !editingTask && (
        <div className="mt-6 flex justify-center">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowCreate(true)}
          >
            + Create & Assign Task
          </button>
        </div>
      )}

      {(showCreate || editingTask) && (
        <TaskForm
          onCreate={handleCreateTask}
          onCancel={() => {
            setShowCreate(false);
            setEditingTask(null);
          }}
          teamMembers={teamMembers}
          editingTask={editingTask} // pass if needed to prefill form
          onEdit={handleEditTask} // optional for TaskForm edit mode
        />
      )}
    </div>
  );
};

export default TaskList;
