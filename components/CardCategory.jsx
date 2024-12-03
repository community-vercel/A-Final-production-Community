import Image from "next/image";
import Link from "next/link";
import React from "react";

const CardCategory = ({url,img,title,des,url2}) => {
  return (
    <>
<div className="flex-[170px] lg:flex-grow-0 lg:w-[19%] lg:flex-[19%] bg-white p-3 rounded-xl">
    <Link href={url} >
<Image 
  src={img} 
  alt="A detailed description of the image for accessibility" // Provide a meaningful alt text
  className="rounded-lg w-full aspect-video object-cover" // Ensures the image covers the entire container
  width={300} 
  height={300} 
  loading="lazy" // Improves performance by lazy loading the image
  decoding="async" // Asynchronously decodes the image for better performance
  style={{ maxWidth: '100%', height: 'auto' }} // Ensures responsiveness across devices
/>


      <h3 className="uppercase text-text-color text-base text-center font-semibold mt-4 mb-3">
        {title}
      </h3>
      </Link>
      {url2 &&url2?(
         <Link href={url2} >

         <span className="text-text-gray text-base text-center inline-block mb-3 w-full">
           {des}
         </span>
         </Link>
      ):(
        <span className="text-text-gray text-base text-center inline-block mb-3 w-full">
           {des}
         </span>
      )}
     
      </div>
    </>
  );
};

export default CardCategory;
