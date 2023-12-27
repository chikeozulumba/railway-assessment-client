'use client';

import { Box, Button, Divider, Grid, GridItem, HStack, Skeleton, Spacer, Text, VStack } from "@chakra-ui/react"
import { notFound, useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { ProjectBreadCrumbs } from "../../../components/Breadcrumbs"
import { GET_RAILWAY_SERVICE, GET_RAILWAY_SERVICE_DEPLOYMENTS } from "@/graphql/queries";
import { useMemo } from "react";
import { dateFormatter } from "@/utils/date";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ViewServiceDeploymentsComponent } from "../../../components/ViewServiceDeployments";
import { ViewServiceInstancesComponent } from "../../../components/ViewServicesInstance";

const ViewProjectServicePage = () => {
  const router = useRouter();
  const { id: projectId, serviceId } = useParams();

  const { data, loading, error } = useQuery(GET_RAILWAY_SERVICE, {
    skip: typeof serviceId !== 'string',
    variables: { serviceId }
  });

  const { data: deploymentsData, loading: deploymentsLoading, error: deploymentsError } = useQuery(GET_RAILWAY_SERVICE_DEPLOYMENTS, {
    skip: typeof serviceId !== 'string',
    pollInterval: 5000,
    variables: { serviceId }
  });

  const service = useMemo(() => {
    if (data) {
      return JSON.parse(data.getRailwayService);
    }

    return undefined;
  }, [data]);

  
  const serviceInstances = service?.serviceInstances?.edges
  const serviceInstancesLength = serviceInstances?.length || 0;

  if (error && !loading) {
    return notFound();
  }

  const memoisedDeploymentData = useMemo(() => {
    if (!deploymentsLoading && deploymentsData?.getRailwayServiceDeployments) {
      const data = JSON.parse(deploymentsData?.getRailwayServiceDeployments);
      return Array.isArray(data?.edges) ? data.edges : [];
    }

    return [];
  }, [deploymentsData, service]);

  const isDataSuccessful = !loading && deploymentsData?.getRailwayServiceDeployments

  return <>
    {<ProjectBreadCrumbs showRoot={false} items={[
      { name: 'Home', path: `/`, currentPage: false },
      { name: service?.project?.name || 'Project', path: `/projects/${projectId}`, currentPage: false },
      (service ? { name: service?.name || 'Service', path: window.location.pathname, currentPage: true } : undefined)
    ]} />}

    <Grid
      templateColumns={{ base: 'repeat(12, 1fr)' }}
      gap={4}
    >
      <GridItem rowSpan={1} colSpan={5}>
        {service && !loading && !error &&
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
                  {service?.name}
                </Text>
                <Text mt={-1} fontSize={"12px"} opacity={0.7}>
                  Started{" "}
                  {dateFormatter().to(
                    dateFormatter(service?.serviceCreatedAt)
                  )}
                </Text>
              </Box>
              <Spacer />
              <HStack>
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
                  onClick={() => router.push(`?action=delete-service&serviceId=${service.id}&returnUrl=/projects/${projectId}/services/${serviceId}`)}
                >
                  <TrashIcon height={14} color={'inherit'} />
                </Button>
              </HStack>
            </HStack>

            {/* Content */}
            {serviceInstancesLength > 0 ? (
              <>
                <Divider my={2} w={'90%'} />
                <ViewServiceInstancesComponent instances={serviceInstances} />
              </>
            ) : <Box borderStyle={'dashed'} borderRadius={4} borderColor={'#F4EAE0'} borderWidth={1} py={8} mt={4} w={'100%'} textAlign={'center'} fontSize={'12px'}>
              <Text>No service instances available</Text>
            </Box>}
            {/* END Content */}
          </VStack>}

      </GridItem>

      <GridItem colSpan={7} w={'100%'}>
        <Skeleton startColor='gray.50' endColor='#faf6f0' isLoaded={!deploymentsLoading}>
          <VStack w={'100%'} bg={"#fff"} p={4} border={1} boxShadow="xs"
            borderWidth={1}
            borderRadius={"8px"}
            overflow={"hidden"}
            borderColor={"#F4EAE0"}>
            <Text
              textTransform={'capitalize'}
              fontSize={{ base: "2xl", sm: "14px" }}
              fontWeight={500}
              w={'100%'}
              textAlign={'left'}
            >
              Deployments
            </Text>

            {isDataSuccessful &&
              <ViewServiceDeploymentsComponent
                data={memoisedDeploymentData}
                serviceInstances={serviceInstances || []}
                service={service}
                project={service.project}
              />}
            {!deploymentsData && deploymentsError && <HStack borderStyle={'dashed'} borderWidth={1.5} borderRadius={8} w={'100%'} p={8} justifyContent={'center'}>
              <Text
                fontSize={{ base: "small" }}
                fontWeight={400}
              >
                No deployments found
              </Text>
            </HStack>}
          </VStack>
        </Skeleton>
      </GridItem>

    </Grid>
  </>
}

export default ViewProjectServicePage;
