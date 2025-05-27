// components/AssignTaskForm.tsx
import React, { useState } from 'react';

const AssignTaskForm = ({ teams }: { teams: string[] }) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [taskTitle, setTaskTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ taskTitle, selectedTeam });
    // TODO: Submit task assignment to backend or state
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4 max-w-md">
      <h2 className="text-xl font-bold">Assign Task</h2>
      <input
        type="text"
        placeholder="Task Title"
        className="w-full border p-2 rounded"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
      />
      <select
        className="w-full border p-2 rounded"
        value={selectedTeam}
        onChange={(e) => setSelectedTeam(e.target.value)}
      >
        <option value="">Select Team</option>
        {teams.map((team, i) => (
          <option key={i} value={team}>
            {team}
          </option>
        ))}
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Assign
      </button>
    </form>
  );
};

export default AssignTaskForm;
