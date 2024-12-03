'use client';
import React, { useMemo , useState } from "react";
import { Box, CssBaseline, styled} from "@mui/material";
import DashboardSidebar from "@/components/SideNav/DashboardSidebar"; // Update path as needed
import Header from "@/components/Header"; // Update path as needed
import { useSelector } from "react-redux";

const InnerWrapper = styled(Box)(({ theme }) => ({
  display: "flex", 
  flexDirection: "row",
  width: "100vw",
  height: "100vh", 
  padding: 0, 
  maxWidth: 2120, 
  margin:"0 auto",
}));


const SidebarWrapper = styled(Box)(({ theme }) => ({
  minWidth: 270, 
  maxWidth: 280, 
  transition: "width 0.3s", 
  [theme.breakpoints.down("md")]: { 
    minWidth: 0, 
    maxWidth: 40,
  },
}));

const ContentArea = styled(Box)(({ theme }) => ({
  flexGrow: 1, 
  padding: theme.spacing(2), 
  overflowY: "auto", 
  // minHeight: "calc(100vh - 64px)", 
  // margin: "0 auto", 
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(1),
  }, 
  [theme.breakpoints.up("xl")]: {
  margin: "0 auto", 
  },
}));

const Main = ({ children }) => {
  const [sidebarCompact, setSidebarCompact] = useState(false);
  const [showMobileSideBar, setShowMobileSideBar] = useState(false);
  const { user_meta } = useSelector((state) => state.auth);


  const handleCompactToggle = () => setSidebarCompact((prev) => !prev);
  const handleMobileDrawerToggle = () => setShowMobileSideBar((prev) => !prev);
  const sessionValue = useMemo(() => user_meta || [], [user_meta]);

  return (
    <>
      <CssBaseline />
      <InnerWrapper>
        <SidebarWrapper>
          <DashboardSidebar
            aria-label="Main Sidebar"

            sidebarCompact={sidebarCompact}
            showMobileSideBar={showMobileSideBar}
            setSidebarCompact={handleCompactToggle}
            setShowMobileSideBar={handleMobileDrawerToggle}
          />
        </SidebarWrapper>
        <ContentArea>
          <Header onMenuClick={handleMobileDrawerToggle} />
          {children}
        </ContentArea>
      </InnerWrapper>
      </>
  );
};

export default Main;
