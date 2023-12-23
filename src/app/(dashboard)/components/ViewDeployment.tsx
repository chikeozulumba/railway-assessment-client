"use client";

import { useCallback, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  HStack,
  ModalProps,
  Skeleton,
  Text,
  VStack,
  Box,
  Tooltip,
  Button,
  Divider,
  Spacer,
  ListItem,
  UnorderedList,
  Code,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  IconButton,
} from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { ModalComponent } from "@/components/Modal";
import {
  GET_RAILWAY_DEPLOYMENT, GET_RAILWAY_DEPLOYMENT_BUILD_LOGS, GET_RAILWAY_DEPLOYMENT_LOGS,
} from "@/graphql/queries";
import { dateFormatter } from "@/utils/date";
import { textColor } from "@/utils/text";
import { Link } from "@chakra-ui/next-js";
import { ChevronDownIcon, EllipsisVerticalIcon, LinkIcon } from "@heroicons/react/24/outline";
import { ViewDeploymentLogsComponent } from "./ViewDeploymentLogs";

type Props = {
  onClose: () => void;
  isOpen: boolean;
  buttonDisabled?: boolean;
  modalProps?: Partial<ModalProps>;
  deploymentId: string;
  projectId?: string;
};

export const ViewDeploymentComponent = (props: Props) => {
  const router = useRouter();
  const params = useParams();

  const searchParams = useSearchParams();
  const tokenId = searchParams.get("tokenId");

  const logType = (searchParams.get("logType") as 'build' | 'deployment' | undefined) || undefined;
  const logLimit = searchParams.get("logLimit");

  const deploymentId = props.deploymentId ? props.deploymentId : params.id ? params.id : undefined;
  const { isOpen, onClose } = props;

  const { data, loading } = useQuery(GET_RAILWAY_DEPLOYMENT, {
    variables: { deploymentId, tokenId, },
    skip: typeof deploymentId !== 'string',
  });

  const { data: getDeploymentLogsData, loading: deploymentLogsDataLoading, refetch: refetchDeploymentLogsData } = useQuery(GET_RAILWAY_DEPLOYMENT_LOGS, {
    variables: { deploymentId, tokenId, limit: logLimit || "100" },
    skip:  logType !== 'deployment',
  });

  const { data: getDeploymentBuildLogsData, loading: deploymentBuildLogsDataLoading, refetch: refetchDeploymentBuildLogsData } = useQuery(GET_RAILWAY_DEPLOYMENT_BUILD_LOGS, {
    variables: { deploymentId, tokenId, limit: logLimit || "100" },
    skip:  logType !== 'build',
  });

  const deploymentData = useMemo(() => {
    if (!loading && typeof data?.getDeployment === 'string') {
      return JSON.parse(data?.getDeployment);
    }
    return undefined;
  }, [data]);

  const deploymentLogsData = useMemo(() => {
    if (!deploymentLogsDataLoading && typeof getDeploymentLogsData?.getDeploymentLogs === 'string') {
      return JSON.parse(getDeploymentLogsData?.getDeploymentLogs);
    }
    return [];
  }, [getDeploymentLogsData]);

  const deploymentBuildLogsData = useMemo(() => {
    if (!deploymentBuildLogsDataLoading && typeof getDeploymentBuildLogsData?.getDeploymentBuildLogs === 'string') {
      return JSON.parse(getDeploymentBuildLogsData?.getDeploymentBuildLogs);
    }
    return [];
  }, [getDeploymentBuildLogsData]);

  const navigateLogsTypeAndLimit = useCallback(async (value: 'build' | 'deployment' | undefined, limit: number | string = 100) => {
    console.log(limit)
    const url = new URL(window.location.href);
    const currentLogType = url.searchParams.get('logType')
    if (value === undefined) {
      if (!currentLogType) return;
      url.searchParams.delete('logType');
      url.searchParams.delete('logLimit');
    } else {
      url.searchParams.set('logType', value);
      url.searchParams.set('logLimit', limit.toString());
    }
    return router.push(url.toString());
  }, []);

  const status = deploymentData?.status?.toUpperCase();
  const repo = deploymentData?.meta?.repo;                                                                                                                                    
  const branch = deploymentData?.meta?.branch;
  const commitAuthor = deploymentData?.meta?.commitAuthor;
  const image = deploymentData?.meta?.image;
  const isGithub = typeof repo === 'string' && typeof branch === 'string' && typeof commitAuthor === 'string';
  const isImage = typeof image === 'string';
  const color = textColor(status);

  const logData = (logType === 'build' ? deploymentBuildLogsData : deploymentLogsData);
  const dataLoading = (logType === 'build' ? deploymentBuildLogsDataLoading : logType === 'deployment' ? deploymentLogsDataLoading : false);
  
  return (
    <ModalComponent
      title="View Deployment"
      description={
        <Text fontWeight={400} fontSize={"12px"}>
          Remove this service from RunThrough
        </Text>
      }
      isOpen={isOpen}
      handleOnClose={() => {
        onClose();
      }}
      showFooter={false}
      {...(props.modalProps || {})}
    >
      <VStack gap={4} w={'100%'} minHeight={100} pb={2}>
        {/* Service Data */}
        <Skeleton w={'100%'} minHeight={'100px'} isLoaded={deploymentData !== undefined} startColor='gray.100' endColor='#faf6f0'>
          {deploymentData &&
            <VStack w={'100%'} gap={4} mb={2}>
              <HStack w={'100%'}>
                <VStack w={'100%'} gap={0} alignItems={'start'}>
                  <HStack>
                    <Text fontWeight={500} fontSize={'16px'} textTransform={'capitalize'}>
                      {deploymentData?.service.name}

                    </Text>
                    {deploymentData?.staticUrl &&
                      <Tooltip label={`Visit url`} fontSize={'12px'}>
                        <Link target="_blank" href={'https://' + (deploymentData.staticUrl)} _hover={{ color: '#F4DFC8' }}>
                          <LinkIcon height={12} color="inherit" />
                        </Link>
                      </Tooltip>
                    }
                  </HStack>
                  <Text fontSize={12}>
                    Deployed {dateFormatter().to(deploymentData?.createdAt)}
                  </Text>
                </VStack>
                <HStack>
                  <Text
                    textTransform={'uppercase'}
                    fontSize={12}
                    fontWeight={500}
                    color={color}
                    borderColor={color}
                    borderStyle={'dashed'}
                    borderWidth={1}
                    borderRadius={4}
                    px={2}
                    py={1}
                  >
                    {deploymentData?.status}
                  </Text>
                  <Menu size={'xs'}>
                    {({ isOpen }) => (
                      <>
                        <MenuButton isActive={isOpen} as={Button} rightIcon={<ChevronDownIcon />} w={"fit-content"}
                          isLoading={dataLoading}
                          px={4}
                          size={{ base: "sm" }}
                          fontSize={{ base: "12px" }}
                          fontWeight={400}
                          borderRadius={"4px"}
                          bg={'#F4DFC8'}
                          _active={{
                            bg: '#F4DFC8',
                          }}
                          _hover={{
                            bg: '#F4DFC8',
                          }}
                        >
                          {logType === undefined && 'View Logs'}
                          {logType === 'build' && 'Build Logs'}
                          {logType == 'deployment' && 'Deployment Logs'}
                        </MenuButton>
                        <MenuList p={0} overflow={'hidden'} minW={'100px'}>
                          {typeof logType === 'string' && <MenuItem fontSize={'12px'} color={'red'} onClick={() => navigateLogsTypeAndLimit(undefined)}>Hide logs</MenuItem>}
                          <MenuItem fontSize={'12px'} onClick={() => navigateLogsTypeAndLimit('build')}>Build logs</MenuItem>
                          <MenuItem fontSize={'12px'} onClick={() => navigateLogsTypeAndLimit('deployment')}>Deployment logs</MenuItem>
                        </MenuList>
                      </>
                    )}
                  </Menu>
                  <Menu>
                    <MenuButton
                      size={'sm'}
                      as={IconButton}
                      aria-label='Options'
                      icon={<EllipsisVerticalIcon height={20} />}
                      variant='outline'
                      borderColor={'transparent'}
                      _hover={{
                        bg: "#faf6f0"
                      }}
                      _active={{
                        bg: "#faf6f0"
                      }}
                    />
                    <MenuList p={0} overflow={'hidden'} minW={'100px'}>
                      {deploymentData.canRedeploy && <MenuItem fontSize={12}>
                        Redeploy
                      </MenuItem>}
                      {deploymentData.canRollback && <MenuItem fontSize={12}>
                        Rollback
                      </MenuItem>}
                      <MenuItem fontSize={12} color={'red.600'}>
                        Remove
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              </HStack>

              <HStack justifyContent={'space-betweens'} alignItems={'start'} w={'100%'} gap={4}>
                <Box>
                  <Text fontSize={'14px'} fontWeight={500}>Build</Text>
                  <UnorderedList fontSize={'12px'} listStyleType={'none'} ml={0}>
                    <ListItem as={HStack}>
                      <Text>Source:</Text>
                      {isGithub && <Tooltip label={'Click to view'} fontSize={10} hasArrow>
                        <Text fontSize={10}><Code borderRadius={2} bg={'#F4DFC8'} fontSize={10}><Link href={`https://github.com/${repo}`}>Github</Link></Code></Text>
                      </Tooltip>}
                      {isImage && <Text mt={0}>
                        <Text fontSize={10}><Code borderRadius={2} bg={'#F4DFC8'} fontSize={10}>Dockerhub</Code></Text>
                      </Text>}
                    </ListItem>
                    {isGithub && <ListItem as={HStack}>
                      <Text>Branch:</Text><Code fontSize={10}>{branch}</Code></ListItem>}
                    {isGithub && <ListItem as={HStack}>
                      <Text>Commit:</Text><Code fontSize={10}>{deploymentData.meta?.commitMessage}</Code></ListItem>}
                    {deploymentData.meta?.serviceManifest?.build && <ListItem as={HStack}>
                      <Text>Builder:</Text><Code fontSize={10}>{deploymentData.meta?.serviceManifest?.build.builder}</Code></ListItem>}
                    {deploymentData.meta?.serviceManifest?.build && <ListItem as={HStack}>
                      <Text>Command:</Text><Code fontSize={10}>{deploymentData.meta?.serviceManifest?.build.buildCommand}</Code></ListItem>}
                  </UnorderedList>
                </Box>
                <Box>
                  <Text fontSize={'14px'} fontWeight={500}>Deploy</Text>
                  <UnorderedList fontSize={'12px'} listStyleType={'none'} ml={0}>
                    {deploymentData.meta?.serviceManifest?.deploy && <ListItem as={HStack}>
                      <Text>Replicas:</Text><Text fontSize={10}>{deploymentData.meta?.serviceManifest?.deploy.numReplicas}</Text></ListItem>}
                    {deploymentData.meta?.serviceManifest?.deploy && <ListItem as={HStack}>
                      <Text>Health Check:</Text><Code fontSize={10}>{deploymentData.meta?.serviceManifest?.deploy.healthcheckPath}</Code></ListItem>}
                    {deploymentData.meta?.serviceManifest?.deploy && <ListItem as={HStack}>
                      <Text>Command:</Text><Code fontSize={10}>{deploymentData.meta?.serviceManifest?.deploy.startCommand}</Code></ListItem>}
                  </UnorderedList>
                </Box>
              </HStack>

              {logType !== undefined && <VStack w={'100%'} alignItems={'start'}>
                <Text textTransform={'capitalize'} fontSize={14} fontWeight={500} w={'fit-content'}>{logType} logs</Text>
                <ViewDeploymentLogsComponent
                  scope={logType}
                  data={logData}
                  isLoaded={dataLoading === false}
                  fetchData={navigateLogsTypeAndLimit}
                  logLimit={logLimit ? Number(logLimit) : undefined}
                />
              </VStack>
              }
            </VStack>
          }
        </Skeleton>
      </VStack>
    </ModalComponent>
  );
};
