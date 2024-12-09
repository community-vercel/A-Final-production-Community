"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPinIcon, CalendarIcon } from "@heroicons/react/24/outline";
import Carousel from "@/components/Carousels";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import Breadcrumb from "../BreadCrum";

const DynamicMapComponent = dynamic(() => import("../AHome/Mapcomponent"), { ssr: false });

export default function EventPage({ initialeventsData }) {
  const event = initialeventsData;
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const [exists, setExists] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

const [selectedDate, setSelectedDate] = useState("");

  const { user_meta, user } = useSelector((state) => state.auth);
  const center = { lat: Number(event.lat), lng: Number(event.longitude) };  // Default center (e.g., NYC)
  const zoom=8;

const getPayment=async ()=>{
  
  try {
    const response = await fetch(
      `${serverurl}get-check-payment-reservation/?user_id=${user.id}&event_id=${event.id}&date=${selectedDate}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    setExists(data.exists); // Set whether the reservation exists
  } catch (err) {
  }
}


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    Name: user && user? user.user_metadata?.full_name:'',
    Phone: "",
    email: user.email,
    confirmEmail: "",
    paymentScreenshot: null,
  });

  const [error, setError] = useState("");
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };
  const [isValid, setIsValid] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const phonePattern = /^(?:\(\d{3}\)\s?|\d{3}[-.\s]?)\d{3}[-.\s]?\d{4}$/;

    if (name === "Phone") {
      // Validate the input against the regex
      if (!value || phonePattern.test(value)) {
        setError("");
        setIsValid(true)

      } else {
        setError("Please enter a valid U.S. phone number.");
        setIsValid(false)
      }
    }
    setFormData({ ...formData, [name]: value });

    // Clear error as user types
    if (name === "email" || name === "confirmEmail") {
      setError("");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, paymentScreenshot: file });
  };

  const handleSubmit = async (e) => {

    const formDataToSend = new FormData();
    e.preventDefault();

    // Validate email fields
    if (formData.email !== formData.confirmEmail) {
      setError("Email and Confirm Email must match.");
      return;
    }
    if (isValid) {
    } else {
      setError("Enter valid phone");
      return;
    }
    
    setIsSubmitting(true);

    formDataToSend.append("name", formData.Name);
    formDataToSend.append("phone", formData.Phone);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("owneremail", initialeventsData.email);
    formDataToSend.append("eventname", initialeventsData.title);

    formDataToSend.append("user", user.id);
    formDataToSend.append("event", event.id);
    formDataToSend.append("date", selectedDate);
    formDataToSend.append("payment_screenshot", formData.paymentScreenshot);

    try {
      const response = await fetch(`${serverurl}add-paymentinfo/`, {
        method: "POST",
        body: formDataToSend,
      });
      const data = await response.json();

      if (data.ErrorCode === 0) {
        setIsModalOpen(false);
        setFormData({
          paymentScreenshot: null,
        });
        toast.success(
          "Payment added sucessfully ,please wait for confirmation"
        );
        setIsSubmitting(false);
        getPayment();

      } else {
        const error = await response.json();
        toast.error(error);
      }
    } catch (error) {
      toast.success(error);
    }
  };
 
  const [eventDates, setEventDates] = useState([]);

  useEffect(() => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { weekday: "long", month: "long", day: "numeric" };
      return date.toLocaleDateString("en-US", options);
    };
  
    const generateDateRange = (startDate, endDate) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to midnight for an accurate comparison
  
      const start = new Date(startDate) < today ? today : new Date(startDate); // Ensure the start date is today or later
      const end = new Date(endDate);
      const dateArray = [];
  
      while (start <= end) {
        dateArray.push(formatDate(start));
        start.setDate(start.getDate() + 1);
      }
      return dateArray;
    };
  
    const eventDatesArray = generateDateRange(event.start_date, event.end_date);
  
    setEventDates(eventDatesArray);
  
    setSelectedDate(eventDatesArray[0]);

  }, []);
  useEffect(()=>{
    getPayment()
  },[selectedDate])
  const frontend = process.env.NEXT_PUBLIC_SITE_URL;

  const metadata = event
    ? {
        title: event.meta_name,

        description: event.meta_description,

        keywords: event.keywords,
        openGraph: {
          title: event.meta_name,

          description:
            event.meta_description ||
            `Explore ${event.title} for excellent services and offerings.`,
          url: `${frontend}events/category/${event.slug || "default-slug"}`,
          images: [
            `${serverurl}${
              event.logo?.includes("/api/media/")
                ? event.logo.replace("/api/media/", "media/")
                : event.logo || "/path/to/default_banner.jpg"
            }`,
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: event.meta_name || `${event.title} - Explore Our Services`,
          description:
            event.meta_description ||
            `Find out more about ${event.title}, a leader in the  ${
              event.title || " event"
            } category.`,
            images: [
                `${serverurl}${
                  event.logo?.includes("/api/media/")
                    ? event.logo.replace("/api/media/", "media/")
                    : event.logo || "/path/to/default_banner.jpg"
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
      const mapContainerStyle = {
        width: "100%",
        height: "400px",
      };
  // Render metadata

  
  const constructBreadcrumbItems = () => {
    // Replace with actual category data fetching if necessary
    const breadcrumbItems = [
      { label: "Home", href: "/" },
      // { label: "ev", href: "/business/allbusiness" },
    ];

    // Find the current category based on the params.id
    const currentCategory =
       event && event.slug === event.slug ?  event : null;
  
    if (currentCategory) {
      breadcrumbItems.push({
        label: currentCategory.name,
        href: `/events/category/${currentCategory.slug}`,
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

      <div className="bg-gray-50 min-h-screen">
        <header className="relative">
          <Carousel slides={event.cover_image} />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-10 left-6 md:left-12 text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
              {event.title}
            </h1>
            <p className="text-lg md:text-xl font-medium">@ {event.address}</p>
          </div>
        </header>
        <div className="mt-2">
              <Breadcrumb items={constructBreadcrumbItems()} />
            </div>
        <main className="max-w-6xl mx-auto px-6 py-12">
          <section className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row md:justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Reserve it for
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {event.is_free ? "Free" : "$" + event.price}
              </p>
            </div>
            {exists && exists?(
               <span>Date already reserved</span>

            ):(
              user && user.id?(
                
              <button
              onClick={toggleModal}
              className="mt-4 md:mt-0 bg-red-500 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-red-600 transition duration-200"
            >
              Reserve Your Spot
            </button>
              ):(
                <span>please login to reserve</span>
              )
            )}
         
          </section>

          <section className="mb-10">
            <p className="text-gray-800 text-lg leading-relaxed">
              Join <strong>{event.name}</strong> at the {event.state},
              {event.city},{event.address} from the <strong>{event.start_date}</strong> to{" "}<strong>
              {event.end_date}</strong>
              &nbsp; between &nbsp;
              {event.start_time} to {event.end_time} to secure your spot .
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-lg p-6 flex items-center mb-10">
            <Image
              src={serverurl + event.logo.replace("/api/media", "media/")} // Replace this with the correct logo URL
              alt="Organizer Logo"
              width={64}
              height={64}
              className="rounded-full border"
            />
            <div className="ml-4">
              <p className="text-lg font-semibold text-gray-900">
                Hosted by {event.name}
              </p>
              <p className="text-gray-500 text-sm">
                Over 255 successful events
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6 mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Select Date and Time
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {eventDates.map((date, index) => (
                <button
                  key={index}
                  className={`p-4 text-center rounded-lg transition font-medium ${
                    selectedDate === date
                      ? "border-2 border-blue-500 bg-blue-50 text-blue-800"
                      : "border border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-100"
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  <p>{date}</p>
                </button>
              ))}
            </div>
          </section>

    
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
            <p className="text-gray-800 text-lg leading-relaxed">
              {event.features}
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-lg p-6 mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              About This Event
            </h2>
            <p className="text-gray-800 text-lg leading-relaxed">
              {event.description}
            </p>
          </section>
          <section className="bg-white rounded-xl shadow-lg p-6 mb-0 mt-5">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Location</h2>
              <div>
              <DynamicMapComponent
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        markerData={{
          id:  event.id,
          lat:  event.lat,
          lng:  event.longitude,
          location: event.address,
        }}
      />
               
              </div>
          
          </section>
        </main>
        
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            {/* Modal Box */}
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-8 relative">
              {/* Close Button */}
              <button
                onClick={toggleModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

              {/* Modal Content */}
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {event.price > 0 ? "Payment Instructions" : "Registration "}
              </h2>
              {event.price && event.price > 0 ? (
                <>
                  <p className="text-gray-600 text-sm mb-6">
                    To confirm your reservation for {selectedDate}, please make
                    a payment of <b>${event.price}</b> to the following :
                  </p>
                  <div className="text-sm mb-6 bg-gray-100 p-4 rounded-lg">
                    <p>
                      <b>Title :</b> {event.payment_title}
                    </p>
                    <p>
                      <b>Details:</b> {event.payment_instruction}
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Upload a screenshot of the payment below to complete your
                    registration.
                  </p>
                </>
              ) : (
                ""
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-700 text-sm">Name *</label>
                    <input
                      type="text"
                      name="Name"
                      value={formData.Name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-gray-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm">Phone *</label>
                    <input
                      type="text"
                      name="Phone"
                      value={formData.Phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-gray-800"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-gray-700 text-sm">
                    Email address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-gray-800"
                    required
                  />
                </div>

                <div className="mt-4">
                  <label className="text-gray-700 text-sm">
                    Confirm email *
                  </label>
                  <input
                    type="email"
                    name="confirmEmail"
                    value={formData.confirmEmail}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-gray-800"
                    required
                  />
                </div>
                {event.price > 0 ? (
                  <div className="mt-4">
                    <label className="text-gray-700 text-sm">
                      Payment Screenshot *
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-gray-800"
                      required
                    />
                  </div>
                ) : (
                  ""
                )}

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}

                  className={`bg-primary text-white px-6 py-3 rounded-lg font-semibold text-lg w-full mt-4 hover:bg-primary transition ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}                >
                  {event.price > 0 ? "Submit payment" : "Add "}
                </button>
              </form>

              {/* <p className="text-gray-400 text-sm mt-4 text-center">
              Powered by Eventbrite
            </p> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
