
import Newproperty from "@/components/property/Newproperty";


export async function  fetchInitialproperties(params) {
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const slug = params.slug;
    
 
  // Fetch business details, categories, and tags from the Django API
  const response = await fetch(`${serverurl}get-specificproperty/`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',

    body: JSON.stringify({ slug: slug }),
  });
  const result = await response.json();
  


  return result.data ? result.data : null;
}


export default async function Page({ params }) {
  const initialpropertiesData = await fetchInitialproperties(params);
  return <Newproperty  initialPropertyData={initialpropertiesData} params={params} />;
}
