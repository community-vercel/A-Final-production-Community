import { Box, styled } from "@mui/material";
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BadgeValue,
  BulletIcon,
  ChevronRightIcon,
  ListIconWrapper,
  NavItemButton,
  StyledText,
} from "./LayoutStyledComponents";

const NavExpandRoot = styled(Box)(() => ({
  "& .subMenu": {
    padding: 0,
  },
  "& .navItem": {
    background: "transparent",
  },
  "& .expansion-panel": {
    overflow: "hidden",
    transition: "max-height 0.3s cubic-bezier(0, 0, 0.2, 1)",
  },
}));

const SidebarAccordion = ({ item, children, sidebarCompact, collapsed, onToggle }) => {
  const { name, icon, badge } = item;
  const router = useRouter();
  const elementRef = useRef(null);
  const [hasActive, setHasActive] = useState(false);

  useEffect(() => {
    // Check if any child path matches the current route
    setHasActive(item.children.some(child => child.path === router.pathname));
  }, [item.children, router.pathname]);

  return (
    <NavExpandRoot className="subMenu">
      <NavItemButton
        onClick={onToggle}
        active={hasActive ? 1 : 0}
        sx={{ justifyContent: "space-between" }}
      >
        <Box display="flex" alignItems="center">
          {icon && <ListIconWrapper><item.icon /></ListIconWrapper>}
          <StyledText compact={sidebarCompact}>{name}</StyledText>
        </Box>
        {badge && <BadgeValue compact={sidebarCompact}>{badge.value}</BadgeValue>}
        <ChevronRightIcon color="disabled" compact={sidebarCompact} className="accordionArrow" collapsed={collapsed ? 1 : 0} />
      </NavItemButton>
      <div
        ref={elementRef}
        className="expansion-panel"
        style={{ maxHeight: collapsed ? "0px" : `${elementRef.current?.scrollHeight}px` }}
      >
        {children}
      </div>
    </NavExpandRoot>
  );
};

export default SidebarAccordion;

