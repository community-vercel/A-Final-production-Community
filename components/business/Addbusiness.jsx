"use client";
import Formlabel from "@/components/Formlabel";
import InputField2 from "@/components/InputField2";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import Loader from "@/components/Loader";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddBusinessZod } from "@/zod/AddBusinessZod";
import { useSelector } from "react-redux";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/16/solid";

import { CitySelect, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { toast } from "react-toastify";
import Breadcrumb from "@/components/BreadCrum";
import { H2 } from "../Typography";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"]; // Load only the required library

const Addbusiness = () => {
  const router = useRouter();
  const { user_meta, user } = useSelector((state) => state.auth);

  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const languageNames = {
    en: "English",
    fr: "French",
    es: "Spanish",
    pt: "Portuguese",
    ar: "Arabic",
  };
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const countryid = 233;
  const [stateid, setstateid] = useState(0);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [categories, setCategories] = useState(null);

  const [selectedCategories, setSelectedCategories] = useState(null);
  const selectInputRef = useRef();
  const [filteredTags, setFilteredTags] = useState([]);

  const [logo, setLogo] = useState(null);
  const [images, setImages] = useState(null);
  const [imagesSelected, setImagesSelected] = useState([]);

  const [customErrors, setCustomErrors] = useState({});
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");

  const [selectedItems, setSelectedItems] = useState([]);

  const autocompleteRef = useRef();

  const [place, setPlace] = useState(null);


  

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setCurrentTag(inputValue);

    const filtered = allTags.filter((tag) =>
      tag.tag.toLowerCase().startsWith(inputValue.toLowerCase())
    );

    setFilteredTags(filtered);
  };

  const handleAddTag = (tag) => {
    if (tag && !tags.find((t) => t.tag === tag.tag)) {
      setTags([...tags, tag]);
      setCurrentTag("");
      setFilteredTags(allTags);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && currentTag) {
      handleAddTag({ tag: currentTag });
      e.preventDefault();
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

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
  const rearrangeData = (result) => {
    const reArrangeDatas = result.categories.map((item) => ({
      value: item.id, // Unique value for the category
      label: item.name,
      isParent: true,
      subcategories: item.subcategories.map((sub) => ({
        value: `sub${sub.id}`, // Unique value for the subcategory
        label: sub.name,
        isParent: false,
        parentId: item.id, // Parent ID as a reference
      })),
    }));
    setCategories(reArrangeDatas);
  };

  // Handle change of selection
  const isSelected = (item) =>
    item && selectedItems.some((selected) => selected.value === item.value);
  const handleSelectChange = (option) => {
    let newSelectedItems = [...selectedItems];
    const alreadySelected = newSelectedItems.some(
      (item) => item.value === option.value
    );

    if (option.isParent) {
      // Handle category selection
      if (alreadySelected) {
        newSelectedItems = newSelectedItems.filter(
          (item) =>
            item.value !== option.value && item.parentId !== option.value
        );
      } else {
        newSelectedItems.push(
          option,
          ...option.subcategories.filter((sub) => !alreadySelected)
        );
      }
    } else {
      // Handle subcategory selection
      const parent = categories.find((cat) => cat.value === option.parentId);

      if (alreadySelected) {
        newSelectedItems = newSelectedItems.filter(
          (item) => item.value !== option.value
        );

        if (parent) {
          const allSubcategoriesSelected = parent.subcategories.every((sub) =>
            newSelectedItems.some((item) => item.value === sub.value)
          );

          if (!allSubcategoriesSelected) {
            newSelectedItems = newSelectedItems.filter(
              (item) => item.value !== parent.value
            );
          }
        }
      } else {
        newSelectedItems.push(option);

        if (parent) {
          const allSubcategoriesSelected = parent.subcategories.every((sub) =>
            newSelectedItems.some((item) => item.value === sub.value)
          );

          if (allSubcategoriesSelected && !alreadySelected) {
            newSelectedItems.push(parent);
          }
        }
      }
    }

    setSelectedItems(newSelectedItems);
  };

  // Custom Option Component
  const CustomOption = ({ data, innerRef, innerProps }) => (
    <div
      ref={innerRef}
      {...innerProps}
      className={`p-2 hover:bg-blue-50 flex items-center cursor-pointer ${
        data?.isParent ? "font-bold" : "ml-6 text-sm"
      }`}
      onClick={() => handleSelectChange(data)} // Click handler
    >
      <input
        type="checkbox"
        checked={isSelected(data)} // Check selection state
        className="mr-2"
        readOnly
      />
      {data?.label || "Unnamed"}
    </div>
  );

  useEffect(() => {
    if (user && !user.id) router.push("/");

    const getCategories = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${serverurl}get-categories/`);
        const result = await response.json();
        if (response.ok) {
          rearrangeData(result.results);

          if (result.tags) {
            const uniqueTags = Array.from(
              new Set(result.tags.map((tag) => tag.tag.toLowerCase()))
            ).map((tag) => {
              return result.tags.find((t) => t.tag.toLowerCase() === tag);
            });

            setAllTags(uniqueTags);
            setFilteredTags(uniqueTags);
          }
        } else {
          setError(result.error || "Failed to fetch categories");
        }
      } catch (error) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(AddBusinessZod),
  });

  const defaultValues = {
    b_facebook: "https://www.facebook.com/",
    b_instagram: "https://www.instagram.com/",
    b_youtube: "https://www.youtube.com/",
    b_tiktok: "https://www.tiktok.com/",
    b_twitter: "https://www.x.com/",
  };

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      if (!logo) {
        return setCustomErrors({
          ...customErrors,
          logo: "Please select a logo.",
        });
      }
      if (!imagesSelected) {
        return setCustomErrors({
          ...customErrors,
          images: "Please select images.",
        });
      }
      const lat = place?.geometry.location.lat(); // Get the latitude
      const lng = place?.geometry.location.lng(); // Get the longitude
  
      let formDataToSend = new FormData();
      formDataToSend.append("b_name", formData.b_name);
      formDataToSend.append("b_slug", slug);
      formDataToSend.append("b_metaname", formData.b_metaname);
      formDataToSend.append("b_metades", formData.b_metades);

      formDataToSend.append("b_description", formData.b_description);
      formDataToSend.append("b_phone", formData.b_phone);
      formDataToSend.append("b_email", formData.b_email);
      formDataToSend.append("b_website", formData.b_website);
      formDataToSend.append("b_operating_hours", formData.b_operating_hours);
      formDataToSend.append("b_location", place?.name);
      formDataToSend.append("b_city", selectedCity);
      formDataToSend.append("b_state", selectedState);
      formDataToSend.append("b_location", place?.name);

      formDataToSend.append("lat", lat);
      formDataToSend.append("lng", lng);
      formDataToSend.append("b_zip", formData.b_zip);
      formDataToSend.append("b_discount_code", formData.b_discount_code);
      formDataToSend.append("b_discount_message", formData.b_discount_message);
      formDataToSend.append("user_id", user.id);
      formDataToSend.append("b_language", selectedLanguages);
      formDataToSend.append("b_facebook", formData.b_facebook);
      formDataToSend.append("b_instagram", formData.b_instagram);
      formDataToSend.append("b_youtube", formData.b_youtube);
      formDataToSend.append("b_tiktok", formData.b_tiktok);
      formDataToSend.append("b_twitter", formData.b_twitter);
      formDataToSend.append("approved", user_meta.role === 1 ? "1" : "0");
      const selectedData = [];
      const selectedValues = new Set(selectedItems.map((item) => item.value));


      selectedItems.forEach((item) => {
        if (item.isParent) {
          // Push main category only
          selectedData.push({ categoryId: item.value, subcategoryId: null });
        } else {
          // Find and push both subcategory and its parent category
          const parentCategory = categories.find((cat) =>
            cat.subcategories.some((sub) => sub.value === item.value)
          );

          if (parentCategory) {
            selectedData.push({
              categoryId: parentCategory.value,
              subcategoryId: Number(item.value.replace("sub", "")), // Removes "sub" and converts to number
            });
            // Ensure the main category is also included
            if (!selectedValues.has(parentCategory.value)) {
              selectedData.push({
                categoryId: parentCategory.value,
                subcategoryId: null,
              });
            }
          }
        }
      });

      // Append each category and subcategory pair to formDataToSend
      selectedData.forEach((data) => {
        if (data.categoryId !== null) {
          // Ensure categoryId is defined
          formDataToSend.append("categories[]", JSON.stringify(data));
        }
      });

      const tagsString = tags.map((tag) => tag.tag).join(",");
  
      formDataToSend.append("b_tags", tagsString);

      const keywordsString = keywords.join(",");
     
      formDataToSend.append("b_keywords", keywordsString);

      formDataToSend.append("logo", logo[0]);
      imagesSelected.forEach((image) => formDataToSend.append("images", image));

      // Send request
      const response = await fetch(`${serverurl}create-business/`, {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.ErrorCode === 0) {
        toast.success("Business created successfully");

        const data = {
          receiver_id: user.id,
          notification_type: "business",
          notification_operation: "add",
          related_entity_id: result.data.id,
        };

        router.push("/business/");
      } else if (result.ErrorCode === 3) {
        toast.error(
          "Business with same link Already Present Please Change the Slug"
        );
        setSelectedState(selectedCity);
        setSelectedCity(selectedCity);
      } else {
        toast.error(...customErrors, "Error in adding");
        setCustomErrors({ ...customErrors, form: result.ErrorMsg });
        setSelectedState(selectedCity);
        setSelectedCity(selectedCity);
      }
    } catch (error) {
      toast.error(error, "Error in adding");

      console.error("Error creating business:", error);
    } finally {
      setLoading(false);
    }
  };

  const imgDelete = (name) => {
   
    setImagesSelected(imagesSelected.filter((file) => file.name != name));
  };
  const languagesToDisplay =
    user_meta.role !== 1
      ? user_meta.language && user_meta.language.length > 0
        ? user_meta.language
        : [{ status: "active", language: "en" }]
      : user_meta.language && user_meta.language.length > 0
      ? user_meta.language
      : Object.keys(languageNames).map((key) => ({
          code: key,
          name: languageNames[key],
        })); // Default to English

  const [slug, setSlug] = useState("");

  const name = watch("b_name");

  useEffect(() => {
    if (name && name.trim() !== "") {
      const generatedSlug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      setSlug(generatedSlug);
      setValue("slug", generatedSlug);
    }
  }, [name, setValue]);
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Add Business", href: "/business/add" },
  ];



  
    // Load the Google Maps JavaScript API
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY, // Secure this key
      libraries,
    });
  
    if (!isLoaded) return <div>     <Loader /></div>;
 
   
    const handlePlaceChanged = () => {
      const selectedPlace = autocompleteRef.current.getPlace();
      setPlace(selectedPlace);
    };
  return (
    <>
      <div className="mt-5 grid md:grid-cols-2 gap-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>{" "}
      {loading ? (
        <Loader />
      ) : (
        <div>
          <div>
            <H2 className="flex items-center justify-center ">Add Business</H2>
          </div>
          <div className="p-7 b__Add">
            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
            >
              <div>
                <section className="bg-white p-6 shadow-lg rounded-lg flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-start md:w-1/4">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        <svg
                          class="w-6 h-6 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 10h1M5 10h1m-3 4h1m1 0h1m-3 4h1m1 0h1m3-16h1m1 0h1m3 4h1m1 0h1M6 18h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>

                      <h2 className="text-2xl font-semibold text-gray-800">
                        Business Contact Information
                      </h2>
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <InputField2
                          inputId="b_name"
                          inputName="b_name"
                          inputType="text"
                          placeholder="Enter your name"
                          register={register}
                          required={true}
                          error={errors.b_name}
                        />
                      </div>

                      <div>
                        <input
                          id="slug"
                          name="slug"
                          type="text"
                          value={slug}
                          onChange={(e) => {
                            setSlug(e.target.value); // Allow manual input
                            setValue("slug", e.target.value); // Update form state
                          }}
                          placeholder="Enter your slug"
                          className={`rounded-full pl-4 resize-none h-14 outline-none shadow-formFeilds text-text-gray text-sm py-2 pr-5 border-2 w-full`}
                        />
                      </div>
                      <div>
                        <InputField2
                          inputId="b_email"
                          inputName="b_email"
                          inputType="email"
                          register={register}
                          placeholder="Enter your Email" // Add placeholder prop here
                          required={true}
                          error={errors.b_email}
                        />
                      </div>
                      <div>
                        <InputField2
                          inputId="b_phone"
                          inputName="b_phone"
                          inputType="text"
                          register={register}
                          placeholder="Enter your Phone" // Add placeholder prop here
                          required={true}
                          error={errors.b_phone}
                        />
                      </div>
                      <div>
                        <InputField2
                          inputId="b_website"
                          inputName="b_website"
                          inputType="text"
                          register={register}
                          placeholder="Enter your Website" // Add placeholder prop here
                          error={errors.b_website}
                        />
                      </div>
                      <div className="">
                        <InputField2
                          inputId="b_zip"
                          inputName="b_zip"
                          inputType="text"
                          register={register}
                          placeholder="Enter Zip Code"
                          required={true}
                          error={errors.b_zip}
                        />
                      </div>
                      <div className="mb-5">
                        <StateSelect
                          required
                          countryid={countryid}
                          onTextChange={(e) => {
                            if (!e.target.value) {
                              setstateid("");
                              setSelectedState("");
                            }
                          }}
                          onChange={(e) => {
                       
                            setstateid(e.id);
                            setSelectedState(e.name);
                          }}
                          placeHolder="Select State"
                          inputClassName="outline-none shadow-formFeilds text-sm font-inter !border-transparent w-full"
                        />
                      </div>

                      <div className="mb-5">
                        <CitySelect
                          required
                          countryid={countryid}
                          stateid={stateid}
                          onTextChange={(e) => {
                            if (!e.target.value) {
                              setSelectedCity("");
                            }
                          }}
                          onChange={(e) => {
                      
                            setSelectedCity(e.name);
                          }}
                          placeHolder="Select City"
                          inputClassName="outline-none shadow-formFeilds text-sm font-inter !border-transparent w-full"
                        />
                      </div>
                      <div className="">
                        <Autocomplete
                          onLoad={(autocomplete) =>
                            (autocompleteRef.current = autocomplete)
                          }
                          onPlaceChanged={handlePlaceChanged}
                        >
                          <input
                            type="text"
                            placeholder="Search places and enter address"
                            className={`rounded-full resize-none h-15  outline-none shadow-formFeilds text-text-gray text-sm py-4 pl-5 pr-5 border-2 border-[#E4E4E4] w-full`}
                          />
                        </Autocomplete>
                      </div>
                      {/* <div className="">
                        <InputField2
                          inputId="b_location"
                          inputName="b_location"
                          inputType="text"
                          register={register}
                          placeholder="Enter Your Address"
                          required={true}
                          error={errors.b_location}
                        />
                      </div> */}
                    </div>
                  </div>
                </section>

                <section className="bg-white mt-8 p-6 shadow-lg rounded-lg flex flex-col md:flex-row gap-6">
                  {/* Left Sidebar with Icon and Heading */}
                  <div className="flex flex-col items-start md:w-1/4">
                    <div className="flex items-center mb-6">
                      {/* Icon */}
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        {/* Use your own SVG or Icon here */}
                        <svg
                          className="w-6 h-6 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 10h1M5 10h1m-3 4h1m1 0h1m-3 4h1m1 0h1m3-16h1m1 0h1m3 4h1m1 0h1M6 18h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      {/* Heading */}
                      <h2 className="text-2xl font-semibold text-gray-800">
                        Business Branding Assets and Purpose
                      </h2>
                    </div>
                  </div>

                  {/* Right Side Form */}

                  <div className="md:w-3/4">
                    <div className="grid md:grid-cols-1 gap-10">
                      {/* Logo Input */}
                      <div className="mb-5">
                        {/* Upload Logo */}
                        <div className="border-dashed border-2 border-green-500 p-4 rounded-lg">
                          <Formlabel
                            text="Upload Logo"
                            forLabel="logo"
                            isRequired
                          />
                          <div className="flex items-center gap-3">
                            <input
                              id="logo"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={(e) => {
                                setLogo(Array.from(e.target.files));
                                setCustomErrors({
                                  ...customErrors,
                                  logo: "",
                                });
                              }}
                              className="hidden"
                              type="file"
                              name="logo"
                            />
                            <label
                              htmlFor="logo"
                              className="cursor-pointer bg-green-600 text-white rounded-lg px-5 py-2"
                            >
                              Upload Logo
                            </label>
                            {customErrors.logo && (
                              <span className="text-red-400 text-sm">
                                {customErrors.logo}
                              </span>
                            )}
                            {logo &&
                              logo.map((file, i) => (
                                <Image
                                  key={i}
                                  src={URL.createObjectURL(file)}
                                  alt="logo"
                                  width={70}
                                  height={70}
                                  className="bg-white rounded-full p-1"
                                />
                              ))}
                          </div>
                        </div>

                        {/* Upload Property Images */}
                        <div className="border-dashed border-2 border-green-500 p-4 mt-5 rounded-lg">
                          <Formlabel
                            text="Upload Images of your Property"
                            forLabel="images"
                          />
                          <div className="flex flex-col gap-3">
                            <input
                              id="images"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={(e) => {
                                setImages(Array.from(e.target.files));
                                setCustomErrors({
                                  ...customErrors,
                                  images: "",
                                });
                                setImagesSelected([
                                  ...imagesSelected,
                                  ...Array.from(e.target.files),
                                ]);
                              }}
                              className="hidden"
                              type="file"
                              name="images"
                              multiple
                            />
                            <label
                              htmlFor="images"
                              className="cursor-pointer bg-green-600 text-white rounded-lg px-5 py-2"
                            >
                              Upload Images
                            </label>
                            <div className="text-sm text-gray-600">
                              <p>✓ Ads with pictures get 5x more views.</p>
                              <p>
                                ✓ Upload good quality pictures with proper
                                lighting.
                              </p>
                              <p>✓ first image will be your cover image.</p>
                              <p className="text-xs">
                                Max size 5MB, .jpg, .png,web only
                              </p>
                            </div>
                            {customErrors.images && (
                              <span className="text-red-400 text-sm">
                                {customErrors.images}
                              </span>
                            )}
                            {imagesSelected && (
                              <div className="flex gap-3 flex-wrap mt-3">
                                {imagesSelected.map((file, i) => (
                                  <div className="relative" key={i}>
                                    <Image
                                      src={URL.createObjectURL(file)}
                                      alt="property-image"
                                      width={150}
                                      height={150}
                                      className="bg-white rounded-sm p-1 object-cover"
                                    />
                                    <XMarkIcon
                                      className="w-4 h-4 absolute top-2 right-2 cursor-pointer bg-white text-black rounded-full"
                                      onClick={() => imgDelete(file.name)}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="bg-white mt-8 p-6 shadow-lg rounded-lg flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-start md:w-1/4">
                    <div className="flex items-center mb-6">
                      {/* Icon */}
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        {/* Use your own SVG or Icon here */}
                        <svg
                          class="w-6 h-6 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 10h1M5 10h1m-3 4h1m1 0h1m-3 4h1m1 0h1m3-16h1m1 0h1m3 4h1m1 0h1M6 18h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      {/* Heading */}
                      <h2 className="text-2xl font-semibold text-gray-800">
                        SEO Information
                      </h2>
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Meta Name */}
                      <div>
                        <InputField2
                          inputId="b_metaname"
                          inputName="b_metaname"
                          inputType="text"
                          placeholder="Enter Meta Title"
                          register={register}
                          required={true}
                          error={errors.b_metaname}
                        />
                      </div>

                      {/* Meta Description */}
                      <div>
                        <InputField2
                          inputId="b_metades"
                          inputName="b_metades"
                          inputType="text"
                          placeholder="Enter Meta Description"
                          register={register}
                          required={true}
                          error={errors.b_metades}
                        />
                      </div>

                      {/* Keywords */}
                      <div>
                        {/* <div className="flex flex-wrap gap-2 border border-gray-300 rounded-full p-2 bg-white shadow-md transition-shadow duration-200 ease-in-out"> */}

                        <div className="flex flex-col border border-gray-300 rounded-xl p-3 bg-white shadow-lg max-h-40 overflow-y-auto transition-shadow duration-200 ease-in-out hover:shadow-xl">
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
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-white mt-8 p-6 shadow-lg rounded-lg flex flex-col md:flex-row gap-6">
                  {/* Left Sidebar with Icon and Heading */}
                  <div className="flex flex-col items-start md:w-1/4">
                    <div className="flex items-center mb-6">
                      {/* Icon */}
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        {/* Use your own SVG or Icon here */}
                        <svg
                          className="w-6 h-6 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 10h1M5 10h1m-3 4h1m1 0h1m-3 4h1m1 0h1m3-16h1m1 0h1m3 4h1m1 0h1M6 18h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      {/* Heading */}
                      <h2 className="text-2xl font-semibold text-gray-800">
                        Social Media Links
                      </h2>
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="">
                        <InputField2
                          inputId="b_facebook"
                          inputName="b_facebook"
                          inputType="text"
                          register={register}
                          placeholder="Enter Facebook Username @"
                          error={errors.b_facebook}
                        />
                      </div>

                      <div className="">
                        <InputField2
                          inputId="b_instagram"
                          inputName="b_instagram"
                          inputType="text"
                          register={register}
                          placeholder="Enter Instagaram Username @"
                          error={errors.b_instagram}
                        />
                      </div>

                      <div className="">
                        <InputField2
                          inputId="b_youtube"
                          inputName="b_youtube"
                          inputType="text"
                          register={register}
                          placeholder="Enter Youtube Link"
                          error={errors.b_youtube}
                        />
                      </div>

                      <div className="">
                        <InputField2
                          inputId="b_tiktok"
                          inputName="b_tiktok"
                          inputType="text"
                          placeholder="Enter Tiktok "
                          register={register}
                          error={errors.b_tiktok}
                        />
                      </div>
                      <div className="">
                        <InputField2
                          inputId="b_twitter"
                          inputName="b_twitter"
                          inputType="text"
                          register={register}
                          placeholder="Enter Twitter Username @"
                          error={errors.b_twitter}
                        ></InputField2>
                      </div>

                      <div></div>
                    </div>
                  </div>
                </section>
                <section className="bg-white mt-8 p-6 shadow-lg rounded-lg flex flex-col md:flex-row gap-6">
                  {/* Left Sidebar with Icon and Heading */}
                  <div className="flex flex-col items-start md:w-1/4">
                    <div className="flex items-center mb-6">
                      {/* Icon */}
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        {/* Use your own SVG or Icon here */}
                        <svg
                          className="w-6 h-6 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 10h1M5 10h1m-3 4h1m1 0h1m-3 4h1m1 0h1m3-16h1m1 0h1m3 4h1m1 0h1M6 18h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      {/* Heading */}
                      <h2 className="text-2xl font-semibold text-gray-800">
                        Promotional and Operational Information
                      </h2>
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="">
                        <InputField2
                          inputId="b_operating_hours"
                          inputName="b_operating_hours"
                          inputType="text"
                          register={register}
                          placeholder="Enter Operating hours"
                          error={""}
                        ></InputField2>
                      </div>

                      <div className="">
                        <InputField2
                          inputId="b_discount_code"
                          inputName="b_discount_code"
                          inputType="text"
                          register={register}
                          placeholder="Enter Discount Code"
                          error={""}
                        ></InputField2>
                      </div>

                      <div className="">
                        <InputField2
                          inputId="b_discount_message"
                          inputName="b_discount_message"
                          inputType="text"
                          register={register}
                          placeholder="Enter Discount Message"
                          error={""}
                        ></InputField2>
                        <span className="flex mb-5 -mt-3 text-gray-600 text-sm pl-4">
                          Use [code] to show discount code in your discount
                          message.
                        </span>
                      </div>
                      {languagesToDisplay &&
                        (user_meta.role !== 1 ? (
                          <div className="mb-5">
                            <Select
                              ref={selectInputRef}
                              name="b_language"
                              options={languagesToDisplay.map((lang) => ({
                                value: lang.language, // Ensure the value is the language code
                                label:
                                  languageNames[lang.language] ||
                                  lang.language.toUpperCase(), // Display full language name
                              }))}
                              placeholder="Select Language"
                              className="cursor-pointer border-0 border-gray-00 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              classNamePrefix="select_custom"
                              onChange={(selectedOption) => {
                                setSelectedLanguages(selectedOption.value); // Set the selected language state
                              }}
                              // isClearable // Allows clearing the selection
                            />
                          </div>
                        ) : (
                          <div className="mb-5">
                            <Select
                              ref={selectInputRef}
                              name="b_language"
                              options={languagesToDisplay.map((lang) => ({
                                value: lang.code || lang.language, // Use either 'code' or 'language' depending on the structure
                                label:
                                  languageNames[lang.code || lang.language] ||
                                  lang.language.toUpperCase(), // Display full language name or fallback
                              }))}
                              placeholder="Select Language"
                              className="cursor-pointer border-0 border-gray-00 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              classNamePrefix="select_custom"
                              onChange={(selectedOption) => {
                                setSelectedLanguages(selectedOption.value); // Set the selected language state
                              }}
                              isClearable // Allows clearing the selection
                            />
                          </div>
                        ))}

                      <div></div>
                    </div>
                  </div>
                </section>
                <section className="bg-white mt-8 p-6 shadow-lg rounded-lg flex flex-col md:flex-row gap-6">
                  {/* Left Sidebar with Icon and Heading */}
                  <div className="flex flex-col items-start md:w-1/4">
                    <div className="flex items-center mb-6">
                      {/* Icon */}
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        {/* Use your own SVG or Icon here */}
                        <svg
                          className="w-6 h-6 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 10h1M5 10h1m-3 4h1m1 0h1m-3 4h1m1 0h1m3-16h1m1 0h1m3 4h1m1 0h1M6 18h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      {/* Heading */}
                      <h2 className="text-2xl font-semibold text-gray-800">
                        Business Details
                      </h2>
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="mb-5">
                        <InputField2
                          inputId="b_description"
                          inputName="b_description"
                          inputType="textarea"
                          register={register}
                          placeholder="Enter Business Description"
                          required={true}
                          error={errors.b_description}
                          className="border-2 border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="mb-5">
                        {categories && (
                          <Select
                            isMulti
                            value={selectedItems}
                            onChange={(selected) =>
                              setSelectedItems(selected || [])
                            } // Handles clearing
                            options={categories.flatMap((cat) => [
                              cat,
                              ...cat.subcategories,
                            ])}
                            placeholder="Select Categories"
                            className="cursor-pointer border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            classNamePrefix="select_custom"
                            components={{ Option: CustomOption }}
                            closeMenuOnSelect={false}
                            isClearable // This ensures the clear icon appears
                          />
                        )}
                      </div>

                      <div className="mb-5 mt-0">
                        <div className="flex flex-col border border-gray-300 rounded-xl p-3 bg-white shadow-lg max-h-40 overflow-y-auto transition-shadow duration-200 ease-in-out hover:shadow-xl">
                          <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center"
                              >
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
                          </div>
                          <input
                            id="b_tags"
                            name="b_tags"
                            type="text"
                            value={currentTag}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            className="mt-0 flex-0 min-w-[150px] outline-none text-gray-700 text-sm py-2 px-3 bg-transparent placeholder-gray-400 border-none focus:ring-0 focus:outline-none"
                            placeholder="Add a tag and press Enter"
                          />
                        </div>

                        {/* Suggestion Dropdown */}
                        {currentTag && filteredTags.length > 0 && (
                          <div className="border border-gray-300 mt-1 rounded-md bg-white shadow-md z-10">
                            {filteredTags.map((tag, index) => (
                              <div
                                key={index}
                                onClick={() => handleAddTag(tag)}
                                className="cursor-pointer p-2 hover:bg-blue-50 transition duration-150 ease-in-out"
                                role="button"
                                aria-label={`Add tag: ${tag.tag}`}
                              >
                                {tag.tag}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div></div>
                    </div>
                  </div>
                </section>
              </div>
              <button
                type="submit"
                className="rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full disabled:cursor-progress"
                disabled={loading}
              >
                Add
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Addbusiness;
