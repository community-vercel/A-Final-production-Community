"use client";
import { useSelector } from "react-redux";
import { automotive} from "@/assets";

import React, { useEffect, useState } from "react";import Image from 'next/image';
import Link from 'next/link';
import CardCategory from "@/components/CardCategory";

const Page = () => {
    const [reviews, setReviews] = useState([]);
    const { user, user_meta } = useSelector((state) => state.auth);

    const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            let response;
            const headers = { 'Content-Type': 'application/json' };
            const url = user.role === '3' || user.role === 3
              ? `${serverurl}getuser-reviews/`
              : `${serverurl}get-reviews/`;
            
            const options = {
              method: user.role === '3' ||user.role === 3 ? 'POST' : 'GET',
              headers,
              ...(user.role === '3' || user.role === 3  && { body: JSON.stringify({ id: user.id }) })
            };
    
            response = await fetch(url, options);
            
            const result = await response.json();
            
            if (response.ok) {
    
              user.role===3 || user.role==='3'?setReviews(result.data):setReviews(result.data);
             
    
    
    
            } else {
            //   setError(result.error || 'Failed to fetch businesses');
            }
          } 
        // try {
        //     const response = await fetch(`${serverurl}getuser-reviews/`,{
        //         method: 'POST',
        //         headers: {
        //           'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ id: user.id }),

        //     }); // Replace <user_id> with the actual user ID
        //     const data = await response.json();
            
        //     if (response.ok) {
        //         setReviews(data.data); // Assuming data.data contains the list of reviews
        //     } else {
        //         console.error('Failed to fetch reviews:', data.ErrorMsg);
        //     }
        // } 
        catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {user.role===1?
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">All Reviews</h1>
            :
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">My Reviews</h1>

            }
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {reviews.map((review) => (
            <Link 
              key={review.id} // Make sure to add a unique key for each mapped element
              href={`/business/categories/${review.business__id}`} 
              className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
            >
              <Image 
                src={review.review_files ? serverurl + review.review_files.replace(/\/api\//g, '') : automotive} 
                className="rounded-t-sm !w-full !h-58 object-cover" 
                alt={review.business__name} 
                width={200} 
                height={200} 
              />
      
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900">{review.business__name}</h2>
                <p className="text-gray-500 mb-2">Rating: {review.rating}</p>
                <p className="text-gray-600 mb-4">{review.review}</p>
                <p className="text-sm text-gray-400">Created At: {new Date(review.created_at).toLocaleDateString()}</p>
                <span className="mt-2 text-blue-500 underline">See reviews</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
           
      
    );
};

export default Page;
