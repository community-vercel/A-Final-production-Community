import CategoryPage from "@/components/business/categories/Category";
import { useSelector } from "react-redux";

// Fetch the category and businesses server-side (asynchronously).
export async function fetchCategoryAndBusinessesData(params,selectedLanguage) {

  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const  isSubcategory  =true;

  const getFromTo = (page) => {
    const itemsPerPage = 10; // Adjust this based on the API's page size
    const from = page * itemsPerPage;
    const to = from + itemsPerPage;
    return { from, to };
  };

  const { from, to } = getFromTo(0); // Fetch from page 0

  const formData = {
    ...(isSubcategory ? { subslug: params.slug } : { slug: params.slug }),
    from: from,
    to: to,
    language: selectedLanguage,
  };

  try {
    const response = await fetch(`${serverurl}get-category-businesses/`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.ErrorCode === 0) {
      return {
        category: result.data[0],
     
      };
    } else {
      throw new Error(result.ErrorMsg);
    }
  } catch (error) {
    console.error("Error fetching category and businesses:", error.message);
    return { category: null, businesses: [], hasMore: false };
  }
}

export default async function Page({ params }) {
  const selectedLanguage = "en"; // This could be dynamic or come from context

  // This should come from a context or user setting
  const initialCategoryData = await fetchCategoryAndBusinessesData(
    params,selectedLanguage
  ); // Fetch data server-side

  return <CategoryPage initialCategoryData={initialCategoryData} />;
}
