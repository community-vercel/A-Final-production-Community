"use client";
import Formlabel from "@/components/Formlabel";
import Message from "@/components/Message";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux"; 
import { useForm } from "react-hook-form";

import useAuth from "@/hooks/useAuth";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import InputField from "@/components/InputField";
import * as FaIcons from "react-icons/fa"; // Import all icons from react-icons/fa
import Breadcrumb from "@/components/BreadCrum";
import { H2 } from "@/components/Typography";


const Updateammenity = () => {
  const router = useRouter();
  const auth = useAuth();
  const params = useParams();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const iconKeys = Object.keys(FaIcons); // Get the list of all icon names

  // Filter icons based on the search query
  const filteredIcons = iconKeys.filter((icon) =>
    icon.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIconSelect = (icon) => {
    setSelectedIcon(icon); // Set selected icon
  };

  


  useEffect(() => {
    if (auth && !auth.user?.id) router.push("/");

    const getData = async () => {
      try {
        const requestBody = JSON.stringify({ id: params.id });
        const response = await fetch(`${serverurl}get-amenty/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody,
        });

        const result = await response.json();
        if (response.ok) {
          setValue("ammenity", result.data.name);
          setSelectedIcon(result.data.icon);
          setLoading(false);
        } else {
          setMessage(result.error || "Failed to fetch amenity");
          setLoading(false);
        }
      } catch (error) {
        setMessage("An error occurred while fetching data.");
        console.log(error);
      }
    };

    getData();
  }, [auth, params.id, router]);

  const {
    register,
    handleSubmit,
    setValue,
  } = useForm({
  });

  const onSubmit = async (formData) => {
    setMessage("");
    
    try {
      const formDat = new FormData();
      formDat.append("id", params.id);
      formDat.append("name", formData.ammenity);

      formDat.append("userid", auth.user?.id);

      if (selectedIcon ) {
        formDat.append("icon",selectedIcon);
      } 
      const response = await fetch(`${serverurl}update-amenty/`, {
        method: 'POST',
        body: formDat,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Amenity updated successfully!");
        router.push('/property/amenites');
      } else {
        setMessage(result.error || "Failed to update amenity");
      }
    } catch (error) {
      setMessage("An unexpected error occurred: " + error.message);
    }
  };
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Update Ammenity", href: `/property//amenites/update/${params.id}` },
  ];

  
  return (
    <>
         <div className="mt-5 grid md:grid-cols-1 gap-6">
      <Breadcrumb items={breadcrumbItems} /> 
     
</div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="p-7">
                   <div>
    <H2 className="flex items-center justify-center ">Update Ammenity</H2>
</div>
          {message && <Message message={message} />}
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="">
              <Formlabel text="Ammenity" forLabel="Ammenity" />
              <InputField
                inputId="ammenity"
                inputName="ammenity"
                inputType="text"
                register={register}
                placeholder="Enter Ammneity"
                required={true}
              />
            </div>

           
            <div className="mb-5">
      <label htmlFor="icon-search" className="block mb-2 text-sm font-medium text-gray-700">
        Search and Select Icon
      </label>
      <input
        id="icon-search"
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 border border-gray-300 rounded w-full mb-4"
        placeholder="Search for an icon..."
      />
    {selectedIcon && (
  <div className="p-2 rounded-full bg-gray-100">
    {React.createElement(FaIcons[selectedIcon], { size: 40 })}
  </div>
)}
      <div className="grid grid-cols-6 gap-3 max-h-60 overflow-y-auto">
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

  

    </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="max-w-[300px] rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Updateammenity;
