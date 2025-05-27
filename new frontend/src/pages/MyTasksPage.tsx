import { useEffect, useState } from 'react';

type Task = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
};

const MyTasksPage = ({ memberName }: { memberName: string }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchMemberTasks = async () => {
      const res = await fetch(`/api/tasks?assignee=${memberName}`);
      const data = await res.json();
      setTasks(data);
    };

    fetchMemberTasks();
  }, [memberName]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      {tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="p-4 bg-white shadow rounded">
              <h2 className="font-semibold">{task.title}</h2>
              <p>Status: {task.status}</p>
              <p>Created At: {new Date(task.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyTasksPage;
