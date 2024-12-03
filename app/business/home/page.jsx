
import Homes from "@/components/business/Homes";



export async function fetchinitialbusinesssData() {
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
 
  try {
    const section='business' ;
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
  const initialbusinesssData = await fetchinitialbusinesssData();

 

  return <Homes initialbusinesssData ={initialbusinesssData}/>;
}




