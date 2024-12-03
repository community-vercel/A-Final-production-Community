"use client";
import Formlabel from "@/components/Formlabel";
import InputField2 from "@/components/InputField2";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { CheckCircleIcon, CurrencyDollarIcon, HomeIcon, XCircleIcon } from "@heroicons/react/16/solid";
import { toast } from "react-toastify";

 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddBusinessZod } from "@/zod/AddBusinessZod";
   
import { useSelector } from "react-redux";
import SelectCountryDropdown from "@/components/SelectCountryDropdown";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/16/solid";
import * as FaIcons from 'react-icons/fa'; // Import all FontAwesome icons

import {
  GetLanguages, CitySelect, StateSelect, GetState, GetCity
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { AddPropertyZod } from "@/zod/AddPropertyZod";
import Breadcrumb from "../BreadCrum";
import { H2 } from "../Typography";

import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import Loader from "../Loader";

const libraries = ["places"]; // Load only the required library

const Updateproperty = () => {
  const params = useParams();
  const router = useRouter();
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL

  const { user_meta, user } = useSelector((state) => state.auth);
 
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const countryid = 233;
  const [stateid, setstateid] = useState(0);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [selectedType, setSelectedType] = useState();
  const [selectedChild, setSelectedChild] = useState(null);
  const selectInputRef = useRef();
  const [filteredTags, setFilteredTags] = useState([]);
  const [logo, setLogo] = useState(null);
  const [images, setImages] = useState([]); // Initialize as an empty array
  const [imagesSelected, setImagesSelected] = useState([]);
  const [customErrors, setCustomErrors] = useState({});
  const [selectedPurpose, setSelectedPurpose] = useState('sell');
  const [selectedinstallement, setSelectedInstallement] = useState('1');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [ammenites, setAmmenites] = useState([]);
  const [types, setTypes] = useState([]);
  const selectedTypeObj = types.find((type) => type.id === selectedType);
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");

  const autocompleteRef = useRef();

  const [place, setPlace] = useState(null);
  const [lat,setLatitude]=useState()

  const [longitude,setlongitude]=useState()


  const languageNames = {
    en: 'English',
    fr: 'French',
    es: 'Spanish',
    pt: 'Portuguese',
    ar: 'Arabic',
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


  const handleChildChange = (childId) => {
    setSelectedChild(childId);
  };


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
      setCurrentTag('');
      setFilteredTags(allTags);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && currentTag) {
      handleAddTag({ tag: currentTag });
      e.preventDefault();
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleAmenityChange = (value) => {
    setSelectedAmenities((prev) =>
      prev.includes(value)
        ? prev.filter((amenity) => amenity !== value)
        : [...prev, value]
    );
  };


  const handleTypeChange = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedType(id);
    setSelectedChild(null);
  };


  const languagesToDisplay = user_meta.role !== 1 ? user_meta.language && user_meta.language.length > 0
    ? user_meta.language
    : [{ status: 'active', language: 'en' }]

    : user_meta.language && user_meta.language.length > 0
      ? user_meta.language
      : Object.keys(languageNames).map((key) => ({ code: key, name: languageNames[key] }))
    ; // Default to English

  const [categories, setCategories] = useState(null);


  //data coming from category tabel stored
  const [selectedCategories, setSelectedCategories] = useState(null); // local selected form data stored
  const [selectedCategoriesDB, setSelectedCategoriesDB] = useState(null); // DB selected form data stored
  const [myselectedlanguage, setMySelectedLanguage] = useState(null); // DB selected form data stored

  // for images input
  const [logoDB, setLogoDB] = useState(null); //for logo input
  const [imagesDB, setImagesDB] = useState([]); // for images input

  const [adding, setAdding] = useState(false);




  const [languageList, setLanguageList] = useState([]);

  const [logourl, SetLogoUrl] = useState()
  const [selectedStateDB, setSelectedStateDB] = useState({});
  const [selectedCityDB, setSelectedCityDB] = useState({});

  useEffect(() => {
    if (user && !user.id) router.push("/");
    const getTypess = async () => {

      setLoading(true);
      try {
        const response = await fetch(`${serverurl}get-type/`);
        const result = await response.json();

        if (response.ok) {

          setTypes(result.types);

        }
      } catch (error) {
        setError('An unexpected error occurred');
      }
      finally {
        setLoading(false);
      }
    };
    getTypess();
  }, []);
  useEffect(() => {
    const getAmmenties = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${serverurl}get-amenties/`);
        const result = await response.json();
        if (response.ok) {
          let reArrangeData = result.data.map((item) => {
            return { value: item?.id, label: item?.name, icon: item.icon };
          });

          setAmmenites(reArrangeData);
          if (result.tags) {
            const uniqueTags = Array.from(
              new Set(result.tags.map(tag => tag.tag.toLowerCase()))
            ).map(tag => {
              return result.tags.find(t => t.tag.toLowerCase() === tag);
            });

            setAllTags(uniqueTags); // Store all unique tags
            setFilteredTags(uniqueTags); // Initialize filtered tags
          }
        } else {
          setError(result.error || 'Failed to fetch categories');
        }
      } catch (error) {
        setError('An unexpected error occurred');
      }


    };

    getAmmenties();

  }, []);

  useEffect(() => {
    // if (user && !user.id) router.push("/");

    const getData = async () => {
      try {
        setLoading(true);


        const formData = {
          slug: params.slug
        }
        // Fetch business details, categories, and tags from the Django API
        const response = await fetch(`${serverurl}get-specificproperty/`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(formData),
        });

        const { data, ErrorCode, ErrorMsg } = await response.json();
        if (ErrorCode !== 0) {
          throw new Error(ErrorMsg);
        }
    
        const { business, types, tags } = data;
  

        // Set business details in state
        setValue("p_name", data.name);
        setValue("p_uname", data.name);
        setValue("p_metaname", data.metaname);
        setValue("p_metades", data.metades);
        setValue("p_area", data.area);
        setValue("p_unit", data.unit);
        setValue("p_price", data.price);
        setValue("p_bed", data.bed);
        setValue("p_baths", data.baths);
        setLatitude(data.lat);
        setlongitude(data.longitude);
        setValue("p_keywords", data.keyword);

        setSelectedPurpose(data.purpose);

        setValue('p_installement',data.installement==='true'?1:0);

        // setSelectedAmenities(data.)
        setValue("p_description", data.description);
        setValue("p_email", data.email);
        setValue("p_phone", data.phone);
        setValue("p_website", data.website);
        setValue("p_location", data.location);
        setValue("p_zip", data.zip);
        setValue("p_language", data.language);
        setSelectedLanguages(data.language)
        setKeywords(data.keyword)
        const processLogoUrl = (logoUrl) => {
          return logoUrl.replace('/api/', '');
        };

        // Construct the final logo URL
        const logoUrls = processLogoUrl(serverurl + data.logo);
        SetLogoUrl(logoUrls)
        setKeywords(data.keyword.split(","));

          const receivedAmenities = data.ammenities.split(',');
          
          setSelectedAmenities(receivedAmenities);
        //  setValue("p_language",data.language)
      // setMy(data.language)
      //  setMySelectedLanguage(data.language)
        setSelectedType(data.types[0].propertytype_id);

        setSelectedChild(data.subtype)
        setLogoDB(data.logo);
        setImagesDB(data.images);
        setMySelectedLanguage({
          value: data.language,
          label: languageNames[myselectedlanguage] || data.language.toUpperCase(),
        })

        const tagsString = tags.map(tag => tag.tag).join(","); // Extract tag names and join them

        setValue("p_tags", tagsString);
        setTags(tags)
        GetState(countryid).then((states) => {
          states.map(state => {
            if (state.name === data.state) {
              setSelectedStateDB(state);
              GetCity(countryid, state.id).then((cities) => {
                cities.map(city => {
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
    formState: { errors },
    setError,
    watch,
    
    setValue,
  } = useForm({
   
  });
  const [slug, setSlug] = useState("");

  // update form data
  const name = watch("p_name");

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
    setLoading(true)

    try {
      const formDataToSend = new FormData();

      if (logo) {

        formDataToSend.append('logo', logo[0]);
      }
      else {


        formDataToSend.append('logo', logoDB);

      }
      if (images.length>0) {
        images.forEach(image => {
          formDataToSend.append('images', image);
        });
      } else if (imagesDB) {
          formDataToSend.append('existing_images', imagesDB); // These will be paths
     
      }
      
      // if (images) {
      //   images.forEach(image => {
      //     formDataToSend.append('images', image);
      //   });
      // } else {
      //   formDataToSend.append('images', imagesDB);

      // }
 

      const tagsString = tags.map(tag => tag.tag).join(","); // Extract tag names and join them
  
      const keywordsString = keywords.join(",");
      const lati = place?.geometry.location.lat(); // Get the latitude
      const lngi = place?.geometry.location.lng(); // Get the longitude
  
      const propertyData = {
       slug: params.slug,
        name: formData.p_name,
        slug: slug,
        user_id:user.id,

        meta_name: formData.p_metaname,
        meta_description: formData.p_metades,
        description: formData.p_description,
        keywords: keywordsString,
        u_name: formData.p_uname,
        description: formData.p_description,
        phone: formData.p_phone,
        email: formData.p_email,
        location: formData.p_location?formData.p_location:place?.name,
        lat:lati?lati:lat,
        longitude:lngi?lngi:longitude,
        city: selectedCity ? selectedCity : selectedCityDB.name,
        state: selectedState ? selectedState : selectedStateDB.name,
        country: formData.p_country,
        zip: formData.p_zip,
        user_id: user.id,
        area:formData.p_area,
        unit:formData.p_unit,
        price: formData.p_price,
       bed: formData.p_bed,
       baths: formData.p_baths,

        installement: formData.p_installement,
        language: selectedLanguages && selectedLanguages.length > 0 ? selectedLanguages : formData.p_language,

      
      
        tags: tagsString,
      };
 
      formDataToSend.append('p_tags', tagsString);
      const ammString=selectedAmenities.map(amm=>amm).join(",");
      formDataToSend.append('p_ammenities', ammString);
      formDataToSend.append('subtype',selectedChild)
      formDataToSend.append('purpose',selectedPurpose)
      formDataToSend.append('propertyData', JSON.stringify(propertyData));
      formDataToSend.append('approved', user.role === 1 ? '1' : '0');
      formDataToSend.append('types', selectedType);


      // Send form data to backend
      const response = await fetch(`${serverurl}update-propertydata/`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();
 
      if (result.ErrorCode === 0) {
        toast.success("property updated successfully");
        router.push(`/property`);      }

 
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setAdding(false);
      setLoading(false)
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
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: `Update Property (${params.slug.toUpperCase()})`, href: `/property/update/${params.slug}` },
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
<>       <div>
    <H2 className="flex items-center justify-center ">Update Property</H2>
</div>

        <div className="p-7 p__Add">
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div>
              <section className="bg-white p-6 shadow-lg rounded-lg flex flex-col md:flex-row gap-6">
                {/* Left Sidebar with Icon and Heading */}
                <div className="flex flex-col items-start md:w-1/4">
                  <div className="flex items-center mb-6">
                    {/* Icon */}
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                      {/* Use your own SVG or Icon here */}
                      <svg class="w-6 h-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 10h1M5 10h1m-3 4h1m1 0h1m-3 4h1m1 0h1m3-16h1m1 0h1m3 4h1m1 0h1M6 18h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    {/* Heading */}
                    <h2 className="text-2xl font-semibold text-gray-800">Property Contact Information</h2>
                  </div>
                </div>

                {/* Right Side Form */}
                <div className="md:w-3/4">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Input Fields */}
                    <div>
                      <InputField2
                        inputId="p_name"
                        inputName="p_name"
                        inputType="text"
                        placeholder="Enter Title"
                        register={register}
                        required={true}
                        error={errors.p_name}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full"
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

                    {/* Email and Phone */}
                    <div>
                      <InputField2
                        inputId="p_email"
                        inputName="p_email"
                        inputType="email"
                        register={register}
                        placeholder="Enter Email"
                        required={true}
                        error={errors.p_email}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                      />
                    </div>
                    <div>
                      <InputField2
                        inputId="p_phone"
                        inputName="p_phone"
                        inputType="text"
                        register={register}
                        placeholder="Enter your Phone"
                        required={true}
                        error={errors.p_phone}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                      />
                    </div>

                 
     <div className="mb-5">
              <StateSelect
                required
                countryid={countryid}
                onTextChange = {(e)=>{
                  if(!e.target.value){
                    setstateid('');
                    setSelectedState('');
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
                onTextChange = {(e)=>{
                  if(!e.target.value){ 
                    setSelectedCity('');
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


                    {/* Zip Code and Location */}
                    <div>
                      <InputField2
                        inputId="p_zip"
                        inputName="p_zip"
                        inputType="text"
                        register={register}
                        placeholder="Enter Zip Code"
                        required={true}
                        error={errors.p_zip}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full"
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
                             inputId="p_location"
                             inputName="p_location"
                             inputType="text"
                             register={register}
                             placeholder="Search your address" // Add placeholder prop here
                             error={errors.p_location}    />
                        </Autocomplete>
                      </div>
                    <div>
                      <InputField2
                        inputId="p_uname"
                        inputName="p_uname"
                        inputType="text"
                        register={register}
                        placeholder="Enter your Name"
                        error={errors.p_uname}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full"
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
                      <svg className="w-6 h-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h1M5 10h1m-3 4h1m1 0h1m-3 4h1m1 0h1m3-16h1m1 0h1m3 4h1m1 0h1M6 18h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    {/* Heading */}
                    <h2 className="text-2xl font-semibold text-gray-800">Property Branding Assets and Purpose</h2>
                  </div>
                </div>

                {/* Right Side Form */}
                <div className="md:w-3/4">
                  <div className="grid md:grid-cols-1 gap-10">
                    {/* Logo Input */}
                    <div className="mb-5">
                      {/* Upload Logo */}
                      <div className="border-dashed border-2 border-green-500 p-4 rounded-lg">
                        <Formlabel text="Upload Logo" forLabel="logo" isRequired />
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
                          {customErrors.logo && <span className="text-red-400 text-sm">{customErrors.logo}</span>}
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
                          ) : logo && logo.length > 0 && <div className="flex gap-4 items-center">
                          <span>Current logo:</span>
                          <Image
                            src={URL.createObjectURL(logo[0])}
                            alt=""
                            className="w-14 h-14 my-4 rounded-full bg-white d-flex p-1"
                            width={100}
                            height={100}
                          />
                       
                          </div>}
                        
                        </div>
                      </div>

                      {/* Upload Property Images */}
                      <div className="border-dashed border-2 border-green-500 p-4 mt-5 rounded-lg">
  <Formlabel text="Upload Images of your Property" forLabel="images" />
  <div className="flex flex-col gap-3">
    {/* File Input */}
    <input
      id="images"
      accept="image/jpeg,image/png,image/webp"
      onChange={(e) => {
        const selectedFiles = Array.from(e.target.files); // Convert FileList to an array
        setImages((prevImages) => [...prevImages, ...selectedFiles]);
        setCustomErrors({
          ...customErrors,
          images: "",
        });
        setImagesSelected((prevSelected) => [...prevSelected, ...selectedFiles]);
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
      <p>✓ Upload good quality pictures with proper lighting.</p>
      <p>✓ First image will be your cover image.</p>
      <p className="text-xs">Max size 5MB, .jpg, .png, .web only</p>
    </div>

    {/* Error Message */}
    {customErrors.images && <span className="text-red-400 text-sm">{customErrors.images}</span>}

    {/* Existing Images (From Database) */}
    {imagesDB &&
      imagesDB.length > 0 &&
      imagesDB.map((item, index) => (
        <div className="relative h-full" key={`db-${index}`}>
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
          <div className="relative" key={`selected-${i}`}>
            <Image
              src={URL.createObjectURL(file)}
              alt="property-image"
              width={150}
              height={150}
              className="bg-white rounded-sm p-1 object-cover"
            />
            <XMarkIcon
              className="w-4 h-4 absolute top-2 right-2 cursor-pointer bg-white text-black rounded-full"
              onClick={() => imgDelete(file, "imagesSelected")}
            />
          </div>
        ))}
      </div>
    )}
  </div>
</div>
                    </div>


                    <div className="flex flex-col  md:flex-row md:col-span-1 gap-2 my-0">
                      <div className="flex-grow">
                        <InputField2
                          inputId="p_area"
                          inputName="p_area"
                          inputType="text"
                          register={register}
                          placeholder="Enter Area Size"
                          error={errors.p_area}
                        />
                        {errors.p_area && <span className="text-red-500 text-sm">{errors.p_area.message}</span>}
                      </div>

                      <div className="flex-shrink-0 mt-2"> {/* Prevents the select box from shrinking too much */}
                        <select
                          id="p_areaunit"
                          name="p_areaunit"
                          {...register('p_areaunit', { required: "Please select a unit" })} // Error message for required field
                          className={`border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.p_areaunit ? "border-red-500" : ""
                            }`} // Conditional styling for error
                        >
                          <option value="" disabled>Select Unit</option>
                          <option value="marla">Marla</option>
                          <option value="sq_meter">Square Meter</option>
                          <option value="sq_feet">Square Feet</option>
                          <option value="sq_yd">Square Yard</option>
                          <option value="kanal">Kanal</option>
                        </select>
                        {errors.p_areaunit && <span className="text-red-500 text-sm">{errors.p_areaunit.message}</span>}
                      </div>
                    </div>

                    {/* Price Input */}
                    <div className="grid md:grid-cols-3 gap-4">
                      {" "}
                      <div className="my-0 ">
                        <InputField2
                          inputId="p_bed"
                          inputName="p_bed"
                          inputType="number"
                          register={register}
                          placeholder="Enter no of beds"
                          error={errors.p_bed}
                        />
                        {errors.p_baths && (
                          <span className="text-red-500 text-sm">
                            {errors.p_bed.message}
                          </span>
                        )}
                      </div>
                      <div className="my-0 ">
                        <InputField2
                          inputId="p_baths"
                          inputName="p_baths"
                          inputType="number"
                          register={register}
                          placeholder="Enter no of baths"
                          error={errors.p_bed}
                        />
                        {errors.p_baths && (
                          <span className="text-red-500 text-sm">
                            {errors.p_baths.message}
                          </span>
                        )}
                      </div>
                      <div className="my-0 ">
                        <InputField2
                          inputId="p_price"
                          inputName="p_price"
                          inputType="number"
                          register={register}
                          placeholder="Enter Price USD"
                          error={errors.p_price}
                        />
                        {errors.p_price && (
                          <span className="text-red-500 text-sm">
                            {errors.p_price.message}
                          </span>
                        )}
                      </div>{" "}
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
                          inputId="p_metaname"
                          inputName="p_metaname"
                          inputType="text"
                          placeholder="Enter Meta Title"
                          register={register}
                          required={true}
                          error={errors.p_metaname}
                        />
                      </div>

                      {/* Meta Description */}
                      <div>
                        <InputField2
                          inputId="p_metades"
                          inputName="p_metades"
                          inputType="text"
                          placeholder="Enter Meta Description"
                          register={register}
                          required={true}
                          error={errors.p_metades}
                        />
                      </div>

                      {/* Keywords */}
                      <div>
                        {/* <div className="flex flex-wrap gap-2 border border-gray-300 rounded-full p-2 bg-white shadow-md transition-shadow duration-200 ease-in-out"> */}

                        <div className="flex flex-col border border-gray-300 rounded-xl p-3 bg-white shadow-lg max-h-40 overflow-y-auto transition-shadow duration-200 ease-in-out hover:shadow-xl">
                          <div className="flex flex-wrap gap-2">
                          {Array.isArray(keywords) && keywords.map((keyword, index) => (
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
              <section className="bg-white mt-5 p-6 shadow-lg rounded-lg flex flex-col md:flex-row gap-6">
                {/* Left Sidebar with Icon and Heading */}
                <div className="flex flex-col items-start md:w-1/4">
                  <div className="flex items-center mb-6">
                    {/* Icon */}
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                      {/* Use your own SVG or Icon here */}
                      <svg className="w-6 h-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h1M5 10h1m-3 4h1m1 0h1m-3 4h1m1 0h1m3-16h1m1 0h1m3 4h1m1 0h1M6 18h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    {/* Heading */}
                    <h2 className="text-2xl font-semibold text-gray-800">Location and Purpose</h2>
                  </div>
                </div>

                {/* Right Side Content */}
                <div className="md:w-3/4">
                  {/* Select Purpose */}


                  {/* Property Type Section */}
                  <div className="mt-6">
                    <Formlabel text="Select Property Type" forLabel="Property Type" />

                    {/* Property Type Buttons */}
                    <div className="flex items-center">
                      <nav className="flex space-x-4">
                        {types.map((type) => (
                          <button
                            key={type.id}
                            onClick={(e) => handleTypeChange(e, type.id)} // Handle parent type selection
                            className={`px-4 py-2 ${selectedType === type.id ? 'bg-green-100 text-green-600 text-center font-bold' : 'text-center text-size-2 font-bold text-gray-800 hover:bg-gray-100'} rounded-lg`}
                          >
                            {type.name}
                          </button>
                        ))}
                      </nav>
                    </div>
                    <div className="w-2/5 h-1 bg-gray-300 mt-2" /> {/* Line below buttons */}


                    {/* Property Type Grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-0 mt-4">

                      {selectedTypeObj?.children && selectedTypeObj.children.length > 0 ? (
                        selectedTypeObj.children.map((child) => (
                          <label key={child.id} className="p-2 cursor-pointer">
                            <input
                              type="radio"
                              name="childPropertyType"
                              value={child.id}
                              checked={selectedChild === child.id} // Check selected child
                              onChange={() => handleChildChange(child.name)} // Handle change
                              className="hidden"
                            />
                            <div className={`flex items-center justify-center p-2 rounded-lg border transition-colors duration-200 ease-in-out 
          ${selectedChild === child.name ? 'border-green-500 bg-green-100 shadow-lg' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                              <span className="text-center font-semibold text-gray-700">{child.name}</span>
                            </div>
                          </label>
                        ))
                      ) : (
                        <p className="text-gray-500 col-span-full">No children available for this type</p> // Fallback if no children
                      )}
                    </div>

                  </div>
                  <div className="grid md:grid-cols-2 gap-6 mt-6">

                    {/* Installment Availability */}
                    <div className="mt-2 ml-0">
                      <Formlabel text="Select Purpose" forLabel="Purpose" />
                      <div className="flex items-center space-x-6">
                        {/* Sell Option */}
                        <label
                          className={`flex items-center cursor-pointer p-3 rounded-lg transition-all ${selectedPurpose === 'sell' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                        >
                          <input
                            type="radio"
                            name="purpose"
                            value="sell"
                            checked={selectedPurpose === 'sell'}
                            onChange={() => setSelectedPurpose('sell')}
                            className="hidden"
                          />
                          <span className="flex items-center">
                            <CurrencyDollarIcon className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                            Sell
                          </span>
                        </label>

                        {/* Rent Option */}
                        <label
                          className={`flex items-center cursor-pointer p-3 rounded-lg transition-all ${selectedPurpose === 'rent' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                        >
                          <input
                            type="radio"
                            name="purpose"
                            value="rent"
                            checked={selectedPurpose === 'rent'}
                            onChange={() => setSelectedPurpose('rent')}
                            className="hidden"
                          />
                          <span className="flex items-center">
                            <HomeIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                            Rent
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Formlabel text="Installment Availability" forLabel="installment" />
                      <div className="flex items-center space-x-6">
                        {/* Available */}
                        <label
                          className={`flex items-center cursor-pointer p-3 rounded-lg transition-all ${selectedinstallement === '1' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                        >
                          <input
                            type="radio"
                            name="installment"
                            value="1"
                            checked={selectedinstallement === '1'}
                            onChange={() => setSelectedInstallement('1')}
                            className="hidden"
                          />
                          <span className="flex items-center">
                            <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                            Available
                          </span>
                        </label>

                        {/* Not Available */}
                        <label
                          className={`flex items-center cursor-pointer p-3 rounded-lg transition-all ${selectedinstallement === '0' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                        >
                          <input
                            type="radio"
                            name="installment"
                            value="0"
                            checked={selectedinstallement === '0'}
                            onChange={() => setSelectedInstallement('0')}
                            className="hidden"
                          />
                          <span className="flex items-center">
                            <XCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                            Not Available
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Amenities Selection */}
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Amenities</h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {Array.isArray(ammenites) && ammenites.map((amenity) => {
                        const IconComponent = FaIcons[amenity.icon]; // Dynamically get the icon component

                        return (
                          <label
                            key={amenity.value}
                            className={`flex items-center p-4 rounded-lg border transition-all cursor-pointer 
            ${selectedAmenities.includes(amenity.label)
                                ? 'bg-blue-100 border-blue-500 text-blue-700'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                              }`}
                          >
                            <input
                              type="checkbox"
                              value={amenity.label}
                              checked={selectedAmenities.includes(amenity.label)}
                              onChange={() => handleAmenityChange(amenity.label)}
                              className="hidden"
                            />
                            <div className="flex items-center space-x-3">
                              {IconComponent && <IconComponent size={24} className="text-blue-500" />}
                              <span className="font-medium">{amenity.label}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                  </div>
                </div>
              </section>

              <section className="bg-white mt-5 p-6 shadow-lg rounded-lg flex flex-col md:flex-row gap-6">
                {/* Left Sidebar with Icon and Heading */}
                <div className="flex flex-col items-start md:w-1/4">
                  <div className="flex items-center mb-6">
                    {/* Icon */}
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                      {/* SVG Icon */}
                      <svg className="w-6 h-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h1M5 10h1m-3 4h1m1 0h1m-3 4h1m1 0h1m3-16h1m1 0h1m3 4h1m1 0h1M6 18h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    {/* Heading */}
                    <h2 className="text-2xl font-semibold text-gray-800">Property Details</h2>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="grid md:grid-cols-1 gap-6 md:w-3/4">
                  <div className="mt-6">

                    {/* Property Description */}
                    <div className="mb-5">
                      <InputField2
                        inputId="p_description"
                        inputName="p_description"
                        inputType="textarea"
                        register={register}
                        placeholder="Enter Property Description"
                        required={true}
                        error={errors.p_description}
                        className="border-2 border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-24 resize-none"
                      />
                    </div>

                    {languagesToDisplay && (
                      user_meta.role !== 1 ?
                        <div className="mb-5">
                          <Select
                            ref={selectInputRef}
                            name="p_language"
                            defaultValue={myselectedlanguage}
                            options={languagesToDisplay.map(lang => ({
                              value: lang.language, // Ensure the value is the language code
                              label: languageNames[lang.language] || lang.language.toUpperCase(), // Display full language name
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
                        :

                        <div className="mb-5">
                          <Select
                            ref={selectInputRef}
                            name="p_language"
                            defaultValue={myselectedlanguage}
                            options={languagesToDisplay.map(lang => ({
                              value: lang.code || lang.language, // Use either 'code' or 'language' depending on the structure
                              label: languageNames[lang.code || lang.language] || lang.language.toUpperCase(), // Display full language name or fallback
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


                    )}

                    {/* Tags Management */}
                    <div className="mb-5">
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
                          id="p_tags"
                          name="p_tags"
                          type="text"
                          value={currentTag}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          className="mt-0 flex-0 min-w-[150px] outline-none text-gray-700 text-sm py-2 px-3 bg-transparent placeholder-gray-400 border-none focus:ring-0"
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
                  </div>
                </div>
              </section>


            </div>
            <button
              type="submit"
              className="rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full transition duration-200 ease-in-out hover:bg-primary-dark disabled:cursor-progress disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>

          </form>

        </div>
        </>

      )}
    </>
  );
};

export default Updateproperty;
