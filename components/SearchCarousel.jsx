"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // Import navigation module

import "swiper/css";
import "swiper/css/navigation";

const truncateText = (text, maxChars) => {
  return text.length > maxChars ? text.slice(0, maxChars) + "..." : text;
};

const SearchCarousel = ({ properties, serverurl }) => (
  <div className="bg-white mb-8 rounded-3xl p-6">
    {properties && properties.length > 1 && (
      <Swiper
        slidesPerView={1} // Default for very small screens (mobile)
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 10 }, // 2 properties on small screens
          768: { slidesPerView: 3, spaceBetween: 30 },
          900: { slidesPerView: 2, spaceBetween: 30 }, // 3 properties on medium screens
          // 3 properties on medium screens
          1025: { slidesPerView: 4, spaceBetween: 20 }, // 4 properties on large screens
        }}
        modules={[Navigation]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        className="mySwiper"
      >
        {properties.map((property, index) => (
          <SwiperSlide key={index}>
            <div className="border rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
              <a href={`/property/types/${property.slug}`}>
                <div className="relative">
                  {/* Property Image */}
                  <img
                    src={
                      property.logo_
                        ? serverurl + "media/" + property.logo_url
                        : serverurl + "media/" + property.logo_url
                    }
                    alt="Property"
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  {/* Purpose Label (Sell or Rent) */}
                  {property.purpose && (
                    <div
                      className={`absolute top-3 left-3 text-white py-1 px-3 rounded text-xs font-bold ${
                        property.purpose === "rent"
                          ? "bg-yellow-500"
                          : "bg-red-600"
                      }`}
                    >
                      {property.purpose.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {/* Price */}
                  <h6 className="font-bold text-lg mb-1 text-gray-900">
                    $ {property.price}
                  </h6>
                  {/* Location (with truncation) */}
                  <p className="text-gray-500 text-sm mb-2">
                    {property.location.length > 25
                      ? property.location.slice(0, 25) + "..."
                      : property.location}
                  </p>
                  {/* Area & Unit */}
                  <p className="text-blue-600 font-medium mb-2">
                    {property.area}{" "}
                    {property.unit ? property.unit.toUpperCase() : ""}
                  </p>
                  {/* Rooms & Baths Icons */}
                  <div className="flex space-x-4">
                    <span className="text-sm flex items-center">
                      🛏 {property.bed}
                    </span>
                    <span className="text-sm flex items-center">
                      🛁 {property.baths}
                    </span>
                  </div>
                </div>
              </a>
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
export default SearchCarousel;
