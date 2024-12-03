import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { alpha, Box, ButtonBase, styled } from "@mui/material";
import { Paragraph, Span } from "../Typography";

// ===============================================================
// Sidebar Wrapper
const SidebarWrapper = styled(Box)(({ theme, compact }) => ({
  height: "100vh",
  position: "fixed",
  overflowY:"auto",
  width: compact ? 230 : 280,
  transition: "all .2s ease",
  zIndex: theme.zIndex.drawer,
  color: theme.palette.common.white,
  backgroundColor: "#243557",
  "&:hover": compact && {
    width: 280,
  },
}));

// Navigation Wrapper
const NavWrapper = styled(Box)({
  height: "100%",
  paddingLeft: 16,
  paddingRight: 16,
});


const NavItemButton = styled(ButtonBase)(({ theme, active }) => ({
  height: 44,
  width: "100%",
  borderRadius: 8,
  marginBottom: 4,
  padding: "0 12px 0 16px",
  justifyContent: "flex-start",
  transition: "all 0.15s ease",
  ...(active && {
    color: 'yellow',
    backgroundColor: 'none',
  }),
}));


// List Label
const ListLabel = styled(Paragraph)(({ compact }) => ({
  fontWeight: 600,
  fontSize: "12px",
  marginTop: "20px",
  marginLeft: "15px",
  marginBottom: "10px",
  textTransform: "uppercase",
  transition: "all 0.15s ease",
  ...(compact && {
    opacity: 0,
    width: 0,
  }),
}));


// List Icon Wrapper
const ListIconWrapper = styled(Box)(({ theme }) => ({
  width: 22,
  height: 22,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  marginRight: "0.8rem",
  justifyContent: "center",
}));

const BulletIcon = styled("div")(({ theme, active }) => ({
  width: 3,
  height: 3,
  marginLeft: "10px",
  borderRadius: "50%",
  marginRight: "1.3rem",
  background: active ? 'none' : theme.palette.common.green,
  boxShadow: active
    ? "red"
    : "none",
}));

const BadgeValue = styled(Box)(({ compact }) => ({
  padding: "1px 8px",
  borderRadius: "300px",
  display: compact ? "none" : "unset",
}));


// External Link
const ExternalLink = styled("a")(() => ({
  overflow: "hidden",
  whiteSpace: "pre",
  marginBottom: "8px",
  textDecoration: "none",
}));

// Styled Text
const StyledText = styled(Span)(({ compact }) => ({
  whiteSpace: "nowrap",
  transition: "all 0.15s ease",
}));

// Bullet Icon


const ChevronLeftIcon = styled(ChevronLeft)(({ compact }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  color: "rgba(255, 255, 255, .6)",
  cursor: "pointer",
  padding: 8,
  height: 40,
  width: 40,
  borderRadius: "50%",
  transition: "all 0.3s",
  display: compact ? "none" : "block",
  "&:hover": {
    background: "rgba(255, 255, 255, .05)",
    color: "rgba(255, 255, 255, 1)",
  },
}));

const ChevronRightIcon = styled(ChevronRight)(({ compact }) => ({
  fontSize: 18,
  color: "white",
  transition: "transform 0.3s cubic-bezier(0, 0, 0.2, 1) 0ms",
  ...(compact && {
    display: "none",
    width: 0,
  }),
}));


export {
  ListLabel,
  NavWrapper,
  StyledText,
  BulletIcon,
  BadgeValue,
  ExternalLink,
  NavItemButton,
  SidebarWrapper,
  ListIconWrapper,
  ChevronLeftIcon,
  ChevronRightIcon,
};
