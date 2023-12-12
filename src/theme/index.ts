import { extendTheme } from "@chakra-ui/react";
import { switchTheme } from "./switch";

export const theme = extendTheme({
  components: { Switch: switchTheme },
});
