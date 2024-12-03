"use client";
import React, { useState } from "react";
 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReviewsFormZod } from "@/zod/ReviewsFormZod";
import Formlabel from "./Formlabel";
import InputField from "./InputField";
import { StarIcon, XMarkIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import { useSelector } from "react-redux"; 

const ReviewsForm = ({
  business_id,
  user_id,
  showReviewForm,
  setShowReviewForm,
  setReviews,
  user_email,
}) => {
  const [images, setImages] = useState([]);
  const [customErrors, setCustomErrors] = useState({});
  const { user_meta, user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(ReviewsFormZod),
    defaultValues: {
      rating: 0,
    },
  });
  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL
  const onSubmit = async (formdata) => {
    try {
      setLoading(true);
  
      // Create FormData object to handle file uploads
      const formData = new FormData();
      formData.append('business_id', business_id);
      formData.append('user_id', user_id);
      formData.append('email', user_email);
      formData.append('title', formdata.title);
      formData.append('review', formdata.review);
      formData.append('rating', formdata.rating);
      formData.append('status', user.role===1 ? '1' : '0');
      // formData.append('approved', user.role===1 ? '1' : '0');

      images.forEach((image) => {
        formData.append('images', image);
      });
      const response = await fetch(`${serverurl}create-review/`, {
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      if (response.ok) {
        const newdata=result.data;

      
        setShowReviewForm(!showReviewForm)
       setReviews((prev) => [...prev, newdata]);
      
        reset();
        
        setImages([]);
      } else {
        setError(result.error || 'Failed to add review');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const imgDelete = (name) => {
  
    setImages(images.filter(file=>file.name != name))
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
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
          <div className="flex gap-4 items-center flex-wrap">
            {images.length > 0 && images.map((item, index) => (
              <>
                {item && (
                  <div className="relative h-full" key={index}>
                    <Image
                      key={index}
                      src={
                        typeof item == "string"
                          ? item
                          : URL.createObjectURL(item)
                      }
                      alt=""
                      className="aspect-square rounded-sm  bg-white d-flex p-1"
                      width={180}
                      height={180}
                    />
                    <XMarkIcon
                      className="w-4 h-4 absolute top-3 right-2 cursor-pointer bg-white text-black rounded-full"
                      onClick={() =>
                        imgDelete(typeof item == "string" ? item : item.name)
                      }
                    />
                  </div>
                )}
              </>
            ))}
          </div>
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
            Add
          </button>
          <button
            type="button"
            className="rounded-full my-5 uppercase shadow-btnShadow outline-none border border-primary text-primary text-center text-xs font-semibold py-4 w-full max-w-[200px] disabled:bg-gray-600 disabled:cursor-progress"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewsForm;
