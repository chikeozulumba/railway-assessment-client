import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
} from "@chakra-ui/react";

type Props = {
  title: string;
  description?: string | React.ReactNode;
  children?: React.ReactNode;
  isOpen: boolean;
  handleOnClose: () => void;
  handleOnTrigger: (value: boolean) => void;
  proceed?: () => void;
  buttonDisabled?: boolean;
} & Partial<ModalProps>;

export function ModalComponent({
  title,
  description,
  children,
  isOpen,
  handleOnClose,
  proceed,
  buttonDisabled,
  ...args
}: Props) {
  return (
    <>
      <Modal {...args} isOpen={isOpen} onClose={handleOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h3>{title}</h3>
            {description && (
              <Text as={"h6"} fontSize={"sm"} fontWeight={300} opacity={"0.7"}>
                {description}
              </Text>
            )}
          </ModalHeader>
          <ModalCloseButton _hover={{ bg: "#F4EAE0" }} />
          <ModalBody>{children}</ModalBody>

          <ModalFooter>
            <Button
              bg="#F4DFC8"
              color={"#000"}
              mr={3}
              onClick={proceed}
              fontSize={"small"}
              fontWeight={600}
              _hover={{
                bg: "#F4EAE0",
              }}
              disabled={buttonDisabled}
            >
              Proceed
            </Button>
            <Button
              onClick={handleOnClose}
              variant="ghost"
              textColor={"#000"}
              fontSize={"small"}
              fontWeight={400}
              _hover={{
                bg: "#F4EAE07F",
              }}
              disabled={buttonDisabled}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
