import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    customGreen: {
      900: "#122f3b",
      700: "#12434c",
      500: "#126165",
      300: "#148985",
      100: "#1dc0af",
    },
    customGray: {
      900: "#0c0c10",
      700: "#201f23",
      500: "#35333a",
      300: "#504b55",
      100: "#706874",
    },
  },

  components: {
    Button: {
      variants: {
        solid: (props) => ({
          bg:
            props.colorScheme === "customGreen" ? "customGreen.700" : undefined,
          color: "white",
          _hover: {
            bg:
              props.colorScheme === "customGreen"
                ? "customGreen.900"
                : undefined,
          },
          _active: {
            bg:
              props.colorScheme === "customGreen"
                ? "customGreen.700"
                : undefined,
          },
        }),
      },
    },
  },
});

export default theme;
