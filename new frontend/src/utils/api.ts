// src/utils/api.ts


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * TASKS API
 */
// export const getTasks = async () => {
//   const response = await fetch(`${BASE_URL}/tasks`);
//   if (!response.ok) throw new Error('Failed to fetch tasks');
//   return response.json();
// };

export interface Task {

  title: string;
  description: string;
  deadline: string;
  assignedTo: string;
  status: string;
  
}

export const getTasks = async () => {
  const response = await fetch(`${BASE_URL}/tasks`);
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return response.json();
};

export const getTaskById = async (id: string) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`);
  if (!response.ok) throw new Error('Failed to fetch task');
  return response.json();
};

export const createTask = async (task: Task) => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error('Failed to create task');
  return response.json();
};

export const updateTask = async (id: string, task: Partial<Task>) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error('Failed to update task');
  return response.json();
};

export const deleteTask = async (id: string) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete task');
  return response.json();
};

export const updateTaskStatus = async (id: string, status: string) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update task status');
  return response.json();
};

/**
 * USERS API
 */
export const getUsers = async () => {
  const response = await fetch(`${BASE_URL}/users`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

/**
 * TEAMS API
 */
export const getTeams = async () => {
  const response = await fetch(`${BASE_URL}/teams`);
  if (!response.ok) throw new Error('Failed to fetch teams');
  return response.json();
};

export interface Team {
  name: string;
  members?: string[];
  // Add other fields as needed
}

export const createTeam = async (team: Team) => {
  const response = await fetch(`${BASE_URL}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(team),
  });
  if (!response.ok) throw new Error('Failed to create team');
  return response.json();
};

export const updateTeam = async (id: string, team: Team) => {
  const response = await fetch(`${BASE_URL}/teams/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(team),
  });
  if (!response.ok) throw new Error('Failed to update team');
  return response.json();
};

export const deleteTeam = async (id: string) => {
  const response = await fetch(`${BASE_URL}/teams/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete team');
  return response.json();
};

/**
 * NOTIFICATION API
 */
export const notifyTeam = async (notificationData: {
  message: string;
  subject?: string;
  topicArn: string;
}) => {
  const response = await fetch(`${BASE_URL}/notify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notificationData),
  });
  if (!response.ok) throw new Error('Failed to send notification');
  return response.json();
};
