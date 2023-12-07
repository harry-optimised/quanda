import React from 'react';
import { Pane, Strong, Icon } from 'evergreen-ui';
import theme from '../../theme';

type HeaderLink = {
  name: string;
  icon: JSX.Element;
  onClick: () => unknown;
};

interface HeaderProps {
  links: HeaderLink[];
  disabled?: boolean;
}

export function Header({ links, disabled }: HeaderProps) {
  return (
    <Pane
      width="100%"
      height={48}
      backgroundColor={theme.colors.tint6}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      userSelect="none"
    >
      <Pane display="flex" flexDirection="row" paddingLeft={16}></Pane>
      <Pane
        display="flex"
        flexDirection="row"
        backgroundColor={theme.colors.tint6}
        height={48}
        paddingRight={16}
        pointerEvents={disabled ? 'none' : 'auto'}
        opacity={disabled ? 0.5 : 1}
      >
        {links.map((link) => (
          <Pane
            display="flex"
            flexDirection="row"
            alignItems="center"
            marginLeft={32}
            key={link.name}
            cursor="pointer"
            userSelect="none"
            onClick={link.onClick}
          >
            <Icon icon={link.icon} color={theme.colors.background} size={16} marginRight={8} />
            <Strong color={theme.colors.background}>{link.name}</Strong>
          </Pane>
        ))}
      </Pane>
    </Pane>
  );
}
