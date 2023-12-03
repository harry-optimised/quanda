import React, { useState } from 'react';
import { Dialog, Button, TrashIcon, Paragraph, Strong } from 'evergreen-ui';

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
      <Button
        appearance="primary"
        iconBefore={TrashIcon}
        onClick={() => setIsShown(true)}
      >
        Delete Item
      </Button>
    </>
  );
};

export default DeleteButton;
