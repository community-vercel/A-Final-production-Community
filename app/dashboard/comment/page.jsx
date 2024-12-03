"use client";
import SubHeaderComponent from "@/components/datatable-components/SubHeaderComponent";
import Loader from "@/components/Loader";
 
import { EyeIcon, PencilSquareIcon,PencilIcon,TrashIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { Bounce, toast } from "react-toastify";

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
        <Link
          href={`/business/categories/${row.business__id}`}
          className="underline"
        >
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
        if(row.status == '0') return 'PENDING'
        if(row.status == '1') return 'APPROVED'
        if(row.status == '2') return 'REJECTED'
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
          {(user.role === 1 || user.role === '1' || user.id === row.user__id) && (
          <>
           <Link href={`/business/reviews/${row.id}`} className="underline mr-4">

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
      const updateData = [{
        id: id,
        status: reviews.status,  // Assuming '4' corresponds to 'archived' or similar status in your model
        isArchived: true
      }];
  
      const response = await fetch(`${serverurl}update-reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
  
      const result = await response.json();
      if (response.ok) {
        if (result.ErrorCode === 0) {
          // Success: Redirect to reviews dashboard or show success message
          getReviews();
          setToggleClearRows(!toggledClearRows);        } else {
          // Handle error from the API
          console.error(result.ErrorMsg);
        }
      } else {
        // Handle server-side error
        throw new Error(result.ErrorMsg || 'Failed to update review');
      }
    } catch (error) {
      console.log("Error updating review:", error);
    }


 
      };
  const [reviews, setReviews] = useState([]);
  const [filterText, setFilterText] = useState("");
  const filteredItems = reviews.filter(
    (item) =>
    (item.title && item.title.toLowerCase().includes(filterText.toLowerCase())) || 
    (item.business.name && item.business.name.toLowerCase().includes(filterText.toLowerCase())) || 
    (item.user_email && item.user_email.toLowerCase().includes(filterText.toLowerCase()))
  );

  useEffect(() => {
    if (!user ) router.push("/");
    getReviews();
  }, []);

 

  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL

  const getReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${serverurl}get-reviews/`);
      const result = await response.json();
      setReviews(result.data); 
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  


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
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateArray),
        });
  
        const result = await response.json();
        if (response.ok) {
          getReviews();
          setToggleClearRows(!toggledClearRows);
          toast.success('Updated', {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        } else {
          toast.error(result.ErrorMsg || 'Failed to update reviews', {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  // select status change
  // const selectStatus = async (e) => {
  //   try {
  //     console.log(e.target.value);
  //     let upddateArray = [];
  //     if (e.target.value === "approve") {
  //       upddateArray = selectedRowsState.map((row) => {
  //         return { id: row.id, status: "1" };
  //       });
  //     }
  //     if (e.target.value === "pending") {
  //       upddateArray = selectedRowsState.map((row) => {
  //         return { id: row.id, status: "0" };
  //       });
  //     }
  //     if (e.target.value === "reject") {
  //       upddateArray = selectedRowsState.map((row) => {
  //         return { id: row.id, status: "2" };
  //       });
  //     }
  //     if (e.target.value === "delete") {
  //       upddateArray = selectedRowsState.map((row) => {
  //         return { id: row.id, isArchived: true };
  //       });
  //     }

  //     if (upddateArray.length > 0) {
  //       console.log(upddateArray);

  //       const { data, error } = await supabase
  //         .from("reviews")
  //         .upsert(upddateArray)
  //         .select();

  //       if(error) throw error
  //       getReviews()
  //       setToggleClearRows(!toggledClearRows)
  //       toast.success('Updated', {
  //         position: "bottom-center",
  //         autoClose: 3000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: false,
  //         draggable: false,
  //         progress: undefined,
  //         theme: "light",
  //         transition: Bounce,
  //         });
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // };

  return (
    <>
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
              columns={columns}
              data={filteredItems}
              persistTableHead
              highlightOnHover
              fixedHeader

              clearSelectedRows={toggledClearRows}
              selectableRows
              onSelectedRowsChange={onSelectRowChange}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
