
import { useState } from 'react';

export default function AdminApp() {
  const [section, setSection] = useState('Dashboard');

  const menu = [
    'Dashboard',
    'Users',
    'Games',
    'Matches',
    'Results',
    'Wallet Requests',
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <header className="border-b border-gray-800 p-5">
        <h1 className="text-2xl font-bold">
          Doodle<span className="text-cyan-400">X</span> Admin
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Tournament Management Panel
        </p>
      </header>

      <div className="flex flex-col gap-2 p-4 sm:flex-row">
        <aside className="flex gap-2 overflow-x-auto sm:w-56 sm:flex-col">
          {menu.map((item) => (
            <button
              key={item}
              onClick={() => setSection(item)}
              className={`shrink-0 rounded-lg px-4 py-3 text-left ${
                section === item
                  ? 'bg-cyan-500 text-black'
                  : 'bg-gray-900 text-gray-300'
              }`}
            >
              {item}
            </button>
          ))}
        </aside>

        <main className="min-w-0 flex-1 rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h2 className="text-xl font-bold">{section}</h2>
          <p className="mt-3 text-sm text-gray-400">
            {section === 'Dashboard'
              ? 'Welcome to DoodleX Admin Panel.'
              : `${section} management will appear here.`}
          </p>
        </main>
      </div>
    </div>
  );
}