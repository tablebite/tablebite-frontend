import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarSA from "./SidebarSA";
import { Icon } from '@iconify/react/dist/iconify.js';


const HomeSDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarSA isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-2">
          {/* Breadcrumb / Page Title */}
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-800 text-lg">Analytics</h2>
            <span className="text-sm text-gray-500"></span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search here"
                className="border border-gray-300 rounded-full pl-9 pr-3 py-1 text-sm focus:outline-none"
              />
              <Icon
                icon="ic:round-search"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-base"
              />
            </div>

            {/* Icons on the right */}
            <div className="flex items-center space-x-3">
              <button className="text-gray-700 hover:text-gray-900">
                <Icon icon="ic:outline-settings" className="text-xl" />
              </button>
              <button className="text-gray-700 hover:text-gray-900 relative">
                <Icon icon="ic:baseline-notifications-none" className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">11</span>
              </button>
              <button
                onClick={toggleSidebar}
                className="text-gray-700 hover:text-gray-900 md:hidden"
              >
                ☰
              </button>
            </div>
          </div>
        </header>

        {/* Nested Routes */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default HomeSDashboard;
