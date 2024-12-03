
import Link from 'next/link';
import { H1, H2 } from '../Typography';
import React,{ useState,useMemo } from 'react';
const JobsCard = React.memo(({ job }) => {
  const [expandedDescriptionId, setExpandedDescriptionId] = useState(null);

 
  const truncateText = (text, limit) => {
    const words = text.split(' ');
    return words.length > limit ? `${words.slice(0, limit).join(' ')}...` : text;
  };
  const truncatedDescription = useMemo(
    () => truncateText(job.description, 16),
    [job.description]
  );

  const locationString = useMemo(() => {
    if (job.city && job.state && job.location) {
      return `${job.city}, ${job.state}, ${job.location}`;
    }
    return 'Location not available';
  }, [job.city, job.state, job.location]);
    return (

        <div
        
        className="flex flex-col sm:flex-row items-start sm:items-center  p-4 md:p-6 bg-white border rounded-lg shadow-lg hover:shadow-xl transition-shadow space-y-4 sm:space-y-0 sm:space-x-6"
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
            <p className="text-gray-700">
        <span className="font-medium">Location:</span> {locationString || 'Loading...'}
      </p>
  
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
                  : truncatedDescription}
                
              </span>
              {job.description && job.description.length > 16 && (
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
    )
  });
  JobsCard.displayName = 'JobsCard';

  export default JobsCard;