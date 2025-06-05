import React, { useState } from 'react';

const FormsPage = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleSideMenu = () => setIsSideMenuOpen(!isSideMenuOpen);
  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleNotificationsMenu = () => setIsNotificationsMenuOpen(!isNotificationsMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`} style={{ overflow: isSideMenuOpen ? 'hidden' : 'auto' }}>
      {/* Desktop sidebar */}
      <aside className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0">
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
            Windmill
          </a>
          <ul className="mt-6">
            <li className="relative px-6 py-3">
              <a className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="index.html">
                <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span className="ml-4">Dashboard</span>
              </a>
            </li>
          </ul>
          {/* Other sidebar items */}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-10 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"></div>
      )}

      <aside
        className={`fixed inset-y-0 z-20 flex-shrink-0 w-64 mt-16 overflow-y-auto bg-white ${darkMode ? 'dark:bg-gray-800' : 'dark:bg-gray-800'} md:hidden`}
        style={{ transform: isSideMenuOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.3s ease-in-out' }}
      >
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
            Windmill
          </a>
          <ul className="mt-6">
            <li className="relative px-6 py-3">
              <a className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="index.html">
                <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span className="ml-4">Dashboard</span>
              </a>
            </li>
            {/* Other sidebar items */}
          </ul>
        </div>
      </aside>

      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
          <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
            {/* Mobile hamburger */}
            <button className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple" onClick={toggleSideMenu} aria-label="Menu">
              <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
              </svg>
            </button>

            {/* Search input */}
            <div className="flex justify-center flex-1 lg:mr-32">
              <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
                <div className="absolute inset-y-0 flex items-center pl-2">
                  <svg className="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <input className="w-full pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input" type="text" placeholder="Search for projects" aria-label="Search" />
              </div>
            </div>
            {/* Notification and profile menus */}
          </div>
        </header>

        <main className="h-full pb-16 overflow-y-auto">
          <div className="container px-6 mx-auto grid">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Forms</h2>

            {/* CTA */}
            <a className="flex items-center justify-between p-4 mb-8 text-sm font-semibold text-purple-100 bg-purple-600 rounded-lg shadow-md focus:outline-none focus:shadow-outline-purple" href="https://github.com/estevanmaito/windmill-dashboard">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span>Star this project on GitHub</span>
              </div>
              <span>View more &RightArrow;</span>
            </a>

            {/* Form elements */}
            <h4 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">Elements</h4>
            <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
              {/* Name input */}
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400">Name</span>
                <input className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input" placeholder="Jane Doe" />
              </label>

              {/* Account Type Radio Buttons */}
              <div className="mt-4 text-sm">
                <span className="text-gray-700 dark:text-gray-400">Account Type</span>
                <div className="mt-2">
                  <label className="inline-flex items-center text-gray-600 dark:text-gray-400">
                    <input type="radio" className="text-purple-600 form-radio focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray" name="accountType" value="personal" />
                    <span className="ml-2">Personal</span>
                  </label>
                  <label className="inline-flex items-center ml-6 text-gray-600 dark:text-gray-400">
                    <input type="radio" className="text-purple-600 form-radio focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray" name="accountType" value="busines" />
                    <span className="ml-2">Business</span>
                  </label>
                </div>
              </div>

              {/* Requested Limit */}
              <label className="block mt-4 text-sm">
                <span className="text-gray-700 dark:text-gray-400">Requested Limit</span>
                <select className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray">
                  <option>$1,000</option>
                  <option>$5,000</option>
                  <option>$10,000</option>
                  <option>$25,000</option>
                </select>
              </label>

              {/* Multiselect */}
              <label className="block mt-4 text-sm">
                <span className="text-gray-700 dark:text-gray-400">Multiselect</span>
                <select className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-multiselect focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray" multiple>
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                  <option>Option 4</option>
                  <option>Option 5</option>
                </select>
              </label>

              {/* Message */}
              <label className="block mt-4 text-sm">
                <span className="text-gray-700 dark:text-gray-400">Message</span>
                <textarea className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-textarea focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray" rows="3" placeholder="Enter some long form content."></textarea>
              </label>

              {/* Checkbox */}
              <div className="flex mt-6 text-sm">
                <label className="flex items-center dark:text-gray-400">
                  <input type="checkbox" className="text-purple-600 form-checkbox focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray" />
                  <span className="ml-2">
                    I agree to the
                    <span className="underline">privacy policy</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Validation inputs */}
            <h4 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">Validation</h4>
            <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
              {/* Invalid input */}
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400">Invalid input</span>
                <input className="block w-full mt-1 text-sm border-red-600 dark:text-gray-300 dark:bg-gray-700 focus:border-red-400 focus:outline-none focus:shadow-outline-red form-input" placeholder="Jane Doe" />
                <span className="text-xs text-red-600 dark:text-red-400">Your password is too short.</span>
              </label>

              {/* Valid input */}
              <label className="block mt-4 text-sm">
                <span className="text-gray-700 dark:text-gray-400">Valid input</span>
                <input className="block w-full mt-1 text-sm border-green-600 dark:text-gray-300 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green form-input" placeholder="Jane Doe" />
                <span className="text-xs text-green-600 dark:text-green-400">Your password is strong.</span>
              </label>

              {/* Helper text */}
              <label className="block mt-4 text-sm">
                <span className="text-gray-700 dark:text-gray-400">Helper text</span>
                <input className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input" placeholder="Jane Doe" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Your password must be at least 6 characters long.</span>
              </label>
            </div>

            {/* Inputs with icons */}
            <h4 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">Icons</h4>
            <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400">Icon left</span>
                <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                  <input className="block w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input" placeholder="Jane Doe" />
                  <div className="absolute inset-y-0 flex items-center ml-3 pointer-events-none">
                    <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
              </label>

              <label className="block mt-4 text-sm">
                <span className="text-gray-700 dark:text-gray-400">Icon right</span>
                <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                  <input className="block w-full pr-10 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input" placeholder="Jane Doe" />
                  <div className="absolute inset-y-0 right-0 flex items-center mr-3 pointer-events-none">
                    <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
              </label>
            </div>

            {/* Inputs with buttons */}
            <h4 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">Buttons</h4>
            <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400">Button left</span>
                <div className="relative">
                  <input className="block w-full pl-20 mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input" placeholder="Jane Doe" />
                  <button className="absolute inset-y-0 px-4 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-l-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray">
                    Click
                  </button>
                </div>
              </label>

              <label className="block mt-4 text-sm">
                <span className="text-gray-700 dark:text-gray-400">Button right</span>
                <div className="relative text-gray-500 focus-within:text-purple-600">
                  <input className="block w-full pr-20 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input" placeholder="Jane Doe" />
                  <button className="absolute inset-y-0 right-0 px-4 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-r-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                    Click
                  </button>
                </div>
              </label>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FormsPage;
