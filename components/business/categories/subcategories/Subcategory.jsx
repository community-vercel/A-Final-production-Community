"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import CardCategory from "@/components/CardCategory";
import TopBanner from "@/components/TopBanner";
import {metting} from "@/assets/"
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/BreadCrum";
import Loader from "@/components/Loader";
import { useCategory } from "@/app/context/CategoryContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { H2, H3 } from "@/components/Typography";
import { automotive, meeting } from "@/assets";

import { Box } from "@mui/material";
const ITEMS_PER_LOAD = 10;

const Subcategory = ({initialCategoryData}) => {

  const [subcategories, setSubcategories] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true); // for initial load
  const [scrollLoading, setScrollLoading] = useState(false); // for scroll loading
  const [hasMoreSubcategories, setHasMoreSubcategories] = useState(true);
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const { user_meta } = useSelector((state) => state.auth);
  const params = useParams();
  const selectedLanguage = user_meta.selectedLanguage;
  const observer = useRef(); // Ref for IntersectionObserver
const [category,setCategory]=useState()
const { setSelectedCategory,selectedCategory,setIsSubcategory} = useCategory();
const frontend=process.env.NEXT_PUBLIC_SITE_URL

  // Fetch initial subcategories on component mount or language change
useEffect(() => {

    setSubcategories([]);
    fetchSubcategories(1, true); // Start from page 1 with initial loading
  }, [selectedLanguage]);

  const [showNoDataMessage, setShowNoDataMessage] = useState(false);

  useEffect(() => {
    // Show "No Data" message only after a 2-second delay
    const delayTimeout = setTimeout(() => {
      if (!subcategories || subcategories.length === 0) {
        setShowNoDataMessage(true);
      }
    }, 240);

    // Clear timeout if component unmounts or if subcategories are available
    return () => clearTimeout(delayTimeout);
  }, [subcategories]);


  // Fetch subcategories function
  const fetchSubcategories = async (page, isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setScrollLoading(true);
    }

    const formData = {
      language: selectedLanguage,
      slug: params.category,
      page,
      page_size: ITEMS_PER_LOAD,
    };

    try {
      const response = await fetch(`${serverurl}allcategory-count/`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
        setSubcategories((prevSubcategories) => {
            setCategory(result.categories)
          const newSubcategories = result.categories[0]?.subcategories || [];

          // Filter out duplicates based on unique `id`
          const uniqueSubcategories = [
            ...prevSubcategories,
            ...newSubcategories.filter(
              (subcategory) =>
                !prevSubcategories.some((prev) => prev.id === subcategory.id)
            ),
          ];

          return uniqueSubcategories;
        });

        setHasMoreSubcategories(result.categories[0]?.has_more_subcategories || false);
      } else {
        console.error(result.error || "Failed to fetch subcategories");
      }
    } catch (error) {
      console.error("An unexpected error occurred", error);
    } finally {
      setLoading(false);
      setScrollLoading(false);
    }
  };

  // Infinite scroll handler for subcategories
  const handleObserver = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMoreSubcategories && !scrollLoading) {
      fetchSubcategories(subcategories.length / ITEMS_PER_LOAD + 1);
    }
  }, [hasMoreSubcategories, scrollLoading, subcategories]);

  // Setup the IntersectionObserver for subcategories
  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(handleObserver);
    if (observer.current && hasMoreSubcategories) {
      const targetElement = document.getElementById("subcategory-end");
      if (targetElement) observer.current.observe(targetElement);
    }
    return () => observer.current.disconnect();
  }, [handleObserver, hasMoreSubcategories]);
  const constructBreadcrumbItems = () => {
    // Replace with actual category data fetching if necessary
    const breadcrumbItems = [
      { label: 'Home', href: '/' },
      { label: 'All Categories', href: '/business/allcategories' },

    ];

    // Find the current category based on the params.id
    const currentCategory = Array.isArray(category) 
    ? category.find(cat => cat.slug === params.category) 
    : null;   
    if (currentCategory) {
      breadcrumbItems.push({ label: currentCategory.name, href: `/business/${currentCategory.slug}` }); // Link to the current category

    }

    return breadcrumbItems;
  };
  const metadata = {
    title: initialCategoryData.metaname || initialCategoryData.name,
    description: initialCategoryData.metades || initialCategoryData.name,
    keywords: initialCategoryData.keywords,
    openGraph: {
      title: initialCategoryData.metaname || initialCategoryData.name,
      description: initialCategoryData.metades || initialCategoryData.name,
      url: `${frontend}/business/${initialCategoryData.slug}`,
      images: [`${serverurl}/media/${initialCategoryData.cover}`],
    },
    twitter: {
      card: "summary_large_image",
      title: initialCategoryData.metaname || initialCategoryData.name,
      description: initialCategoryData.metades || initialCategoryData.name,
      images: [`${serverurl}/media/${initialCategoryData.cover}`],
    },
  };
  
  
  return (
    <>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="keywords" content={metadata.keywords} />
  
      {/* Open Graph metadata */}
      <meta property="og:title" content={metadata.openGraph.title} />
      <meta property="og:description" content={metadata.openGraph.description} />
      <meta property="og:url" content={metadata.openGraph.url} />
      <meta property="og:image" content={metadata.openGraph.images} />
  
      {/* Twitter metadata */}
      <meta name="twitter:card" content={metadata.twitter.card} />
      <meta name="twitter:title" content={metadata.twitter.title} />
      <meta name="twitter:description" content={metadata.twitter.description} />
      <meta name="twitter:image" content={metadata.twitter.images} />
  
  
  
    
      <div className="bg-white p-3">
      <TopBanner
        invert
        back
        img={  category && category[0]?.cover? `${serverurl}media/${category[0].cover}`:
          // Check if subcategories exists and subcategories[0]?.cover is valid
          subcategories && subcategories[0]?.cover && subcategories[0]?.cover.includes("/api/media/")
            ? `${serverurl}${subcategories[0].cover.replace("/api/media/", "media/")}`
            // If subcategories[0]?.cover is invalid or not found, fall back to category[0]?.cover
            : category && category[0]?.cover
              ? `${serverurl}media/${category[0].cover}`
              : metting // Fallback to a default image if neither is available
        }
        
        label=""
        heading={category && category[0]?.name}
        btnTxt={<>+ List your business <span className="font-bold">for free</span></>}
      />
      <div className="mt-5 ">
          <Breadcrumb items={constructBreadcrumbItems()} />
          </div> 
          {subcategories && subcategories.length > 0 ? (
  <div className="w-full mt-3">
    <div className="flex flex-wrap gap-x-3 gap-y-5">        
      {subcategories.map((subcategory) => (
        <div
          key={subcategory.slug}
          className="flex-[170px] lg:flex-grow-0 lg:w-[19%] lg:flex-[19%] bg-white p-3 rounded-xl shadow-md"
        >
          <Link
            href={`/business/${params.category}/${subcategory.slug}`}
            onClick={() => {
              setIsSubcategory(true);
              setSelectedCategory(params.category);
            }}
          >
            <Image
              src={
                subcategory.thumbnail
                  ? `${serverurl}${subcategory.thumbnail.replace("/api/", "")}`
                  : automotive
              }
              alt={`${subcategory.name} thumbnail`}
              className="rounded-lg w-full aspect-video object-cover"
              width={300}
              height={300}
              loading="lazy"
              decoding="async"
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <h3 className="uppercase text-text-color text-base text-center font-semibold mt-4 mb-3">
              {subcategory.name}
            </h3>
            <span className="text-text-gray text-base text-center inline-block mb-3 w-full">
              {`${subcategory.business_count} Total Business listings`}
            </span>
          </Link>
        </div>
      ))}
    </div>

    {/* Observer target for loading more subcategories */}
    {hasMoreSubcategories && (
      <div id="subcategory-end" className="loading-indicator">
        {scrollLoading && <Loader />}
      </div>
    )}
  </div>
) :   showNoDataMessage && (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
      textAlign: 'center',
      width: '100%',
    }}
  >
    <H3>No Subcategories found for {category && category[0]?.name}</H3>
  </Box>
)}
     
    </div>
    </>
  );
};

export default Subcategory;
