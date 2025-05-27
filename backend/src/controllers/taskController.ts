import * as taskService from '../services/taskService';
import { v4 as uuidv4 } from 'uuid';

// Create a new task
export const createTask = async (taskData: {
  title: string;
  description?: string;
  assignedTo: string;
  deadline: string;
  status?: string;
}) => {
  const { title, description, assignedTo, deadline, status } = taskData;

  if (!title || !assignedTo || !deadline) {
    throw new Error('Title, assignedTo, and deadline are required');
  }

  const newTask = {
    id: uuidv4(),
    title,
    description,
    assignedTo,
    deadline,
    status: status || 'Pending',
    updatedAt: new Date().toISOString(),
  };

  await taskService.saveTask(newTask);
  return newTask;
};

// Get all tasks (optionally filtered in service)
export const getTasks = async (assignedTo?: string) => {
  return await taskService.getTasks();
};

// Update task fields (e.g. title, status, etc.)
export const updateTask = async (id: string, updates: Partial<any>) => {
  if (!id) throw new Error('Task ID is required');
  return await taskService.updateTask(id, updates);
};

// Delete a task by ID
export const deleteTask = async (id: string) => {
  if (!id) throw new Error('Task ID is required');
  await taskService.deleteTask(id);
  return { message: 'Task deleted successfully' };
};

// Reassign task to a different user
export const assignTask = async (taskData: { id: string; assignedTo: string }) => {
  const { id, assignedTo } = taskData;

  if (!id || !assignedTo) {
    throw new Error('Task ID and assignedTo are required');
  }

  return await taskService.updateAssignedTo(id, assignedTo);
};
