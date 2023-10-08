import React from 'react';
import { TextInput, Pane } from 'evergreen-ui';
import styles from './BottomBar.module.css';

export default function BottomBar() {
  return (
    <Pane display="flex" alignItems="center" justifyContent="center">
      <TextInput
        className={styles.textInput}
        name="textbox"
        placeholder="Type here..."
      />
    </Pane>
  );
}
