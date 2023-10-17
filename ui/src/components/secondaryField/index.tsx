import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Paragraph, Textarea } from 'evergreen-ui';
import { SnowflakeIcon } from 'evergreen-ui';
import { set } from 'lodash';

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
  }, []);

  const onSave = useCallback(() => {
    setEditMode(false);
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
      onClick={onEnterEdit}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      color={hover ? 'muted' : 'default'}
    >
      {secondary}
    </Paragraph>
  );

  const editUI = (
    <Textarea
      width="100%"
      ref={inputRef}
      value={editablePrimary}
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

  return <div>{editMode ? editUI : viewUI}</div>;
};

export default SecondaryField;
