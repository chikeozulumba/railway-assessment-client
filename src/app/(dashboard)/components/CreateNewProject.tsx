"use client";

import { ChangeEvent, useMemo, useState } from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ModalProps,
  Select,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { ModalComponent } from "@/components/Modal";
import { Toast } from "@/lib/toast";
import {
  GET_PROFILE_AND_RAILWAY_TOKENS,
  GET_RAILWAY_PROJECTS,
  USER_GITHUB_REPOSITORIES,
  USER_GITHUB_REPOSITORY_WITH_BRANCHES,
} from "@/graphql/queries";
import { CREATE_NEW_RAILWAY_PROJECT_MUTATION } from "@/graphql/mutations";
import { RailwayToken } from "@/@types/token";

type Props = {
  onClose: () => void;
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
  const { data: repositories, refetch: refetchRepositories } = useQuery(USER_GITHUB_REPOSITORIES, {
    skip: true,
  });

  const { data } = useQuery(GET_PROFILE_AND_RAILWAY_TOKENS);
  const { refetch } = useQuery(USER_GITHUB_REPOSITORY_WITH_BRANCHES, {
    skip: true,
  });

  const { isOpen, onClose } = props;
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialFormState,
  });

  const tokens: RailwayToken[] = useMemo(() => (data?.getRailwayTokens || [])
    .sort((a: RailwayToken, b: RailwayToken) => Number(b.isDefault) - Number(a.isDefault)), [])

  const [branchesState, setBranchesState] = useState([]);
  const [branchesFetchingState, setBranchesFetchingState] = useState(false);

  const [fetchedRepos, setFetchedRepos] = useState('idle')
  const [repos, setRepos] = useState<any[]>([])

  const handleTokenSelected = async (evt: ChangeEvent<HTMLInputElement>) => {
    try {
      const tokenId = evt.target.value;
      if (!tokenId) return;

      const { data } = await refetchRepositories({ tokenId });
      setFetchedRepos('fetched');
      setRepos(data?.fetchUserGithubRepositories || []);
    } catch (error) {
      setFetchedRepos('error');
      Toast('Failed to retrieve project repositories.', { time: 4 });
    }
  }

  const handleRepositoryOnChange = async (
    evt: ChangeEvent<HTMLSelectElement>
  ) => {
    try {
      const tokenId = getValues("tokenId");
      const repo = getValues("repo.fullRepoName");
      if (!repo || !tokenId) return;

      setBranchesState([]);
      setBranchesFetchingState(true);
      setValue("repo.branch", undefined);

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

  const [createNewRailwayProject, { loading: createNewRailwayProjectLoading }] =
    useMutation(CREATE_NEW_RAILWAY_PROJECT_MUTATION, {
      refetchQueries: [{ query: GET_RAILWAY_PROJECTS }],
    });

  const createNewProject = async (payload: typeof initialFormState) => {
    try {
      await createNewRailwayProject({
        variables: { payload },
      });

      reset();
      props.onClose();
      Toast("Railway project created successfully.", {
        type: "success",
        time: 5,
      });
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
    const repo = data.repo.fullRepoName;
    const branch = data.repo.branch;

    if (typeof repo === "string") {
      const findRepo = repos?.find(
        (r: any) => r.id === repo
      );

      if (findRepo) {
        data.repo.fullRepoName = findRepo.fullName;

        if (typeof branch !== "string" || branch === "") {
          data.repo.branch = findRepo.defaultBranch;
        }
      };
    }

    createNewProject(data);
  };

  const formIsProcessing =
    createNewRailwayProjectLoading || isSubmitting || branchesFetchingState;

  return (
    <ModalComponent
      title="Create new project"
      description={
        <Text fontWeight={400} fontSize={"12px"}>
          Create a new project by filling out the required fields below.
        </Text>
      }
      isOpen={isOpen}
      handleOnClose={() => {
        onClose();
        reset();
      }}
      proceed={handleSubmit(collectFormData)}
      proceedButtonText={formIsProcessing ? "Please wait..." : "Create"}
      buttonDisabled={formIsProcessing}
      {...(props.modalProps || {})}
    >
      <form>
        <VStack spacing={4}>
          {tokens.length > 0 && (
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
                {...register("tokenId", { onChange: handleTokenSelected })}
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

          {fetchedRepos === 'fetched' && repos.length > 0 && (
            <>
              <FormControl isInvalid={Boolean(errors.repo?.fullRepoName)}>
                <FormLabel htmlFor="fullRepoName" fontSize={"small"} mb={1}>
                  Initialize with repository
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
                  {repos.map(
                    (repo: any) => (
                      <option key={repo.id} value={repo.fullName}>
                        {repo.fullName}
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
                  Default Environment
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
