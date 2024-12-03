import useAuth from "@/hooks/useAuth";
import {
  AdjustmentsHorizontalIcon,
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  CalendarIcon,
  CheckBadgeIcon,
  ChevronLeftIcon,
  Cog6ToothIcon,
  CogIcon,
  DocumentCheckIcon,
  FolderIcon,
  HomeIcon,
  PlusCircleIcon,
  PlusIcon,
  QueueListIcon,
  RectangleStackIcon,
  StarIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";
import MenuDropDown from "./MenuDropDown";
import { useState } from 'react';
// import MenuDropDown2 from "./MenuDropDown2";

const Sidebar = ({ openDrawer, setOpenDrawer }) => {
  const auth = useAuth();

  const [businessSubmenuOpen, setBusinessSubmenuOpen] = useState(false);
  const [categorySubmenuOpen, setCategorySubmenuOpen] = useState(false);
  const [userSubmenuOpen, setUserSubmenuOpen] = useState(false);
  const [reviewSubmenuOpen, setReviewSubmenuOpen] = useState(false);
  const [propertySubmenuOpen, setPropertySubmenuOpen] = useState(false);
  const [typeSubmenuOpen, setTypeSubmenuOpen] = useState(false);
  const [commentSubmenuOpen, setCommentSubmenuOpen] = useState(false);


  return (
    <aside
    className={`absolute lg:fixed w-10 sm:w-14 md:w-16 lg:w-24 duration-300 lg:bg-white h-screen transition-all z-30 ${
      openDrawer && "!w-[320px] !fixed shadow-custom bg-white"
    }`}
  >
    <div
      className={`h-24 flex items-center cursor-pointer px-2 sm:px-4 justify-center ${
        openDrawer === true && "justify-between"
      }`}
    >
      <span
        className={`font-extrabold hidden text-2xl ${
          openDrawer === true && "!inline-block"
        }`}
      >
        Places
      </span>
      <Bars3Icon
        className={`h-6 mt-[-30px] w-6 hover:text-primary ${
          openDrawer === true && "hidden"
        }`}
        onClick={() => setOpenDrawer(!openDrawer)}
      />
      <ChevronLeftIcon
        className={`h-6 w-6 hover:text-primary hidden ${
          openDrawer === true && "!block"
        }`}
        onClick={() => setOpenDrawer(!openDrawer)}
      />
    </div>
    <div
      className={`h-[calc(100vh-96px)] bg-[#3D4962] pt-6 px-4 overflow-y-auto opacity-0 duration-300 lg:opacity-100 ${
        openDrawer && "!opacity-100"
      }`}
    >
        
        {auth.user && auth.user_meta.role === 1 && (
          <>
           
            <Link
              href="/places"
              className={`flex relative  py-3 justify-center items-center ${openDrawer === true && "!justify-normal"
                }`}
            >
              <HomeIcon className={`h-7 w-7 text-primary`} />
              <span
                className={`text-white absolute pointer-events-none left-8 min-w-[300px] transition-all duration-300 text-[15px] pl-3 w-full hover:text-primary opacity-0 ${openDrawer === true && "!opacity-100 pointer-events-auto"
                  }`}
              >
                Welcome Page
              </span>
            </Link>

            <div className="relative">
              <div
                className={`flex ${openDrawer ? "justify-start" : "flex-col items-center"} py-3 cursor-pointer`}
                onClick={() => setUserSubmenuOpen(!userSubmenuOpen)}
              >
                {!openDrawer && <UserIcon className="h-7 w-7 text-primary" />}
                {openDrawer && (
                  <>
                    <UserIcon className="h-8 w-7 text-primary" />
                    <span
                      className={`text-white absolute pointer-events-none left-8 min-w-[300px] transition-all duration-300 text-[15px] pl-3 w-full hover:text-primary opacity-0 ${openDrawer && "!opacity-100 pointer-events-auto"}`}
                    >
                      Users
                    </span>
                  </>
                )}
              </div>

              {/* Submenu for Users */}
              {userSubmenuOpen && (
                <div className={`ml-4 mt-1 bg-gray-800 rounded-md ${openDrawer ? 'w-[150px]' : 'w-[50px]'} p-2 space-y-2`}>
                  <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                    <Link href="/dashboard/users/add" className="flex items-center">
                      <PlusCircleIcon className="h-4 w-4 text-primary mr-1" />
                      {openDrawer && <span>Add User</span>}
                    </Link>
                  </div>
                  <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                    <Link href="/dashboard/users/" className="flex items-center">
                      <CogIcon className="h-4 w-4 text-primary mr-1" />
                      {openDrawer && <span>Manage Users</span>}
                    </Link>
                  </div>
                </div>
              )}
            </div>





            <MenuDropDown
              openDrawer={openDrawer}
              text="Business Directory"
              icon={<FolderIcon className="h-7 w-7 text-primary" />}
            >
              <ul className="max-w-[200px] mx-auto mb-2 space-y-1">
                {/* Business Menu */}
                <li>
                  <div
                    className={`flex ${openDrawer ? "justify-start" : "flex-col items-center"} py-1 cursor-pointer`}
                    onClick={() => setBusinessSubmenuOpen(!businessSubmenuOpen)}
                  >
                    {!openDrawer && <BuildingOfficeIcon className="h-4 w-4 text-primary" />}

                    {openDrawer && <span className="ml-2 text-white">Businesses</span>}
                  </div>

                  {/* Submenu for Business */}
                  {businessSubmenuOpen && (
                    <div className="ml-4 mt-1 bg-gray-800 rounded-md p-2 space-y-1">
                      <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                        <Link href="/business/add" className="flex items-center">
                          <PlusCircleIcon className="h-4 w-4 text-primary mr-1" />
                          {openDrawer && <span>Add Business</span>}
                        </Link>
                      </div>
                      <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                        <Link href="/business/" className="flex items-center">
                          <CogIcon className="h-4 w-4 text-primary mr-1" />
                          {openDrawer && <span>Manage Business</span>}
                        </Link>
                      </div>
                      <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                        <Link href="/business/allbusiness" className="flex items-center">
                          <QueueListIcon className="h-4 w-4 text-primary mr-1" />
                          {openDrawer && <span>All Business</span>}
                        </Link>
                      </div>
                    </div>
                  )}
                </li>

                {/* Categories Menu */}
                <li>
                  <div
                    className={`flex ${openDrawer ? "justify-start" : "flex-col items-center"} py-1 cursor-pointer`}
                    onClick={() => setCategorySubmenuOpen(!categorySubmenuOpen)}
                  >
                    {!openDrawer && <RectangleStackIcon className="h-4 w-4 text-primary" />}
                    {openDrawer && <span className="ml-2 text-white">Categories</span>}
                  </div>

                  {/* Submenu for Categories */}
                  {categorySubmenuOpen && (
                    <div className="ml-4 mt-1 bg-gray-800 rounded-md p-2 space-y-1">
                      <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                        <Link href="/business/categories/add" className="flex items-center">
                          <PlusCircleIcon className="h-4 w-4 text-primary mr-1" />
                          {openDrawer && <span>Add Category</span>}
                        </Link>
                      </div>
                      <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                        <Link href="/business/categories/" className="flex items-center">
                          <CogIcon className="h-4 w-4 text-primary mr-1" />
                          {openDrawer && <span>Manage Categories</span>}
                        </Link>
                      </div>
                      <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                        <Link href="/business/categories/allcategories" className="flex items-center">
                          <ArrowTopRightOnSquareIcon className="h-4 w-4 text-primary mr-1" />
                          {openDrawer && <span>All Categories</span>}
                        </Link>
                      </div>
                    </div>
                  )}
                </li>

                {/* Reviews Menu */}
                <li>
                  <div
                    className={`flex ${openDrawer ? "justify-start" : "flex-col items-center"} py-1 cursor-pointer`}
                    onClick={() => setReviewSubmenuOpen(!reviewSubmenuOpen)}
                  >
                    {!openDrawer && <CheckBadgeIcon className="h-4 w-4 text-primary" />}
                    {openDrawer && <span className="ml-2 text-white">Reviews</span>}
                  </div>

                  {reviewSubmenuOpen && (
                    <div className="ml-4 mt-1 bg-gray-800 rounded-md p-2 space-y-1">
                      <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                        <Link href="/business/reviews/" className="flex items-center">
                          <CogIcon className="h-4 w-4 text-primary mr-1" />
                          {openDrawer && <span>Manage Reviews</span>}
                        </Link>
                      </div>
                      <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                        <Link href="/business/reviews/userreviews" className="flex items-center">
                          <ArrowTopRightOnSquareIcon className="h-4 w-4 text-primary mr-1" />
                          {openDrawer && <span>All Reviews</span>}
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              </ul>
            </MenuDropDown>


            {/* Property Menu */}
            <div className="relative">
              <div
                className={`flex ${openDrawer ? 'justify-start' : 'flex-col items-center'} py-1 cursor-pointer`}
                onClick={() => setBusinessSubmenuOpen(!businessSubmenuOpen)}
              >
                {/* Show icon only when drawer is closed, icon and text when open */}
                {!openDrawer && <BuildingOfficeIcon className="h-7 w-7 text-primary" />}
                {openDrawer && <BuildingOfficeIcon className="h-7 w-7 text-primary" />}
                {openDrawer && <span className="ml-2 text-white">Rent Property</span>}
              </div>
              <ul className={`max-w-[200px] mx-auto mb-2 space-y-1 ${businessSubmenuOpen ? 'block' : 'hidden'}`}>
                {/* Property Submenu */}
                <li>
                  <div
                    className={`flex ${openDrawer ? 'justify-start' : 'flex-col items-center'} py-1 cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPropertySubmenuOpen(!propertySubmenuOpen);
                    }}
                  >
                    {!openDrawer && <BuildingStorefrontIcon className="h-4 w-4 text-primary" />}
                    {openDrawer && <span className="ml-2 text-white">Properties</span>}
                  </div>
                  {propertySubmenuOpen && (
                    <div className="ml-4 mt-1 bg-gray-800 rounded-md p-2 space-y-1">
                      <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                        <Link href="/property/add" className="flex items-center">
                          <PlusIcon className="h-4 w-4 text-primary mr-1" />
                          {openDrawer && <span>Add Property</span>}
                        </Link>
                      </div>
                      <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                        <Link href="/property/" className="flex items-center">
                          <CogIcon className="h-4 w-4 text-primary mr-1" />
                          {openDrawer && <span>Manage Property</span>}
                        </Link>
                      </div>
                      <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                        <Link href="/property/allproperties" className="flex items-center">
                          <QueueListIcon className="h-4 w-4 text-primary mr-1" />
                          {openDrawer && <span>All Properties</span>}
                        </Link>
                      </div>
                    </div>
                  )}
                </li>

                {/* Property Types Submenu */}
                <li>
                  <div
                    className={`flex ${openDrawer ? 'justify-start' : 'flex-col items-center'} py-1 cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTypeSubmenuOpen(!typeSubmenuOpen);
                    }}
                  >
                    {!openDrawer && <AdjustmentsHorizontalIcon className="h-4 w-4 text-primary" />}
                    {openDrawer && <span className="ml-2 text-white">Property Types</span>}
                  </div>
                  {typeSubmenuOpen && (
                    <div className="ml-4 mt-1 bg-gray-800 rounded-md p-2 space-y-1">
                      <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                        <Link href="/property/type/add" className="flex items-center">
                          <PlusIcon className="h-4 w-4 text-primary mr-1" />
                          {openDrawer && <span>Add Type</span>}
                        </Link>
                      </div>

                      <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                        <Link href="/property/amenites/add" className="flex items-center">
                          <PlusCircleIcon className="h-4 w-4 text-primary mr-1" />
                          {openDrawer && <span>Add Amienities</span>}
                        </Link>
                      </div>

                      <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                        <Link href="/property/amenites/" className="flex items-center">
                          <Cog6ToothIcon className="h-4 w-4 text-primary mr-1" />
                          {openDrawer && <span>Manage Ameienities</span>}
                        </Link>
                      </div>


                      <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                        <Link href="/property/type/" className="flex items-center">
                          <CogIcon className="h-4 w-4 text-primary mr-1" />
                          {openDrawer && <span>Manage Types</span>}
                        </Link>
                      </div>
                      <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                        <Link href="/property/type/alltypes" className="flex items-center">
                          <QueueListIcon className="h-4 w-4 text-primary mr-1" />
                          {openDrawer && <span>All Types</span>}
                        </Link>
                      </div>
                    </div>
                  )}
                </li>

                {/* Comments Submenu */}
                <li>
                  <div
                    className={`flex ${openDrawer ? 'justify-start' : 'flex-col items-center'} py-1 cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCommentSubmenuOpen(!commentSubmenuOpen);
                    }}
                  >
                    {!openDrawer && <DocumentCheckIcon className="h-4 w-4 text-primary" />}
                    {openDrawer && <span className="ml-2 text-white">Comments</span>}
                  </div>
                  {commentSubmenuOpen && (
                    <div className="ml-4 mt-1 bg-gray-800 rounded-md p-2 space-y-1">
                      <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                        <Link href="/dashboard/comments/" className="flex items-center">
                          <PlusIcon className="h-4 w-4 text-primary mr-1" />
                          {openDrawer && <span>All Comments</span>}
                        </Link>
                      </div>
                      <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                        <Link href="/dashboard/comment/usercomment" className="flex items-center">
                          <CogIcon className="h-4 w-4 text-primary mr-1" />
                          {openDrawer && <span>Manage Comments</span>}
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              </ul>
            </div>




          </>
        )}

        {auth.user && auth.user_meta.role === 3 && (
          <>

            <Link
              href="/places"
              className={`flex relative  py-3 justify-center items-center ${openDrawer === true && "!justify-normal"
                }`}
            >
              <HomeIcon className={`h-7 w-7 text-primary`} />
              <span
                className={`text-white absolute pointer-events-none left-8 min-w-[300px] transition-all duration-300 text-[15px] pl-3 w-full hover:text-primary opacity-0 ${openDrawer === true && "!opacity-100 pointer-events-auto"
                  }`}
              >
                Welcome Page
              </span>
            </Link>
            <div>
              <div
                // className={`flex ${openDrawer ? "justify-start" : "flex-col items-center"} py-1 cursor-pointer`}
                onClick={() => setBusinessSubmenuOpen(!businessSubmenuOpen)}
              >

                <MenuDropDown
                  openDrawer={openDrawer}
                  text="Business Directory"
                  icon={<FolderIcon className="h-7 w-7 text-primary" />}

                >
                  {!openDrawer}
                  {openDrawer}

                  <ul className="max-w-[200px] mx-auto mb-2 space-y-1">
                    {/* Business Menu */}
                    <li>


                      {/* Submenu for Business */}
                      {businessSubmenuOpen && (
                        <div className="ml-4 mt-1 bg-gray-800 rounded-md p-2 space-y-4">
                          <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                            <Link href="/business/add" className="flex items-center">
                              <PlusCircleIcon className="h-4 w-4 text-primary mr-1" />
                              {openDrawer && <span>Add Business</span>}
                            </Link>
                          </div>
                          <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                            <Link href="/business/" className="flex items-center">
                              <CogIcon className="h-4 w-4 text-primary mr-1" />
                              {openDrawer && <span>Manage Business</span>}
                            </Link>
                          </div>
                          <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                            <Link href="/business/allbusiness" className="flex items-center">
                              <QueueListIcon className="h-4 w-4 text-primary mr-1" />
                              {openDrawer && <span>All Business</span>}
                            </Link>
                          </div>
                          <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                            <Link href="/business/reviews/userreviews" className="flex items-center">
                              <StarIcon className="h-4 w-4 text-primary mr-1" />

                              {openDrawer && <span>My Reviews</span>}
                            </Link>
                          </div>
                          <div className="flex items-center text-xs text-white hover:text-primary cursor-pointer">
                            <Link href="/business/categories/allcategories" className="flex items-center">
                              <ArrowTopRightOnSquareIcon className="h-4 w-4 text-primary mr-1" />
                              {openDrawer && <span>All Categories</span>}
                            </Link>
                          </div>

                        </div>
                      )}
                    </li>


                  </ul>
                </MenuDropDown>
              </div>

            </div>

          </>
        )}

        {auth.user &&
          auth.user_meta.role !== 3 &&
          auth.user_meta.role !== 1 && (
            <>
              <Link
                href="/places"
                className={`flex relative  py-3 justify-center items-center ${openDrawer === true && "!justify-normal"
                  }`}
              >
                <HomeIcon className={`h-7 w-7 text-primary`} />
                <span
                  className={`text-white absolute pointer-events-none left-8 min-w-[300px] transition-all duration-300 text-[15px] pl-3 w-full hover:text-primary opacity-0 ${openDrawer === true && "!opacity-100 pointer-events-auto"
                    }`}
                >
                  Welcome Page
                </span>
              </Link>

              <MenuDropDown
                openDrawer={openDrawer}
                text="Business Directory"
                icon={<FolderIcon className={`h-7 w-7 text-primary`} />}
              >
                <ul className="max-w-[200px] mx-auto mb-2 space-y-1">
                  <li>
                    <Link
                      href="/business/allbusiness"
                      className={`flex relative  py-1 justify-center items-center ${openDrawer === true && "!justify-normal"
                        }`}
                    >
                      <BuildingOfficeIcon className={`h-4 w-4 text-primary`} />
                      <span
                        className={`text-white absolute pointer-events-none left-4 max-w-[300px] transition-all duration-300 text-sm pl-3 w-full hover:text-primary opacity-0 ${openDrawer === true &&
                          "!opacity-100 pointer-events-auto"
                          }`}
                      >
                        Businesses
                      </span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/business/categories/allcategories"
                      className={`flex relative  py-1 justify-center items-center ${openDrawer === true && "!justify-normal"
                        }`}
                    >
                      <RectangleStackIcon className={`h-4 w-4 text-primary`} />
                      <span
                        className={`text-white absolute pointer-events-none left-4 max-w-[300px] transition-all duration-300 text-sm pl-3 w-full hover:text-primary opacity-0 ${openDrawer === true &&
                          "!opacity-100 pointer-events-auto"
                          }`}
                      >
                        Categories
                      </span>
                    </Link>
                  </li>


                </ul>
              </MenuDropDown>


            </>
          )}

        {!auth.user && (
          <>
            <Link
              href="/places"
              className={`flex relative  py-3 justify-center items-center ${openDrawer === true && "!justify-normal"
                }`}
            >
              <HomeIcon className={`h-7 w-7 text-primary`} />
              <span
                className={`text-white absolute pointer-events-none left-8 min-w-[300px] transition-all duration-300 text-[15px] pl-3 w-full hover:text-primary opacity-0 ${openDrawer === true && "!opacity-100 pointer-events-auto"
                  }`}
              >
                Welcome Page
              </span>
            </Link>

            <MenuDropDown
              openDrawer={openDrawer}
              text="Business Directory"
              icon={<FolderIcon className={`h-7 w-7 text-primary`} />}
            >
              <ul className="max-w-[200px] mx-auto mb-2 space-y-1">
                <li>
                  <Link
                    href="/business/allbusiness"
                    className={`flex relative  py-1 justify-center items-center ${openDrawer === true && "!justify-normal"
                      }`}
                  >
                    <BuildingOfficeIcon className={`h-4 w-4 text-primary`} />
                    <span
                      className={`text-white absolute pointer-events-none left-4 max-w-[300px] transition-all duration-300 text-sm pl-3 w-full hover:text-primary opacity-0 ${openDrawer === true &&
                        "!opacity-100 pointer-events-auto"
                        }`}
                    >
                      Businesses
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/business/categories/allcategories"
                    className={`flex relative  py-1 justify-center items-center ${openDrawer === true && "!justify-normal"
                      }`}
                  >
                    <RectangleStackIcon className={`h-4 w-4 text-primary`} />
                    <span
                      className={`text-white absolute pointer-events-none left-4 max-w-[300px] transition-all duration-300 text-sm pl-3 w-full hover:text-primary opacity-0 ${openDrawer === true &&
                        "!opacity-100 pointer-events-auto"
                        }`}
                    >
                      Categories
                    </span>
                  </Link>
                </li>


              </ul>
            </MenuDropDown>




          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
