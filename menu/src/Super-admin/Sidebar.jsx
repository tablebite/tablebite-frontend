import React, { useState, useEffect } from 'react';
import { GiForkKnifeSpoon } from 'react-icons/gi';
import { FiChevronDown } from 'react-icons/fi';  // Importing a down arrow icon

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
    key: 'menu',
    label: 'Menu',
    icon: (
      <GiForkKnifeSpoon className="w-5 h-5 text-black" />
    ),
    subMenu: [
      {
        key: 'viewMenu',
        label: 'View Menu',
      },
      {
        key: 'addMenu',
        label: 'Add Menu',
      },
    ]
  },
  // Add more items here
];

export default function Sidebar({
  isSideMenuOpen,
  toggleSideMenu,
  selectedMenu,
  setSelectedMenu,
}) {
  const [submenuOpen, setSubmenuOpen] = useState(null);

  const [selectionHighlight, setSelectionHighlight] = useState(null);

  // Set the initial selection highlight and submenu state from localStorage or default to 'dashboard'
  useEffect(() => {
    const savedMenu = window.localStorage.getItem('selectedMenu') || 'dashboard';
    const savedSubmenu = window.localStorage.getItem('submenuOpen');
    const savedSelectionHighlight = window.localStorage.getItem('selectionHighlight');

    setSelectedMenu(savedMenu);
    setSelectionHighlight(savedSelectionHighlight || savedMenu); // If nothing is stored, default to the menu
    setSubmenuOpen(savedSubmenu ? JSON.parse(savedSubmenu) : null); // Retrieve and parse the submenu state
  }, [setSelectedMenu]);

  const handleMenuClick = (key, subMenu) => {
    if (subMenu) {
      // If the menu has a submenu, toggle it
      const newSubmenuState = submenuOpen === key ? null : key;
      setSubmenuOpen(newSubmenuState); // Set submenu state
      window.localStorage.setItem('submenuOpen', JSON.stringify(newSubmenuState)); // Save submenu state
    } else {
      // If the menu does not have a submenu, directly select it
      setSelectedMenu(key);
      setSelectionHighlight(key);  // Set the highlighted selection
      window.localStorage.setItem('selectedMenu', key); // Save selected menu to localStorage
      window.localStorage.setItem('selectionHighlight', key); // Save the highlight state
      setSubmenuOpen(null); // Ensure submenu is closed when selecting a non-submenu item
    }
  };

  const handleSubmenuClick = (subKey, parentKey) => {
    // Highlight the parent menu (e.g., "Menu") when a submenu item is clicked
    setSelectedMenu(subKey);
    setSelectionHighlight(parentKey || subKey);  // Keep the parent menu highlighted
    window.localStorage.setItem('selectedMenu', subKey); // Save selected submenu to localStorage
    window.localStorage.setItem('selectionHighlight', parentKey || subKey); // Save highlight state
    // Don't close the submenu after selecting a submenu item, leave it open
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="z-20 hidden w-64  shadow-sm overflow-y-auto bg-white dark:bg-gray-800 md:block">
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
            Tablebite
          </a>
          <ul className="mt-6">
            {menuItems.map(({ key, label, icon, subMenu }) => (
              <li key={key} className="relative px-6 py-3">
                {selectionHighlight === key && (
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  />
                )}
                <button
                  onClick={() => handleMenuClick(key, subMenu)}
                  className={`flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
                    selectedMenu === key
                      ? 'text-gray-800 dark:text-gray-100'
                      : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  {icon}
                  <span className="ml-4">{label}</span>
                  {subMenu && (
                    <FiChevronDown
                      className={`ml-auto transition-transform duration-300 ${
                        submenuOpen === key ? 'transform rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Dropdown Menu with smooth animation */}
                {subMenu && submenuOpen === key && (
                  <ul
                    className="mt-2 pl-6 bg-gray-100 dark:bg-gray-700 rounded-md shadow-md overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                      maxHeight: submenuOpen === key ? '300px' : '0', // Control the height transition
                      opacity: submenuOpen === key ? '1' : '0', // Control the opacity
                    }}
                  >
                    {subMenu.map(({ key: subKey, label }) => (
                      <li key={subKey} className="relative px-6 py-3">
                        <button
                          onClick={() => handleSubmenuClick(subKey, key)}
                          className={`flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
                            selectedMenu === subKey || selectedMenu === key
                              ? 'text-gray-800 dark:text-gray-100'
                              : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                          }`}
                        >
                          <span className="ml-4">{label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-50" onClick={toggleSideMenu} />
      )}
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
            {menuItems.map(({ key, label, icon, subMenu }) => (
              <li key={key} className="relative px-6 py-3">
                {selectedMenu === key && (
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  />
                )}
                <button
                  onClick={() => handleMenuClick(key, subMenu)}
                  className={`flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
                    selectedMenu === key
                      ? 'text-gray-800 dark:text-gray-100'
                      : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  {icon}
                  <span className="ml-4">{label}</span>
                  {subMenu && (
                    <FiChevronDown
                      className={`ml-auto transition-transform duration-300 ${
                        submenuOpen === key ? 'transform rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Dropdown Menu with smooth animation */}
                {subMenu && submenuOpen === key && (
                  <ul
                    className="mt-2 pl-6 bg-gray-100 dark:bg-gray-100 rounded-sm overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                      maxHeight: submenuOpen === key ? '300px' : '0', // Control the height transition
                      opacity: submenuOpen === key ? '1' : '0', // Control the opacity
                    }}
                  >
                    {subMenu.map(({ key: subKey, label }) => (
                      <li key={subKey} className="relative px-6 py-3">
                        <button
                          onClick={() => {
                            handleSubmenuClick(subKey, key);
                            toggleSideMenu(); // Close mobile menu after selecting submenu
                          }}
                          className={`flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
                            selectedMenu === subKey || selectedMenu === key
                              ? 'text-gray-800 dark:text-gray-100'
                              : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                          }`}
                        >
                          <span className="ml-4">{label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
