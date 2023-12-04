import '../../App.css';
import React, { useCallback } from 'react';
import { SearchInput } from 'evergreen-ui';

import { Pane } from 'evergreen-ui';
import { AppDispatch, selectItem } from '../../state/store';
import {
  selectAllItems,
  updateSearchTerm,
  refreshItems,
  selectSearchTerm
} from '../../state/navigator';
import { useSelector, useDispatch } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';

import BottomBar from '../../components/BottomBar';
import { setItem } from '../../state/item';
import BrowseableItem from '../../components/BrowseableItem';

// Utilities
import { debounce } from 'lodash';
import { useAuth0 } from '@auth0/auth0-react';

function Navigator() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectAllItems);
  const activeItem = useSelector(selectItem);
  const searchTerm = useSelector(selectSearchTerm);
  const searchBoxRef = React.useRef<HTMLInputElement>(null);
  const { getAccessTokenSilently } = useAuth0();

  const debouncedRefreshItems = useCallback(
    debounce(() => {
      dispatch(refreshItems(false));
    }, 250),
    []
  );

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    dispatch(updateSearchTerm(newSearchTerm));
    debouncedRefreshItems();
  };

  useHotkeys(
    'ctrl+q',
    (event) => {
      event.preventDefault();
      searchBoxRef.current?.focus();
    },
    [searchBoxRef]
  );

  useHotkeys('down', (event) => {
    event.preventDefault();
    const currentIndex = items.findIndex((item) => item.id === activeItem?.id);
    const nextIndex = currentIndex + 1;
    if (nextIndex < items.length) {
      const id = items[nextIndex].id;
      getAccessTokenSilently().then((accessToken) => {
        fetch(`https://api.quanda.ai/api/items/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
          .then((response) => response.json())
          .then((data) => {
            dispatch(setItem(data));
          });
      });
    }
  });

  useHotkeys('up', (event) => {
    event.preventDefault();
    const currentIndex = items.findIndex((item) => item.id === activeItem?.id);
    const nextIndex = currentIndex - 1;
    if (nextIndex >= 0) {
      const id = items[nextIndex].id;
      getAccessTokenSilently().then((accessToken) => {
        fetch(`https://api.quanda.ai/api/items/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
          .then((response) => response.json())
          .then((data) => {
            dispatch(setItem(data));
          });
      });
    }
  });

  const onItemSelect = useCallback(
    (id: number) => {
      getAccessTokenSilently().then((accessToken) => {
        fetch(`https://api.quanda.ai/api/items/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
          .then((response) => response.json())
          .then((data) => {
            dispatch(setItem({ item: data, updateBackend: false }));
          });
      });
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
    getAccessTokenSilently().then((accessToken) => {
      fetch(`https://api.quanda.ai/api/items/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(newItem)
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch(setItem(data));
          dispatch(refreshItems(false));
        });
    });
  }, []);

  return (
    <>
      <Pane
        id="browseHeader"
        display="flex"
        flexDirection="row"
        alignItems="center"
        style={{
          width: '100%',
          padding: 32,
          paddingBottom: 32
        }}
      >
        <SearchInput
          height={40}
          width="100%"
          placeholder="Ctrl+Q to search"
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
              selected={item.id === activeItem?.id}
              onSelect={onItemSelect}
            />
          </Pane>
        ))}
      </Pane>
      <Pane
        style={{
          padding: 32,
          backgroundColor: 'transparent'
        }}
      >
        <BottomBar onSave={onAddItem} />
      </Pane>
    </>
  );
}

export default Navigator;
