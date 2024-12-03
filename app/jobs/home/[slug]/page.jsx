import JobDetails from "@/components/jobs/Newjobs";



export async function fetchInitialjobs(params) {
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
 
  try {
    const requestBody = JSON.stringify({ slug: params.slug });
    const response = await fetch(`${serverurl}get-job/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody,
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("Failed to fetch properties:", response.statusText);
      return null;
    }

    

    return result.data;

  } catch (error) {
    console.error("An error occurred while fetching properties:", error);
    return null;
  }
}

export default async function Page({ params }) {
  const initialjobsData = await fetchInitialjobs(params);

 

  return <JobDetails initialjobsData ={initialjobsData } params={params} />;
}




