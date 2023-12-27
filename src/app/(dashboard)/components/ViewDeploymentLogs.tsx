"use client";

import React, { useCallback, useRef, useState } from "react";
import { Box, Button, Code, Grid, GridItem, HStack, IconButton, Skeleton, Tooltip, VStack } from "@chakra-ui/react";
import { Virtuoso } from "react-virtuoso";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { dateFormatter } from "@/utils/date";
import { Toast } from "@/lib/toast";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  logLimit?: number;
  data: any[];
  scope: "deployment" | "build";
  isLoaded?: boolean;
  fetchData?: (scope: "deployment" | "build", args: string | number) => Promise<void>
};

const Wrapper: any = React.forwardRef((props, ref: any) => {
  return <VStack w={'100%'} gap={0} ref={ref} p={1} {...props} pos={'relative'} />
});

Wrapper.displayName = 'Wrapper';

const ItemWrapper: any = React.forwardRef((props, ref: any) => {
  return <Box
    w={'100%'} ref={ref} {...props} />
});

ItemWrapper.displayName = 'ItemWrapper';

function getColors(serverity: string) {
  if (serverity === 'err') {
    return {
      bg: 'red.100',
      color: 'red.600',
      hoverBg: 'red.200'
    }
  }

  return { bg: 'gray.50', hoverBg: 'gray.100' }
}

const Footer = ({ context: { fetchMoreData, loading, hide } }: any) => {
  if (hide) return null;
  return (
    <HStack w={'100%'} justifyContent={'center'} py={4}>
      <Button bg={'#F4DFC8'} _hover={{ bg: '#F4DFC8' }} isLoading={loading} fontSize={'xs'} size={'xs'} px={4} py={2} disabled={loading} fontWeight={400} onClick={fetchMoreData}>
        {loading ? 'Loading...' : 'Load more'}
      </Button>
    </HStack>
  )
}

export const ViewDeploymentLogsComponent = ({ data, isLoaded, scope, fetchData, logLimit = 100 }: Props) => {
  const [loading, setLoading] = useState(false);
  const virtuosoRef = useRef<any>(null);

  const fetchMoreData = useCallback(async () => {
    try {
      setLoading(true);
      const limit = (logLimit) + 100;
      if (limit > 5000) {
        return Toast(`Log limit for ${scope} logs exceeded`, { type: 'error', time: 4 });
      }
      await fetchData?.(scope, limit);
    } catch (error) {
      Toast(`Failed to fetch more ${scope} logs`, { type: 'error', time: 4 });
    } finally {
      setLoading(false);
    }
  }, [setLoading, logLimit, fetchData, scope]);

  return <Skeleton hidden={data.length === 0 && isLoaded} minHeight={'50vh'} w={'100%'} borderRadius={4} startColor='gray.50' endColor='#faf6f0' isLoaded={isLoaded}>
    <Box borderRadius={4} borderColor={'gray.100'} borderWidth={1}>
      <VStack pos={'absolute'} right={8} bottom={8} zIndex={10}>
        <Tooltip label="Jump to top" size={'sm'} fontSize={'12px'}>
          <IconButton
            bg={'#F4DFC8'}
            _hover={{ bg: '#F4DFC8' }}
            _active={{ bg: '#F4DFC8' }}
            size={'xs'}
            aria-label='Scroll to first item'
            icon={<ArrowUpIcon height={16} />}
            onClick={() => {
              virtuosoRef.current?.scrollToIndex({
                index: 0,
                align: 'start',
                behavior: 'smooth'
              });
            }}
          />
        </Tooltip>

        <Tooltip label="Scroll to bottom" size={'sm'} fontSize={'12px'}>
          <IconButton
            bg={'#F4DFC8'}
            _hover={{ bg: '#F4DFC8' }}
            _active={{ bg: '#F4DFC8' }}
            size={'xs'}
            aria-label='Scroll to last item'
            icon={<ArrowDownIcon height={16} />}
            onClick={() => {
              virtuosoRef.current?.scrollToIndex({
                index: data.length - 1,
                align: 'start',
                behavior: 'smooth'
              });
            }}
          />
        </Tooltip>
      </VStack>
      <Virtuoso
        context={{ fetchMoreData, loading, hide: false }}
        components={{
          List: Wrapper,
          Item: ItemWrapper,
          Footer,
        }}
        ref={virtuosoRef}
        style={{ minHeight: data.length !== 0 && isLoaded ? '50vh' : 0, width: '100%', paddingBottom: '100px' }}
        totalCount={data.length}
        data={data}
        itemContent={(index, log) => {
          const { bg, hoverBg } = getColors(log.severity);
          return <Grid
            templateColumns={{ base: 'repeat(12, 1fr)' }}
            borderColor={"gray.100"}
            w={'100%'}
            h={'fit-content'}
            width={"100%"}
            borderBottomWidth={1}
            overflow={"hidden"}
            bg={bg}
            cursor={'pointer'}
            gap={0}
            _hover={{ bg: hoverBg }}
          >
            <GridItem colSpan={3}>
              <Code fontSize={'9px'} fontWeight={500} bg={'transparent'}>{dateFormatter(log.timestamp).format('MMM D H:mm:ss')}</Code>
            </GridItem>
            <GridItem colSpan={9}>
              <Code fontSize={'9px'} bg={'transparent'}>
                {log.message}
              </Code>
            </GridItem>
          </Grid>
        }} />
    </Box>
  </Skeleton>;
};
