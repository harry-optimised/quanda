import React, { useState, useCallback } from 'react';
import { Pane, Tablist, Tab, Dialog, Paragraph } from 'evergreen-ui';
import styles from './ConfidenceBar.module.css';

// ConfidenceBar component
interface ConfidenceBarProps {
  confidence: number;
  onClick: () => void;
}

const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  confidence,
  onClick
}) => {
  const filledWidth = `${confidence * 100}%`;
  return (
    <div className={styles.progressBarContainer} onClick={onClick}>
      <div
        className={styles.progressBarFilled}
        style={{ width: filledWidth }}
      ></div>
    </div>
  );
};

// ConfidenceChoice component
interface ConfidenceChoiceProps {
  onSave: (confidence: number) => void;
  confidence: number;
}

const ConfidenceChoice: React.FC<ConfidenceChoiceProps> = ({
  onSave: parentOnSave,
  confidence
}) => {
  const [isDialogShown, setIsDialogShown] = useState(false);

  const tabs = [
    { label: 'No answer', value: 0.0 },
    { label: 'Vague answer', value: 0.25 },
    { label: 'Unvalidated Answer', value: 0.5 },
    { label: 'Partially validated answer', value: 0.75 },
    { label: 'Validated and correct', value: 1.0 }
  ];

  const [selectedIndex, setSelectedIndex] = useState(
    tabs.findIndex((tab) => tab.value === confidence)
  );

  const onTabChange = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const openDialog = useCallback(() => {
    setIsDialogShown(true);
  }, []);

  const localOnSave = () => {
    setIsDialogShown(false);
    parentOnSave(tabs[selectedIndex].value);
  };

  return (
    <Pane>
      <ConfidenceBar confidence={confidence} onClick={openDialog} />

      <Dialog
        isShown={isDialogShown}
        title="How confident are you in this answer?"
        onCloseComplete={() => setIsDialogShown(false)}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={localOnSave}
        width={800}
      >
        <Pane>
          <Tablist marginBottom={16} marginRight={24}>
            {tabs.map((tab, index) => (
              <Tab
                aria-controls={`panel-${tab.label}`}
                isSelected={index === selectedIndex}
                key={tab.label}
                onSelect={() => onTabChange(index)}
              >
                {tab.label}
              </Tab>
            ))}
          </Tablist>
        </Pane>
        <Pane padding={16} background="tint1" flex="1">
          {tabs.map((tab, index) => (
            <Pane
              aria-labelledby={tab.label}
              aria-hidden={index !== selectedIndex}
              display={index === selectedIndex ? 'block' : 'none'}
              key={tab.label}
              role="tabpanel"
            >
              <Paragraph>Panel {tab.label}</Paragraph>
            </Pane>
          ))}
        </Pane>
      </Dialog>
    </Pane>
  );
};

export default ConfidenceChoice;
