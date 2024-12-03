"use client";
import React, { useEffect, useState,useMemo } from "react";
import {
  MagnifyingGlassIcon,
  ChatBubbleBottomCenterIcon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import LanguageSelector from "./LanguageSelector";
import Link from "next/link";
 
import { useDispatch, useSelector } from "react-redux";
import {
  setIsAuthenticated,
  setSession,
  setUser,
  setUserMeta,
} from "@/store/slices/authslice";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "@mui/material";
import { Event } from "@mui/icons-material";

const Header =React.memo(() => {
  const { user, user_meta } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const q = params.get("q");

  // Media query to check if the screen size is small
  const isSmallScreen = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const logout = async (e) => {
    e.preventDefault();
    try {
 
      dispatch(setUser({ user: {} }));
      dispatch(setSession({ session: {} }));
      dispatch(setIsAuthenticated({ isAuthenticated: false }));
      dispatch(setUserMeta({ user_meta: "" }));
    } catch (error) {
      console.log("logout error", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <header className="h-16 w-full md:h-20 bg-white shadow-sm mt-[-17px] relative z-20 flex items-center px-4 sm:px-6 lg:px-8">
      {/* Language Selector and User Icon */}
      {isSmallScreen && (
        <>
        <div className="flex items-center gap-4 ml-auto">
            <div className={`flex-1 ${isSmallScreen ? 'ml-8' : 'max-w-2xl mx-auto'}`}>
            <form className="relative">
  <input
    type="text"
    name="search"
    placeholder="Search..."
    aria-label="Search" 
    className="
      w-full
      pl-10 pr-4 py-2
      border border-gray-300 rounded-full
      focus:outline-none focus:ring-2 focus:ring-[#571021]
      placeholder-gray-400 text-sm
    "
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  <MagnifyingGlassIcon
    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
    aria-hidden="true" 
  
    aria-label="Search" 
    // Hide the icon from screen readers as it's decorative
  />
</form>

      </div>
      </div>
              <div className="flex items-center gap-4 ml-auto">

          <LanguageSelector />
          {user?.id ? (
            <div className="relative">
              <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
                {user.user_metadata.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    className="w-8 h-8 rounded-full"
                    alt="User Avatar"
                    width={100}
                    height={100}
                  />
                ) : (
                  <span
                    className="w-8 h-8 rounded-full uppercase text-white bg-black flex items-center justify-center font-bold"
                    title={user.email}
                  >
                    {user.user_metadata.full_name[0]}
                  </span>
                )}
              </button>
               {dropdownOpen && (
              <div className="absolute bg-white shadow-md rounded-md mt-2 right-0 w-48">
                <Link href="/dashboard/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  <UserCircleIcon className="h-5 w-5 inline mr-2" /> Profile
                </Link>
                <Link href="/events/payment/paymentlist/" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                <Event className="h-5 w-5 inline mr-2" /> Event Payment
                </Link>
                <Link href="/favorite" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  <HeartIcon className="h-5 w-5 inline mr-2" /> Favorites
                </Link>
                {/* <Link href="/dashboard/notifications" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  <BellIcon className="h-5 w-5 inline mr-2" />
                  Notifications
                  {user_meta?.notification_count > 0 && (
                    <span className="ml-2 text-xs bg-red-700 text-white flex items-center justify-center w-4 h-4 rounded-full">
                      {user_meta.notification_count}
                    </span>
                  )}
                </Link> */}
                {/* <Link href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  <ChatBubbleBottomCenterIcon className="h-5 w-5 inline mr-2" /> Chat
                </Link> */}
                <button
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={logout}
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 inline mr-2" /> Logout
                </button>
              </div>
            )}
            </div>
          ) : (
            <Link href="/login" className="flex gap-1 items-center text-sm text-[#571021]">
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
              <span>Login</span>
            </Link>
          )}
        </div>
        </> 
      )}

      {/* Centered Search Bar */}
    

      {/* Language and User Icon for Larger Screens */}
      {!isSmallScreen && (

        <>
        <form className="flex gap-2 items-center">
        <button type="submit" aria-label="Search"  className="cursor-pointer"><MagnifyingGlassIcon aria-label="Search"  className="h-6 w-6 text-[#571021]" /></button>
        <input
          type="text"
          name="search"
      
    aria-label="Search" 
          placeholder="Start typing to search..."
          className="[@media(max-width:370px)]:max-w-[145px] text-sm outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
        
       
        <div className="flex items-center gap-4 ml-auto">
          <LanguageSelector />
          {user?.id ? (
           
            
            <div className="relative">
              
              <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
                {user.user_metadata.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    className="w-8 h-8 rounded-full"
                    alt="User Avatar"
                    width={100}
                    height={100}
                  />
                ) : (
                  <span
                    className="w-8 h-8 rounded-full uppercase text-white bg-black flex items-center justify-center font-bold"
                    title={user.email}
                  >
                    {user.user_metadata.full_name[0]}
                  </span>
                )}
              </button>
              {dropdownOpen && (
              <div className="absolute bg-white shadow-md rounded-md mt-2 right-0 w-48">
                <Link href="/dashboard/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  <UserCircleIcon className="h-5 w-5 inline mr-2" /> Profile
                </Link>
                <Link href="/events/payment/paymentlist/" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  <Event className="h-5 w-5 inline mr-2" />Event Payment
                </Link>
                <Link href="/favorite" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  <HeartIcon className="h-5 w-5 inline mr-2" /> Favorites
                </Link>
                {/* <Link href="/dashboard/notifications" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  <BellIcon className="h-5 w-5 inline mr-2" />
                  Notifications
                  {user_meta?.notification_count > 0 && (
                    <span className="ml-2 text-xs bg-red-700 text-white flex items-center justify-center w-4 h-4 rounded-full">
                      {user_meta.notification_count}
                    </span>
                  )}
                </Link> */}
                {/* <Link href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  <ChatBubbleBottomCenterIcon className="h-5 w-5 inline mr-2" /> Chat
                </Link> */}
                <button
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={logout}
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 inline mr-2" /> Logout
                </button>
              </div>
            )}
            </div>
         
          ) : (
            <Link href="/login" className="flex gap-1 items-center text-sm text-[#571021]">
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
              <span>Login</span>
            </Link>
          )}
        </div>
        </>
      )}
    </header>
  );
});
Header.displayName = 'Header';

export default Header;
