"use client";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { H1, H2, H3, H4 } from "@/components/Typography";
import { debounce } from "lodash";
import dynamic from "next/dynamic";
import Categories from "../Categories";
const toast = dynamic(() => import("react-toastify").then((mod) => mod.toast), { ssr: false });

export default function Home({ initialjobsData }) {
  const [job, setJob] = useState(initialjobsData || null);
  const frontend = process.env.NEXT_PUBLIC_SITE_URL;
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;

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
      <div>
      <div className="bg-white p-3">

    <div className="w-full h-[380px] relative">
     <Image
     width={1500}
     height={380}
       src={serverurl+initialjobsData.banner.replace("/api/media/",'media/')}
       alt='slider'
       priority
       className="w-full h-full object-cover rounded-lg shadow-lg"
     />
     
   </div>
   <Categories  />
 </div>
 </div>
    </>
  );
}
