import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import CreateTaskForm from '../forms/CreateTaskForm';



interface Task {
  title: string;
  description: string;
  assignedTo: string; // User ID or email
  deadline: string; // ISO date string
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: string; // ISO date string
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: Task) => void;
}

// Removed duplicate Props type and TaskItem reference

const CreateTaskModal: React.FC<Props> = ({ isOpen, onClose, onCreateTask }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl z-50">
        <button onClick={onClose} className="absolute top-3 right-3">
          <X className="w-5 h-5" />
        </button>
        <Dialog.Title className="text-xl font-semibold mb-4">Create Task</Dialog.Title>
        <CreateTaskForm onCreate={(task: Partial<Task>) => {
          // Ensure all required Task fields are present
          const completeTask: Task = {
            title: task.title ?? '',
            description: task.description ?? '',
            assignedTo: task.assignedTo ?? '',
            deadline: task.deadline ?? '',
            status: task.status ?? 'Pending',
            createdAt: new Date().toISOString(),
          };
          onCreateTask(completeTask);
          onClose();
        }} />
      </div>
    </Dialog>
  );
};

export default CreateTaskModal;
