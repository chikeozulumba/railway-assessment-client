import {
  FormLabel,
  VStack,
  Input,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { ModalComponent } from "@/components/Modal";

type Props = {
  onOpen: () => void;
  onClose: () => void;
  handleSubmit: () => void;
  setNameState: (value: string) => void;
  setTokenState: (value: string) => void;
  nameState: string | undefined;
  tokenState: string | undefined;
  isOpen: boolean;
  buttonDisabled?: boolean;
};

export const AddRailwayTokenComponent = (props: Props) => {
  const {
    isOpen,
    onOpen,
    onClose,
    handleSubmit,
    setNameState,
    setTokenState,
    nameState,
    tokenState,
    buttonDisabled,
  } = props;

  return (
    <ModalComponent
      title="Connect Railway"
      description={
        <Text fontWeight={400}>
          Connect your railway account by providing your{" "}
          <Link
            textDecoration={"underline"}
            _hover={{ opacity: 0.9 }}
            href={"https://railway.app/account/tokens"}
            target={"_blank"}
          >
            Railway API secret token
          </Link>{" "}
          .
        </Text>
      }
      handleOnTrigger={onOpen}
      isOpen={isOpen}
      handleOnClose={onClose}
      proceed={handleSubmit}
      isCentered
    >
      <Stack spacing={4}>
        <VStack alignItems={"start"} spacing={-2}>
          <FormLabel fontSize={"small"} mb={0}>
            Name
          </FormLabel>
          <Input
            placeholder="Token name (optional)"
            size="md"
            defaultValue={nameState}
            onChange={(e) => setNameState(e.target.value)}
            _focusVisible={{ borderColor: "#000", borderWidth: 1.5 }}
          />
        </VStack>

        <VStack alignItems={"start"} spacing={-2}>
          <FormLabel fontSize={"small"} mb={0}>
            Value
          </FormLabel>
          <Input
            placeholder="API Secret token"
            size="md"
            defaultValue={tokenState}
            onChange={(e) => setTokenState(e.target.value)}
            _focusVisible={{ borderColor: "#000", borderWidth: 1.5 }}
          />
        </VStack>
      </Stack>
    </ModalComponent>
  );
};
