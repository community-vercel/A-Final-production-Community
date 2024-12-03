import React from "react";
import { Box } from "@mui/material";

const Scrollbar = ({ children, sx, ...props }) => {
  return (
    <Box
      sx={{
        overflow: "auto",
    scrollbarWidth: "none", // Hide the scrollbar for firefox
    '&::-webkit-scrollbar': {
        display: 'none', // Hide the scrollbar for WebKit browsers (Chrome, Safari, Edge, etc.)
    },
    '&-ms-overflow-style:': {
        display: 'none', // Hide the scrollbar for IE
    },
        
        ...sx, // Allow additional styles to be applied dynamically
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default Scrollbar;
