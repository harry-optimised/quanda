import React from 'react';
import { Pane, Strong, Icon, IconComponent, Popover, Menu, Position } from 'evergreen-ui';
import theme from '../../theme';

type HeaderLink = {
  name: string;
  icon: IconComponent;
  disabled?: boolean;
  onClick: () => unknown;
  subHeadings?: HeaderLink[];
};

interface HeaderProps {
  links: HeaderLink[];
}

export function Header({ links }: HeaderProps) {
  const _links: React.ReactNode[] = [];
  links.forEach((link) => {
    if (!link.subHeadings) {
      _links.push(
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
      );
    } else {
      _links.push(
        <Popover
          position={Position.BOTTOM_RIGHT}
          content={
            <Menu>
              <Menu.Group>
                {link.subHeadings?.map((subHeading) => (
                  <Menu.Item
                    userSelect="none"
                    key={subHeading.name}
                    icon={subHeading.icon}
                    onSelect={subHeading.onClick}
                    disabled={subHeading.disabled}
                    cursor={subHeading.disabled ? null : 'pointer'}
                  >
                    {subHeading.name}
                  </Menu.Item>
                ))}
              </Menu.Group>
            </Menu>
          }
        >
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
        </Popover>
      );
    }
  });

  return (
    <Pane
      width="100%"
      height={48}
      backgroundColor={theme.colors.primary}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      userSelect="none"
    >
      <Pane display="flex" flexDirection="row" paddingLeft={16} alignItems="center">
        <img src="continuum_logo_white.png" alt="Logo" width={32} height={32} />
        <Strong color={theme.colors.background} marginLeft={8} fontFamily="Oxygen" fontSize={20}>
          Continuum
        </Strong>
      </Pane>
      <Pane display="flex" flexDirection="row" backgroundColor={theme.colors.primary} height={48} paddingRight={16}>
        {_links}
      </Pane>
    </Pane>
  );
}
