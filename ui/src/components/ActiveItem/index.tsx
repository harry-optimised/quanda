import '../../App.css';
import React, { useCallback } from 'react';
import theme from '../../theme';
import { Button, CleanIcon, Heading, Icon, PlusIcon, TrashIcon } from 'evergreen-ui';
import { Entry, Thought } from '../../types';
import { Pane, Card } from 'evergreen-ui';
import { AppDispatch, selectItem as selectEntry } from '../../state/store';
import { useSelector, useDispatch } from 'react-redux';
import TagBar from '../../components/TagBar';

import ThoughtEditor from '../ThoughtEditor';

import { updateEntry } from '../../state/navigator';
import useAPI from '../../hooks/useAPI';
import { setEntry } from '../../state/item';

function ActiveItem() {
  const activeEntry = useSelector(selectEntry);
  const api = useAPI();
  const dispatch = useDispatch<AppDispatch>();

  const handleNewThought = useCallback(() => {
    if (!activeEntry) return;
    const newThought: Omit<Thought, 'id' | 'entry'> = {
      content: '',
      tags: []
    };
    api.createThought({ entryId: activeEntry.id, item: newThought }).then((thought) => {
      if (!thought) return;
      dispatch(setEntry({ entry: { ...activeEntry, thoughts: [...activeEntry.thoughts, thought] } }));
    });
  }, [activeEntry, dispatch]);

  const handleDeleteThought = useCallback(
    (thoughtId: string) => {
      if (!activeEntry) return;
      api.deleteThought({ entryId: activeEntry.id, thoughtId }).then(() => {
        const updatedThoughts = activeEntry.thoughts.filter((thought) => thought.id !== thoughtId);
        dispatch(setEntry({ entry: { ...activeEntry, thoughts: updatedThoughts } }));
      });
    },
    [activeEntry, dispatch]
  );

  const handleUpdateThoughtContent = useCallback(
    (thoughtId: string, item: Partial<Thought>) => {
      if (!activeEntry) return;
      api.updateThought({ entryId: activeEntry.id, thoughtId, item }).then((thought) => {
        if (!thought) return;
        const updatedThoughts = activeEntry.thoughts.map((t) => (t.id === thoughtId ? thought : t));
        dispatch(setEntry({ entry: { ...activeEntry, thoughts: updatedThoughts } }));
      });
    },
    [activeEntry, dispatch]
  );

  const handleUpdateThoughtTags = useCallback(
    (thoughtId: string, tags: string[]) => {
      if (!activeEntry) return;
      const thought = activeEntry.thoughts.find((t) => t.id === thoughtId);
      if (!thought) return;
      handleUpdateThoughtContent(thoughtId, { tags });
    },
    [activeEntry, handleUpdateThoughtContent]
  );

  const tagBarReference = React.useRef<HTMLInputElement>(null);

  if (!activeEntry) {
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
        <Icon icon={CleanIcon} size={96} color={theme.colors.gray500} marginBottom={32} />
        <Heading size={800} color={theme.colors.gray500} paddingLeft={16}>
          Nothing selected
        </Heading>
        <Heading size={600} color={theme.colors.gray500} paddingLeft={16}>
          Choose an item from the sidebar
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
      <Pane width="100%" padding={32} height="100%" display="flex" flexDirection="column">
        {activeEntry.thoughts.map((thought) => (
          <Pane
            key={thought.id}
            display="flex"
            flexDirection="column"
            alignItems="center"
            marginBottom={16}
            backgroundColor={theme.colors.gray100}
            padding={16}
            borderRadius={8}
          >
            <Pane display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" width="100%">
              <TagBar
                ref={tagBarReference}
                tags={thought.tags}
                onSave={(tags) => handleUpdateThoughtTags(thought.id, tags)}
              />
              <Button
                onClick={() => handleDeleteThought(thought.id)}
                appearance="secondary"
                iconBefore={TrashIcon}
                marginLeft={8}
              >
                Delete
              </Button>
            </Pane>
            <ThoughtEditor
              secondary={thought.content}
              onSave={(content) => handleUpdateThoughtContent(thought.id, { content })}
            />
          </Pane>
        ))}
        <Button onClick={handleNewThought} appearance="minimal" iconBefore={PlusIcon}>
          Add thought
        </Button>
      </Pane>
    </Card>
  );
}

export default ActiveItem;
