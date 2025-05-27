import React, { useState } from 'react';

// ✅ Define props interface OUTSIDE the component
interface CreateTeamFormProps {
  onSubmit: (teamName: string, members: string[]) => void;
}

const CreateTeamForm: React.FC<CreateTeamFormProps> = ({ onSubmit }) => {
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState('');

  const addMember = () => {
    if (memberInput.trim() !== '') {
      setMembers([...members, memberInput.trim()]);
      setMemberInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    onSubmit(teamName.trim(), members);
    setTeamName('');
    setMembers([]);
    setMemberInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4 max-w-md">
      <h2 className="text-xl font-bold">Create Team</h2>

      <input
        type="text"
        placeholder="Team Name"
        className="w-full border p-2 rounded"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add Member"
          className="flex-1 border p-2 rounded"
          value={memberInput}
          onChange={(e) => setMemberInput(e.target.value)}
        />
        <button
          type="button"
          onClick={addMember}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <ul className="list-disc list-inside text-gray-700">
        {members.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Create Team
      </button>
    </form>
  );
};

export default CreateTeamForm;

