"use client";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { H1, H2, H3, H4 } from "@/components/Typography";
import { debounce } from "lodash";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const DynamicMapComponent = dynamic(() => import("../AHome/Mapcomponent"), { ssr: false });

export default function JobDetails({ initialjobsData }) {
  const [job, setJob] = useState(initialjobsData || null);
  const [loading, setLoading] = useState(job ? false : true);
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const { user, user_meta } = useSelector((state) => state.auth);

  const [modalOpen, setModalOpen] = useState(false); // Modal visibility state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
  });
  const handleApplyClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resume: e.target.files[0],
    });
  };
  const frontend = process.env.NEXT_PUBLIC_SITE_URL;
  const center = { lat: Number(job.lat), lng: Number(job.longitude) };  // Default center (e.g., NYC)
  const zoom=8;
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("job", job.id); // The job title from the job details

    formdata.append("job_title", job.title); // The job title from the job details
    formdata.append("applicant_name", formData.name);
    formdata.append("applicant_email", formData.email);
    formdata.append("applicant_phone", formData.phone);
    formdata.append("resume", formData.resume);
    formdata.append("owner_email", job.contact_information);

    try {
      const response = await fetch(`${serverurl}submit-inquiry/`, {
        method: "POST",
        body: formdata,
      });
      console.log("response data",response.data)

      if (response.ok) {
        toast.success("Application submitted successfully! ");
      
        setFormData({
          name: "",
          email: "",
          phone: "",
          resume: null,
        });
        setModalOpen(false); // Close modal after submission
      } else {
        console.error("Failed to submit application");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!job) return <p className="text-center text-red-500">Job not found</p>;
  const metadata = job
    ? {
        title: job.metaname || job.title || "Job Opportunity",
        description:
          job.metades ||
          `Discover a career opportunity at ${job.companyname}. ${job.description}`,
        keywords: job.keyword || "jobs, careers, employment, opportunities",
        openGraph: {
          title: job.metaname || job.title || "Job Opportunity",
          description:
            job.metades ||
            `Explore ${job.title} at ${job.companyname}. Join us for an exciting career journey.`,
          url: `${frontend}jobs/${job.slug || "default-slug"}`,
          images: [
            `${serverurl}${job.logo?.includes('/api/media/') 
              ? job.logo.replace('/api/media/', 'media/') 
              : job.logo || "/path/to/default_logo.jpg"}`,
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: job.metaname || job.title || "Job Opportunity",
          description:
            job.metades ||
            `Apply for ${job.title} at ${job.companyname}. A great opportunity in ${job.city}, ${job.state}.`,
          images: [
            `${serverurl}${job.logo?.includes('/api/media/') 
              ? job.logo.replace('/api/media/', 'media/') 
              : job.logo || "/path/to/default_logo.jpg"}`,
          ],
        },
      }
    : {
        // Default metadata for jobs if no job data is available
        title: "Explore Job Opportunities",
        description: "Find the latest job opportunities in various industries.",
        keywords: "jobs, careers, employment, opportunities",
        openGraph: {
          title: "Explore Job Opportunities",
          description: "Discover top jobs and start your career today.",
          url: `${frontend}jobs/`,
          images: ["https://yourwebsite.com/path/to/default_job_image.jpg"],
        },
        twitter: {
          card: "summary_large_image",
          title: "Explore Job Opportunities",
          description: "Find your next career move with us.",
          images: ["https://yourwebsite.com/path/to/default_job_image.jpg"],
        },
      };
  
      const mapContainerStyle = {
        width: "100%",
        height: "200px",
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
      <div className="container mx-auto max-w-5xl p-2 lg:p-3">
        <div className=" text-white rounded-xl shadow-xl overflow-hidden">
          <div className="relative px-8 py-12 text-center bg-primary rounded-lg shadow-md">
            <h1 className="text-3xl font-extrabold tracking-wide text-gray-900">
              {job.title}
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-6">
              <div className="relative w-[80px] h-[80px] rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  src={
                    job.logo
                      ? `${serverurl}${job.logo.replace("/api/media/", "media/")}`
                      : "/placeholder-logo.png"
                 }
                  alt={`${job.companyname} Logo`}
                  layout="fill"
                  objectFit="cover"
                  priority
                />
              </div>

              {/* Company Details */}
              <div className="text-center sm:text-left">
                <h2 className="text-lg font-semibold text-gray-800">
                  {job.companyname}
                </h2>
                <p className="text-sm text-gray-500">
                  {job.location || "Location not specified"}
                </p>
              </div>
            </div>

            <div className="absolute top-4 right-4">
              <span className="bg-blue-100 text-blue-700 font-medium text-xs px-4 py-2 rounded-full shadow">
                {job.type || "Full-Time"}
              </span>
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-t-2xl mt-8 overflow-hidden">
            <div className="p-8 lg:p-12 space-y-10">
      
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: "Employment Type", value: job.employment_type },
                  { label: "Experience Level", value: job.experience_level },
                  { label: "Salary", value: `$${job.salary}` },
                  {
                    label: "Application Deadline",
                    value: job.application_deadline,
                  },
                  { label: "City", value: job.city },
                  { label: "State", value: job.state },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg shadow-md p-6 text-center border border-gray-200 hover:shadow-lg transition transform hover:-translate-y-1"
                  >
                    <H4 className="text-lg font-medium text-gray-800">
                      {item.label}
                    </H4>
                    <p className="text-gray-600 mt-2 text-sm">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Job Description */}
              <div>
                <h3 className="text-3xl font-semibold text-gray-700">
                  Description
                </h3>
                <p className="mt-4 text-gray-600 leading-loose">
                  {job.description}
                </p>
              </div>

              <div>
                <H4 className="text-2xl font-semibold text-gray-800 mb-4">
                  Skills Required
                </H4>
                {job.skills_required ? (
                  <ul className="flex flex-wrap gap-4">
                    {job.skills_required.split(",").map((skill, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-full shadow hover:shadow-md transition transform duration-300"
                      >
                        {skill.trim()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No specific skills required.</p>
                )}
              </div>

              <div>
                <H4 className="text-3xl font-semibold text-gray-700">
                  Contact Information
                </H4>
                <p className="mt-4 text-gray-600">{job.contact_information}</p>
              </div>
            </div>
            <div className="p-0 lg:p-2 space-y-2">

            <DynamicMapComponent
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        markerData={{
          id: job.id,
          lat: job.lat,
          lng: job.longitude,
          location: job.location,
        }}
      />
</div>
            {/* Apply Button */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-8 flex justify-center">
              {user && user.id?(
  <button
  onClick={handleApplyClick}
  className="bg-primary text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:bg-primary hover:scale-105 transition transform duration-300"
>
  Apply Now
</button>
              ):
              <button
              className="bg-primary text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:bg-primary hover:scale-105 transition transform duration-300"
            >
              Pleas Login to apply
            </button>}
            
            </div>
          </div>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
              <H3 className="text-2xl font-semibold text-gray-800 mb-4">
                Apply for {job.title}
              </H3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-2 border rounded-lg shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-2 border rounded-lg shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-2 border rounded-lg shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Upload Resume</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full p-3 mt-2 border rounded-lg shadow-sm"
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-lg hover:opacity-90 transition"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-3 rounded-lg shadow-lg hover:opacity-90 transition"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
