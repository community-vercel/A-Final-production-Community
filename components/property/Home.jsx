"use client";
import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "react-country-state-city/dist/react-country-state-city.css";
import SubProperties from "@/components/SubProperties";
import PropertyCarousel from "@/components/PropertyCarousel";
import HeroSection from "@/components/HeroSection";
import SearchCarousel from "@/components/SearchCarousel";
export default function PropertyHome({ initialpropertiesData }) {
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;

  const [loading, setLoading] = useState();
  const [type, setType] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [properties, setProperties] = useState([]);

  const [newproperties, setnewProperties] = useState([]);
  const { user_meta } = useSelector((state) => state.auth);
  const [viewproperties, setviewProperties] = useState([]);
  const countryid = 233;
  const selectedLanguage = user_meta.selectedLanguage || "en";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (properties && viewproperties) {
      setIsLoading(false);
    }
  }, [properties, viewproperties]);
  const filteredItems = Array.isArray(type)
    ? type.filter(
        (item) =>
          item.name &&
          item.name.toLowerCase().includes(filterText.toLowerCase())
      )
    : [];
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        let response;
        const headers = { "Content-Type": "application/json" };
        const url = `${serverurl}get-type/`;

        const options = {
          method: "POST",
          headers,
        };

        response = await fetch(url, options);

        const result = await response.json();

        if (response.ok) {
          setType(result.types);
        } else {
          setError(result.error || "Failed to fetch businesses");
        }
      } catch (error) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, []);

  const truncateText = (text, maxChars) => {
    return text.length > maxChars ? text.slice(0, maxChars) + "..." : text;
  };

  useEffect(() => {
    const fetchProperties = async () => {
      const formData = {
        language: selectedLanguage,
      };
      try {
        const response = await fetch(`${serverurl}get-allfeaturedproperties/`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (response.ok) {
          setProperties(result.data);
        } else {
          console.error(result.error || "Failed to fetch categories");
        }
      } catch (error) {
        console.error("An unexpected error occurred", error);
      }

      try {
        const response2 = await fetch(`${serverurl}get-mostviewed/`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(formData),
        });
        const result2 = await response2.json();
        if (response2.ok) {
          setviewProperties(result2);
        } else {
          console.error(result2.error || "Failed to fetch categories");
        }
      } catch (error) {
        console.error("An unexpected error occurred", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [selectedLanguage]); 

  const [stateid, setstateid] = useState(0);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [zip, setZip] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = {
      state: selectedState,
      city: selectedCity,
      zip: zip,
    };
    try {
      const response = await fetch(`${serverurl}get-searchstateproperties/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
  

      if (result.ErrorCode === 0) {
        setnewProperties(result.data);
      } else {
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };
  const frontend = process.env.NEXT_PUBLIC_SITE_URL;

  const metadata = initialpropertiesData
    ? {
        title: initialpropertiesData.metaTitle || initialpropertiesData.title,
        description:
          initialpropertiesData.metaDescription ||
          `Explore ${initialpropertiesData.description} for exceptional properties and listings.`,
        keywords:
          initialpropertiesData.keywords ||
          "properties, real estate, listings, top properties",
        openGraph: {
          title: initialpropertiesData.metaTitle || initialpropertiesData.title,
          description:
            initialpropertiesData.metaDescription ||
            `Explore ${initialpropertiesData.title} for a variety of property options.`,
          url: `${frontend}property/types/${
            initialpropertiesData.title || "default-slug"
          }`,
          images: [
            `${serverurl}${
              initialpropertiesData.banner?.includes("/api/media/")
                ? initialpropertiesData.banner.replace("/api/media/", "media/")
                : initialpropertiesData.banner || "/path/to/default_image.jpg"
            }`,
          ],
        },
        twitter: {
          card: "summary_large_image",
          title:
            initialpropertiesData.metaTitle ||
            `${initialpropertiesData.title} - Discover Our Properties`,
          description:
            initialpropertiesData.metaDescription ||
            `Learn more about ${
              initialpropertiesData.title
            }, offering top listings in the ${
              (initialpropertiesData.title && initialpropertiesData.title) ||
              "property"
            } category.`,
          images: [
            `${serverurl}${
              initialpropertiesData.banner?.includes("/api/media/")
                ? initialpropertiesData.banner.replace("/api/media/", "media/")
                : initialpropertiesData.banner || "/path/to/default_image.jpg"
            }`,
          ],
        },
      }
    : {
       
        title: "Explore Top Properties and Listings",
        description:
          "Discover top properties, real estate, and listings in various locations.",
        keywords:
          "properties, real estate, listings, top properties, best real estate",
        openGraph: {
          title: "Explore Top Properties and Listings",
          description:
            "Find trusted property listings in your area across various types and locations.",
          url: `${frontend}places/category/property/`,
          images: ["https://yourwebsite.com/path/to/default_image.jpg"],
        },
        twitter: {
          card: "summary_large_image",
          title: "Explore Top Properties and Listings",
          description:
            "Connect with reliable property listings across multiple categories.",
          images: ["https://yourwebsite.com/path/to/default_image.jpg"],
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
        {/* Hero Section */}
        <div className="p-3">

        <HeroSection
          handleSearch={handleSearch}
          countryid={countryid}
          setstateid={setstateid}
          setSelectedCity={setSelectedCity}
          setSelectedState={setSelectedState}
          setZip={setZip}
          stateid={stateid}
          zip={zip}
          title={initialpropertiesData.title}
          image={`${serverurl}${
            initialpropertiesData.banner?.includes("/api/media/")
              ? initialpropertiesData.banner.replace("/api/media/", "media/")
              : initialpropertiesData.banner || "/path/to/default_image.jpg"
          }`}
        />

        {newproperties.length > 0 && (
         <div>
            <Typography
              variant="h5"
              sx={{
                marginBottom: 0,
                marginLeft: 5,
                marginTop: 5,
                fontWeight: 600,
              }}
            >
              Searched Properties
            </Typography>
            <SearchCarousel properties={newproperties} serverurl={serverurl} />
            </div>
        )}

        <SubProperties filteredItems={filteredItems} />
        <Box sx={{ padding: "40px" }}>
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
            
              {properties && properties.length > 0 && (
               <div>
                  <Typography
                    variant="h5"
                    sx={{ marginBottom: 2, fontWeight: 600 }}
                  >
                    Featured Properties
                  </Typography>
                  <PropertyCarousel
                    properties={properties}
                    serverurl={serverurl}
                  />
               </div>
              )}
              {viewproperties && viewproperties.length > 0 && (
               <div>
                  <Typography
                    variant="h5"
                    sx={{ marginTop: 5, marginBottom: 2, fontWeight: 600 }}
                  >
                    Most Viewed Properties
                  </Typography>
                  <PropertyCarousel
                    properties={viewproperties}
                    serverurl={serverurl}
                  />
                  </div>
              )}
              </div>
          )}
        </Box>
        </div>
      </Box>
    </>
  );
}

