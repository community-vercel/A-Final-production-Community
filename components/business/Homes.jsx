"use client";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  memo,
  lazy,
  Suspense,
} from "react";
import { automotive, meeting } from "@/assets";
import Link from "next/link";
import Image from "next/image";
import { H3 } from "../Typography";
import { useSelector } from "react-redux";
import Breadcrumb from "../BreadCrum";

const MemoizedLoader = memo(lazy(() => import("../Loader")));
const MemoizedTopBanner = memo(lazy(() => import("@/components/TopBanner")));

const Homes = ({ initialbusinesssData }) => {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const currentPageRef = useRef(1);
  const loader = useRef(null);
  const { user_meta } = useSelector((state) => state.auth);
  const myselectedLanguage = user_meta?.selectedLanguage ?? "en";
  const frontend=process.env.NEXT_PUBLIC_SITE_URL

  const fetchCategories = useCallback(
    async (page = 1) => {
      setIsFetchingMore(true);
      try {
        const response = await fetch(
          `${serverurl}category-count/?page=${page}&page_size=10&language=${myselectedLanguage}`
        );
        const result = await response.json();
        if (response.ok) {
          setCategories((prevCategories) => {
            const uniqueCategories = new Set(
              prevCategories.map((category) => category.id)
            );
            const newCategories = result.categories.filter(
              (category) => !uniqueCategories.has(category.id)
            );
            return [...prevCategories, ...newCategories];
          });
          setTotalPages(result.total_pages);
        } else {
          console.error(result.error || "Failed to fetch categories");
        }
      } catch (error) {
        console.error("An unexpected error occurred", error);
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    },
    [serverurl, myselectedLanguage]
  );

  // Refetch categories on language change
  useEffect(() => {
    setCategories([]); // Clear categories to refetch on language change
    currentPageRef.current = 1; // Reset page count
    setLoading(true); // Set loading to true
    fetchCategories(currentPageRef.current); // Fetch categories for the new language
  }, [fetchCategories, myselectedLanguage]);

  const loadMore = useCallback(() => {
    if (currentPageRef.current < totalPages && !isFetchingMore) {
      currentPageRef.current += 1;
      fetchCategories(currentPageRef.current);
    }
  }, [fetchCategories, isFetchingMore, totalPages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.5 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [loadMore]);

  const metadata = initialbusinesssData
    ? {
        title: initialbusinesssData.metaTitle,

        description: initialbusinesssData.metaDescription,

        keywords: initialbusinesssData.keywords,
        openGraph: {
          title: initialbusinesssData.metaTitle,

          description:
            initialbusinesssData.metaDescription ||
            `Explore ${initialbusinesssData.title} for excellent services and offerings.`,
          url: `${frontend}business/categories/${
            initialbusinesssData.title || "default-slug"
          }`,
          images: [
            `${serverurl}${
              initialbusinesssData.banner?.includes("/api/media/")
                ? initialbusinesssData.banner.replace("/api/media/", "media/")
                : initialbusinesssData.banner || "/path/to/default_banner.jpg"
            }`,
          ],
        },
        twitter: {
          card: "summary_large_image",
          title:
            initialbusinesssData.metaTitle ||
            `${initialbusinesssData.title} - Explore Our Services`,
          description:
            initialbusinesssData.metaDescription ||
            `Find out more about ${
              initialbusinesssData.title
            }, a leader in the  ${
              (initialbusinesssData.title) ||
              " initialbusinesssData"
            } category.`,
          images: [
            `${serverurl}${
              initialbusinesssData.banner?.includes("/api/media/")
                ? initialbusinesssData.banner.replace("/api/media/", "media/")
                : initialbusinesssData.banner || "/path/to/default_logo.jpg"
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

      const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: "Business Home", href: "/business/home" },
      ];
  // Render metadata
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

      <div className="bg-white p-3">
     
        <Suspense fallback={<div>Loading banner...</div>}>
        
          <MemoizedTopBanner
            img={ `${serverurl}${
              initialbusinesssData.banner?.includes("/api/media/")
                ? initialbusinesssData.banner.replace("/api/media/", "media/")
                : initialbusinesssData.banner || "/path/to/default_banner.jpg"
            }`}
            label="Free Listing"
            heading={initialbusinesssData.title}
            btnTxt={
              <span>
                + List your business <strong>for free</strong>
              </span>
            }
          />
        </Suspense>
        <div className="mt-0 grid md:grid-cols-1 gap-6">
    <Breadcrumb items={breadcrumbItems} /> 
   
</div>
        {loading ? (
          <Suspense fallback={<div>Loading...</div>}>
            <MemoizedLoader />
          </Suspense>
        ) : categories.length ? (
          <div className="px-7 py-16 flex gap-x-3 gap-y-5 flex-wrap">
            {categories.map((category) => (
              <div
                className="flex-[170px] lg:flex-grow-0 lg:w-[19%] lg:flex-[19%] bg-white p-3 rounded-xl"
                key={category.id}
              >
                <Link href={`/business/${category.slug}`}>
                  <Image
                    src={
                      category.thumbnail
                        ? `${serverurl}media/${category.thumbnail}`
                        : automotive
                    }
                    alt={`${category.name} category`}
                    priority={category === categories[0]}
                    className="rounded-lg w-full aspect-video object-cover"
                    width={300}
                    height={300}
                    decoding="async"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                  <H3 className="uppercase text-text-color text-base text-center font-semibold mt-4 mb-3">
                    {category.name}
                  </H3>
                </Link>
                <Link href={`/business/home/${category.slug}`}>
                  <span className="text-text-gray text-base text-center inline-block mb-3 w-full">
                    {`${category.business_count || 0} listings`}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div>No category exists</div>
        )}

        {isFetchingMore && (
          <div className="flex items-center justify-center mt-4">
            <Suspense fallback={<div>Loading more...</div>}>
              <MemoizedLoader />
            </Suspense>
          </div>
        )}
        <div ref={loader}></div>
      </div>
    </>
  );
};

export default Homes;
