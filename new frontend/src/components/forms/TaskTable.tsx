import React, { useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import api from "../../services/api";

interface Task {
  id: string; // assume you have ID to identify tasks
  title: string;
  description: string;
  assignedTo: string;
  deadline: string;
  status: "Pending" | "In Progress" | "Completed";
  createdAt: string;
}

interface TaskTableProps {
  tasks: Task[];
  onTasksUpdate: (updatedTasks: Task[]) => void; // to update parent state
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onTasksUpdate }) => {
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Task>>({});

  const handleEditClick = (task: Task) => {
    setEditTaskId(task.id);
    setEditFormData(task);
  };

  const handleCancelClick = () => {
    setEditTaskId(null);
    setEditFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async () => {
    if (!editTaskId) return;
    try {
      const updatedTask = { ...editFormData, id: editTaskId } as Task;
      await api.put(`/tasks/${editTaskId}`, updatedTask);
      const newTasks = tasks.map((task) =>
        task.id === editTaskId ? updatedTask : task
      );
      onTasksUpdate(newTasks);
      setEditTaskId(null);
      setEditFormData({});
    } catch (err) {
      console.error("Failed to save task", err);
    }
  };

  const handleDeleteClick = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      onTasksUpdate(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-3 text-left">Title</th>
            <th className="py-2 px-3 text-left">Description</th>
            <th className="py-2 px-3 text-left">Assigned To</th>
            <th className="py-2 px-3 text-left">Status</th>
            <th className="py-2 px-3 text-left">Deadline</th>
            <th className="py-2 px-3 text-left">Created At</th>
            <th className="py-2 px-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const isEditing = editTaskId === task.id;

            return (
              <tr key={task.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3">
                  {isEditing ? (
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title ?? ""}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    task.title
                  )}
                </td>
                <td className="py-2 px-3">
                  {isEditing ? (
                    <input
                      type="text"
                      name="description"
                      value={editFormData.description ?? ""}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    task.description
                  )}
                </td>
                <td className="py-2 px-3">
                  {isEditing ? (
                    <input
                      type="email"
                      name="assignedTo"
                      value={editFormData.assignedTo ?? ""}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    task.assignedTo
                  )}
                </td>
                <td className="py-2 px-3">
                  {isEditing ? (
                    <select
                      name="status"
                      value={editFormData.status ?? "Pending"}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1"
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
                  {isEditing ? (
                    <input
                      type="date"
                      name="deadline"
                      value={editFormData.deadline?.split("T")[0] ?? ""}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    new Date(task.deadline).toLocaleDateString()
                  )}
                </td>
                <td className="py-2 px-3">
                  {new Date(task.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-3 flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveClick}
                        title="Save"
                        className="text-green-600 hover:text-green-800"
                      >
                        <CheckIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleCancelClick}
                        title="Cancel"
                        className="text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(task)}
                        title="Edit"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(task.id)}
                        title="Delete"
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
