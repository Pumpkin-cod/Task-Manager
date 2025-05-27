import React from "react";

type HeaderProps = {
  user?: { email: string; role: "admin" | "member" } | null;
  onLogout?: () => void;
  onMenuClick?: () => void;
};

const Header: React.FC<HeaderProps> = ({ user, onLogout, onMenuClick }) => (
  <header className="flex justify-between items-center px-4 py-4 bg-white shadow-md fixed w-full z-50">
    <div className="flex items-center gap-4">
      <button
        className="bg-white rounded-full p-2 shadow hover:bg-blue-100 focus:outline-none"
        onClick={onMenuClick}
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6 text-blue-700"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 className="text-2xl font-bold text-blue-700">Task Management System</h1>
    </div>
    {user && (
      <div className="flex items-center gap-4">
        <span className="text-gray-700">
          {user.email} <span className="text-xs text-gray-500">({user.role})</span>
        </span>
        {onLogout && (
          <button
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            onClick={onLogout}
          >
            Logout
          </button>
        )}
      </div>
    )}
  </header>
);

export default Header;

