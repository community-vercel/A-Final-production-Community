"use client";
import { useSelector } from "react-redux";
import { automotive } from "@/assets";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Loader from "@/components/Loader";

const Page = () => {
  const [reviews, setReviews] = useState([]); // Store reviews
  const [page, setPage] = useState(1); // Track current page
  const [hasMore, setHasMore] = useState(true); // Whether more data exists
  const [loading, setLoading] = useState(false); // Prevent duplicate calls

  const { user } = useSelector((state) => state.auth);
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;

  // Fetch reviews based on current page
  const fetchReviews = async (currentPage) => {
    setLoading(true);
    try {
      const url =
        user.role === "3" || user.role === 3
          ? `${serverurl}getuser-reviews/`
          : `${serverurl}get-reviews/?page=${currentPage}`;

      const options = {
        method: user.role === "3" || user.role === 3 ? "POST" : "GET",
        headers: { "Content-Type": "application/json" },
        ...(user.role === "3" || user.role === 3 && {
          body: JSON.stringify({ id: user.id }),
        }),
      };

      const response = await fetch(url, options);
      const result = await response.json();

      if (response.ok) {
        const newReviews = result.data || [];
        if (newReviews.length === 0) setHasMore(false);
        setReviews((prev) => [...prev, ...newReviews]);
      } else {
        console.error("Failed to fetch reviews:", result.ErrorMsg);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetching new reviews when the page changes
  useEffect(() => {
    if (hasMore && !loading) {
      fetchReviews(page);
    }
  }, [page]);

  // Scroll event handler for window scroll
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      setPage((prevPage) => prevPage + 1); // Load the next page
    }
  }, []);

  // Attach the scroll event to window
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        {user.role === 1 ? "All Reviews" : "My Reviews"}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {reviews.map((review) => (
          <Link
            key={review.id}
            href={`/business/categories/${review.business__slug}`}
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
          >
            <Image
              src={
                review.review_files
                  ? serverurl + review.review_files.replace(/\/api\//g, "")
                  : automotive
              }
              className="rounded-t-sm !w-full !h-58 object-cover"
              alt={review.business__name}
              width={1000}
              height={100}
              loading="lazy"
              decoding="async"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {review.business__name}
              </h2>
              <p className="text-gray-500 mb-2">Rating: {review.rating}</p>
              <p className="text-gray-600 mb-4">
                {review.review.length > 100
                  ? review.review.slice(0, 100) + "..."
                  : review.review}
              </p>
              <p className="text-sm text-gray-400">
                Created At: {new Date(review.created_at).toLocaleDateString()}
              </p>
              <span className="mt-2 text-blue-500 underline">See reviews</span>
            </div>
          </Link>
        ))}
      </div>

      {loading && <Loader />}
    </div>
  );
};

export default Page;
