import React, { useState, useCallback } from 'react';
import {
  Pane,
  Dialog,
  TextInput,
  IconButton,
  HighPriorityIcon,
  Button,
  TrashIcon,
  Text,
  Paragraph,
  Strong
} from 'evergreen-ui';
import { SnowflakeIcon } from 'evergreen-ui';
import { set } from 'lodash';

interface DeleteButtonProps {
  onDelete: () => void;
  primary: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete, primary }) => {
  const [isShown, setIsShown] = useState(false);
  return (
    <>
      <Dialog
        isShown={isShown}
        title="Delete this item?"
        onCloseComplete={() => setIsShown(false)}
        confirmLabel="Delete"
        onConfirm={() => {
          onDelete();
          setIsShown(false);
        }}
      >
        <Paragraph style={{ marginBottom: 8 }}>
          Are you sure you want to permanently delete the following item?
        </Paragraph>
        <Strong>{primary}</Strong>
      </Dialog>
      <Button iconBefore={TrashIcon} onClick={() => setIsShown(true)}>
        Delete
      </Button>
    </>
  );
};

export default DeleteButton;
