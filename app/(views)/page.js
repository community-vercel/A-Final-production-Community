
import Home from "@/components/AHome/DHome";



export async function fetchinitialData() {
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
 
  try {
    const section='home' ;
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
export async function fetchinitialbusinesssData() {
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const selectedLanguage='en'
  try {
  
    const formData = {
      language: selectedLanguage,
    };


      const response = await fetch(`${serverurl}get-allfeaturedbusiness/`, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",

        },
        method: "POST",
        body: JSON.stringify(formData),
      });
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

export async function fetchinitialfeaturessData() {
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const selectedLanguage='en'
  try {
  
    const formData = {
      language: selectedLanguage,
    };

   
      const response = await fetch(`${serverurl}get-allfeaturedproperties/`, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",

        },
        method: "POST",
        body: JSON.stringify(formData),

      });
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
export async function fetchinitialfeaturessjobsData() {
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const selectedLanguage='en'
  try {
  
    const formData = {
      language: selectedLanguage,
    };

  

      const response = await fetch(`${serverurl}get-allfeaturedjobs/`, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",

        },
        method: "POST",
        body: JSON.stringify(formData),
      });
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

export async function fetchinitialfeaturesseventData() {
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const selectedLanguage='en'
  try {
  
    const formData = {
      language: selectedLanguage,
    };

  
   

      const response = await fetch(`${serverurl}get-allfeaturedevents/`, {
        headers: {
          "Content-Type": "application/json",
              "Cache-Control": "no-cache",

        },
        method: "POST",
        body: JSON.stringify(formData),
      });
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
  const initialfeatureData = await fetchinitialfeaturessData();
  const initialfeaturejobsData = await fetchinitialfeaturessjobsData();
  const initialfeatureseventData = await fetchinitialfeaturesseventData();
  const initialData = await fetchinitialData();


 

  return <Home initialData={initialData} initialbusinesssData ={initialbusinesssData} initialfeatureData={initialfeatureData} initialfeaturejobsData={initialfeaturejobsData} initialfeatureseventData={initialfeatureseventData}/>;
}




