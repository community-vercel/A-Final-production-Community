"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { automotive } from "@/assets";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import Breadcrumb from "@/components/BreadCrum";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";

const Alleventpayment = () => {
  const [event, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const { user_meta } = useSelector((state) => state.auth);
  const selectedLanguage = user_meta.selectedLanguage ;
  const router=useRouter()

  const fetchdetails = async (page = 1, reset = false) => {
    setLoading(true);
    const formData = {
  id:user_meta.id,
    };

    try {
      const response = await fetch(`${serverurl}get-userpaymentdata/`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
       

        setEvents(result.data);
    
      } else {
        console.error(result.error || "Failed to fetch eventes");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if(!user_meta.id){
        router.push('/events/home')
    }

    fetchdetails()
  }, [selectedLanguage,user_meta]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Events Payment", href: "/events/payment/paymentlist" },
  ];

  return (



    <div className="container mx-auto px-0 py-2 ">
      
    <div className="mt-3 grid md:grid-cols-1 gap-6">
    <Breadcrumb items={breadcrumbItems} /> 
   
</div>

      <h1 className="text-4xl font-bold mb-15 text-center text-gray-900 tracking-tight">
        Events  Details
      </h1>
      
      {loading && <Loader />}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
        {event.length>0?event.map((event) => (
          <Link
            key={event.id}
            href={''}
            className="group bg-white shadow-sm rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
              <Image
                src={event.payment_screenshot ? serverurl+event.payment_screenshot.replace("/api/media/","media/") : automotive}
                alt={
                  event.logo
                    ? "Logo of " + event.event_name
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
               {event.event_name}
              </h2>
              <p className="text-gray-600 mt-2">
             <strong className="text-gray-800 font-extrabold"> Selected Date:</strong>  {event.date}
              </p>
              <p className="text-gray-600 mt-2">
              <strong className="text-gray-800 font-extrabold"> Submisson Date:</strong>  {event.created_at}
              </p>
              <p className={`${event.approved===0?"text-yellow-500 mt-3":event.approved===3?"text-red-400 mt-3":"text-green-500 mt-3 "}`}>
              <strong className="text-gray-800 font-extrabold">Status:</strong> {event.approved===0?'Awaiting':event.approved===3?'Rejected':'Approved'} 
              </p>
   
            </div>
          </Link>
        )):(
        ''
        )}
      </div>
      {event.length<=0?(    <div className="flex items-center justify-center mt-20 p-9">
            <h1 className=" text-2xl font-bold  text-center text-gray-900 tracking-tight">
       NO Data Found
      </h1>
       </div>):''}

    
    </div>
  );
};

export default Alleventpayment;
