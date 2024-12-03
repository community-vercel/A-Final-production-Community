
import PropertyHome from "@/components/property/Home";



export async function fetchInitialproperties() {
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
 
  try {
    const section='property' ;
    const response = await fetch(`${serverurl}get-seo?section=${section}`);


    const result = await response.json();
    if (!response.ok) {
      console.error("Failed to fetch properties:", response.statusText);
      return null;
    }

    

    return result;

  } catch (error) {
    console.error("An error occurred while fetching properties:", error);
    return null;
  }
}

export default async function Page() {
  const initialpropertiesData = await fetchInitialproperties();
  

 

  return <PropertyHome initialpropertiesData  ={initialpropertiesData}/>;
}




