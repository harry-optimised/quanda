import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Paragraph, TextInput } from 'evergreen-ui';
import { SnowflakeIcon } from 'evergreen-ui';
import { set } from 'lodash';

interface PrimaryFieldProps {
  onSave: (primary: string) => void;
  primary: string;
}

const PrimaryField: React.FC<PrimaryFieldProps> = ({
  onSave: parentOnSave,
  primary
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editablePrimary, setEditablePrimary] = useState(primary);
  const [hover, setHover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    (primary: string) => {
      setEditablePrimary(primary);
    },
    [primary]
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
      {primary}
    </Paragraph>
  );

  const editUI = (
    <TextInput
      width="100%"
      ref={inputRef}
      value={editablePrimary}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChangePrimary(e.target.value)
      }
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
