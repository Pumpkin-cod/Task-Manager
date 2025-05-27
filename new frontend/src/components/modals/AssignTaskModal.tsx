import React from 'react';


// TaskItem type definition
interface TaskItem {
  description: string;
  id: string;
  title: string;
  team: string;
  assignedTo: string;
  dueDate: string;
  status: string;
}

interface AssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: string[];
  onAssignTask: (assignedTask: TaskItem) => Promise<void>;
}

const AssignTaskModal: React.FC<AssignTaskModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  // Minimal placeholder modal for demonstration
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg min-w-[300px]">
        <h2 className="text-lg font-bold mb-4">Assign Task</h2>
        {/* Add your form fields here */}
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AssignTaskModal;
