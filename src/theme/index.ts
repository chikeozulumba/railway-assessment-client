import { extendTheme } from "@chakra-ui/react";
import { switchTheme } from "./switch";
import { tableTheme } from "./table";

export const theme = extendTheme({
  components: { Switch: switchTheme, Table: tableTheme },
});
