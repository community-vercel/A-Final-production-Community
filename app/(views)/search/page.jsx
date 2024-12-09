"use client";
import CardService from "@/components/CardService";
import Checkbox from "@/components/Checkbox";
import StarRating from "@/components/StarRating";
import { ArrowUpCircleIcon, EnvelopeIcon, GlobeAsiaAustraliaIcon, HeartIcon, PhoneIcon, ReceiptPercentIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import Link from "next/link";
 
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { FaAddressCard } from "react-icons/fa";
import { useSelector } from "react-redux";

const Page = () => {
  const params = useSearchParams();
  const q = params.get("q");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [error, setError] = useState(null);
  const [discount, setDiscount] = useState(false);

  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    // if (!user || !user.id) {
    //   router.push("/");
    //   return;
    // }
    const fetchCategories = async () => {
      try {
        let response;
        const headers = { 'Content-Type': 'application/json' };
        const url = `${serverurl}get-categories/`;
        
        const options = {
          method: 'POST',
          headers,
          
        };

        response = await fetch(url, options);
        
        const result = await response.json();
        
        if (response.ok) {

        setCategories(result.results.categories);
        console.log("values",result.results.tags)

 let allTags = [];
          result.results.tags.forEach((tag) =>
            tag.tag.split(",").length > 1
              ? tag.tag.split(",").forEach((iTag) => {
                allTags.push(iTag) 
              })
              : allTags.push(tag.tag)
          ); 
          console.log("values",allTags)
          setTags([...new Set(allTags)].sort());
        // if (result.tags) {
        //   const uniqueTags = Array.from(
        //     new Set(result.tags.map(tag => tag.tag.toLowerCase()))
        //   ).map(tag => {
        //     return result.tags.find(t => t.tag.toLowerCase() === tag);
        //   });

        //   setTags(uniqueTags)

        // }
         



        } else {
          // setError(result.error || 'Failed to fetch businesses');
        }
      } 
       catch (error) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
 

  useEffect(() => {
    setResults([]);
    setLoading(true);
    setError(null);
    fetchResults(q, selectedCategory, selectedRating, selectedTag);
  }, [q, selectedCategory, selectedRating, selectedTag,discount]);
  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL

  async function fetchResults(
    query,
    selectedCategory,
    selectedRating,
    selectedTag
  ) {
    const url = new URL(`${serverurl}search/`, window.location.origin);
    if (query) url.searchParams.append("q", query);
    if (selectedCategory) url.searchParams.append("category", selectedCategory);
    if (selectedRating) url.searchParams.append("rating", selectedRating);
    if (selectedTag) url.searchParams.append("tag", selectedTag);
    if (discount) url.searchParams.append("discount", true);
  
    const response = await fetch(url);
    const data = await response.json();

    setResults(data);
    setLoading(false);
  }
  

  const hanndleDiscountChange = () => {
    setDiscount(!discount)
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="p-7 pt-14 space-y-3">
        <h1 className="text-3xl font-bold">Search</h1>
        <div className="flex items-center gap-3">
          <div className="mb-4"> 
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4"> 
            <select
              id="rating"
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">All Ratings</option>
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Star
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4"> 
            <select
              id="tag"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">All Tags</option>
              {tags.map((tag,index) => (
                <option key={`tag${index}`} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
              <Checkbox checkboxId='discount' checkboxLable='Have Disounts?' chkd={discount} handleChange={hanndleDiscountChange}/>
          </div>
        </div>
        {loading ? (
          <div className="py-10">Loading...</div>
        )  : results && results ? (
          <div className="flex flex-col-reverse md:flex-row gap-10 px-2 py-10 md:gap-4">
            <div className="md:w-full">
              <div className="flex gap-x-4 gap-y-5 flex-wrap">
                {results?.map((item) => (
                <div key={item.slug} className="flex-1 lg:w-[75%] p-4 md:p-6 lg:p-8 bg-white rounded-3xl border border-transparent hover:border-secondary transition-all duration-200 mx-auto">
                <div>
                  
                  <Link
                    href={item.id ? `/business/categories/${item.slug}` : `/business/categories/${item.slug}`}
                  >
                    {item.isFeatured && (
                      <div className="flex gap-1 items-center mb-2 text-green-400">
                        <ArrowUpCircleIcon className="w-5 h-5" />
                        <span>Featured</span>
                      </div>
                    )}
                    {item.discount_code && (
                      <div className="flex gap-1 items-center mb-2 text-green-400">
                        <ReceiptPercentIcon className="w-5 h-5" />
                        <span>Offering Discounts</span>
                      </div>
                    )}
              
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <h2 className="text-base text-text-color mb-1 font-semibold">
                          {item.name}
                        </h2>
                        {item.description ? (
                          <p className="text-sm text-[#050505] mb-5 break-all">
                            {item.description.slice(0, 220) + '...'}
                          </p>
                        ) : (
                          <p className="text-sm text-[#050505] mb-5 break-all"></p>
                        )}
                      </div>
              
                      <div className="relative w-[5vw] h-[5vw] rounded-full overflow-hidden ml-[20px]">
              <Image
              src={`${serverurl+item?.logo?.replace("/api/media/","media/")}`}
              alt="My Logo"
              layout="fill"
              />
              </div>
                    </div>
              
                    <ul className="mt-2 mb-7 text-[15px] text-[#050505]">
                      {item.phone && (
                        <li className="flex gap-3 mb-2">
                          <PhoneIcon className="w-6 h-6 text-text-gray" />
                          <span>{item.phone}</span>
                        </li>
                      )}
              
                      {item.website && (
                        <li className="flex gap-3 mb-2">
                          <GlobeAsiaAustraliaIcon className="w-6 h-6 text-text-gray" />
                          <span>{item.website.slice(0, 25) + '...'}</span>
                        </li>
                      )}
              
                      {item.email && (
                        <li className="flex gap-3 mb-2">
                          <EnvelopeIcon className="w-6 h-6 text-text-gray" />
                          <span>{item.email}</span>
                        </li>
                      )}
                   {item.city && (item.state || item.zip) && (
                <li className="flex gap-3 mb-2">
                  <FaAddressCard className="w-6 h-6 text-text-gray" />
                  <span>
                    {item.state && `${item.state}, `}
                    {item.city && `${item.city}, `}
                    {item.zip}
                  </span>
                </li>
              )}
              
                    </ul>
                  </Link>
              
                  {/* <div className="flex justify-between items-center">
                    <StarRating rating={stats ? stats.avg_rating : 0} />
                    {user_id ? (
                      <button
                        className={`w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center`}
                        onClick={toggleFavorite}
                      >
                        <HeartIcon className={`w-7 h-7 ${isFavorite ? "text-red-500" : "text-gray-700"}`} />
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        className={`w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center`}
                      >
                        <HeartIcon className={`w-7 h-7 text-gray-700`} />
                      </Link>
                    )}
                  </div> */}
                </div>
              </div>
              
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="m-5">No results found</div>
        )}
      </div>
    </Suspense>
  );
};

export default Page;
