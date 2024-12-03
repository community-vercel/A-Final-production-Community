// pages/house.js
"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import PropertyCarousel from "@/components/PropertyCarousel";
import Breadcrumb from "../BreadCrum";
import dynamic from "next/dynamic";

const DynamicMapComponent = dynamic(() => import("../AHome/Mapcomponent"), { ssr: false });

const Newproperty = ({ initialPropertyData }) => {
  const { user, user_meta } = useSelector((state) => state.auth);
  const [property, setProperty] = useState(null); // Initialize as null for a single property
  const [loading, setLoading] = useState(true);
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const params = useParams();
  const center = { lat: Number(initialPropertyData.lat), lng: Number(initialPropertyData.longitude) };  // Default center (e.g., NYC)
  const zoom=8;
  const imageSrc = property
    ? serverurl.includes("api")
      ? serverurl.replace("api", "") + property.logo
      : ""
    : "";
  const selectedLanguage = user_meta.selectedLanguage;
  useEffect(() => {
    if (initialPropertyData) {
      setProperty(initialPropertyData);
      setLoading(false); // Stop loading once property data is set
    }
  }, [initialPropertyData]);
  const [activeTab, setactiveTab] = useState("overview");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [properties, setProperties] = useState([]);

  const frontend = process.env.NEXT_PUBLIC_SITE_URL;
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };
  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2 },
    { width: 768, itemsToShow: 4 },
    { width: 1200, itemsToShow: 4 },
  ];

  // Function to show the previous image
  const prevSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
    );
  };

  // Function to show the next image
  const nextSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const nextSlides = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % property.images.length);
  };

  const prevSlides = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + property.images.length) % property.images.length
    );
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const handleTabClick = (tab) => {
    setactiveTab(tab);

    // Scroll to the corresponding section
    const section = document.getElementById(tab);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const propertyId = params.slug;
        const formData = {
          language: selectedLanguage,
        };

        // Increment view count
        await fetch(`${serverurl}add-increment/`, {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          cache: "force-cache",

          body: JSON.stringify({ slug: propertyId }),
        });

        // Fetch all featured properties
        const response3 = await fetch(
          `${serverurl}get-allfeaturedproperties/`,
          {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            cache: "force-cache",

            body: JSON.stringify(formData),
          }
        );

        const result4 = await response3.json();
        if (response3.ok) {
          setProperties(result4.data);
        } else {
          console.error(result4.error || "Failed to fetch featured properties");
        }
      } catch (error) {
        console.error("Error fetching property details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [params.slug, user, user_meta.role, selectedLanguage]); // added selectedLanguage for reactivity

  const [myproperty, setMyProperty] = useState({
    ename: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMyProperty((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        name: myproperty.ename,
        email: myproperty.email,
        phone: myproperty.phone,
        message: myproperty.message,
        owner_email: property.email,
        pname: property.name,
      };

      const response = await fetch(`${serverurl}post-propertyemail/`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      if (responseData.ErrorCode === 0) {
        toast.success("Email sent successfully");
        setMyProperty({
          ename: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        alert("Failed to send email: " + responseData.error);
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const metadata = initialPropertyData
    ? {
        title: initialPropertyData.metaname || initialPropertyData.name,
        description:
          initialPropertyData.metades ||
          `Explore ${initialPropertyData.description} for exceptional properties and listings.`,
        keywords:
          initialPropertyData.keyword ||
          "properties, real estate, listings, top properties",
        openGraph: {
          title: initialPropertyData.metaname || initialPropertyData.name,
          description:
            initialPropertyData.metades ||
            `Explore ${initialPropertyData.description} for a variety of property options.`,
          url: `${frontend}property/types/${
            initialPropertyData.slug || "default-slug"
          }`,
          images: [
            `${serverurl}${
              initialPropertyData.logo?.includes("/api/media/")
                ? initialPropertyData.logo.replace("/api/media/", "media/")
                : initialPropertyData.logo || "/path/to/default_image.jpg"
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
              (initialPropertyData.categories &&
                initialPropertyData.categories[0].category__name) ||
              "property"
            } category.`,
          images: [
            `${serverurl}${
              initialPropertyData.logo?.includes("/api/media/")
                ? initialPropertyData.logo.replace("/api/media/", "media/")
                : initialPropertyData.logo || "/path/to/default_image.jpg"
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
      { label: "Home", href: "/" },
      { label: "All Properties", href: "/property/allproperties" },
    ];

    const currentCategory =
      property && property.slug === params.slug ? property : null;
 
    if (currentCategory) {
      breadcrumbItems.push({
        label: currentCategory.name,
        href: `/property/types/${currentCategory.slug}`,
      }); // Link to the current category
    }

    return breadcrumbItems;
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

      <div>
        {loading ? (
          <p>Loading...</p>
        ) : property ? (
          <div>
            <hr className="w-full bg-gray-200 border-0 h-0.5" />{" "}
            <div className="py-2 mb-4 flex flex-col items-center">
              <h1 className=" text-2xl font-semibold text-gray-800 ml-2">
                {property.name}
              </h1>
              <p className="text-gray-600 ml-2">{property.location}</p>
            </div>
            <Breadcrumb items={constructBreadcrumbItems()} />
            <hr className="w-full bg-gray-200 border-0 h-0.5 mt-2" />{" "}
            <div className="container mx-auto px-4 py-8 w-5/6">
              <div className="flex flex-col lg:flex-row gap-4 mt-[-15.5px]">
                <div className="relative w-full mt-4 overflow-hidden">
                <Image
  key={currentImageIndex}
  src={`${serverurl}media/${property.images[currentImageIndex]}`}
  alt={`House Image ${currentImageIndex + 1}`}
  width={800}
  height={300}
  className="w-full h-full object-cover rounded cursor-pointer"
  priority={currentImageIndex === 0}  // Set priority for the first image only
  decoding="async"
  onClick={openModal}
  sizes="(max-width: 768px) 100vw, 800px"
/>

                  <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white-800 text-white p-2 rounded-full hover:bg-gray-700 transition"
                  >
                    &#10094;
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white-800 text-white p-2 rounded-full hover:bg-gray-700 transition"
                  >
                    &#10095;
                  </button>
                </div>

                {isModalOpen && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <div className="relative bg-white rounded-lg overflow-hidden w-full max-w-3xl">
                      <Image
                        src={
                          serverurl + "media/" + property.images[currentIndex]
                        }
                        alt={`House Image ${currentIndex + 1}`}
                        className="w-full h-auto object-cover"
                        height={500}
                        width={800}
                        priority={currentIndex === 0}  // Set priority for the first image only
                        sizes="(max-width: 768px) 100vw, 800px" // Add responsive sizes
                      />
                      <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 text-gray-800 bg-transparent hover:bg-gray-200 rounded-full p-2"
                      >
                        &#10005;
                      </button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm rounded px-2">
                        {currentIndex + 1} / {property.images.length}
                      </div>
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={prevSlides}
                          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition"
                        >
                          &#10094;
                        </button>
                        <button
                          onClick={nextSlides}
                          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition"
                        >
                          &#10095; {/* Right arrow */}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="w-full lg:w-2/5 bg-white shadow-md p-3 rounded-md mt-7">
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-grey-800">
                      $ {property.price}
                    </h2>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <a
                      href="#"
                      className="bg-green-600 text-white font-bold py-2 rounded text-center hover:bg-green-500 transition w-1/2 mr-2"
                    >
                      WhatsApp
                    </a>
                    <a
                      href="#"
                      className="bg-green-600 text-white font-bold py-2 rounded text-center hover:bg-green-500 transition w-1/2"
                    >
                      Call
                    </a>
                  </div>
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="ename"
                      value={myproperty.ename}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className="w-full mt-2 p-2 border border-gray-300 rounded"
                    />

                    <label className="block text-sm font-semibold text-gray-700 mt-4">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={myproperty.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full mt-2 p-2 border border-gray-300 rounded text-sm"
                    />

                    <label className="block text-sm font-semibold text-gray-700 mt-4">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={myproperty.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone"
                      className="w-full mt-2 p-2 border border-gray-300 rounded text-sm"
                    />

                    <label className="block text-sm font-semibold text-gray-700 mt-4">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={myproperty.message}
                      onChange={handleInputChange}
                      placeholder="I would like to inquire about your property"
                      className="w-full mt-2 p-2 border border-gray-300 rounded"
                    ></textarea>

                    <div className="flex items-center mt-4">
                      <input id="buyer" type="checkbox" className="mr-2" />
                      <label htmlFor="buyer" className="text-sm text-gray-700">
                        I am a buyer/tenant
                      </label>
                    </div>

                    <button
                      onClick={handleSubmit}
                      className="mt-4 bg-green-600 text-white font-bold py-2 rounded w-full hover:bg-green-500 transition"
                    >
                      Send Email
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center py-4 text-[#000000]">
                <div className="flex gap-2 text-[#000000]">
                  <span className="flex items-center text-gray-600">
                    <i className="fas fa-bed mr-2"></i> 🛏 {property.bed}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <i className="fas fa-bath mr-2"></i>🛁 {property.baths}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <i className="fas fa-home mr-2"></i>
                    {property.area}{" "}
                    {property.unit ? property.unit.toUpperCase() : ""}{" "}
                    {/* Handle null unit */}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-black text-white px-4 sm:px-8 py-4 rounded-md mb-6 mt-2 w-full">
                <div className="flex flex-wrap justify-between space-x-0 space-y-4 sm:space-y-0 sm:space-x-10">
                  {["overview", "location", "ammen", "price", "trends"].map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`text-lg font-semibold pb-2 transition-colors duration-200 ease-in-out ${
                          activeTab === tab
                            ? "border-b-4 border-white"
                            : "border-b-4 border-transparent hover:border-gray-400"
                        } w-full sm:w-auto text-left`}
                      >
                        {tab.charAt(0).toUpperCase() +
                          tab.slice(1).replace("ammen", "Amenities")}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-8">
                {/* Left Column */}
                <div id="overview" className="w-full lg:w-4/5 space-y-6">
                  {/* Details Section */}
                  <div className="bg-white border border-gray-300 rounded-sm p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm">
                      {[
                        {
                          label: "Type",
                          value: property.types[0].propertytype_name,
                        },
                        {
                          label: "Area",
                          value:
                            property.area + " " + property.unit.toUpperCase(),
                        },
                        { label: "Price", value: property.price },
                        {
                          label: "Purpose",
                          value: property.purpose.toUpperCase(),
                        },
                        { label: "Location", value: property.location },
                        { label: "Bed", value: property.bed },
                        { label: "Bath(s)", value: property.baths },
                        { label: "Added", value: "2 days ago" },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center py-1 last:border-b-0 justify-start"
                        >
                          <span className="text-gray-500 w-1/3 text-left">
                            {item.label}:
                          </span>{" "}
                          {/* Set width for consistent alignment */}
                          <span className="font-medium text-gray-800 ml-2 text-left">
                            {item.value}
                          </span>{" "}
                          {/* Left-aligned value */}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description Section */}
                  <div
                    id="location"
                    className="bg-white border border-gray-300 rounded-sm p-6 shadow-sm"
                  >
                    <h2 className="text-xl font-semibold mb-4">Description</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {property.description}
                    </p>
                  </div>

                  {/* Amenities Section */}
                  <div
                    id="ammen"
                    className="bg-white border border-gray-300 rounded-sm p-7 shadow-sm"
                  >
                    <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                    <div className="flex flex-wrap space-x-8">
                      <div className="flex items-center text-[#000000] mb-2">
                        <i className="fas fa-check-circle mr-2"></i>
                        <span> 🛁 Main Features</span>
                      </div>
                      <div className="flex items-center text-[#000000]  mb-2">
                        <i className="fas fa-layer-group mr-2"></i>
                        <span> 🛁 Flooring</span>
                      </div>
                      <div className="flex items-center text-[#000000]  mb-2">
                        <i className="fas fa-trash-alt mr-2"></i>
                        <span> 🛁 Waste Disposal</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="w-full max-w-screen-lg mx-auto space-y-6 px-4 sm:px-6 lg:px-9">
                  {/* Profile Section */}
                  <div className="bg-white shadow-md p-4 rounded-md">
                    <Image
                      src={imageSrc}
                      alt="Estate Logo"
                      className="mx-auto mb-4 w-20 h-20"
                      priority
                      width={80} // Specify a width value in pixels
                      height={80} // Specify a height value in pixels
                      sizes="(max-width: 768px) 20vw, 80px" // Adjusts based on screen width
                    />
                    <h3 className="font-semibold text-lg text-center">
                      {property.name}
                    </h3>
                    <p className="text-gray-600 mb-2 text-center">
                      {property.uname}
                    </p>
                    <Link
                      href="#"
                      className="text-blue-500 underline text-center block"
                    >
                      PROFILE
                    </Link>
                  </div>

                  <div className="bg-white border border-gray-300 rounded-md p-6 shadow-sm">
              <DynamicMapComponent
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        markerData={{
          id: initialPropertyData.id,
          lat: initialPropertyData.lat,
          lng: initialPropertyData.longitude,
          location: initialPropertyData.location,
        }}
      />
    
                  </div>

                  <button className="w-full py-3 bg-blue-500 text-white rounded-md text-center shadow-sm transition duration-200 hover:bg-blue-600">
                    Report this property
                  </button>
                </div>
              </div>
            </div>
            {properties && (
              <>
                <h2 className="p-5 font-extrabold text-xl">
                  Most Viewed Properties
                </h2>
                <PropertyCarousel
                  properties={properties}
                  serverurl={serverurl}
                  breakPoints={breakPoints}
                />
              </>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No property details available.</p>
        )}
      </div>
    </>
  );
};

export default Newproperty;
