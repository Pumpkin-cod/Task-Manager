// src/components/TaskList.tsx
import { useState } from 'react';
import type { FC } from 'react';
import { FaTrash, FaEdit, FaCheck, FaSave } from 'react-icons/fa';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: string;
  deadline: string;
  createdAt: string;
}

interface TaskListProps {
  currentUser: {
    email: string;
    role: string;
  };
  tasks: Task[];
  onDelete: (taskId: string) => void;
  onStatusUpdate: (taskId: string, updatedFields: Partial<Task>) => void;
}

const TaskList: FC<TaskListProps> = ({ tasks, onDelete, onStatusUpdate }) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedFields, setEditedFields] = useState<Partial<Task>>({});

  const handleEditClick = (task: Task) => {
    setEditingTaskId(task.id);
    setEditedFields({
      title: task.title,
      description: task.description,
    });
  };

  const handleSaveClick = (taskId: string) => {
    onStatusUpdate(taskId, editedFields);
    setEditingTaskId(null);
    setEditedFields({});
  };

  const handleInputChange = (field: keyof Task, value: string) => {
    setEditedFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusClick = (task: Task) => {
    const newStatus =
      task.status === 'pending'
        ? 'in-progress'
        : task.status === 'in-progress'
        ? 'completed'
        : 'pending';
    onStatusUpdate(task.id, { status: newStatus });
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (status.toLowerCase()) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'in-progress':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Task Management</h2>
      </div>

      {tasks.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-500">
          <p>No tasks available.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deadline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {editingTaskId === task.id ? (
                      <input
                        type="text"
                        className="border p-1 rounded w-full text-sm"
                        value={editedFields.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-900">{task.title}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 max-w-xs whitespace-normal break-words">
                    {editingTaskId === task.id ? (
                      <input
                        type="text"
                        className="border p-1 rounded w-full text-sm"
                        value={editedFields.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                      />
                    ) : (
                      <span className="text-sm text-gray-500" title={task.description}>
                        {task.description}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{task.assignedTo}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
  {editingTaskId === task.id ? (
    <select
      className="border rounded px-2 py-1 text-sm"
      value={editedFields.status}
      onChange={(e) => handleInputChange('status', e.target.value)}
    >
      <option value="Pending">Pending</option>
      <option value="In Progress">In Progress</option>
      <option value="Complete">Complete</option>
    </select>
  ) : (
    <span className={getStatusBadge(task.status)}>{task.status}</span>
  )}
</td>

                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusClick(task)}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Cycle Status"
                      >
                        <FaCheck size={14} />
                      </button>
                      {editingTaskId === task.id ? (
                        <button
                          onClick={() => handleSaveClick(task.id)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Save Task"
                        >
                          <FaSave size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditClick(task)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Edit Task"
                        >
                          <FaEdit size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(task.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete Task"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaskList;


