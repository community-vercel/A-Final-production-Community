"use client";
import { dummy } from "@/assets";
import {
  ArrowUpCircleIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  GlobeAsiaAustraliaIcon,
  HeartIcon,
  PhoneIcon,
  ReceiptPercentIcon,
  StarIcon,
} from "@heroicons/react/16/solid";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { useSelector } from "react-redux";
import { FaAddressCard } from "react-icons/fa";

const CardService = ({ business, user_id = null, favoritePageHide = null }) => {
  const [stats, setStats] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL
  const { user_meta, user } = useSelector((state) => state.auth);

  const selectedLanguage = user_meta.selectedLanguage;
  //.log("card usineees",business)
  // const logoUrl = business.logo && business.logo.includes('/api/media/')
  // ? business.logo.replace('/api/media/', 'media/')
  // : business.logo;
  const logoUrl = business.logo
    ? business.logo.includes('/api/media/')
      ? business.logo.replace('/api/media/', 'media/')
      : business.logo.includes('media/')
        ? business.logo
        : `media/${business.logo}`
    : '';
  useEffect(() => {
    async function getStats() {
      try {
        if (business.business_id || business.id) {
          const formData = {
            business_id_param: business.business_id ? business.business_id : business.id,
            language: selectedLanguage,
          };

          const response = await fetch(`${serverurl}get-business-rating-stats/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });

          const result = await response.json();

          if (result.ErrorCode === 0) {
            setStats(result.data.stats);
          } else {
            console.error(result.ErrorMsg);
          }
          const apiUrl = `${serverurl}check-toggle-favorite/`;

          if (user_id && !favoritePageHide) {
            // Send a POST request to check and toggle favorite
            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: user_id,
                business_id: business.business_id ? business.business_id : business.id,
              }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to toggle favorite');

            setIsFavorite(result.is_favorite);
          } else if (favoritePageHide) {
            setIsFavorite(!isFavorite);
            favoritePageHide(business.business_id ? business.business_id : business.id);
          }
          // if (user_id && !favoritePageHide) {
          //   const { data: haveData, error: haveError } = await supabase
          //     .from("favorite")
          //     .select("*")
          //     .eq("user_id", user_id)
          //     .eq("business_id", business)
          //     .single();

          //   if (haveData && haveData.id) {
          //     setIsFavorite(!isFavorite);
          //   }
          // }else if(favoritePageHide){
          //   setIsFavorite(!isFavorite);
          // }
        }
      } catch (error) { }
    }

    getStats();
  }, [selectedLanguage]);

  // const toggleFavorite = async () => {
  //   try {
  //     setIsFavorite(!isFavorite);
  //     if (favoritePageHide) {
  //       favoritePageHide(business);
  //       const { data: delData, error: delError } = await supabase
  //         .from("favorite")
  //         .delete()
  //         .eq("business_id", business.id)
  //         .eq("user_id", user_id)
  //         .select();
  //       if (delError) throw error;
  //     } else {
  //       const { data: haveData, error: haveError } = await supabase
  //         .from("favorite")
  //         .select("*")
  //         .eq("user_id", user_id)
  //         .eq("business_id", business.id)
  //         .single();

  //       if (haveData && haveData.id) {
  //         const { data: delData, error: delError } = await supabase
  //           .from("favorite")
  //           .delete()
  //           .eq("id", haveData.id)
  //           .select();
  //         if (delError) throw error;
  //       } else {
  //         const { data, error } = await supabase
  //           .from("favorite")
  //           .insert({ user_id, business_id: business.id })
  //           .select();
  //         if (error) throw error;
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const toggleFavorite = async () => {
    try {
      // Toggle the local favorite state
      setIsFavorite(!isFavorite);

      // Define the URL for the API endpoint
      const apiUrl = `${serverurl}toggle-favorite/`;

      if (favoritePageHide) {
        // If there's a function to handle hiding the favorite on the page, call it
        favoritePageHide(business.business_id ? business.business_id : business.id);

        // Send a POST request to remove the favorite
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user_id,
            business_id: business.business_id ? business.business_id : business.id,
          }),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to remove favorite');

      } else {
        // Check if the favorite exists
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user_id,
            business_id: business.business_id ? business.business_id : business.id,
          }),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to add favorite');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (

<div className="flex-1 lg:w-[75%] p-4 md:p-6 lg:p-8 bg-white rounded-3xl border border-transparent hover:border-secondary transition-all duration-200 mx-auto">
  <div>
    
    <Link
      href={business.id ? `/business/categories/${business.slug}` : `/business/categories/${business.business_slug}`}
    >
      {business.isFeatured && (
        <div className="flex gap-1 items-center mb-2 text-green-400">
          <ArrowUpCircleIcon className="w-5 h-5" />
          <span>Featured</span>
        </div>
      )}
      {business.discount_code && (
        <div className="flex gap-1 items-center mb-2 text-green-400">
          <ReceiptPercentIcon className="w-5 h-5" />
          <span>Offering Discounts</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <h2 className="text-base text-text-color mb-1 font-semibold">
            {business.business_name}
          </h2>
          {business.description ? (
            <p className="text-sm text-[#050505] mb-5 break-all">
              {business.description.slice(0, 90) + '...'}
            </p>
          ) : (
            <p className="text-sm text-[#050505] mb-5 break-all"></p>
          )}
        </div>

        <div className="relative w-[5vw] h-[5vw] rounded-full overflow-hidden ml-[20px]">
<Image
src={`${serverurl}${logoUrl}`}
alt="My Logo"
layout="fill"
// className="object-cover" // Use objectFit to cover the entire area
/>
</div>
      </div>

      <ul className="mt-2 mb-7 text-[15px] text-[#050505]">
        {business.phone && (
          <li className="flex gap-3 mb-2">
            <PhoneIcon className="w-6 h-6 text-text-gray" />
            <span>{business.phone}</span>
          </li>
        )}

        {business.website && (
          <li className="flex gap-3 mb-2">
            <GlobeAsiaAustraliaIcon className="w-6 h-6 text-text-gray" />
            <span>{business.website.slice(0, 25) + '...'}</span>
          </li>
        )}

        {business.email && (
          <li className="flex gap-3 mb-2">
            <EnvelopeIcon className="w-6 h-6 text-text-gray" />
            <span>{business.email}</span>
          </li>
        )}
     {business.city && (business.state || business.zip) && (
  <li className="flex gap-3 mb-2">
    <FaAddressCard className="w-6 h-6 text-text-gray" />
    <span>
      {business.state && `${business.state}, `}
      {business.city && `${business.city}, `}
      {business.zip}
    </span>
  </li>
)}

      </ul>
    </Link>

    <div className="flex justify-between items-center">
      <StarRating rating={stats ? stats.avg_rating : 0} />
      {user_id ? (
        <button
          className={`w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center`}
          onClick={toggleFavorite}
        >
          <HeartIcon className={`w-7 h-7 ${isFavorite ? "text-red-500" : "text-gray-700"}`} />
        </button>
      ) : (
        <Link
          href="/login"
          className={`w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center`}
        >
          <HeartIcon className={`w-7 h-7 text-gray-700`} />
        </Link>
      )}
    </div>
  </div>
</div>

  

  );
};

export default CardService;
