"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const SeoPage = () => {
  const [section, setSection] = useState("jobs");
  const [seoData, setSeoData] = useState({
    title: "",
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    banner: null, // Changed to handle file uploads
  });
  const [existingData, setExistingData] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);
  const [message, setMessage] = useState("");
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const [currentLogo, setCurrentlogo] = useState();
  // Fetch existing SEO data
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${serverurl}seo?section=${section}`);
        const data = await response.json();
        setExistingData(data || {});
        setCurrentlogo(data.banner);
      } catch (error) {
        console.error("Failed to fetch SEO data:", error);
      }
    }
    fetchData();
  }, [section]);
  useEffect(() => {
    if (existingData) {
      loadExistingData();
    }
  }, [section, existingData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSeoData({ ...seoData, [name]: value });
  };

  const handleFileChange = (e) => {
    setSeoData({ ...seoData, banner: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("section", section);
    formData.append("title", seoData.title);
    formData.append("metaTitle", seoData.metaTitle);
    formData.append("metaDescription", seoData.metaDescription);
    formData.append("keywords", seoData.keywords);
    if (seoData.banner) {
      formData.append("banner", seoData.banner); // Include the new image if uploaded
    }

    try {
      const response = await fetch(`${serverurl}seo/`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setMessage(result.message);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const handleKeywordAdd = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const newKeyword = e.target.value.trim();

      // Check if the keyword already exists
      if (!seoData.keywords.includes(newKeyword)) {
        setSeoData({ ...seoData, keywords: [...seoData.keywords, newKeyword] });
      }

      // Clear the input field
      e.target.value = "";
    }
  };

  const handleKeywordRemove = (index) => {
    setSeoData({
      ...seoData,
      keywords: seoData.keywords.filter((_, idx) => idx !== index),
    });
  };

  const loadExistingData = () => {
    if (existingData) {
      setSeoData({
        title: existingData.title || "",
        metaTitle: existingData.metaTitle || "",
        metaDescription: existingData.metaDescription || "",
        keywords: existingData.keywords ? existingData.keywords.split(",") : [],
        banner: null, // Cannot prefill file input
      });
      setIsUpdate(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>

        {/* Section Selector */}
        <div className="mb-6">
          <label className="block text-gray-800 font-bold mb-2">
            Select Section
          </label>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={section}
            onChange={(e) => {
              setSection(e.target.value);
              setSeoData({
                title: "",
                metaTitle: "",
                metaDescription: "",
                keywords: [],
                banner: "",
              });
              setIsUpdate(false);
            }}
          >
            <option value="jobs">Jobs</option>
            <option value="property">Property</option>
            <option value="business">Business</option>
            <option value="home">Home</option>
            <option value="events">Event</option>

            {/* <option value="category">Category</option> */}
          </select>
        </div>

        {/* Load Existing Data */}

        {/* SEO Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 mt-5"
        >
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={seoData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-semibold mb-2">
              Meta Title
            </label>
            <input
              type="text"
              name="metaTitle"
              value={seoData.metaTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-semibold mb-2">
              Meta Description
            </label>
            <textarea
              name="metaDescription"
              value={seoData.metaDescription}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="4"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold mb-2">
              Keywords
            </label>
            <input
              type="text"
              placeholder="Press Enter to add keywords"
              onKeyDown={handleKeywordAdd}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-2">
              {seoData.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-lg mr-2 mb-2"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleKeywordRemove(keyword)}
                    className="ml-2 text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold mb-2">
              {" "}
              Banner Image(Recommended Size(1200 * 300))
            </label>
            <input
              type="file"
              name="banner"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {/* Show existing image if available */}
            {existingData.banner && !seoData.banner && (
              <div className="mt-2">
                <p>Current Image:</p>
                <Image
                width={100}
                height={100}
                  src={serverurl+existingData.banner.replace('/api/media/', 'media/')}
                  alt="Current Banner"
                  className="w-md h-auto mt-2"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary"
          >
            {isUpdate ? "Update SEO Data" : "Add SEO Data"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <div className="mt-4 p-4 bg-primary text-blue-800 rounded-lg">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeoPage;
