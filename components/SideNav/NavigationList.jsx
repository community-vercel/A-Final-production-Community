import duotone from "../icons/duotone";
import PackageBox from "../icons/PackageBox";
import Home from "../icons/Home";

import { Event, Settings, WorkHistoryTwoTone } from "@mui/icons-material";
import { BuildingOfficeIcon } from "@heroicons/react/24/solid";
export const navigation= [
  {
    type: "label",
    label: "Welcome",



  },
  {
    name: "Home",
    icon: Home,
    path: "/",

    
    },
  
  {
    name: "Business Directory",
    icon: PackageBox,
    children: [
    
      {
        name: "Business Directory",
      
        path: "/business/home",
    
        
        },
      
      {
        name: "All Business",
        path: "/business/allbusiness",
      },
      {
        name: "All Categories",
        path: "/business/allcategories",
      },
    ],
  },

 
  
  {
    name: "Rent Property",
    icon:  BuildingOfficeIcon,
    children: [
      {
        name: "Rent Property",
        path: "/property/home",
      },
    
      {
        name: "All properties",
        path: "/property/allproperties",
      },
     
    ],
  },
  
  {
    name: "Job Portal",
    icon: WorkHistoryTwoTone,

    children: [
      {
        name: "Jobs",
        path: "/jobs/home",
      },
    
   
    
  
    ],
  },
  {
    name: "Event Portal",
    icon: Event,

    children: [
      {
        name: "Events",
        path: "/events/home",
      },
    
    
      
     
      // {
      //   name: "All jobs",
      //   path: "/jobs/alljobs",
      // },
    
  
    ],
  },
  
];

export const navigations = [
  {
    type: "label",
    label: "User",
    icon: Home,

  },
  {
    name: "Home",
    icon: Home,
    path: "/",

    
    },
  {
    name: "Business Directory",
    icon: PackageBox,
    children: [
      {
        name: "Business Directory",
    
        path: "/business/home",
    
        
        },
      {
        name: "Add Business",
        path: "/business/add",
      },
      {
        name: "Manage Business",
        path: "/business/",
      },
      {
        name: "All Business",
        path: "/business/allbusiness",
      },
      {
        name: "All Categories",
        path: "/business/allcategories",
      },
      {
        name: "My Reviews",
        path: "/business/reviews/userreviews",
      },
    ],
  },

 
  
  {
    name: "Rent Property",
    icon:  BuildingOfficeIcon,

    children: [
      {
        name: "Rent Property",
        path: "/property/home",
      },
      {
        name: "Add Property",
        path: "/property/add",
      },
      {
        name: "Manage Property",
        path: "/property",
      },
      {
        name: "All Properties",
        path: "/property/allproperties",
      },
    ],
  },
  {
    name: "Job Portal",
    icon: WorkHistoryTwoTone,

    children: [
      {
        name: "Jobs",
        path: "/jobs/home",
      },
    
      {
        name: "Add job",
        path: "/jobs/add",
      },
      {
        name: "Manage jobs",
        path: "/jobs",
      },
      // {
      //   name: "All jobs",
      //   path: "/jobs/alljobs",
      // },
    
  
    ],
  },
  {
    name: "Event Portal",
    icon: Event,

    children: [
      {
        name: "Events",
        path: "/events/home",
      },
    
      {
        name: "Add Event",
        path: "/events/add",
      },
   
      {
        name: "Manage Events",
        path: "/events/",
      },
     
   
      {
        name: "Manage Payments",
        path: "/events/payment",
      }
     
      // {
      //   name: "All jobs",
      //   path: "/jobs/alljobs",
      // },
    
  
    ],
  },
 
];

export const superAdminNavigations = [
  {
    type: "label",
    label: "Super Admin",
  },
  {
    name: "Home",
    icon: Home,
    path: "/",

    
    },
  {
    name: "Users",
    icon: duotone.Customers,
    children: [
      
      {
        name: "Add User",
        path: "/dashboard/users/add",
      },
      {
        name: "Manage Users",
        path: "/dashboard/users",
      },
      {
        name: "View User History",
        path: "/dashboard/users/history",
      },
    ],
  },
  {
    name: "Business Directory",
    icon: PackageBox,
    children: [
      {
        name: "Business Directory",
        path: "/business/home",
    
        
        },
    
      {
        name: "Add Business",
        path: "/business/add",
      },
      {
        name: "Manage Business",
        path: "/business/",
      },
      {
        name: "All Business",
        path: "/business/allbusiness",
      },
      {
        name: "Add Category",
        path: "/business/categories/add",
      },

      {
        name: "Manage Categories",
        path: "/business/categories/",
      },
      {
        name: "Add Sub Category",
        path: "/business/categories/subcategories/add",
      },
      {
        name: "Manage Sub Categories",
        path: "/business/categories/subcategories",
      },
      {
        name: "All Categories",
        path: "/business/allcategories",
      },
      {
        name: "Manage Reviews",
        path: "/business/reviews",
      },
      {
        name: "All Reviews",
        path: "/business/reviews/userreviews",
      },
      {
        name: "View Business History",
        path: "/business/history",
      },
    ],
  },

 
  {
    name: "Rent Property",
    icon:  BuildingOfficeIcon,

    children: [
      {
        name: "Rent Property",
        path: "/property/home",
      },
    
      {
        name: "Add Property",
        path: "/property/add",
      },
      {
        name: "Manage Property",
        path: "/property",
      },
      {
        name: "All Properties",
        path: "/property/allproperties",
      },
    
        {
        name: "Add Type",
        path: "/property/type/add",
      },
     
     
      {
        name: "Manage Types",
        path: "/property/type",
      }, 
      {
        name: "Add Amenities",
        path: "/property/amenites/add",
      },
      {
        name: "Manage Amenities",
        path: "/property/amenites",
      },
      
      {
        name: "View Property History",
        path: "/property/history",
      },
    ],
  },
  {
    name: "Job Portal",
    icon: WorkHistoryTwoTone,

    children: [
      {
        name: "Jobs",
        path: "/jobs/home",
      },
    
      {
        name: "Add job",
        path: "/jobs/add",
      },
      {
        name: "Manage jobs",
        path: "/jobs",
      },
      // {
      //   name: "All jobs",
      //   path: "/jobs/alljobs",
      // },
    
  
    ],
  },
 
  {
    name: "Event Portal",
    icon: Event,

    children: [
      {
        name: "Events",
        path: "/events/home",
      },
    
      {
        name: "Add Event",
        path: "/events/add",
      },
   
      {
        name: "Manage Events",
        path: "/events/",
      },
     
      {
        name: "Add Category",
        path: "/events/category/add",
      },
      {
        name: "Manage Categories",
        path: "/events/category",
      },
      {
        name: "Manage Payments",
        path: "/events/payment",
      }
     
      // {
      //   name: "All jobs",
      //   path: "/jobs/alljobs",
      // },
    
  
    ],
  },
  {
    name: "Settings",
    icon: Settings,

    children: [
      {
        name: "Manage Settings",
        path: "/dashboard/settings",
      },
    
     
      // {
      //   name: "All jobs",
      //   path: "/jobs/alljobs",
      // },
    
  
    ],
  },
 
];
