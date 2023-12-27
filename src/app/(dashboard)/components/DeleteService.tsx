"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  ModalProps,
  Text,
} from "@chakra-ui/react";
import { ApolloError, useMutation } from "@apollo/client";
import { ModalComponent } from "@/components/Modal";
import { Toast } from "@/lib/toast";
import {
  GET_RAILWAY_PROJECT,
} from "@/graphql/queries";
import { DELETE_RAILWAY_SERVICE_MUTATION } from "@/graphql/mutations";

type Props = {
  onClose: () => void;
  isOpen: boolean;
  buttonDisabled?: boolean;
  modalProps?: Partial<ModalProps>;
  serviceId: string;
  projectId?: string;
};

export const DeleteServiceComponent = (props: Props) => {
  const params = useParams();
  const projectId = params.id || props.projectId;
  const { isOpen, onClose } = props;

  const refetchQueries = useMemo(() => {
    let queries: any[] = [];

    if (projectId) {
      queries = [...queries, { query: GET_RAILWAY_PROJECT, variables: { projectId } }]
    }

    return queries;
  }, []);

  const [deleteRailwayService, { loading: deleteRailwayServiceLoading }] =
    useMutation(DELETE_RAILWAY_SERVICE_MUTATION, {
      refetchQueries,
    });

  const deleteService = async () => {
    try {
      await deleteRailwayService({
        variables: { id: props.serviceId },
      });

      props.onClose();
      Toast("Railway service removed successfully.", {
        type: "success",
        time: 5,
      });
    } catch (error) {
      if (error instanceof ApolloError) {
        Toast("Error while occured removing Railway service from project", {
          type: "error",
          time: 4,
        });
        return;
      }
    }
  };

  const processing = deleteRailwayServiceLoading;

  return (
    <ModalComponent
      title="Delete service"
      description={
        <Text fontWeight={400} fontSize={"12px"}>
          Remove this service from RunThrough
        </Text>
      }
      isOpen={isOpen}
      handleOnClose={() => {
        onClose();
      }}
      proceed={deleteService}
      proceedButtonText={processing ? "Please wait..." : "Continue"}
      buttonDisabled={processing}
      {...(props.modalProps || {})}
    >
      <Text fontSize={'14px'}>
        By clicking continue, you agree to remove this service - which contains: <br />
        - service instances <br />
        - linked repositories <br />
        - deployments <br />
        - logs <br />
      </Text>
    </ModalComponent>
  );
};
