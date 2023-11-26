import '../../App.css';
import React, { useCallback, useEffect, useState } from 'react';
import 'reactflow/dist/style.css';
import theme from '../../theme';
import { ExchangeIcon, Heading, Icon, Paragraph, Spinner } from 'evergreen-ui';
import { Item } from '../../types';
import { Pane, Card, Text, Tab, Tablist } from 'evergreen-ui';
import { AppDispatch, selectItem } from '../../state/store';
import { useSelector, useDispatch } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import TagBar from '../../components/TagBar';

import PrimaryField from '../../components/PrimaryField';
import SecondaryField from '../../components/SecondaryField';

import { setItem } from '../../state/item';
import DeleteButton from '../../components/DeleteButton';
import { refreshItems, updateItem } from '../../state/navigator';
import BrowseableItem from '../../components/BrowseableItem';

function ActiveItem() {
  const activeItem = useSelector(selectItem);
  const [managedItem, setManagedItem] = useState<Item | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const project = 1;

  useEffect(() => {
    setManagedItem(activeItem);
  }, [activeItem]);

  const onSave = useCallback(
    (updatedItem: Item) => {
      // Update the UI optimistically.
      // TODO: Can we remove managedItem and work from state directly?
      setManagedItem(updatedItem);
      dispatch(setItem(updatedItem));

      // Update item in search bar.
      dispatch(updateItem(updatedItem));
    },
    [project]
  );

  const onSaveTags = useCallback(
    (tags: number[]) => {
      if (managedItem) onSave({ ...managedItem, tags: tags });
    },
    [managedItem, onSave]
  );

  const onSavePrimary = useCallback(
    (primary: string) => {
      if (managedItem) onSave({ ...managedItem, primary: primary });
    },
    [managedItem, onSave]
  );

  const onSaveSecondary = useCallback(
    (secondary: string) => {
      if (managedItem) onSave({ ...managedItem, secondary: secondary });
    },
    [managedItem, onSave]
  );

  const onClickLink = useCallback((targetID: number) => {
    fetch(`http://localhost:8000/api/items/${targetID}/`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(setItem(data));
      });
  }, []);

  const onDelete = useCallback(() => {
    if (managedItem) {
      fetch(`http://localhost:8000/api/items/${managedItem.id}/`, {
        method: 'DELETE'
      }).then(() => {
        dispatch(setItem(null));
        dispatch(refreshItems());
      });
    }
  }, [managedItem]);

  const tabs = ['links', 'insights'];
  const [tabIndex, setTabIndex] = useState(0);

  const tagBarReference = React.useRef<HTMLInputElement>(null);
  useHotkeys(
    'ctrl+l',
    (event) => {
      event.preventDefault();
      tagBarReference.current?.focus();
    },
    [tagBarReference]
  );

  if (!managedItem) {
    return (
      <Pane
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.background
        }}
      >
        <Spinner size={64} />
      </Pane>
    );
  }

  return (
    <Card
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 0,
        backgroundColor: theme.colors.background,
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
      }}
    >
      <Pane width="100%">
        <Pane style={{ paddingBottom: 16, width: '100%' }} display="flex">
          <TagBar
            ref={tagBarReference}
            tags={managedItem.tags}
            onSave={onSaveTags}
          />
          <Pane
            padding={4}
            display="flex"
            marginLeft={30}
            borderRadius={4}
            backgroundColor={theme.colors.tint6}
          >
            <Heading padding={4} paddingRight={0} color={theme.colors.accent}>
              Qu
            </Heading>
            <Heading
              padding={4}
              paddingLeft={0}
              paddingRight={0}
              color={theme.colors.background}
            >
              anda
            </Heading>
            <Heading
              padding={4}
              paddingLeft={0}
              color={theme.colors.background}
            ></Heading>
          </Pane>
        </Pane>
        <Pane
          style={{
            paddingBottom: 16,
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <PrimaryField primary={managedItem.primary} onSave={onSavePrimary} />
          <DeleteButton onDelete={onDelete} primary={managedItem.primary} />
        </Pane>

        <Pane
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}
        >
          <SecondaryField
            secondary={managedItem.secondary}
            onSave={onSaveSecondary}
          />
        </Pane>
      </Pane>
      <Pane
        style={{
          width: '100%',
          height: '50%',
          marginBottom: 32,
          paddingTop: 16,
          borderTop: `1px solid ${theme.colors.tint4}`
        }}
      >
        <Pane
          style={{
            textAlign: 'left'
          }}
        >
          <Tablist flexBasis={0}>
            {tabs.map((tab, index) => (
              <Tab
                aria-controls={`panel-${tab}`}
                isSelected={index === tabIndex}
                key={tab}
                onSelect={() => setTabIndex(index)}
              >
                {tab === 'links' ? 'Linked Items' : 'AI Insights'}
              </Tab>
            ))}
          </Tablist>
        </Pane>
        <Pane paddingTop={16} flex="1" style={{ height: '100%' }}>
          {tabs.map((tab, index) => (
            <Pane
              aria-labelledby={tab}
              aria-hidden={index !== tabIndex}
              display={index === tabIndex ? 'block' : 'none'}
              style={{
                width: '100%',
                height: '100%'
              }}
              key={tab}
              role="tabpanel"
            >
              {tab === 'links' ? (
                <Pane
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}
                >
                  {managedItem.links.map((link) => (
                    <Pane display="flex" alignItems="center">
                      <Pane
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        width={80}
                        marginRight={16}
                      >
                        <Icon
                          icon={ExchangeIcon}
                          size={32}
                          color={theme.colors.tint5}
                        />
                        <Text size={300} color={theme.colors.tint5}>
                          Related to
                        </Text>
                      </Pane>
                      <BrowseableItem
                        item={link.target}
                        selected={false}
                        onSelect={() => onClickLink(link.target.id)}
                      />
                    </Pane>
                  ))}
                </Pane>
              ) : (
                <Pane>
                  <Pane>
                    <Heading size={600}>Insights</Heading>
                  </Pane>
                  <Pane>
                    <Paragraph>TODO</Paragraph>
                  </Pane>
                </Pane>
              )}
            </Pane>
          ))}
        </Pane>
      </Pane>
    </Card>
  );
}

export default ActiveItem;
