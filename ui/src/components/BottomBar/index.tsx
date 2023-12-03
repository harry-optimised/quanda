import React, { useState, useCallback, useRef } from 'react';
import { Pane, Button, NewObjectIcon, TextInput } from 'evergreen-ui';
import { useHotkeys } from 'react-hotkeys-hook';

interface BottomBarProps {
  onSave: (text: string) => void;
}

const BottomBar: React.FC<BottomBarProps> = ({ onSave }: BottomBarProps) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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

  useHotkeys('ctrl+i', () => {
    inputRef.current?.focus();
  });

  return (
    <Pane display="flex" flexDirection="column">
      <TextInput
        height={40}
        width="100%"
        placeholder="Ctrl + I to create a new item"
        value={text}
        ref={inputRef}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        onBlur={() => setText('')}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            onLocalSave();
          }
        }}
      />
      <Button
        marginTop={16}
        appearance="primary"
        iconBefore={NewObjectIcon}
        onClick={onLocalSave}
      >
        Create
      </Button>
    </Pane>
  );
};

export default BottomBar;
