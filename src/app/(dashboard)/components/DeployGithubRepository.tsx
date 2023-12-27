import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { FormControl, FormErrorMessage, FormLabel, Input, ModalProps, Select, Text, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { ModalComponent } from "@/components/Modal";
import { Project } from "@/@types/project";
import { USER_GITHUB_REPOSITORIES } from "@/graphql/queries";
import { Toast } from "@/lib/toast";
import { DEPLOY_GITHUB_REPO_TO_PROJECT } from "@/graphql/mutations";

type Props = {
  onClose: () => void;
  isOpen: boolean;
  buttonDisabled?: boolean;
  project: Project | undefined;
  modalProps?: Partial<ModalProps>;
};

const initialFormState = {
  repo: undefined,
  customRepositoruUrl: undefined,
};

export const DeployGithubRepositoryComponent = (props: Props) => {
  const { isOpen, onClose, project } = props;

  const { data: repositories } = useQuery(USER_GITHUB_REPOSITORIES, {
    variables: { tokenId: project?.tokenId }
  });

  const [deployGithubRepo, { loading: deployGithubRepoLoading }] =
    useMutation(DEPLOY_GITHUB_REPO_TO_PROJECT);

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: initialFormState,
  });

  async function deployGithubRepository(data: typeof initialFormState) {
    try {
      if (!project?.id) {
        return Toast('Invalid project selected.', { time: 4 });
      }

      const payload = {
        repo: String(data.repo),
        projectId: project.id,
      }

      if (typeof data.customRepositoruUrl === 'string' && data.customRepositoruUrl !== '') {
        const [repo, username] = String(data.customRepositoruUrl).split('/').reverse();
        if (repo && username) {
          payload.repo = `${username}/${repo}`
        }
      }

      await deployGithubRepo({ variables: { ...payload } });
      reset();
      onClose();
      Toast(`Repository has been deployed successfully on ${project.name}`, {
        time: 4,
        type: "success"
      });
    } catch (error) {
      let message = 'Error occured while creating service';

      if (error instanceof ApolloError) {
        message = error.message
      }

      return Toast(message, { time: 4, type: "error" });
    }
  }

  const formIsProcessing =
    deployGithubRepoLoading || isSubmitting;

  const isCustomRepositoryRequired = watch('repo') === 'custom-repository-url';

  return (
    <ModalComponent
      title="Deploy GitHub repository"
      description={
        <Text fontWeight={400} fontSize={"12px"}>
          Deploy repository found on your connected Github account{" "}
          by filling out the required fields below.
        </Text>
      }
      isOpen={isOpen}
      handleOnClose={() => {
        onClose();
        reset();
      }}
      proceed={handleSubmit(deployGithubRepository)}
      proceedButtonText={formIsProcessing ? "Please wait..." : "Deploy"}
      buttonDisabled={formIsProcessing}
      {...(props.modalProps || {})}
    >
      <form>
        <VStack spacing={4}>
          <FormControl isInvalid={Boolean(errors.repo)}>
            <FormLabel htmlFor="repo" fontSize={"small"} mb={1}>
              Choose repository
            </FormLabel>
            <Select
              size={"sm"}
              _focusVisible={{
                borderColor: Boolean(errors.repo)
                  ? "red"
                  : "#000",
                borderWidth: Boolean(errors.repo) ? 1 : 1.5,
              }}
              placeholder="Choose"
              {...register("repo", {
                required: true,
              })}
            >
              <optgroup label="Additional Options">
                <option value="custom-repository-url">Provide github repository</option>
              </optgroup>
              <optgroup label="Your public repositories">
                {repositories?.fetchUserGithubRepositories?.filter((repo: any) => repo.isPrivate !== true).map(
                  (repo: any) => (
                    <option key={repo.id} value={repo.fullName}>
                      {repo.fullName}
                    </option>
                  )
                )}
              </optgroup>
            </Select>
            <FormErrorMessage mt={1} fontWeight={500} fontSize={"xs"}>
              {errors.repo &&
                String(errors.repo.message)}
            </FormErrorMessage>
          </FormControl>

          {isCustomRepositoryRequired && <FormControl isInvalid={Boolean(errors.customRepositoruUrl)}>
            <FormLabel
              htmlFor="customRepositoruUrl"
              fontSize={"small"}
              mb={1}
            >
              Enter Github URL
            </FormLabel>
            <Input
              size={"sm"}
              id="customRepositoruUrl"
              placeholder="Enter Gihub repository URL"
              _focusVisible={{
                borderColor: Boolean(errors.customRepositoruUrl)
                  ? "red"
                  : "#000",
                borderWidth: Boolean(errors.customRepositoruUrl)
                  ? 1
                  : 1.5,
              }}
              {...register("customRepositoruUrl", {
                required: isCustomRepositoryRequired,
              })}
            />
            <FormErrorMessage mt={1} fontWeight={500} fontSize={"xs"}>
              {errors.customRepositoruUrl &&
                String(errors.customRepositoruUrl.message)}
            </FormErrorMessage>
          </FormControl>}
        </VStack>
      </form>
    </ModalComponent>
  );
};
