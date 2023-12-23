"use client";

import {
  Box,
  ModalProps,
  Text,
} from "@chakra-ui/react";
import { ApolloError, useMutation } from "@apollo/client";
import { ModalComponent } from "@/components/Modal";
import { Toast } from "@/lib/toast";
import {
  GET_RAILWAY_PROJECTS,
} from "@/graphql/queries";
import { DELETE_RAILWAY_PROJECT_MUTATION } from "@/graphql/mutations";

type Props = {
  onClose: () => void;
  isOpen: boolean;
  buttonDisabled?: boolean;
  modalProps?: Partial<ModalProps>;
  projectId: string;
};

export const DeleteProjectComponent = (props: Props) => {

  const { isOpen, onClose } = props;

  const [deleteRailwayProject, { loading: deleteRailwayProjectLoading }] =
    useMutation(DELETE_RAILWAY_PROJECT_MUTATION, {
      refetchQueries: [{ query: GET_RAILWAY_PROJECTS }],
    });

  const deleteProject = async () => {
    try {
      await deleteRailwayProject({
        variables: { id: props.projectId },
      });

      props.onClose();
      Toast("Railway project created successfully.", {
        type: "success",
        time: 5,
      });
    } catch (error) {
      if (error instanceof ApolloError) {
        Toast("Error while occured removing Railway project", {
          type: "error",
          time: 4,
        });
        return;
      }
    }
  };

  const processing = deleteRailwayProjectLoading;

  return (
    <ModalComponent
      title="Delete project"
      description={
        <Text fontWeight={400} fontSize={"12px"}>
          Remove this project from RunThrough
        </Text>
      }
      isOpen={isOpen}
      handleOnClose={() => {
        onClose();
      }}
      proceed={deleteProject}
      proceedButtonText={processing ? "Please wait..." : "Continue"}
      buttonDisabled={processing}
      {...(props.modalProps || {})}
    >
      <Text fontSize={'14px'}>
        By clicking continue, you agree to remove this project - which contains: <br />
        - services <br />
        - service instances <br />
        - linked repositories <br />
      </Text>
    </ModalComponent>
  );
};
