"use client";
import Formlabel from "@/components/Formlabel";
import InputField2 from "@/components/InputField2";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddBusinessZod } from "@/zod/AddBusinessZod";
import { useSelector } from "react-redux";
import SelectCountryDropdown from "@/components/SelectCountryDropdown";
import Image from "next/image";
import { extractImagePath } from "@/utils/extractImagePath";
import { XMarkIcon } from "@heroicons/react/16/solid";
import {
  GetLanguages,
  CitySelect,
  StateSelect,
  GetState,
  GetCity,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import Breadcrumb from "../BreadCrum";
import { toast } from "react-toastify";
import { H2 } from "../Typography";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import Loader from "../Loader";

const libraries = ["places"]; // Load only the required library

const Updatebusiness = () => {
  const params = useParams();
  const router = useRouter();

  const { user_meta, user } = useSelector((state) => state.auth);
  const selectedLanguage = user_meta.selectedlanguage || "en"; // Get the first language or fallback to "en"
  const languageNames = {
    en: "English",
    fr: "French",
    es: "Spanish",
    pt: "Portuguese",
    ar: "Arabic",
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
        }));
  const [categories, setCategories] = useState(null);

  const [selectedCategories, setSelectedCategories] = useState(null);
  const [selectedCategoriesDB, setSelectedCategoriesDB] = useState(null);
  const selectInputRef = useRef();
  const [myselectedlanguage, setMySelectedLanguage] = useState(null);

  const [logo, setLogo] = useState(null);
  const [images, setImages] = useState([]);
  const [logoDB, setLogoDB] = useState(null);
  const [imagesDB, setImagesDB] = useState([]);
  const [customErrors, setCustomErrors] = useState({});
  const [selectedlanguage, setSelectedLanguages] = useState();
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [imagesSelected, setImagesSelected] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [allTags, setAllTags] = useState([]); // All available tags

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setCurrentTag(inputValue);

    // Filter tags that start with the input
    const filtered = allTags.filter((tag) =>
      tag.tag.toLowerCase().startsWith(inputValue.toLowerCase())
    );

    setFilteredTags(filtered);
  };

  // Handle adding a tag
  const handleAddTag = (tag) => {
    if (tag && !tags.find((t) => t.tag === tag.tag)) {
      setTags([...tags, tag]); // Add the tag to selected tags
      setCurrentTag(""); // Clear input
      setFilteredTags(allTags); // Reset filtered tags
    }
  };

  // Handle key down event to add tag with Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && currentTag) {
      handleAddTag({ tag: currentTag }); // Add the current input as a tag
      e.preventDefault(); // Prevent form submission on Enter
    }
  };
  const [filteredTags, setFilteredTags] = useState([]); // Tags filtered for suggestions

  // Remove tag from selected tags
  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const [languageList, setLanguageList] = useState([]);
  const countryid = 233;
  const [stateid, setstateid] = useState(0);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [logourl, SetLogoUrl] = useState();
  const [selectedStateDB, setSelectedStateDB] = useState({});
  const [selectedCityDB, setSelectedCityDB] = useState({});
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [id, setid] = useState([]);

  const autocompleteRef = useRef();

  const [place, setPlace] = useState(null);
  const [lat,setLatitude]=useState()

  const [longitude,setlongitude]=useState()

  const isSelected = (item) =>
    item && selectedItems.some((selected) => selected.value === item.value);

  const handleSelectChange = (option) => {
    let newSelectedItems = [...selectedItems];
    const alreadySelected = isSelected(option);

    const toggleParentAndSubcategories = (parent) => {
      if (alreadySelected) {
        // Deselect parent and all its subcategories
        newSelectedItems = newSelectedItems.filter(
          (item) =>
            item.value !== parent.value &&
            !parent.subcategories.some((sub) => sub.value === item.value)
        );
      } else {
        // Select parent and only add subcategories that aren't already selected
        newSelectedItems.push(
          parent,
          ...parent.subcategories.filter((sub) => !isSelected(sub))
        );
      }
    };

    const toggleSubcategory = (subcategory, parent) => {
      if (alreadySelected) {
        // Deselect the subcategory
        newSelectedItems = newSelectedItems.filter(
          (item) => item.value !== subcategory.value
        );

        // If no subcategories remain selected, remove the parent
        const remainingSubsSelected = parent.subcategories.some((sub) =>
          isSelected(sub)
        );
        if (!remainingSubsSelected) {
          newSelectedItems = newSelectedItems.filter(
            (item) => item.value !== parent.value
          );
        }
      } else {
        // Select the subcategory
        newSelectedItems.push(subcategory);

        // If all subcategories are selected, add the parent
        const allSubsSelected = parent.subcategories.every((sub) =>
          isSelected(sub)
        );
        if (allSubsSelected) newSelectedItems.push(parent);
      }
    };

    // Check if the selected item is a parent or subcategory
    if (option.isParent) {
      toggleParentAndSubcategories(option);
    } else {
      const parent = categories.find((cat) =>
        cat.subcategories.some((sub) => sub.value === option.value)
      );
      toggleSubcategory(option, parent);
    }

    setSelectedItems(newSelectedItems.filter((item) => item && item.value));
  };

  const flattenSelectedItems = (items) =>
    items.flatMap((item) => [item, ...(item.subcategories || [])]);

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

  const handleKeywordKeyPress = (e) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      if (!keywords.includes(keywordInput.trim())) {
        setKeywords([...keywords, keywordInput.trim()]);
      }
      setKeywordInput("");
    }
  };
  const rearrangeData = (result) => {


    const reArrangeDatas = result.categories.map((item) => ({
      value: item.id,
      label: item.name,
      isParent: true,
      subcategories: item.subcategories.map((sub) => ({
        value: sub.id,
        label: sub.name,
        isParent: false,
      })),
    }));
    setCategories(reArrangeDatas);
  };

  const removeKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };
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

            setAllTags(uniqueTags); // Store all unique tags
            setFilteredTags(uniqueTags); // Initialize filtered tags
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

  useEffect(() => {
    // if (user && !user.id) router.push("/");

    const getData = async () => {
      try {
        setLoading(true);

        const businessId = params.slug;

        const formData = {
          slug: params.slug,
        };
        // Fetch business details, categories, and tags from the Django API
        const response = await fetch(`${serverurl}get-specifibusiness/`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(formData),
        });

        const { data, ErrorCode, ErrorMsg } = await response.json();
        if (ErrorCode !== 0) {
          throw new Error(ErrorMsg);
        }
        const { business, categories, tags } = data;
        setid(data.id);
        setValue("b_name", data.name);
        setValue("b_metaname", data.metaname);
        setValue("b_metades", data.metades);
        setValue("b_keywords", data.keyword);

        setSlug(data.slug);
        setLatitude(data.lat)
        setlongitude(data.longitude)
        setValue("b_description", data.description);
        setValue("b_email", data.email);
        setValue("b_phone", data.phone);
        setValue("b_website", data.website);
        setValue("b_location", data.location);
        setValue("b_operating_hours", data.operating_hours);
        setValue("b_zip", data.zip);
        setValue("b_facebook", data.socials?.facebook);
        setValue("b_instagram", data.socials?.instagram);
        setValue("b_youtube", data.socials?.youtube);
        setValue("b_tiktok", data.socials?.tiktok);
        setValue("b_twitter", data.socials?.twitter);
        setValue("b_discount_code", data.discount_code);
        setValue("b_discount_message", data.discount_message);
        setValue("b_language", data.language);
        const processLogoUrl = (logoUrl) => {
          return logoUrl.replace("/api/", "");
        };

        // Construct the final logo URL
        const logoUrls = processLogoUrl(serverurl + data.logo);
        SetLogoUrl(logoUrls);

        setLogoDB(data.logo);
        setImagesDB(data.images);
        setMySelectedLanguage({
          value: data.language,
          label:
            languageNames[myselectedlanguage] || data.language.toUpperCase(),
        });
        // Set current categories
        const currentCategories = categories.map((item) => ({
          label: item.category__name,
          value: item.category__id,
        }));
        // Group categories with their subcategories
        const reArrangeDatas = Object.values(
          categories.reduce((acc, item) => {
            const categoryId = item.category__id;

            // Check if the category already exists in the accumulator
            if (!acc[categoryId]) {
              acc[categoryId] = {
                value: categoryId,
                label: item.category__name,
                isParent: true,
                subcategories: [],
              };
            }

            // If a subcategory exists, add it to the category's subcategories array
            if (item.subcategory__id && item.subcategory__name) {
              acc[categoryId].subcategories.push({
                value: item.subcategory__id,
                label: item.subcategory__name,
                isParent: false,
              });
            }

            return acc;
          }, {})
        );

     

        setSelectedItems(reArrangeDatas);

        setSelectedCategoriesDB(currentCategories);
        setKeywords(data.keyword.split(","));

        const tagsString = tags.map((tag) => tag.tag).join(","); // Extract tag names and join them

        setValue("b_tags", tagsString);
        setTags(tags);

        GetState(countryid).then((states) => {
          states.map((state) => {
            if (state.name === data.state) {
              setSelectedStateDB(state);
              GetCity(countryid, state.id).then((cities) => {
                cities.map((city) => {
                  if (city.name === data.city) {
                    setSelectedCityDB(city);
                  }
                });
              });
            }
          });
        });

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    getData();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setError,
    setValue,
  } = useForm({
    resolver: zodResolver(AddBusinessZod),
  });

  // update form data
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

  const onSubmit = async (formData) => {
    setAdding(true);
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      if (logo) {
        formDataToSend.append("logo", logo[0]);
      } else {
        formDataToSend.append("logo", logoDB);
      }
      if (images && images.length>0) {
        images.forEach((image) => {
          formDataToSend.append("images", image);
        });
      } else {
          formDataToSend.append("existing_images",  imagesDB);
    
      }
      // Convert tags array to a comma-separated string
      const tagsString = tags.map((tag) => tag.tag).join(",");

      const keywordsString = keywords.join(",");
      const lati = place?.geometry.location.lat(); // Get the latitude
      const lngi = place?.geometry.location.lng(); // Get the longitude
  
      const businessData = {
        id: id,
        name: formData.b_name,
        slug: slug,
        meta_name: formData.b_metaname,
        meta_description: formData.b_metades,
        description: formData.b_description,
        keywords: keywordsString,

        phone: formData.b_phone,
        email: formData.b_email,
        website: formData.b_website,
        operating_hours: formData.b_operating_hours,
        location: place?.name?place?.name:formData.b_location?formData.b_location:place?.name,
        lat:lati?lati:lat,
        longitude:lngi?lngi:longitude,
        city: selectedCity || selectedCityDB.name,
        state: selectedState || selectedStateDB.name,
        country: formData.b_country,
        zip: formData.b_zip,
        user_id: user.id,
        socials: {
          facebook: formData.b_facebook,
          instagram: formData.b_instagram,
          youtube: formData.b_youtube,
          tiktok: formData.b_tiktok,
          twitter: formData.b_twitter,
        },
        discount_code: formData.b_discount_code,
        discount_message: formData.b_discount_message,
        language: selectedlanguage,
        tags: tagsString,
      };

      // Add categories and other data
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
              subcategoryId: item.value,
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
      formDataToSend.append("businessData", JSON.stringify(businessData));
      formDataToSend.append("approved", user.role === 1 ? "1" : "0");

      const response = await fetch(`${serverurl}update-businessdata/`, {
        method: "POST",
        body: formDataToSend,
      });
      const result = await response.json();

      if (response.ok || result.ErrorCode === 0) {
        toast.success("Business updated successfully");

        router.push(`/business`);
      } else {
        throw new Error(result.ErrorMsg || "Failed to update business");
      }
    } catch (error) {
      console.error("Error updating business:", error);
      toast.error(error.message || "An error occurred during submission.");
    } finally {
      setAdding(false);
      setLoading(false);
    }
  };

  const imgDelete = async (name) => {
    setImages(images.filter((file) => file.name != name));
    if (name.includes("business/")) {
      try {
        const response = await fetch(`${serverurl}delete-businessimage/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image_url: name,
            business_id: params.id,
          }),
        });

        const result = await response.json();
        if (!response.ok || result.ErrorCode !== 0) {
          throw new Error(result.ErrorMsg || "Failed to delete image");
        }

        setImagesDB((prevImagesDB) =>
          prevImagesDB.filter((img) => img !== name)
        );
        setImages((prevImages) =>
          prevImages.filter((file) => file.name !== name)
        );
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      setImages(images.filter((file) => file.name != name));
    }
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Manage Business", href: "/business" },

    {
      label: `Update Business  (${params.slug.toUpperCase()}) `,
      href: "/business/update/" + params.slug,
    },
  ];
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
      <div className="mt-5 grid md:grid-cols-1 gap-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      {loading ? (
        <div className="">Loading ... </div>
      ) : (
        <div>
          <div className="mt-2">
            <H2 className="flex items-center justify-center  ">
              Update Business
            </H2>
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
                          defaultValue={selectedStateDB}
                        />
                      </div>

                      <div className="mb-5">
                        <CitySelect
                          required
                          countryid={countryid}
                          stateid={stateid ? stateid : selectedStateDB.id}
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
                          defaultValue={selectedCityDB}
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

                      <div className="">
                        <Autocomplete
                          onLoad={(autocomplete) =>
                            (autocompleteRef.current = autocomplete)
                          }
                          onPlaceChanged={handlePlaceChanged}
                        >
                          <InputField2
                             inputId="b_location"
                             inputName="b_location"
                             inputType="text"
                             register={register}
                             placeholder="Search your address" // Add placeholder prop here
                             error={errors.b_location}    />
                        </Autocomplete>
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
                            {!logo && logoDB && (
                              <div className="flex gap-4 items-center">
                                <span>Current logo:</span>
                                <Image
                                  src={logourl}
                                  alt=""
                                  className="w-14 h-14 my-4 rounded-full bg-white d-flex p-1"
                                  width={100}
                                  height={100}
                                />
                              </div>
                            )}
                            {customErrors.logo && (
                              <span className="text-red-400 text-sm pl-1">
                                {customErrors.logo}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Upload Property Images */}
                        <div className="border-dashed border-2 border-green-500 p-4 mt-5 rounded-lg">
                          <Formlabel
                            text="Upload Images of your Property"
                            forLabel="images"
                          />
                          <div className="flex flex-col gap-3">
                            {/* File Input */}
                            <input
                              id="images"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={(e) => {
                                const newFiles = Array.from(e.target.files);
                                setImages((prevImages) => [
                                  ...prevImages,
                                  ...newFiles,
                                ]);
                                setCustomErrors((prevErrors) => ({
                                  ...prevErrors,
                                  images: "",
                                }));
                              }}
                              className="hidden"
                              type="file"
                              name="images"
                              multiple
                            />

                            {/* Upload Button */}
                            <label
                              htmlFor="images"
                              className="cursor-pointer bg-green-600 text-white rounded-lg px-5 py-2"
                            >
                              Upload Images
                            </label>

                            {/* Info Section */}
                            <div className="text-sm text-gray-600">
                              <p>✓ Ads with pictures get 5x more views.</p>
                              <p>
                                ✓ Upload good quality pictures with proper
                                lighting.
                              </p>
                              <p>✓ First image will be your cover image.</p>
                              <p className="text-xs">
                                Max size 5MB, .jpg, .png, .webp only
                              </p>
                            </div>

                            {/* Error Message */}
                            {customErrors.images && (
                              <span className="text-red-400 text-sm">
                                {customErrors.images}
                              </span>
                            )}

                            {/* Display Selected Images */}
                            {images.length > 0 && (
                              <div className="flex gap-3 flex-wrap mt-3">
                                {images.map((file, i) => (
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
                                      onClick={() => imgDelete(i)}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Display Current Images */}
                            {imagesDB && imagesDB.length > 0 && (
                              <div>
                                <span className="inline-block mt-4 mb-1">
                                  Current Images:
                                </span>
                                <div className="flex gap-4 items-center flex-wrap">
                                  {imagesDB.map((item, index) => (
                                    <div className="relative" key={index}>
                                      <Image
                                        src={`${serverurl}media/${item}`}
                                        alt=""
                                        className="aspect-square rounded-sm bg-white p-1"
                                        width={180}
                                        height={180}
                                      />
                                      <XMarkIcon
                                        className="w-4 h-4 absolute top-3 right-2 cursor-pointer bg-white text-black rounded-full"
                                        onClick={() => imgDelete(index, true)} // True flag to indicate imagesDB deletion
                                      />
                                    </div>
                                  ))}
                                </div>
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
                          placeholder="Enter Meta Name"
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
                              defaultValue={myselectedlanguage} // Set the default value from the database
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
                              defaultValue={myselectedlanguage} // Set the default value from the database
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
                            value={flattenSelectedItems(selectedItems)}
                            onChange={(options) => {
                              if (!options) {
                                setSelectedItems([]); // Properly clear selections
                              } else {
                                options.forEach(handleSelectChange); // Apply selection logic
                              }
                            }}
                            options={categories.flatMap((cat) => [
                              cat,
                              ...(Array.isArray(cat.subcategories)
                                ? cat.subcategories
                                : []),
                            ])}
                            placeholder="Select Categories"
                            className="cursor-pointer border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            classNamePrefix="select_custom"
                            components={{ Option: CustomOption }}
                            closeMenuOnSelect={false}
                            isClearable
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
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Updatebusiness;
