"use client";
import CardService from "@/components/CardService";
import Checkbox from "@/components/Checkbox";
 
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
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
 let allTags = [];
          result.tags.forEach((tag) =>
            tag.tag.split(",").length > 1
              ? tag.tag.split(",").forEach((iTag) => {
                allTags.push(iTag) 
              })
              : allTags.push(tag.tag)
          ); 
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
                  <CardService
                    business={item}
                    key={item.id}
                    user_id={user.id}
                  />
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
