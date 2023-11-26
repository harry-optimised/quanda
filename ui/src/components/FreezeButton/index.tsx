import React, { useState, useCallback } from 'react';
import { Pane, Dialog, TextInput, IconButton } from 'evergreen-ui';
import { SnowflakeIcon } from 'evergreen-ui';
import { set } from 'lodash';

interface FreezeButtonProps {
  onSave: (frozen: boolean) => void;
  frozen: boolean;
}

const FreezeButton: React.FC<FreezeButtonProps> = ({
  onSave: parentOnSave,
  frozen
}) => {
  const [isDialogShown, setIsDialogShown] = useState(false);
  const [unfreezeText, setUnfreezeText] = useState<string>('');

  const onToggleFrozen = useCallback(() => {
    setUnfreezeText('');
    if (frozen) {
      setIsDialogShown(true);
    } else {
      parentOnSave(!frozen);
    }
  }, [frozen]);

  const localOnSave = () => {
    setIsDialogShown(false);
    parentOnSave(false);
  };

  return (
    <Pane>
      <Dialog
        isShown={isDialogShown}
        title="Unfreeze Item"
        onCloseComplete={() => setIsDialogShown(false)}
        confirmLabel="Unfreeze"
        isConfirmDisabled={unfreezeText !== 'unfreeze'}
        onConfirm={localOnSave}
      >
        <p>Type 'unfreeze' to confirm</p>
        <TextInput
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUnfreezeText(e.target.value)
          }
          value={unfreezeText}
        />
      </Dialog>

      <IconButton icon={SnowflakeIcon} marginTop={8} onClick={onToggleFrozen} />
    </Pane>
  );
};

export default FreezeButton;
