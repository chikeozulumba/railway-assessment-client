import { ModalProps, Stack, Text } from "@chakra-ui/react";
import { ModalComponent } from "@/components/Modal";
import { Project } from "@/@types/project";

type Props = {
  onClose: () => void;
  handleSubmit: () => void;
  isOpen: boolean;
  buttonDisabled?: boolean;
  project: Project | undefined;
  modalProps?: Partial<ModalProps>;
};

export const AddNewServiceToProjectComponent = (props: Props) => {
  const { isOpen, onClose, handleSubmit, project } = props;

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
      handleOnClose={onClose}
      proceed={handleSubmit}
      proceedButtonText="Continue"
      {...(props.modalProps || {})}
    >
      <Stack spacing={4}></Stack>
    </ModalComponent>
  );
};
