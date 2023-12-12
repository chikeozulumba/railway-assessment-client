"use client";

import { ChangeEvent, useState } from "react";
import {
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ModalProps,
  Select,
  Switch,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { ModalComponent } from "@/components/Modal";
import { useTokenStore } from "@/store/token";
import { useAuthStore } from "@/store/auth";
import { Toast } from "@/lib/toast";
import {
  GET_RAILWAY_PROJECTS,
  USER_GITHUB_REPOSITORIES,
  USER_GITHUB_REPOSITORY_WITH_BRANCHES,
} from "@/graphql/queries";
import { CREATE_NEW_RAILWAY_PROJECT_MUTATION } from "@/graphql/mutations";

type Props = {
  onClose: () => void;
  handleSubmit: (data?: any) => void;
  isOpen: boolean;
  buttonDisabled?: boolean;
  modalProps?: Partial<ModalProps>;
};

const initialFormState = {
  tokenId: undefined,
  name: undefined,
  description: undefined,
  prDeploys: false,
  isPublic: false,
  defaultEnvironmentName: "production",
  repo: {
    fullRepoName: undefined,
    branch: undefined,
  },
};

export const CreateNewProjectComponent = (props: Props) => {
  const { data: repositories } = useQuery(USER_GITHUB_REPOSITORIES);

  const { state: tokens } = useTokenStore();
  const { state: authState } = useAuthStore();

  const { isOpen, onClose } = props;
  const {
    handleSubmit,
    watch,
    register,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialFormState,
  });

  const { refetch } = useQuery(USER_GITHUB_REPOSITORY_WITH_BRANCHES, {
    skip: true,
  });

  const [branchesState, setBranchesState] = useState([]);
  const [branchesFetchingState, setBranchesFetchingState] = useState(false);

  const tokenIdValue = watch("tokenId");

  const showTokenInput = !authState.data?.activeRailwayToken;

  const tokenIdIsPresent =
    !showTokenInput ||
    (typeof tokenIdValue === "string" && String(tokenIdValue).length > 0);

  const handleRepositoryOnChange = async (
    evt: ChangeEvent<HTMLSelectElement>
  ) => {
    try {
      const tokenId = getValues("tokenId");
      const repoId = getValues("repo.fullRepoName");
      if (!repoId || !tokenId) return;

      setBranchesState([]);
      setBranchesFetchingState(true);
      setValue("repo.branch", undefined);

      const { data } = await refetch({ tokenId, repoId });
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

  const [createNewRailwayProject, { loading: createNewRailwayProjectLoading }] =
    useMutation(CREATE_NEW_RAILWAY_PROJECT_MUTATION, {
      refetchQueries: [{ query: GET_RAILWAY_PROJECTS }],
    });

  const createNewProject = async (payload: typeof initialFormState) => {
    try {
      const { data } = await createNewRailwayProject({
        variables: { payload },
      });
      props.onClose();
      Toast("Railway project created successfully.", {
        type: "success",
        time: 5,
      });
      console.log(data);
    } catch (error) {
      if (error instanceof ApolloError) {
        Toast("Error while creating Railway project", {
          type: "error",
          time: 4,
        });
        return;
      }
    }
  };

  const collectFormData = (data: typeof initialFormState) => {
    const repoId = data.repo.fullRepoName;
    const branch = data.repo.branch;

    if (typeof repoId === "string") {
      const findRepo = repositories?.fetchUserGithubRepositories?.find(
        (r: any) => r.id === repoId
      );

      if (!findRepo) return;
      data.repo.fullRepoName = findRepo.fullName;

      if (typeof branch !== "string" || branch === "") {
        data.repo.branch = findRepo.defaultBranch;
      }
    }

    createNewProject(data);
  };

  const formIsProcessing =
    createNewRailwayProjectLoading || isSubmitting || branchesFetchingState;

  return (
    <ModalComponent
      title="Create new project"
      description={
        <Text fontWeight={400} fontSize={"14px"}>
          Create a new project by filling out the required fields below.
        </Text>
      }
      isOpen={isOpen}
      handleOnClose={onClose}
      proceed={handleSubmit(collectFormData)}
      proceedButtonText={formIsProcessing ? "Please wait..." : "Create"}
      buttonDisabled={formIsProcessing}
      {...(props.modalProps || {})}
    >
      <form>
        <VStack spacing={4}>
          {showTokenInput && (
            <FormControl isInvalid={Boolean(errors.tokenId)}>
              <FormLabel htmlFor="tokenId" fontSize={"small"} mb={1}>
                Choose API token
              </FormLabel>
              <Select
                size={"sm"}
                _focusVisible={{
                  borderColor: Boolean(errors.tokenId) ? "red" : "#000",
                  borderWidth: Boolean(errors.tokenId) ? 1 : 1.5,
                }}
                placeholder="Choose"
                {...register("tokenId", { onChange: handleRepositoryOnChange })}
              >
                {tokens.map((token) => (
                  <option key={token.id} value={token.id}>
                    {token.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage mt={1} fontWeight={500} fontSize={"xs"}>
                {errors.tokenId && String(errors.tokenId.message)}
              </FormErrorMessage>
            </FormControl>
          )}

          {tokenIdIsPresent && (
            <>
              <Divider />

              <FormControl isInvalid={Boolean(errors.name)} isRequired>
                <FormLabel htmlFor="name" fontSize={"small"} mb={1}>
                  Project name
                </FormLabel>
                <Input
                  size={"sm"}
                  id="name"
                  placeholder="Enter project name"
                  {...register("name", {
                    required: "This field is required",
                  })}
                  _focusVisible={{
                    borderColor: Boolean(errors.name) ? "red" : "#000",
                    borderWidth: Boolean(errors.name) ? 1 : 1.5,
                  }}
                />
                <FormErrorMessage mt={1} fontWeight={500} fontSize={"xs"}>
                  <Text>{errors.name && String(errors.name.message)}</Text>
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={Boolean(errors.description)}>
                <FormLabel htmlFor="description" fontSize={"small"} mb={1}>
                  Project description
                </FormLabel>
                <Textarea
                  size={"sm"}
                  id="description"
                  placeholder="Enter project description"
                  resize={"none"}
                  _focusVisible={{
                    borderColor: Boolean(errors.description) ? "red" : "#000",
                    borderWidth: Boolean(errors.description) ? 1 : 1.5,
                  }}
                  rows={2}
                  {...register("description", {
                    maxLength: {
                      value: 200,
                      message: "Maximum of 250 characters for this field",
                    },
                  })}
                />
                <FormErrorMessage mt={1} fontWeight={500} fontSize={"xs"}>
                  {errors.description && String(errors.description.message)}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={Boolean(errors.repo?.fullRepoName)}>
                <FormLabel htmlFor="fullRepoName" fontSize={"small"} mb={1}>
                  Instantiate repository
                </FormLabel>
                <Select
                  size={"sm"}
                  _focusVisible={{
                    borderColor: Boolean(errors.repo?.fullRepoName)
                      ? "red"
                      : "#000",
                    borderWidth: Boolean(errors.repo?.fullRepoName) ? 1 : 1.5,
                  }}
                  placeholder="Choose"
                  {...register("repo.fullRepoName", {
                    onChange: handleRepositoryOnChange,
                  })}
                >
                  {repositories?.fetchUserGithubRepositories?.map(
                    (repo: any) => (
                      <option key={repo.id} value={repo.id}>
                        {repo.fullName}
                        {repo.isPrivate ? " - private" : ""}
                      </option>
                    )
                  )}
                </Select>
                <FormErrorMessage mt={1} fontWeight={500} fontSize={"xs"}>
                  {errors.repo?.fullRepoName &&
                    String(errors.repo?.fullRepoName.message)}
                </FormErrorMessage>
              </FormControl>

              {branchesState.length > 0 && (
                <FormControl isInvalid={Boolean(errors.repo?.branch)}>
                  <FormLabel htmlFor="branch" fontSize={"small"} mb={1}>
                    Repository branch
                  </FormLabel>
                  <Select
                    size={"sm"}
                    _focusVisible={{
                      borderColor: Boolean(errors.repo?.branch)
                        ? "red"
                        : "#000",
                      borderWidth: Boolean(errors.repo?.branch) ? 1 : 1.5,
                    }}
                    placeholder="Choose"
                    {...register("repo.branch")}
                  >
                    {branchesState?.map((branch: any) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage mt={1} fontWeight={500} fontSize={"xs"}>
                    {errors.repo?.branch && String(errors.repo?.branch.message)}
                  </FormErrorMessage>
                </FormControl>
              )}

              <FormControl isInvalid={Boolean(errors.defaultEnvironmentName)}>
                <FormLabel
                  htmlFor="defaultEnvironmentName"
                  fontSize={"small"}
                  mb={1}
                >
                  Environment
                </FormLabel>
                <Input
                  size={"sm"}
                  id="defaultEnvironmentName"
                  placeholder="Environment name"
                  _focusVisible={{
                    borderColor: Boolean(errors.defaultEnvironmentName)
                      ? "red"
                      : "#000",
                    borderWidth: Boolean(errors.defaultEnvironmentName)
                      ? 1
                      : 1.5,
                  }}
                  {...register("defaultEnvironmentName")}
                />
                <FormErrorMessage mt={1} fontWeight={500} fontSize={"xs"}>
                  {errors.defaultEnvironmentName &&
                    String(errors.defaultEnvironmentName.message)}
                </FormErrorMessage>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="prDeploys" fontSize={"small"} mb="0">
                  Deploy using pull requests?
                </FormLabel>
                <Switch
                  onChange={(e) => setValue("prDeploys", e.target.checked)}
                  id="prDeploys"
                  size={"sm"}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="isPublic" fontSize={"small"} mb="0">
                  Make this project public?
                </FormLabel>
                <Switch
                  onChange={(e) => setValue("isPublic", e.target.checked)}
                  id="isPublic"
                  size={"sm"}
                />
              </FormControl>
            </>
          )}
        </VStack>
      </form>
    </ModalComponent>
  );
};
