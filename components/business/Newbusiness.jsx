"use client";
import { inner, twitter } from "@/assets";
import ListTopBanner from "@/components/ListTopBanner";

import {
  EnvelopeIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  StarIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import StarRating from "@/components/StarRating";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import { Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import ReviewsForm from "@/components/ReviewsForm";
import ListTopBanner2 from "@/components/ListTopBanner2";
import Head from "next/head";
import Breadcrumb from "../BreadCrum";
import { H2, H3, H4, H5 } from "../Typography";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import dynamic from "next/dynamic";

const DynamicMapComponent = dynamic(() => import("../AHome/Mapcomponent"), { ssr: false });

export default function Newbusiness({ initialbusinessData }) {
  
  const [business, setBusiness] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
 

  const [stats, setStats] = useState({});
 
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const center = { lat: Number(initialbusinessData.lat?initialbusinessData.lat:40.7128), lng: Number(initialbusinessData.longitude?initialbusinessData.longitude:-74.0060) };  // Default center (e.g., NYC)
  const zoom=8;
  const [showReviewForm, setShowReviewForm] = useState(false);
  const params = useParams();
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const frontend = process.env.NEXT_PUBLIC_SITE_URL;

  const [ownerReply, setOwnerReply] = useState({});

  const { user, user_meta } = useSelector((state) => state.auth);

 
  const [visibleReplyInput, setVisibleReplyInput] = useState(null); // Track visible reply input

  const toggleReplyInput = (reviewId) => {
    if (visibleReplyInput === reviewId) {
      setVisibleReplyInput(null); // Hide if it's already visible
    } else {
      setVisibleReplyInput(reviewId); // Show the clicked review's reply input
    }
  };
  const router = useRouter();

  const logoUrl = business
    ? business.logo
      ? business.logo.includes("/api/media/")
        ? business.logo.replace("/api/media/", "media/")
        : business.logo.includes("media/")
        ? business.logo
        : `media/${business.logo}`
      : ""
    : "";

  const [replies, setReplies] = useState({});
  const favoritePageHide = null;
  const [expandedReplies, setExpandedReplies] = useState({}); // State to track expanded replies

  const toggleFavorite = async () => {
    try {
      // Toggle the local favorite state
      setIsFavorite(!isFavorite);

      // Define the URL for the API endpoint
      const apiUrl = `${serverurl}toggle-favorite/`;

      if (favoritePageHide) {
        // If there's a function to handle hiding the favorite on the page, call it
        favoritePageHide(business.id);

        // Send a POST request to remove the favorite
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            business_id: business.id,
          }),
        });

        const result = await response.json();
        if (!response.ok)
          throw new Error(result.error || "Failed to remove favorite");
      } else {
        // Check if the favorite exists
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            business_id: business.id,
          }),
        });

        const result = await response.json();
        if (!response.ok)
          throw new Error(result.error || "Failed to add favorite");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const apiUrl = `${serverurl}check-toggle-favorite/`;

    const toggleFavorite = async () => {
      if (user.id && !favoritePageHide) {
        try {
          // Send a POST request to check and toggle favorite
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: user.id, // Correctly reference user.id
              business_id: business.id,
            }),
          });

          // Parse the JSON response
          const result = await response.json();

          // Check if the response is okay and update state accordingly
          if (!response.ok) {
            throw new Error(result.error || "Failed to toggle favorite");
          }

          // Update the isFavorite state based on the response
          setIsFavorite(result.is_favorite);
        } catch (error) {
          console.error("Error toggling favorite:", error);
        }
      } else if (favoritePageHide) {
        // If the favorite page is hidden, toggle isFavorite state directly
        setIsFavorite((prev) => !prev);
        favoritePageHide(business.id);
      }
    };

    toggleFavorite(); // Call the async function
  }, [user.id, favoritePageHide, business.id]); // Dependencies

  useEffect(() => {
    const fetchReplies = async (reviewId) => {
      const response = await fetch(
        `${serverurl}get_replies?review_id=${reviewId}`
      );
      const data = await response.json();
      setReplies((prev) => ({ ...prev, [reviewId]: data }));
    };

    reviews.forEach((review) => {
      fetchReplies(review.id);
    });
  }, [reviews, serverurl]);

  const toggleReplies = (reviewId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId], // Toggle the state
    }));
  };
  const [replyInput, setReplyInput] = useState({}); // New state for reply input
  const handleReplySubmit = async (reviewId) => {
    const content = replyInput[reviewId];
    const data = {
      reply: content,
      id: reviewId,
      user_id: user.id,
      isown: user.id === business.user_id,
    };

    if (content) {
      try {
        // Send the reply to the API
        const response = await fetch(`${serverurl}add-review-reply/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to add reply");
        }

        const newReply = await response.json(); // Assuming the API returns the new reply object

        // Update the replies state for the specific review
        setReplies((prev) => ({
          ...prev,
          [reviewId]: [...(prev[reviewId] || []), newReply.reply],
        }));

        // Clear the input after submission
        setReplyInput((prev) => ({ ...prev, [reviewId]: "" }));
      } catch (error) {
        console.error("Error adding reply:", error);
      }
    }
  };

  const hasSocials =
    business.socials && Object.values(business.socials).some((url) => url);

  async function fetchBusinessDetails(slug, user) {

    try {
      setLoading(true);

      // Fetch business details from Django API
      const slug = params.slug;

      const formData = {
        slug: slug,
        user_id: user.id,
        user_role: user_meta.role,
      };
      // Fetch business details, categories, and tags from the Django API
      const response = await fetch(`${serverurl}get-specifibusiness/`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(formData),
      });
      const result = await response.json();
     

      if (result.ErrorCode !== 0) {
        throw new Error(result.ErrorMsg);
      }

      const data = result.data;
 
      if (
        data.approved !== 1 ||
        (data.approved !== "1" && user && data.user_id === user.id)
      ) {
      
      } else if (
        data.approved !== 1 ||
        (data.approved !== "1" && user && user_meta.role === 1)
      ) {
      
      } else if (data.approved !== 1 || data.approved !== "1 ") {
       
        // router.push("/");
      } else {
       
      }

      setBusiness(data);
      setStatus(data.approved);

      // Check if the business is favorited by the user
      // if (user.id) {
      //   const favoriteResponse = await fetch(`/api/favorites/?user_id=${user.id}&business_id=${data.id}`);
      //   const favoriteResult = await favoriteResponse.json();

      //   if (favoriteResult.data && favoriteResult.data.id) {
      //     setIsFavorite(true);
      //   }
      // }

      setLoading(false);

      // Set categories
      setCategories(data.categories);

      // Set reviews
      setReviews(data.reviews);
     

      // Set stats
      setStats(data.statistics);
     
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (params.slug) {
      fetchBusinessDetails(params.slug, user);
    }
  }, [params.slug, user]);

  const [status, setStatus] = useState("0");
  const options = [
    { value: "0", label: "Pending", color: "yellow" },
    { value: "1", label: "Approve", color: "green" },
    { value: "2", label: "Reject", color: "red" },
  ];
  const handleChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    handleStatusChange(e);
  };
  const handleStatusChange = async (e) => {
   
    try {
      const formdata = {
        approved: e.target.value,
        id: business.id,
      };
      const response = await fetch(`${serverurl}update-business-status/`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(formdata),
      });
      const result = await response.json();
      if (response.ok) {
      } else {
        // setError(result.error || 'Failed to fetch status');
      }
    } catch (error) {
      // setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${serverurl}archive-business/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: business.id }),
      });

      const result = await response.json();
      if (response.ok) {
        router.push("/");
      } else {
        console.error(result.ErrorMsg || "Failed to archive business");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  // favroite

  const constructBreadcrumbItems = () => {
    // Replace with actual category data fetching if necessary
    const breadcrumbItems = [
      { label: "Home", href: "/" },
      { label: "All Businesses", href: "/business/allbusiness" },
    ];

    // Find the current category based on the params.id
    const currentCategory =
      business && business.slug === params.slug ? business : null;
   
    if (currentCategory) {
      breadcrumbItems.push({
        label: currentCategory.name,
        href: `/business/categories//${currentCategory.slug}`,
      }); // Link to the current category
    }

    return breadcrumbItems;
  };
  const metadata = initialbusinessData
    ? {
        title: initialbusinessData.metaname,
        description: initialbusinessData.metades,
        keywords: initialbusinessData.keyword,
        openGraph: {
          title: initialbusinessData.metaname,
          description:
            initialbusinessData.metades ||
            `Explore ${initialbusinessData.description} for excellent services and offerings.`,
          url: `${frontend}business/categories/${
            initialbusinessData.slug || "default-slug"
          }`,
          images: [
            `${serverurl}${
              initialbusinessData.logo?.includes("/api/media/")
                ? initialbusinessData.logo.replace("/api/media/", "media/")
                : initialbusinessData.logo || "/path/to/default_logo.jpg"
            }`,
          ],
        },
        twitter: {
          card: "summary_large_image",
          title:
            initialbusinessData.metaname ||
            `${initialbusinessData.name} - Explore Our Services`,
          description:
            initialbusinessData.metades ||
            `Find out more about ${
              initialbusinessData.name
            }, a leader in the  ${
              (initialbusinessData.categories &&
                initialbusinessData.categories[0].category__name) ||
              " initialbusinessData"
            } category.`,
          images: [
            `${serverurl}${
              initialbusinessData.logo?.includes("/api/media/")
                ? initialbusinessData.logo.replace("/api/media/", "media/")
                : initialbusinessData.logo || "/path/to/default_logo.jpg"
            }`,
          ],
        },
      }
    : {
        // Default metadata if no business object is available
        title: "Explore Top Businesses and Services",
        description:
          "Discover top businesses, services, and products across various industries.",
        keywords:
          "businesses, services, products, top-rated companies, best businesses",
        openGraph: {
          title: "Explore Top Businesses and Services",
          description:
            "Find trusted businesses in your area for a variety of services and products.",
          url: `${frontend}business/categories/`,
          images: ["https://yourwebsite.com/path/to/default_image.jpg"],
        },
        twitter: {
          card: "summary_large_image",
          title: "Explore Top Businesses and Services",
          description:
            "Connect with reliable businesses across multiple categories.",
          images: ["https://yourwebsite.com/path/to/default_image.jpg"],
        },
      };

   // Sample location data

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };
  return (
    <>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="keywords" content={metadata.keywords} />
      <meta property="og:title" content={metadata.openGraph.title} />
      <meta
        property="og:description"
        content={metadata.openGraph.description}
      />
      <meta property="og:url" content={metadata.openGraph.url} />
      <meta property="og:image" content={metadata.openGraph.images} />
      <meta name="twitter:title" content={metadata.twitter.title} />
      <meta name="twitter:description" content={metadata.twitter.description} />
      <meta name="twitter:image" content={metadata.twitter.images} />

      {loading ? (
        <div className="">Loading</div>
      ) : (
        <div>
          <div className="relative">
            {(user_meta.role === 1 || user.id == business.user_id) && (
              <div className="fixed z-10 right-5 top-[130px] flex gap-2 flex-wrap">
                <button
                  className="bg-red-500 text-white w-7 h-7 rounded-full flex justify-center items-center"
                  onClick={handleDelete}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>

                <Link
                  href={`/business/update/${business.slug}`}
                  className="bg-primary text-white w-7 h-7 rounded-full flex justify-center items-center"
                  title="edit"
                >
                  <PencilIcon className="w-5 h-5" />
                </Link>

                {user_meta.role === 1 && (
                  <div className="relative inline-block cursor-pointer">
                    <select
                      value={status}
                      onChange={handleChange}
                      className={`pl-6 pr-4 text-sm py-1 border cursor-pointer rounded-md appearance-none focus:outline-none focus:ring-2 ${
                        status == "0"
                          ? "text-yellow-500"
                          : status == "1"
                          ? "text-green-500"
                          : "text-red-500"
                      } font-bold uppercase`}
                    >
                      {options.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className={`text-${option.color}-600 uppercase font-bold cursor-pointer`}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div
                      className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full ${
                        status == "0"
                          ? "bg-yellow-500"
                          : status == "1"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                  </div>
                )}
              </div>
            )}

            <ListTopBanner2
              img={
                business.images && business.images.length > 0
                  ? `${serverurl}media/${business.images[0]}`
                  : inner
              }
              // img={business.images ?`${serverurl}+'media/'`+ business.images.split(",")[0] : inner}
              heading={business.name}
              label={
                business &&
                business.categories.length &&
                business.categories[0].category__name
              }
              website={business.website}
              call={business.phone}
              direction=""
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              user_id={user.id || null}
            />
            <div className="px-7 ">
              <Breadcrumb items={constructBreadcrumbItems()} />
            </div>
            {/* </div> */}
          </div>
          {/* </div> */}
          <div className="px-7  py-4 flex flex-col lg:flex-row gap-5">
            <div className="md:flex-[25%]">
              <div className="bg-white p-8 rounded-3xl sticky top-20">
                <div className="flex gap-3 items-center">
                  <div className="p-1 rounded-md bg-[#F1F3F6]">
                    <MapPinIcon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="text-[#1E1E1F] text-sm leading-6">
                    {business.location ||
                    business.city ||
                    business.state ||
                    business.zip
                      ? [
                          business.location && `${business.location}`,
                          business.city && `${business.city}`,
                          business.state && `${business.state} ${business.zip}`,
                        ]
                          .filter(Boolean)
                          .join(", ")
                      : "No location data"}
                  </span>
                </div>

                <div className="flex gap-3 items-center mt-5">
                  <div className="p-1 flex items-center justify-center w-[2.3rem] h-[2.3rem] rounded-md bg-[#F1F3F6]">
                    <EnvelopeIcon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[#1E1E1F] text-sm leading-6">
                    {business.email ? business.email : "No email provided"}
                  </span>
                </div>

                <div className="flex gap-3 items-center mt-5">
                  <div className="p-1 flex items-center justify-center w-[2.3rem] h-[2.3rem] rounded-md bg-[#F1F3F6]">
                    <PhoneIcon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[#1E1E1F] text-sm leading-6">
                    {business.phone ? business.phone : "No email provided"}
                  </span>
                </div>

                {business.website && (
                  <div className="flex gap-3 items-center mt-5">
                    <div className="p-1 flex items-center justify-center w-[2.3rem] h-[2.3rem] rounded-md bg-[#F1F3F6]">
                      <LinkIcon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-[#1E1E1F] text-sm leading-6">
                      <Link href={business.website}>
                        {business.website
                          ? business.website
                          : "No email provided"}
                      </Link>
                    </span>
                  </div>
                )}

                {business.website && (
                  <div className="flex gap-3 items-center mt-5">
                    <div className="p-1 flex items-center justify-center w-[2.3rem] h-[2.3rem] rounded-md bg-[#F1F3F6]">
                      <StarIcon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-[#1E1E1F] text-sm leading-6">
                      <StarRating rating={stats ? stats.avg_rating : 0} />
                    </span>
                  </div>
                )}

                {business.socials && (
                  <div className="mt-8">
                    {hasSocials ? (
                      <H3 className="text-xl font-bold mb-5 text-text-color">
                        Social Media
                      </H3>
                    ) : null}

                    <div className="flex gap-2 flex-wrap">
                      {business.socials.facebook && (
                        <Link
                          href={business.socials.facebook}
                          className="p-2 flex items-center justify-center rounded-md w-9 h-9 bg-[#F1F3F6]"
                          target="_blank"
                        >
                          <span className="text-primary font-bold text-xl text-center">
                            f
                          </span>
                        </Link>
                      )}

                      {business.socials.instagram && (
                        <Link
                          href={business.socials.instagram}
                          className="p-2 flex items-center justify-center rounded-md w-9 h-9 bg-[#F1F3F6]"
                          target="_blank"
                        >
                          <span className="text-primary font-bold text-xl text-center">
                            i
                          </span>
                        </Link>
                      )}

                      {business.socials.tiktok && (
                        <Link
                          href={business.socials.tiktok}
                          className="p-2 flex items-center justify-center rounded-md w-9 h-9 bg-[#F1F3F6]"
                          target="_blank"
                        >
                          <span className="text-primary font-bold text-xl text-center">
                            t
                          </span>
                        </Link>
                      )}

                      {business.socials.youtube && (
                        <Link
                          href={business.socials.youtube}
                          className="p-2 flex items-center justify-center rounded-md w-9 h-9 bg-[#F1F3F6]"
                          target="_blank"
                        >
                          <span className="text-primary font-bold text-xl text-center">
                            Y
                          </span>
                        </Link>
                      )}

                      {business.socials.twitter && (
                        <Link
                          href={business.socials.twitter}
                          className="p-2 flex items-center justify-center rounded-md w-9 h-9 bg-[#F1F3F6]"
                          target="_blank"
                        >
                          <Image src={twitter} alt="" />
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:flex-[75%] ">
              <div className="bg-white py-2 px-8 mb-4 rounded-3xl text-green-400">
                <div className="flex items-center justify-between">
                  {logoUrl && (
                    <div className="relative w-[5vw] h-[5vw] rounded-full overflow-hidden ">
                      <Image
                        src={`${serverurl}${logoUrl}`}
                        alt="My Logo"
                        layout="fill"
                        // className="object-cover" // Use objectFit to cover the entire area
                      />
                    </div>
                  )}
                  <div>
                    {business.discount_code && business.discount_message ? (
                      <span>
                        {business.discount_message
                          .split("[code]")
                          .map((part, index) => (
                            <React.Fragment key={index}>
                              {part}
                              {index === 0 && (
                                <span className="font-bold">{`  ${business.discount_code}`}</span>
                              )}
                            </React.Fragment>
                          ))}
                      </span>
                    ) : (
                      <span>{null}</span>
                    )}
                  </div>
                </div>
              </div>

              {business.images && business.images.length > 1 && (
                <div className="bg-white mb-8 rounded-xl">
                  <Swiper
                    pagination={{ clickable: true }}
                    modules={[Pagination]}
                    className="swipperMain w-full max-w-120 md:max-w-3xl  "
                  >
                    {business.images.map((img, index) => (
                      <SwiperSlide key={index}>
                        <Image
                          src={`${serverurl}media/${img}`}
                          className="flex rounded-md !w-full  "
                          width={1000}
                          height={200}
                          alt={`Image ${index + 1}`}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}

              {/* {business.images && business.images.split(",").length > 1 && (
                <div className="bg-white mb-8 rounded-3xl">
                  <Swiper
                    pagination={{ clickable: true }}
                    modules={[Pagination]}
                    className="swipperMain w-full max-w-80 md:max-w-xl "
                  >
                    {business.images.split(",").map((img, index) => (
                      <>
                        {img && (
                          <SwiperSlide key={index}>
                            <Image
                              src={`${serverurl}+'media'`+img}
                              className="flex rounded-md !w-full"
                              width={1000}
                              height={1000}
                              alt=""
                            />
                          </SwiperSlide>
                        )}
                      </>
                    ))}
                  </Swiper>
                </div>
              )} */}

              <div className="bg-white p-8 rounded-3xl">
                <H3 className="text-xl font-bold mb-3 text-text-color">
                  Business Details
                </H3>
                <p className="text-sm leading-6">
                  <strong>ABOUT</strong>
                  <br />
                  {business.description}
                </p>

                <div className="mt-6">
                  <H2 className="text-2xl font-bold mb-4">Categories</H2>
                  <div className="flex flex-col space-y-4">
                    {business.categories
                      .filter(
                        (item, index, self) =>
                          index ===
                          self.findIndex(
                            (t) => t.category__id === item.category__id
                          )
                      )
                      .map((category) => (
                        <div
                          key={category.category__id}
                          className="p-4 border border-gray-300 rounded-lg shadow-md flex items-center"
                        >
                          <H3 className="text-lg font-semibold text-blue-600">
                            <Link
                              href={`/business/${category.category__slug}`}
                            >
                              {category.category__name}
                            </Link>
                          </H3>

                          {/* Display subcategories on the same line */}
                          <div className="flex flex-wrap items-center ml-4">
                            {business.categories
                              .filter(
                                (subItem) =>
                                  subItem.subcategory__id &&
                                  subItem.category__id === category.category__id
                              )
                              .map((subItem, index) => (
                                <Link
                                  href={''}
                                  key={subItem.subcategory__id}
                                  className="text-sm text-gray-700 hover:underline flex items-center"
                                  title={`View all ${subItem.subcategory__name} places`}
                                >
                                  {index > 0 && (
                                    <span className="text-gray-500 mx-1">
                                      |
                                    </span>
                                  )}{" "}
                                  {/* Separator */}
                                  {subItem.subcategory__name}
                                </Link>
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl mt-7">
                {user.id && user.id !== business.user_id ? (
                  <>
                    {!showReviewForm && (
                      <div className="flex justify-between flex-wrap gap-4 items-center">
                        <span className="text-bold">
                          Give us your valuable review
                        </span>
                        <button
                          className="py-2 px-6 inline-block rounded-full border border-primary text-primary"
                          onClick={() => setShowReviewForm(!showReviewForm)}
                        >
                          Write
                        </button>
                      </div>
                    )}
                    {showReviewForm && (
                      <ReviewsForm
                        business_id={business.id}
                        user_id={user.id}
                        user_email={user.email}
                        showReviewForm={showReviewForm}
                        setShowReviewForm={setShowReviewForm}
                        setReviews={setReviews}
                      />
                    )}
                  </>
                ) : user.id && user.id === business.user_id ? (
                  <div className="flex justify-between flex-wrap gap-4 items-center">
                    <span className="text-bold">
                      You Cant Review Your Own Business{" "}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between flex-wrap gap-4 items-center">
                    <span className="text-bold">
                      You need to log in to give a review.
                    </span>
                    <Link
                      href="/login"
                      className="py-2 px-6 inline-block rounded-full border border-primary text-primary"
                    >
                      Login
                    </Link>
                  </div>
                )}
              </div>
              {reviews && reviews.length > 0 && (
                <div className="bg-white p-8 rounded-3xl mt-7">
                  <div className="flex justify-between flex-wrap gap-3 items-center">
                    <H3 className="text-xl font-bold mb-3 text-text-color">
                      Customer Reviews
                    </H3>
                    <div className="flex justify-end flex-col">
                      <StarRating rating={stats?.avg_rating} />
                      <H5 className="">
                        Rating{" "}
                        <span className="font-bold text-2xl">
                          {stats?.avg_rating.toFixed(1)}
                        </span>
                        <span className="font-bold text-sm">/5.0</span> from{" "}
                        <span className="font-bold text-2xl">
                          {stats?.total_count}
                        </span>{" "}
                        review(s)
                      </H5>
                    </div>
                  </div>

                  <div className="mt-2">
                    {reviews.map((review) => (
                      <div className="py-3 mb-3 border-b-2" key={review.id}>
                        <StarRating rating={review.rating} />
                        <H3 className="text-xl font-bold capitalize pt-1">
                          {review.title}
                        </H3>
                        <div className="pt-2 pb-4">{review.review}</div>

                        {review.review_files &&
                          review.review_files.split(",").length > 0 && (
                            <div className="flex gap-3 flex-wrap">
                              {review.review_files
                                .split(",")
                                .map(
                                  (img, i) =>
                                    img && (
                                      <Image
                                        src={`${serverurl}${
                                          img.includes("/api/")
                                            ? img.replace("/api/", "")
                                            : img
                                        }`}
                                        alt=""
                                        key={i}
                                        width={200}
                                        height={200}
                                        className="flex-grow-0 aspect-square rounded-sm"
                                      />
                                    )
                                )}
                            </div>
                          )}

                        {/* Display Owner's Reply if it exists */}
                        {review.owner_reply && (
                          <div className="bg-white p-6 rounded-lg shadow-md mt-4">
                            <H4 className="text-lg font-semibold text-gray-800">
                              Owner Reply
                            </H4>
                            <p className="mt-3 text-gray-700">
                              {review.owner_reply}
                            </p>
                            <div className="mt-2 text-gray-500 text-sm">
                              <span>
                                {new Date(review.created_at).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Display the replies */}
                        <div className="mt-2">
                          <H3 className="text-xl font-semibold">
                            Review Replies
                          </H3>
                          {replies[review.id] &&
                          replies[review.id].length > 0 ? (
                            <div className="mt-4">
                              {(expandedReplies[review.id]
                                ? replies[review.id]
                                : replies[review.id].slice(0, 2)
                              ).map((reply) => (
                                <div
                                  key={reply.id}
                                  className="bg-white p-5 rounded-lg shadow-lg mt-2 border border-gray-200 transition-shadow hover:shadow-xl"
                                >
                                  <div className="flex items-start">
                                    <img
                                      src="https://cdn3.iconfinder.com/data/icons/professional-avatar-14/130/professional-17-512.png"
                                      alt="User Avatar"
                                      className="h-12 w-12 rounded-full border border-gray-300 shadow-sm"
                                    />
                                    <div className="ml-4 w-full">
                                      <div className="flex justify-between items-center">
                                        <p className="text-gray-800 font-medium text-sm">
                                          {reply.isreviewwown
                                            ? reply.user__name + " (Owner)"
                                            : reply.user__name}
                                        </p>
                                        <span className="text-gray-500 text-xs">
                                          {new Date(
                                            reply.created_at
                                          ).toLocaleString()}
                                        </span>
                                      </div>
                                      <p className="mt-2 text-gray-400 text-base">
                                        {reply.content}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              {replies[review.id].length > 2 && (
                                <button
                                  className="mt-2 text-blue-500 hover:underline"
                                  onClick={() => toggleReplies(review.id)}
                                >
                                  {expandedReplies[review.id]
                                    ? "Show Less"
                                    : "Read More"}
                                </button>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 mt-2">
                              No replies for this review.
                            </p>
                          )}
                        </div>
                        {user.role && (
                          <div className="mt-4">
                            {/* Button to show/hide the reply input */}
                            <button
                              className="py-1 px-3 mt-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition duration-200"
                              onClick={() => toggleReplyInput(review.id)}
                            >
                              {visibleReplyInput === review.id
                                ? "Cancel"
                                : "Reply"}
                            </button>

                            {/* Conditionally render the reply input if visible */}
                            {visibleReplyInput === review.id && (
                              <div className="mt-4">
                                <textarea
                                  className="border p-2 rounded-md w-full h-24 resize-none"
                                  placeholder="Type your reply here..."
                                  value={replyInput[review.id] || ""}
                                  onChange={(e) =>
                                    setReplyInput((prev) => ({
                                      ...prev,
                                      [review.id]: e.target.value,
                                    }))
                                  }
                                />
                                <button
                                  className="py-1 px-3 mt-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition duration-200"
                                  onClick={() => handleReplySubmit(review.id)}
                                >
                                  Submit Reply
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        {/* Reply Input */}
                        {/* {user.role && (
            <div className="mt-4">
              <textarea
                className="border p-2 rounded-md w-full h-24 resize-none"
                placeholder="Type your reply here..."
                value={replyInput[review.id] || ""}
                onChange={(e) => setReplyInput((prev) => ({ ...prev, [review.id]: e.target.value }))}
              />
              <button
                className="py-1 px-3 mt-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition duration-200"
                onClick={() => handleReplySubmit(review.id)}
              >
                Submit Reply
              </button>
            </div>
          )} */}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* <div className="bg-white p-8 rounded-3xl mt-7">
                {user.id ? (
                  <>
                    {!showReviewForm && (
                      <div className="flex justify-between flex-wrap gap-4 items-center">
                        <span className="text-bold">
                          Give us your valueable review
                        </span>
                        <button
                          className="py-2 px-6 inline-block rounded-full border border-primary text-primary "
                          onClick={() => setShowReviewForm(!showReviewForm)}
                        >
                          Write
                        </button>
                      </div>
                    )}
                    {showReviewForm && (
                      <ReviewsForm
                        business_id={business.id}
                        user_id={user.id}
                        user_email={user.email}
                        showReviewForm={showReviewForm}
                        setShowReviewForm={setShowReviewForm}
                      />
                    )}
                  </>
                ) : (
                  <div className="flex justify-between flex-wrap gap-4 items-center">
                    <span className="text-bold">
                      You need to logged in to give review.
                    </span>
                    <Link
                      href="/login"
                      className="py-2 px-6 inline-block rounded-full border border-primary text-primary "
                    >
                      Login
                    </Link>
                  </div>
                )}
              </div>

              {reviews?reviews.length > 0 && (
                <div className="bg-white p-8 rounded-3xl mt-7">
                  <div className="flex justify-between flex-wrap gap-3 items-center">
                    <H3  className="text-xl font-bold mb-3 text-text-color">
                      Customer Reviews
                    </H3 >
                    <div className="flex justify-end flex-col">
                      <StarRating rating={stats?.avg_rating} />
                      <h5 className="">
                        Rating{" "}
                        <span className="font-bold text-2xl">
                          {stats?.avg_rating.toFixed(1)}
                        </span>
                        <span className="font-bold text-sm">/5.0</span> from{" "}
                        <span className="font-bold text-2xl">
                          {stats?.total_count}
                        </span>{" "}
                        review(s)
                      </h5>
                    </div>
                  </div>

                  <div className="mt-2">
                    {reviews.map((review) => {
                      return (
                        <div className="py-3 mb-3 border-b-2" key={review.id}>
                          <StarRating rating={review.rating} />
                          <H3  className="text-xl font-bold capitalize pt-1">
                            {review.title}
                          </H3 >
                          <div className="pt-2 pb-4">{review.review}</div>
{review.review_files &&
  review.review_files.split(",").length > 0 && (
    <div className="flex gap-3 flex-wrap">
      {review.review_files
        .split(",")
        .map((img, i) => (
          <>
            {img && (
              <Image
                src={`${serverurl}${img.includes('/api/') ? img.replace('/api/', '') : img}`}
                alt=""
                key={i}
                width={200}
                height={200}
                className="flex-grow-0 aspect-square rounded-sm"
              />
            )}
          </>
        ))}
    </div>
  )}

                        </div>
                      );
                    })}
                  </div>
                </div>
              ):[]} */}

              <div className="bg-white mt-7 p-8 rounded-3xl">
              <DynamicMapComponent
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        markerData={{
          id: initialbusinessData.id,
          lat: initialbusinessData.lat,
          lng: initialbusinessData.longitude,
          location: initialbusinessData.location,
        }}
      />
               
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
