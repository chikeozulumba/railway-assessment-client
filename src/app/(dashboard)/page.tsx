"use client";

import { useMemo } from "react";
import { HStack, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GET_RAILWAY_PROJECTS } from "@/graphql/queries";
import { DashboardProjects } from "./components/Projects";
import { AddNewServiceToProjectComponent } from "./components/AddNewServiceToProject";
import { CreateNewProjectComponent } from "./components/CreateNewProject";

import type { Project } from "@/@types/project";

export default function Home() {
  const auth = useUser();
  const { data, loading } = useQuery(GET_RAILWAY_PROJECTS);
  const projects: Project[] = useMemo(() => data?.railwayProjects || [], [data]);

  return (
    !loading && (
      <>
        <VStack gap={8} justifyContent={"start"}>
          <HStack width={"100%"} justifyContent={"space-between"}>
            <Text
              fontSize={{ base: "2xl", sm: "16px", md: "24px" }}
              fontWeight={500}
            >
              Hi, {auth.user?.firstName}
            </Text>
          </HStack>

          <VStack gap={4} width={"100%"}>
            <DashboardProjects projects={projects} />
          </VStack>
        </VStack>

      </>
    )
  );
}
