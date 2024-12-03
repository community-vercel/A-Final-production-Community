'use client';
import {
    Box,
    
    IconButton,
    InputBase,
    Paper,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Image from 'next/image';

import React from "react";

import {
    CitySelect, StateSelect
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

const HeroSection = ({ handleSearch, countryid, setstateid, setSelectedCity, setSelectedState, setZip, stateid, zip,image,title }) => (
  <Box
  sx={{
    position: 'relative',
    height: {
      xs: 500,  // For extra small screens (mobile), height is 300px
      sm: 500,  // For small screens (tablets), height is 400px
      md: 620,  // For medium screens (desktops), height is 560px
      lg: 900,  // For large screens, height is 600px
    },
  }}
>     
        <Image
    src={image}
    alt="Background"
    width={999} 
    height={99}
    layout="responsive"
    priority 
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
    style={{
        objectFit: 'cover',
        filter: 'brightness(0.6)'
    }}
/>
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
            }}
        >
            <Typography variant="h4" fontWeight={700} mb={2}>
{title}            </Typography>
            <Tabs  textColor="white" indicatorColor="primary" sx={{ mb: 2 }}>
                <Tab label="BUY" sx={{ fontWeight: 'bold', fontSize: 16 }} />
                <Tab label="RENT" sx={{ fontWeight: 'bold', fontSize: 16 }} />
                <Tab label="SELL" sx={{ fontWeight: 'bold', fontSize: 16 }} />
            </Tabs>
            <Paper
  component="form"
  onSubmit={handleSearch}
  sx={{
    display: 'flex',
    alignItems: 'center',
    width: '90%',
    maxWidth: 770,
    mt: 0,
    padding: '6px',
    boxShadow: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
  }}
>
  <div
    className="flex flex-wrap gap-4 items-center w-full"
  >
<div className="flex-1 min-w-[250px] max-w-[300px]">
  <StateSelect
    required
    countryid={countryid}
    onChange={(e) => {
      setstateid(e.id);
      setSelectedCity('');
      setSelectedState(e.name);
    }}
    placeHolder="Select State"
    inputClassName="no-border text-sm font-inter w-full"  // Apply no-border class here
    style={{ border: 'none', outline: 'none', boxShadow: 'none' }} // Forcefully remove borders
  />
</div>


    <div className="flex-1 min-w-[250px] max-w-[300px]">
      <CitySelect
        required
        countryid={countryid}
        stateid={stateid}
        onChange={(e) => setSelectedCity(e.name)}
        placeHolder="Select City"
        inputClassName="outline-none shadow-formFeilds text-sm font-inter w-full"
        style={{ border: 'none', outline: 'none', boxShadow: 'none' }} // Forcefully remove borders

      />
    </div>

    <div className="flex-1 min-w-[150px] max-w-[200px]">
      <InputBase
        placeholder="Zip Code"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        sx={{
          ml: 1,
          flex: 1,
        }}
        startAdornment={<LocationOnIcon sx={{ mr: 1 }} />}
        style={{ borderRadius: '5px',height: "40px", border: "1.5px solid #c9ccd0",    borderColor: "#cccccc"}} // Forcefully remove borders

      />
    </div>

    <div className="flex-shrink-0">
      <IconButton
        type="submit"
        sx={{
          width: 40,
          height: 40,
          backgroundColor: 'green',
          color: '#fff',
          '&:hover': { backgroundColor: '#005f00' },
        }}
      >
        <SearchIcon />
      </IconButton>
    </div>
  </div>
</Paper>

        </Box>
    </Box>
);

export default HeroSection;