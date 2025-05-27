// controllers/teamController.ts
import * as teamService from '../services/teamService';
import { v4 as uuidv4 } from 'uuid';

export const createTeam = async (teamData: { name: string; members: string[] }) => {
  const { name, members } = teamData;

  if (!name || !Array.isArray(members)) {
    throw new Error('Team name and members array are required');
  }

  const newTeam = {
    id: uuidv4(),
    name,
    members,
  };

  await teamService.saveTeam(newTeam);

  return newTeam;
};

export const updateTeam = async (id: string, updates: Partial<{ name: string; members: string[] }>) => {
  if (!id) throw new Error('Team ID is required');

  // Optional: Validate updates content here if needed
  const updatedTeam = await teamService.updateTeam(id, updates);

  return updatedTeam;
};

export const getTeams = async () => {
  return await teamService.getTeams();
};

export const getTeamById = async (id: string) => {
  if (!id) throw new Error('Team ID is required');
  return await teamService.getTeamById(id);
};

// Optional: deleteTeam method if needed
export const deleteTeam = async (id: string) => {
  if (!id) throw new Error('Team ID is required');
  await teamService.deleteTeam(id);
  return { message: 'Team deleted successfully' };
};
