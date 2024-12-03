"use client";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { Bounce, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import Breadcrumb from "@/components/BreadCrum";
import SubHeaderComponent from "@/components/datatable-components/SubHeaderComponent";
import Link from "next/link";
import {
  EnvelopeIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/16/solid";

import style from "@/components/style.css"

const ManagepropertyHistory = () => {
  const router = useRouter();
  const { user, user_meta } = useSelector((state) => state.auth);
  const [business, setBusiness] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const [page, setPage] = useState(1); // Current page
  const [perPage, setPerPage] = useState(10); // Items per page
  const [totalItems, setTotalItems] = useState(0); // Total items in database
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
 
  const [filteredData, setFilteredData] = useState(business);

  useEffect(() => {
    // Filter the business data based on filterText
    setFilteredData(
      business.filter((item) =>
        item.fields.name && item.fields.name.toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [filterText, business]); // Re-run filtering whenever filterText or business changes

  const [deleteId, setDeleteId] = useState(null);
  const columns = [
    { name: "Name", selector: (row) => row.fields.name, sortable: true },
    { name: "User Id", selector: (row) => row.fields.user, sortable: true },
    { 
        name: "Location", 
        selector: (row) => `${row.fields.location}, ${row.fields.city}, ${row.fields.state}`, 
        sortable: true 
      },
          { name: "Phone", selector: (row) => row.fields.phone, sortable: true },
    { name: "Date",selector: (row) => row.fields.history_date, sortable: true },
   
   
    {
        name: "Action",
        cell: (row) => {
          let statusText;
          let statusColor;
      
          // Determine the status text and color based on the approved value
          switch (row.fields.history_change_reason) {
            case "Update Status":
              statusText = "Update Status";
              statusColor = "text-green-500 bg-yellow-200"; // Yellow for pending
              break;
            case "Update property":
              statusText = "Update property";
              statusColor = "text-green-500 bg-green-200"; // Green for approved
              break;
              case "Add New":
                statusText = "Add property";
                statusColor = "text-green-500 bg-green-200"; // Green for approved
                break;
            case "Delete property":
              statusText = "Delete property";
              statusColor = "text-red-500 bg-red-200"; // Red for rejected
              break;
            default:
              statusText = "UNKNOWN";
              statusColor = "text-gray-500 bg-gray-200"; // Gray for unknown
          }
      
          return (
            <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full ${statusColor}`}>
              {statusText}
            </span>
          );
        },
        sortable: true,
      },
    
  
    
  ];

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      let response;
      const headers = { 'Content-Type': 'application/json' };
      const url = `${serverurl}get-propertyhistory/?page=${page}&per_page=${perPage}`;
      
      const options = {
        method: user.role === '3' ||user.role === 3 ? 'POST' : 'GET',
        headers,
        ...(user.role === '3' || user.role === 3  && { body: JSON.stringify({ user_id: user.id }) })
      };

      response = await fetch(url, options);
      
      const result = await response.json();
   
      if (response.ok) {
        setBusiness(result.data);
        setTotalItems(result.pagination.total_items); // Total items for pagination
      } else {
        toast.error(result.ErrorMsg || "Failed to fetch businesses", {
          position: "bottom-center",
          autoClose: 3000,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    } finally {
      setLoading(false);
    }
  };


  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePerRowsChange = (newPerPage, newPage) => {
  
    setPerPage(newPerPage);
    setPage(newPage);
  };
 
  

  useEffect(() => {
    if (!user || !user.id) {
      router.push("/property/home");
      return;
    }
    fetchBusinesses();
  }, [page, perPage]);

  const handleRowClick = (row) => {
    router.push(`/property/types/${row.fields.slug}`); // Navigate to the business details page
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <div className="mt-5 w-[95%] mx-auto pb-20 ">
         
            <div className="min-h-[700px]">
              <DataTable
                title={
                  <div className="pt-7">
                    <h1 className="text-2xl font-bold mb-4">Property History</h1>
                    
                    <div className="w-full sm:w-60 ml-auto">
  <SubHeaderComponent
    filterText={filterText}
    setFilterText={setFilterText}
  />
</div>


                  </div>
                }
                columns={columns}
                data={filteredData} // Use filtered data here
                pagination
                paginationServer
                paginationTotalRows={totalItems}
                onRowClicked={handleRowClick} // Set the row click handler
                paginationDefaultPage={page}
                onChangePage={handlePageChange}
                paginationRowsPerPageOptions={[10,20,30,40,50,100]}
                paginationPerPage={perPage}
                onChangeRowsPerPage={handlePerRowsChange}
                persistTableHead
                highlightOnHover
                fixedHeader
                clearSelectedRows={toggledClearRows}
                // selectableRows
                subHeader
              />
            </div>
          </div>
        </div>
      )}
   
    </>
  );
};

export default ManagepropertyHistory;
