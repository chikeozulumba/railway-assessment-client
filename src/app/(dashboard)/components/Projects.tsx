"use client";

import {
  Box,
  Grid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Text,
  useBreakpoint,
  HStack,
  Spacer,
  List,
  ListItem,
  Button,
  VStack,
  Tooltip,
  Divider,
} from "@chakra-ui/react";
import { FaCaretRight } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { Link } from "@chakra-ui/next-js";
import { useUser } from "@clerk/nextjs";
import { dateFormatter } from "@/utils/date";
import { NORMAL_TEXT_COLOR } from "@/constants";

import type { Project } from "@/@types/project";
import { DocumentPlusIcon, TrashIcon } from "@heroicons/react/24/outline";

type Props = {
  projects: Project[];
};

function defineGridSize(size: string, length: number = 0) {
  switch (size) {
    case "base":
    case "sm":
      return 1;
    default:
      if (length && length >= 3) return 3
      return 2;
  }
}

export const DashboardProjects = ({ projects }: Props) => {
  const breakpoint = useBreakpoint();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <VStack width={"100%"}>
        <HStack w={'100%'}>
          <Box width={"100%"}>
            <Text fontSize={{ base: "16px" }} fontWeight={600}>
              Your Projects
            </Text>
            <Text fontSize={{ base: "14px" }} fontWeight={400}>
              Effortlessly streamline and elevate your projects performance on
              Railway using RunThrough.
            </Text>
          </Box>

          <Spacer />

          <Button
            w={"fit-content"}
            px={4}
            size={{ base: "sm" }}
            fontSize={{ base: "12px" }}
            rightIcon={<FaCaretRight style={{ color: "#000" }} />}
            borderRadius={"12px"}
            background={"#F4DFC8"}
            _hover={{
              background: "#F4EAE0",
            }}
            onClick={() => router.push(pathname + "?action=new-project")}
          >
            <Text color={"#000"} fontWeight={"medium"}>
              Create project
            </Text>
          </Button>
        </HStack>
      </VStack>

      <Grid
        templateColumns={`repeat(${defineGridSize(breakpoint, projects?.length)}, 1fr)`}
        gap={6}
        width={"100%"}
      >
        {projects.map((project) => {
          const services = project.services || [];
          const servicesLength = services.length;

          return (
            <Accordion
              key={project.id}
              allowMultiple
              width={"100%"}
              borderWidth={1}
              borderRadius={"8px"}
              overflow={"hidden"}
              bg={"white"}
              borderColor={"#F4EAE0"}
              height={"fit-content"}
              _hover={{ borderColor: "#F4DFC8" }}
            >
              <AccordionItem
                style={{ borderBottomWidth: 0 }}
                borderTopWidth={0}
              >
                {() => {
                  return (
                    <>
                      <AccordionButton _hover={{ bg: "transparent" }}>
                        <Box as="div" flex="1" textAlign="left">
                          <HStack>
                            <Text
                              fontWeight={600}
                              fontSize={{ base: "md", md: "lg" }}
                              textTransform={"capitalize"}
                            >
                              {project.name}
                            </Text>
                            {(servicesLength || 0) >= 1 && (
                              <>
                                <Spacer />
                                <Text
                                  fontWeight={400}
                                  fontSize={{ base: "xs" }}
                                  textTransform={"lowercase"}
                                >
                                  {servicesLength} services
                                </Text>
                              </>
                            )}
                          </HStack>
                          {project.description && (
                            <Text>{project.description}</Text>
                          )}
                          <Text fontSize={"12px"} opacity={0.7}>
                            Started{" "}
                            {dateFormatter().to(
                              dateFormatter(project.projectCreatedAt)
                            )}
                          </Text>
                        </Box>
                      </AccordionButton>
                      <AccordionPanel position={'relative'} pb={2} cursor={"pointer"}>
                        {servicesLength > 0 ? (
                          <List>
                            {services.map((service, i) => {
                              const instancesLength = service.instances?.length || 0;

                              return (
                                <ListItem key={service.id} display={'flex'} justifyContent={'space-between'}>
                                  <Link
                                    href={`?action=view-service&serviceId=${service.id}&projectId=${project.id}`}
                                    fontSize={"12px"}
                                    color={NORMAL_TEXT_COLOR}
                                    textTransform={"capitalize"}
                                  >
                                    <strong>{service.name}</strong>
                                  </Link>
                                  <Text fontSize={"10px"}
                                    color={NORMAL_TEXT_COLOR} textTransform={'lowercase'}>{instancesLength} instance{`${instancesLength > 1 ? 's' : ''}`}</Text>
                                </ListItem>
                              );
                            })}
                          </List>
                        ) : <Text w={'100%'} textAlign={'center'} fontSize={'12px'} my={1}>No services available</Text>}

                        <Divider my={2} />

                        <HStack style={{ bottom: 8 }} gap={2} w={'100%'}>
                          <Tooltip size={'small'} hasArrow fontSize={'12px'} label='New service'>
                            <Link href={`?action=new-service&projectId=${project.id}`} opacity={'0.5'} _hover={{ bg: 'transparent', color: 'black', opacity: '1' }} width={'fit-content'} height={'fit-content'} variant={'ghost'} padding={0}>
                              <DocumentPlusIcon height={15} />
                            </Link>
                          </Tooltip>
                          <Tooltip size={'small'} hasArrow fontSize={'12px'} label='Remove project'>
                            <Button opacity={'0.5'} display={'block'} _hover={{ bg: 'transparent', color: 'red', opacity: '1' }} width={'fit-content'} height={'fit-content'} variant={'ghost'} padding={0}>
                              <TrashIcon height={15} />
                            </Button>
                          </Tooltip>
                        </HStack>
                      </AccordionPanel>
                    </>
                  );
                }}
              </AccordionItem>
            </Accordion>
          );
        })}
      </Grid>
    </>
  );
};
