// src/components/Sidebar.jsx
import React from 'react';

const menuItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10h14V10" />
      </svg>
    )
  },
  {
    key: 'tables',
    label: 'Tables',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    )
  },
  // …add more items here…
];

export default function Sidebar({
  isSideMenuOpen,
  toggleSideMenu,
  selectedMenu,
  setSelectedMenu,
}) {
  return (
    <>
      {/* Desktop */}
      <aside className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block">
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
            Tablebite
          </a>
          <ul className="mt-6">
            {menuItems.map(({ key, label, icon }) => (
              <li key={key} className="relative px-6 py-3">
                {selectedMenu === key && (
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  />
                )}
                <button
                  onClick={() => setSelectedMenu(key)}
                  className={`flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
                    selectedMenu === key
                      ? 'text-gray-800 dark:text-gray-100'
                      : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  {icon}
                  <span className="ml-4">{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-50" onClick={toggleSideMenu} />
      )}
      {/* Mobile */}
      <aside
        className={`fixed inset-y-0 z-20 w-64 mt-16 overflow-y-auto bg-white dark:bg-gray-800 md:hidden transform ${
          isSideMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200`}
      >
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
            Tablebite
          </a>
          <ul className="mt-6">
            {menuItems.map(({ key, label, icon }) => (
              <li key={key} className="relative px-6 py-3">
                {selectedMenu === key && (
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  />
                )}
                <button
                  onClick={() => {
                    setSelectedMenu(key);
                    toggleSideMenu();
                  }}
                  className={`flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
                    selectedMenu === key
                      ? 'text-gray-800 dark:text-gray-100'
                      : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  {icon}
                  <span className="ml-4">{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
