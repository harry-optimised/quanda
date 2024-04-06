import React, { useState, useCallback, useEffect } from 'react';

import MDEditor from '@uiw/react-md-editor';
import { debounce } from 'lodash';

interface ThoughtEditorProps {
  onSave: (secondary: string) => void;
  secondary: string;
}

const ThoughtEditor: React.FC<ThoughtEditorProps> = ({ onSave, secondary }) => {
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
      style={{ width: '100%', height: '100%', marginTop: 16 }}
      value={content}
      onChange={onChangeContent}
      preview="edit"
      autoFocus={true}
      visibleDragbar={true}
      textareaProps={{ style: { overflowY: 'scroll' } }}
    />
  );
};

export default ThoughtEditor;
