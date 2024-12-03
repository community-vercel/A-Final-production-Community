"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { automotive } from "@/assets";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import Breadcrumb from "@/components/BreadCrum";
import Loader from "../Loader";

const Allbusiness = () => {
  const [business, setBusiness] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const observerRef = useRef(null); // Ref for IntersectionObserver
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const { user_meta } = useSelector((state) => state.auth);
  const selectedLanguage = user_meta.selectedLanguage ;

  const fetchBusinesses = async (page = 1, reset = false) => {
    setLoading(true);
    const formData = {
      language: selectedLanguage,
      page,
      page_size: 10,
    };

    try {
      const response = await fetch(`${serverurl}get-alluserbusiness/`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        cache: "force-cache",
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
        const uniqueBusinesses = result.data.filter(
          (newItem) => !business.some((existingItem) => existingItem.id === newItem.id)
        );

        setBusiness(reset ? uniqueBusinesses : [...business, ...uniqueBusinesses]);
        setCurrentPage(result.current_page);
        setTotalPages(result.total_pages);
      } else {
        console.error(result.error || "Failed to fetch businesses");
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
      fetchBusinesses(currentPage + 1);
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
    setBusiness([]);
    fetchBusinesses(1, true);
  }, [selectedLanguage]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Business", href: "/business/allbusiness" },
  ];

  return (


    <div className="bg-white p-3">

    <div className="container mx-auto px-0 py-2 ">
      
    <div className="mt-3 grid md:grid-cols-1 gap-6">
    <Breadcrumb items={breadcrumbItems} /> 
   
</div>

      <h1 className="text-4xl font-bold mb-15 text-center text-gray-900 tracking-tight">
        Explore Our Businesses
      </h1>
      
      {loading && <Loader />}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
        {business.map((business) => (
          <Link
            key={business.id}
            href={`/business/categories/${business.slug}`}
            className="group bg-white shadow-sm rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
              <Image
                src={business.logo ? `${serverurl}media/${business.logo}` : automotive}
                alt={
                  business.logo
                    ? "Logo of " + business.name
                    : "Default automotive logo"
                }
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 truncate">
                {business.name}
              </h2>
              <p className="text-gray-600 mt-2">
                📍 {business.location}, {business.city}
              </p>
              <p className="text-gray-500 mt-1">
                🌟 {business.review_count} Reviews
              </p>
              <span className="block mt-4 text-blue-500 underline hover:text-blue-600 transition-colors">
                View Business
              </span>
            </div>
          </Link>
        ))}
      </div>

      {currentPage < totalPages && (
        <div id="load-more-trigger" className="h-16 flex justify-center items-center">
          {loading && (
            <Loader />

          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default Allbusiness;
