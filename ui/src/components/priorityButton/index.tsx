import React, { useState, useCallback } from 'react';
import {
  Pane,
  Dialog,
  TextInput,
  IconButton,
  HighPriorityIcon
} from 'evergreen-ui';
import { SnowflakeIcon } from 'evergreen-ui';
import { set } from 'lodash';

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
