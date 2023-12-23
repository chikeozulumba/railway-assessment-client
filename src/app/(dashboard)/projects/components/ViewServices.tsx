import { VStack, Text, HStack, Box, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer, Tooltip } from "@chakra-ui/react";
import type { Project } from "@/@types/project";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { dateFormatter } from "@/utils/date";

type Props = {
  project?: Project;
}
{/* <Text as={'h3'} w={'fit-content'} fontSize={{ base: "xl", sm: "16px" }} fontWeight={600}>Services</Text> */ }
// <TableContainer width={"100%"} bg={"white"} borderRadius={"8px"} >
//   <Table variant='custom-theme' size={"md"}>
//     <Thead fontSize={'12px'} pb={1}>
//       <Tr>
//         <Th></Th>
//         <Th>Name</Th>
//         <Th>Source</Th>
//         <Th>Date Added</Th>
//         <Th>Action</Th>
//       </Tr>
//     </Thead>
//     <Tbody fontSize={'14px'}>
//       {project?.services?.map((service, i) => {
//         const instancesLength = service.instances?.length || 'None';
//         const serviceInstancesSources = service.instances?.map((ins) => ins.sourceImage !== null ? 'Docker' : ins.sourceRepo !== null ? 'Github' : ins.sourceTemplateSource !== null ? 'Template' : 'N/A')
//         return (<Tr key={service.id + i}>
//           <Td fontSize={12} pl={2}>
//             {i + 1}
//           </Td>
//           <Td fontSize={14}>
//             <Text textTransform={'capitalize'} fontWeight={500}>
//               {service.name}
//             </Text>
//           </Td>
//           <Td fontSize={12}>
//             {serviceInstancesSources?.join(', ') || 'N/A'}
//           </Td>
//           <Td fontSize={12}>
//             <Text>
//               {dateFormatter(service.serviceCreatedAt || service.createdAt).format("LLLL")}
//             </Text>
//           </Td>
//           <Td>
//             <HStack>
//               <Link textTransform={'lowercase'} fontSize={'12px'} fontWeight={500} href={`/services/${service.id}`}>
//                 view
//               </Link>
//               <Link textTransform={'lowercase'} fontSize={'12px'} fontWeight={500} color={'red'} href={`?action=delete-service&serviceId=${service.id}&returnUrl=/projects/${service.projectId}`}>
//                 delete
//               </Link>
//             </HStack>
//           </Td>
//         </Tr>)
//       })}
//     </Tbody>
//   </Table>
// </TableContainer>
export const ViewServicesComponent = (props: Props) => {
  const { project } = props;
  const router = useRouter();
  const pathname = usePathname();

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
                    <MenuItem onClick={() => router.push(`/services/${service.id}`)} fontSize={12}>
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