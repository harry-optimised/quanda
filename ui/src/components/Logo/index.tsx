import React from 'react';
import { Pane, Heading } from 'evergreen-ui';
import theme from '../../theme';

function Logo() {
  return (
    <Pane
      padding={4}
      display="flex"
      marginLeft={30}
      borderRadius={4}
      backgroundColor={theme.colors.tint6}
    >
      <Heading padding={4} paddingRight={0} color={theme.colors.accent}>
        Qu
      </Heading>
      <Heading
        padding={4}
        paddingLeft={0}
        paddingRight={0}
        color={theme.colors.background}
      >
        anda
      </Heading>
      <Heading
        padding={4}
        paddingLeft={0}
        color={theme.colors.background}
      ></Heading>
    </Pane>
  );
}

export default Logo;
