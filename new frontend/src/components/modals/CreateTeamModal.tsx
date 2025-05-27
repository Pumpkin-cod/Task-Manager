import React from 'react';
import CreateTeamForm from '../forms/CreateTeamForm';


interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (teamName: string) => void;
  
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose, onCreateTeam }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <CreateTeamForm onSubmit={(teamName: string) => {
          onCreateTeam(teamName);
          onClose();
        }} />
      </div>
    </div>
  );
};

export default CreateTeamModal;

