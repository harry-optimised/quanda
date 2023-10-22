import React, { useState } from 'react';
import {
  Pane,
  Heading,
  IconButton,
  Tablist,
  Tab,
  Paragraph,
  Table,
  Text
} from 'evergreen-ui';
import { MenuIcon } from 'evergreen-ui';
import styles from './Drawer.module.css';

const Drawer: React.FC = () => {
  const [isShown, setIsShown] = useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [tabs] = React.useState(['Items', 'Systems', 'Tags']);

  const toggleDrawer = () => {
    setIsShown(!isShown);
  };

  return (
    <>
      <Pane
        elevation={4}
        backgroundColor="white"
        className={`${styles.sidesheetContainer} ${
          isShown ? styles.sidesheetShown : styles.sidesheetHidden
        }`}
      >
        <Tablist
          margin={16}
          flexBasis={240}
          marginRight={24}
          display="flex"
          justifyContent="start"
        >
          {tabs.map((tab, index) => (
            <Tab
              appearance="secondary"
              aria-controls={`panel-${tab}`}
              isSelected={index === selectedIndex}
              key={tab}
              onSelect={() => setSelectedIndex(index)}
            >
              <Heading>{tab}</Heading>
            </Tab>
          ))}
        </Tablist>
        <Pane padding={16} background="tint1" flex="1">
          {tabs.map((tab, index) => (
            <Pane
              aria-labelledby={tab}
              aria-hidden={index !== selectedIndex}
              display={index === selectedIndex ? 'block' : 'none'}
              key={tab}
              role="tabpanel"
            >
              {index === 0 && <Paragraph>Items</Paragraph>}
              {index === 1 && <Paragraph>Systems</Paragraph>}
              {index === 2 && <Paragraph>Tags</Paragraph>}
            </Pane>
          ))}
        </Pane>
      </Pane>

      <IconButton
        icon={MenuIcon}
        margin={8}
        size="large"
        onClick={toggleDrawer}
        className={`${styles.drawerButton} ${
          isShown ? styles.drawerButtonShown : ''
        }`}
      />
    </>
  );
};

export default Drawer;
