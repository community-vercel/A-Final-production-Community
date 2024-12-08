'use client';
import {
  MicrophoneIcon,

} from "@heroicons/react/16/solid";
import Image from "next/image";
import Link from "next/link";

import React, { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";

export default function Categories() {
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State for error handling

  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;

  // Map category IDs to icons


  const rearrangeData = (result) => {
    

    const reArrangeDatas = result.map((item) => ({
      value: item.id,
      label: item.name,
      slug:item.slug,
      icon: item.icon || MicrophoneIcon}));
    
    setCategories(reArrangeDatas);
  };

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${serverurl}get-alleventcategory/`);
        const result = await response.json();
        if (response.ok) {
          rearrangeData(result.data);
        } else {
          setError(result.error || "Failed to fetch categories");
        }
      } catch (error) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, [serverurl]); // Dependency array to ensure the correct URL is used

  return (
    <div className="py-8 bg-white">
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && categories && (
        <div className="flex justify-center space-x-6 flex-wrap">
          {categories.map((category, index) => (
            <Link key={index} href={`/events/home/${category.slug}`}>
            <div
              key={index}
              className="flex flex-col items-center text-center w-24"
            >
              <div className="w-20 h-20 flex items-center justify-center rounded-full border border-gray-300 shadow-sm">
                {/* Render the icon */}
                {FaIcons[category.icon] ? (
  React.createElement(FaIcons[category.icon], {
    className: "h-10 w-10 text-gray-600",
  })
) :  (
  <Image
src={category.icon
  ? category.icon.includes('/api/media/')
    ?serverurl+ category.icon.replace('/api/media/', 'media/')
    : category.icon.includes('media/')
      ? serverurl+category.icon
      :serverurl+ `media/${category.icon}`
  : '' }
    // src={serverurl+category.icon.replace('/api/','media/')}
    alt="Category Icon"
    width={10}
    height={10}
    className="h-10 w-10"
  />
) }

              </div>
              <p className="text-gray-700 text-sm font-medium mt-2">
                {category.label}
              </p>
            </div>
            </Link>
          ))}
        </div>
        
      )}
    </div>
  );
}