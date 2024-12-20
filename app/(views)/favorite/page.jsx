"use client";
import CardService from "@/components/CardService";
 
import { HeartIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  useEffect(() => {
    if (!user.id) router.push("/");
    fetchResults();
  }, []);
  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL

  async function fetchResults() {
    try {
      setLoading(true);
      const response = await fetch(`${serverurl}fetch-favorites/?user_id=${user.id}`);
      const result = await response.json();
      
      if (response.ok) {
        setResults(result.data);
      } else {
        console.error(result.ErrorMsg);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  }
  
  // async function fetchResults() {
  //   const { data: haveData, error: haveError } = await supabase
  //     .from("favorite")
  //     .select("*,business(*)")
  //     .eq("user_id", user.id);

  //   if (haveError) {
  //     console.error("Error fetching results:", error);
  //   } else {
  //     setResults(haveData);
  //     setLoading(false);
  //   }
  // }

  const favoritePageHide = (business_id) => {
    
    setResults(results.filter(business=>business.business_id != business_id))
  }
  return (
    <div className="p-7 pt-12 ">
      <h1 className="text-3xl font-bold flex gap-2">
        <span>Your Favorites</span>{" "}
        <div
          className={`w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center`}
        >
          <HeartIcon className={`w-7 h-7 text-red-500`} />
        </div>
      </h1>
      {loading ? (
        <div className="py-10">Loading</div>
      ) : results.length > 0 ? (
        <div className="flex flex-col-reverse md:flex-row gap-10 px-2 py-10 md:gap-4">
          <div className="md:w-full">
            <div className="flex gap-x-4 gap-y-5 flex-wrap">
              {results.map((item) => (
                <CardService
                  business={item.business}
                  key={item.id}
                  user_id={user.id}
                  favoritePageHide={favoritePageHide}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="m-5">No favorites found</div>
      )}
    </div>
  );
};

export default Page;
