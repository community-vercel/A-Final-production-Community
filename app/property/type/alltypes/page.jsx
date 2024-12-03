"use client";
import React, { useEffect, useState } from "react";
import { automotive, beauty, dentist, finical, meeting, org } from "@/assets";
import CardCategory from "@/components/CardCategory";
import TopBanner from "@/components/TopBanner";
 
import { useSelector } from "react-redux"; 

const Page = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL
  const { user_meta, user } = useSelector((state) => state.auth);

  const selectedLanguage = user_meta.selectedLanguage;

  useEffect(() => {
    const fetchCategories = async () => {
      const formData={
        language:selectedLanguage

      }
      try {
        const response = await fetch(`${serverurl}category-count/`,{
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (response.ok) {
          setCategories(result);
        } else {
          setError(result.error || 'Failed to fetch categories');
        }
      } catch (error) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [selectedLanguage]);
  // useEffect(() => {
  //   fetchCategoryCounts();
  // }, []);

  // async function fetchCategoryCounts() {
  //   try {
  //     // Fetch all categories
  //     const { data: categories, error: categoriesError } = await supabase
  //       .from("category")
  //       .select("*");

  //     if (categoriesError) throw categoriesError;

  //     // Fetch counts for each category
  //     const { data: counts, error: countsError } = await supabase
  //       .from("category_business")
  //       .select("category_id, business!inner(approved)")
  //       .eq("business.approved", '1').eq('business.isArchived', false);

  //     console.log(counts);
  //     if (countsError) throw countsError;

  //     const combinedData = categories.map((category) => ({
  //       data: category,
  //       business_count: counts.filter((c) => c.category_id === category.id)
  //         .length,
  //     }));

  //     setCategories(combinedData);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  return (
    <div>
    
      {loading ? (
        <div className="">Loading</div>
      ) : categories.length ? (
        <div className=" px-7 py-8 flex gap-x-3 gap-y-5 flex-wrap">
         < div className="container mx-auto px-0 py-0 mt-0">
    <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">All Categories</h1>
    </div>

          
          {categories.map((category) => (
            <CardCategory
              key={category.id}
              url={`/places/category/${category.id}`}
              
              img={
                category.thumbnail ? `${serverurl}media/`+category.thumbnail : automotive
              }
              title={category.name}
              des={`${category.business_count} Total Business listings`}
            />
          ))}
          
        </div>
      ) : (
        <div className="">No category exists</div>
      )}
    </div>
  );
};

export default Page;
