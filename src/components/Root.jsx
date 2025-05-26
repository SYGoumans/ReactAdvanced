import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Box } from "@chakra-ui/react";

export const Root = () => {
  return (
    <Box
      minHeight="100vh"
      backgroundImage="url('/images/art.jpg')"
      backgroundSize="cover"
      backgroundPosition="fix"
      position="relative"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        bg="whiteAlpha.600"
        zIndex={0}
      />

      <Box position="relative" zIndex={1}>
        <Navigation />
        <Outlet />
      </Box>
    </Box>
  );
};
