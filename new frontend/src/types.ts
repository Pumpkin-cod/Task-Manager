// src/types.ts
export interface Task {
    id: string;
    title: string;
    description: string;
    assignedTo: string;
    status: 'Pending' | 'In Progress' | 'Complete';
    deadline: string;
    updatedAt?: string;
    createdAt: string; 

  }
export interface TeamMember {
    id: string;
    name: string;
    email: string;
}
export interface TaskItem {
    id: string;
    title: string;
    description: string;
    assignedTo: string;
    team: string;
    deadline: string;
    status: string;                               
    createdAt: string; 
    updatedAt: string; 
}

export interface AssignTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    teams: string[];
    onAssignTask: (assignedTask: TaskItem) => Promise<void>;
}

export interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateTask: (task: Task) => void;
}

export interface TaskFormProps {
    onCreate: (task: Task) => void;
    onCancel?: () => void;
    teamMembers?: TeamMember[];
    onEdit?: (updatedTask: Task) => Promise<void>;
    editingTask?: Task | null;
}

export interface TaskTableProps {
    tasks: Task[];
    onTasksUpdate: (updatedTasks: Task[]) => void; // to update parent state
}


