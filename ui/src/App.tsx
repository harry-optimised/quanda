import './App.css';
import React, { useCallback, useEffect, useState } from 'react';
import 'reactflow/dist/style.css';
import theme from './theme';
import {
  ExchangeIcon,
  Heading,
  Icon,
  Label,
  LinkIcon,
  Paragraph,
  SearchInput,
  Small,
  Spinner,
  ThemeProvider
} from 'evergreen-ui';
import { Item, LightItem } from './types';
import { Pane, Card, Text, Strong, Tab, Tablist } from 'evergreen-ui';
import {
  selectAllItems,
  store,
  selectActiveItem,
  AppDispatch
} from './state/store';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { setActiveItem } from './state/itemSlice';
import { useHotkeys } from 'react-hotkeys-hook';

import { useFetchSystems } from './state/hooks';
import { useFetchTags } from './state/hooks';
import { useRefreshItems } from './state/hooks';
import TagBar from './components/TagBar';
import { set } from 'lodash';
import PrimaryField from './components/primaryField';
import SecondaryField from './components/secondaryField';
import { Divider } from '@blueprintjs/core';
import BottomBar from './components/BottomBar';

interface BrowseableItemProps {
  item: Item | LightItem;
  selected: boolean;
  onSelect: (id: number) => void;
}

function BrowseableItem({ item, selected, onSelect }: BrowseableItemProps) {
  const secondary = item.secondary;
  const truncatedSecondary =
    secondary.length > 70 ? secondary.slice(0, 70) + '...' : secondary;

  const backgroundColor = selected ? theme.colors.tint4 : `transparent`;
  const textColor = selected ? theme.colors.tint6 : theme.colors.tint6;

  return (
    <Card
      key={item.id}
      display="flex"
      padding={10}
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      width="100%"
      cursor="pointer"
      userSelect="none"
      onClick={() => onSelect(item.id)}
      style={{ backgroundColor: backgroundColor }}
    >
      <Pane style={{ marginBottom: 4 }}>
        <TagBar tags={item.tags} onSave={() => null} frozen={true} />
      </Pane>
      <Strong color={textColor}>{item.primary}</Strong>
      <Text color={textColor}>{truncatedSecondary}</Text>
    </Card>
  );
}

function ActiveItem({ item }: { item: Item }) {
  const [managedItem, setManagedItem] = useState<Item>(item);
  const dispatch = useDispatch<AppDispatch>();
  const project = 1;

  useEffect(() => {
    setManagedItem(item);
  }, [item]);

  const onSave = useCallback(
    (updatedItem: Item) => {
      //setManagedItem(updatedItem);
      //const updatedItemWithProject = { ...updatedItem, project: project };
      //updateItem(updatedItemWithProject);
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
      onSave({ ...managedItem, primary: primary });
    },
    [managedItem, onSave]
  );

  const onSaveSecondary = useCallback(
    (secondary: string) => {
      onSave({ ...managedItem, secondary: secondary });
    },
    [managedItem, onSave]
  );

  const onClickLink = useCallback(
    (targetID: number) => {
      dispatch(setActiveItem(targetID));
    },
    [item]
  );

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
        <Pane style={{ paddingBottom: 16, width: '100%' }}>
          <PrimaryField primary={managedItem.primary} onSave={onSavePrimary} />
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
          marginBottom: 32
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
                  {item.links.map((link) => (
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

function ReduxApp() {
  const fetchSystems = useFetchSystems();
  const fetchTags = useFetchTags();
  const refreshItems = useRefreshItems();
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectAllItems);
  const activeItemID = useSelector(selectActiveItem);
  const activeItem = items.find((item) => item.id === activeItemID);

  useEffect(() => {
    refreshItems();
    fetchSystems();
    fetchTags();
  }, []);

  const [searchTerm, setSearchTerm] = React.useState('');

  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const searchBoxRef = React.useRef<HTMLInputElement>(null);
  useHotkeys(
    'ctrl+s',
    (event) => {
      console.log('???');
      event.preventDefault();
      searchBoxRef.current?.focus();
    },
    [searchBoxRef]
  );

  useHotkeys('down', (event) => {
    event.preventDefault();
    const currentIndex = items.findIndex((item) => item.id === activeItemID);
    const nextIndex = currentIndex + 1;
    if (nextIndex < items.length) {
      dispatch(setActiveItem(items[nextIndex].id));
    }
  });

  useHotkeys('up', (event) => {
    event.preventDefault();
    const currentIndex = items.findIndex((item) => item.id === activeItemID);
    const nextIndex = currentIndex - 1;
    if (nextIndex >= 0) {
      dispatch(setActiveItem(items[nextIndex].id));
    }
  });

  const onItemSelect = useCallback(
    (id: number) => {
      dispatch(setActiveItem(id));
    },
    [dispatch]
  );

  const onAddItem = useCallback((primary: string) => {
    const newItem = {
      primary: primary,
      secondary: 'null',
      confidence: 0,
      tags: [],
      evidence: [],
      frozen: false,
      priority: false,
      project: 1
    };
    fetch(`http://localhost:8000/api/items/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newItem)
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(setActiveItem(data.id));
      });
  }, []);

  return (
    <ThemeProvider value={theme}>
      <Pane
        className="App"
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          backgroundColor: theme.colors.tint3
        }}
      >
        <Pane
          style={{
            width: '30%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Pane
            id="browseHeader"
            style={{
              width: '100%',
              padding: 32,
              paddingBottom: 32
            }}
          >
            <SearchInput
              height={40}
              width="100%"
              placeholder="Ctrl+S to search"
              ref={searchBoxRef}
              onChange={onSearchChange}
              value={searchTerm}
              style={{ borderRadius: 32 }}
            />
          </Pane>
          <Pane
            id="browseBody"
            className="browseBodyNoScrollbar"
            style={{
              width: '100%',
              paddingLeft: 32,
              paddingRight: 32,
              height: 'calc(100% - 64px - 140px)'
            }}
          >
            {items.map((item) => (
              <Pane>
                <BrowseableItem
                  item={item}
                  selected={item.id === activeItemID}
                  onSelect={onItemSelect}
                />
              </Pane>
            ))}
          </Pane>
          <Pane
            style={{
              padding: 32,
              backgroundColor: theme.colors.tint5
            }}
          >
            <BottomBar onSave={onAddItem} />
          </Pane>
        </Pane>
        <Pane
          style={{
            width: '70%',
            height: '100%',
            padding: 0
          }}
        >
          {activeItem ? (
            <ActiveItem item={activeItem} />
          ) : (
            <Pane
              style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Spinner size={64} />
            </Pane>
          )}
        </Pane>
      </Pane>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ReduxApp />
    </Provider>
  );
}

export default App;
