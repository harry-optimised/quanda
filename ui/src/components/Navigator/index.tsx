import '../../App.css';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Heading, NewObjectIcon, SearchInput } from 'evergreen-ui';

import { Pane } from 'evergreen-ui';
import { AppDispatch, selectItem } from '../../state/store';
import { selectAllItems, setEntries } from '../../state/navigator';
import { useSelector, useDispatch } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';

import { setEntry } from '../../state/item';
import BrowseableItem from '../../components/BrowseableItem';

// Utilities
import { debounce } from 'lodash';
import useAPI from '../../hooks/useAPI';
import theme from '../../theme';

function Navigator() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectAllItems);
  const activeItem = useSelector(selectItem);
  const [searchTerm, setSearchTerm] = useState('');
  const searchBoxRef = React.useRef<HTMLInputElement>(null);
  const api = useAPI();

  const refreshNavigator = useCallback(
    ({ searchTerm }: { searchTerm?: string }) => {
      api.listEntries({ searchTerm }).then((items) => {
        if (items) dispatch(setEntries(items));
      });
    },
    [dispatch]
  );

  //TODO: Get some more filter options in here!
  // TODO: Add confidence bars back in.

  // Load all items on mount.
  useEffect(() => refreshNavigator({}), []);

  const debouncedRefreshItems = useCallback(
    debounce((searchTerm: string) => {
      refreshNavigator({ searchTerm });
    }, 250),
    []
  );

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedRefreshItems(e.target.value);
  };

  useHotkeys(
    'ctrl+q',
    (event) => {
      event.preventDefault();
      searchBoxRef.current?.focus();
    },
    [searchBoxRef]
  );

  // useHotkeys('down', (event) => {
  //   event.preventDefault();
  //   const currentIndex = items.findIndex((item) => item.id === activeItem?.id);
  //   const nextIndex = currentIndex + 1;
  //   if (nextIndex < items.length) {
  //     const id = items[nextIndex].id;
  //     if (!project) return;
  //     api.retrieveItem({ id, project: project.id }).then((item) => {
  //       // TODO: Can simplify setItem, since it's just a single item.
  //       if (item) dispatch(setItem({ item }));
  //     });
  //   }
  // });

  // useHotkeys('up', (event) => {
  //   event.preventDefault();
  //   const currentIndex = items.findIndex((item) => item.id === activeItem?.id);
  //   const nextIndex = currentIndex - 1;
  //   if (nextIndex >= 0) {
  //     const id = items[nextIndex].id;
  //     if (!project) return;
  //     api.retrieveItem({ id, project: project.id }).then((item) => {
  //       if (item) dispatch(setItem({ item }));
  //     });
  //   }
  // });

  const onItemSelect = useCallback(
    (id: string) => {
      api.retrieveEntry({ id }).then((item) => {
        if (item) dispatch(setEntry({ entry: item }));
      });
    },
    [dispatch]
  );

  const onAddEntry = useCallback(() => {
    api
      .createEntry({
        entry: {
          thoughts: [],
          date: new Date().toISOString().split('T')[0]
        }
      })
      .then((item) => {
        if (item) {
          dispatch(setEntry({ entry: item }));
          refreshNavigator({});
        }
      });
  }, []);

  return (
    <>
      <Pane
        id="browseHeader"
        display="flex"
        flexDirection="row"
        alignItems="center"
        userSelect="none"
        style={{
          width: '100%',
          padding: 8,
          paddingBottom: 8
        }}
      >
        <SearchInput
          height={40}
          width="100%"
          placeholder="Ctrl+Q to search"
          ref={searchBoxRef}
          onChange={onSearchChange}
          value={searchTerm}
          style={{ borderRadius: 4 }}
        />
      </Pane>
      <Pane
        id="browseBody"
        userSelect="none"
        className="browseBodyNoScrollbar"
        style={{
          width: '100%',
          paddingLeft: 8,
          paddingRight: 8,
          height: 'calc(100% - 64px - 140px)'
        }}
      >
        {items.map((item) => (
          <Pane key={item.id}>
            <BrowseableItem entry={item} selected={item.id === activeItem?.id} onSelect={onItemSelect} />
          </Pane>
        ))}
        {items.length === 0 && (
          <Pane
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            opacity={0.3}
            style={{ height: '100%' }}
          >
            <Heading size={800} color={theme.colors.primary} paddingLeft={16}>
              No items
            </Heading>
            <Heading size={600} color={theme.colors.primary} paddingLeft={16}>
              Add one below to get started.
            </Heading>
          </Pane>
        )}
      </Pane>
      <Pane
        style={{
          padding: 32,
          backgroundColor: 'transparent'
        }}
      >
        <Button marginTop={16} appearance="primary" iconBefore={NewObjectIcon} onClick={onAddEntry}>
          Add Today's Entry
        </Button>
      </Pane>
    </>
  );
}

export default Navigator;
