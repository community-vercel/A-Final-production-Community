import Subcategory from "@/components/business/categories/subcategories/Subcategory";


export async function fetchInitialSubcategories(params) {
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const ITEMS_PER_LOAD = 10;

  const response = await fetch(`${serverurl}allcategory-count/`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({ slug: params.category, page: 1, page_size: ITEMS_PER_LOAD }),
  });

  const result = await response.json();
  return result.categories ? result.categories[0] : null;
}

export default async function Page({ params }) {
  const initialCategoryData = await fetchInitialSubcategories(params);
  return <Subcategory initialCategoryData={initialCategoryData} params={params} />;
}
