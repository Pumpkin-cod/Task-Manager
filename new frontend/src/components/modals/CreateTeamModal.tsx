import React, { useState } from 'react';

interface TeamMember {
  email: string;
  name: string;
  role: string;
  teamID: string;
}

interface CreateTeamFormProps {
  isOpen: boolean;
  members: TeamMember[];
  onSubmit: (teamName: string, memberEmails: string[]) => void;
  onCancel: () => void;
  onClose: () => void; 
}

const CreateTeamForm: React.FC<CreateTeamFormProps> = ({ members, onSubmit, onCancel }) => {
  const [teamName, setTeamName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setSelectedMembers(selectedOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(teamName, selectedMembers);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Team Name</label>
        <input
          type="text"
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
          required
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Select Members</label>
        <select
          multiple
          value={selectedMembers}
          onChange={handleSelectChange}
          className="border p-2 w-full rounded h-32"
        >
          {members.map(member => (
            <option key={member.email} value={member.email}>
              {member.name} ({member.email})
            </option>
          ))}
        </select>
        <small className="text-gray-500">Hold Ctrl (Windows) or Cmd (Mac) to select multiple</small>
      </div>

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Create Team
        </button>
      </div>
    </form>
  );
};

export default CreateTeamForm;
