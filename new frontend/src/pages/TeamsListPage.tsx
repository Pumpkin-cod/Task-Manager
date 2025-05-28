// src/pages/TeamsListPage.tsx
import { useEffect, useState } from 'react';
import type{ Team } from '../utils/api';
import { getTeams } from '../utils/api';

const TeamsListPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await getTeams();
        setTeams(data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Teams</h2>
      {loading ? (
        <p>Loading teams...</p>
      ) : (
        <ul className="space-y-3">
          {teams.map((team, index) => (
            <li key={index} className="border p-3 rounded shadow-sm">
              <h3 className="font-bold">{team.name}</h3>
              <p className="text-sm text-gray-600">
                Members: {team.members?.join(', ') || 'No members'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeamsListPage;
