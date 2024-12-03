"use client";
import React, { useEffect, useRef, useState } from "react";
import { BB } from "@/assets";
import TopBanner from "@/components/TopBanner";
import CardService from "@/components/CardService";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import Checkbox from "@/components/Checkbox";
import {
  CitySelect,
  StateSelect,
  GetLanguages,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import Breadcrumb from "@/components/BreadCrum";
import Loader from "@/components/Loader";
import { useCategory } from "@/app/context/CategoryContext";
import { useRouter } from "next/navigation"; // Make sure to use the correct import for Next.js 13 and above

const HomeCategoryPage = ({ initialCategoryData }) => {

  const [category, setCategory] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false); // Check if more data exists
  const [stateid, setstateid] = useState(0);
  const [languageList, setLanguageList] = useState([]);
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedLangauge, setSelectedLangauge] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [discount, setDiscount] = useState(false);
  const observerRef = useRef(null);
  const router = useRouter(); // Initialize the router

  // Create a reference for the observer target
  const { selectedCategory, isSubcategory } = useCategory();

  // Reset selectedCategory when the component mounts

 
  const params = useParams();
  const searchParams = useSearchParams();
  const { user_meta, user } = useSelector((state) => state.auth);
  const myselectedLanguage = user_meta?.selectedLanguage ?? "en";
  const countryid = 233;
  const frontend = process.env.NEXT_PUBLIC_SITE_URL;

  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const hanndleDiscountChange = () => {
    setDiscount(!discount);
  };
  const [languages] = useState([
    { code: "en", name: "English" },
    { code: "fr", name: "French" },
    { code: "es", name: "Spanish" },
    { code: "pt", name: "Portuguese" },
    { code: "ar", name: "Arabic" },
  ]);
  useEffect(() => {
    if (params.slug) {
      fetchCategoryAndBusinesses();
      setLanguageList(languages)

    }
  }, [params.slug]);


  // Fetch the category and initial businesses
  const fetchCategoryAndBusinesses = async () => {
    try {
      setLoading(true);
      const { from, to } = getFromTo(0); // Fetch from page 0
      const formData = {
      slug: params.slug ,
        from: from,
        to: to,
        language: myselectedLanguage,
      };

      const response = await fetch(`${serverurl}get-category-businesses/`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (result.ErrorCode === 0) {
        setCategory(result.data[0]);

        setBusinesses(result.data.filter((item) => item.business_id != null));
        setHasMore(result.HasMoreData ? true : false);
        // setHasMore(result.data.length > 0); // Set hasMore based on returned data
      } else {
        console.error(result.ErrorMsg);
      }
    } catch (error) {
      console.error("Error fetching category and businesses:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch more businesses when "Load More" is clicked
  const fetchMoreBusiness = async () => {
    if (!hasMore || loading) return;
    setLoading(true); // Set loading state to true

    

    try {
      const { from, to } = getFromTo(page + 1); // Fetch for the next page
      const formData = {
  slug: params.slug ,
        from: from,
        to: to,
        language: myselectedLanguage,
      };

      const response = await fetch(`${serverurl}fetch-more-businesses/`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (result.ErrorCode === 0) {
        const newBusinesses = result.data.filter(
          (item) => item.business_id != null
        );

        // Avoid duplicates
        const uniqueBusinesses = newBusinesses.filter(
          (newBusiness) =>
            !businesses.some(
              (existingBusiness) =>
                existingBusiness.business_id === newBusiness.business_id
            )
        );

        if (uniqueBusinesses.length > 0) {
          setBusinesses((prevBusinesses) => [
            ...prevBusinesses,
            ...uniqueBusinesses,
          ]);
          setPage((prevPage) => prevPage + 1);
          setLoading(false);
          setHasMore(result.HasMoreData); // Update hasMore based on response
        } else {
          setHasMore(false); // No more businesses to fetch
        }
      } else {
        console.error(result.ErrorMsg);
      }
    } catch (error) {
      console.error("Error fetching more businesses:", error.message);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  const getFromTo = (page) => {
    const itemsPerPage = 10; // Adjust this based on the API's page size
    const from = page * itemsPerPage;
    const to = from + itemsPerPage;
    return { from, to };
  };

  const handleSubmit = async (e) => {
    setBusinesses([]);

    e.preventDefault();
    try {
      setLoading(true);
      const requestBody = {
  slug: params.slug,
        state: selectedState || "",
        city: selectedCity || "",
        language: selectedLangauge || "en",
        rating: selectedRating || "",
        discount: discount ? "true" : "false",
      };

      const response = await fetch(`${serverurl}search-mybusinesses/`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      if (response.ok) {
        setBusinesses([]);
        setLoading(false);
        setBusinesses(result);
        setPage(1); // Reset the page count after search
        // setHasMore(result.length > 0); // Reset the "hasMore" based on the result
      } else {
        setLoading(false);
        console.error("Error fetching search results:", result.ErrorMsg);
      }
    } catch (error) {
        setLoading(false);
      console.error("Error fetching search results:", error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchMoreBusiness();
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [observerRef, hasMore, loading]);

  const resetForm = async () => {
    try {
      // Reset form fields
      setSelectedCity("");
      setSelectedState("");
      setSelectedRating("");
      setSelectedLangauge("");
      setDiscount(false);
      setstateid("");
      setPage(1);

      // Fetch initial businesses for the category
      const formData = {
    slug: params.slug ,
        from: 0, // Starting index
        to: 9,
        language: myselectedLanguage,
        // Ending index (you can adjust this as needed)
      };

      const response = await fetch(`${serverurl}get-category-businesses/`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.ErrorCode === 0) {
        setSelectedState(selectedState);
        setBusinesses(result.data);
        setHasMore(result.HasMoreData ? true : false);

        // Set businesses data
        // setHasMore(result.data.length >= 10); // Check if there are more records to load
      } else {
        console.error(result.ErrorMsg || "Failed to fetch data");
      }
    } catch (error) {
      console.log("Error resetting form:", error);
    }
  };

  // Replace with actual category data fetching if necessary
  const constructBreadcrumbItems = () => {
   
    const currentCategory = businesses.find(
      (category) => category.category_slug === params.slug
    );
  

    const breadcrumbItems = [
      { label: "Home", href: "/" },

      { label: "All Categories", href: "/business/allcategories" },

      // { label: `${ businesses[0].name}`, href: '/dashboard/categories/allcategories' },
    ];

    // Find the current category based on the params.slug
    if (selectedCategory) {
      breadcrumbItems.push({
        label: selectedCategory,
        href: `/business/${selectedCategory}`,
      }); // Link to the current category
    }
    if (currentCategory) {
      breadcrumbItems.push({
        label: currentCategory.category_name,
        href: `/business/${selectedCategory}/${currentCategory.category_slug}`,
      }); // Link to the current category
    }

    return breadcrumbItems;
  };
  const metadata = {
    title: initialCategoryData.category?.metaname || initialCategoryData.category?.category_name || "Default Title",
    description: initialCategoryData.category?.metades || initialCategoryData.category?.description || "Default Description",
    keywords: initialCategoryData.category?.keyword || "default, keywords",
    openGraph: {
      title: initialCategoryData.category?.metaname || initialCategoryData.category?.category_name || "Default OG Title",
      description: initialCategoryData.category?.metades|| initialCategoryData.category?.description || "Default OG Description",
      url: `${frontend}/business/${params?.slug || "default-slug"}/${initialCategoryData.category?.category_slug || "default-category"}`,
      images: [
        initialCategoryData.category?.cover?.includes('/api/media/')
          ? `${serverurl}/media/${initialCategoryData.category.cover.replace('/api/media/', '')}`
          : `${serverurl}/media/${initialCategoryData.category?.cover || "default-cover.jpg"}`
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: initialCategoryData.category?.metaname|| initialCategoryData.category?.category_name || "Default Twitter Title",
      description: initialCategoryData.category?.metades || initialCategoryData.category?.description || "Default Twitter Description",
      images: [
        initialCategoryData.category?.cover?.includes('/api/media/')
          ? `${serverurl}/media/${initialCategoryData.category.cover.replace('/api/media/', '')}`
          : `${serverurl}/media/${initialCategoryData.category?.cover || "default-twitter-cover.jpg"}`
      ],
    },
  };
  
  

  return (
    <>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="keywords" content={metadata.keywords} />

      {/* Open Graph metadata */}
      <meta property="og:title" content={metadata.openGraph.title} />
      <meta
        property="og:description"
        content={metadata.openGraph.description}
      />
      <meta property="og:url" content={metadata.openGraph.url} />
      <meta property="og:image" content={metadata.openGraph.images} />

      {/* Twitter metadata */}
      <meta name="twitter:card" content={metadata.twitter.card} />
      <meta name="twitter:title" content={metadata.twitter.title} />
      <meta name="twitter:description" content={metadata.twitter.description} />
      <meta name="twitter:image" content={metadata.twitter.images} />

      <div className="bg-white p-3">
      <TopBanner
          invert
          back
          img={
            category && category.cover && category.cover.includes("/api/media/")
              ? `${serverurl}${category.cover.replace("/api/media/", "media/")}`
              : category && category.cover
              ? `${serverurl}media/${category.cover}`
              : BB
          }
          label=""
          heading={category ? category.category_name : "Category"}
          btnTxt={
            <>
              + List your business <span className="font-bold">for free</span>
            </>
          }
        />

        <div className="mt-5 px-2">
          <Breadcrumb items={constructBreadcrumbItems()} />
        </div>

        <div className="flex flex-col md:flex-row mt-4">
          {businesses.length > 0 ? (
            <div className="md:w-[75%]">
              <div className="flex gap-x-4 gap-y-5 flex-wrap">
                {businesses.map((item) => (
                  <CardService
                    business={item}
                    key={item.business_id}
                    user_id={user.id}
                  />
                ))}
              </div>
              {/* Conditionally show Loader or No More Data */}
              {loading ? (
                <Loader />
              ) : !hasMore && businesses.length > 0 ? (
                <p className="text-center mt-4"></p>
              ) : null}
              <div ref={observerRef} style={{ height: "20px" }} />{" "}
              {/* Small height to trigger the observer */}
            </div>
          ) : (
            <div className="w-full md:w-[75%] m-5">
              {loading ? <Loader /> : <p>No businesses found</p>}
            </div>
          )}

          <div className="w-full md:w-[25%] md:sticky top-0 ml-2">
            <form
              className="p-6 sm:p-8 bg-white rounded-3xl shadow-md"
              onSubmit={handleSubmit}
            >
              {/* Filter form */}
              <div className="flex flex-col gap-3 mb-7">
                <label htmlFor="states" className="text-base font-semibold">
                  State
                </label>
                <StateSelect
                  countryid={countryid}
                  onTextChange={(e) => {
                    if (!e.target.value) {
                      setstateid("");
                      setSelectedState("");
                    }
                  }}
                  onChange={(e) => {
                    setstateid(e.id);
                    setSelectedState(e.name);
                  }}
                  placeHolder="Select State"
                  inputClassName="outline-none shadow-formFeilds text-sm font-inter !border-transparent w-full"
                />
              </div>

              <div className="flex flex-col gap-3 mb-7">
                <label htmlFor="states" className="text-base font-semibold">
                  City
                </label>
                <CitySelect
                  countryid={countryid}
                  stateid={stateid}
                  onTextChange={(e) => {
                    if (!e.target.value) {
                      setSelectedCity("");
                    }
                  }}
                  onChange={(e) => {
                    setSelectedCity(e.name);
                  }}
                  placeHolder="Select City"
                  inputClassName="outline-none shadow-formFeilds text-sm font-inter !border-transparent w-full"
                />
              </div>

              <div className="flex flex-col gap-3 mb-7">
                <label htmlFor="city" className="text-base font-semibold">
                  Rating
                </label>
                <select
                  id="rating"
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="outline-none shadow-formFeilds text-sm py-3 rounded-md px-2 border-[1px] border-[#ccc] w-full"
                >
                  <option value="">All Ratings</option>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} Star
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-3 mb-7">
                <label htmlFor="language" className="text-base font-semibold">
                  Language
                </label>
                <select
                  id="language"
                  value={selectedLangauge}
                  onChange={(e) => setSelectedLangauge(e.target.value)}
                  className="outline-none shadow-formFeilds text-sm py-3 rounded-md px-2 border-[1px] border-[#ccc] w-full"
                >
                  <option value="">All Languages</option>
                  {languageList.map((item, index) => (
                    <option key={index} value={item.code}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-7 ">
                  <Checkbox
                    checkboxId="discount"
                    checkboxLable="Have Disounts?"
                    chkd={discount}
                    handleChange={hanndleDiscountChange}
                  />
                </div>

              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-full w-full"
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="mt-4 border-2 border-primary text-primary px-6 py-3 rounded-full w-full hover:bg-primary hover:text-white"
              >
                Reset Filters
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeCategoryPage;
