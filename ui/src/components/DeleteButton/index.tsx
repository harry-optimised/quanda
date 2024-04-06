import React, { useState } from 'react';
import { Dialog, Button, TrashIcon, Paragraph, Strong, Icon } from 'evergreen-ui';
import theme from '../../theme';

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
      <Icon icon={TrashIcon} onClick={() => setIsShown(true)} color={theme.colors.tint5} />
    </>
  );
};

export default DeleteButton;
