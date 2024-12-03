
"use client"; 


import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // Import navigation module

import "swiper/css";
import "swiper/css/navigation"; 
import Image from "next/image";
import Link from "next/link";
const truncateText = (text, maxChars) => {
    return text.length > maxChars ? text.slice(0, maxChars) + '...' : text;
};

const  Featuredjobs = ({ jobs, serverurl }) => (
   
<div className="bg-white mb-8 rounded-3xl p-6">
      {jobs && jobs.length > 1 && (
         <Swiper
         slidesPerView={1} // Default for very small screens (mobile)
         breakpoints={{
           640: { slidesPerView: 2, spaceBetween: 10 }, // 2 jobs on small screens
           768: { slidesPerView: 3, spaceBetween: 30 },
           900: { slidesPerView: 2, spaceBetween: 30 }, // 3 jobs on medium screens
           // 3 jobs on medium screens
           1025: { slidesPerView: 4, spaceBetween: 20 }, // 4 jobs on large screens
         }}
         modules={[Navigation]}
    
    
         navigation={{
           nextEl: ".swiper-button-next",
           prevEl: ".swiper-button-prev",
         }}
         className="mySwiper"

        >
          {jobs.map((job, index) => (
            <SwiperSlide key={index}>
              <div className="border rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
                <Link  href={`/jobs/home/${job.slug}`}>
                  <div className="relative">
                    {/* Property Image */}
                    <Image
                      src={
                        job.logo
                          ? job.logo.includes('/api/')
                            ? serverurl + job.logo.replace('/api/', '')
                            : serverurl + 'media/' + job.logo
                          : serverurl + 'media/' + job.logo_url
                      }
                      alt="Business"
                      width={230}
                      height={230}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    {/* Purpose Label (Sell or Rent) */}
                    {job.isFeatured && (
                      <div
                        className={`absolute top-3 left-3 text-white py-1 px-3 rounded text-xs font-bold ${
                          job.isFeatured === 'Featured' ? 'bg-yellow-500' : 'bg-red-600'
                        }`}
                      >
                         Featured
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {/* Price */}
                    <h6 className="font-bold text-lg mb-1 text-gray-900">{job.title.slice(0,16)}</h6>
                  
                    <p className="text-blue-600 font-medium mb-2">
                    {/* {job.area}{" "} */}
                    {job.company_name ? job.company_name.toUpperCase() : ""}
                  </p>
                    <p className="text-gray-500 text-sm mb-2">
                      {job.location.length > 25 ? job.location.slice(0, 25) + '...' : job.location}
                    </p>
                 
                  <div className="flex space-x-4">
                    <span className="text-sm flex items-center">
                    $  {job.salary}
                    </span>
                    <span className="text-sm flex items-center">
                    📅 {job.application_deadline
                      }
                    </span>
                  </div>
                    {/* Area & Unit */}
                 
                    {/* Rooms & Baths Icons */}
                  
                  </div>
                </Link>
              </div>
            </SwiperSlide>
            
          ))}
             <div className="swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer">
❮
</div>
<div className="swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer">
❯
</div>
        </Swiper>
      )}
   
    </div>

    
   
);
export default Featuredjobs