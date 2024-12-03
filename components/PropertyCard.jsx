'use client';
import { useState } from 'react';
import { Box, Button, Container, Grid, Typography, Paper } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

export default function PropertyCard({ icon, title, items }) {
  const [expanded, setExpanded] = useState(false); // Track expanded state
  const [currentPage, setCurrentPage] = useState(0); // Track the current page of items displayed
  const isSmallScreen = useMediaQuery('(max-width:600px)'); // Small screens
  const isMediumScreen = useMediaQuery('(max-width:1024px)'); // Medium screens
  const isLargeScreen = useMediaQuery('(min-width:1025px)'); // Large screens

  let itemsPerPage = 4; 
  if (isSmallScreen) {
    itemsPerPage = 2; 
  } else if (isMediumScreen) {
    itemsPerPage = 3; 
  }

 
  const displayedItems = items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  // Toggle "See More" state (expand or collapse)
  const handleToggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  // Handle "See More" and "See Less" navigation
  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < items.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
        minHeight: { xs: 180, sm: 250, md: 300 }, // Keep height fixed at 200px for large screens
        borderRadius: { xs: 2, sm: 3 }, // Responsive border radius
        backgroundColor: '#fff',
        maxHeight: expanded ? 'none' : 200, // Expand height if "See More" is clicked
        overflow: 'hidden', // Hide content overflow when collapsed
        transition: 'max-height 0.3s ease', // Smooth transition for expanding/collapsing
        position: 'relative', // For positioning the "See More" button
      }}
    >
      {/* Header with Icon and Title */}
      <Box display="flex" alignItems="center" mb={{ xs: 1, sm: 2 }}>
        {icon && <Box sx={{ mr: 1 }}>{icon}</Box>} {/* Icon next to title */}
        <Typography
          variant={['xs', 'sm'].includes('xs') ? 'h6' : 'h5'} // Font size based on screen size
          fontWeight={700}
          sx={{
            wordBreak: 'break-word', // Prevent long words from breaking layout
            whiteSpace: 'normal', // Allow text wrapping
            overflowWrap: 'break-word',
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Displaying items for the current page */}
      {displayedItems.length > 0 ? (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {displayedItems.map((item, index) => (
            <Grid item xs={12} sm={6} lg={6} key={index}>
              {/* Card Wrapper to ensure uniform height */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#fff',
                  borderRadius: 2,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                }}
              >
                <Button
                  href={`/property/${item.name}`}
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    justifyContent: 'flex-start',
                    padding: { xs: '8px', sm: '10px 12px' },
                    fontSize: { xs: 12, sm: 12, lg: 13 },
                    fontWeight: 500,
                    borderColor: '#f5f5f5',
                    backgroundColor: '#fff',
                    color: '#000',
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word',
                    '&:hover': {
                      backgroundColor: '#a3a0a0',
                      borderColor: '#f5f5f5',
                      transition: 'background-color 0.4s ease, border-color 0.s ease',
                    },
                  }}
                  aria-label={item.name}
                >
                  {item.name}
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            textAlign: 'center',
            mt: 2,
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            overflowWrap: 'break-word',
          }}
        >
          No items available
        </Typography>
      )}

      {/* Navigation buttons for pagination (See More / See Less) */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, white)', // Fade effect to indicate more content
          textAlign: 'center',
          pt: 2,
    
          marginTop: 20,
          
        }}
      >
     {currentPage > 0 && (
  <Button
    onClick={handlePrevPage}
    sx={{
      color: '#00000',
      // backgroundColor: '#25cbd4', // Matching blue background for consistency
      textTransform: 'none',
      marginTop: '8px', // Slight spacing from the Previous button
      borderRadius: '20px', // Rounded, soft corners
      fontSize: '8px', // Consistent font size
      fontWeight: 600, // Medium font weight for better readability
     
      alignItems: 'center',
      justifyContent: 'end', // Center icon and text
    
     
    }}
  >
    <ArrowBackIos  /> {/* Left arrow icon */}
    
  </Button>
)}

{/* "Next" Button */}
{displayedItems.length === itemsPerPage && ( // Show Next only if there are more items
  <Button
    onClick={handleNextPage}
    sx={{
      color: '#00000',
      // backgroundColor: '#25cbd4', // Matching blue background for consistency
      textTransform: 'none',
      marginTop: '8px', // Slight spacing from the Previous button
      borderRadius: '20px', // Rounded, soft corners
      fontSize: '8px', // Consistent font size
      fontWeight: 600, // Medium font weight for better readability
      
      alignItems: 'center',

      justifyContent: 'end', // Center icon and text
      
    }}
  >
   
    <ArrowForwardIos /> {/* Right arrow icon */}
  </Button>
)}
      </Box>
    </Paper>
  );
}
