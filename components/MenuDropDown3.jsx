'use client';
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import React, { useState } from "react";

const MenuDropDown3 = ({ openDrawer, text, icon, children }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <>
            <button
                className={`flex relative py-3 justify-center items-center w-full ${
                    openDrawer ? "justify-start" : "justify-center"
                }`}
                onClick={() => setShowMenu(!showMenu)}
            >
                {icon}
                <span
                    className={`text-white absolute left-8 text-left transition-all duration-300 text-[15px] pl-3 w-full ${
                        openDrawer ? "opacity-100 pointer-events-auto" : "opacity-0"
                    }`}
                >
                    {text}
                </span>
                {openDrawer && (
                    <ChevronDownIcon
                        className={`w-5 h-5 text-white absolute right-0 transition-all duration-300 ${
                            showMenu ? "rotate-180" : ""
                        }`}
                    />
                )}
            </button>

            {/* Dropdown menu */}
            <div
                className={`transition-all duration-300 overflow-hidden ${
                    showMenu ? "opacity-100 h-auto" : "opacity-0 h-0"
                }`}
            >
                {children}
            </div>
        </>
    );
};

export default MenuDropDown3;
