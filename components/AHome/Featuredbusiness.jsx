
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

const  Featuredbusiness = ({ business, serverurl }) => (
   
<div className="bg-white mb-8 rounded-3xl p-6">
      {business && business.length > 1 && (
         <Swiper
         slidesPerView={1} // Default for very small screens (mobile)
         breakpoints={{
           640: { slidesPerView: 2, spaceBetween: 10 }, // 2 business on small screens
           768: { slidesPerView: 3, spaceBetween: 30 },
           900: { slidesPerView: 2, spaceBetween: 30 }, // 3 business on medium screens
           // 3 business on medium screens
           1025: { slidesPerView: 4, spaceBetween: 20 }, // 4 business on large screens
         }}
         modules={[Navigation]}
    
    
         navigation={{
           nextEl: ".swiper-button-next",
           prevEl: ".swiper-button-prev",
         }}
         className="mySwiper"

        >
          {business.map((busines, index) => (
            <SwiperSlide key={index}>
              <div className="border rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
                <Link  href={`/business/categories/${busines.slug}`}>
                  <div className="relative">
                    {/* Property Image */}
                    <Image
                      src={
                        busines.logo
                          ? busines.logo.includes('/api/')
                            ? serverurl + busines.logo.replace('/api/', '')
                            : serverurl + 'media/' + busines.logo
                          : serverurl + 'media/' + busines.logo_url
                      }
                      alt="Business"
                      width={230}
                      height={230}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    {/* Purpose Label (Sell or Rent) */}
                    {busines.isFeatured && (
                      <div
                        className={`absolute top-3 left-3 text-white py-1 px-3 rounded text-xs font-bold ${
                          busines.isFeatured === 'Featured' ? 'bg-yellow-500' : 'bg-red-600'
                        }`}
                      >
                         Featured
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {/* Price */}
                    <h6 className="font-bold text-lg mb-1 text-gray-900">{busines.name.slice(0,16)}</h6>
                    {/* Location (with truncation) */}
                    <p className="text-gray-500 text-sm mb-2">
                      {busines.location.length > 25 ? busines.location.slice(0, 25) + '...' : busines.location}
                    </p>
                    {/* Area & Unit */}
                    <span className="block mt-4 text-blue-500 underline hover:text-blue-600 transition-colors">
                View Business
              </span>
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
export default Featuredbusiness