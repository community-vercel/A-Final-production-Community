"use client";
 
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import SubHeaderComponent from "@/components/datatable-components/SubHeaderComponent";
import Loader from "@/components/Loader";
import Link from "next/link";
import { EyeIcon, TrashIcon } from "@heroicons/react/16/solid";
import style from "@/components/style.css";

const Manageuser = () => {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowsState, setSelectedRows] = useState(false);
  const [toggledClearRows, setToggleClearRows] = useState(false);
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
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${serverurl}delete-specifiuser/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      const result = await response.json();
      if (response.ok) {
      
        getAllUsers();
        setToggleClearRows(!toggledClearRows);
        toast.success("Deleted Sucessfully", {
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
        toast.error(result.ErrorMsg || "Failed to update businesses", {
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
   
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) =>
        row.role === 1
          ? (row = "SuperAdmin")
          : row.role === 2
          ? (row.role = "Admin")
          : "User",
      sortable: true,
    },
    {
      name: "Deactivation Request",
      cell: (row) => <CustomDropdown row={row} />,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Link
            href={`/dashboard/users/${row.id}`}
            className="underline mr-4" // Add margin-right for spacing
          >
            <EyeIcon className="w-5 h-5" />
          </Link>
          <button
            className="bg-red-500 text-white w-7 h-7 rounded-full flex justify-center items-center"
            onClick={() => openModal(row.id)} // Open modal on click
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </>
      ),
    },
  ];

 

  const [filterText, setFilterText] = useState("");
  const filteredItems =
    users &&
    users.filter(
      (item) =>
        item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
    );

  useEffect(() => {
    if (!user.id) return router.push("/");
    getAllUsers();
  }, [user]);
  const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;

  const getAllUsers = async (page = currentPage, size = pageSize) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${serverurl}get-all-users/?page=${page}&page_size=${size}`
      );
      const result = await response.json();
      if (response.ok) {
        setTotalRows(result.count);
        setUsers(result.results.data);
      } else {
        console.error(result.ErrorMsg);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !user.id) {
      router.push("/");
      return;
    }
    getAllUsers();
  }, [user]);

  useEffect(() => {
    getAllUsers(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const onSelectRowChange = ({ selectedRows }) => {
 
    setSelectedRows(selectedRows);
  };

  const selectStatus = async (e) => {
    try {
    
      let updateArray = [];

      if (e.target.value === "delete") {
        updateArray = selectedRowsState.map((row) => ({
          id: row.id,
        }));
      }

      if (updateArray.length > 0) {
  

        const response = await fetch(`${serverurl}delete-user/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateArray),
        });

        const result = await response.json();
        if (result.ErrorCode === 0 || result.ErrorCode === "0") {
          getAllUsers();
          setToggleClearRows(!toggledClearRows);
          toast.success("Updated", {
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
          toast.error(result.ErrorMsg || "Failed to update businesses", {
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
          <div className="flex justify-end flex-wrap my-6">
            {user.role === 1 && (
              <Link
                href="/dashboard/users/add"
                className="bg-primary text-white text-center text-sm rounded-full py-2 px-9 border-8 border-white"
              >
                Add
              </Link>
            )}
          </div>
          <div className="mt-5">
            <DataTable
              title={
                <div className="pt-7">
                  <h1 className="text-2xl font-bold">User Business</h1>

                  <div className="flex justify-between flex-wrap items-center w-full">
                    <select
                      onChange={selectStatus}
                      className="outline-none text-sm border border-gray-300 p-2 pr-4 cursor-pointer"
                    >
                      <option className="cursor-pointer" value="none">
                        Actions
                      </option>
                      {user.role === 1 && (
                        <>
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
              data={users}
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              paginationPerPage={pageSize}
              paginationRowsPerPageOptions={[10, 20, 30, 50]}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handlePageSizeChange}
              onSelectedRowsChange={onSelectRowChange}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Manageuser;
const CustomDropdown = ({ row, onChange }) => {
  const [status, setStatus] = useState(row.deactive || "false");
  const options = [
    { value: true, label: "True", color: "green" },
    { value: false, label: "False", color: "red" },
  ];

  const handleChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    onChange(e, row);
  };

  return (
    <div className="relative inline-block cursor-pointer">
      <select
        value={status}
        onChange={handleChange}
        className={`pl-6 pr-4 py-1 border cursor-pointer rounded-md appearance-none focus:outline-none focus:ring-2 ${
          status == true || status == "true" ? "text-green-500" : "text-red-500"
        } font-bold uppercase`}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className={`text-${option.color}-600 uppercase font-bold cursor-pointer`}
          >
            {option.label}
          </option>
        ))}
      </select>
      <div
        className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full ${
          status == true || status == "true" ? "bg-green-500" : "bg-red-500"
        }`}
      ></div>
    </div>
  );
};
