// const customTheme = extendTheme({
//   components: {
//     Table: {
//       variants: {
//         mytable: {
//           tr: {
//             _odd: {
//               background: "green.500"
//             }
//           }
//         }
//       }
//     }
//   }
// });

import { tableAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style

});

export const tableTheme = defineMultiStyleConfig({
  baseStyle, variants: {
    'custom-theme': {
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
    }
  }
});
