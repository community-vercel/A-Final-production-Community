'use client';
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setUserMeta } from "@/store/slices/authslice";
import {
  UsaFlag,
  SpainFlag,
  FranceFlag,
  JapanFlag,
  PortugalFlag,
  EgyptFlag,
} from "@/assets";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

const LanguageSelector = () => {
  const dispatch = useDispatch();
  const user_meta = useSelector((state) => state.auth.user_meta);
  const dropdownRef = useRef(null);

  const availableLanguages = [
    { language: "English", code: "en", flag: UsaFlag },
    { language: "العربية", code: "ar", flag: EgyptFlag },
    { language: "Français", code: "fr", flag: FranceFlag },
    { language: "日本語", code: "ja", flag: JapanFlag },
    { language: "Português", code: "pt", flag: PortugalFlag },
    { language: "Español", code: "es", flag: SpainFlag },
  ];

  const getSelectedLanguage = (code) =>
    availableLanguages.find((lang) => lang.code === code) || availableLanguages[0];

  const initialLanguage = getSelectedLanguage(user_meta.selectedLanguage);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [showLanguages, setShowLanguages] = useState(false);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowLanguages(false);
    }
  };

  useEffect(() => {
    if (showLanguages) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showLanguages]);

  useEffect(() => {
    const language = getSelectedLanguage(user_meta.selectedLanguage);
    setSelectedLanguage(language);
  }, [user_meta.selectedLanguage]);

  const handleLanguageChange = (lang) => {
    if (user_meta.selectedLanguage !== lang.code) {
      dispatch(
        setUserMeta({
          user_meta: {
            ...user_meta,
            selectedLanguage: lang.code,
          },
        })
      );
      
    }
    setSelectedLanguage(lang);
    setShowLanguages(false);
  };

  return (
    <div ref={dropdownRef} className="dropdown relative max-w-40 min-w-10 w-full">
      <button
        className="flex justify-between items-center py-1 px-2 rounded-lg w-full group hover:bg-primary"
        aria-expanded={showLanguages}
        onClick={() => setShowLanguages(!showLanguages)}
      >
        <div className="flex gap-1 items-center">
          <Image src={selectedLanguage.flag} className="w-6 h-6" alt= 'Language' />
          <span className="hidden md:inline-block font-semibold text-xs uppercase group-hover:text-white">
            {selectedLanguage.language}
          </span>
        </div>
        <ChevronDownIcon
          className={`h-5 w-5 ml-2 md:ml-8 text-black group-hover:text-white transition-transform duration-200 ${
            showLanguages ? "rotate-180" : ""
          }`}
        />
      </button>
      <ul
        className={`${
          showLanguages ? "block opacity-100" : "hidden opacity-0"
        } transition-opacity duration-200 absolute bg-white rounded-md w-[150px] -left-[95px] md:left-0 md:w-full mt-2`}
      >
        {availableLanguages.map((lang) => (
          selectedLanguage.language !== lang.language && (
            <li
              key={lang.code}
              className="py-1 px-3 flex gap-1 items-center cursor-pointer hover:bg-primary hover:text-white"
              onClick={() => handleLanguageChange(lang)}
            >
              <Image src={lang.flag} className="w-5 h-5" alt={lang.language} />
              <span className="text-xs uppercase text-balance">
                {lang.language}
              </span>
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

export default LanguageSelector;
