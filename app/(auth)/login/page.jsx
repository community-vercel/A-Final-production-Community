"use client";

import Formlabel from "@/components/Formlabel";
import InputField from "@/components/InputField";
import { UserIcon, LockClosedIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import Message from "@/components/Message";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginZod } from "@/zod/LoginZod";


import { useEffect, useState } from "react";

import {
  setUser,
  setSession,
  setIsAuthenticated,
  setUserMeta,
} from "@/store/slices/authslice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { google } from "@/assets";
import { toast } from "react-toastify";


export default function Home() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(LoginZod),
  });

  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const user_meta = useSelector((state) => state.auth.user_meta);

 
  


  useEffect(() => {
    if (user && user.id && user_meta.role===1) {
      router.push("/business");

    }
    if (user && user.id && user_meta.role===3) {
      router.push("/");

    }
  }, [user]);
  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL
  const onSubmit = async (formData) => {
    try {
      const payload = {
        username: formData.email,
        password: formData.password,
      
      };
      const response = await fetch(`${serverurl}login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();






      

if(data.ErrorCode==0 || data.ErrorCode=='0' ){
  toast.success('Login Sucessfully');
 
 
      dispatch(setUser({ user: data.user }));
      dispatch(setSession({ session: data.session }));
      dispatch(setIsAuthenticated({ isAuthenticated: true }));
      dispatch(setUserMeta({ user_meta: data.user_meta }));
      if(data.user.role == '1'){
        router.push("/business");
      } 
    router.push("/");
}

else{
  toast.error( 'Check your email and password and try again.,if you forgot your password click on forgot password');

  setMessage('Check your email and password and try again.,if you forgot your password click on forgot password')

}

     

    } catch (err) {
        // setMessage(err.message)

      toast.error(err.message || 'Failed to Login');
   
      setError(err.message);
    }
  }
  
  const signInWithGoogle = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: process.env.NEXT_PUBLIC_SITE_URL + "oauth",
        },
      });
      if (error) throw error;
    } catch (error) {
      setMessage(error.message);
    }
  };


  return (
    <>
   
      
        <form
          className="max-w-lg mx-auto w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
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
              <UserIcon />
            </InputField>
          </div>

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

          <button
            type="submit"
            className="rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full"
          >
            Log In
          </button>
          <div className="flex justify-between mb-5">
            <Link
              href="/register"
              className="text-primary text-xs font-semibold"
            >
              Register
            </Link>
            <Link href="/forgetpassword" className="text-xs text-text-gray">
              Lost your password?
            </Link>
          </div>
          <button
            type="button"
            onClick={signInWithGoogle}
            className="flex gap-2 p-3 text-center justify-center rounded-lg mb-4 border border-text-gray w-full"
          >
            <Image src={google} alt="" className="w-5 h5" /> <span>Google</span>
          </button>
        </form>
      {/* )} */}
      
    </>
  );
}
