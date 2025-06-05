import React, { useState, useEffect, useRef } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, PointElement, BarElement, LineElement } from 'chart.js';

// Register Chart.js elements
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, PointElement, BarElement, LineElement);

const Dashboard = () => {
  const [dark, setDark] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isPagesMenuOpen, setIsPagesMenuOpen] = useState(false);
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleTheme = () => setDark(!dark);
  const toggleSideMenu = () => setIsSideMenuOpen(!isSideMenuOpen);
  const togglePagesMenu = () => setIsPagesMenuOpen(!isPagesMenuOpen);
  const toggleNotificationsMenu = () => setIsNotificationsMenuOpen(!isNotificationsMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const pieData = {
    labels: ['Shirts', 'Shoes', 'Bags'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['#4C84FF', '#00C9A7', '#9B6FF6'],
      },
    ],
  };

  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Organic',
        data: [65, 59, 80, 81, 56],
        fill: false,
        borderColor: 'rgba(0, 201, 167, 1)',
      },
      {
        label: 'Paid',
        data: [45, 49, 60, 71, 46],
        fill: false,
        borderColor: 'rgba(155, 111, 246, 1)',
      },
    ],
  };

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${isSideMenuOpen ? 'overflow-hidden' : ''}`}>
      {/* Desktop Sidebar */}
      <aside className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0">
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
            Tablebite 
          </a>
          <ul className="mt-6">
            <li className="relative px-6 py-3">
              <span className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg" aria-hidden="true"></span>
              <a
                className="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100"
                href="index.html"
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
                <span className="ml-4">Dashboard</span>
              </a>
            </li>
          </ul>
          {/* Add other sidebar items here */}
            <ul className="mt-6">
            <li className="relative px-6 py-3">
              <span className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg" aria-hidden="true"></span>
              <a
                className="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100"
                href="index.html"
              >
<svg
  className="w-6 h-6"
  aria-hidden="true"
  fill="none"
  strokeLinecap="round"
  strokeLinejoin="round"
  strokeWidth="2"
  viewBox="0 0 24 24"
  stroke="currentColor"
>
  <path
    d="M2 19V5c0-.553.447-1 1-1h18c.553 0 1 .447 1 1v14c0 .553-.447 1-1 1H3c-.553 0-1-.447-1-1z"
  />
  <path
    d="M12 2v20"
  />
</svg>




                <span className="ml-4">Menu</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isSideMenuOpen && (
        <div
          className="fixed inset-0 z-10 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
          onClick={toggleSideMenu}
        ></div>
      )}
      <aside
        className="fixed inset-y-0 z-20 flex-shrink-0 w-64 mt-16 overflow-y-auto bg-white dark:bg-gray-800 md:hidden"
        style={{ transform: isSideMenuOpen ? 'translateX(0)' : 'translateX(-100%)' }}
        onClick={toggleSideMenu}
      >
        {/* Mobile menu content here */}
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full">
        <header className="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
          <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
            <button
              className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
              onClick={toggleSideMenu}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
        
           {/* Search input */}
             <div class="flex justify-center flex-1 lg:mr-32">
           <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
      <div className="absolute inset-y-0 flex items-center pl-2">
        <svg
          className="w-4 h-4"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          ></path>
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
            {/* Add Theme Toggler and Profile Menu */}
             <div className="flex items-center space-x-4">
      {/* Theme Toggle */}
     <button
      className="rounded-md focus:outline-none focus:shadow-outline-purple"
      onClick={toggleTheme}
      aria-label="Toggle color mode"
    >
      {!dark ? (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
          ></path>
        </svg>
      ) : (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          ></path>
        </svg>
      )}
    </button>

      {/* Notifications */}
     <button
                  class="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
                  aria-label="Notifications"
                  aria-haspopup="true"
                >
                  <svg
                    class="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
                    ></path>
                  </svg>
                  <span
                    aria-hidden="true"
                    class="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"
                  ></span>
                </button>

      {/* Profile */}
      <button className="p-2 rounded-md focus:outline-none">
        <img
          className="w-8 h-8 rounded-full"
          src="https://i.pravatar.cc/150?img=3"
          alt="Profile"
        />
      </button>
    
  </div>
          </div>
        </header>

        <main className="h-full overflow-y-auto">
          <div className="container px-6 mx-auto grid">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Dashboard</h2>

            {/* Cards */}
            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
              {/* Total Clients */}
              <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                  </svg>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Total clients</p>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">6389</p>
                </div>
              </div>

              {/* Account Balance */}
              <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Account balance</p>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">$46,760.89</p>
                </div>
              </div>

              {/* New Sales */}
              <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                  </svg>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">New sales</p>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">376</p>
                </div>
              </div>

              {/* Pending Contacts */}
              <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <div className="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full dark:text-teal-100 dark:bg-teal-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Pending contacts</p>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">35</p>
                </div>
              </div>
            </div>

            {/* Charts */}
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Charts</h2>
            <div className="grid gap-6 mb-8 md:grid-cols-2">
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">Revenue</h4>
                <Pie data={pieData} />
              </div>
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">Traffic</h4>
                <Line data={lineData} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
