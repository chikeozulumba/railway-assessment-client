import { VStack, Text, HStack, Box, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer, Tooltip, Code, Divider } from "@chakra-ui/react";
import type { Project, ServiceInstance } from "@/@types/project";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { dateFormatter } from "@/utils/date";
import { Link } from "@chakra-ui/next-js";

type Props = {
  project?: Project;
  instances?: any[];
}

export const ViewServiceInstancesComponent = (props: Props) => {
  const { instances } = props;

  return (
    <Box w={'100%'}>
      <Text textTransform={'uppercase'} mb={2} fontSize={12} fontWeight={600}>INSTANCES</Text>
      <VStack w={'100%'} textAlign={'left'} alignItems={'flex-start'} gap={4}>
        {instances?.map((instance, i) => {
          const instanceInstancesSources = instances.map((ins) => ins.sourceImage !== null ? 'Docker' : ins.sourceRepo !== null ? 'Github' : ins.sourceTemplateSource !== null ? 'Template' : 'N/A')

          return (
            <>
              <Box w={'100%'} key={instance.id}>
                <HStack w={'100%'}>
                  <HStack w={'100%'} gap={2} justifyContent={'center'} alignItems={'center'}>
                    <VStack alignItems={'start'} w={'100%'} gap={0}>
                      <Tooltip size={'small'} hasArrow fontSize={'10px'} label={`Deployed via ${instanceInstancesSources}`}>
                        <VStack alignItems={'start'} gap={1} as={'div'} cursor={'pointer'}>
                          {instance.node.source.repo && <Text fontSize={12} fontWeight={500}>
                            Source:
                            <Text><Link fontSize={12} target="__blank" href={`https://github.com/${instance.node.source.repo}`} fontWeight={400}>{instance.node.source.repo}</Link></Text>
                          </Text>}
                          {instance.node.source.image && <Text fontWeight={500} fontSize={12}>
                            Source:
                            <Text><Code fontSize={12} borderRadius={2} bg={'#F4DFC8'}>{instance.node.source.image}</Code></Text>
                          </Text>}
                          {instance.node.startCommand && <Text fontWeight={500} fontSize={12}>
                            Start:
                            <Text><Code fontSize={12} borderRadius={2} bg={'#F4DFC8'}>{instance.node.startCommand}</Code></Text>
                          </Text>}
                          {instance.node.buildCommand && <Text fontWeight={500} fontSize={12}>
                            Build:
                            <Text><Code fontSize={12} borderRadius={2} bg={'#F4DFC8'}>{instance.node.buildCommand}</Code></Text>
                          </Text>}
                          <Text fontSize={'10px'}>
                            deployed {dateFormatter().to(instance.node.createdAt)}
                          </Text>
                        </VStack>
                      </Tooltip>
                    </VStack>
                  </HStack>
                </HStack>
              </Box>

              {instances[i + 1] && <Divider />}
            </>
          )
        })}
      </VStack>
    </Box>
  )
}