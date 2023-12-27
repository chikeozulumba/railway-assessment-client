"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Alert, AlertIcon, Box, Container, Text, useDisclosure } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { useQuery } from "@apollo/client";
import { NavigationBar } from "@/components/Navbar";
import { GET_PROFILE_AND_RAILWAY_TOKENS, GET_RAILWAY_PROJECTS, USER_GITHUB_REPOSITORIES } from "@/graphql/queries";
import type { Project } from "@/@types/project";
import { AddNewServiceToProjectComponent } from "./components/AddNewServiceToProject";
import { CreateNewProjectComponent } from "./components/CreateNewProject";
import { DeleteProjectComponent } from "./components/DeleteProject";
import { DeleteServiceComponent } from "./components/DeleteService";
import { ViewDeploymentComponent } from "./components/ViewDeployment";
import { DeployGithubRepositoryComponent } from "./components/DeployGithubRepository";

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
  const deploymentId = searchParams.get("deploymentId");
  const returnUrl = searchParams.get("returnUrl") || undefined;

  const shouldNewServiceModalBeOpen = Boolean(
    action === "new-service" && projectId
  );
  const shouldCreateNewProjectModalBeOpen = Boolean(
    action === "new-project"
  );
  const shouldDeleteProjectModalBeOpen = Boolean(
    action === "delete-project" && projectId
  );
  const shouldDeleteServiceModalBeOpen = Boolean(
    action === "delete-service" && serviceId
  );
  const shouldViewDeploymentModalBeOpen = Boolean(
    action === "view-deployment" && deploymentId
  );
  const shouldNewGithubServiceModalBeOpen = Boolean(
    action === "new-github-service" && projectId
  );

  const { data: projectsData, loading: projectsLoading } = useQuery(GET_RAILWAY_PROJECTS, {
    // pollInterval: 5000
  });

  const projects: Project[] = useMemo(() => projectsData?.railwayProjects || [], [projectsData]);

  const project = useMemo(() => {
    if (!projectId) return undefined
    return projects.find((p) => p.id === projectId) || undefined
  }, [projectId, projects]);

  const onClose = useCallback(() => {
    router.replace(returnUrl || pathname);
  }, [returnUrl]);

  const {
    onClose: newServiceModalOnClose,
    isOpen: newServiceModalIsOpen,
  } = useDisclosure({
    isOpen: shouldNewServiceModalBeOpen,
    onClose,
  });

  const {
    onClose: newServiceGithubModalOnClose,
    isOpen: newServiceGithubModalIsOpen,
  } = useDisclosure({
    isOpen: shouldNewGithubServiceModalBeOpen,
    onClose,
  });

  const {
    onClose: createNewProjectModalOnClose,
    isOpen: createNewProjectModalIsOpen,
  } = useDisclosure({
    isOpen: shouldCreateNewProjectModalBeOpen,
    onClose,
  });

  const {
    onClose: deleteProjectModalOnClose,
    isOpen: deleteProjectModalIsOpen,
  } = useDisclosure({
    isOpen: shouldDeleteProjectModalBeOpen,
    onClose,
  });

  const {
    onClose: deleteServiceModalOnClose,
    isOpen: deleteServiceModalIsOpen,
  } = useDisclosure({
    isOpen: shouldDeleteServiceModalBeOpen,
    onClose,
  });

  const {
    onClose: viewDeploymentModalOnClose,
    isOpen: viewDeploymentModalIsOpen,
  } = useDisclosure({
    isOpen: shouldViewDeploymentModalBeOpen,
    onClose,
  });

  const auth = useUser();

  const { data, loading } = useQuery(GET_PROFILE_AND_RAILWAY_TOKENS);
  const {} = useQuery(USER_GITHUB_REPOSITORIES, );

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
        isOpen={Boolean(project && newServiceModalIsOpen)}
        project={project}
        modalProps={{ isCentered: false, closeOnOverlayClick: false }}
      />

      <CreateNewProjectComponent
        onClose={createNewProjectModalOnClose}
        isOpen={createNewProjectModalIsOpen}
        modalProps={{ closeOnOverlayClick: false, isCentered: true }}
      />

      {projectId && <DeleteProjectComponent
        projectId={projectId}
        onClose={deleteProjectModalOnClose}
        isOpen={deleteProjectModalIsOpen}
        modalProps={{ closeOnOverlayClick: false, isCentered: true }}
      />}

      {serviceId && <DeleteServiceComponent
        serviceId={serviceId}
        projectId={projectId || undefined}
        onClose={deleteServiceModalOnClose}
        isOpen={deleteServiceModalIsOpen}
        modalProps={{ closeOnOverlayClick: false, isCentered: true }}
      />}

      {deploymentId && <ViewDeploymentComponent
        deploymentId={deploymentId}
        onClose={viewDeploymentModalOnClose}
        isOpen={viewDeploymentModalIsOpen}
        modalProps={{ closeOnOverlayClick: false, isCentered: false, size: "xl", }}
      />}

      <DeployGithubRepositoryComponent
        onClose={newServiceGithubModalOnClose}
        isOpen={Boolean(project && newServiceGithubModalIsOpen)}
        project={project}
        modalProps={{ isCentered: true, closeOnOverlayClick: false }}
      />
    </>
  );
}
