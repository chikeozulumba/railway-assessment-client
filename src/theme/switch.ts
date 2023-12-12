import { switchAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(switchAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  container: {
    // ...
  },
  thumb: {
    bg: "#000",
    _checked: {
      opacity: 0.8
    }
  },
  track: {
    bg: "gray.200",
    _checked: {
      bg: "#F4DFC8",
    },
  },
});

export const switchTheme = defineMultiStyleConfig({ baseStyle });
