
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

const  Featuredevent = ({ events, serverurl }) => (
   
<div className="bg-white mb-8 rounded-3xl p-6">
      {events && events.length > 1 && (
         <Swiper
         slidesPerView={1} // Default for very small screens (mobile)
         breakpoints={{
           640: { slidesPerView: 2, spaceBetween: 10 }, // 2 events on small screens
           768: { slidesPerView: 3, spaceBetween: 30 },
           900: { slidesPerView: 2, spaceBetween: 30 }, // 3 events on medium screens
           // 3 events on medium screens
           1025: { slidesPerView: 4, spaceBetween: 20 }, // 4 events on large screens
         }}
         modules={[Navigation]}
    
    
         navigation={{
           nextEl: ".swiper-button-next",
           prevEl: ".swiper-button-prev",
         }}
         className="mySwiper"

        >
          {events.map((event, index) => (
            <SwiperSlide key={index}>
              <div className="border rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
                <Link  href={`/events/category/${event.slug}`}>
                  <div className="relative">
                    {/* Property Image */}
                    <Image
                      src={
                        event.logo
                          ? event.logo.includes('/api/')
                            ? serverurl + event.logo.replace('/api/', '')
                            : serverurl + 'media/' + event.logo
                          : serverurl + 'media/' + event.logo
                      }
                      alt="Events"
                      width={230}
                      height={230}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    {/* Purpose Label (Sell or Rent) */}
                    {event.isFeatured && (
                      <div
                        className={`absolute top-3 left-3 text-white py-1 px-3 rounded text-xs font-bold ${
                          event.isFeatured === 'Featured' ? 'bg-yellow-500' : 'bg-red-600'
                        }`}
                      >
                         Featured
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {/* Price */}
                    <h6 className="font-bold text-lg mb-1 text-gray-900">{event.title.slice(0,16)}</h6>
                  
                    <p className="text-blue-600 font-medium mb-2">
                    {/* {event.area}{" "} */}
                    {event.name ? event.name.slice(0,16).toUpperCase() : ""}
                  </p>
                    <p className="text-gray-500 text-sm mb-2">
                      {event.address.length > 25 ? event.address.slice(0, 25) + '...' : event.address}
                    </p>
               {event.price===0? <h6 className="font-bold text-lg mb-1 text-green-500">
                    Free
                  </h6>: <h6 className="font-bold text-lg mb-1 text-gray-900">
                    $ {event.price}
                  </h6>}
                    
                   
                  <div className="flex space-x-4">
                    <span className="text-sm flex items-center">
                    🗓️  {event.start_date?event.start_date:event.start_date}
                    </span>
                    <span className="text-sm flex items-center">
                    📅 {event.end_date
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
export default Featuredevent