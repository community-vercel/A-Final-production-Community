"use client";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddCategoryZod } from "@/zod/AddCategoryZod";
import useAuth from "@/hooks/useAuth";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Breadcrumb from "@/components/BreadCrum";
const Updatecategory = () => {
  const router = useRouter();
  const auth = useAuth();
  const params = useParams();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logo, setLogo] = useState(null);
  const [thumbnailDB, setThumbnailDB] = useState(null);
  const [cover, setCover] = useState(null);
  const [coverDB, setCoverDB] = useState(null);
  const [subcategories, setSubcategories] = useState([]); // State for subcategories
  const [newSubcategory, setNewSubcategory] = useState("");
  const [newupdateSubcategory, setNewupdateSubcategory] = useState("");
  const [Slug, setSlug] = useState(''); // State for the slug
  const [CategoryName, setCategoryName] = useState('');
  const [currentLogo, setCurrentLogo] = useState('');
  const [currentCover, setCurrentCover] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const handleKeywordKeyPress = (e) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      if (!keywords.includes(keywordInput.trim())) {
        setKeywords([...keywords, keywordInput.trim()]);
      }
      setKeywordInput("");
    }
  };

  const removeKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleLogoChange = (e) => setLogo(e.target.files[0]);
  const handleCoverChange = (e) => setCover(e.target.files[0]);
  const generateSlug = (name) => {
    return encodeURIComponent(
      name
        .toLowerCase()
        .trim()
        .replace(/[\s]+/g, '-')
        .replace(/[^\w-]+/g, '')
    );
  };
  

  const handleCategoryNameChange = (e) => {
    const newName = e.target.value;
    setCategoryName(newName);
    setSlug(generateSlug(newName)); // Set the generated slug
  };

  // State for new subcategory input
  // State for new subcategory input
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const { user_meta, user } = useSelector((state) => state.auth);
  const selectedLanguage = user_meta.selectedlanguage || "en"; // Get the first language or fallback to "en"

  useEffect(() => {
    const getData = async () => {
      try {
        // Fetch category data
        const requestBody = JSON.stringify({ category_id: params.id });
        const response = await fetch(`${serverurl}get-category/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        });

        const result = await response.json();
        

        if (response.ok) {
          setCategoryName(result.data.name);
        setSlug(result.data.slug);
          setCurrentLogo(result.data.thumbnail); // Assuming `logo` is the field name
          setCurrentCover(result.data.cover); 
          setMetaTitle(result.data.metaname),
          setMetaDescription(result.data.metades),
          setKeywords(result.data.keyword.split(","))
          GetState(countryid).then((states) => {
            states.map((state) => {
              if (state.name === data.state) {
                setSelectedState(state);
                GetCity(countryid, state.id).then((cities) => {
                  cities.map((city) => {
                    if (city.name === data.city) {
                      setSelectedCity(city);
                    }
                  });
                });
              }
            });
          });
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  const {
    register,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(AddCategoryZod),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const keywordsString = keywords.join(",");

      const formData = new FormData();
      formData.append('id',params.id)
      formData.append('name', CategoryName);
      formData.append('slug', Slug);
      formData.append('metaname',metaTitle);
      formData.append('metades', metaDescription);
      formData.append('keyword', keywordsString);



 if(logo){
        formData.append('thumbnail', logo);

    }
    else{
        formData.append('thumbnail', currentLogo);

    }
  
    if(cover){
        formData.append('cover', cover);
    }
    else{
        formData.append('cover', currentCover);
    }

     
  


      const response = await fetch(`${serverurl}update-category/`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
  
        toast.success('Updated Successfully', { position: 'top-right' });
        router.push("/business/categories");
      } else {
        console.error('Error updating sub-category:');
        toast.error('An unexpected error occurred');
      }
    } catch (error) {
      setMessage("An unexpected error occurred: " + error.message);
    }
  };




  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/business/category" },

    {
      label: `Update Category`,
      href: "/business/categories/update/" + (params.id),
    },
  ];

  // Function to add a new subcategory

  return (
    <> <div className="mt-5 grid md:grid-cols-2 gap-6">
    <Breadcrumb items={breadcrumbItems} /> 
   
</div>
   
      
        <div className="p-7">
              <form
      onSubmit={handleSubmit}
      className="mt-5 p-6 md:p-8 bg-white shadow-lg rounded-lg space-y-6 max-w-4xl mx-auto"
    >
 <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
    Update Category
  </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Category Name</label>
            <input
              type="text"
              value={CategoryName}
              onChange={handleCategoryNameChange} // Call the new handler
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>


        <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Slug</label>
            <input
              type="text"
              value={Slug}
              readOnly // Make it read-only since it's generated
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Meta Title
            </label>
            <input
              type="text"
              name="metatitle"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)} // Update metaTitle state
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Meta Description
            </label>
            <input
              type="text"
              name="metades"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)} // Update metaDescription state
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="col-span-2 flex flex-col border border-gray-300 rounded-xl p-3 bg-white shadow-lg max-h-40 overflow-y-auto transition-shadow duration-200 ease-in-out hover:shadow-xl">
            <label className="block text-sm font-medium text-gray-700">
              Keywords
            </label>

            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full shadow-sm transition-transform transform hover:scale-105"
                >
                  {keyword}
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-150"
                    onClick={() => removeKeyword(index)}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>

            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleKeywordKeyPress}
              placeholder="Add a keyword and press Enter"
              className="w-full mt-2 p-1 outline-none border-t border-gray-200 bg-transparent placeholder-gray-400 text-gray-700"
            />
          </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Current Logo</label>
          {currentLogo && (
            <img src={serverurl+'media/'+currentLogo.replace('/api/', '')} alt="Current Logo" className="mt-2 mb-2 h-20" />
          )}
          <label className="block text-sm font-medium text-gray-700">Upload Logo</label>
          <input
            type="file"
            onChange={handleLogoChange}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            accept="image/*"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Current Cover Image</label>
          {currentCover && (
            <img src={serverurl+'media/'+currentCover.replace('/api/', '')} alt="Current Cover" className="mt-2 mb-2 h-20" />
          )}
          <label className="block text-sm font-medium text-gray-700">Upload Cover Image</label>
          <input
            type="file"
            onChange={handleCoverChange}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            accept="image/*"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="w-full rounded-full uppercase shadow-lg bg-primary text-white text-sm font-semibold py-4 px-6 hover:bg-primary-dark transition duration-300 ease-in-out transform hover:scale-105"
        >
          Update
        </button>
      </div>
    </form>
          {/* {message && <Message message={message} />}
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div className="">
              <Formlabel text="Category" forLabel="category" />
              <InputField
                inputId="category"
                inputName="category"
                inputType="text"
                register={register}
                error={errors.category}
              />
            </div>

            <div className="mb-5">
              <Formlabel text="Thumbnail" forLabel="thumbnail" />
              <input
                id="thumbnail"
                onChange={(e) => setThumbnail(Array.from(e.target.files))}
                className="rounded-full outline-none shadow-formFeilds text-text-gray text-sm py-4 bg-white pl-5 pr-5 border-2 border-[#E4E4E4] w-full"
                type="file"
                name="thumbnail"
                accept="image/jpeg,image/png,image/webp"
              />
              {thumbnailDB && (
                <div className="flex gap-4 items-center">
                  <span>Current Thumbnail:</span>
                  <Image
                    src={`${serverurl}media/${thumbnailDB}`}
                    alt=""
                    className="aspect-square my-4 rounded-sm bg-white d-flex p-1"
                    width={180}
                    height={180}
                  />
                </div>
              )}
            </div>

            <div className="mb-5">
              <Formlabel text="Cover" forLabel="cover" />
              <input
                id="cover"
                onChange={(e) => setCover(Array.from(e.target.files))}
                className="rounded-full outline-none shadow-formFeilds text-text-gray text-sm py-4 bg-white pl-5 pr-5 border-2 border-[#E4E4E4] w-full"
                type="file"
                name="cover"
                accept="image/jpeg,image/png,image/webp"
              />
              {coverDB && (
                <div className="flex gap-4 items-center">
                  <span>Current Cover:</span>
                  <Image
                    src={`${serverurl}media/${coverDB}`}
                    alt=""
                    className="aspect-square my-4 rounded-sm bg-white d-flex p-1"
                    width={180}
                    height={180}
                  />
                </div>
              )}
            </div>




            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="bg-primary px-5 py-3 text-white"
              >
                Save
              </button>
            </div>
          </form> */}
        </div>
  </>
  );
};

export default Updatecategory;
