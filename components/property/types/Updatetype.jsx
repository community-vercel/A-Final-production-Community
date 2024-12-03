"use client";
import Formlabel from "@/components/Formlabel";
import InputField from "@/components/InputField";
import Message from "@/components/Message";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState,useRef } from "react";
import { useSelector } from "react-redux"; 
import Select from "react-select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddCategoryZod } from "@/zod/AddCategoryZod";
import useAuth from "@/hooks/useAuth";
   
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
  import 'react-toastify/dist/ReactToastify.css';
import { AddTypeZod } from "@/zod/AddTypeZod";
import Breadcrumb from "@/components/BreadCrum";

const  Updatetype = () => {
  const router = useRouter();
  const auth = useAuth();
  const selectInputRef = useRef();

  const params = useParams();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailDB, setThumbnailDB] = useState(null);
  const [cover, setCover] = useState(null);
  const [coverDB, setCoverDB] = useState(null);
  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL
  const { user_meta, user } = useSelector((state) => state.auth);
  const selectedLanguage = user_meta.selectedlanguage  || "en"; // Get the first language or fallback to "en"
  const [logo, setLogo] = useState(null);

 const [selectedLanguages, setSelectedLanguages] = useState(null);
 const [Slug, setSlug] = useState(''); // State for the slug
 const [typeName, settypeName] = useState('');
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


const handleTypeNameChange = (e) => {
  const newName = e.target.value;
  settypeName(newName);
  setSlug(generateSlug(newName)); // Set the generated slug
};

 // Initialize as null to capture selected language
 const [languages] = useState([
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "pt", name: "Portuguese" },
  { code: "ar", name: "Arabic" },
]);
const languageOptions = languages.map((lang) => ({
  value: lang.code,
  label: lang.name,
}));

  const [subtypes, setSubTypes] = useState([]); // Manage selected tags
  const [currentSubType, setCurrentSubType] = useState(''); // Current input value
  const [allTypes, setAllTypes] = useState([]); // All available tags
  const [filteredTags, setFilteredTags] = useState([]); // Filtered tags based on input


const handleInputChange = (e) => {
  const inputValue = e.target.value;
  setCurrentSubType(inputValue);

  // Filter subtypes based on the current input
  const filtered = allTypes.filter((name) =>
    name.name.toLowerCase().startsWith(inputValue.toLowerCase())
  );
  setFilteredTags(filtered);
};

// Add subtype if not already selected
const handleAddType = (name) => {
  if (name && !subtypes.find((t) => t.name === name.name)) {
    setSubTypes([...subtypes, name]); // Add to selected subtypes
    setCurrentSubType(''); // Clear input field
    setFilteredTags(allTypes); // Reset filtered list
  }
};

// Handle Enter key to add subtype
const handleKeyDown = (e) => {
  if (e.key === 'Enter' && currentSubType) {
    handleAddType({ name: currentSubType }); // Add input as subtype
    e.preventDefault(); // Prevent form submission
  }
};

// Remove a selected subtype by index
const removeTag = (indexToRemove) => {
  setSubTypes(subtypes.filter((_, index) => index !== indexToRemove));
};



  useEffect(() => {
    if (auth && !auth.user?.id) router.push("/");

    // function to fill the form data from data base
    const getData = async () => {
      try {
        // get all current buiness categories
        const requestBody = JSON.stringify({property_type_id: params.id });

        const response = await fetch(`${serverurl}get-propertytype/`, {
          method: 'POST', // Use POST method
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody, // Send request body as JSON
        });

        const result = await response.json();
       

        if (response.ok) {
          settypeName( result.data.name)
          setSlug(result.data.slug)
          setMetaTitle(result.data.metaname)
          setMetaDescription(result.data.metades)
          setCurrentLogo(result.data.thumbnail); // Assuming `logo` is the field name
          setCurrentCover(result.data.cover); 
          setKeywords(result.data.keywords.split(","))
        setSelectedLanguages( 
      result.data.language,
        )       
        
         setSubTypes(result.data.sub_types)
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
    setError,
    setValue,
  } = useForm({
    resolver: zodResolver(AddTypeZod),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    
    try {
      // Create a new FormData object to handle file uploads
      const keywordsString = keywords.join(",");

      const formDat = new FormData();
      
      formDat.append("property_type_id", params.id);
      formDat.append("sub-types", JSON.stringify(subtypes)); // Convert selected subtypes to JSON string
      formDat.append("language", selectedLanguage); // Add selected language
      formDat.append("userid",auth.user?.id)
      formDat.append('name', typeName);
      formDat.append('slug', Slug);
      formDat.append('metaname',metaTitle);
      formDat.append('metades', metaDescription);
      formDat.append('keyword', keywordsString);

   
 if(logo){
  formDat.append('thumbnail', logo);

}
else{
  formDat.append('thumbnail', currentLogo);

}

if(cover){
  formDat.append('cover', cover);
}
else{
  formDat.append('cover', currentCover);
}
      
      const response = await fetch(`${serverurl}update-type/`, {
        method: 'POST', 
        body: formDat, 
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setMessage("Property Type updated successfully!");
        router.push('/property/type');
      } else {
        setMessage(result.error || "Failed to update category");
      }
    } catch (error) {
      setMessage("An unexpected error occurred: " + error.message);
    }
  };
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Update Type", href: `/property/type/update/${params.id}` },
  ];

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="mt-5 grid md:grid-cols-1 gap-6">
      <Breadcrumb items={breadcrumbItems} /> 
     
</div>
              <div className="p-7">
            <form
              onSubmit={handleSubmit}
              className="mt-5 p-6 md:p-8 bg-white shadow-lg rounded-lg space-y-6 max-w-4xl mx-auto"
            >
              <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
               Update Type
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Type Name
                  </label>
                  <input
                    type="text"
                    value={typeName}
                    onChange={handleTypeNameChange} // Call the new handler
                    className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>

                {/* Slug Input Field - optional if you want to display it */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={Slug}
                    readOnly // Make it read-only since it's generated
                    className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="col-span-2 flex flex-col border border-gray-300 rounded-xl p-3 bg-white shadow-lg max-h-40 overflow-y-auto transition-shadow duration-200 ease-in-out hover:shadow-xl">
  <label className="block text-sm font-medium text-gray-700">
    Subtype
  </label>

  <div className="flex flex-wrap gap-2">
    {/* Display selected subtypes */}
    {subtypes.map((name, index) => (
      <span
        key={index}
        className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full shadow-sm transition-transform transform hover:scale-105"
      >
        {name.name}
        <button
          type="button"
          onClick={() => removeTag(index)}
          className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
          aria-label={`Remove tag: ${name.name}`}
        >
          &times;
        </button>
      </span>
    ))}
    
    {/* Input field for adding subtypes */}
    <input
      id="b_subtype"
      name="b_subtype"
      type="text"
      value={currentSubType} // Bind input value to state
      onChange={handleInputChange} // Handle input change
      onKeyDown={handleKeyDown} // Add tag on Enter key press
      className="w-full mt-2 p-1 outline-none border-t border-gray-200 bg-transparent placeholder-gray-400 text-gray-700"
      placeholder="Add Sub Type and press Enter"
    />
  </div>
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

                {/* <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Languages
                  </label>
                  <Select
                    options={languageOptions}
                    isMulti
                    value={selectedLanguages}
                    onChange={setSelectedLanguages}
                    className="mt-2"
                  />
                </div> */}
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
          </div>
        {/* <div className="p-7">
          {message && <Message message={message} />}
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
           <div className="">
              <Formlabel text="Type" forLabel="type" />
              <InputField
                inputId="type"
                inputName="type"
                inputType="text"
                register={register}
                placeholder="Enter Type Name"
                required={true}
                error={errors.type}
              />
            </div>
            <div className="mb-5 mt-0">
              <Formlabel text="Subtypes (Amenities)" forLabel="subtypes" />
              <div className="flex flex-wrap gap-2 border border-gray-300 rounded-full p-2 bg-white shadow-md transition-shadow duration-200 ease-in-out">
                {subtypes.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center">
                    {tag.name}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                      aria-label={`Remove tag: ${tag.name}`}
                    >
                      &times;
                    </button>
                  </span>
                ))}

                <input
                  id="b_subtype"
                  name="b_subtype"
                  type="text"
                  value={currentSubType} // Bind input value to state
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="mt-0 flex-0 min-w-[320px] outline-none text-gray-700 text-sm py-2 px-3 bg-transparent placeholder-gray-400 border-none focus:ring-0 focus:outline-none"
                  placeholder="Add Sub Type and press Enter"
                />
              </div>
            </div>

            <div className="mb-5">
              <Formlabel text="Thumbnail" forLabel="thumbnail" />
              <input
                id="thumbnail"
                onChange={(e) => setThumbnail(Array.from(e.target.files))}
                className="rounded-full  outline-none shadow-formFeilds text-text-gray text-sm py-4 bg-white pl-5 pr-5 border-2 border-[#E4E4E4] w-full"
                type="file"
                name="thumbnail"
                accept="image/jpeg,image/png,image/webp"
              />
              {thumbnailDB && (
                <div className="flex gap-4 items-center">
                  <span>Current Thumbnail:</span>
                  <Image src={`${serverurl}media/${thumbnailDB}`}
                  
                      alt=""
                    className="aspect-square my-4 rounded-sm  bg-white d-flex p-1"
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
                className="rounded-full  outline-none shadow-formFeilds text-text-gray text-sm py-4 bg-white pl-5 pr-5 border-2 border-[#E4E4E4] w-full"
                type="file"
                name="cover"
                accept="image/jpeg,image/png,image/webp"
              />
              {coverDB && (
                <div className="flex gap-4 items-center">
                <div className="flex gap-4 items-center">
                  <span>Current Cover:</span>
                  <Image
 src={`${serverurl}media/${coverDB}`}                    
  alt=""
                    className="aspect-square my-4 rounded-sm  bg-white d-flex p-1"
                    width={180}
                    height={180}
                  />
                  </div>
                </div>
              )}
            </div>
           

            <div className=" flex justify-end">
              <button
                type="submit"
                className="max-w-[300px] rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full"
              >
                Update
              </button>
            </div>
          </form>
        </div> */}
        </>
      )}
    </>
  );
};

export default Updatetype;
