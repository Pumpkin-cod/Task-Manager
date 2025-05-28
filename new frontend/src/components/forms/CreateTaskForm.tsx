// src/components/CreateTaskForm.tsx
import React, { useState } from 'react';

type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

interface Task {
  title: string;
  description: string;
  assignedTo: string;
  deadline: string;
  status: TaskStatus;
}

export interface CreateTaskFormProps {
  onClose: () => void;
  onCreate: (task: Task) => void | Promise<void>;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<TaskStatus>('Pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: Task = { title, description, assignedTo, deadline, status };
    onCreate(newTask);

    // Reset form
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setDeadline('');
    setStatus('Pending');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md max-w-xl w-full mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">Create New Task</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Description</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Assigned To</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          placeholder="Enter member name or ID"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Deadline</label>
        <input
          type="date"
          className="w-full border rounded px-3 py-2"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Status</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Task
      </button>
    </form>
  );
};

export default CreateTaskForm;
