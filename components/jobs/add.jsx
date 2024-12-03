"use client";

import { useRouter } from "next/navigation";
import React, { useState,useRef } from "react";
// Assuming you have this schema
import useAuth from "@/hooks/useAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Select from "react-select";
import { CitySelect, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import InputField2 from "@/components/InputField2";
import Breadcrumb from "../BreadCrum";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import Loader from "../Loader";

const libraries = ["places"]; // Load only the required library

const AddJob = () => {
  const router = useRouter();
  const auth = useAuth();
  const [message, setMessage] = useState(null);
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [skill, setSkill] = useState([]);
  const [skillkeywordInput, setskillKeywordInput] = useState("");
  const { user_meta, user } = useSelector((state) => state.auth);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const countryid = 233;
  const [stateid, setstateid] = useState(0);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [Slug, setSlug] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [salary, setSalary] = useState("");
  const [zip, setzip] = useState("");

  const [experienceLevel, setExperienceLevel] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const autocompleteRef = useRef();

  const [metaDescription, setMetaDescription] = useState("");

  const generateSlug = (name) => {
    return name
      .toLowerCase() // Convert to lowercase
      .trim() // Trim whitespace
      .replace(/[\s]+/g, "-") // Replace spaces with hyphens
      .replace(/[^\w-]+/g, ""); // Remove special characters
  };
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setJobTitle(newName);
    setSlug(generateSlug(newName)); // Set the generated slug
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
  
  const [place, setPlace] = useState(null);

  const handleskillKeywordKeyPress = (e) => {
    if (e.key === "Enter" && skillkeywordInput.trim()) {
      e.preventDefault();
      if (!skill.includes(skillkeywordInput.trim())) {
        setSkill([...skill, skillkeywordInput.trim()]);
      }
      setskillKeywordInput("");
    }
  };

  const removeskillKeyword = (index) => {
    setSkill(skill.filter((_, i) => i !== index));
  };
  const handleLogoChange = (e) => setLogo(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const keywordsString = keywords.join(",");
      const skillkeywordsString = skill.join(",");
      const lat = place?.geometry.location.lat(); // Get the latitude
      const lng = place?.geometry.location.lng(); // Get the longitude
  
      const form = new FormData();
      form.append("userid", auth.user?.id);
      form.append("title", jobTitle);
      form.append("slug", Slug);
      form.append("metaname", metaTitle);
      form.append("metades", metaDescription);
      form.append("keywords", keywordsString);
      form.append("company_name", companyName);
      form.append("description", jobDescription);
      form.append("location", location);
      form.append("b_location", place?.name);
      form.append("lat", lat);
      form.append("lng", lng);
      form.append("state", selectedState);
      form.append("city", selectedCity);
      form.append("zip", zip);
      form.append("employment_type", employmentType);
      form.append("salary", salary);
      form.append("experience_level", experienceLevel);
      form.append("skills_required", skillkeywordsString);
      form.append("application_deadline", applicationDeadline);
      form.append("contact_info", contactInfo);
      form.append("logo", logo);
      form.append("approved",user.role===1?1:0)
      selectedLanguages.forEach((lang) =>
        form.append("language", lang.value)
      );

      const response = await fetch(`${serverurl}add-job/`, {
        method: "POST",
        body: form,
      });

      const result = await response.json();

      if (result.ErrorCode === 0) {
        toast.success(result.ErrorMsg, { position: "top-right" });
        setMessage(result.ErrorMsg);
        router.push("/jobs"); // Redirect to jobs page
      } else {
        toast.error(result.error || "An error occurred", {
          position: "top-right",
        });
        setMessage(result.error || "An error occurred");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.", {
        position: "top-right",
      });
      setMessage("An unexpected error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const languageOptions = languages.map((lang) => ({
    value: lang.code,
    label: lang.name,
  }));
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Add Job", href: "/jobs/add" },
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

    <div className="p-7">
      <form
        onSubmit={handleSubmit}
        className="mt-3 p-2 md:p-8 bg-white shadow-lg rounded-lg space-y-6 max-w-full mx-auto"
      >
        <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
          Add Job Posting
        </h2>
        <div className="grid md:grid-cols-2 3xl:grid-cols-3 gap-6">
          <div >
            <label className="block text-sm font-medium text-gray-700">
              Job Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={handleNameChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>
          <div >
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

          <div className=" flex flex-col border border-gray-300 rounded-xl p-3 bg-white shadow-lg max-h-40 overflow-y-auto transition-shadow duration-200 ease-in-out hover:shadow-xl">
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
          <div >
            <label className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>

          <div >
            <label className="block text-sm font-medium text-gray-700">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>
          <div >
            <label className="block text-sm font-medium text-gray-700">
              State
            </label>
            {/* State Selection */}
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

          <div >
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            {/* City Selection */}
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

          {/* Zip Code and Location */}
          <div >
            <label className="block text-sm font-medium text-gray-700">
              Zip Code
            </label>
            <input
              type="text"
              value={zip}
              onChange={(e) => setzip(e.target.value)}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>
          <div >
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <Autocomplete
                          onLoad={(autocomplete) =>
                            (autocompleteRef.current = autocomplete)
                          }
                          onPlaceChanged={handlePlaceChanged}
                        >
                          <input
                            type="text"
                            placeholder="Search places and enter address"
                            className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </Autocomplete>
          
          </div>

          <div >
            <label className="block text-sm font-medium text-gray-700">
              Employment Type
            </label>
            <Select
              options={[
                { value: "Full-time", label: "Full-time" },
                { value: "Part-time", label: "Part-time" },
                { value: "Contract", label: "Contract" },
              ]}
              value={{ label: employmentType }}
              onChange={(e) => setEmploymentType(e.value)}
              className="mt-2"
            />
          </div>

          <div >
            <label className="block text-sm font-medium text-gray-700">
              Salary / Wage
            </label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>

          <div >
            <label className="block text-sm font-medium text-gray-700">
              Experience Level
            </label>
            <Select
              options={[
                { value: "Entry-level", label: "Entry-level" },
                { value: "Mid-level", label: "Mid-level" },
                { value: "Senior", label: "Senior" },
              ]}
              value={{ label: experienceLevel }}
              onChange={(e) => setExperienceLevel(e.value)}
              className="mt-2"
            />
          </div>

          <div className=" flex flex-col border border-gray-300 rounded-xl p-3 bg-white shadow-lg max-h-40 overflow-y-auto transition-shadow duration-200 ease-in-out hover:shadow-xl">
            <label className="block text-sm font-medium text-gray-700">
              Skills
            </label>

            <div className="flex flex-wrap gap-2">
              {skill.map((keyword, index) => (
                <span
                  key={index}
                  className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full shadow-sm transition-transform transform hover:scale-105"
                >
                  {keyword}
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-150"
                    onClick={() => removeskillKeyword(index)}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>

            <input
              type="text"
              value={skillkeywordInput}
              onChange={(e) => setskillKeywordInput(e.target.value)}
              onKeyDown={handleskillKeywordKeyPress}
              placeholder="Add a skilland press Enter"
              className="w-full mt-2 p-1 outline-none border-t border-gray-200 bg-transparent placeholder-gray-400 text-gray-700"
            />
          </div>

          <div  >
            <label className="block text-sm font-medium text-gray-700">
              Application Deadline
            </label>
            <input
              type="date"
              value={applicationDeadline}
              onChange={(e) => setApplicationDeadline(e.target.value)}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none"
              required
              min={new Date().toISOString().split("T")[0]} // Sets the minimum date to today's date

            />
          </div>

          <div  >
            <label className="block text-sm font-medium text-gray-700">
              Contact Information
            </label>
            <input
              type="email"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>

          <div  >
            <label className="block text-sm font-medium text-gray-700">
              Job Logo (Optional)
            </label>
            <input
              type="file"
              onChange={handleLogoChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div  >
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
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full disabled:cursor-progress"
          >
            {loading ? "Submitting..." : "Add"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
    </>
  );
};

export default AddJob;
