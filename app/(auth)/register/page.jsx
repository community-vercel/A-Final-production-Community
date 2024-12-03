"use client";

import Formlabel from "@/components/Formlabel";
import InputField from "@/components/InputField";
import {
  UserIcon,
  LockClosedIcon,
  EnvelopeIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";
import Message from "@/components/Message";
import {  toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterZod } from "@/zod/RegisterZod";
import usePostApi from "@/hooks/usePostApis";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setIsAuthenticated, setUserMeta, setSession, setUser } from "@/store/slices/authslice";

export default function Home() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(RegisterZod),
  });
  const { data, loading, error, postApi } = usePostApi();

  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const user_meta = useSelector((state) => state.auth.user_meta);



  const handleLanguageChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedLanguages((prev) => [...prev, value]);
    } else {
      setSelectedLanguages((prev) => prev.filter((lang) => lang !== value));
    }
  };



  useEffect(() => {
    if(data){
      if (data.ErrorCode === 0 || data.ErrorCode === '0') {
        // Set the user details in the Redux store
        // dispatch(setUser({ user: data.user }));
        // dispatch(setSession({ session: data.session }));
        // dispatch(setIsAuthenticated({ isAuthenticated: true }));
        // dispatch(setUserMeta({ user_meta: usermetaData }));
        toast.success('Registration successful. Please check your email to confirm your account.', { position: "top-right" }); // Show success toast

        setMessage('Registration successful. Please check your email to confirm your account.');
         router.push("/");
    } else {
        setMessage(data.ErrorMsg || 'Registration failed. Please try again.');
    }
    }
   
  }, [data?data.ErrorCode:[]]);
 
  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const handleRoleChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedRoles((prev) => [...prev, value]);
    } else {
      setSelectedRoles((prev) => prev.filter((role) => role !== value));
    }
  };

  const onSubmit = async (formData) => {
    setMessage('')
    try {
      // const selectedRoles = formData.role || [];
      // const selectedLanguages=formData.language || [];
      
    const requestBody = {
      name: formData.fullname,
      email: formData.email,
      password: formData.password,
      roles: selectedRoles,
      language:selectedLanguages,
      
      // This will be an array of selected roles
    };

      // Call postApi directly
      await postApi(`${serverurl}registerUser`, requestBody);
  //  if (data.ErrorCode === 0) {
  //           // Set the user details in the Redux store
  //           // dispatch(setUser({ user: data.user }));
  //           // dispatch(setSession({ session: data.session }));
  //           // dispatch(setIsAuthenticated({ isAuthenticated: true }));
  //           // dispatch(setUserMeta({ user_meta: usermetaData }));
  //           setMessage('Registration successful. Please check your email to confirm your account.');
  //            router.push("/");
  //       } else {
  //           setMessage(data.ErrorMsg || 'Registration failed. Please try again.');
  //       }
      // If needed, you can dispatch actions or navigate here
      

    } catch (error) {
      toast.error(error.message || "An error occurred", { position: "top-right" }); // Show error toast

      setMessage(error.message);
      console.error("Registration error", error);
    }


   
  };
  const languageMapping = {
    en: "English",
    fr: "French",
    es: "Spanish",
    ab: "Arabic",
    pt: "Portuguese",
  };
  

  return (
    <form className="max-w-lg mx-auto w-full" onSubmit={handleSubmit(onSubmit)}>
      {message && <Message message={message} />}
      <div className="">
        <Formlabel text="Email" forLabel="email" />
        <InputField
          inputId="email"
          inputName="email"
          inputType="email"
          register={register}
          error={errors.email}
        >
          <EnvelopeIcon />
        </InputField>
      </div>

      <div className="">
        <Formlabel text="Full Name" forLabel="fullname" />
        <InputField
          inputId="fullname"
          inputName="fullname"
          inputType="text"
          register={register}
          error={errors.fullname}
        >
          <UserIcon />
        </InputField>
      </div>
      <div className="mb-5">
        <Formlabel text="Register as" />
        <div className="grid grid-cols-2 gap-4">
          {["events", "business", "community", "rent", "job"].map((role) => (
            <div className="flex items-center gap-2" key={role}>
              <input
                type="checkbox"
                value={role}
                id={role}
                onChange={handleRoleChange}
                className="form-checkbox"
              />
              <label htmlFor={role} className="text-sm">{role.charAt(0).toUpperCase() + role.slice(1)}</label>
            </div>
          ))}
        </div>
        {errors.role?.message && (
          <span className="text-red-400 text-sm pl-1">
            {errors.role?.message}
          </span>
        )}
      </div>
      <div className="mb-5">
  <Formlabel text="Choose Language" />
  <div className="grid grid-cols-2 gap-4">
    {Object.entries(languageMapping).map(([code, name]) => (
      <div className="flex items-center gap-2" key={code}>
        <input
          type="checkbox"
          value={code} // Keep the value as the language code
          id={code}
          onChange={handleLanguageChange}
          className="form-checkbox"
        />
        <label htmlFor={code} className="text-sm">{name}</label> {/* Use full name for the label */}
      </div>
    ))}
  </div>
  {errors.language?.message && (
    <span className="text-red-400 text-sm pl-1">
      {errors.language?.message}
    </span>
  )}
</div>



      {/* <div className="mb-5">
        <Formlabel text="Register as" />
        <div className="flex gap-4">
          <div className="flex gap-2 cursor-pointer">
            <input
              type="radio" 
              value="user"
              id="user"
              defaultChecked={true}
              {...register("role")}
            />
            <label htmlFor="user">User</label>
          </div>
          <div className="flex gap-2 cursor-pointer">
            <input
              type="radio" 
              value="business"
              id="business"
              {...register("role")}
            />
            <label htmlFor="business">Business</label>
          </div>
        </div>

        {errors.role?.message && (
          <span className="text-red-400 text-sm pl-1">
            {errors.role?.message}
          </span>
        )}
      </div> */}

      <div className="">
        <Formlabel text="Password" forLabel="password" />
        <InputField
          inputId="password"
          inputName="password"
          inputType="password"
          register={register}
          error={errors.password}
        >
          <LockClosedIcon />
        </InputField>
      </div>

      <div className="">
        <Formlabel text="Confirm Password" forLabel="c_password" />
        <InputField
          inputId="c_password"
          inputName="confirmPassword"
          inputType="password"
          register={register}
          error={errors.confirmPassword}
        >
          <LockClosedIcon />
        </InputField>
      </div>

      <button
        type="submit"
        className="rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full"
      >
        Register
      </button>
      <div className="flex justify-between">
        <Link href="/login" className="text-primary text-xs font-semibold">
          Login
        </Link>
        <Link href="/forgetpassword" className="text-xs text-text-gray">
          Lost your password?
        </Link>
      </div>
    </form>
  );
}
