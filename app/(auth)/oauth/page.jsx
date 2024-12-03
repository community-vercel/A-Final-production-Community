"use client";
 
import React, { useEffect, useState } from "react";
import { setIsAuthenticated, setRole, setUser, setUserMeta } from "@/store/slices/authslice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Formlabel from "@/components/Formlabel";

const Page = () => {
  const [checkIfRoleExits, setCheckIfRoleExits] = useState(true);
  const [checkboxRole, setCheckboxRole] = useState(true);

  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state) => state.auth.user);
  const user_meta = useSelector((state) => state.auth.user_meta);

  if(user && user_meta.role) router.push('/')

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user:userData },
      } = await supabase.auth.getUser();
      dispatch(setUser({ user: userData }));
      if (userData) {
        const { data: usermetaData, error } = await supabase
          .from("user_meta")
          .select("*")
          .eq("user_id", userData.id)
          .single();

          if (usermetaData && usermetaData.id) {
            dispatch(setUserMeta({ user_meta: usermetaData }));
            dispatch(setIsAuthenticated({ isAuthenticated: true }));
            if(usermetaData.role == 'super_admin'){
              router.push("/dashboard/business");
            }else{
              router.push("/");
            }
          } else {
            setCheckIfRoleExits(false);
          }
      }
    };
    getUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data,error } = await supabase
      .from("user_meta")
      .insert({ role: checkboxRole, user_id: user.id }).select().single();
    if (error) throw error;
    dispatch(setUserMeta({ user_meta:data }));
    dispatch(setIsAuthenticated({ isAuthenticated: true }));
 
    if(data.role == 'super_admin'){
      router.push("/dashboard/business");
    }else{
      router.push("/");
    }
  };

  return (
    <div>
      {!checkIfRoleExits && (
        <form onSubmit={handleSubmit}>
          <h3 className="text-2xl">Please complete your profile</h3>
          <div className="my-5">
            <Formlabel text="Register as" />
            <div className="flex gap-4">
              <div className="flex gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="user"
                  id="user"
                  name="role"
                  defaultChecked={true}
                  onChange={() => setCheckboxRole("user")}
                />
                <label htmlFor="user">User</label>
              </div>
              <div className="flex gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="business"
                  id="business"
                  onChange={() => setCheckboxRole("business")}
                />
                <label htmlFor="business">Business</label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-full uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full"
          >
            Confirm
          </button>
        </form>
      )}

      {checkIfRoleExits && <div className="">Verifying...</div>}
    </div>
  );
};

export default Page;
