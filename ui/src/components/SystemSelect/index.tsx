import React, { useMemo } from 'react';
import 'reactflow/dist/style.css';
import {
  Text,
  Popover,
  Menu,
  Position,
  Button,
  CaretDownIcon
} from 'evergreen-ui';

import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { System } from '../../types';

interface SecondaryFieldProps {
  onSave: (system: number) => void;
  system: number;
}

const SystemSelect: React.FC<SecondaryFieldProps> = ({ onSave, system }) => {
  const systems: System[] = useSelector((state: RootState) => state.systems);

  const capitalize = (s: string) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const popoverContent = useMemo(
    () =>
      capitalize(systems?.find((s) => s.id === system)?.name || 'No System'),
    [system, systems]
  );

  return (
    <>
      <Popover
        position={Position.BOTTOM_LEFT}
        content={({ close }) => (
          <Menu>
            <Menu.Group>
              {systems?.map((s, _) => (
                <Menu.Item
                  key={s.id}
                  onSelect={() => {
                    close();
                    onSave(s.id);
                  }}
                >
                  {capitalize(s.name)}
                </Menu.Item>
              ))}
            </Menu.Group>
          </Menu>
        )}
      >
        <Button appearance="text" size="small" iconAfter={CaretDownIcon}>
          <Text color="muted">Group: {popoverContent}</Text>
        </Button>
      </Popover>
    </>
  );
};

export default SystemSelect;
