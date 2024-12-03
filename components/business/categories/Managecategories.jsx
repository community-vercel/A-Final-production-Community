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
import { TrashIcon } from "@heroicons/react/24/solid";
import Breadcrumb from "@/components/BreadCrum";

const ManageCategories = () => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true); // Start loading as true
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const serverUrl = process.env.NEXT_PUBLIC_DJANGO_URL;

  const fetchCategories = async (page = currentPage, size = pageSize) => {
    try {
      const response = await fetch(
        `${serverUrl}get-categories/?page=${page}&page_size=${size}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const result = await response.json();
      if (response.ok) {
        setCategories(result.results.categories);
        setTotalRows(result.count);
      } else {
        toast.error(result.error || 'Failed to fetch categories', { transition: Bounce });
      }
    } catch (error) {
      toast.error('An unexpected error occurred', { transition: Bounce });
    } finally {
      setLoading(false); // Set loading to false after fetching data
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

  const openModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setDeleteId(null);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await handleDelete(deleteId);
    }
    closeModal();
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${serverUrl}delete-category/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id }),
      });

      if (response.ok) {
        fetchCategories(currentPage, pageSize); // Re-fetch categories after delete
        toast.success('Deleted Successfully', { transition: Bounce });
      }
    } catch (error) {
      toast.error('An error occurred while deleting the category.', { transition: Bounce });
    }
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Sub Types",
      selector: (row) => (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {row.subcategories && row.subcategories.length > 0 ? (
            row.subcategories.map((child) => (
              <div key={child.id} className="bg-gray-100 border border-gray-300 rounded-md p-2 text-center">
                <span className="text-gray-800 text-[10px]">{child.name}</span>
              </div>
            ))
          ) : (
            <div className="text-gray-500 col-span-3">No subcategories available</div>
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
              <Link href={`/business/categories/update/${row.id}`} className="underline">
                <PencilSquareIcon className="w-5 h-5" />
              </Link>
              <button className="ml-5 bg-red-500 text-white w-7 h-7 rounded-full flex justify-center items-center" onClick={() => openModal(row.id)}>
                <TrashIcon className="w-4 h-4" />
              </button>
            </>
          )}
        </>
      ),
    },
  ];
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Business", href: "/business/" },

    { label: "All Business Categories", href: "/business/categories" },
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
              <Link href="/business/categories/add" className="bg-primary text-white text-center text-sm rounded-full py-2 px-9 border-8 border-white">
                Add
              </Link>
            )}
          </div>
          <DataTable
            title="Categories"
            columns={columns}
            data={categories}
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
      )}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">Are you sure you want to delete this item? All related subcategories will be deleted.</p>
            <div className="flex justify-end space-x-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeModal}>
                No
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={confirmDelete}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageCategories;
