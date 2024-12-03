"use client";
import Formlabel from "@/components/Formlabel";
import InputField2 from "@/components/InputField2";
import { useRouter, useParams } from "next/navigation";
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
import { AddeventZod } from "@/zod/AddeventZod";
import { GetLanguages, GetState, GetCity } from "react-country-state-city";
import { H2 } from "../Typography";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"]; // Load only the required library


const Updateevent = () => {
  const router = useRouter();
  const params = useParams();

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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const selectInputRef = useRef();

  const [logo, setLogo] = useState(null);
  const [images, setImages] = useState([]); // Initialize as an empty array
  const [imagesSelected, setImagesSelected] = useState([]);

  const [customErrors, setCustomErrors] = useState({});
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");

  const [feature, setfeature] = useState([]);
  const [keywordInputfeature, setKeywordInputfeature] = useState("");
  const autocompleteRef = useRef();

  const [place, setPlace] = useState(null);
  const [lat,setLatitude]=useState()

  const [longitude,setlongitude]=useState()

  const [selectedItems, setSelectedItems] = useState([]);
 
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
  const handlefeatureKeywordKeyPress = (e) => {
    if (e.key === "Enter" && keywordInputfeature.trim()) {
      e.preventDefault();
      if (!feature.includes(keywordInputfeature.trim())) {
        setfeature([...feature, keywordInputfeature.trim()]);
      }
      setKeywordInputfeature("");
    }
  };

  const removefeaturKeyword = (index) => {
    setfeature(keywords.filter((_, i) => i !== index));
  };
  const rearrangeData = (result) => {
 

    const reArrangeDatas = result.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    setCategories(reArrangeDatas);
  };
  useEffect(() => {
    if (user && !user.id) router.push("/");

    const getCategories = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${serverurl}get-alleventcategory/`);
        const result = await response.json();
        if (response.ok) {
          rearrangeData(result.data);
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
  const [logourl, SetLogoUrl] = useState();
  const [selectedStateDB, setSelectedStateDB] = useState({});
  const [selectedCityDB, setSelectedCityDB] = useState({});
  const [myselectedlanguage, setMySelectedLanguage] = useState(null); // DB selected form data stored

  // for images input
  const [logoDB, setLogoDB] = useState(null); //for logo input
  const [imagesDB, setImagesDB] = useState([]); // for images input

  useEffect(() => {
    // if (user && !user.id) router.push("/");

    const getData = async () => {
      try {
        setLoading(true);

        const formData = {
          slug: params.slug,
        };
        // Fetch business details, categories, and tags from the Django API
        const response = await fetch(`${serverurl}get-specificevent/`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        setValue("e_username", data.name);
        setValue("e_name", data.title);

        setValue("e_slug", data.slug);
        // setValue("e_startdate",data.start_date);
        setStartDate(data.start_date);
        // setValue("e_enddate",data.end_date);
        setEndDate(data.end_date);
        setStartTime(data.start_time);
        setEndTime(data.end_time);
        setValue("e_metaname", data.meta_name);
        setValue("e_metades", data.meta_description);

        setValue("e_description", data.description);
        setValue("e_phone", data.phone);
        setValue("e_email", data.email);
        setValue("e_price", String(data.price));

        setValue("e_location", data.address);
        setLatitude(data.lat)
        setlongitude(data.longitude)
        setValue("e_city", selectedCity);
        setValue("e_state", selectedState);
        setValue("e_zip", data.zip);
        setSelectedItems(data.category);
        setValue("e_paymenttitle", data.payment_title);
        setValue("e_paymentinstruction", data.payment_instruction);
        setValue("e_participant", String(data.max_participants));
        setValue("e_language", data.language);

        setValue("user_id", user.id);
        setValue("language", selectedLanguages);

        setValue("approved", user_meta.role === 1 ? "1" : "0");

        // const keywordsString = data.keywords.join(",");
        // console.log("keywords", keywordsString);
        // setValue("keywords", keywordsString);
        const featureString = keywords.join(",");
        setValue("features", featureString);

        // setValue("logo", logo[0]);
        // imagesSelected.forEach((image) => setValue("images", image));

        // setKeywords(data.keywords)
        const processLogoUrl = (logoUrl) => {
          return logoUrl.replace("/api/", "");
        };

        // Construct the final logo URL
        const logoUrls = processLogoUrl(serverurl + data.logo);
        SetLogoUrl(logoUrls);
        setKeywords(data.keywords.split(","));
        setfeature(data.features.split(","));
        setLogoDB(data.logo);
        setImagesDB(data.cover_image);
        setMySelectedLanguage({
          value: data.language,
          label:
            languageNames[myselectedlanguage] || data.language.toUpperCase(),
        });
        //     SetLogoUrl(logoUrls)
        //     setKeywords(data.keyword.split(","));

        //       const receivedAmenities = data.ammenities.split(',');

        //       setSelectedAmenities(receivedAmenities);
        //     //  setValue(" language",data.language)
        //   // setMy(data.language)
        //   //  setMySelectedLanguage(data.language)
        //     setSelectedType(data.types[0].propertytype_id);

        //     setSelectedChild(data.subtype)
        //     setLogoDB(data.logo);
        //     setImagesDB(data.images);
        //     setMySelectedLanguage({
        //       value: data.language,
        //       label: languageNames[myselectedlanguage] || data.language.toUpperCase(),
        //     })

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
    setValue,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(AddeventZod),
  });

  const onSubmit = async (formData) => {

    try {
      setLoading(true);
      const lati = place?.geometry.location.lat(); // Get the latitude
      const lngi = place?.geometry.location.lng(); // Get the longitude
  
      let formDataToSend = new FormData();
      

      if (logo) {
        formDataToSend.append("logo", logo[0]);
      } else {

        formDataToSend.append("logo", logoDB);
      }
      if (images && Array.isArray(images) && images.length > 0) {
        images.forEach((image) => {
          formDataToSend.append("images", image);
        });
      } else if (imagesDB) {
        formDataToSend.append("existing_images", imagesDB); // These will be paths

      }

    

      formDataToSend.append("title", formData.e_name);
      formDataToSend.append("name", formData.e_username);

      formDataToSend.append("slug", slug);
      formDataToSend.append("startdate", startDate);
      formDataToSend.append("enddate", endDate);
      formDataToSend.append("starttime", startTime);
      formDataToSend.append("endtime", endTime);

      formDataToSend.append("metaname", formData.e_metaname);
      formDataToSend.append("metades", formData.e_metades);

      formDataToSend.append("description", formData.e_description);
      formDataToSend.append("phone", formData.e_phone);
      formDataToSend.append("email", formData.e_email);
      formDataToSend.append("price", formData.e_price);

      formDataToSend.append("address", place?.name?place?.name:formData.e_location);
      formDataToSend.append("lat", lati?lati:lat);
      formDataToSend.append("longitude", lngi?lngi:longitude);

      formDataToSend.append(
        "city",
        selectedCity ? selectedCity : selectedCityDB.name
      );
      formDataToSend.append(
        "state",
        selectedState ? selectedState : selectedStateDB.name
      );
      formDataToSend.append("zip", formData.e_zip);
      formDataToSend.append("category_id", selectedItems.value);
      formDataToSend.append("paymenttitle", formData.e_paymenttitle);
      formDataToSend.append(
        "paymentinstruction",
        formData.e_paymentinstruction
      );
      formDataToSend.append(
        "max_participants",
        formData.e_participant.toString()
      );

      formDataToSend.append("user_id", user.id);
      formDataToSend.append("language", selectedLanguages && selectedLanguages.length > 0 ? selectedLanguages : formData.e_language,
      );

      formDataToSend.append("approved", user_meta.role === 1 ? "1" : "0");
      formDataToSend.append("slugs", params.slug);

      const keywordsString = keywords.join(",");
      const featureString = feature.join(",");

      formDataToSend.append("keywords", keywordsString);
      formDataToSend.append("features", featureString);

      // Send request
      const response = await fetch(`${serverurl}update-eventsdata/`, {
        method: "POST",

        body: formDataToSend,
      });

      const result = await response.json();

      if (result.ErrorCode === 0) {
        toast.success("Events updated successfully");
        router.push("/events/");
      } else if (result.ErrorCode === 3) {
        toast.error(
          "Events with same link Already Present Please Change the Slug"
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

  const imgDelete = (image, type) => {
    if (type === "imagesDB") {
      // Remove from `imagesDB`
      setImagesDB((prevImagesDB) =>
        prevImagesDB.filter((img) => img !== image)
      );
    } else if (type === "imagesSelected") {
      // Remove from `imagesSelected`
      setImagesSelected((prevSelected) =>
        prevSelected.filter((file) => file.name !== image.name)
      );
      // Also remove from `images` if synced with `imagesSelected`
      setImages((prevImages) =>
        prevImages.filter((file) => file.name !== image.name)
      );
    }
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

  const name = watch("e_name");

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
    {
      label: `Update Event (${params.slug.toUpperCase()})`,
      href: `/events/update/${params.slug}`,
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
      {" "}
      {loading ? (
        <Loader />
      ) : (
        <div>
          <div className="mt-5 grid md:grid-cols-2 gap-6">
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div>
            <H2 className="flex items-center justify-center ">Update Events</H2>
          </div>
          <div className="p-7 e__Add">
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
                        Events Contact Information
                      </h2>
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <InputField2
                          inputId="e_name"
                          inputName="e_name"
                          inputType="text"
                          placeholder="Enter event name"
                          register={register}
                          required={true}
                          error={errors.e_name}
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
                          placeholder="Slug"
                          className={`rounded-full pl-4 resize-none h-14 outline-none shadow-formFeilds text-text-gray text-sm py-2 pr-5 border-2 w-full`}
                        />
                      </div>
                      <div>
                        <InputField2
                          inputId="e_email"
                          inputName="e_email"
                          inputType="email"
                          register={register}
                          placeholder="Enter your Email" // Add placeholder prop here
                          required={true}
                          error={errors.e_email}
                        />
                      </div>
                      <div>
                        <InputField2
                          inputId="e_phone"
                          inputName="e_phone"
                          inputType="text"
                          register={register}
                          placeholder="Enter your Phone" // Add placeholder prop here
                          required={true}
                          error={errors.e_phone}
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
                          inputId="e_zip"
                          inputName="e_zip"
                          inputType="text"
                          register={register}
                          placeholder="Enter Zip Code"
                          required={true}
                          error={errors.e_zip}
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
                          inputId="e_location"
                          inputName="e_location"
                          inputType="text"
                          register={register}
                          placeholder="Enter Your Address"
                          required={true}
                          error={errors.e_location}
                        />
                        </Autocomplete>
                      </div>
                     
                      <div className="">
                        <InputField2
                          inputId="e_username"
                          inputName="e_username"
                          inputType="text"
                          register={register}
                          placeholder="Enter your or company name"
                          required={true}
                          error={errors.e_username}
                        />
                      </div>
                      <div className="">
                        <InputField2
                          inputId="e_price"
                          inputName="e_price"
                          inputType="number"
                          register={register}
                          placeholder="Add price if its not free"
                          error={errors.e_price}
                        />
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
                        Events Branding Assets and Purpose
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
                            {logoDB ? (
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
                            ) : (
                              logo &&
                              logo.length > 0 && (
                                <div className="flex gap-4 items-center">
                                  <span>Current logo:</span>
                                  <Image
                                    src={URL.createObjectURL(logo[0])}
                                    alt=""
                                    className="w-14 h-14 my-4 rounded-full bg-white d-flex p-1"
                                    width={100}
                                    height={100}
                                  />
                                </div>
                              )
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
                                const selectedFiles = Array.from(
                                  e.target.files
                                ); // Convert FileList to an array
                                setImages((prevImages) => [
                                  ...prevImages,
                                  ...selectedFiles,
                                ]);
                                setCustomErrors({
                                  ...customErrors,
                                  images: "",
                                });
                                setImagesSelected((prevSelected) => [
                                  ...prevSelected,
                                  ...selectedFiles,
                                ]);
                              }}
                              className="hidden"
                              type="file"
                              name="images"
                              multiple
                            />
                            {/* Upload Label */}
                            <label
                              htmlFor="images"
                              className="cursor-pointer bg-green-600 text-white rounded-lg px-5 py-2"
                            >
                              Upload Images
                            </label>

                            {/* Upload Tips */}
                            <div className="text-sm text-gray-600">
                              <p>✓ Ads with pictures get 5x more views.</p>
                              <p>
                                ✓ Upload good quality pictures with proper
                                lighting.
                              </p>
                              <p>✓ First image will be your cover image.</p>
                              <p className="text-xs">
                                Max size 5MB, .jpg, .png, .web only
                              </p>
                            </div>

                            {/* Error Message */}
                            {customErrors.images && (
                              <span className="text-red-400 text-sm">
                                {customErrors.images}
                              </span>
                            )}

                            {/* Existing Images (From Database) */}
                            {imagesDB &&
                              imagesDB.length > 0 &&
                              imagesDB.map((item, index) => (
                                <div
                                  className="relative h-full"
                                  key={`db-${index}`}
                                >
                                  <Image
                                    src={serverurl + "media/" + item}
                                    alt="property-image"
                                    className="aspect-square rounded-sm bg-white d-flex p-1"
                                    width={180}
                                    height={180}
                                  />
                                  <XMarkIcon
                                    className="w-4 h-4 absolute top-3 right-2 cursor-pointer bg-white text-black rounded-full"
                                    onClick={() => imgDelete(item, "imagesDB")}
                                  />
                                </div>
                              ))}

                            {/* Selected Images (Uploaded but Not Yet Saved to Database) */}
                            {imagesSelected && (
                              <div className="flex gap-3 flex-wrap mt-3">
                                {imagesSelected.map((file, i) => (
                                  <div
                                    className="relative"
                                    key={`selected-${i}`}
                                  >
                                    <Image
                                      src={URL.createObjectURL(file)}
                                      alt="property-image"
                                      width={150}
                                      height={150}
                                      className="bg-white rounded-sm p-1 object-cover"
                                    />
                                    <XMarkIcon
                                      className="w-4 h-4 absolute top-2 right-2 cursor-pointer bg-white text-black rounded-full"
                                      onClick={() =>
                                        imgDelete(file, "imagesSelected")
                                      }
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
                          inputId="e_metaname"
                          inputName="e_metaname"
                          inputType="text"
                          placeholder="Enter Meta Title"
                          register={register}
                          required={true}
                          error={errors.e_metaname}
                        />
                      </div>

                      {/* Meta Description */}
                      <div>
                        <InputField2
                          inputId="e_metades"
                          inputName="e_metades"
                          inputType="text"
                          placeholder="Enter Meta Description"
                          register={register}
                          required={true}
                          error={errors.e_metades}
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
                            d="M6 18h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      {/* Heading */}
                      <h2 className="text-2xl font-semibold text-gray-800">
                        Date and Time Information
                      </h2>
                    </div>
                  </div>

                  {/* Right Content */}
                  <div className="md:w-3/4">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Start Date */}
                      <div>
                        <label
                          htmlFor="start_date"
                          className="text-lg font-medium text-gray-700"
                        >
                          Start Date:
                        </label>
                        <input
                          id="e_startdate"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          min={new Date().toISOString().split("T")[0]} // Sets the minimum date to today's date
                        />
                      </div>

                      {/* End Date */}
                      <div>
                        <label
                          htmlFor="end_date"
                          className="text-lg font-medium text-gray-700"
                        >
                          End Date:
                        </label>
                        <input
                          id="e_enddate"
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          min={new Date().toISOString().split("T")[0]} // Sets the minimum date to today's date
                        />
                      </div>

                      {/* Start Time */}
                      <div>
                        <label
                          htmlFor="start_time"
                          className="text-lg font-medium text-gray-700"
                        >
                          Start Time:
                        </label>
                        <input
                          id="e_starttime"
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      {/* End Time */}
                      <div>
                        <label
                          htmlFor="end_time"
                          className="text-lg font-medium text-gray-700"
                        >
                          End Time:
                        </label>
                        <input
                          id="e_endtime"
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
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
                        Payment Information
                      </h2>
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Meta Name */}
                      <div>
                        <InputField2
                          inputId="e_paymenttitle"
                          inputName="e_paymenttitle"
                          inputType="text"
                          placeholder="Enter Payment Title"
                          register={register}
                          required={true}
                          error={errors.e_paymenttitle}
                        />
                      </div>

                      <div>
                        <InputField2
                          inputId="e_paymentinstruction"
                          inputName="e_paymentinstruction"
                          inputType="textarea"
                          placeholder="Enter payment instruction"
                          register={register}
                          required={true}
                          error={errors.e_paymentinstruction}
                        />
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
                        Events Details
                      </h2>
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="mb-5">
                        <InputField2
                          inputId="e_description"
                          inputName="e_description"
                          inputType="textarea"
                          register={register}
                          placeholder="Enter events Description"
                          required={true}
                          error={errors.e_description}
                          className="border-2 border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <InputField2
                          inputId="e_link"
                          inputName="e_link"
                          inputType="text"
                          placeholder="Registration link if any"
                          register={register}
                          error={errors.e_link}
                        />
                      </div>
                      <div className="mb-5">
                        {categories && (
                          <Select
                            value={selectedItems}
                            onChange={(selected) =>
                              setSelectedItems(selected || [])
                            } // Handles clearing
                            options={categories}
                            placeholder="Select Category"
                            className="cursor-pointer border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            classNamePrefix="select_custom"
                            // components={{ Option: CustomOption }}
                            closeMenuOnSelect={false}
                            isClearable // This ensures the clear icon appears
                          />
                        )}
                      </div>
                      {languagesToDisplay &&
                        (user_meta.role !== 1 ? (
                          <div className="mb-5">
                            <Select
                              ref={selectInputRef}
                              name="e_language"
                              defaultValue={myselectedlanguage}
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
                              name="e_language"
                              defaultValue={myselectedlanguage}
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
                      <div>
                        {/* <div className="flex flex-wrap gap-2 border border-gray-300 rounded-full p-2 bg-white shadow-md transition-shadow duration-200 ease-in-out"> */}

                        <div className="flex flex-col border border-gray-300 rounded-xl p-3 bg-white shadow-lg max-h-40 overflow-y-auto transition-shadow duration-200 ease-in-out hover:shadow-xl">
                          <div className="flex flex-wrap gap-2">
                            {feature.map((keyword, index) => (
                              <span
                                key={index}
                                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full shadow-sm transition-transform transform hover:scale-105"
                              >
                                {keyword}
                                <button
                                  type="button"
                                  className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-150"
                                  onClick={() => removefeaturKeyword(index)}
                                >
                                  &times;
                                </button>
                              </span>
                            ))}
                          </div>

                          <input
                            type="text"
                            value={keywordInputfeature}
                            onChange={(e) =>
                              setKeywordInputfeature(e.target.value)
                            }
                            onKeyDown={handlefeatureKeywordKeyPress}
                            placeholder="Add a feature and press Enter"
                            className="w-full mt-0 p-1 outline-none border-t border-gray-200 bg-transparent placeholder-gray-400 text-gray-700"
                          />
                        </div>
                      </div>
                      <div>
                        <InputField2
                          inputId="e_participant"
                          inputName="e_participant"
                          inputType="number"
                          required={true}
                          placeholder="Max Participant allowed"
                          register={register}
                          error={errors.e_participant}
                        />
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
                Update{" "}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Updateevent;
