"use client";
import { HeartIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import Link from "next/link";
import React from "react"; 

const ListTopBanner2 = ({ img, label, heading, website, call, direction, user_id, isFavorite, toggleFavorite }) => {




  return (
    <div className="relative min-h-[360px] md:min-h-[460px]"> {/* Adjusted min-height */}
      <div className="relative">
      <div className="relative w-full h-[400px] flex">
      <Image
        src={img}
        decoding="async"
        alt="A captivating banner showcasing the beauty of nature" // Descriptive alt text for SEO
        width={1620}
          height={400}
          className="w-full h-[400px] md:h-[400px] sm:h-[200px] xs:h-[200px] "
          priority
        />
  {/* <Image
    src={img}
    alt="A captivating banner showcasing the beauty of nature" // Descriptive alt text for SEO
    fill // Fills the container
    sizes="100vw" // Ensures the image adapts to the viewport width
    style={{ objectFit: 'cover' }} // Ensures the image covers the container without distortion
    loading="lazy" // Improves performance by lazy loading the image
    decoding="async" // Asynchronously decodes the image for better performance
  /> */}

</div>



        <span className="bg-overlay absolute top-0 left-0 w-full h-full"></span>
      </div>

      <div className="absolute px-5 sm:px-7 z-20 bottom-10 w-full sm:bottom-16">
        {label && (
          <span className="text-lg lg:text-xl inline-block font-bold px-4 py-1 text-white bg-[#b0acac] rounded-md">
            {label}
          </span>
        )}
        
        <h1 className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white font-bold mt-4 mb-6 lg:mb-10 flex flex-wrap gap-2 items-center`}>
          <span>{heading}</span>
          {user_id ? (
            <button
              className={`w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mt-1`}
              onClick={toggleFavorite}
            >
              <HeartIcon className={`w-7 h-7 ${isFavorite ? "text-red-500" : "text-black"}`} />
            </button>
          ) : (
            <Link
              href="/login"
              className={`w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mt-1`}
            >
              <HeartIcon className={`w-7 h-7 text-black`} />
            </Link>
          )}
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
          {website && (
            <Link href={website} className="inline-block text-center text-lg lg:text-xl font-medium md:py-3 px-6 py-2 text-text-color bg-[#f1f3f6] border border-primary rounded-full duration-300 hover:text-white hover:bg-primary">
              Website
            </Link>
          )}
          {call && (
            <Link href={`tel:${call}`} className="inline-block text-center text-lg lg:text-xl font-medium md:py-3 px-6 py-2 text-text-color bg-[#f1f3f6] border border-primary rounded-full duration-300 hover:text-white hover:bg-primary">
              Call
            </Link>
          )}
          {direction && (
            <Link href={direction} className="inline-block text-center text-lg lg:text-xl font-medium md:py-3 px-6 py-2 text-text-color bg-[#f1f3f6] border border-primary rounded-full duration-300 hover:text-white hover:bg-primary">
              Directions
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListTopBanner2;
