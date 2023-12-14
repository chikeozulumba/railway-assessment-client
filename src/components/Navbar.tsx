"use client";

import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  LinkBox,
  Container,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { useAuthStore } from "@/store/auth";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export function NavigationBar() {
  const { state: user } = useAuthStore();
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <>
      <Box bg={"#fff"} boxShadow="xs">
        <Container maxW="1024px" px={4}>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <Link
              href={"/"}
              textDecoration={"none"}
              _hover={{ textDecoration: "none" }}
              color={"#000"}
              fontWeight={800}
            >
              RunThrough
            </Link>

            <Flex alignItems={"center"}>
              <Stack direction={"row"} spacing={7}>
                <Menu size={"sm"}>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar size={"sm"} src={(user?.data as any)?.avatarUrl} />
                  </MenuButton>
                  <MenuList alignItems={"center"}>
                    <MenuItem>
                      <Link
                        href={"/profile"}
                        width={"100%"}
                        textDecoration={"none"}
                        _hover={{ textDecoration: "none" }}
                        fontSize={"small"}
                      >
                        Profile
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href={"/settings"}
                        width={"100%"}
                        textDecoration={"none"}
                        _hover={{ textDecoration: "none" }}
                        fontSize={"small"}
                      >
                        Settings
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={() => signOut(() => router.push("/login"))} fontSize={"small"}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Stack>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </>
  );
}
