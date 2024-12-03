"use client";
import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "react-country-state-city/dist/react-country-state-city.css";
import PropertyCarousel from "@/components/PropertyCarousel";
import Featuredbusiness from "./Featuredbusiness";
import Featuredjobs from "./Jobsfeatured";
import Featuredevent from "./eventFeature";
import TopBanner from "../TopBanner";
export default function PropertyHome({
  initialData,
  initialbusinesssData,
  initialfeatureData,
  initialfeaturejobsData,
  initialfeatureseventData,
}) {
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;

  const [properties, setProperties] = useState(
    initialfeatureData ? initialfeatureData.data : []
  );

  const [newproperties, setnewProperties] = useState([]);
  const { user_meta } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);

  const [initialbusiness, setInitialbusiness] = useState(
    initialbusinesssData ? initialbusinesssData.data : []
  );
  const [jobs, setJobs] = useState(
    initialfeaturejobsData ? initialfeaturejobsData.data : []
  );
  const [events, setEvents] = [
    initialfeatureseventData ? initialfeatureseventData.data : [],
  ];

  const frontend = process.env.NEXT_PUBLIC_SITE_URL;

  useEffect(() => {
    // if (properties || initialbusiness || events || jobs ) {
    setIsLoading(false);
    // }
  }, []);

  const metadata = initialData
    ? {
        title: initialData.metaTitle,

        description: initialData.metaDescription,

        keywords: initialData.keywords,
        openGraph: {
          title: initialData.metaTitle,

          description:
            initialData.metaDescription ||
            `Explore ${initialData.title} for excellent services and offerings.`,
          url: `${frontend}business/categories/${
            initialData.title || "default-slug"
          }`,
          images: [
            `${serverurl}${
              initialData.banner?.includes("/api/media/")
                ? initialData.banner.replace("/api/media/", "media/")
                : initialData.banner || "/path/to/default_banner.jpg"
            }`,
          ],
        },
        twitter: {
          card: "summary_large_image",
          title:
            initialData.metaTitle ||
            `${initialData.title} - Explore Our Services`,
          description:
            initialData.metaDescription ||
            `Find out more about ${initialData.title}, a leader in the  ${
              initialData.title || " initialData"
            } category.`,
          images: [
            `${serverurl}${
              initialData.banner?.includes("/api/media/")
                ? initialData.banner.replace("/api/media/", "media/")
                : initialData.banner || "/path/to/default_logo.jpg"
            }`,
          ],
        },
      }
    : {
        jobs: {
          title: "Explore Top Jobs and Career Opportunities",
          description:
            "Discover top job openings and career opportunities in various industries.",
          keywords: "jobs, career opportunities, top employers, job openings",
          openGraph: {
            title: "Explore Top Jobs and Career Opportunities",
            description:
              "Find top job listings and career opportunities in your area and beyond.",
            url: `${frontend}jobs/`,
            images: ["https://yourwebsite.com/path/to/default_image.jpg"],
          },
          twitter: {
            card: "summary_large_image",
            title: "Explore Top Jobs and Career Opportunities",
            description:
              "Connect with leading employers and find your next career opportunity.",
            images: ["https://yourwebsite.com/path/to/default_image.jpg"],
          },
        },
        properties: {
          title: "Explore Top Properties and Real Estate Listings",
          description:
            "Find the best properties and real estate listings in your area.",
          keywords:
            "real estate, properties, homes for sale, apartments for rent",
          openGraph: {
            title: "Explore Top Properties and Real Estate Listings",
            description:
              "Browse the top real estate listings to find your dream home or investment property.",
            url: `${frontend}properties/`,
            images: ["https://yourwebsite.com/path/to/default_image.jpg"],
          },
          twitter: {
            card: "summary_large_image",
            title: "Explore Top Properties and Real Estate Listings",
            description:
              "Explore premium properties and real estate offerings in your area.",
            images: ["https://yourwebsite.com/path/to/default_image.jpg"],
          },
        },
        business: {
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
        },
        events: {
          title: "Explore Upcoming Events and Activities",
          description:
            "Stay updated on upcoming events, conferences, and activities.",
          keywords:
            "events, conferences, activities, things to do, local events",
          openGraph: {
            title: "Explore Upcoming Events and Activities",
            description:
              "Find exciting events, conferences, and activities happening near you.",
            url: `${frontend}events/`,
            images: ["https://yourwebsite.com/path/to/default_image.jpg"],
          },
          twitter: {
            card: "summary_large_image",
            title: "Explore Upcoming Events and Activities",
            description:
              "Stay informed about the latest events and activities in your area.",
            images: ["https://yourwebsite.com/path/to/default_image.jpg"],
          },
        },
      };

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
      <Box sx={{ minHeight: "100vh", backgroundColor: "#fff" }}>
        <div className=" p-3 ">
          <TopBanner
            img={`${serverurl}${
              initialData.banner?.includes("/api/media/")
                ? initialData.banner.replace("/api/media/", "media/")
                : initialData.banner || "/path/to/default_banner.jpg"
            }`}
            label="Free Listing"
            heading={initialData.title}
            btnTxt={
              <span>
                <strong>{initialData?.title}</strong>
              </span>
            }
          />
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <div>
              {initialbusiness && initialbusiness && (
                <div>
                  <Typography
                    variant="h5"
                    sx={{ marginTop: 5, marginBottom: 2, fontWeight: 600 }}
                  >
                    Business Directory
                  </Typography>
                  <Featuredbusiness
                    business={initialbusiness}
                    serverurl={serverurl}
                  />
                </div>
              )}
              {initialfeatureData && initialfeatureData && (
                <div>
                  <Typography
                    variant="h5"
                    sx={{ marginBottom: 2, fontWeight: 600 }}
                  >
                    Property
                  </Typography>
                  <PropertyCarousel
                    properties={properties}
                    serverurl={serverurl}
                  />
                </div>
              )}
              {initialfeaturejobsData && initialfeaturejobsData && (
                <div>
                  <Typography
                    variant="h5"
                    sx={{ marginTop: 5, marginBottom: 2, fontWeight: 600 }}
                  >
                    Jobs
                  </Typography>
                  <Featuredjobs jobs={jobs} serverurl={serverurl} />
                </div>
              )}
              {initialfeatureseventData && initialfeatureseventData && (
                <div>
                  <Typography
                    variant="h5"
                    sx={{ marginTop: 5, marginBottom: 2, fontWeight: 600 }}
                  >
                    Events
                  </Typography>
                  <Featuredevent events={events} serverurl={serverurl} />
                </div>
              )}
            </div>
          )}
        </div>
      </Box>
    </>
  );
}
