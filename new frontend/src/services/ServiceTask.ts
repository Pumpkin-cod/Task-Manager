import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/tasks`;

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed';
    deadline?: string;
    createdAt: string;
    updatedAt: string;
}

export const getTasks = async (): Promise<Task[]> => {
    const response = await axios.get<Task[]>(API_URL);
    return response.data;
};

export const getTaskById = async (id: string): Promise<Task> => {
    const response = await axios.get<Task>(`${API_URL}/${id}`);
    return response.data;
};

export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    const response = await axios.post<Task>(API_URL, task);
    return response.data;
};

export const updateTask = async (id: string, task: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Task> => {
    const response = await axios.put<Task>(`${API_URL}/${id}`, task);
    return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};
