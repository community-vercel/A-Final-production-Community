'use client'
import { useState } from "react";

const MenuDropDown2 = ({ openDrawer, text, icon, children }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false); // Local state for submenu

  return (
    <div className={`relative ${openDrawer ? "open" : ""}`}>
      <div
        className={`flex items-center cursor-pointer p-2`}
        onClick={() => setSubmenuOpen(!submenuOpen)} // Toggle submenu on click
      >
        {icon}
        {openDrawer && <span className={`ml-2 text-white`}>{text}</span>} {/* Show text only if drawer is open */}
      </div>
      {/* Dropdown content */}
      {submenuOpen && (
        <div className="absolute bg-gray-800 rounded-md shadow-lg mt-1 left-0 w-[300px]"> {/* Set width to match Link */}
          {children}
        </div>
      )}
    </div>
  );
};

export default MenuDropDown2;
