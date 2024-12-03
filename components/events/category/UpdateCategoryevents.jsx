"use client";

import React, { useState,useEffect, useRef } from "react";

import useAuth from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Select from "react-select";
import * as FaIcons from "react-icons/fa"; // Import all icons from react-icons/fa
import Breadcrumb from "@/components/BreadCrum";

const UpdateCategoryevents = () => {
  const router = useRouter();
  const auth = useAuth();
  const [message, setMessage] = useState(null);
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const params = useParams();

  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const { user_meta, user } = useSelector((state) => state.auth);
  const selectedLanguage = user_meta.selectedlanguage || "en"; // Get the first language or fallback to "en"
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredIcons, setFilteredIcons] = useState(Object.keys(FaIcons)); // Initially show all icons
  const [selectedIcon, setSelectedIcon] = useState(null); // Stores either icon name or uploaded file
  
  // Handle icon selection
  const handleIconSelect = (iconName) => {
    setSelectedIcon(iconName);
  };
  
  // Handle SVG file upload
  const handleIconUpload = (file) => {
    setSelectedIcon(file); // Save the uploaded file in state
  };

  const [languages] = useState([
    { code: "en", name: "English" },
    { code: "fr", name: "French" },
    { code: "es", name: "Spanish" },
    { code: "pt", name: "Portuguese" },
    { code: "ar", name: "Arabic" },
  ]);

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
  
  const languageOptions = languages.map((lang) => ({
    value: lang.code,
    label: lang.name,
  }));
 
  if (auth && !auth.user?.id) router.push("/");

  const [CategoryName, setCategoryName] = useState("");

  const [loading, setLoading] = useState(true);
  const [Slug, setSlug] = useState(""); // State for the slug

  const generateSlug = (name) => {
    return name
      .toLowerCase() // Convert to lowercase
      .trim() // Trim whitespace
      .replace(/[\s]+/g, "-") // Replace spaces with hyphens
      .replace(/[^\w-]+/g, ""); // Remove special characters
  };

  const handleCategoryNameChange = (e) => {
    const newName = e.target.value;
    setCategoryName(newName);
    setSlug(generateSlug(newName)); // Set the generated slug
  };
  useEffect(() => {
    const filtered = Object.keys(FaIcons).filter((iconName) =>
      iconName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredIcons(filtered);
  }, [searchQuery]);
  // Prefill data for updating
  useEffect(() => {
  
      const fetchCategory = async () => {
        setIsLoading(true);
        try {
            const requestBody = JSON.stringify({slug: params.slug });
            const response = await fetch(`${serverurl}get-specificeventscategory/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: requestBody,
            });
          const data = await response.json();

          if (data) {
            setCategoryName(data.category);
            setSlug(data.slug);
            setMetaTitle(data.metaname);
            setMetaDescription(data.metades);
            setKeywords(data.keywords.split(","));
            if (data && data.icon.includes("svg")) {
                setSelectedIcon( serverurl + data.icon.replace("/api/media/", "media/"));

                
            
              } else {
                // If it doesn't contain "/api/media", prepend the server URL
                setSelectedIcon( data.icon.replace("/api/media/", ""));
              }
            setSelectedLanguages({
                value: data.languages,
                label:
                 data.languages.toUpperCase(),
              });
              
            // setSelectedLanguages(
            //   data.languages.map((lang) => ({
            //     value: lang.code,
            //     label: lang.name,
            //   }))
            // );
          }
        } catch (error) {
          toast.error("Failed to fetch category details", { position: "top-right" });
        } finally {
          setIsLoading(false);
        }
      };

      fetchCategory();
    
  }, []);

  // Handle form submission for create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const keywordsString = keywords.join(",");

      const form = new FormData();
      form.append("userid", auth.user?.id);
      form.append("category", CategoryName);
      form.append("slug", Slug);
      form.append("metaname", metaTitle);
      form.append("metades", metaDescription);
      form.append("keywords", keywordsString);
      form.append(
        "icon",
        typeof selectedIcon === "string" ? selectedIcon : selectedIcon
      );

     
      if (Array.isArray(selectedLanguages)) {
        selectedLanguages.forEach((lang) => form.append("language", lang.value));
      } else {
        form.append("language", selectedLanguages.value)      }
      

      const response = await fetch(`${serverurl}update-eventscategorydata/`, {
        method: "PUT",
        body: form,
      });

      const result = await response.json();

      if (result.ErrorCode === 0) {
        toast.success(result.ErrorMsg, { position: "top-right" });
        router.push("/events/category/");
      } else {
        toast.error(result.ErrorMsg || "An error occurred", {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred", { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: `Update Event Category (${params.slug.toUpperCase()})`, href: `/events/update/${params.slug}` },
  ];

  return (
<> <div className="mt-5 grid md:grid-cols-2 gap-6">
<Breadcrumb items={breadcrumbItems} /> 

</div>

    <div className="p-2">
      <form
        onSubmit={handleSubmit}
        className="mt-5 p-2 md:p-8 bg-white shadow-lg rounded-lg space-y-6 max-w-full mx-auto"
      >
        <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
          Update Category
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div >
            <label className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              value={CategoryName}
              onChange={handleCategoryNameChange} // Call the new handler
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>

          {/* Slug Input Field - optional if you want to display it */}
          <div >
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
          <div>
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

          <div >
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

          <div className="flex flex-col border border-gray-300 rounded-xl p-3 bg-white shadow-lg max-h-40 overflow-y-auto transition-shadow duration-200 ease-in-out hover:shadow-xl">
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
          <div className="flex flex-col border border-gray-300 rounded-xl p-3 bg-white shadow-lg max-h-40  transition-shadow duration-200 ease-in-out hover:shadow-xl">
            <label className="block text-sm font-medium text-gray-700">
           Select Language
            </label>
            <Select
              options={languageOptions}
              isMulti
              value={selectedLanguages}
              onChange={setSelectedLanguages}
              className="mt-2"
            //   className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="col-span-2">
  <label
    htmlFor="icon-search"
    className="block mb-2 text-sm font-medium text-gray-700"
  >
    Search and Select Icon
  </label>
  <input
    id="icon-search"
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none"
    placeholder="Search for an icon..."
  />
  {selectedIcon && (
    <div className="p-2 rounded-full bg-gray-100 mt-2 flex items-center justify-center">
      {typeof selectedIcon === "string" ? (
        React.createElement(FaIcons[selectedIcon], { size: 40 })
      ) : (
        <img
          src={URL.createObjectURL(selectedIcon)}
          alt="Uploaded Icon"
          className="w-10 h-10"
        />
      )}
    </div>
  )}
  <div className="grid grid-cols-6 gap-3 max-h-60 overflow-y-auto mt-2">
    {filteredIcons.map((iconName) => {
      const IconComponent = FaIcons[iconName]; // Dynamically get the icon component
      return (
        <div
          key={iconName}
          className={`p-2 border-2 ${
            selectedIcon === iconName ? "border-blue-500" : "border-gray-300"
          } rounded-lg cursor-pointer flex justify-center`}
          onClick={() => handleIconSelect(iconName)}
        >
          <IconComponent size={30} />
        </div>
      );
    })}
  </div>

  {/* Allow User to Upload Icon */}
  <div className="mt-4">
    <label
      htmlFor="icon-upload"
      className="block mb-2 text-sm font-medium text-gray-700"
    >
      Can&apos;t find your icon? Upload SVG
    </label>
    <input
      id="icon-upload"
      type="file"
      accept=".svg"
      onChange={(e) => {
        if (e.target.files[0] && e.target.files[0].type === "image/svg+xml") {
          handleIconUpload(e.target.files[0]);
        } else {
          alert("Please upload a valid SVG file.");
        }
      }}
      className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none"
    />
  </div>
</div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full disabled:cursor-progress"
            >
    Update
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default UpdateCategoryevents;