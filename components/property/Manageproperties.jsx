"use client";
import SubHeaderComponent from "@/components/datatable-components/SubHeaderComponent";
import Loader from "@/components/Loader";
import {

  PencilIcon,
  TrashIcon,
  EyeIcon
} from "@heroicons/react/16/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import {toast } from "react-toastify";
import style from '@/components/style.css';
import Breadcrumb from "../BreadCrum";

const Manageproperties = () => {
  const router = useRouter();
  const { user, user_meta } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [selectedRowsState, setSelectedRows] = useState(false);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const serverurl=process.env.NEXT_PUBLIC_DJANGO_URL
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [perPage, setPerPage] = useState(10); // Items per page

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
      name: "Location",
      selector: (row) => row.location,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
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
               href={`/property/types/${row.slug}`}
               className="underline mr-4"  // Add margin-right for spacing
          >
            <EyeIcon className="w-5 h-5" />
          </Link>
    
      
{(user.role === 1 || user.role === '1' || user.id === row.user_id) && (
  <>
    {/* Edit property */}
    <Link
      href={`/property/update/${row.slug}`}
      className="underline mr-4"  // Add margin-right for spacing
    >
      <PencilIcon className="w-5 h-5" />
    </Link>

    {/* Delete property */}
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
    }
    
    
    
  ];
  const [properties, setProperties] = useState([]);
  const [filteredData, setFilteredData] = useState(properties);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    // Filter the business data based on filterText
    setFilteredData(
        properties.filter((item) =>
        item.name.toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [filterText, properties]); // Re-run filtering whenever filterText or business changes

  const filteredItems = Array.isArray(properties)
  ? properties.filter(
      (item) =>
        (item.name &&
          item.name.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.city &&
          item.city.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.state &&
          item.state.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.price &&
          item.price.toLowerCase().includes(filterText.toLowerCase()))
    )
  : [];

  const handleDelete = async (id) => {



    try {
      const response = await fetch(`${serverurl}archive-property/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });
  
      const result = await response.json();
      if (response.ok){
      
        getProperties(page);
        setToggleClearRows(!toggledClearRows)
        toast.success('Deleted Sucessfully');
      } else {
        toast.error(result.ErrorMsg || 'Failed to update propertyes');
      }
      
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (!user || !user.id) {
        router.push("/property/home");
        return;
      }
    getProperties();
  }, [page, perPage,user]);

  const getProperties  = async () => {
    setLoading(true);
    try{
      let response;
      const headers = { 'Content-Type': 'application/json' };
      const url = user.role === '3' || user.role === 3
        ? `${serverurl}get-userproperties/?page=${page}&per_page=${perPage}`
        : `${serverurl}get-allproperties/?page=${page}&per_page=${perPage}`;
      
      const options = {
        method: user.role === '3' ||user.role === 3 ? 'POST' : 'GET',
        headers,
        ...(user.role === '3' || user.role === 3  && { body: JSON.stringify({ user_id: user.id }) })
      };

      response = await fetch(url, options);
   
      const result = await response.json();
      
      if (response.ok) {
        setProperties(result.data);
        setTotalItems(result.pagination.total_items); // Set total count for pagination
      } else {
        console.error(result.ErrorMsg || 'Failed to fetch properties');
      }
    } catch (error) {
      console.error('An unexpected error occurred', error);
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
  const handleRowClick = (row) => {
    router.push(`/property/update/${row.slug}`); // Navigate to the business details page
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
    
  
        const response = await fetch(`${serverurl}update-property/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateArray),
        });
  
        const result = await response.json();
        if (result.ErrorCode===0) {
     
          getProperties(page);
          setToggleClearRows(!toggledClearRows)
          toast.success('Updated');
        } else {
          toast.error(result.ErrorMsg || 'Failed to update Propertyes');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "All Properties", href: "/property/" },

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
          
          <div className="flex justify-end flex-wrap my-6">

            {user.role&&
            (
              <Link
              href="/property/add"
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
          <h1 className="text-2xl font-bold">Properties</h1>
          <div className="flex justify-between flex-wrap items-center w-full">
            <select onChange={selectStatus} className="outline-none text-sm border border-gray-300 p-2 pr-4 cursor-pointer">
              <option value="none">Actions</option>
              {user_meta.role === 1 && (
                <>
                  <option value="featured">Featured</option>
                  <option value="unfeatured">Unfeatured</option>
                  <option value="approve">Approve</option>
                  <option value="pending">Pending</option>
                  <option value="reject">Reject</option>
                  <option value="delete">Delete</option>
                </>
              )}
              {user.role === 3 && <option value="delete">Delete</option>}
            </select>
            <SubHeaderComponent filterText={filterText} setFilterText={setFilterText} />
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
      )}
      
    </>
  );
};

export default Manageproperties;
