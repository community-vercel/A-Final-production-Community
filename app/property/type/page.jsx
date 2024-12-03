"use client";
import SubHeaderComponent from "@/components/datatable-components/SubHeaderComponent";
import Loader from "@/components/Loader";
 
import { PencilSquareIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import useGetApi from "@/hooks/useGetApis";
import style from '@/components/style.css';
import Breadcrumb from "@/components/BreadCrum";

const Page = () => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState();
  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL

// const { data, loading, error } = useGetApi('http://127.0.0.1:8000/get-categories/');
  const columns = [
    {
      name: "Type",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Sub Types",
      selector: (row) => (
          <div className="grid grid-cols-3 gap-2 mt-2 ">
              {row.children.length > 0 ? (
                  row.children.map((child) => (
                      <div
                          key={child.id}
                          className="bg-gray-100 border border-gray-300 rounded-md p-2 text-center"
                      >
                          <span className="text-gray-800 text-[10px]">{child.name}</span>
                      </div>
                  ))
              ) : (
                  <div className="text-gray-500 col-span-3">No sub types available</div>
              )}
          </div>
      ),
      sortable: true,
  },
    
    {
      name: "Actions",
      cell: (row) => (
        <>
        {user.role &&(
          <Link
            href={`/property/type/update/${row.id}`}
            className="underline ml-5"
          >
            <PencilSquareIcon className="w-5 h-5" />
          </Link>
        )}
          
          {/* {row.user_id == user.id ? (
            <Link
              href={`/dashboard/business/update/${row.id}`}
              className="underline"
            >
              <PencilSquareIcon className="w-5 h-5" />
            </Link>
          ) : (
            "No actions avaiable"
          )} */}
           
        </>
      ),
    },
  ];

  const [type, setType] = useState([]);
  const [filterText, setFilterText] = useState("");
  const filteredItems = Array.isArray(type)
  ? type.filter((item) =>
      item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
    )
  : []; // Return an empty array if type is not an array

// Optionally, handle the case when there are no filtered items




  useEffect(() => {
    // if (!user || !user.id) {
    //   router.push("/");
    //   return;
    // }
    const fetchTypes = async () => {
      try {
        let response;
        const headers = { 'Content-Type': 'application/json' };
        const url = `${serverurl}get-type/`;
        
        const options = {
          method: 'POST',
          headers,
          
        };

        response = await fetch(url, options);
        
        const result = await response.json();
        
        if (response.ok) {

        setType(result.types);
         



        } else {
          setError(result.error || 'Failed to fetch businesses');
        }
      } 
       catch (error) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, []);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "property", href: "/property/" },
    { label: "All Types", href: "/property/type" },

  ];
  return (
    <>
      <div className="mt-5 grid md:grid-cols-1 gap-6">
      <Breadcrumb items={breadcrumbItems} /> 
     
</div>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-[95%] mx-auto">
          <div className="flex justify-end flex-wrap my-6">
            
          {user.role&&
            (
            <Link
              href="/property/type/add"
              className="bg-primary text-white text-center text-sm rounded-full py-2 px-9 border-8 border-white"
            >
              Add
            </Link>
            )}
          </div>
          <div className="mt-5">
            <DataTable
              title={
                <div className="flex justify-between flex-wrap items-center w-full">
                  <h1 className="text-2xl font-bold">Types</h1>
                  <SubHeaderComponent
                    filterText={filterText}
                    setFilterText={setFilterText}
                  />
                </div>
              }
              columns={columns}
              data={filteredItems}
              persistTableHead
              striped
              highlightOnHover
              pointerOnHover
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
