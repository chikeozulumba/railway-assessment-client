"use client";

import { useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ApolloError, useMutation } from "@apollo/client";
import {
  HStack,
  Text,
  useDisclosure,
  Button,
  VStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Code,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { FaCaretRight } from "react-icons/fa";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  CONNECT_RAILWAY_ACCOUNT_MUTATION,
  REMOVE_RAILWAY_TOKEN_MUTATION,
} from "@/graphql/mutations";
import { Toast } from "@/lib/toast";
import { useAuthStore } from "@/store/auth";
import { useTokenStore } from "@/store/token";
import { GET_PROFILE_AND_RAILWAY_TOKENS } from "@/graphql/queries";
import { AddRailwayTokenComponent } from "./components/AddRailwayToken";

dayjs.extend(localizedFormat);

export default function Settings() {
  const { state: railwayTokens } = useTokenStore();
  const [connectRailwayAccount, { loading }] = useMutation(
    CONNECT_RAILWAY_ACCOUNT_MUTATION,
    {
      refetchQueries: [{ query: GET_PROFILE_AND_RAILWAY_TOKENS }],
    }
  );

  const [removeRailwayToken] = useMutation(REMOVE_RAILWAY_TOKEN_MUTATION, {
    refetchQueries: [{ query: GET_PROFILE_AND_RAILWAY_TOKENS }],
  });

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state: authState, setAuthState } = useAuthStore();

  const shouldBeOpen = searchParams.get("mode") === "token";
  const [toggleModal, setToggleModal] = useState(shouldBeOpen);
  const { isOpen, onOpen, onClose } = useDisclosure({
    isOpen: toggleModal,
    onClose() {
      setNameState(undefined);
      setTokenState(undefined);
      setToggleModal(false);
    },
    onOpen() {
      setToggleModal(true);
    },
  });

  const [tokenState, setTokenState] = useState<string | undefined>();
  const [nameState, setNameState] = useState<string | undefined>();

  async function handleSubmit() {
    if (loading) return;
    if (!tokenState)
      return Toast("Invalid API secret token provided.", {
        time: 3,
        type: "error",
      });
    try {
      const response = await connectRailwayAccount({
        variables: { payload: { token: tokenState, name: nameState } },
      });

      setAuthState({
        ...authState,
        data: { ...authState.data, ...response.data.connectRailwayAccount },
      });

      router.replace(pathname);
      onClose();
    } catch (error) {
      if (error instanceof ApolloError) {
        Toast(error.message, { type: "error", time: 4 });
        return;
      }
    }
  }

  const deleteRailwayToken = async (id: string, name?: string) => {
    const tokenName = name || "remove";
    const entry = window.prompt(
      `Warning - This action cannot be reversed\nType "${tokenName}" to continue.`
    );

    const warnUser = tokenName.toLowerCase() === entry?.toLowerCase();
    if (!warnUser) return;

    try {
      const response = await removeRailwayToken({ variables: { id } });
      console.log(response);
    } catch (error) {
      if (error instanceof ApolloError) {
        Toast(error.message, { type: "error", time: 4 });
        return;
      }
    }
  };

  return (
    <VStack gap={8} justifyContent={"start"}>
      <HStack width={"100%"} justifyContent={"space-between"}>
        <Text
          fontSize={{ base: "2xl", sm: "18px", md: "24px" }}
          fontWeight={600}
        >
          Settings
        </Text>
        <Button
          w={"fit-content"}
          size={{ base: "sm" }}
          fontSize={{ base: "12px" }}
          rightIcon={<FaCaretRight style={{ color: "#000" }} />}
          borderRadius={"12px"}
          background={"#F4DFC8"}
          _hover={{
            background: "#F4EAE0",
          }}
          onClick={() => setToggleModal(!toggleModal)}
        >
          <Text color={"#000"} fontWeight={"medium"}>
            Add New Railway Token
          </Text>
        </Button>
      </HStack>

      <Box textAlign={"left"} width={"100%"}>
        <Text fontSize={{ base: "16px" }} fontWeight={500}>
          Manage Railway API Tokens
        </Text>
        <Text fontSize={{ base: "14px" }} fontWeight={300} opacity={'0.7'}>
          Programmatically access your Railway account using these API tokens/secrets.
          <Link
            target="_blank"
            href={"https://docs.railway.app/reference/public-api"}
            textDecoration={"underline"}
          >
            Read more about API tokens in Railway docs.
          </Link>
        </Text>
      </Box>

      {/* Display tokens */}
      {railwayTokens.length > 0 && (
        <TableContainer width={"100%"} bg={"white"} borderRadius={"12px"}>
          <Table variant="simple" size={"md"}>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Value</Th>
                <Th>Date Added</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {railwayTokens.map((token, i) => (
                <Tr key={token.id + i}>
                  <Td fontSize={14}>{token.name}</Td>
                  <Td>
                    <Code fontSize={14} bg={"transparent"}>
                      {token.value}
                    </Code>
                  </Td>
                  <Td>
                    <Text fontSize={12}>
                      {dayjs(token.createdAt).format("LLLL")}
                    </Text>
                  </Td>
                  <Td>
                    <IconButton
                      onClick={() => deleteRailwayToken(token.id, token.name)}
                      variant="outline"
                      colorScheme="gray"
                      aria-label="Delete token"
                      fontSize="12px"
                      size={"sm"}
                      _groupHover={{
                        color: "red",
                      }}
                      icon={<TrashIcon height={14} />}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      <AddRailwayTokenComponent
        onOpen={onOpen}
        onClose={onClose}
        handleSubmit={handleSubmit}
        setNameState={setNameState}
        setTokenState={setTokenState}
        nameState={nameState}
        tokenState={tokenState}
        isOpen={isOpen}
        buttonDisabled={loading}
      />
    </VStack>
  );
}
