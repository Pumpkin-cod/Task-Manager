// src/pages/AllTasksPage.tsx
import { useEffect, useState } from 'react';
import { getTasks } from '../utils/api';
import type { Task } from '../utils/api';

const AllTasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Tasks</h2>
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.title} className="border p-3 rounded shadow-sm">
              <h3 className="font-bold">{task.title}</h3>
              <p>{task.description}</p>
              <p className="text-sm text-gray-600">
                Due: {task.deadline || 'N/A'} | Assigned to: {task.assignedTo || 'Unassigned'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllTasksPage;
