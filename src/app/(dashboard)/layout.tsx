"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Alert, AlertIcon, Box, Container, Text, useDisclosure } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { useQuery } from "@apollo/client";
import { NavigationBar } from "@/components/Navbar";
import { GET_PROFILE_AND_RAILWAY_TOKENS, GET_RAILWAY_PROJECTS } from "@/graphql/queries";
import type { Project } from "@/@types/project";
import { AddNewServiceToProjectComponent } from "./components/AddNewServiceToProject";
import { CreateNewProjectComponent } from "./components/CreateNewProject";
import { DeleteNewProjectComponent } from "./components/DeleteProject";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const action = searchParams.get("action");
  const projectId = searchParams.get("projectId");
  const serviceId = searchParams.get("serviceId");

  const shouldNewServiceModalBeOpen = Boolean(
    action === "new-service" && projectId
  );
  const shouldCreateNewProjectModalBeOpen = Boolean(
    action === "new-project"
  );
  const shouldDeleteProjectModalBeOpen = Boolean(
    action === "delete-project" && projectId
  );

  const { data: projectsData, loading: projectsLoading } = useQuery(GET_RAILWAY_PROJECTS, {
    // pollInterval: 5000
  });

  const projects: Project[] = useMemo(() => projectsData?.railwayProjects || [], [projectsData]);

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
    onClose: createNewProjectModalOnClose,
    isOpen: createNewProjectModalIsOpen,
  } = useDisclosure({
    isOpen: shouldCreateNewProjectModalBeOpen,
    onClose() {
      router.replace(pathname);
    },
  });

  const {
    onClose: deleteProjectModalOnClose,
    isOpen: deleteProjectModalIsOpen,
  } = useDisclosure({
    isOpen: shouldDeleteProjectModalBeOpen,
    onClose() {
      router.replace(pathname);
    },
  });

  const auth = useUser();

  const { data, loading } = useQuery(GET_PROFILE_AND_RAILWAY_TOKENS);

  const shouldHideTokenAlertBox = !["/settings"].includes(pathname);
  const railwayAccountConnected = data?.getRailwayTokens?.length > 0;

  return auth.isLoaded && !loading && !projectsLoading && (
    <>
      <NavigationBar />
      <Container maxW={"1024px"} pt={{ base: 16 }}>
        {data && !railwayAccountConnected && shouldHideTokenAlertBox && (
          <Alert status="warning" fontSize={"small"} mb={4}>
            <AlertIcon />
            <Text color={"#000000"}>
              Connect your railway account via API secret token.
              <br />
              <Link href="/settings?mode=token" textDecoration={"underline"}>
                Click here to proceed
              </Link>
            </Text>
          </Alert>
        )}
        <Box minH={"100vh"}>{children}</Box>
      </Container>

      <AddNewServiceToProjectComponent
        onClose={newServiceModalOnClose}
        isOpen={Boolean(currentProject && newServiceModalIsOpen)}
        project={currentProject}
        modalProps={{ isCentered: false, closeOnOverlayClick: false }}
      />

      <CreateNewProjectComponent
        onClose={createNewProjectModalOnClose}
        isOpen={createNewProjectModalIsOpen}
        modalProps={{ closeOnOverlayClick: false, isCentered: true }}
      />

      {projectId && <DeleteNewProjectComponent
        projectId={projectId}
        onClose={deleteProjectModalOnClose}
        isOpen={deleteProjectModalIsOpen}
        modalProps={{ closeOnOverlayClick: false, isCentered: true }}
      />}
    </>
  );
}
