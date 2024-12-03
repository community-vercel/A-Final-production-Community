import { useEffect, useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { useRouter } from 'next/navigation';
import Scrollbar from "../Scrollbar";
import { FlexBetween } from "../flex-box";
import SidebarAccordion from "./SidebarAccordion";
import {
  NavWrapper,
  NavItemButton,
  ListLabel,
  ListIconWrapper,
  StyledText,
  BadgeValue,
  ExternalLink,
  BulletIcon,
  SidebarWrapper,
} from "./LayoutStyledComponents";
import { superAdminNavigations, navigations, navigation } from "./NavigationList";
import { useSelector } from "react-redux";
import MenuIcon from '@mui/icons-material/Menu';
const TOP_HEADER_AREA = 70;


const DashboardSidebar = ({ showMobileSideBar, setShowMobileSideBar }) => {
  const { user_meta } = useSelector((state) => state.auth);
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Manage mobile menu state
 
  const sidebarRef = useRef(null); // Sidebar reference for detecting clicks outside
  const [openAccordion, setOpenAccordion] = useState(null); // Only one open at a time
  const [activePath, setActivePath] = useState(null); // Track active route
const COMPACT=0;
  useEffect(() => {
    const savedOpenAccordion = localStorage.getItem("openAccordion");
    const savedActivePath = localStorage.getItem("activePath");

    if (savedOpenAccordion) setOpenAccordion(savedOpenAccordion);
    if (savedActivePath) setActivePath(savedActivePath);
  }, []);

  const handleToggleAccordion = (key) => {
    const newOpenAccordion = openAccordion === key ? null : key;
    setOpenAccordion(newOpenAccordion);
    localStorage.setItem("openAccordion", newOpenAccordion);
  };

  const handleNavigation = (path) => {
    router.push(path);
    setShowMobileSideBar(false);
    setActivePath(path);
    localStorage.setItem("activePath", path);
  };

  const renderLevels = (data) => {
    const items = Array.isArray(data) ? data : [];
    return items.map((item, index) => {
      const isActive = activePath === item.path;

      if (item.type === "label") {
        return <ListLabel key={index} compact={COMPACT}>{item.label}</ListLabel>;
      }

      if (item.children) {
        return (
          <SidebarAccordion
            key={item.name}
            item={item}
            sidebarCompact={COMPACT}
            collapsed={openAccordion !== item.name} // Only one accordion open
            onToggle={() => handleToggleAccordion(item.name)} // Toggle the specific accordion
          >
            {renderLevels(item.children)}
          </SidebarAccordion>
        );
      }

      const NavButton = item.type === "extLink" ? ExternalLink : NavItemButton;
console.log("nav ", item.type)
      return (
        <Box key={index}>
          <NavButton
            href={item.path || "#"}
            target={item.type === "extLink" ? "_blank" : undefined}
            rel={item.type === "extLink" ? "noopener noreferrer" : undefined}
            onClick={item.type === "extLink" ? undefined : () => handleNavigation(item.path)}
            active={isActive ? 1 : 0}
          
          >
            {item.icon ? (
              <ListIconWrapper>
                <item.icon />
              </ListIconWrapper>
            ) : (
              <BulletIcon active={isActive} />
            )}
            <StyledText compact={COMPACT}>{item.name}</StyledText>
            {item.badge && <BadgeValue compact={COMPACT}>{item.badge.value}</BadgeValue>}
          </NavButton>
        </Box>
      );
    });
  };
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);
  return (<>
    <IconButton
    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    sx={{
      display: { xs: "block", md: "none" }, // Only on small screens
      position: "absolute",
      top: -5,
      left: 6,
      color: isMobileMenuOpen ? "white" : "inherit",
      zIndex: 1300,
    }}
  >
    <MenuIcon />
  </IconButton>
    <SidebarWrapper ref={sidebarRef} sx={{
          display: { xs: isMobileMenuOpen ? "block" : "none", md: "block" },
        }}>
      <FlexBetween p={2} maxHeight={TOP_HEADER_AREA} justifyContent={COMPACT ? "center" : "space-between"}>
        
        <svg /* SVG for logo */></svg>
      </FlexBetween>
      <Scrollbar
      autoHide
      clickOnTrack={false}
      sx={{
        overflowX: "hidden",
        overflowY:"auto",
        maxHeight: `calc(100vh - ${TOP_HEADER_AREA}px)`,
      }}
    >        <NavWrapper>
          {renderLevels(user_meta.role === 1 ? superAdminNavigations : user_meta.role === 3 ? navigations : navigation)}
        </NavWrapper>
      </Scrollbar>
    </SidebarWrapper>
    </>
  );
};

export default DashboardSidebar;