import { CSSProperties } from "react";
import { FaCaretRight } from "react-icons/fa";
import { Box, Button, Text, VStack } from "@chakra-ui/react"
import Image from "next/image";
import Image404 from "@/images/svgs/404.svg"

type Props = {
  notAvailable?: boolean;
  callback?: () => void;
  explaination?: string;
  topText?: string;
  style?: CSSProperties
}

export const ErrorComponent = (props: Props) => {
  return <VStack py={10} style={props.style}>
    <Text as={'h1'} fontSize={'30px'} fontWeight={700}>{props.topText || 'Not Found'}</Text>
    <Image src={Image404} height={300} alt="404 image" />
    <Text mt={4} as={'h1'}>{props.explaination || 'The resource you are looking for is currently unavailable.'}</Text>
    <div style={{}}></div>
    <Button
      w={"fit-content"}
      px={4} mt={4}
      size={{ base: "sm" }}
      fontSize={{ base: "12px" }}
      rightIcon={<FaCaretRight style={{ color: "#000" }} />}
      borderRadius={"12px"}
      background={"#F4DFC8"}
      _hover={{
        background: "#F4EAE0",
      }}
      onClick={() => props.callback?.()}
    >
      <Text color={"#000"} fontWeight={"medium"}>
        Return to homepage
      </Text>
    </Button>
  </VStack>
}