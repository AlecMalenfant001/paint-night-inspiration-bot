import { useMediaQuery, useTheme } from "@mui/material";
/*This script is used to determine the current breakpoint of the 
scrren size. Most components do NOT have to use this script because
they support respoinseive breakpoints directly, but the ImageList component
from material UI does not. You can find the usage of this in image-grid.jsx */

const useBreakpoint = () => {
  const theme = useTheme();
  const breakpoints = theme.breakpoints.keys;
  const matchingBreakpoint = breakpoints.filter((key) =>
    useMediaQuery(theme.breakpoints.only(key))
  );

  return matchingBreakpoint;
};

export default useBreakpoint;
