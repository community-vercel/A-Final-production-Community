import TypeHome from "@/components/property/types/Home";

export async function fetchInitialProperties(params) {
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const slug = params.name;

  // Helper function to clean and format the slug
  const formatNameForUrl = (slug) => {
    return decodeURIComponent(slug)
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w-]+/g, ' ')
      .replace(/--+/g, ' ')
      .replace(/^-+|-+$/g, ' ');
  };

  const formattedName = formatNameForUrl(slug);


  const formData = {
    language: 'en',

    name: formattedName,
  };

  try {
    // Fetch business details, categories, and tags from the Django API
    const response = await fetch(`${serverurl}get-searchproperties/`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      console.error("Failed to fetch properties:", response.statusText);
      return null;
    }

    const result = await response.json();
  
    const parentPropertyTypeInfo = result?.parent_property_type_info ?? null;

    return parentPropertyTypeInfo;

  } catch (error) {
    console.error("An error occurred while fetching properties:", error);
    return null;
  }
}

export default async function Page({ params }) {

  const initialPropertiesData = await fetchInitialProperties(params);

 

  return <TypeHome initialPropertyData={initialPropertiesData} params={params} />;
}
