import { VStack, Text, HStack, Box, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer, Tooltip } from "@chakra-ui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { dateFormatter } from "@/utils/date";
import type { Project } from "@/@types/project";

type Props = {
  project?: Project;
}

export const ViewServicesComponent = (props: Props) => {
  const { project } = props;
  const router = useRouter();

  return (
    <Box w={'100%'}>
      <Text textTransform={'uppercase'} mb={2} fontSize={12} fontWeight={600}>Services</Text>
      <VStack w={'100%'} textAlign={'left'} alignItems={'flex-start'} gap={4}>
        {project?.services?.map((service, i) => {
          const serviceInstancesSources = service.instances?.map((ins) => ins.sourceImage !== null ? 'Docker' : ins.sourceRepo !== null ? 'Github' : ins.sourceTemplateSource !== null ? 'Template' : 'N/A')

          return <Box w={'100%'} key={service.id}>

            <HStack w={'100%'}>
              <HStack w={'100%'} gap={2} justifyContent={'center'} alignItems={'center'}>
                <VStack alignItems={'start'} w={'100%'} gap={0}>
                  <Tooltip size={'small'} hasArrow fontSize={'10px'} label={`Deployed via ${serviceInstancesSources}`}>
                    <VStack alignItems={'start'} gap={0} as={'div'} cursor={'pointer'}>
                      <Text textTransform={'capitalize'} fontSize={14} fontWeight={500}>
                        {service?.name}
                      </Text>
                      <Text fontSize={'10px'}>
                        created {dateFormatter().to(service.serviceCreatedAt)}
                      </Text>
                    </VStack>
                  </Tooltip>
                </VStack>
              </HStack>
              <Spacer />
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
                    <MenuItem onClick={() => router.push(`/projects/${project.id}/services/${service.id}`)} fontSize={12}>
                      View
                    </MenuItem>
                    <MenuItem fontSize={12} color={'red.600'} onClick={() => router.push(`?action=delete-service&serviceId=${service.id}&returnUrl=/projects/${service.projectId}`)}>
                      Remove
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            </HStack>
          </Box>
        })}
      </VStack>
    </Box>
  )
}