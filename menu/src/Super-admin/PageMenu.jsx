// src/components/PageMenu.jsx
import React from 'react';

const PageMenu = () => (
  <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
    <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
      Page Menu
    </h3>
    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
      <li>
        <a href="#dashboard" className="hover:underline">
          Dashboard
        </a>
      </li>
      <li>
        <a href="#reports" className="hover:underline">
          Reports
        </a>
      </li>
      <li>
        <a href="#settings" className="hover:underline">
          Settings
        </a>
      </li>
      {/* add more items here */}
    </ul>
  </div>
);

export default PageMenu;
