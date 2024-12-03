"use client";
import React, { useEffect, useState, useCallback } from "react";
import { automotive } from "@/assets"; // Default image
import Link from "next/link";
import { useSelector } from "react-redux";
import FilterBar from "@/components/Filter";
import Image from "next/image";
import debounce from "lodash.debounce"; // Optional debounce package
import Breadcrumb from "../BreadCrum";

const Allproperties = () => {
  const [business, setBusiness] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const { user_meta } = useSelector((state) => state.auth);
  const selectedLanguage = user_meta.selectedLanguage;
  const [filters, setFilters] = useState({});

  // Debounced setFilters function
  const handleFilterChange = debounce((newFilters) => {
    setFilters(newFilters);
  }, 300);

  const fetchFilteredProperties = useCallback(async () => {
    const formData = {
      language: selectedLanguage,
      property_type: filters.property_type,
      ...filters,
    };

    // Ensure numeric values are correctly formatted
    ["price_from", "price_to", "area_from", "area_to"].forEach((key) => {
      if (formData[key]) formData[key] = parseFloat(formData[key]);
    });

    try {
      const response = await fetch(`${serverurl}search-properties/`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        cache: "force-cache",
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) setBusiness(result);
      else console.error(result.error || "Failed to fetch properties");
    } catch (error) {
      console.error("An unexpected error occurred", error);
    } finally {
      setLoading(false);
    }
  }, [selectedLanguage, filters]);

  const fetchCategories = useCallback(async () => {
    try {
      const [propertiesRes, typesRes] = await Promise.all([
        fetch(`${serverurl}get-allproperties/`, {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          cache: "force-cache",
          body: JSON.stringify({ language: selectedLanguage }),
        }),
        fetch(`${serverurl}get-alltypes/`, {
          headers: { "Content-Type": "application/json" },
          cache: "force-cache",
          method: "GET",
        }),
      ]);

      const propertiesData = await propertiesRes.json();
      const typesData = await typesRes.json();

      if (propertiesRes.ok) setBusiness(propertiesData.data);
      else console.error(propertiesData.error || "Failed to fetch categories");

      if (typesRes.ok && typesData.ErrorCode === 0) {
        setPropertyTypes(typesData.data.map((type) => type.name));
      } else {
        console.error(typesData.ErrorMsg || "Failed to fetch property types");
      }
    } catch (error) {
      console.error("An unexpected error occurred", error);
    } finally {
      setLoading(false);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    fetchFilteredProperties();
  }, [fetchFilteredProperties]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const limitWords = (text, limit) => text?.split(" ").slice(0, limit).join(" ") + "..." || "";

  if (loading) return <div>Loading...</div>;
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "All Properties", href: "/allproperties/" },

  ];
  return (
    <>
        <div className="mt-5 grid md:grid-cols-1 gap-6">
      <Breadcrumb items={breadcrumbItems} /> 
     
</div>
<div className="bg-white p-3">

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        propertyTypes={propertyTypes}
      />
    
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-0">
        {business.map((property) => (
          <Link key={property.slug} href={`/property/types/${property.slug}`} className="block">
            <div className="w-full flex flex-col bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition duration-150 ease-in-out overflow-hidden">
              <div className="relative w-full h-48">
              <Image
  src={
    property.logo && property.logo.includes("media/property")
      ? property.logo
      : property.logo
      ? `${serverurl}media/${property.logo.replace(/\/api\/(media\/)?/, "media")}`
      : automotive
  }
  alt={property.name}
  width={500}
  height={300}
  className="object-cover w-full h-full"
  priority
/>

              <span
  className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded-full font-semibold uppercase ${
    property.purpose === "sell" ? "bg-red-600" : "bg-yellow-600"
  }`}
>
  {property.purpose}
</span>

              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate">${property.price.toLocaleString()}</h2>
                <p className="text-sm text-gray-500 mb-2 truncate">
                  {property.location ? `${property.location}, ` : ""}
                  {property.city ? `${property.city}, ` : ""}
                  {property.state || ""}
                </p>
                <div className="flex items-center space-x-3 text-xs text-gray-600 my-2">
                  <span>🏠 {property.bed} Beds</span>
                  <span>🛁 {property.baths} Baths</span>
                  <span>📐 {property.area} {property.unit?.toUpperCase()}</span>
                </div>
                <div className="flex space-x-2 mt-auto">
                  <Link href={`https://wa.me/${property.phone}`} className="flex items-center justify-center bg-green-500 text-white px-3 py-2 rounded text-xs font-semibold hover:bg-green-600 transition">
                    <i className="fab fa-whatsapp mr-1"></i> WhatsApp
                  </Link>
                  <Link href={`tel:${property.phone}`} className="flex items-center justify-center bg-blue-500 text-white px-3 py-2 rounded text-xs font-semibold hover:bg-blue-600 transition">
                    <i className="fas fa-phone-alt mr-1"></i> Call
                  </Link>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      </div>
    </>
  );
};

export default Allproperties;
