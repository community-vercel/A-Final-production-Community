"use client";
import React, { useEffect, useState } from "react";
import { automotive, beauty, dentist, finical, meeting, org } from "@/assets";
import CardCategory from "@/components/CardCategory";
import TopBanner from "@/components/TopBanner";

const Page = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${serverurl}category-count/`);
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
  }, []);
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
      <TopBanner
        img={meeting}
        label="Free Listing"
        heading="Business Categor"
        btnTxt={
          <>
            + List your business <span className="font-bold">for free</span>
          </>
        }
      />

      {loading ? (
        <div className="">Loading</div>
      ) : 
      categories.length ? (
        <div className=" px-7 py-16 flex gap-x-3 gap-y-5 flex-wrap">
        {categories.map((category) => (
  // Check if the current category has subcategories
  category.subcategories && category.subcategories.length > 0 ? (
    <CardCategory
      key={category.id}
      url={`/places/category/categories/${category.id}`} // URL for categories with subcategories
      img={
        category.thumbnail ? `${serverurl}media/${category.thumbnail}` : automotive // Default image if thumbnail is not available
      }
      title={category.name}
      des={`${category.business_count} listings`}
      url2={`/places/category/${category.id}`} // URL for categories without subcategories

      // Description showing business count
    />
  ) : (
    <CardCategory
      key={category.id}
      url={`/places/category/${category.id}`} // URL for categories without subcategories
      img={
        category.thumbnail ? `${serverurl}media/${category.thumbnail}` : automotive // Default image if thumbnail is not available
      }
      title={category.name}
      des={`${category.business_count} listings`}
      url2={`/places/category/${category.id}`} // URL for categories without subcategories

      // Description showing business count
    />
  )
))}

        </div>
      ) : (
        <div className="">No category exists</div>
      )}
    </div>
  );
};

export default Page;
