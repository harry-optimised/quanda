import React, { useCallback } from 'react';
import { IconButton, HighPriorityIcon } from 'evergreen-ui';

interface PriorityButtonProps {
  onSave: (priority: boolean) => void;
  priority: boolean;
}

const PriorityButton: React.FC<PriorityButtonProps> = ({
  onSave: parentOnSave,
  priority
}) => {
  const onTogglePriority = useCallback(() => {
    parentOnSave(!priority);
  }, [priority]);

  return (
    <IconButton
      icon={HighPriorityIcon}
      marginTop={8}
      onClick={onTogglePriority}
      intent={priority ? 'danger' : 'none'}
    />
  );
};

export default PriorityButton;
