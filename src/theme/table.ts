import { tableAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  tbody: {
    tr: {
      _odd: {
        background: "#FAF6F0",
        _hover: {
          background: '#F4EAE0',
        }
      },
      _even: {
        _hover: {
          background: 'RGBA(255, 255, 255, 0.92)',
        }
      },
    }
  }
});

export const tableTheme = defineMultiStyleConfig({ baseStyle });
