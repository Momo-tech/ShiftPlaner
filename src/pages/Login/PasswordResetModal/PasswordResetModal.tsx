import { Modal, TextInput } from "@mantine/core";
import { useState } from "react";
import { ModalFooter } from "../../../components/ModalFooter/ModalFooter";

interface PasswordRestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: (email: string) => void;
}
export const PasswordResetModal = (props: PasswordRestModalProps) => {
  const [email, setEmail] = useState("");

  return (
    <Modal
      title="Password zurücksetzen"
      onClose={props.onClose}
      opened={props.isOpen}
    >
      <TextInput
        value={email}
        label="Email"
        placeholder="Email"
        onChange={(value) => setEmail(value.currentTarget.value)}
      />

      <ModalFooter
        onSave={() => props.onReset(email)}
        onDismiss={props.onClose}
        saveLabel="Password zurücksetzen"
      />
    </Modal>
  );
};
