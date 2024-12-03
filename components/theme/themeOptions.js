import { components } from "./components";
import { blue, marron, paste, primary, themeColors } from "./themeColors";
import { typography } from "./typography";

// Define the THEMES object
const THEMES = {
  DEFAULT:"DEFAULT",
  GIFT: "GIFT",
  HEALTH: "HEALTH",
  DEFAULT: "DEFAULT",
  GROCERY: "GROCERY",
  FURNITURE: "FURNITURE",
};

// Define breakpoints
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

// Define the theme options for different themes
const themesOptions = {
  [THEMES.DEFAULT]: {
    typography,
    breakpoints,
    components: { ...components },
    palette: {
      primary: { ...primary, light: primary[100] },
      ...themeColors,
    },
  },
  [THEMES.GROCERY]: {
    typography,
    breakpoints,
    components: { ...components },
    palette: {
      primary: { ...primary, light: primary[100] },
      ...themeColors,
    },
  },
  [THEMES.FURNITURE]: {
    typography,
    breakpoints,
    components: { ...components },
    palette: {
      primary: { ...paste, light: paste[100] },
      ...themeColors,
    },
  },
  [THEMES.HEALTH]: {
    typography,
    breakpoints,
    components: { ...components },
    palette: {
      primary: { ...blue, light: blue[100] },
      ...themeColors,
    },
  },
  [THEMES.GIFT]: {
    typography,
    breakpoints,
    components: { ...components },
    palette: {
      primary: { ...marron, light: marron[100] },
      ...themeColors,
    },
  },
};

// Export the theme options
export default themesOptions;
