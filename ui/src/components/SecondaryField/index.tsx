import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Paragraph,
  Textarea,
  Pane,
  Icon,
  Label,
  Heading,
  TextareaField,
  Button
} from 'evergreen-ui';
import { EditIcon } from 'evergreen-ui';
import { set } from 'lodash';
import MDEditor from '@uiw/react-md-editor';
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
    <MDEditor.Markdown
      source={secondary}
      style={{
        whiteSpace: 'pre-wrap',
        textAlign: 'left',
        userSelect: 'none',
        color: theme.colors.tint6,
        width: '100%',
        height: '100%',
        borderRadius: 4
      }}
    />
  );

  const editUI = (
    <TextareaField
      width="100%"
      ref={inputRef}
      value={editablePrimary}
      borderRadius={4}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
        onChangePrimary(e.target.value)
      }
      onBlur={onSave}
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

        {!editMode && (
          <>
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
          </>
        )}
        {editMode && (
          <Button
            marginLeft={16}
            size="small"
            appearance="primary"
            onClick={onSave}
            style={{ cursor: 'pointer' }}
          >
            Save
          </Button>
        )}
      </Pane>
      {editMode ? editUI : viewUI}
    </Pane>
  );
};

export default SecondaryField;
