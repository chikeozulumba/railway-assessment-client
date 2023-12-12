"use client";

import { useMemo } from "react";
import { HStack, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { DashboardProjects } from "./components/Projects";
import { GET_RAILWAY_PROJECTS } from "@/graphql/queries";
import { AddNewServiceToProjectComponent } from "./components/AddNewServiceToProject";
import { CreateNewProjectComponent } from "./components/CreateNewProject";

import type { Project } from "@/@types/project";

export default function Home() {
  const { data, loading } = useQuery(GET_RAILWAY_PROJECTS);
  const projects: Project[] = useMemo(() => data?.railwayProjects || [], [data]);

  const { state } = useAuthStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const action = searchParams.get("action");
  const projectId = searchParams.get("projectId");
  const serviceId = searchParams.get("serviceId");

  const shouldViewServiceModalBeOpen = Boolean(
    action === "view-service" && projectId && serviceId
  );
  const shouldNewServiceModalBeOpen = Boolean(
    action === "new-service" && projectId
  );
  const shouldCreateNewProjectModalBeOpen = Boolean(
    action === "new-project"
  );

  const currentProject = useMemo(() => {
    if (!projectId) return undefined
    return projects.find((p) => p.id === projectId) || undefined
  }, [projectId, projects])

  const {
    onClose: newServiceModalOnClose,
    isOpen: newServiceModalIsOpen,
  } = useDisclosure({
    isOpen: shouldNewServiceModalBeOpen,
    onClose() {
      router.replace(pathname)
    },
  });

  const {
    onClose: viewServiceModalOnClose,
    isOpen: viewServiceModalIsOpen,
  } = useDisclosure({
    isOpen: shouldViewServiceModalBeOpen,
    onClose() {
      router.replace(pathname);
    },
  });

  const {
    onClose: createNewProjectModalOnClose,
    isOpen: createNewProjectModalIsOpen,
  } = useDisclosure({
    isOpen: shouldCreateNewProjectModalBeOpen,
    onClose() {
      router.replace(pathname);
    },
  });

  async function addNewServiceToProject() {}

  async function createNewProject(data: any) {
    console.log(data);
  }

  return (
    !loading && (
      <>
        <VStack gap={8} justifyContent={"start"}>
          <HStack width={"100%"} justifyContent={"space-between"}>
            <Text
              fontSize={{ base: "2xl", sm: "18px", md: "24px" }}
              fontWeight={600}
            >
              Hi, {state.data?.fullName}
            </Text>
          </HStack>

          <VStack gap={8} width={"100%"}>
            <DashboardProjects projects={projects} />
          </VStack>
        </VStack>

        <AddNewServiceToProjectComponent
          onClose={newServiceModalOnClose}
          handleSubmit={addNewServiceToProject}
          isOpen={Boolean(currentProject && newServiceModalIsOpen)}
          project={currentProject}
          modalProps={{ isCentered: false, closeOnOverlayClick: false }}
        />

        <CreateNewProjectComponent
          onClose={createNewProjectModalOnClose}
          handleSubmit={createNewProject}
          isOpen={createNewProjectModalIsOpen}
          modalProps={{ closeOnOverlayClick: false, isCentered: true }}
        />
      </>
    )
  );
}
