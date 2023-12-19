'use client';

import { Breadcrumb, BreadcrumbItem } from "@chakra-ui/react";
import { Link as BreadcrumbLink } from "@chakra-ui/next-js";
import { ChevronRightIcon } from "@chakra-ui/icons";

type Props = {
  items?: Array<{
    name: string;
    path: string;
    currentPage?: boolean;
  }>
}

export function ProjectBreadCrumbs(props: Props) {
  return <Breadcrumb spacing='8px' mb={1} alignItems={'center'} separator={<ChevronRightIcon height={'12px'} color='gray.500' />}>
    <BreadcrumbItem>
      <BreadcrumbLink color={'#222831'} fontSize={'14px'} href='/'>Projects</BreadcrumbLink>
    </BreadcrumbItem>

    {props.items?.map((item, i) => <BreadcrumbItem key={i} isCurrentPage={item.currentPage || i === (props.items?.length || 0) - 1}>
      <BreadcrumbLink color={'#222831'} fontSize={'14px'} fontWeight={600} textTransform={'capitalize'} href={item.path}>{item.name}</BreadcrumbLink>
    </BreadcrumbItem>)}
  </Breadcrumb>
}
