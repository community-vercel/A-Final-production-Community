"use client";
import SubHeaderComponent from "@/components/datatable-components/SubHeaderComponent";
import Loader from "@/components/Loader";
 
import { PencilSquareIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { Bounce, toast } from "react-toastify";

import useGetApi from "@/hooks/useGetApis";
import { Delete } from "@mui/icons-material";
import { TrashIcon } from "@heroicons/react/24/solid";
import Breadcrumb from "@/components/BreadCrum";
const Managesubcategories = () => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState();
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const [category, setCategory] = useState([]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${serverurl}delete-subcategory/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      const result = await response.json();

      if (response.ok) {
     
        fetchCategories();
        toast.success("Deleted Sucessfully", {
          position: "right-top",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }

      // Optionally refresh or update your state here to remove the deleted subcategory from the UI
      // Call a function to refresh the data or update the UI accordingly
    } catch (error) {
      toast.error("An error occurred while deleting the subcategory.", {
        position: "right-top",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  // const { data, loading, error } = useGetApi('http://127.0.0.1:8000/get-categories/');
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Parent",
      selector: (row) => (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {row.categories && row.categories ? (
            row.categories.map((child) => (
              <div
                key={child.id}
                className="bg-gray-100 border border-gray-300 rounded-md p-2 text-center"
              >
                <span className="text-gray-800 text-[10px]">{child.name}</span>
              </div>
            ))
          ) : (
            <div className="text-gray-500 col-span-3">No Parent Category</div>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          {user.role && (
            <>
              <Link
                href={`/business/categories/subcategories/update/${row.id}`}
                className="underline"
              >
                <PencilSquareIcon className="w-5 h-5" />
              </Link>
              <button
                className="ml-5 bg-red-500 text-white w-7 h-7 rounded-full flex justify-center items-center"
                onClick={() => openModal(row.id)} // Open modal on click
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </>
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

  const [filterText, setFilterText] = useState("");
  const filteredItems = Array.isArray(category)
    ? category.filter(
        (item) =>
          item.name &&
          item.name.toLowerCase().includes(filterText.toLowerCase())
      )
    : []; // Return an empty array if category is not an array

  // Optionally, handle the case when there are no filtered items


  // if (!user || !user.id) {
  //   router.push("/");
  //   return;
  // }
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const openModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setDeleteId(null);
  };

  const confirmDelete = () => {
    if (deleteId) {
      handleDelete(deleteId);
    }
    closeModal(); // Close the modal after deletion
  };
  const fetchCategories = async (page = currentPage, size = pageSize) => {
    try {
      let response;
      const headers = { "Content-Type": "application/json" };
      const url = `${serverurl}get-allsubcategories/?page=${page}&page_size=${size}`;

      const options = {
        method: "GET",
        headers,
      };

      response = await fetch(url, options);

      const result = await response.json();

      if (response.ok) {
        setCategory(result.results.subcategories);
        setTotalRows(result.count);
      } else {
        setError(result.error || "Failed to fetch businesses");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!user || !user.id) {
      router.push("/");
      return;
    }
    fetchCategories();
  }, [user]);

  useEffect(() => {
    fetchCategories(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Business", href: "/business/" },

    { label: "Categories", href: "/business/categories" },
    { label: "SubCategories", href: "/business/categories/subcategories" },

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
            {user.role && (
              <Link
                href="/business/categories/subcategories/add"
                className="bg-primary text-white text-center text-sm rounded-full py-2 px-9 border-8 border-white"
              >
                Add
              </Link>
            )}
          </div>
          <div className="mt-5">
            <DataTable
            title="Sub Categories"
            columns={columns}
            data={category}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={pageSize}
            paginationRowsPerPageOptions={[10, 20, 30, 50]}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePageSizeChange}
            />
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

export default Managesubcategories;
