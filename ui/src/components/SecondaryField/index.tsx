import React, { useState, useCallback, useEffect } from 'react';

import MDEditor from '@uiw/react-md-editor';
import { debounce } from 'lodash';

interface SecondaryFieldProps {
  onSave: (secondary: string) => void;
  secondary: string;
}

const SecondaryField: React.FC<SecondaryFieldProps> = ({ onSave, secondary }) => {
  const [content, setContent] = useState<string | undefined>(secondary);

  useEffect(() => {
    setContent(secondary);
  }, [secondary]);

  const debouncedSave = useCallback(
    debounce((content: string) => {
      onSave(content);
    }, 500),
    [onSave]
  ); // Adjust debounce time (in ms) as needed

  const onChangeContent = useCallback(
    (content: string | undefined) => {
      setContent(content);
      if (content) debouncedSave(content);
    },
    [debouncedSave]
  );

  return (
    <MDEditor
      value={content}
      onChange={onChangeContent}
      preview="edit"
      autoFocus={true}
      height="calc(100vh - 170px - 48px)"
      visibleDragbar={true}
      textareaProps={{ style: { overflowY: 'scroll' } }}
    />
  );
};

export default SecondaryField;
