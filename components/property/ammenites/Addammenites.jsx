"use client";
import Formlabel from "@/components/Formlabel";
import Message from "@/components/Message";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import Loader from "@/components/Loader";
import { useForm } from "react-hook-form";
import {toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux"; 
import Breadcrumb from "@/components/BreadCrum";
import { H2 } from "@/components/Typography";

const Addammenity = () => {
  const router = useRouter();
  const auth = useAuth();
  const [message, setMessage] = useState(null);
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [filteredTags, setFilteredTags] = useState([]);
  const { user } = useSelector((state) => state.auth);

  if (auth && !auth.user?.id) router.push("/");


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {

    setMessage("");
    try {
      setLoading(true);


      // Create FormData object to send data and files
      const form = new FormData();
      form.append("userid", auth.user?.id);
      form.append("names", tags.map(tag => tag.tag).join(',')); // Add tags as a comma-separated string
      form.append('approved', user.role===1 ? '1' : '0');

      const response = await fetch(`${serverurl}add-amenties/`, { // Update the endpoint
        method: "POST",
        body: form,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Added Successfully", { position: "top-right" });
        setMessage("Successfully added amenities.");
        router.push('/');
      } else {
        toast.error(result.error || "An error occurred", { position: "top-right" });
        setMessage(result.error || "An error occurred");
      }
    } catch (error) {
      toast.error("An unexpected error occurred", { position: "top-right" });
      setMessage("An unexpected error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change for tags
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setCurrentTag(inputValue);
    // You might want to fetch or filter available tags from your backend here
  };

  // Handle adding a tag
  const handleAddTag = (tag) => {
    if (tag && !tags.find(t => t.tag === tag)) {
      setTags([...tags, { tag }]); // Add the tag to selected tags
      setCurrentTag(''); // Clear input
      setFilteredTags([]); // Reset filtered tags
    }
  };

  // Handle key down event to add tag with Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && currentTag) {
      handleAddTag(currentTag); // Add the current input as a tag
      e.preventDefault(); // Prevent form submission on Enter
    }
  };

  // Remove tag from selected tags
  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Property", href: "/property/" },
    { label: "Add Ammenity", href: "/property/amenites/add" },

  ];

  return (
    <>
           <div className="mt-5 grid md:grid-cols-1 gap-6">
      <Breadcrumb items={breadcrumbItems} /> 
     
</div>
      {loading ? (
        <Loader />
      ) : (
        <div className="p-7">
                  <div>
    <H2 className="flex items-center justify-center ">Add Ammenity</H2>
</div>
          {message && <Message message={message} />}
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div className="mb-5 mt-0">
              <Formlabel text="Amenities" forLabel="b_ammen" />
              <div className="flex flex-wrap gap-2 border border-gray-300 rounded-full p-2 bg-white shadow-md transition-shadow duration-200 ease-in-out">
                {tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center">
                    {tag.tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                      aria-label={`Remove tag: ${tag.tag}`}
                    >
                      &times;
                    </button>
                  </span>
                ))}
                <input
                  id="b_ammen"
                  name="b_ammen"
                  type="text"
                  value={currentTag}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="mt-0 flex-0 min-w-[320px] outline-none text-gray-700 text-sm py-2 px-3 bg-transparent placeholder-gray-400 border-none focus:ring-0 focus:outline-none"
                  placeholder="Add amenity and press Enter"
                />
              </div>
            </div>
           
            <div className="flex justify-end">
              <button
                type="submit"
                className="max-w-[300px] rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}
  
    </>
  );
};

export default Addammenity;
