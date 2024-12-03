"use client";
import Image from "next/image";
import React, { useCallback, memo } from "react";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
const TopBanner = memo(({ img, label, heading, btnTxt, invert, back }) => {
  const router = useRouter();
  const { user, user_meta } = useSelector((state) => state.auth);

  const getButton = useCallback(() => {
    if (user?.id) {
      return (
        <Link
          href="/business"
          className={`${
            invert
              ? "bg-white text-black text-center text-sm duration-300 rounded-full py-2 px-7 border-2 border-primary hover:bg-primary hover:text-white"
              : "bg-primary text-white text-center text-base rounded-full py-2 px-9 border-8 border-white"
          }`}
        >
          {btnTxt}
        </Link>
      );
    } else {
      return (
        <Link
          href="/login"
          className={`${
            invert
              ? "bg-white text-black text-center text-sm duration-300 rounded-full py-2 px-7 border-2 border-primary hover:bg-primary hover:text-white"
              : "bg-primary text-white text-center text-base rounded-full py-2 px-9 border-8 border-white"
          }`}
        >
          Login
        </Link>
      );
    }
  }, [user, btnTxt, invert]);

  return (
    <div className="relative min-h-[20px] max-h-[350px]">
        <Image
        src={img}
        decoding="async"
        alt={`${heading}`} 
          width={1620}
          height={300}
          className="w-full h-[300px] md:h-[300px] sm:h-[200px] xs:h-[200px] "


          priority
        />
      {/* <Image
        src={img}
        width={1000}
        height={500}
        alt={`${heading}`} // Shorter alt text for SEO
        className="h-full min-h-[260px] max-h-[280px] w-full object-cover"
        loading="lazy"
        decoding="async"
      /> */}
      <span className="bg-overlay absolute top-0 left-0 w-full h-full z-[1]"></span>

      <div className="absolute px-7 z-20 flex flex-col gap-5 bottom-8 md:flex-row md:gap-0 justify-between items-center w-full sm:bottom-12">
        <h1
          className={`text-2xl text-white font-bold ${
            back && "flex gap-4 items-center cursor-pointer"
          }`}
          onClick={() => {
            back && router.back();
          }}
        >
          {back && (
            <ChevronLeftIcon className="h-8 w-8 text-white rounded-full border-2 border-white" />
          )}

          <span>{heading}</span>
        </h1>
        {getButton()}
      </div>
    </div>
  );
});
TopBanner.displayName = 'TopBanner';

export default TopBanner;

