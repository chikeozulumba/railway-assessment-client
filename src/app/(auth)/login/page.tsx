"use client";

import { Center, Stack } from "@chakra-ui/react";
import { SignIn } from "@clerk/nextjs";


export default function Login() {
  return (
    <Center id="login" minHeight={"100vh"} height={"100%"}>
      <Stack spacing={4} align={"center"} maxW={"xs"} w={"full"}>
        <SignIn />;
      </Stack>
    </Center>
  );
}
