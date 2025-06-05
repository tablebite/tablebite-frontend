import React, { useState } from 'react';

const ModalsPage = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSideMenu = () => setIsSideMenuOpen(!isSideMenuOpen);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`} style={{ overflow: isSideMenuOpen ? 'hidden' : 'auto' }}>
      {/* Desktop sidebar */}
      <aside className="z-20 flex-shrink-0 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block">
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
            Windmill
          </a>
          <ul className="mt-6">
            {/* Add sidebar links here */}
          </ul>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-10 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"></div>
      )}

      <aside className={`fixed inset-y-0 z-20 flex-shrink-0 w-64 mt-16 overflow-y-auto bg-white ${darkMode ? 'dark:bg-gray-800' : 'dark:bg-gray-800'} md:hidden`} 
        style={{ transform: isSideMenuOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.3s ease-in-out' }}>
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
            Windmill
          </a>
          <ul className="mt-6">
            {/* Add mobile sidebar links here */}
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1">
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
                <input className="w-full pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input" 
                  type="text" placeholder="Search for projects" aria-label="Search" />
              </div>
            </div>
          </div>
        </header>

        <main className="h-full pb-16 overflow-y-auto">
          <div className="container grid px-6 mx-auto">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Modals</h2>

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

            <div className="max-w-2xl px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                This is possibly <strong>the most accessible a modal can get</strong>, using JavaScript. When opened, it uses <code>assets/js/focus-trap.js</code> to create a <em>focus trap</em>, which means that if you use your keyboard to navigate around, focus won't leak to the elements behind, staying inside the modal in a loop, until you take any action.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Also, on small screens it is placed at the bottom of the screen, to account for larger devices and make it easier to click the larger buttons.
              </p>
            </div>

            <div>
              <button
                onClick={toggleModal}
                className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              >
                Open Modal
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Modal backdrop */}
      {isModalOpen && (
        <div className="fixed inset-0 z-30 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center">
          {/* Modal */}
          <div className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl" role="dialog" id="modal">
            <header className="flex justify-end">
              <button
                className="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover:text-gray-700"
                aria-label="close"
                onClick={toggleModal}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                </svg>
              </button>
            </header>

            <div className="mt-4 mb-6">
              <p className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">Modal header</p>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum et eligendi repudiandae voluptatem tempore!
              </p>
            </div>

            <footer className="flex flex-col items-center justify-end px-6 py-3 -mx-6 -mb-4 space-y-4 sm:space-y-0 sm:space-x-6 sm:flex-row bg-gray-50 dark:bg-gray-800">
              <button
                onClick={toggleModal}
                className="w-full px-5 py-3 text-sm font-medium leading-5 text-white text-gray-700 transition-colors duration-150 border border-gray-300 rounded-lg dark:text-gray-400 sm:px-4 sm:py-2 sm:w-auto active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:outline-none focus:shadow-outline-gray"
              >
                Cancel
              </button>
              <button
                onClick={toggleModal}
                className="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              >
                Accept
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalsPage;
