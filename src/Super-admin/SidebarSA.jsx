import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react/dist/iconify.js';


const SidebarSA = ({ isSidebarOpen, toggleSidebar }) => {
  const [currentPath, setCurrentPath] = useState(""); 
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const menuItems = [
    { label: "Add menu", path: "/dashboard/super-admin/add-menu", icon: "ic:round-restaurant-menu" },
    { label: "View menu", path: "/dashboard/super-admin/view-menus", icon: "ic:round-list-alt" },
    { label: "Add restaurant", path: "/dashboard/super-admin/add-restaurants", icon: "ic:round-add-business" },
    { label: "View restaurant", path: "/dashboard/super-admin/view-restaurants", icon: "ic:round-storefront" },
    { label: "Settings", path: "/dashboard/super-admin/settings", icon: "ic:round-settings" },
  ];
  
  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-md z-50 transform transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:static md:translate-x-0`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 flex items-center">
        {/* Logo */}
        <div className="flex items-center text-gray-800 font-bold text-lg space-x-2">
          <img
            src="/logo192.png"
            alt="Tablebite"
            className="h-8 w-auto"
          />
          <span>Tablebite</span>
        </div>
        <button
          className="text-gray-600 md:hidden ml-auto hover:text-gray-800"
          onClick={toggleSidebar}
        >
          ✖
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="mt-4 px-2 space-y-1">
        <h3 className="text-xs uppercase text-gray-500 font-semibold px-2">Dashboards</h3>
        {menuItems.map(({ label, path, icon }) => (
          <button
            key={path}
            onClick={() => {
              navigate(path);
              toggleSidebar();
            }}
            className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              currentPath === path
                ? "bg-gray-200 text-gray-900"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <span className="mr-3">
              <Icon icon={icon} className="text-xl" />
            </span>
            {label}
          </button>
        ))}

        {/* Example of another section */}
        <h3 className="text-xs uppercase text-gray-500 font-semibold px-2 mt-4">Pages</h3>
        <button className="flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
          <span className="mr-3">
            <Icon icon="ic:baseline-pageview" className="text-xl" />
          </span>
          Pages
        </button>
      </nav>
    </aside>
  );
};

export default SidebarSA;
