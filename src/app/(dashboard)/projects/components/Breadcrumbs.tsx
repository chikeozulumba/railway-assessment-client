'use client';

import { Breadcrumb, BreadcrumbItem } from "@chakra-ui/react";
import { Link as BreadcrumbLink } from "@chakra-ui/next-js";
import { ChevronRightIcon } from "@chakra-ui/icons";

type Props = {
  items?: Array<{
    name: string;
    path: string;
    currentPage?: boolean;
  } | undefined>
  showRoot?: boolean;
}

export function ProjectBreadCrumbs(props: Props) {
  const { showRoot = true } = props
  return <Breadcrumb spacing='8px' mb={1} alignItems={'center'} separator={<ChevronRightIcon height={'12px'} color='gray.500' />}>
    {showRoot && <BreadcrumbItem isCurrentPage={props.items?.length === 0}>
      <BreadcrumbLink color={'#222831'} fontSize={'14px'} href='/'>Projects</BreadcrumbLink>
    </BreadcrumbItem>}

    {props.items?.filter(Boolean).map((item, i) => <BreadcrumbItem key={i} isCurrentPage={item?.currentPage}>
      <BreadcrumbLink color={'#222831'} fontSize={'14px'} fontWeight={item?.currentPage ? 600 : 400} textTransform={'capitalize'} href={item?.path || ''}>{item?.name}</BreadcrumbLink>
    </BreadcrumbItem>)}
  </Breadcrumb>
}
