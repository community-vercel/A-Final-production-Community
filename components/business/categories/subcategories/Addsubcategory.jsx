'use client';
import { useState, useEffect } from 'react';
import Select from 'react-select'; // npm install react-select
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/BreadCrum';
function AddSubCategory() {
  const [categories, setCategories] = useState([]);
  const [languages] = useState([
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ar', name: 'Arabic' },
  ]);
  const router = useRouter();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [subCategoryName, setSubCategoryName] = useState('');
  const [logo, setLogo] = useState(null);
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Slug, setSlug] = useState(''); // State for the slug
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
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const generateSlug = (name) => {
    return name
      .toLowerCase() // Convert to lowercase
      .trim() // Trim whitespace
      .replace(/[\s]+/g, '-') // Replace spaces with hyphens
      .replace(/[^\w-]+/g, ''); // Remove special characters
  };

  const handleCategoryNameChange = (e) => {
    const newName = e.target.value;
    setSubCategoryName(newName);
    setSlug(generateSlug(newName)); // Set the generated slug
  };
  useEffect(() => {
    const fetchCategories = async () => {
      const formData = { language: 'en' };
      try {
        const response = await fetch(`${serverurl}category-count/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (response.ok) {
          setCategories(result.categories);
        } else {
          setError(result.error || 'Failed to fetch categories');
        }
      } catch (error) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [serverurl]);

  const handleLogoChange = (e) => setLogo(e.target.files[0]);
  const handleCoverChange = (e) => setCover(e.target.files[0]);

const handleSubmit = async (e) => {
    e.preventDefault();
    const keywordsString = keywords.join(",");

    const formData = new FormData();
    formData.append('name', subCategoryName);
    formData.append('slug', Slug);

    formData.append('logo', logo);
    formData.append('cover', cover);
    formData.append("metaname", metaTitle); 
    formData.append("metades", metaDescription); 
    formData.append("keywords", keywordsString);
    const categoryIds = selectedCategories.map(cat => cat.value);
    categoryIds.forEach(id => formData.append('category_ids[]', id)); 

    selectedLanguages.forEach(lang => formData.append('languages[]', lang.value));

    try {
        const response = await fetch(`${serverurl}add-subcategory/`, {
   
            method: "POST",
            body: formData,
          });
    
          const result = await response.json();
      
          if (result.ErrorCode===0) {
        
            toast.success("Added Sucessfully", { position: "top-right" }); // Show success toast
            router.push('/business/categories/subcategories')       
            setSubCategoryName('');
            setSelectedCategories([]);
            setSelectedLanguages([]);
            setLogo(null);
            setCover(null);
            // Reset form or redirect as needed
          }
          else if(result.ErrorCode===3){
            toast.error("Slug Already Exist", { position: "top-right" }); // Show success toast

          }
     
    } catch (error) {
        console.error('Error adding sub-category:', error);
    }
};


const categoryOptions = Array.isArray(categories) ? categories.map((cat) => ({
  value: cat.id,
  label: cat.name,
})) : [];
  const languageOptions = languages.map((lang) => ({
    value: lang.code,
    label: lang.name,
  }));

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p className="text-red-500">{error}</p>;


  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Add SubCategory", href: "/business/categories/subcategories/add" },
  ];




  return (

<div className="p-0">
<div className="mt-5 grid md:grid-cols-2 gap-6">
      <Breadcrumb items={breadcrumbItems} /> 
     
</div>

    <form onSubmit={handleSubmit} className="mt-5 p-6 md:p-8 bg-white shadow-lg rounded-lg space-y-6 max-w-4xl mx-auto">
 <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
   Add Sub-Category
  </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">Sub-Category Name</label>
        <input
          type="text"
          value={subCategoryName}
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
        <label className="block text-sm font-medium text-gray-700">Select Categories</label>
        <Select
          options={categoryOptions}
          isMulti
          value={selectedCategories}
          onChange={setSelectedCategories}
          className="mt-2"
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
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">Select Languages</label>
        <Select
          options={languageOptions}
          isMulti
          value={selectedLanguages}
          onChange={setSelectedLanguages}
          className="mt-2"
        />
      </div>
  
      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Logo</label>
        <input
          type="file"
          onChange={handleLogoChange}
          className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          accept="image/*"
        />
      </div>
  
      <div>
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
        className="w-full  rounded-full uppercase shadow-lg bg-primary text-white text-sm font-semibold py-4 px-6 hover:bg-primary-dark transition duration-300 ease-in-out transform hover:scale-105"
      >
        Add
      </button>
    </div>
  </form>
 </div>
  );
}

export default AddSubCategory;
