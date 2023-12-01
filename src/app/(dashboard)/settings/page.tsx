"use client";

import { Input, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { ModalComponent } from "@/components/Modal";
import { useSearchParams } from "next/navigation";
import { Link } from "@chakra-ui/next-js";

export default function Settings() {
  const searchParams = useSearchParams();
  const { isOpen, onOpen, onClose } = useDisclosure({
    isOpen: searchParams.get("mode") === "token",
  });

  return (
    <div>
      <ModalComponent
        title="Connect Railway"
        description={
          <Text>
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
        isCentered
      >
        <Stack spacing={4}>
          <Input
            placeholder="medium size"
            size="md"
            _focusVisible={{ borderColor: "#000", borderWidth: 1.5 }}
          />
        </Stack>
      </ModalComponent>
    </div>
  );
}
