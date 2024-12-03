"use client";
import SubHeaderComponent from "@/components/datatable-components/SubHeaderComponent";
import Loader from "@/components/Loader";
 
import {
  EyeIcon,
  PencilSquareIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { Bounce, toast } from "react-toastify";
import style from "@/components/style.css";
import Breadcrumb from "@/components/BreadCrum";

const Page = () => {
  const router = useRouter();
  const { user, user_meta } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [selectedRowsState, setSelectedRows] = useState(false);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
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
  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Business",
      selector: (row) => (
        <Link href={`/business/${row.business__id}`} className="underline">
          {row.business__name}
        </Link>
      ),
      sortable: true,
    },
    {
      name: "User",
      selector: (row) => row.user__name,
      sortable: true,
    },
    {
      name: "Rating",
      selector: (row) => row.rating,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => {
        if (row.status == "0") return "PENDING";
        if (row.status == "1") return "APPROVED";
        if (row.status == "2") return "REJECTED";
      },
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Link href={`/business/reviews/${row.id}`} className="underline mr-4">
            <EyeIcon className="w-5 h-5" />
          </Link>
          {(user.role === 1 ||
            user.role === "1" ||
            user.id === row.user__id) && (
            <>
              <Link
                href={`/business/reviews/${row.id}`}
                className="underline mr-4"
              >
                <PencilIcon className="w-5 h-5" />
              </Link>

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
  const handleDelete = async (id) => {
    try {
      // Prepare the data to send to the Django API
      const updateData = [
        {
          id: id,
          status: reviews.status, // Assuming '4' corresponds to 'archived' or similar status in your model
          isArchived: true,
        },
      ];

      const response = await fetch(`${serverurl}update-reviews/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();
      if (response.ok) {
        if (result.ErrorCode === 0) {
          // Success: Redirect to reviews dashboard or show success message
          getReviews();
          setToggleClearRows(!toggledClearRows);
        } else {
          // Handle error from the API
          console.error(result.ErrorMsg);
        }
      } else {
        // Handle server-side error
        throw new Error(result.ErrorMsg || "Failed to update review");
      }
    } catch (error) {
      console.log("Error updating review:", error);
    }
  };
  const [reviews, setReviews] = useState([]);
  const [filterText, setFilterText] = useState("");
  const filteredItems =
    reviews &&
    reviews.filter(
      (item) =>
        (item.title &&
          item.title.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.business__name &&
          item.business__name
            .toLowerCase()
            .includes(filterText.toLowerCase())) ||
        (item.user_email &&
          item.user_email.toLowerCase().includes(filterText.toLowerCase()))
    );

  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${serverurl}get-reviews/?page=${page}&per_page=${rowsPerPage}`
      );
      const result = await response.json();
      setReviews(result.data);
      setTotalItems(result.pagination.total_items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReviews();
  }, [page, rowsPerPage]); // Re-fetch data when page or rows per page change

  const handlePageChange = (newPage) => setPage(newPage);
  const handlePerRowsChange = (newPerPage) => setRowsPerPage(newPerPage);

  // select selected rows
  const onSelectRowChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };
  const selectStatus = async (e) => {
    try {
      let updateArray = [];
      if (e.target.value === "approve") {
        updateArray = selectedRowsState.map((row) => ({
          id: row.id,
          status: "1",
        }));
      } else if (e.target.value === "pending") {
        updateArray = selectedRowsState.map((row) => ({
          id: row.id,
          status: "0",
        }));
      } else if (e.target.value === "reject") {
        updateArray = selectedRowsState.map((row) => ({
          id: row.id,
          status: "2",
        }));
      } else if (e.target.value === "delete") {
        updateArray = selectedRowsState.map((row) => ({
          id: row.id,
          isArchived: true,
        }));
      }

      if (updateArray.length > 0) {

        const response = await fetch(`${serverurl}update-reviews/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateArray),
        });

        const result = await response.json();
        if (result.ErrorCode===0) {
        
            getReviews();
   
          setToggleClearRows(!toggledClearRows);
          toast.success("Updated Sucessfully");
        } else {
          toast.error(result.ErrorMsg || "Failed to update reviews");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Business", href: "/business/" },

    { label: "All Reviews", href: "/business/reviews" },
  ];
  return (
    <>
    <div className="mt-5 grid md:grid-cols-1 gap-6">
      <Breadcrumb items={breadcrumbItems} /> 
     
</div>
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
      {loading ? (
        <Loader />
      ) : (
        <div className="w-[95%] mx-auto pb-20">
          <div className="mt-5">
            <DataTable
              title={
                <div className="pt-7">
                  <h1 className="text-2xl font-bold">Reviews</h1>
                  <div className="flex justify-between flex-wrap items-center w-full">
                    <select
                      onChange={selectStatus}
                      className="outline-none text-sm border border-gray-300 p-2 pr-4 cursor-pointer"
                    >
                      <option className="cursor-pointer" value="none">
                        Actions
                      </option>
                      {user_meta.role == 1 && (
                        <>
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
                    </select>
                    <SubHeaderComponent
                      filterText={filterText}
                      setFilterText={setFilterText}
                    />
                  </div>
                </div>
              }
              columns={columns} // Define columns as per your data structure
              data={filteredItems}
              pagination
              paginationServer
              paginationTotalRows={totalItems}
              paginationDefaultPage={page}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handlePerRowsChange}
              persistTableHead
              highlightOnHover
              fixedHeader
              selectableRows
              clearSelectedRows={toggledClearRows}
              onSelectedRowsChange={onSelectRowChange}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
