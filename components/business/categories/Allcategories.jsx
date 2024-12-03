"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { automotive } from "@/assets";
import CardCategory from "@/components/CardCategory";
import Breadcrumb from "@/components/BreadCrum";
import Loader from "@/components/Loader";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const observerRef = useRef(null); // Ref for IntersectionObserver
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const { user_meta } = useSelector((state) => state.auth);
  const selectedLanguage = user_meta?.selectedLanguage || "en";

  const fetchCategories = async (page = 1, reset = false) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${serverurl}category-count/?page=${page}&page_size=11&language=${selectedLanguage}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        }
      );
      const result = await response.json();

      if (response.ok) {
        const uniqueCategories = result.categories.filter(
          (newItem) =>
            !categories.some((existingItem) => existingItem.id === newItem.id)
        );

        setCategories(
          reset ? uniqueCategories : [...categories, ...uniqueCategories]
        );
        setCurrentPage(result.current_page);
        setTotalPages(result.total_pages);
      } else {
        console.error(result.error || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to load more data when the user reaches the bottom
  const loadMore = useCallback(() => {
    if (currentPage < totalPages && !loading) {
      fetchCategories(currentPage + 1);
    }
  }, [currentPage, totalPages, loading]);

  // IntersectionObserver to detect when the user reaches the bottom
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect(); // Clean up previous observer

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore(); // Load more data when the button or element comes into view
        }
      },
      { threshold: 1.0 }
    );

    const target = document.querySelector("#load-more-trigger");
    if (target) observerRef.current.observe(target);

    return () => observerRef.current.disconnect(); // Clean up on unmount
  }, [loadMore]);

  useEffect(() => {
    setCategories([]); // Reset categories when language changes
    fetchCategories(1, true); // Fetch categories for the first page
  }, [selectedLanguage]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/business/allcategories" },
  ];

  return (
    <div className="bg-white ">

    <div className="container mx-auto px-0 py-2 ">
      
    <div className="mt-3 grid md:grid-cols-1 gap-6">
    <Breadcrumb items={breadcrumbItems} /> 
   
</div>
      <h1 className="text-5xl font-extrabold mb-8 text-center mt-0 tracking-wide">
        Explore Our Categories
      </h1>
   
      {loading && <Loader />}
      <div className="px-0 flex gap-x-0 gap-y-5 flex-wrap">
        {categories.map((category) => (
      <div key={category.slug} 
      className="flex-[170px] lg:flex-grow-0 lg:w-[19%] lg:flex-[19%] bg-white p-3 rounded-xl">

            <Link href={`/business/${category.slug}`}>
              <Image
                src={
                  category.thumbnail
                    ? `${serverurl}media/${category.thumbnail}`
                    : automotive
                }
                alt="A detailed description of the image for accessibility"
                className="rounded-lg w-full aspect-video object-cover"
                width={300}
                height={300}
                loading="lazy"
                decoding="async"
                style={{ maxWidth: "100%", height: "auto" }}
                
              />
              <h3 className="uppercase text-text-color text-base text-center font-semibold mt-4 mb-3">
                {category.name}
              </h3>
            </Link>
            <Link
              href={`/business/home/${category.slug}`}
              
            >
              <span className="text-text-gray text-base text-center inline-block mb-3 w-full">
                {`${category.business_count}  Total Business listings`}
              </span>
            </Link>
        </div>
        ))}
      </div>

      {currentPage < totalPages && (
        <div
          id="load-more-trigger"
          className="h-16 flex justify-center items-center"
        >
          {loading && (
            <svg
              className="w-5 h-5 mr-2 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M12 2v10m0 0v10m0-10h10m-10 0H2"
              />
            </svg>
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default AllCategories;
