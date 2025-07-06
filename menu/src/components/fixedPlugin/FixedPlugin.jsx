// src/components/FixedPlugin.jsx
import React, { useEffect, useState } from "react";
import { RiMoonFill, RiSunFill } from "react-icons/ri";

export default function FixedPlugin(props) {
  const { ...rest } = props;

  // Initialize from localStorage (fallback to body class)
  const [darkmode, setDarkmode] = useState(() => {
    const stored = localStorage.getItem("darkmode");
    if (stored !== null) return stored === "true";
    return document.body.classList.contains("dark");
  });

  // Sync changes to localStorage
  useEffect(() => {
    localStorage.setItem("darkmode", darkmode);
  }, [darkmode]);

  // Toggle both body class and state
  const toggleDark = () => {
    if (darkmode) {
      document.body.classList.remove("dark");
      setDarkmode(false);
    } else {
      document.body.classList.add("dark");
      setDarkmode(true);
    }
  };

  return (
    <button
      className="border-px fixed bottom-[30px] right-[35px] !z-[99] flex h-[60px] w-[60px] items-center justify-center rounded-full border-[#6a53ff] bg-gradient-to-br from-brandLinear to-blueSecondary p-0"
      onClick={toggleDark}
      {...rest}
    >
      <div className="cursor-pointer text-gray-600">
        {darkmode ? (
          <RiSunFill className="h-4 w-4 text-white" />
        ) : (
          <RiMoonFill className="h-4 w-4 text-white" />
        )}
      </div>
    </button>
  );
}
