import React from "react";
import { Box, Code, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer, Text, Tooltip, VStack } from "@chakra-ui/react";
import { Virtuoso } from 'react-virtuoso'
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Link } from "@chakra-ui/next-js";
import { dateFormatter } from "@/utils/date";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { GithubIconComponent } from "../../components/icons/Github";
import type { Project, Service } from "@/@types/project";
import { textColor } from "@/utils/text";

type Props = {
  data: any[];
  services?: Service[];
  project: Project;
}

const Wrapper: any = React.forwardRef((props, ref: any) => {
  return <VStack w={'100%'} gap={2} ref={ref} {...props} />
});

const ItemWrapper: any = React.forwardRef((props, ref: any) => {
  return <Box
    borderColor={"gray.100"}
    _hover={{ shadow: 'xs' }}
    w={'100%'}
    h={'fit-content'}
    borderRadius={'8px'}
    ref={ref}
    width={"100%"}
    borderWidth={1}
    overflow={"hidden"}
    bg={"white"}
    cursor={'pointer'}
    p={2}
    {...props}
  />
});

export const ViewProjectDeploymentsComponent = (props: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Virtuoso
      components={{
        List: Wrapper,
        Item: ItemWrapper
      }}
      style={{ minHeight: '70vh', width: '100%', paddingBottom: '100px' }}
      totalCount={props.data.length}
      data={props.data}
      itemContent={(index, deployment) => {
        const status = deployment.node.status?.toUpperCase();
        const repo = deployment.node.meta?.repo;
        const branch = deployment.node.meta?.branch;
        const commitAuthor = deployment.node.meta?.commitAuthor;
        const image = deployment.node.meta?.image;
        const isGithub = typeof repo === 'string' && typeof branch === 'string' && typeof commitAuthor === 'string';
        const isImage = typeof image === 'string';

        const service = props.services?.find((s) => s.railwayServiceId === deployment.node.service?.id);
        const serviceImage = deployment.node.service?.icon;
        return (
          <HStack>
            <HStack gap={2} justifyContent={'center'} alignItems={'center'}>
              <Box mt={1}>
                {typeof serviceImage === 'string' ? <Image width={20} height={20} src={serviceImage} alt="" /> : isGithub ? <GithubIconComponent height={16} width={16} /> : <Box height={5} width={5} />}
              </Box>
              <VStack alignItems={'start'} w={'100%'} gap={0}>
                <Text textTransform={'capitalize'} fontSize={12} fontWeight={500}>
                  {service?.name}
                </Text>
                {isGithub && <Tooltip label={'Click to view'} fontSize={10} hasArrow>
                  <Text fontSize={10}>via{' '}<Code borderRadius={2} bg={'#F4DFC8'} fontSize={10}><Link href={`https://github.com/${repo}`}>Github</Link></Code></Text>
                </Tooltip>}
                {isImage && <Text mt={0}>
                  <Text fontSize={10}>via{' '}<Code borderRadius={2} bg={'#F4DFC8'} fontSize={10}>Dockerhub</Code></Text>
                </Text>}
              </VStack>
            </HStack>
            <Spacer />
            <Box>
              <Tooltip size={'small'} hasArrow fontSize={'10px'} label={dateFormatter(deployment.node.createdAt).format('LLLL')}>
                <div>
                  <Text textTransform={'uppercase'} fontSize={12} fontWeight={500} color={textColor(status)}>
                    {deployment.node.status}
                  </Text>
                  <Text fontSize={10}>
                    Deployed {dateFormatter().to(deployment.node.createdAt)}
                  </Text>
                </div>
              </Tooltip>
            </Box>
            <Spacer />
            <Box>
              <Menu>
                <MenuButton
                  size={'sm'}
                  as={IconButton}
                  aria-label='Options'
                  icon={<EllipsisVerticalIcon height={20} />}
                  variant='ghost'
                  _hover={{
                    bg: "#faf6f0"
                  }}
                  _active={{
                    bg: "#faf6f0"
                  }}
                />
                <MenuList p={0} overflow={'hidden'} minW={'100px'}>
                  <MenuItem onClick={() => router.push(`${pathname}?action=view-deployment&tokenId=${props.project?.tokenId}&deploymentId=${deployment.node.id}&serviceId=${deployment.node.service.id}`)} fontSize={12}>
                    View logs
                  </MenuItem>
                  {deployment.node.canRedeploy && <MenuItem fontSize={12}>
                    Redeploy
                  </MenuItem>}
                  <MenuItem fontSize={12} color={'red.600'}>
                    Remove
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </HStack>
        )
      }} />
  )
}