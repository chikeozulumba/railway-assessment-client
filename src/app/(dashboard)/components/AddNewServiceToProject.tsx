import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { FormControl, FormErrorMessage, FormLabel, Input, ModalProps, Select, Text, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { ModalComponent } from "@/components/Modal";
import { Project } from "@/@types/project";
import { GET_RAILWAY_PROJECT, GET_RAILWAY_PROJECTS, USER_GITHUB_REPOSITORIES, USER_GITHUB_REPOSITORY_WITH_BRANCHES } from "@/graphql/queries";
import { Toast } from "@/lib/toast";
import { useSearchParams } from "next/navigation";
import { CREATE_NEW_RAILWAY_SERVICE_MUTATION } from "@/graphql/mutations";
import { EnvEditor } from "./EnvEditor";

type Props = {
  onClose: () => void;
  isOpen: boolean;
  buttonDisabled?: boolean;
  project: Project | undefined;
  modalProps?: Partial<ModalProps>;
};

const initialFormState = {
  name: undefined,
  branch: undefined,
  source: {
    image: undefined,
    repo: undefined,
  },
};

export const AddNewServiceToProjectComponent = (props: Props) => {
  const { isOpen, onClose, project } = props;

  const { data: repositories } = useQuery(USER_GITHUB_REPOSITORIES, {
    variables: { tokenId: project?.tokenId }
  });
  const { refetch } = useQuery(USER_GITHUB_REPOSITORY_WITH_BRANCHES, {
    skip: true,
  });

  const refetchQueriesAfterNewServiceAdded = useMemo(() => {
    let queries: any[] = [
      { query: GET_RAILWAY_PROJECTS },
    ];

    if (project) {
      queries = [...queries, { query: GET_RAILWAY_PROJECT, variables: { projectId: project.id } }]
    }

    return queries;
  }, [])

  const [addNewRailwayProjectService, { loading: addNewRailwayProjectServiceLoading }] =
    useMutation(CREATE_NEW_RAILWAY_SERVICE_MUTATION, {
      refetchQueries: refetchQueriesAfterNewServiceAdded,
    });

  const [branchesState, setBranchesState] = useState([]);
  const [branchesFetchingState, setBranchesFetchingState] = useState(false);
  const [sourceType, setSourceType] = useState<'repo' | 'image' | null>('repo');
  const [envVariables, setEnvVariables] = useState<{ key: string; value: string }[]>([]);

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: initialFormState,
  });

  function handleSourceTypeChange(evt: FormEvent<HTMLSelectElement>) {
    const value = evt.currentTarget.value as 'repo' | 'image';
    setSourceType(Boolean(value) ? value : null);
  }

  const handleRepositoryOnChange = async (
  ) => {
    try {
      const tokenId = project?.tokenId;
      const repo = getValues("source.repo");

      if (!repo || !tokenId) return;

      setBranchesState([]);
      setBranchesFetchingState(true);
      setValue("source.image", undefined);

      const { data } = await refetch({ tokenId, repo });
      setBranchesState(data?.fetchUserGithubRepositoryBranches || []);
    } catch (error) {
      Toast("Failed to retrieve repository branches.", {
        type: "error",
        time: 4,
      });
    } finally {
      setBranchesFetchingState(false);
    }
  };

  async function createNewRailwayService(data: typeof initialFormState) {
    try {
      if (!project?.id) {
        return Toast('Invalid project selected.', { time: 4 });
      }

      const payload = {
        ...data,
        projectId: project.id,
        variables: envVariables.length > 0 ? envVariables : undefined,
      }

      await addNewRailwayProjectService({ variables: { payload } });
      reset();
      onClose();
      Toast(`${payload.name} Service successfully added to ${project.name}`, {
        time: 4,
        type: "success"
      });
    } catch (error) {
      let message = 'Error occured while creating service';

      if (error instanceof ApolloError) {
        message = error.message
      }

      return Toast(message, { time: 4 });
    }
  }

  const formIsProcessing =
    addNewRailwayProjectServiceLoading || isSubmitting || branchesFetchingState;

  return (
    <ModalComponent
      title="Add new service"
      description={
        <Text fontWeight={400} fontSize={"14px"}>
          Add a new service to{" "}
          <strong style={{ textTransform: "capitalize" }}>
            {project?.name}
          </strong>{" "}
          by filling out the required fields below.
        </Text>
      }
      isOpen={isOpen}
      handleOnClose={() => {
        onClose();
        reset();
      }}
      proceed={handleSubmit(createNewRailwayService)}
      proceedButtonText={formIsProcessing ? "Please wait..." : "Create"}
      buttonDisabled={formIsProcessing}
      {...(props.modalProps || {})}
    >
      <form>
        <VStack spacing={4}>
          <FormControl isInvalid={Boolean(errors.name)}>
            <FormLabel
              htmlFor="name"
              fontSize={"small"}
              mb={1}
            >
              Name
            </FormLabel>
            <Input
              size={"sm"}
              id="name"
              placeholder="Service name"
              _focusVisible={{
                borderColor: Boolean(errors.name)
                  ? "red"
                  : "#000",
                borderWidth: Boolean(errors.name)
                  ? 1
                  : 1.5,
              }}
              {...register("name")}
            />
            <FormErrorMessage mt={1} fontWeight={500} fontSize={"xs"}>
              {errors.name &&
                String(errors.name.message)}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={Boolean(errors.source?.image)}>
            <FormLabel htmlFor="image" fontSize={"small"} mb={1}>
              Source
            </FormLabel>
            <Select
              size={"sm"}
              _focusVisible={{
                borderColor: "#000",
                borderWidth: 1.5,
              }}
              placeholder="Choose"
              onChange={handleSourceTypeChange}
              defaultValue={sourceType || undefined}
            >
              <option value={'repo'}>Github Repository</option>
              <option value={'image'}>Image</option>
            </Select>
          </FormControl>

          {sourceType === 'image' && <FormControl isInvalid={Boolean(errors.source?.image)}>
            <FormLabel
              htmlFor={`source-image`}
              fontSize={"small"}
              mb={1}
            >
              Docker Image
            </FormLabel>
            <Input
              size={"sm"}
              id={`source-${sourceType}`}
              placeholder="Provide full name on Docker registry"
              _focusVisible={{
                borderColor: Boolean(errors.source?.[sourceType])
                  ? "red"
                  : "#000",
                borderWidth: Boolean(errors.source?.[sourceType])
                  ? 1
                  : 1.5,
              }}
              {...register(`source.image`)}
            />
            <FormErrorMessage mt={1} fontWeight={500} fontSize={"xs"}>
              {errors.source?.image &&
                String(errors.source?.image?.message)}
            </FormErrorMessage>
          </FormControl>}

          {sourceType === 'repo' && <> <FormControl isInvalid={Boolean(errors.source?.repo)}>
            <FormLabel htmlFor="repo" fontSize={"small"} mb={1}>
              Choose repository
            </FormLabel>
            <Select
              size={"sm"}
              _focusVisible={{
                borderColor: Boolean(errors.source?.repo)
                  ? "red"
                  : "#000",
                borderWidth: Boolean(errors.source?.repo) ? 1 : 1.5,
              }}
              placeholder="Choose"
              {...register("source.repo", {
                onChange: handleRepositoryOnChange,
              })}
            >
              {repositories?.fetchUserGithubRepositories?.map(
                (repo: any) => (
                  <option key={repo.id} value={repo.fullName}>
                    {repo.fullName}
                  </option>
                )
              )}
            </Select>
            <FormErrorMessage mt={1} fontWeight={500} fontSize={"xs"}>
              {errors.source?.repo &&
                String(errors.source?.repo.message)}
            </FormErrorMessage>
          </FormControl>

            {branchesState.length > 0 && (
              <FormControl isInvalid={Boolean(errors.branch)}>
                <FormLabel htmlFor="branch" fontSize={"small"} mb={1}>
                  Repository branch
                </FormLabel>
                <Select
                  size={"sm"}
                  _focusVisible={{
                    borderColor: Boolean(errors.branch)
                      ? "red"
                      : "#000",
                    borderWidth: Boolean(errors.branch) ? 1 : 1.5,
                  }}
                  placeholder="Choose"
                  {...register("branch")}
                >
                  {branchesState?.map((branch: any) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage mt={1} fontWeight={500} fontSize={"xs"}>
                  {errors.branch && String(errors.branch.message)}
                </FormErrorMessage>
              </FormControl>
            )}

          </>}
          <EnvEditor setEnvVariables={setEnvVariables} />
        </VStack>
      </form>
    </ModalComponent>
  );
};
