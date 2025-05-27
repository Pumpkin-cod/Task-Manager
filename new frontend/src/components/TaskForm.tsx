import React, { useState } from "react";
import type { Task } from "../types"; // <-- Import the shared Task type

// Define a type for a user/team member
interface TeamMember {
  id: string;
  name: string;
  email: string;
}

// Define a type for a Task
// interface Task {
//   title: string;
//   description: string;
//   assignedTo: string;
//   deadline: string;
//   status: string;
// }

type TaskFormProps = {
  onCreate: (task: {
    title: string;
    description: string;
    assignedTo: string;
    deadline: string;
    status: string;
  }) => void;
  onCancel?: () => void;
  teamMembers?: TeamMember[];
  onEdit?: (updatedTask: Task) => Promise<void>;
  editingTask?: Task | null;
};

const TaskForm: React.FC<TaskFormProps> = ({ onCreate, onCancel, teamMembers = [] }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("Pending");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !assignedTo || !deadline) return;
    onCreate({ title, description, assignedTo, deadline, status });
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setDeadline("");
    setStatus("Pending");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded p-6 shadow max-w-lg mx-auto"
    >
      <h3 className="text-lg font-semibold mb-4">Create & Assign Task</h3>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Title:</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Description:</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Assign To:</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={assignedTo}
          onChange={e => setAssignedTo(e.target.value)}
          required
        >
          <option value="">Select team member</option>
          {teamMembers.map((member) => (
            <option key={member.id} value={member.email}>
              {member.name} ({member.email})
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Deadline:</label>
        <input
          type="date"
          className="w-full border rounded px-3 py-2"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Status:</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div className="flex gap-2 mt-4">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Create
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
