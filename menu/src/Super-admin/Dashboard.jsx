// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Menu from './Menu';
import AddMenuForm from './AddMenuForm';

export default function Dashboard() {
  const [dark, setDark] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  // Persist sidebar selection across reloads
  const [selectedMenu, setSelectedMenu] = useState(() => {
    return window.localStorage.getItem('dashboardSection') || 'dashboard';
  });

  useEffect(() => {
    window.localStorage.setItem('dashboardSection', selectedMenu);
  }, [selectedMenu]);

  // Persist the theme mode (dark or light) in localStorage and apply it when reloading the page
  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme') === 'dark';
    setDark(savedTheme);
  }, []);

  const toggleTheme = () => {
    setDark((prevDark) => {
      const newDarkMode = !prevDark;
      // Save the new theme mode to localStorage
      window.localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
      return newDarkMode;
    });
  };

  const toggleSideMenu = () => setIsSideMenuOpen((o) => !o);

  // Replace with your real restaurant ID
  const restaurantId = '000000000001';

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isSideMenuOpen={isSideMenuOpen}
          toggleSideMenu={toggleSideMenu}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />

        {/* Main content area */}
        <div className="flex flex-col flex-1 w-full">
          {/* Header */}
          <header className="z-10 py-4 bg-white shadow-sm dark:bg-gray-800">
            <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
              {/* Mobile hamburger */}
              <button
                className="p-1 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
                onClick={toggleSideMenu}
                aria-label="Open sidebar"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5h14M3 10h14M3 15h14" clipRule="evenodd" />
                </svg>
              </button>

              {/* Search input */}
              <div className="flex justify-center flex-1">
                {/* <div className="relative w-full max-w-xl">
                  <input
                    className="w-full pl-10 pr-4 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md h-10 dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none"
                    type="text"
                    placeholder="Search for projects…"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-600 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 
                          01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div> */}
              </div>

              {/* Right-side controls */}
              <div className="flex items-center space-x-4">
                {/* Theme toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-1 rounded-md focus:outline-none focus:shadow-outline-purple"
                  aria-label="Toggle dark mode"
                >
                  {!dark ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8 8 0 
                        1010.586 10.586z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 
                          0V3a1 1 0 011-1zm4 8a4 4 0 11-8 
                          0 4 4 0 018 0zM10 18a8 8 0 100-16 
                          8 8 0 000 16z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>

                {/* Notifications */}
                <button
                  className="relative p-1 rounded-md focus:outline-none focus:shadow-outline-purple"
                  aria-label="View notifications"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 
                      004 14h12a1 1 0 00.707-1.707L16 
                      11.586V8a6 6 0 00-6-6zM10 
                      18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full border-2 border-white dark:border-gray-800" />
                </button>

                {/* Profile menu */}
                <button
                  className="rounded-full focus:outline-none focus:shadow-outline-purple"
                  aria-label="User menu"
                >
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://i.pravatar.cc/150?img=7"
                    alt="User avatar"
                  />
                </button>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="h-full overflow-y-auto p-6">
            {selectedMenu === 'dashboard' && (
              <h1 className="text-xl text-gray-700 dark:text-gray-300">
                Dashboard coming soon...
              </h1>
            )}
            {selectedMenu === 'viewMenu' && (
              <Menu restaurantId={restaurantId} />
            )}

            {selectedMenu === 'addMenu' && (
              <AddMenuForm restaurantId={restaurantId} />
            )}
            {console.log({ selectedMenu })}
          </main>
        </div>
      </div>
    </div>
  );
}
