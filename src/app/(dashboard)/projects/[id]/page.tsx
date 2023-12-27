'use client';
import { useMemo } from "react";
import { notFound, useParams, usePathname, useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { Box, Button, Divider, Grid, GridItem, HStack, Spacer, Text, Tooltip, VStack } from "@chakra-ui/react";
import { GET_RAILWAY_PROJECT, GET_RAILWAY_PROJECT_DEPLOYMENTS } from "@/graphql/queries";
import { ProjectBreadCrumbs } from "../components/Breadcrumbs";
import { dateFormatter } from "@/utils/date";
import type { Project } from "@/@types/project";
import { ViewServicesComponent } from "../components/ViewServices";
import { ViewProjectDeploymentsComponent } from "../components/ViewProjectDeployments";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { GithubIconComponent } from "../../components/icons/Github";

export default function ViewProjectsPage() {
  const router = useRouter();
  const { id: projectId } = useParams();
  const pathname = usePathname();

  const { data, loading, error } = useQuery(GET_RAILWAY_PROJECT, {
    skip: typeof projectId !== 'string',
    pollInterval: 5000,
    variables: { projectId }
  });

  const { data: deploymentsData, loading: deploymentsDataLoading, error: deploymentsDataError } = useQuery(GET_RAILWAY_PROJECT_DEPLOYMENTS, {
    skip: typeof projectId !== 'string',
    pollInterval: 5000,
    variables: { projectId }
  });

  const project: Project = data?.getRailwayProject;
  const services = project?.services || [];
  const servicesLength = services.length;

  if (error && !loading) {
    return notFound();
  }

  const memoisedDeploymentData = useMemo(() => {
    if (!deploymentsDataLoading && deploymentsData?.getRailwayProjectDeployments) {
      const data = JSON.parse(deploymentsData?.getRailwayProjectDeployments);
      return Array.isArray(data?.edges) ? data.edges : [];
    }

    return [];
  }, [deploymentsData]);

  const isDataSuccessful = !deploymentsDataLoading && deploymentsData?.getRailwayProjectDeployments

  return !loading && <>
    {project && <ProjectBreadCrumbs items={[
      { name: project.name || 'Project', path: `/projects/${project.id}`, currentPage: true }
    ]} />}

    <Grid
      // templateRows='repeat(2, 1fr)'
      templateColumns={{ base: 'repeat(12, 1fr)' }}
      gap={4}
    >
      <GridItem rowSpan={1} colSpan={5}>
        {project && !loading && !error &&
          <VStack w={'100%'} bg={"#fff"} p={4} border={1} boxShadow="xs"
            borderWidth={1}
            borderRadius={"8px"}
            overflow={"hidden"}
            borderColor={"#F4EAE0"} height={'fit-content'}>
            <HStack w={'100%'} overflow={'hidden'}>
              <Box overflow={'hidden'}>
                <Text
                  textTransform={'capitalize'}
                  fontSize={{ base: "2xl", sm: "16px" }}
                  fontWeight={500}
                  isTruncated
                  overflow={'hidden'}
                >
                  {project?.name}
                </Text>
                <Text mt={-1} fontSize={"12px"} opacity={0.7}>
                  Started{" "}
                  {dateFormatter().to(
                    dateFormatter(project.projectCreatedAt)
                  )}
                </Text>
              </Box>
              <Spacer />
              <HStack>
                <Tooltip size={'sm'} fontSize={'10px'} label="Deploy Github repository as service.">
                  <Button
                    w={"fit-content"}
                    p={2}
                    size={{ base: "sm" }}
                    fontSize={{ base: "12px" }}
                    borderRadius={4}
                    border="1px"
                    borderColor={'#F4DFC8'}
                    background={"#F4DFC8"}
                    _hover={{
                      background: "#F4EAE0",
                    }}
                    onClick={() => router.push(pathname + `?action=new-github-service&projectId=${projectId}`)}
                  >
                    <GithubIconComponent height={16} width={16} />
                  </Button>
                </Tooltip>
                <Tooltip size={'sm'} fontSize={'10px'} label="Add new service to project">
                  <Button
                    w={"fit-content"}
                    p={2}
                    size={{ base: "sm" }}
                    fontSize={{ base: "12px" }}
                    borderRadius={4}
                    border="1px"
                    borderColor={'#F4DFC8'}
                    background={"#F4DFC8"}
                    _hover={{
                      background: "#F4EAE0",
                    }}
                    onClick={() => router.push(pathname + `?action=new-service&projectId=${project.id}`)}
                  >
                    <PlusIcon height={14} color={'inherit'} />
                  </Button>
                </Tooltip>
                <Tooltip size={'sm'} fontSize={'10px'} label="Delete project from RunThrough?">
                  <Button
                    w={"fit-content"}
                    p={2}
                    size={{ base: "sm" }}
                    fontSize={{ base: "12px" }}
                    borderRadius={4}
                    background={"red.100"}
                    border="1px"
                    borderColor={'red.100'}
                    color={'red.700'}
                    _hover={{
                      background: "red.50",
                      color: 'red.600'
                    }}
                    onClick={() => router.push(`?action=delete-project&projectId=${projectId}&returnUrl=/`)}
                  >
                    <TrashIcon height={14} color={'inherit'} />
                  </Button>
                </Tooltip>
              </HStack>
            </HStack>

            {/* Content */}
            {servicesLength > 0 ? (
              <>
                <Divider my={2} w={'90%'} />
                <ViewServicesComponent project={project} />
              </>
            ) : <Box borderStyle={'dashed'} borderRadius={4} borderColor={'#F4EAE0'} borderWidth={1} py={8} mt={4} w={'100%'} textAlign={'center'} fontSize={'12px'}>
                <Text>No services available</Text>
              </Box>}
            {/* END Content */}
          </VStack>}

      </GridItem>

      <GridItem colSpan={7} w={'100%'} bg={"#fff"} p={4} border={1} boxShadow="xs"
        borderWidth={1}
        as={VStack}
        borderRadius={"8px"}
        overflow={"hidden"}
        borderColor={"#F4EAE0"}>

        <VStack w={'100%'}>
          <Text
            textTransform={'capitalize'}
            fontSize={{ base: "2xl", sm: "16px" }}
            fontWeight={500}
            w={'100%'}
            textAlign={'left'}
          >
            Deployments
          </Text>

          {isDataSuccessful &&
            <ViewProjectDeploymentsComponent
              data={memoisedDeploymentData}
              services={project?.services || []}
              project={project}
            />}
          {!deploymentsDataLoading && !deploymentsData && <HStack borderStyle={'dashed'} borderWidth={1.5} borderRadius={8} w={'100%'} p={8} justifyContent={'center'}>
            <Text
              fontSize={{ base: "small" }}
              fontWeight={400}
            >
              No deployments found
            </Text>
          </HStack>}
        </VStack>
      </GridItem>

    </Grid>
  </>
}