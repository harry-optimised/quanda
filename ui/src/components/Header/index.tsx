import React from 'react';
import { Pane, Strong, Icon, IconComponent } from 'evergreen-ui';
import theme from '../../theme';

type HeaderLink = {
  name: string;
  icon: IconComponent;
  disabled?: boolean;
  onClick: () => unknown;
};

interface HeaderProps {
  links: HeaderLink[];
}

export function Header({ links }: HeaderProps) {
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
      <Pane display="flex" flexDirection="row" paddingLeft={16} alignItems="center">
        <img src="logo512white.png" alt="Quanda Logo" width={32} height={32} />
        <Strong color={theme.colors.background} marginLeft={8} fontFamily="Lora" fontSize={20}>
          Quanda
        </Strong>
      </Pane>
      <Pane display="flex" flexDirection="row" backgroundColor={theme.colors.tint6} height={48} paddingRight={16}>
        {links.map((link) => (
          <Pane
            display="flex"
            flexDirection="row"
            alignItems="center"
            marginLeft={32}
            key={link.name}
            cursor="pointer"
            userSelect="none"
            pointerEvents={link.disabled ? 'none' : 'auto'}
            opacity={link.disabled ? 0.5 : 1}
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
