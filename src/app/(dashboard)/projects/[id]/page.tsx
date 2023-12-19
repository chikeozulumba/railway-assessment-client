'use client';
import { Box, Button, HStack, Link, Spacer, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import { notFound, useParams, usePathname, useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_RAILWAY_PROJECT } from "@/graphql/queries";
import { ProjectBreadCrumbs } from "../components/Breadcrumbs";
import { ErrorComponent } from "@/components/ErrorComponent";
import { dateFormatter } from "@/utils/date";
import type { Project } from "@/@types/project";

export default function ViewProjectsPage() {
  const router = useRouter();
  const { id: projectId } = useParams();
  const pathname = usePathname();

  const { data, loading, error } = useQuery(GET_RAILWAY_PROJECT, {
    skip: typeof projectId !== 'string',
    variables: { projectId }
  });

  const project: Project = data?.getRailwayProject;
  const services = project?.services || [];
  const servicesLength = services.length;

  if (error && !loading) {
    return notFound()
  }

  return !loading && <>
    {project && <ProjectBreadCrumbs items={[
      { name: project.name || 'Project', path: `/projects/${project.id}`, currentPage: true }
    ]} />}

    <Box bg={"#fff"} p={4} border={1} boxShadow="xs"
      borderWidth={1}
      borderRadius={"8px"}
      overflow={"hidden"}
      borderColor={"#F4EAE0"}>

      {project && !loading && !error &&
        <VStack w={'100%'}>
          <HStack w={'100%'}>
            <Box>
              <Text
                textTransform={'capitalize'}
                fontSize={{ base: "2xl", sm: "18px", md: "24px" }}
                fontWeight={600}
              >
                {project.name}
              </Text>
              <Text fontSize={"12px"} opacity={0.7}>
                Started{" "}
                {dateFormatter().to(
                  dateFormatter(project.projectCreatedAt)
                )}
              </Text>
            </Box>
            <Spacer />
            <HStack>
              <Button
                w={"fit-content"}
                px={4}
                size={{ base: "sm" }}
                fontSize={{ base: "12px" }}
                borderRadius={"12px"}
                background={"#F4DFC8"}
                _hover={{
                  background: "#F4EAE0",
                }}
                onClick={() => router.push(pathname + `?action=new-service&projectId=${project.id}`)}
              >
                <Text color={"#000"} fontWeight={"medium"}>
                  Add service
                </Text>
              </Button>
              <Button
                w={"fit-content"}
                px={4}
                size={{ base: "sm" }}
                fontSize={{ base: "12px" }}
                borderRadius={"12px"}
                background={"red.100"}
                border="1px"
                borderColor={'red.200'}
                _hover={{
                  background: "red.200",
                }}
              // onClick={() => router.push(pathname + "?action=new-project")}
              >
                <Text color={"red.600"} fontWeight={"medium"}>
                  Remove project
                </Text>
              </Button>
            </HStack>
          </HStack>

          {/* Content */}
          {servicesLength > 0 ? (
            <VStack w={'100%'} textAlign={'left'} alignItems={'flex-start'} gap={4} mt={4}>
              <Text as={'h3'} w={'fit-content'} fontSize={{ base: "xl", sm: "16px" }} fontWeight={600}>Services</Text>
              <TableContainer width={"100%"} bg={"white"} borderRadius={"8px"} >
                <Table variant='theme' size={"sm"}>
                  <Thead fontSize={'12px'} pb={1}>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Instances</Th>
                      <Th>Date Added</Th>
                    </Tr>
                  </Thead>
                  <Tbody fontSize={'14px'}>
                    {project.services?.map((service, i) => {
                      const instancesLength = service.instances?.length || 'None';
                      return (<Tr key={service.id + i}>
                        <Td pl={2}>
                          <Link textTransform={'capitalize'} href={`/services/${service.id}`}>
                            {service.name}
                          </Link>
                        </Td>
                        <Td>
                          {instancesLength}
                        </Td>
                        <Td>
                          <Text fontSize={12}>
                            {dateFormatter(service.createdAt).format("LLL")}
                          </Text>
                        </Td>
                      </Tr>)
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </VStack>  
          ) : <Text w={'100%'} textAlign={'center'} fontSize={'12px'} my={1}>No services available</Text>}
          {/* END Content */}
        </VStack>}

      {/* {error && <ErrorComponent explaination="The project you are looking for is currently unavailable." callback={() => router.replace('/projects')} />} */}
    </Box>
  </>
}