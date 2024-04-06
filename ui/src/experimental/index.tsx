import React from 'react';
import { Button, Pane, TagInput } from 'evergreen-ui';
import MDEditor from '@uiw/react-md-editor';
import theme from '../theme';

function Thought() {
  const [isActive, setIsActive] = React.useState(false);
  const [value, setValue] = React.useState('**Hello world!!!**');
  const [tags, setTags] = React.useState(['susie', 'projects', 'sleep']);

  const onChange = (value: string | undefined) => {
    if (value) {
      setValue(value);
    }
  };

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  const color = isActive ? theme.colors.tint3 : theme.colors.tint2;
  return (
    <Pane padding={20} background={color} borderRadius={5} marginTop={20}>
      <Button onClick={toggleActive} appearance="minimal">
        {isActive ? 'Preview' : 'Edit'}
      </Button>
      <TagInput
        inputProps={{ placeholder: 'Add tags...' }}
        values={tags}
        onChange={(values) => {
          setTags(values);
        }}
      />
      {isActive ? (
        <MDEditor value={value} onChange={onChange} preview="edit" />
      ) : (
        <MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap' }} />
      )}
    </Pane>
  );
}

type Entry = {
  id: string;
  date: Date;
  thoughts: Thought[];
};

type Thought = {
  id: string;
  tags: string[];
  content: string;
};

const fakeData: Entry[] = [
  {
    id: '1',
    date: new Date(),
    thoughts: [
      {
        id: '1a',
        tags: ['susie'],
        content: 'Some writing about susie'
      },
      {
        id: '1b',
        tags: ['projects'],
        content: 'An update on a project Im working on.'
      },
      {
        id: '1c',
        tags: ['sleep'],
        content: 'I slept well last night.'
      }
    ]
  },
  {
    id: '2',
    date: new Date(),
    thoughts: [
      {
        id: '2a',
        tags: ['projects'],
        content: 'I finished a project today.'
      },
      {
        id: '2b',
        tags: ['sleep'],
        content: 'I slept poorly last night.'
      }
    ]
  }
];

function Entry({ entry, addThought }: { entry: Entry; addThought: (entryID: string) => void }) {
  return (
    <Pane>
      <Pane>{entry.date.toDateString()}</Pane>
      {entry.thoughts.map((thought, index) => (
        <Thought key={index} />
      ))}
      <Button onClick={() => addThought(entry.id)} appearance="primary" marginTop={20}>
        Add Thought
      </Button>
    </Pane>
  );
}

function Journal() {
  const [entries, setEntries] = React.useState<Entry[]>(fakeData);
  const [currentEntryID, setCurrentEntryID] = React.useState<string | null>('1');

  const addThought = (entryID: string) => {
    const newEntries = entries.map((entry) => {
      if (entry.id === entryID) {
        const newThought = {
          id: '3a',
          tags: [],
          content: ''
        };
        return {
          ...entry,
          thoughts: [...entry.thoughts, newThought]
        };
      }
      return entry;
    });

    setEntries(newEntries);
  };

  const currentEntry = entries.find((entry) => entry.id === currentEntryID);

  return (
    <Pane display="flex" flexDirection="row" justifyContent="space-between">
      <Pane display="flex" flexDirection="column" alignItems="center">
        {entries.map((entry) => (
          <Button key={entry.id} onClick={() => setCurrentEntryID(entry.id)} appearance="minimal">
            {entry.date.toDateString()}
          </Button>
        ))}
      </Pane>
      <Pane display="flex" flexDirection="column" alignItems="center" width="50vw">
        {currentEntry && <Entry entry={currentEntry} addThought={addThought} />}
      </Pane>
    </Pane>
  );
}

export default Journal;
