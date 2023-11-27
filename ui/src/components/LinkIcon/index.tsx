import React from 'react';
import { Pane, Icon, Text, FlowEndIcon, FlowLinearIcon } from 'evergreen-ui';
import { ExchangeIcon } from 'evergreen-ui';
import theme from '../../theme';

const ICONS = {
  relates_to: ExchangeIcon,
  supports: FlowEndIcon,
  supported_by: FlowLinearIcon
};

const TEXT = {
  relates_to: 'Related to',
  supports: 'Supports',
  supported_by: 'Supported by'
};

function LinkIcon({ type }: { type: string }) {
  const icon = ICONS[type as keyof typeof ICONS];
  const text = TEXT[type as keyof typeof TEXT];
  return (
    <Pane
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minWidth={80}
      marginRight={16}
    >
      <Icon icon={icon} size={32} color={theme.colors.tint6} />
      <Text size={300} color={theme.colors.tint6}>
        {text}
      </Text>
    </Pane>
  );
}

export default LinkIcon;
