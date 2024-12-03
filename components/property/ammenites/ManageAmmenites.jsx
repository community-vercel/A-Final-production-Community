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
import * as FaIcons from "react-icons/fa"; // Import all icons from react-icons/fa
import Breadcrumb from "@/components/BreadCrum";

const ManageAmmenites = () => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState();
  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL

  const columns = [
    {
      name: "Ammenites",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Icons",
      selector: (row) => <div className="p-2 rounded-full bg-gray-100">
        {row.icon?(
           React.createElement(FaIcons[row.icon], { size: 40 })
        ):row.name
        }
   
    </div>,
      sortable: true,
    },
  
    
    {
      name: "Actions",
      cell: (row) => (
        <>
        {user.role &&(
          <Link
            href={`/property/amenites/update/${row.id}`}
            className="underline ml-5"
          >
            <PencilSquareIcon className="w-5 h-5" />
          </Link>
        )}
          
         
           
        </>
      ),
    },
  ];

  const [Ammenites, setAmmenites] = useState([]);
  const [filterText, setFilterText] = useState("");
  const filteredItems = Array.isArray(Ammenites)
  ? Ammenites.filter((item) =>
      item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
    )
  : []; // Return an empty array if type is not an array




  useEffect(() => {
    // if (!user || !user.id) {
    //   router.push("/");
    //   return;
    // }
    const fetchTypes = async () => {
      try {
        let response;
        const headers = { 'Content-Type': 'application/json' };
        const url = `${serverurl}get-amenties/`;
        
        const options = {
          method: 'POST',
          headers,
          
        };

        response = await fetch(url, options);
        
        const result = await response.json();
        
        if (response.ok) {

        setAmmenites(result.data);
         



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
    { label: "All Ammenites", href: "/property/amenites" },

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
              href="/dashboard/ammenites/add"
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
                  <h1 className="text-2xl font-bold">Ammenites</h1>
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

export default ManageAmmenites;
