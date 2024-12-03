// import Jobslist from "@/components/jobs/Alljobs";



// export async function fetchInitialjobs(params) {
//   const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
 
//   try {
//     const section='jobs' ;
//     const response = await fetch(`${serverurl}get-seo?section=${section}`);


//     const result = await response.json();
//     if (!response.ok) {
//       console.error("Failed to fetch properties:", response.statusText);
//       return null;
//     }

    

//     return result;

//   } catch (error) {
//     console.error("An error occurred while fetching properties:", error);
//     return null;
//   }
// }

// export default async function Page({ params }) {
//   const initialjobsData = await fetchInitialjobs(params);

 

//   return <Jobslist initialjobsData ={initialjobsData }/>;
// }



import Carousel from "@/components/Carousels";

import Categories from "@/components/Categories";
import Home from "@/components/events/Home";
import Image from "next/image";





export async function fetchInitialjobs(params) {
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
 
  try {
    const section='events' ;
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

export default async function Page({ params }) {
  const initialjobsData = await fetchInitialjobs(params);

 

  return <Home initialjobsData ={initialjobsData }/>;
}




