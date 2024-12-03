import Newbusiness from "@/components/business/Newbusiness";

export async function  fetchInitialbusiness(params) {
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const slug = params.slug;
    
  const formData={
    slug:slug,
   
  }
  const response = await fetch(`${serverurl}get-specifibusiness/`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(formData),
});
const result = await response.json();

  return result.data ? result.data : null;
}


export default async function Page({ params }) {
  const initialbusinessData = await fetchInitialbusiness(params);
  return <Newbusiness initialbusinessData={initialbusinessData} params={params} />;
}
