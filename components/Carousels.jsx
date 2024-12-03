
"use client"; 

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // Import navigation module

import "swiper/css";
import "swiper/css/navigation"; 
import Image from "next/image";

export default function Carousel({slides}) {

const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;

  return (
    <div className="text-white py-2 px-2">
     

     <Swiper
  navigation
  modules={[Navigation]}
  className="mt-0"
  spaceBetween={20}
  slidesPerView={1}
>
  {slides && slides.map((slide, index) => (
    <SwiperSlide key={index} className="flex justify-center">
      <div className="w-full h-[380px] relative">
        <Image
        width={1500}
        height={380}
          src={serverurl + 'media/' + slide}
          alt={slide.title}
          priority
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
        
      </div>
    </SwiperSlide>
  ))}
</Swiper>
    </div>
  );
}
