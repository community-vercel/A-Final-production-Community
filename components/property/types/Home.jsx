"use client";
import React, { useEffect, useState } from "react";
import { automotive } from "@/assets"; // Assuming this is your default image
import Link from "next/link";
import { useSelector } from "react-redux";
import FilterBar from "@/components/Filter";
import { useParams } from "next/navigation";
import Image from "next/image";
import Breadcrumb from "@/components/BreadCrum";
import { H4 } from "@/components/Typography";

const  TypeHome = ({initialPropertyData}) => {

  const [business, setBusiness] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const params = useParams();
  const name=params.name.trim();
  const frontend = process.env.NEXT_PUBLIC_SITE_URL;

  const formatNameForUrl = (name) => {
    return decodeURIComponent(name)
      .trim()
      .replace(/\s+/g, ' ')           
      .replace(/[^\w-]+/g, ' ')       
      .replace(/--+/g, ' ')          
      .replace(/^-+|-+$/g, ' ');      
  };

  const names=formatNameForUrl(name);

  const [loading, setLoading] = useState(true);
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const { user_meta } = useSelector((state) => state.auth);
 
  const selectedLanguage = user_meta.selectedLanguage;
  const [filters, setFilters] = useState({

  });


  useEffect(() => {
    const fetchFilteredProperties = async () => {
      const formData = {
        language: selectedLanguage,
        property_type: filters.property_type,

        ...filters, // Spread current filters into the request body
      };
    
      // Make sure price and area filters are numeric
      if (formData.price_from) formData.price_from = parseFloat(formData.price_from);
      if (formData.price_to) formData.price_to = parseFloat(formData.price_to);
      if (formData.area_from) formData.area_from = parseFloat(formData.area_from);
      if (formData.area_to) formData.area_to = parseFloat(formData.area_to);
    
      try {
        const response = await fetch(`${serverurl}search-properties/`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (response.ok) {
          setBusiness([]);
          setBusiness(result); // Set filtered results
        } else {
          console.error(result.error || 'Failed to fetch properties');
        }
      } catch (error) {
        console.error('An unexpected error occurred', error);
      } finally {
        setLoading(false);
      }
    };
    
    
    fetchFilteredProperties();
  }, [selectedLanguage, filters]);
  
  useEffect(() => {
    const fetchCategories = async () => {
        const propertyId = names;

      const formData = {
        language: selectedLanguage,
        name:propertyId,
      };
      try {
        const response = await fetch(`${serverurl}get-searchproperties/`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (response.ok) {
          setBusiness([])
          setBusiness(result.properties);
        } else {
          console.error(result.error || 'Failed to fetch categories');
        }
      } catch (error) {
        console.error('An unexpected error occurred', error);
      }
      
      try {
        const response = await fetch(`${serverurl}get-alltypes/`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET', // Adjust the method if your endpoint requires POST
        });
  
        const result = await response.json();
        if (response.ok && result.ErrorCode === 0) {
          setPropertyTypes(result.data.map(type => type.name)); // Store the names of the types
        } else {
          console.error(result.ErrorMsg || 'Failed to fetch property types');
        }
      } catch (error) {
        console.error('An unexpected error occurred', error);
      }
    
      
      
      finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [filters,selectedLanguage]); // Fetch data when language or filters change

  const limitWords = (text, limit) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "...";
  };


  if (loading) {
    return <div>Loading...</div>; 
  }
  
  const metadata = initialPropertyData
  ? {
      title: initialPropertyData.metaname || initialPropertyData.name,
      description:
        initialPropertyData.metades ||
        `Explore ${initialPropertyData.name} for exceptional properties and listings.`,
      keywords:
        initialPropertyData.keyword ||
        "properties, real estate, listings, top properties",
      openGraph: {
        title: initialPropertyData.metaname || initialPropertyData.name,
        description:
          initialPropertyData.metades ||
          `Explore ${initialPropertyData.name} for a variety of property options.`,
        url: `${frontend}property/${
            names|| "default-slug"
        }`,
        images: [
          `${serverurl}${
            initialPropertyData.logo?.includes("/api/media/")
              ? initialPropertyData.logo.replace("/api/media/", "media/")
              :'media/'+ initialPropertyData.cover || "/path/to/default_image.jpg"
          }`,
        ],
      },
      twitter: {
        card: "summary_large_image",
        title:
          initialPropertyData.metaname ||
          `${initialPropertyData.name} - Discover Our Properties`,
        description:
          initialPropertyData.metades ||
          `Learn more about ${
            initialPropertyData.name
          }, offering top listings in the ${
            (initialPropertyData.name &&
              initialPropertyData.name) ||
            "property"
          } category.`,
          images: [
            `${serverurl}${
              initialPropertyData.logo?.includes("/api/media/")
                ? initialPropertyData.logo.replace("/api/media/", "media/")
                :'media/'+ initialPropertyData.cover || "/path/to/default_image.jpg"
            }`,
          ],
      },
    }
  : {
      // Default metadata if no property data is available
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
    const constructBreadcrumbItems = () => {
        // Replace with actual category data fetching if necessary
        const breadcrumbItems = [
          { label: 'Home', href: '/property/home' },
          { label: "Type", href: `/property/home` },
    
        ];
    
     
// Check if there's a business with the subtype matching 'names'
const currentCategory = business ? business.find(item => item.subtype === names) : null;


// If the category exists, add it to breadcrumbItems
if (currentCategory) {
  breadcrumbItems.push({
    label: currentCategory.subtype,
    href: `/property/${names}`, // Link to the current category
  });
}

      
    
        return breadcrumbItems;
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
    <div className="bg-white p-3">

<FilterBar 
  filters={filters} 
  onFilterChange={setFilters} 
  propertyTypes={propertyTypes} // Pass property types as a prop
/>
<div className="mt-3 ml-0.5">
<Breadcrumb  items={constructBreadcrumbItems()} />
</div>


<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-5">
  {business && business.length>0 ? business.map((property) => (
          <Link key={property.slug} href={`/property/types/${property.slug}`} className="block">

    <div key={property.slug} className="w-full flex flex-col bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition duration-150 ease-in-out overflow-hidden">


      {/* Image Section */}
      <div className="relative w-full h-48"> {/* Fixed height for image */}
        <Image
          src={
            property.logo && property.logo.includes(serverurl)
            ? property.logo:property.logo
              ? `${serverurl}media/${property.logo.replace('/api/media/', '').replace('/api/', 'media')}`
              : automotive
          }
          alt={property.name}
          width={500}
          height={300}
          className="object-cover w-full h-full"
          style={{ objectPosition: 'center' }}
          priority
        />
        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold uppercase">
          {property.purpose}
        </span>
      </div>

      {/* Details Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate">${property.price.toLocaleString()}</h2>
        <p className="text-sm text-gray-500 mb-2 truncate">
          {(property.location ? property.location + ", " : "")}
          {(property.city ? property.city + ", " : "")}
          {property.state || ""}
        </p>
        <div className="flex items-center space-x-3 text-xs text-gray-600 my-2">
          <span>🏠 {property.bed} Beds</span>
          <span>🛁 {property.baths} Baths</span>
          <span>📐 {property.area} {property.unit?.toUpperCase()}</span>
        </div>

        {/* Contact Buttons */}
        <div className="flex space-x-2 mt-auto">
          <Link
            href={`https://wa.me/${property.phone}`}
            className="flex items-center justify-center bg-green-500 text-white px-3 py-2 rounded text-xs font-semibold hover:bg-green-600 transition">
            <i className="fab fa-whatsapp mr-1"></i> WhatsApp
          </Link>
          <Link
            href={`tel:${property.phone}`}
            className="flex items-center justify-center bg-blue-500 text-white px-3 py-2 rounded text-xs font-semibold hover:bg-blue-600 transition">
            <i className="fas fa-phone-alt mr-1"></i> Call
          </Link>
        </div>
      </div>
    </div>
  </Link>
  )):(
    <div className=" items-center h-screen">
    <H4>No property found</H4>
  </div>
  
  )}
</div>

</div>






    </>
  );
};

export default TypeHome;
