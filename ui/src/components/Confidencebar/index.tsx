import React from 'react';
import styles from './ConfidenceBar.module.css';

interface ConfidenceBarProps {
  confidence: number;
}

const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ confidence }) => {
  const filledWidth = `${confidence}%`;

  return (
    <div className={styles.progressBarContainer}>
      <div
        className={styles.progressBarFilled}
        style={{ width: filledWidth }}
      ></div>
    </div>
  );
};

export default ConfidenceBar;
