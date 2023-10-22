import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';

import {
  Pane,
  IconButton,
  TextInput,
  Popover,
  Select,
  Position,
  Text,
  Paragraph,
  LinkIcon,
  CaretLeftIcon,
  Button,
  SelectMenu,
  Tooltip,
  EditIcon
} from 'evergreen-ui';
import { set } from 'lodash';

import { SetLink } from '../../types';

interface LinkButtonProps {
  onSave: (link: SetLink) => void;
}

type BasicItem = {
  id: number;
  primary: string;
};

type SearchAPIResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: BasicItem[];
};

type LinkType = 'relates_to' | 'supports';

const URL = 'http://localhost:8000/api/items';

const LinkButton: React.FC<LinkButtonProps> = ({ onSave }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [linkType, setLinkType] = useState<LinkType>('relates_to');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [items, setItems] = useState<BasicItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedItem, setSelectedItem] = useState<BasicItem | null>();
  const [editMode, setEditMode] = useState<boolean>(false);

  const fetchItems = useCallback(
    debounce(async (searchQuery: string) => {
      setIsLoading(true);
      try {
        const response = await fetch(`${URL}/?search=${searchQuery}`);
        const data = (await response.json()) as SearchAPIResponse;
        const items = data.results as BasicItem[];
        setItems(items);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchItems(searchTerm);
  }, [searchTerm]);

  const onSearchTermChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    []
  );

  const onSelectItem = useCallback((item: string) => {
    setSearchTerm(item);
    setEditMode(false);
  }, []);

  useEffect(() => {
    setSelectedItem(items.find((i) => i.primary === searchTerm) || null);
  }, [items, searchTerm]);

  const shorten = (s: string) => {
    if (s.length > 40) {
      return s.slice(0, 40) + '...';
    }
    return s;
  };

  const onLocalSave = useCallback(() => {
    if (selectedItem) {
      setOpen(false);
      onSave({
        relation_type: linkType,
        to_item: selectedItem.id
      });
      setSelectedItem(null);
      setSearchTerm('');
    }
  }, [selectedItem]);

  const content = (
    <>
      <Pane
        marginLeft={40}
        display="flex"
        width={300}
        padding={8}
        alignItems="start"
        flexDirection="column"
        position="absolute"
        backgroundColor="white"
        border="1px solid #DDDDEE"
        borderRadius={4}
        zIndex={1}
      >
        <Paragraph size={300} color="gray700" textAlign="left">
          Create link of type:
        </Paragraph>
        <Select
          value={linkType}
          height={24}
          onChange={(event) => setLinkType(event.target.value as LinkType)}
        >
          <option value="relates_to">relates_to</option>
          <option value="supports">supports</option>
        </Select>
        <Pane>
          <Pane marginTop={8} height={32}>
            <TextInput
              placeholder="No item selected..."
              value={searchTerm}
              onChange={onSearchTermChange}
              onFocus={() => setEditMode(true)}
              onBlur={() => setTimeout(() => setEditMode(false), 200)}
            />
          </Pane>
          {!isLoading && !error && editMode && (
            <Pane
              width="100%"
              backgroundColor="white"
              border="1px solid #edeff5"
            >
              <Pane display="flex" flexDirection="column" alignItems="start">
                {items.map((item, index) => (
                  <Pane
                    key={index}
                    width="100%"
                    paddingLeft={4}
                    paddingRight={4}
                    style={{ transition: 'background 0.2s', cursor: 'pointer' }}
                    onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                      e.currentTarget.style.backgroundColor = 'lightgray';
                    }}
                    onMouseOut={(e: React.MouseEvent<HTMLDivElement>) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                    onClick={() => onSelectItem(item.primary)}
                  >
                    <Tooltip content={item.primary} showDelay={1000}>
                      <Paragraph size={300} textAlign="left">
                        {shorten(item.primary)}
                      </Paragraph>
                    </Tooltip>
                  </Pane>
                ))}
              </Pane>
            </Pane>
          )}
        </Pane>
        {!selectedItem && (
          <Pane marginTop={8}>
            <Paragraph size={300} color="gray700" textAlign="left">
              Not a valid item.
            </Paragraph>
          </Pane>
        )}
        <Pane
          marginTop={8}
          width="100%"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Button
            appearance="primary"
            onClick={onLocalSave}
            iconBefore={LinkIcon}
            disabled={selectedItem === null}
          >
            Create Link
          </Button>
        </Pane>
      </Pane>
      <CaretLeftIcon
        position="absolute"
        marginLeft={28}
        marginTop={6}
        size={20}
        color="gray500"
      />
    </>
  );

  return (
    <Pane display="flex">
      <IconButton
        icon={LinkIcon}
        onClick={() => setOpen((prev) => !prev)}
        intent={open ? 'success' : 'none'}
      />
      {open && content}
    </Pane>
  );
};

export default LinkButton;
