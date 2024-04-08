import React from 'react';
import { Pane, Paragraph, Spinner } from 'evergreen-ui';
import theme from '../../theme';

export function LoadingScreen() {
  return (
    <Pane
      className="App"
      width="100%"
      height="100vh"
      display="flex"
      flexDirection="column"
      backgroundColor={theme.colors.tint3}
      justifyContent="center"
      alignItems="center"
    >
      <Spinner size={48} marginBottom={32} />
      <Paragraph color={theme.colors.primary} marginLeft={16}>
        Just setting up...
      </Paragraph>
    </Pane>
  );
}
