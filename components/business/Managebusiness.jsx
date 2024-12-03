"use client";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import {toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import SubHeaderComponent from "@/components/datatable-components/SubHeaderComponent";
import Link from "next/link";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/16/solid";

import style from "@/components/style.css"
import Breadcrumb from "../BreadCrum";
import { H2 } from "../Typography";

const Managebusiness = () => {
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
  const [showModal, setShowModal] = useState(false);
  const [selectedRowsState, setSelectedRows] = useState(false);
  const [filteredData, setFilteredData] = useState(business);

  useEffect(() => {
    // Filter the business data based on filterText
    setFilteredData(
      business.filter((item) =>
        item.name.toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [filterText, business]); // Re-run filtering whenever filterText or business changes

  const [deleteId, setDeleteId] = useState(null);
  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Location", selector: (row) => row.location, sortable: true },
    { name: "Phone", selector: (row) => row.phone, sortable: true },
    {
      name: "Reviews",
      cell: (row) => (
        <Link
          href={`/business/categories/${row.slug}`}
          className="underline mr-4 text-center block w-full text-blue-600 hover:text-blue-800 transition-all duration-300"
        >
          {row.review_count || 0}
        </Link>
      ),
    },
    {
      name: "Status",
      cell: (row) => {
        let statusText;
        let statusColor;
    
        // Determine the status text and color based on the approved value
        switch (row.approved) {
          case 0:
            statusText = "PENDING";
            statusColor = "text-yellow-500 bg-yellow-200"; // Yellow for pending
            break;
          case 1:
            statusText = "APPROVED";
            statusColor = "text-green-500 bg-green-200"; // Green for approved
            break;
          case 2:
            statusText = "REJECTED";
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
    
  
    {
      name: "Actions",
      cell: (row) => (
        <>
          {/* Always show EyeIcon */}
          <Link
            href={`/business/categories/${row.slug}`}
            className="underline mr-4" // Add margin-right for spacing
          >
            <EyeIcon className="w-5 h-5" />
          </Link>

          {(user.role === 1 ||
            user.role === "1" ||
            user.id === row.user_id) && (
            <>
              {/* Edit Business */}
              <Link
                href={`/business/update/${row.slug}`}
                className="underline mr-4" // Add margin-right for spacing
              >
                <PencilIcon className="w-5 h-5" />
              </Link>

              {/* Delete Business */}
              <button
                className="bg-red-500 text-white w-7 h-7 rounded-full flex justify-center items-center"
                onClick={() => openModal(row.id)} // Open modal on click
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </>
          )}
        </>
      ),
    },
  ];

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      let response;
      const headers = { 'Content-Type': 'application/json' };
      const url = user.role === '3' || user.role === 3
        ? `${serverurl}get-userbusiness/?page=${page}&per_page=${perPage}`
        : `${serverurl}get-business/?page=${page}&per_page=${perPage}`;
      
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
  const onSelectRowChange = ({ selectedRows }) => {

    setSelectedRows(selectedRows);
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
      router.push("/business/home");
      return;
    }
    fetchBusinesses();
  }, [page, perPage]);
  const openModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setDeleteId(null);
  };
  const handleRowClick = (row) => {
    router.push(`/business/update/${row.slug}`); // Navigate to the business details page
  };
  const confirmDelete = () => {
    if (deleteId) {
      handleDelete(deleteId);
    }
    closeModal(); // Close the modal after deletion
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${serverurl}archive-business/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      const result = await response.json();
      if (response.ok) {
        fetchBusinesses();
        setToggleClearRows(!toggledClearRows);
        toast.success("Deleted Sucessfully");
      } else {
        toast.error(result.ErrorMsg || "Failed to update businesses");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };
  const selectStatus = async (e) => {
    try {
      let updateArray = [];

      if (e.target.value === "approve") {
        updateArray = selectedRowsState.map((row) => ({
          id: row.id,
          approved: "1",
        }));
      } else if (e.target.value === "pending") {
        updateArray = selectedRowsState.map((row) => ({
          id: row.id,
          approved: "0",
        }));
      } else if (e.target.value === "reject") {
        updateArray = selectedRowsState.map((row) => ({
          id: row.id,
          approved: "2",
        }));
      } else if (e.target.value === "delete") {
        updateArray = selectedRowsState.map((row) => ({
          id: row.id,
          isArchived: true,
        }));
      } else if (e.target.value === "featured") {
        updateArray = selectedRowsState.map((row) => ({
          id: row.id,
          isFeatured: true,
        }));
      } else if (e.target.value === "unfeatured") {
        updateArray = selectedRowsState.map((row) => ({
          id: row.id,
          isFeatured: false,
        }));
      }
   
      if (updateArray.length > 0) {
        const response = await fetch(`${serverurl}update-businesses/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateArray),
        });

        const result = await response.json();
        if (result.ErrorCode === 0) {
          fetchBusinesses();
          setToggleClearRows(!toggledClearRows);
          toast.success("Updated Sucessfully");
        } else {
          toast.error(result.ErrorMsg || "Failed to update businesses");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };


  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "All Business Management", href: "/business/" },
  ];
  return (
    <>
            <div className="mt-5 grid md:grid-cols-1 gap-6">
      <Breadcrumb items={breadcrumbItems} /> 
     
</div>
      {loading ? (
        <Loader />
      ) : (
        <div>
      
          <div className="w-[95%] mx-auto pb-20 ">
            <div className="flex justify-end flex-wrap my-6">
              {user.role && (
                <Link
                  href="/business/add"
                  className="bg-primary text-white text-center text-sm rounded-full py-2 px-9"
                >
                  Add
                </Link>
              )}
            </div>
            <div className="min-h-[700px]">
              <DataTable
                title={
                  <div className="pt-7">
                    <h1 className="text-2xl font-bold mb-4">Businesses</h1>
                    {/* Responsive container for actions and filter input */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
                      {/* Dropdown Select for Actions */}
                      <select
                        onChange={selectStatus}
                        className="outline-none text-sm border border-gray-300 p-2 pr-4 rounded-md cursor-pointer w-full sm:w-auto"
                      >
                        <option className="cursor-pointer" value="none">
                          Actions
                        </option>
                        {user_meta.role === 1 && (
                          <>
                            <option className="cursor-pointer" value="featured">
                              Featured
                            </option>
                            <option
                              className="cursor-pointer"
                              value="unfeatured"
                            >
                              Unfeatured
                            </option>
                            <option className="cursor-pointer" value="approve">
                              Approve
                            </option>
                            <option className="cursor-pointer" value="pending">
                              Pending
                            </option>
                            <option className="cursor-pointer" value="reject">
                              Reject
                            </option>
                            <option className="cursor-pointer" value="delete">
                              Delete
                            </option>
                          </>
                        )}
                        {user.role === 3 && (
                          <option className="cursor-pointer" value="delete">
                            Delete
                          </option>
                        )}
                      </select>
                      {/* SubHeaderComponent for filtering */}
                      <div className="w-full sm:w-64">
                        {" "}
                        {/* Fixed width for input on larger screens */}
                        <SubHeaderComponent
                          filterText={filterText}
                          setFilterText={setFilterText}
                        />
                      </div>
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
                paginationPerPage={perPage}

                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
                persistTableHead
                highlightOnHover
                fixedHeader
                clearSelectedRows={toggledClearRows}
                onSelectedRowsChange={onSelectRowChange}
                selectableRows
                subHeader
              />
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">Are you sure you want to delete this item?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={closeModal} // Close modal if No is clicked
              >
                No
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={confirmDelete} // Confirm deletion if Yes is clicked
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Managebusiness;
