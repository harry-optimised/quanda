import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Paragraph, TextInput, Pane } from 'evergreen-ui';
import { SnowflakeIcon } from 'evergreen-ui';
import { set } from 'lodash';
import styles from './BottomBar.module.css';

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
        width="100%"
        className={styles.textInput}
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
