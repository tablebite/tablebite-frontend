import React, { useState } from 'react';


function Charts() {
  const [dark, setDark] = useState(false);
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);
  const [isNotificationsMenuOpen, setNotificationsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isPagesMenuOpen, setPagesMenuOpen] = useState(false);

  const toggleSideMenu = () => setSideMenuOpen(!isSideMenuOpen);
  const closeSideMenu = () => setSideMenuOpen(false);

  const toggleNotificationsMenu = () => setNotificationsMenuOpen(!isNotificationsMenuOpen);
  const closeNotificationsMenu = () => setNotificationsMenuOpen(false);

  const toggleProfileMenu = () => setProfileMenuOpen(!isProfileMenuOpen);
  const closeProfileMenu = () => setProfileMenuOpen(false);

  const togglePagesMenu = () => setPagesMenuOpen(!isPagesMenuOpen);
  const toggleTheme = () => setDark(!dark);

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${isSideMenuOpen ? 'overflow-hidden' : ''}`}>
      {/* Desktop sidebar */}
      <aside className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0">
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
            Windmill
          </a>
          <ul className="mt-6">
            <li className="relative px-6 py-3">
              <a
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                href="index.html"
              >
                {/* Icon and text */}
              </a>
            </li>
            {/* Add more list items here */}
          </ul>
          {/* Button */}
          <div className="px-6 my-6">
            <button
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
            >
              Create account
              <span className="ml-2" aria-hidden="true">+</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-10 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center ${isSideMenuOpen ? '' : 'hidden'}`}
      >
        {/* Backdrop */}
      </div>
      <aside
        className={`fixed inset-y-0 z-20 flex-shrink-0 w-64 mt-16 overflow-y-auto bg-white dark:bg-gray-800 md:hidden ${isSideMenuOpen ? '' : 'hidden'}`}
        onClick={closeSideMenu}
        onKeyDown={(e) => e.key === 'Escape' && closeSideMenu()}
      >
        {/* Mobile Sidebar Content */}
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <header className="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
          <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
            {/* Mobile hamburger */}
            <button
              className="p-1 -ml-1 mr-5 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
              onClick={toggleSideMenu}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                {/* Hamburger icon path */}
              </svg>
            </button>

            {/* Search input */}
            <div className="flex justify-center flex-1 lg:mr-32">
              <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
                <div className="absolute inset-y-0 flex items-center pl-2">
                  <svg className="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    {/* Search icon path */}
                  </svg>
                </div>
                <input
                  className="w-full pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
                  type="text"
                  placeholder="Search for projects"
                  aria-label="Search"
                />
              </div>
            </div>

            {/* Theme toggler */}
            <li className="flex">
              <button
                className="rounded-md focus:outline-none focus:shadow-outline-purple"
                onClick={toggleTheme}
                aria-label="Toggle color mode"
              >
                {/* Theme toggle icon */}
              </button>
            </li>

            {/* Notifications menu */}
            <li className="relative">
              <button
                className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
                onClick={toggleNotificationsMenu}
                onKeyDown={(e) => e.key === 'Escape' && closeNotificationsMenu()}
                aria-label="Notifications"
                aria-haspopup="true"
              >
                {/* Notification icon */}
                <span
                  aria-hidden="true"
                  className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"
                ></span>
              </button>
              {isNotificationsMenuOpen && (
                <ul
                  className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:text-gray-300 dark:border-gray-700 dark:bg-gray-700"
                  aria-label="submenu"
                >
                  <li className="flex">
                    <a
                      className="inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                      href="#"
                    >
                      {/* Notifications items */}
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* Profile menu */}
            <li className="relative">
              <button
                className="align-middle rounded-full focus:shadow-outline-purple focus:outline-none"
                onClick={toggleProfileMenu}
                onKeyDown={(e) => e.key === 'Escape' && closeProfileMenu()}
                aria-label="Account"
                aria-haspopup="true"
              >
                <img
                  className="object-cover w-8 h-8 rounded-full"
                  src="https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=aa3a807e1bbdfd4364d1f449eaa96d82"
                  alt=""
                  aria-hidden="true"
                />
              </button>
              {isProfileMenuOpen && (
                <ul
                  className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700"
                  aria-label="submenu"
                >
                  {/* Profile menu items */}
                </ul>
              )}
            </li>
          </div>
        </header>

        {/* Main content */}
        <main className="h-full pb-16 overflow-y-auto">
          <div className="container px-6 mx-auto grid">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Charts</h2>
            {/* CTA */}
            <a
              className="flex items-center justify-between p-4 mb-8 text-sm font-semibold text-purple-100 bg-purple-600 rounded-lg shadow-md focus:outline-none focus:shadow-outline-purple"
              href="https://github.com/estevanmaito/windmill-dashboard"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  {/* GitHub icon path */}
                </svg>
                <span>Star this project on GitHub</span>
              </div>
              <span>View more &RightArrow;</span>
            </a>

            {/* Chart sections */}
            <div className="grid gap-6 mb-8 md:grid-cols-2">
              {/* Doughnut/Pie chart */}
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">Doughnut/Pie</h4>
                <canvas id="pie"></canvas>
                {/* Chart legend */}
              </div>

              {/* Lines chart */}
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">Lines</h4>
                <canvas id="line"></canvas>
                {/* Chart legend */}
              </div>

              {/* Bars chart */}
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">Bars</h4>
                <canvas id="bars"></canvas>
                {/* Chart legend */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Charts;
