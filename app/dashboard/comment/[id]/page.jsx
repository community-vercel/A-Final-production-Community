"use client";
import Formlabel from "@/components/Formlabel";
import InputField from "@/components/InputField";
import Loader from "@/components/Loader";
import ReviewsForm from "@/components/ReviewsForm";
import StarRating from "@/components/StarRating";
 
import { extractImagePath } from "@/utils/extractImagePath";
import { ReviewsFormZod } from "@/zod/ReviewsFormZod";
import {
  EyeIcon,
  PencilIcon,
  StarIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const Page = () => {
  const params = useParams();
  const [review, setReview] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("0");
  const { user, user_meta } = useSelector((state) => state.auth);

  const router = useRouter();
  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL

  useEffect(() => {
    getReview();
  }, [params]);
  const getReview = async () => {
    setLoading(true);
    try {
      const formdata={
        id:params.id
      }
      const response = await fetch(`${serverurl}get-specificreview/`,{
        headers: {
          'Content-Type': 'application/json',
        },
method:"POST",
body:JSON.stringify(formdata)



      }); // Django API endpoint
      if (!response.ok) throw new Error("Failed to fetch review");

      const result = await response.json();
      if (result.status === "error") throw new Error(result.error);

      const data = result.data;

      // Set review data in state and form
      setReview(data);
      setStatus(data.status);

      // Use react-hook-form's setValue to populate the form fields
      setValue("title", data.title);
      setValue("rating", data.rating);
      setValue("review", data.review);
      const sanitizedReviewFiles = data.review_files
      ? data.review_files.replace("/api/media/", "media/") // Remove '/api' from the string if present
      : "";
    setImagesDB(data.review_files || []);    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) getReview(); // Fetch review only when id is available
  }, [params.id]);

  // const getReview = async () => {
  //   setLoading(true);
  //   try {
  //     const { data, error } = await supabase
  //       .from("reviews")
  //       .select(
  //         `
  //             *,
  //             business (
  //                 id,
  //                 name
  //             ) 
  //         `
  //       )
  //       .eq("id", params.id)
  //       .single();
  //     if (error) throw error;
  //     setReview(data);
  //     setStatus(data.status);

  //     setValue("title", data.title);
  //     setValue("rating", data.rating);
  //     setValue("review", data.review);
  //     setImagesDB(data.review_files);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //   status dropdown
  const options = [
    { value: "0", label: "Pending", color: "yellow" },
    { value: "1", label: "Approved", color: "green" },
    { value: "2", label: "Rejected", color: "red" },
  ];
  const handleChange = async (e) => {
    setStatus(e.target.value);
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ status: e.target.value })
        .eq("id", params.id);
      if (error) throw error;
    } catch (error) {
      console.log(error);
    }
  };

  const [edit, setEdit] = useState(false);
  const [images, setImages] = useState([]);
  const [imagesDB, setImagesDB] = useState([]);
  const [customErrors, setCustomErrors] = useState({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(ReviewsFormZod),
  });
  const onSubmit = async (formData) => {
    try {
      const existingImages = imagesDB ? imagesDB.split(",") : [];
    
      let reviewData = {
        id: params.id,
        title: formData.title,
        review: formData.review,
        rating: formData.rating,
        review_files: existingImages.join(","),  // Existing image URLs
      };
    
      const formDataToSend = new FormData();
      formDataToSend.append('reviewData', JSON.stringify(reviewData));
    
      if (images.length > 0) {
        images.forEach((image) => {
          formDataToSend.append('images', image);  // New images
        });
      }
    
      const response = await fetch(`${serverurl}update-reviewdata/`, {
        method: 'POST',
        body: formDataToSend,
      });
    
      const result = await response.json();
      if (!response.ok || result.ErrorCode !== 0) {
        throw new Error(result.ErrorMsg || 'Failed to update review');
      }
    
 
      getReview();
      setEdit(false);
      setImages([]);  // Clear the image state
    } catch (error) {
      console.log("Error:", error);
    }
  };
  

  

  // delete
  const handleDelete = async () => {
    try {
      // Prepare the data to send to the Django API
      const updateData = [{
        id: params.id,
        status: status,  // Assuming '4' corresponds to 'archived' or similar status in your model
        isArchived: true
      }];
  
      const response = await fetch(`${serverurl}update-reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
  
      const result = await response.json();
      if (response.ok) {
        if (result.ErrorCode === 0) {
          // Success: Redirect to reviews dashboard or show success message
          router.push("/business/reviews");
        } else {
          // Handle error from the API
          console.error(result.ErrorMsg);
        }
      } else {
        // Handle server-side error
        throw new Error(result.ErrorMsg || 'Failed to update review');
      }
    } catch (error) {
      console.log("Error updating review:", error);
    }
  };
  
  // const handleDelete = async () => {
  //   try {
  //     const { error } = await supabase
  //       .from("reviews")
  //       .update({ isArchived: true })
  //       .eq("id", params.id);
  //     if (error) throw error;
  //     router.push("/dashboard/reviews");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const imgDelete = async (name) => {
    
  
    if (name.includes("/api/media/")) {
      try {
       

        // Remove the base URL from the image name (if necessary)
        const cleanName = name.replace(serverurl, "");

        // Call the Django API to delete the image
        const formData = new FormData();
        formData.append("review_id", params.id); // Send the review ID
        formData.append("image_url", cleanName); // Send the image URL
  
        const response = await fetch(`${serverurl}delete-review-image/`, {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete image from the server");
        }
  
        const result = await response.json();
        if (result.error) {
          throw new Error(result.error);
        }
  
        // Update the front-end state after successful deletion
        setImagesDB(
          [...imagesDB.split(",").filter((img) => img !== cleanName)].join(",")
        );
        
      } catch (error) {
        console.log("Error deleting image:", error);
      }
    } else {
      // Handle removal of newly uploaded images
      setImages(images.filter((file) => file.name !== name));
    }

  };
   
  // img delete
  // const imgDelete = async (name) => {
  //   console.log(name);
  //   console.log([...imagesDB.split(","), ...images])
  //   if (name.includes("http")) {
  //     try {
  //       setImagesDB( [...imagesDB.split(",").filter((img) => img !== name)].join(",") );
  //       const oldUrl = extractImagePath(name).replace("reviews/", "");
  //       const { data: oldUrlData, error: oldUrlError } = await supabase.storage
  //         .from("reviews")
  //         .remove([oldUrl]);
  //       if (oldUrlError) throw oldUrlError;
  //       const { data: updateImagesData, error: updateImagesError } =
  //         await supabase
  //           .from("reviews")
  //           .update({
  //             review_files: [
  //               ...imagesDB.split(",").filter((img) => img !== name),
  //             ].join(","),
  //           })
  //           .eq("id", params.id)
  //           .select();
  //       if (updateImagesError) throw updateImagesError;
  //       console.log([...imagesDB.split(",").filter((img) => img !== name)].join(","));
  //     } catch (error) {
  //       console.log('img del',error)
  //     }
  //   } else {
  //     setImages(images.filter((file) => file.name != name));
  //   }
  //   console.log(images);
  // };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-xl bg-white my-3 mx-auto">
          <div className="p-4 mb-3 border-b-2">
            {user_meta.role ===1 && (
              <div className="flex justify-between  mt-3 mb-5">
                {!edit ? (
                <div className="relative inline-block cursor-pointer">
                  <select
                    value={status}
                    onChange={handleChange}
                    className={`pl-6 pr-4 py-1 border cursor-pointer rounded-md appearance-none focus:outline-none focus:ring-2 text-sm ${
                      status == "0"
                        ? "text-yellow-500"
                        : status == "1"
                        ? "text-green-500"
                        : "text-red-500"
                    } font-bold uppercase`}
                  >
                    {options.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className={` uppercase font-bold cursor-pointer ${
                          option.value == "0"
                            ? "text-yellow-500"
                            : option.value == "1"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div
                    className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full ${
                      status == "0"
                        ? "bg-yellow-500"
                        : status == "1"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                </div>
                ):<div></div>}

                <div className="flex gap-5">
                  <button
                    className="bg-red-500 text-white w-7 h-7 rounded-full flex justify-center items-center"
                    onClick={handleDelete}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>

                  <button
                    className="bg-primary text-white w-7 h-7 rounded-full flex justify-center items-center"
                    title="edit"
                    onClick={() => setEdit(!edit)}
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
            {edit ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form-data"
              >
                <div className="">
                  <Formlabel text="Title" forLabel="title" />
                  <InputField
                    inputId="title"
                    inputName="title"
                    inputType="text"
                    register={register}
                    error={errors.title}
                  ></InputField>
                </div>

                <div className="">
                  <Formlabel text="Review" forLabel="review" />
                  <InputField
                    inputId="review"
                    inputName="review"
                    inputType="textarea"
                    register={register}
                    error={errors.review}
                  ></InputField>
                </div>

                <div className="mb-7">
                  <Formlabel text="Rating" forLabel="rating" />
                  <input type="hidden" {...register("rating")} />
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <StarIcon
                        key={value}
                        className={`h-5 w-5 text-gray-400 cursor-pointer hover:text-yellow-400 ${
                          watch("rating") >= value && "text-yellow-400"
                        }`}
                        onClick={() =>
                          setValue("rating", value, { shouldValidate: true })
                        }
                      />
                    ))}
                  </div>
                  {errors.rating && (
                    <span className="text-red-400 text-sm">
                      {errors.rating.message || "Please select a rating."}
                    </span>
                  )}
                </div>

                <div className="mb-5">
                  <Formlabel text="Images" forLabel="images" />
                  <input
                    id="images"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      setImages([...images, ...Array.from(e.target.files)]);
                      setCustomErrors({
                        ...customErrors,
                        images: "",
                      });
                    }}
                    className="rounded-full  outline-none shadow-formFeilds text-text-gray text-sm py-4 bg-white pl-5 pr-5 border-2 border-[#E4E4E4] w-full"
                    type="file"
                    name="images"
                    multiple
                  />
               {(imagesDB || images.length > 0) && (
  <div className="">
    <span className="inline-block mt-4 mb-1">Current Images:</span>
    <div className="flex gap-4 items-center flex-wrap">
      {[...imagesDB.split(","), ...images].map((item, index) => {
        // Clean image path if it's a string and contains '/api'
        const cleanItem = typeof item === "string" && item.includes("/api/")
          ? item.replace("/api/", "")
          : item;

        return (
          <>
            {cleanItem && (
              <div className="relative h-full" key={index}>
                <Image
                  key={index}
                  src={
                    typeof cleanItem === "string"
                      ? serverurl + cleanItem
                      : URL.createObjectURL(cleanItem) // For new image files
                  }
                  alt=""
                  className="aspect-square rounded-sm bg-white d-flex p-1"
                  width={180}
                  height={180}
                />
                <XMarkIcon
                  className="w-4 h-4 absolute top-3 right-2 cursor-pointer bg-white text-black rounded-full"
                  onClick={() =>
                    imgDelete(
                      typeof cleanItem === "string"
                        ? item
                        : cleanItem.name // Handle deletion
                    )
                  }
                />
              </div>
            )}
          </>
        );
      })}
    </div>
  </div>
)}

                  {customErrors.images && (
                    <span className="text-red-400 text-sm pl-1">
                      {customErrors.images}
                    </span>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="submit"
                    className="rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-center text-xs font-semibold py-4 w-full max-w-[200px] disabled:bg-gray-600 disabled:cursor-progress"
                    disabled={loading}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="rounded-full my-5 uppercase shadow-btnShadow outline-none border border-primary text-primary text-center text-xs font-semibold py-4 w-full max-w-[200px] disabled:bg-gray-600 disabled:cursor-progress"
                    onClick={() => setEdit(!edit)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="mb-5">
                  On:
                  <Link
                    href={`/business/categories/${review.business_id}`}
                    className="underline inline-block "
                  >
                    {review.business?.name}
                  </Link>
                  <br />
                  By: <Link href={""}> {review.email}</Link>
                </div>
                <StarRating rating={review.rating} />
                <h3 className="text-xl font-bold capitalize pt-1">
                  {review.title}
                </h3>
                <div className="pt-2 pb-4">{review.review}</div>
                {review.review_files &&
                  review.review_files.split(",").length && 
                    <div className="flex gap-3 flex-wrap">
                     {review.review_files.split(",").map((img, i) => {
  // Check if the img contains '/api' and remove it
  const cleanImg = img.includes("/api/media/") ? img.replace("/api/", "") : img;
  return (
    <>
      {cleanImg && (
        <Image
          src={serverurl+cleanImg} // Use cleaned img path
          alt=""
          key={i}
          width={200}
          height={200}
          className="flex-grow-0 aspect-square rounded-sm"
        />
      )}
    </>
  );
})}

                    </div>
                  }
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
