import '../../App.css';
import React, { useCallback, useEffect, useState } from 'react';
import 'reactflow/dist/style.css';
import theme from '../../theme';
import {
  Button,
  CleanIcon,
  Group,
  Heading,
  Icon,
  IconButton,
  Spinner,
  Strong,
  TrashIcon
} from 'evergreen-ui';
import { Item, LinkType, SetLink } from '../../types';
import { Pane, Card } from 'evergreen-ui';
import { AppDispatch, selectItem } from '../../state/store';
import { useSelector, useDispatch } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import TagBar from '../../components/TagBar';

import PrimaryField from '../../components/PrimaryField';
import SecondaryField from '../../components/SecondaryField';

import { setItem } from '../../state/item';
import DeleteButton from '../../components/DeleteButton';
import { removeItem, updateItem } from '../../state/navigator';
import BrowseableItem from '../../components/BrowseableItem';

import LinkButton from '../LinkButton';

import LinkIcon from '../LinkIcon';
import { useAuth0 } from '@auth0/auth0-react';

function ActiveItem() {
  const activeItem = useSelector(selectItem);
  const { getAccessTokenSilently } = useAuth0();

  const dispatch = useDispatch<AppDispatch>();
  const project = 1;

  const onSave = useCallback(
    (updatedItem: Item) => {
      // Update the UI optimistically.
      dispatch(setItem({ item: updatedItem, updateBackend: true }));

      // Update item in search bar.
      dispatch(updateItem(updatedItem));
    },
    [project]
  );

  const onSaveTags = useCallback(
    (tags: number[]) => {
      if (activeItem) onSave({ ...activeItem, tags: tags });
    },
    [activeItem]
  );

  const onSavePrimary = useCallback(
    (primary: string) => {
      console.log(primary);
      if (activeItem) onSave({ ...activeItem, primary: primary });
    },
    [activeItem]
  );

  const onSaveSecondary = useCallback(
    (secondary: string) => {
      if (activeItem) onSave({ ...activeItem, secondary: secondary });
    },
    [activeItem]
  );

  const onSaveLink = useCallback(
    (link: SetLink) => {
      if (!activeItem) return;
      getAccessTokenSilently().then((accessToken) => {
        fetch(`http://localhost:8000/api/items/${activeItem.id}/add_link/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(link)
        })
          .then((response) =>
            response.ok ? response : Promise.reject(response)
          )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (activeItem)
              onSave({
                ...activeItem,
                links: [
                  ...activeItem.links,
                  { target: data, type: link.relation_type as LinkType }
                ]
              });
          })
          .catch((error) => error.json())
          .then((data) => {
            console.log(data);
          });
      });
    },
    [activeItem]
  );

  const onRemoveLink = useCallback(
    (link: SetLink) => {
      if (!activeItem) return;
      getAccessTokenSilently().then((accessToken) => {
        fetch(`http://localhost:8000/api/items/${activeItem.id}/remove_link/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(link)
        })
          .then((response) => response.json())
          .then((data) => {
            if (activeItem)
              onSave({
                ...activeItem,
                links: activeItem.links.filter(
                  (link) => link.target.id !== data.id
                )
              });
          });
      });
    },
    [activeItem]
  );

  const onClickLink = useCallback((targetID: number) => {
    //TODO: I don't think we need to get the access token every single time...
    getAccessTokenSilently().then((accessToken) => {
      fetch(`http://localhost:8000/api/items/${targetID}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch(setItem(data));
        });
    });
  }, []);

  const onDelete = useCallback(() => {
    if (activeItem) {
      getAccessTokenSilently().then((accessToken) => {
        fetch(`http://localhost:8000/api/items/${activeItem.id}/`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }).then(() => {
          dispatch(removeItem(activeItem.id));
          dispatch(setItem({ item: null, updateBackend: false }));
        });
      });
    }
  }, [activeItem]);

  const tagBarReference = React.useRef<HTMLInputElement>(null);
  useHotkeys(
    'ctrl+l',
    (event) => {
      event.preventDefault();
      tagBarReference.current?.focus();
    },
    [tagBarReference]
  );

  const options = React.useMemo(
    () => [
      { label: 'Links', value: 'links' },
      { label: 'Insights', value: 'insights' },
      { label: 'Evidence', value: 'evidence' },
      { label: 'Graph', value: 'graph' }
    ],
    []
  );
  const [tab, setTab] = React.useState('links');

  if (!activeItem) {
    return (
      <Pane
        style={{
          width: '100%',
          height: 'calc(100vh - 48px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.background
        }}
      >
        <Icon
          icon={CleanIcon}
          size={96}
          color={theme.colors.gray400}
          marginBottom={32}
        />
        <Heading size={800} color={theme.colors.gray400} paddingLeft={16}>
          Nothing selected
        </Heading>
        <Heading size={600} color={theme.colors.gray400} paddingLeft={16}>
          Pick an item from the sidebar to get started
        </Heading>
      </Pane>
    );
  }

  return (
    <Card
      style={{
        width: '100%',
        height: 'calc(100vh - 48px)',
        borderRadius: 0,
        backgroundColor: theme.colors.background,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
      }}
    >
      <Pane
        width="60%"
        padding={32}
        height="100%"
        display="flex"
        flexDirection="column"
      >
        <Pane style={{ paddingBottom: 16, width: '100%' }} display="flex">
          <TagBar
            ref={tagBarReference}
            tags={activeItem.tags}
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
          <PrimaryField primary={activeItem.primary} onSave={onSavePrimary} />
          <DeleteButton onDelete={onDelete} primary={activeItem.primary} />
        </Pane>

        <Pane width="100%">
          <SecondaryField
            secondary={activeItem.secondary}
            onSave={onSaveSecondary}
          />
        </Pane>
      </Pane>
      <Pane
        style={{
          width: '40%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: `1px solid ${theme.colors.border.default}`
        }}
      >
        <Pane
          flex="1"
          style={{
            userSelect: 'none',
            padding: 32
          }}
        >
          {tab === 'links' && (
            <Pane
              style={{
                display: 'flex',
                height: '100%',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
              }}
            >
              <Heading size={800} color={theme.colors.tint6} paddingBottom={16}>
                Links
              </Heading>
              <LinkButton onSave={onSaveLink} />
              <Pane
                className="browseBodyNoScrollbar"
                marginTop={16}
                borderRadius={4}
                width="100%"
                height="100%"
                overflowY="scroll"
              >
                {activeItem.links &&
                  activeItem.links.map((link) => (
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
          )}
          {tab === 'insights' && (
            <Pane
              style={{
                display: 'flex',
                height: '100%',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
              }}
            >
              <Heading size={800} color={theme.colors.tint6} paddingBottom={16}>
                Insights
              </Heading>
            </Pane>
          )}
          {tab === 'evidence' && (
            <Pane
              style={{
                display: 'flex',
                height: '100%',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
              }}
            >
              <Heading size={800} color={theme.colors.tint6} paddingBottom={16}>
                Evidence
              </Heading>
            </Pane>
          )}
          {tab === 'graph' && (
            <Pane
              style={{
                display: 'flex',
                height: '100%',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
              }}
            >
              <Heading size={800} color={theme.colors.tint6} paddingBottom={16}>
                Graph
              </Heading>
            </Pane>
          )}
        </Pane>
        <Pane
          display="flex"
          flexDirection="row"
          width="100%"
          paddingLeft={32}
          marginBottom={32}
          justifyContent="center"
        >
          {/* <Button
            appearance="primary"
            backgroundColor={
              tab === 'links' ? theme.colors.tint6 : theme.colors.tint5
            }
            onClick={() => {
              setTab('links');
            }}
            marginRight={16}
          >
            Links
          </Button>
          <Button
            appearance="primary"
            backgroundColor={
              tab === 'insights' ? theme.colors.tint6 : theme.colors.tint5
            }
            onClick={() => {
              setTab('insights');
            }}
            marginRight={16}
          >
            Insights
          </Button> */}
          <Group size="large">
            {options.map(({ label, value }) => (
              <Button
                appearance="primary"
                key={label}
                isActive={tab === value}
                onClick={() => setTab(value)}
                backgroundColor={
                  tab === value ? theme.colors.tint5 : theme.colors.tint4
                }
              >
                {label}
              </Button>
            ))}
          </Group>
        </Pane>
      </Pane>
    </Card>
  );
}

export default ActiveItem;
