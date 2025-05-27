export interface Task {
    id: string;
    title: string;
    description?: string;
    assignedTo: string;
    deadline: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    updatedAt: string;
  }