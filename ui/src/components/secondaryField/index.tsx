import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Paragraph,
  Textarea,
  Pane,
  Icon,
  Label,
  Heading,
  TextareaField
} from 'evergreen-ui';
import { EditIcon } from 'evergreen-ui';
import { set } from 'lodash';
import theme from '../../theme';

interface SecondaryFieldProps {
  onSave: (secondary: string) => void;
  secondary: string;
}

const SecondaryField: React.FC<SecondaryFieldProps> = ({
  onSave: parentOnSave,
  secondary
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editablePrimary, setEditablePrimary] = useState(secondary);
  const [hover, setHover] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editMode]);

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
    (secondary: string) => {
      setEditablePrimary(secondary);
    },
    [secondary]
  );

  const viewUI = (
    <Paragraph
      cursor="pointer"
      textAlign="left"
      color={theme.colors.tint6}
      backgroundColor={theme.colors.tint3}
      width="100%"
      height={200}
      padding={8}
      paddingLeft={12}
      marginTop={4}
      borderRadius={4}
      userSelect="none"
    >
      {secondary}
    </Paragraph>
  );

  const editUI = (
    <TextareaField
      width="100%"
      ref={inputRef}
      value={editablePrimary}
      inputHeight={200}
      borderRadius={4}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
        onChangePrimary(e.target.value)
      }
      onBlur={onSave}
      onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
          onSave();
        }
      }}
    />
  );

  return (
    <Pane
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        cursor: 'pointer'
      }}
      onClick={onEnterEdit}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Pane
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 4
        }}
      >
        <Heading size={600} style={{ cursor: 'pointer' }}>
          Body
        </Heading>
        <Icon
          icon={EditIcon}
          size={16}
          style={{
            cursor: 'pointer',
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
      {editMode ? editUI : viewUI}
    </Pane>
  );
};

export default SecondaryField;
