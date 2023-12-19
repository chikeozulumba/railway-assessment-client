import { Box } from "@chakra-ui/react"
import { ProjectBreadCrumbs } from "../../projects/components/Breadcrumbs"

const ViewProjectServicePage = () => {
  return <>
  {/* {project && <ProjectBreadCrumbs items={[
      { name: project.name || 'Project', path: `/projects/${project.id}`, currentPage: true }
    ]} />} */}

    <Box bg={"#fff"} p={4} border={1} boxShadow="xs"
      borderWidth={1}
      borderRadius={"8px"}
      overflow={"hidden"}
      borderColor={"#F4EAE0"}>
        </Box>
    </>
}

export default ViewProjectServicePage;
