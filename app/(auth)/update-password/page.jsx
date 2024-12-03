"use client";

import Formlabel from "@/components/Formlabel";
import InputField from "@/components/InputField";
import { LockClosedIcon } from "@heroicons/react/16/solid";
import Message from "@/components/Message";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdatePasswordZod } from "@/zod/UpdatePasswordZod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import usePostApi from "@/hooks/usePostApis";
// import { useRouter } from 'next/router';


const getQueryParamsFromHref = () => {
  const params = new URLSearchParams(window.location.search);
  const uid = params.get('uid');
  const token = params.get('token');
  return { uid, token };
};
export default function Home() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm({
    resolver: zodResolver(UpdatePasswordZod),
  });

  const [message, setMessage] = useState(null);
  // const { uid, token } = router.query;
  const [uid, setUid] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const { uid, token } = getQueryParamsFromHref();
    setUid(uid || '');
    setToken(token || '');
  }, []);

  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const { data, loading, error, postApi } = usePostApi();

  // useEffect(() => {
  //   if (router.isReady) {
  //     const { uid, token } = router.query;
  //     setUid(uid || '');
  //     setToken(token || '');
      
  //   }
  // }, [router.isReady, router.query]);

  // useEffect(() => {
  //   // Redirect to home if user is already authenticated
  //   if (user?.id) {
  //     router.push("/");
  //   }
  // }, [user, router]);

  const onSubmit = async (formData) => {
  
    
  
    if (formData.password !== formData.confirmPassword) {
      setMessage("Password not matched");
      toast.error('Password not matched.', { position: "top-right" });
      return;
    }
  
  
    try {
      const requestBody = {
        newpassword: formData.password,
        uid: uid,
        token: token,
      };
  
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
  
      const response = await fetch(`${serverurl}confirm-reset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal, // Pass the controller's signal to the fetch request
      });
  
      clearTimeout(timeoutId);
  
      const data = await response.json();
  
      if (data?.ErrorCode === 0 || data.ErrorCode === '0') {
        toast.success('Password reset Successful.', { position: "top-right" });
        reset(); // Clear the form fields after success
        setMessage('Password reset Successful.');
        router.push("/login");
      } else {
        setMessage(data?.ErrorMsg || 'Failed. Please try again.');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setMessage('The request took too long, please try again later.');
        toast.error('The request timed out. Please try again.', { position: "top-right" });
      } else {
        setMessage('An error occurred. Please try again.');
        toast.error('An error occurred. Please try again.', { position: "top-right" });
      }
      console.error("Update Password error", error);
    } 
  };
  

  return (
    <form className="max-w-lg mx-auto w-full" onSubmit={handleSubmit(onSubmit)}>
      {message && <Message message={message} />}
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
        Update Password
      </button>
    </form>
  );
}
