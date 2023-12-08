import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Heading, TextInput, Pane, Icon, EditIcon, Label } from 'evergreen-ui';
import theme from '../../theme';

interface PrimaryFieldProps {
  onSave: (primary: string) => void;
  primary: string;
}

const PrimaryField: React.FC<PrimaryFieldProps> = ({ onSave: parentOnSave, primary }) => {
  const [editMode, setEditMode] = useState(false);
  const [editablePrimary, setEditablePrimary] = useState(primary);
  const [hover, setHover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editMode]);

  useEffect(() => {
    setEditablePrimary(primary);
  }, [primary]);

  const onEnterEdit = useCallback(() => {
    setEditMode(true);
    setHover(false);
  }, []);

  const onSave = useCallback(() => {
    setEditMode(false);
    setHover(false);
    parentOnSave(editablePrimary);
  }, [editablePrimary]);

  const onChangePrimary = useCallback(
    (primary: string) => {
      setEditablePrimary(primary);
    },
    [primary]
  );

  const viewUI = (
    <Pane
      cursor="pointer"
      textAlign="left"
      onClick={onEnterEdit}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <Heading size={800} color={theme.colors.tint6}>
        {primary}
      </Heading>
      <Icon
        icon={EditIcon}
        size={24}
        style={{
          marginLeft: 16,
          transition: 'color 0.1s ease-in-out',
          color: hover ? theme.colors.tint6 : theme.colors.tint5
        }}
      />
      <Label
        style={{
          marginLeft: 8,
          cursor: 'pointer',
          transition: 'color 0.1s ease-in-out',
          color: hover ? theme.colors.tint5 : theme.colors.background
        }}
      >
        edit
      </Label>
    </Pane>
  );

  const editUI = (
    <TextInput
      width="100%"
      ref={inputRef}
      value={editablePrimary}
      fontSize={32}
      fontWeight={900}
      color={theme.colors.tint6}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangePrimary(e.target.value)}
      onBlur={onSave}
      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          onSave();
        }
      }}
    />
  );

  return <div>{editMode ? editUI : viewUI}</div>;
};

export default PrimaryField;
