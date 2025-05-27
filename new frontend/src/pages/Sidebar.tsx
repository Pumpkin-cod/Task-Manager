// src/components/Sidebar.tsx
import React from 'react';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  role: 'admin' | 'member';
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, open, onClose }) => {
  const location = useLocation();

  const commonLinks = [
    { name: 'Home', to: '/', icon: <HomeIcon className="w-5 h-5" /> },
    {
      name: role === 'admin' ? 'All Tasks' : 'My Tasks',
      to: '/tasks',
      icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
    },
  ];

  const adminLinks = [
    { name: 'Teams', to: '/teams', icon: <UsersIcon className="w-5 h-5" /> },
  ];

  const links = role === 'admin' ? [...commonLinks, ...adminLinks] : commonLinks;

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold text-indigo-600">Task Manager</h2>
        <button onClick={onClose}>
          <XMarkIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-indigo-100 ${
              location.pathname === link.to
                ? 'bg-indigo-100 text-indigo-700 font-medium'
                : 'text-gray-700'
            }`}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
