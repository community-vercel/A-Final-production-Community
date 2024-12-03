'use client';
import { useState,useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from "react-redux";

import Link from 'next/link';
import { H1, H2 } from '../Typography';
import Breadcrumb from '../BreadCrum';

export default function Jobslist({initialjobsData}) {
  const [jobs, setJobs] = useState([]);
  const frontend=process.env.NEXT_PUBLIC_SITE_URL


  const [filters, setFilters] = useState({
    location: '',
    salaryRange: [0, 100000],
    employmentType: '',
    experienceLevel: '',
    skills: [],
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const { user_meta } = useSelector((state) => state.auth);
  const selectedLanguage = user_meta.selectedLanguage ;
  const observer = useRef();

  useEffect(() => {
    if (!hasMore || loading) return;

    const handleObserver = (entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const options = { root: null, rootMargin: '0px', threshold: 1.0 };
    observer.current = new IntersectionObserver(handleObserver, options);

    const sentinel = document.querySelector('#sentinel');
    if (sentinel) {
      observer.current.observe(sentinel);
    }

    return () => {
      if (observer.current && sentinel) {
        observer.current.unobserve(sentinel);
      }
    };
  }, [hasMore, loading]);
  
  useEffect(() => {
    fetchJobs(page, true);
  }, [filters,selectedLanguage]);

  useEffect(() => {
    if (page > 1) {
      fetchJobs(page);
    }
  }, [page]);
  const fetchJobs = async (page = 1, reset = false) => {
    setLoading(true);
  
    const queryParams = new URLSearchParams({
      page,
      location: filters.location || '',
      salary_min: filters.salaryRange[0],
      salary_max: filters.salaryRange[1],
      employment_type: filters.employmentType || '',
      experience_level: filters.experienceLevel || '',
      skills: filters.skills.join(',') || '',
      language: selectedLanguage || 'en',
    });
  
    try {
      const response = await fetch(`${serverurl}get-joblist/?${queryParams.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
        // cache: 'force-cache',
      });
  
      const result = await response.json();
  
      if (response.ok) {
        const uniqueJobs = result.jobs.filter(
          (newJob) => !jobs.some((existingJob) => existingJob.id === newJob.id)
        );
        setJobs(reset ? uniqueJobs : [...jobs, ...uniqueJobs]);
        setHasMore(result.pagination.has_next);
      } else {
        console.error(result.error || 'Failed to fetch jobs');
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setPage(1);
  };

  const handleSalaryChange = (e, index) => {
    const newSalaryRange = [...filters.salaryRange];
    newSalaryRange[index] = parseInt(e.target.value, 10);
    setFilters((prevFilters) => ({ ...prevFilters, salaryRange: newSalaryRange }));
    setPage(1);
  };

  // Function to truncate text to a given word limit
  const [expandedDescriptionId, setExpandedDescriptionId] = useState(null);

  const truncateText = (text, limit) => {
    const words = text.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    }
    return text;
  };
 
  const metadata = initialjobsData
    ? {
        title: initialjobsData?.metaTitle
        || jobs?.[0]?.title || "Job Opportunity",
        description: 
          initialjobsData?.metaDescription
 ||
          `Discover a career opportunity at ${jobs?.[0]?.company_name}. ${jobs?.[0]?.description}`,
        keywords: initialjobsData?.keywords|| "initialjobsDatas, careers, employment, opportunities",
        openGraph: {
          title: initialjobsData?.metaTitle || jobs?.[0]?.title || "Job Opportunity",
          description: 
            initialjobsData?.metaDescription
 ||
            `Explore ${jobs?.[0]?.title} at ${jobs?.[0]?.company_name}. Join us for an exciting career journey.`,
          url: `${frontend}jobs/${jobs?.[0]?.slug || "default-slug"}`,
          images: [
            `${serverurl}${initialjobsData?.banner?.includes('/api/media/') 
              ? initialjobsData?.banner.replace('/api/media/', 'media/') 
              : initialjobsData?.banner || "/path/to/default_logo.jpg"}`,
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: initialjobsData?.metaTitle || jobs?.[0]?.title || "Job Opportunity",
          description: 
            initialjobsData?.metaDescription
 ||
            `Apply for ${jobs?.[0]?.title} at ${jobs?.[0]?.company_name}. A great opportunity in ${jobs?.[0]?.city}, ${jobs?.[0]?.state}.`,
          images: [
            `${serverurl}${initialjobsData?.banner?.includes('/api/media/') 
              ? initialjobsData?.banner.replace('/api/media/', 'media/') 
              : initialjobsData?.banner || "/path/to/default_logo.jpg"}`,
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
      const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: "All Jobs", href: "/jobs/home" },
      ];
  
  // Render metadata
  return (
    <>
          <div className="bg-white p-3">

       <div className="mt-0 grid md:grid-cols-1 gap-6">
      <Breadcrumb items={breadcrumbItems} /> 
     
</div>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="keywords" content={metadata.keywords} />
      <meta property="og:title" content={metadata.openGraph.title} />
      <meta property="og:description" content={metadata.openGraph.description} />
      <meta property="og:url" content={metadata.openGraph.url} />
      <meta property="og:image" content={metadata.openGraph.images} />
      <meta name="twitter:title" content={metadata.twitter.title} />
      <meta name="twitter:description" content={metadata.twitter.description} />
      <meta name="twitter:image" content={metadata.twitter.images} />

<div className="max-w- mx-auto p-4 md:p-6 bg-gray-50 mt-3">
  <H1 className="font-bold text-center text-gray-800 mb-6 md:mb-8">
    {initialjobsData.title}

  </H1>

  {/* Filters Section */}
  <div className="bg-white shadow-lg p-4 md:p-6 rounded-lg mb-6 md:mb-8 space-y-4 md:space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          placeholder="Enter city or region"
          className="mt-1 p-2 border rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Salary Range</label>
        <div className="flex items-center space-x-2 sm:space-x-4 mt-1">
          <input
            type="number"
            value={filters.salaryRange[0]}
            onChange={(e) => handleSalaryChange(e, 0)}
            className="p-2 border rounded-lg w-1/2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-gray-500">to</span>
          <input
            type="number"
            value={filters.salaryRange[1]}
            onChange={(e) => handleSalaryChange(e, 1)}
            className="p-2 border rounded-lg w-1/2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Employment Type</label>
        <select
          name="employmentType"
          value={filters.employmentType}
          onChange={handleFilterChange}
          className="mt-1 p-2 border rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Employment Type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="contract">Contract</option>
        </select>
      </div>
    </div>
  </div>

  {/* Job Listings */}
  <div className="space-y-4 md:space-y-6">
    {loading && (
      <p className="text-center text-gray-500">Loading jobs...</p>
    )}
    {jobs.map((job) => (
      <div
        key={job.id}
        className="flex flex-col sm:flex-row items-start sm:items-center p-4 md:p-6 bg-white border rounded-lg shadow-lg hover:shadow-xl transition-shadow space-y-4 sm:space-y-0 sm:space-x-6"
      >
        {/* Job Details */}
        <div className="flex-grow">
          <Link href={`/jobs/home/${job.slug}`}>
            <H2 className="md:text-xl font-bold text-gray-900">
              {job.title}
            </H2>
            <p className="text-sm text-gray-600 font-medium">{job.company_name}</p>
            <div className="mt-2 text-sm text-gray-500 space-y-1">
            <p className="text-gray-700">
  <span className="font-medium">Location:</span>{' '}
  {job.city && job.state ? `${job.city}, ${job.state}` : 'Unknown Location'}
  {job.location && ` (${job.location})`}
</p>
              <p>
                <span className="font-medium text-gray-700">Salary:</span>{' '}
                <span className="text-green-600 font-semibold">${job.salary}</span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Deadline:</span>{' '}
                <span className="text-red-500 font-semibold">{job.application_deadline}</span>
              </p>
            </div>
          </Link>
          <div className="mt-2">
            <p>
              <span className="font-medium text-gray-700">Description:</span>{' '}
              <span className="text-gray-500 font-semibold">
                {expandedDescriptionId === job.id
                  ? job.description
                  : truncateText(job.description, 16)}
              </span>
              {job.description.split(' ').length > 16 && (
                <button
                  className="ml-2 text-blue-500 font-medium hover:underline"
                  onClick={() =>
                    setExpandedDescriptionId(
                      expandedDescriptionId === job.id ? null : job.id
                    )
                  }
                >
                  {expandedDescriptionId === job.id ? 'See Less' : 'See More'}
                </button>
              )}
            </p>
          </div>
        </div>

        {/* Call-to-Action Button */}
        <div className="flex-shrink-0">
          <Link
            href={`/jobs/home/${job.slug}`}
            className="bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary-600 transition hover:scale-105 text-sm md:text-base"
          >
            Detail
          </Link>
        </div>
      </div>
    ))}
    {!loading && jobs.length === 0 && (
      <p className="text-center text-gray-500">
        No jobs found. Try adjusting your filters.
      </p>
    )}
  </div>

  {/* Loading Indicator */}
  <div id="sentinel" className="h-10"></div>
  {loading && <p className="text-center">Loading...</p>}
</div>
</div>
</>

  );
}
