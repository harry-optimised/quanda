import '../../App.css';
import React, { useCallback, useEffect, useState } from 'react';
import 'reactflow/dist/style.css';
import theme from '../../theme';
import {
  ExchangeIcon,
  Heading,
  Icon,
  IconButton,
  Paragraph,
  Spinner,
  TrashIcon
} from 'evergreen-ui';
import { Item, LinkType, SetLink } from '../../types';
import { Pane, Card, Text, Tab, Tablist } from 'evergreen-ui';
import { AppDispatch, selectItem } from '../../state/store';
import { useSelector, useDispatch } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import TagBar from '../../components/TagBar';

import PrimaryField from '../../components/PrimaryField';
import SecondaryField from '../../components/SecondaryField';

import { setItem } from '../../state/item';
import DeleteButton from '../../components/DeleteButton';
import {
  refreshItems,
  removeItem,
  selectAllItems,
  updateItem
} from '../../state/navigator';
import BrowseableItem from '../../components/BrowseableItem';
import Logo from '../Logo';
import LinkButton from '../LinkButton';
import { set } from 'lodash';
import LinkIcon from '../LinkIcon';

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

  const onSaveLink = useCallback(
    (link: SetLink) => {
      if (!managedItem) return;
      fetch(`http://localhost:8000/api/items/${managedItem.id}/add_link/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(link)
      })
        .then((response) => (response.ok ? response : Promise.reject(response)))
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (managedItem)
            onSave({
              ...managedItem,
              links: [
                ...managedItem.links,
                { target: data, type: link.relation_type as LinkType }
              ]
            });
        })
        .catch((error) => error.json())
        .then((data) => {
          console.log(data);
        });
    },
    [managedItem, onSave]
  );

  const onRemoveLink = useCallback(
    (link: SetLink) => {
      if (!managedItem) return;
      fetch(`http://localhost:8000/api/items/${managedItem.id}/remove_link/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(link)
      })
        .then((response) => response.json())
        .then((data) => {
          if (managedItem)
            onSave({
              ...managedItem,
              links: managedItem.links.filter(
                (link) => link.target.id !== data.id
              )
            });
        });
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
        dispatch(removeItem(managedItem.id));
        dispatch(setItem(null));
      });
    }
  }, [managedItem]);

  const tagBarReference = React.useRef<HTMLInputElement>(null);
  useHotkeys(
    'ctrl+l',
    (event) => {
      event.preventDefault();
      tagBarReference.current?.focus();
    },
    [tagBarReference]
  );

  console.log(activeItem);

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
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
      }}
    >
      <Pane width="60%" padding={32}>
        <Pane style={{ paddingBottom: 16, width: '100%' }} display="flex">
          <TagBar
            ref={tagBarReference}
            tags={managedItem.tags}
            onSave={onSaveTags}
          />
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
          width: '40%',
          height: '100%',
          borderLeft: `1px solid ${theme.colors.border.default}`
        }}
      >
        <Pane
          flex="1"
          style={{
            height: '80%',
            userSelect: 'none',
            padding: 32,
            borderTop: `1px solid ${theme.colors.border.default}`
          }}
        >
          <Pane
            style={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between'
            }}
          >
            <LinkButton onSave={onSaveLink} />
            <Pane
              className="browseBodyNoScrollbar"
              marginTop={16}
              borderRadius={4}
              width="100%"
              height="100%"
              overflowY="scroll"
            >
              {managedItem.links &&
                managedItem.links.map((link) => (
                  <Pane display="flex" alignItems="center">
                    <LinkIcon type={link.type as string} />
                    <BrowseableItem
                      item={link.target}
                      selected={false}
                      onSelect={() => onClickLink(link.target.id)}
                    />
                    <IconButton
                      icon={TrashIcon}
                      appearance="minimal"
                      onClick={() => {
                        onRemoveLink({
                          to_item: link.target.id,
                          relation_type: link.type
                        });
                      }}
                    />
                  </Pane>
                ))}
            </Pane>
          </Pane>
        </Pane>
      </Pane>
    </Card>
  );
}

export default ActiveItem;
