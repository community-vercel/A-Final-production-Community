"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

import Breadcrumb from "@/components/BreadCrum";
import Loader from "@/components/Loader";

const CategoryEvents = ({initialeventsData}) => {
  
  const [events, setEvents] = useState([]); // Holds the list of events
  const [page, setPage] = useState(1); // Tracks the current page
  const [hasMore, setHasMore] = useState(true); // Indicates whether more data is available
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const params = useParams();
  const { user_meta } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const observerRef = useRef(null); 
  const selectedLanguage = user_meta.selectedLanguage ;
  const [loading, setLoading] = useState(false);

  // Function to fetch events
  const fetchEvents = async (page = 1, reset = false) => {
    setLoading(true);
    const formData = {
      language: selectedLanguage,
      page,
      page_size: 10,
      slug: params.slug,
    };

    try {
      const response = await fetch(`${serverurl}get-alleventscategory/`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
     
        const newEvents = result.data.filter((event) => {
          // Check if the event already exists in the current events
          const matchFound = events.some((existingEvent) => {
            console.log("Comparing:", existingEvent.event__id, event.event__id);
            // Ensure event__id values are the same (using String for consistent comparison)
            return String(existingEvent.event__id) === String(event.event__id);
          });
          return !matchFound; // Return the event if no match is found
        });
        
        // Log new events to verify filtering
        console.log("new event", newEvents);
        
        // Only update state if there are new events
        if (newEvents.length > 0) {
          setEvents((prevEvents) => {
            const allEvents = [...prevEvents, ...newEvents];
            console.log(allEvents)
            const uniqueEvents = Array.from(new Set(allEvents.map(event => event.event__id)))
              .map(id => allEvents.find(event => event.event__id === id));
            console.log("Unique events:", uniqueEvents);
            return uniqueEvents;
          });
          
          // Update pagination details if applicable
          setCurrentPage(result.current_page);
          setTotalPages(result.total_pages);
        } else {
        console.error(result.error || "Failed to fetch businesses");
      }
    }} catch (error) {
      console.error("An unexpected error occurred:", error);
    } finally {
      setLoading(false);
    }
  };
 
  const loadMore = useCallback(() => {
    if (currentPage < totalPages && !loading) {
      fetchEvents(currentPage + 1);
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

 

  // Reset and fetch events when category changes
  useEffect(() => {
    setEvents([]); // Clear previous events
    // Reset hasMore
    fetchEvents(1,true); // Fetch events for the new slug
  }, [params.slug,selectedLanguage]); // Add params.slug as a dependency
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Events", href: `/events/home/` },
    {
      label: `Events ${params.slug.toUpperCase()}`,
      href: `/events/home/${params.slug}`,
    },
  ];
//   const metadata = initialbusinesssData
//     ? {
//         title: initialbusinesssData.metaTitle,

//         description: initialbusinesssData.metaDescription,

//         keywords: initialbusinesssData.keywords,
//         openGraph: {
//           title: initialbusinesssData.metaTitle,

//           description:
//             initialbusinesssData.metaDescription ||
//             `Explore ${initialbusinesssData.title} for excellent services and offerings.`,
//           url: `${frontend}business/categories/${
//             initialbusinesssData.title || "default-slug"
//           }`,
//           images: [
//             `${serverurl}${
//               initialbusinesssData.banner?.includes("/api/media/")
//                 ? initialbusinesssData.banner.replace("/api/media/", "media/")
//                 : initialbusinesssData.banner || "/path/to/default_banner.jpg"
//             }`,
//           ],
//         },
//         twitter: {
//           card: "summary_large_image",
//           title:
//             initialbusinesssData.metaTitle ||
//             `${initialbusinesssData.title} - Explore Our Services`,
//           description:
//             initialbusinesssData.metaDescription ||
//             `Find out more about ${
//               initialbusinesssData.title
//             }, a leader in the  ${
//               (initialbusinesssData.title) ||
//               " initialbusinesssData"
//             } category.`,
//           images: [
//             `${serverurl}${
//               initialbusinesssData.banner?.includes("/api/media/")
//                 ? initialbusinesssData.banner.replace("/api/media/", "media/")
//                 : initialbusinesssData.banner || "/path/to/default_logo.jpg"
//             }`,
//           ],
//         },
//       }
//     : {
//         // Default metadata if no business object is available
//         title: "Explore Top Businesses and Services",
//         description:
//           "Discover top businesses, services, and products across various industries.",
//         keywords:
//           "businesses, services, products, top-rated companies, best businesses",
//         openGraph: {
//           title: "Explore Top Businesses and Services",
//           description:
//             "Find trusted businesses in your area for a variety of services and products.",
//           url: `${frontend}business/categories/`,
//           images: ["https://yourwebsite.com/path/to/default_image.jpg"],
//         },
//         twitter: {
//           card: "summary_large_image",
//           title: "Explore Top Businesses and Services",
//           description:
//             "Connect with reliable businesses across multiple categories.",
//           images: ["https://yourwebsite.com/path/to/default_image.jpg"],
//         },
//       };

  // Render metadata
  return (
    <>
      {/* <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="keywords" content={metadata.keywords} />
      <meta property="og:title" content={metadata.openGraph.title} />
      <meta
        property="og:description"
        content={metadata.openGraph.description}
      />
      <meta property="og:url" content={metadata.openGraph.url} />
      <meta property="og:image" content={metadata.openGraph.images} />
      <meta name="twitter:title" content={metadata.twitter.title} />
      <meta name="twitter:description" content={metadata.twitter.description} />
      <meta name="twitter:image" content={metadata.twitter.images} /> */}
      <div className="bg-white p-3">

    <div className="container mx-auto px-0 py-2 ">
      <div className="mt-3 grid md:grid-cols-1 gap-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <h1 className="text-4xl font-bold mb-15 text-center text-gray-900 tracking-tight">
        Explore Our Events
      </h1>
      {loading && <Loader />}
    
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
          {events.map((event) => (
            <Link
            key={event.event__slug}
              href={`/events/category/${event.event__slug}`}
              className="group bg-white shadow-sm rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                <Image
                  src={
                    serverurl + 'media/'+ event.event__logo ||
                    "default-image.jpg"
                  }
                  alt={event.event__name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 truncate">
                  {event.event__name.slice(0, 44)}
                </h2>
                <p className="text-gray-600 mt-2">
                  📍{" "}
                  {event.event__description.length > 30
                    ? `${event.event__description.slice(0, 30)}...`
                    : event.event__description}
                </p>
                <p className="text-gray-500 mt-1">
                  <span className="text-green-900 font-extrabold">$</span>
                  <strong className="text-yellow-500">
                    {" "}
                    {event.event__price > 0 ? `$${event.event__price}` : "Free"}
                  </strong>
                </p>
                <span className="block mt-4 text-blue-500 underline hover:text-blue-600 transition-colors">
                  View Detail
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
    </>
  );
};

export default CategoryEvents;
