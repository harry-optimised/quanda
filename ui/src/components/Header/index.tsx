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
                  <Menu.Item key={subHeading.name} icon={subHeading.icon} onSelect={subHeading.onClick}>
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
        {_links}
      </Pane>
    </Pane>
  );
}
