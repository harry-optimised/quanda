import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Paragraph, TextInput, Pane } from 'evergreen-ui';
import { SnowflakeIcon } from 'evergreen-ui';
import { set } from 'lodash';

interface BottomBarProps {
  onSave: (text: string) => void;
}

const BottomBar: React.FC<BottomBarProps> = ({ onSave }: BottomBarProps) => {
  const [text, setText] = useState('');

  const onLocalSave = useCallback(() => {
    setText('');
    onSave(text);
  }, [text, onSave]);

  const onChange = useCallback(
    (text: string) => {
      setText(text);
    },
    [text]
  );

  return (
    <Pane display="flex" alignItems="center" justifyContent="center">
      <TextInput
        position="fixed"
        bottom={50}
        left="50%"
        transform="translateX(-50%)"
        z-index={9999}
        height={50}
        width="50%"
        borderRadius={4}
        value={text}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        onBlur={onLocalSave}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            onLocalSave();
          }
        }}
      />
    </Pane>
  );
};

export default BottomBar;
