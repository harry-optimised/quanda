import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';

import {
  Pane,
  Popover,
  Select,
  Position,
  Text,
  LinkIcon,
  Button,
  SearchInput
} from 'evergreen-ui';

import { LightItem, SetLink } from '../../types';
import theme from '../../theme';
import BrowseableItem from '../BrowseableItem';
import { useAuth0 } from '@auth0/auth0-react';

interface LinkButtonProps {
  onSave: (link: SetLink) => void;
}

type BasicItem = {
  id: number;
  primary: string;
  secondary: string;
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
  const [linkType, setLinkType] = useState<LinkType>('relates_to');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [items, setItems] = useState<BasicItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<BasicItem | null>();
  const [editMode, setEditMode] = useState<boolean>(false);
  const { getAccessTokenSilently } = useAuth0();

  const fetchItems = useCallback(
    debounce(async (searchQuery: string) => {
      setIsLoading(true);
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${URL}/?search=${searchQuery}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const data = (await response.json()) as SearchAPIResponse;
        const items = data.results as BasicItem[];
        setItems(items);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchItems(searchTerm);
  }, [searchTerm]);

  const openSearch = useCallback(() => {
    fetchItems(searchTerm);
    setEditMode(true);
  }, []);

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

  const onLocalSave = useCallback(() => {
    if (selectedItem) {
      onSave({
        relation_type: linkType,
        to_item: selectedItem.id
      });
      setSelectedItem(null);
      setSearchTerm('');
    }
  }, [selectedItem]);

  return (
    <Pane
      display="flex"
      flexDirection="row"
      alignItems="center"
      width="100%"
      justifyContent="flex-end"
    >
      <Pane>
        <Select
          value={linkType}
          onChange={(event) => setLinkType(event.target.value as LinkType)}
        >
          <option value="relates_to">relates_to</option>
          <option value="supports">supports</option>
        </Select>
      </Pane>
      <Pane marginLeft={16} flexGrow={1}>
        <Pane>
          <SearchInput
            placeholder="Search item to link"
            value={searchTerm}
            width="100%"
            onChange={onSearchTermChange}
            onFocus={openSearch}
            onBlur={() => setTimeout(() => setEditMode(false), 100)}
          />
        </Pane>

        <Popover
          isShown={!isLoading && editMode}
          minWidth={500}
          minHeight="70vh"
          position={Position.BOTTOM}
          content={
            <Pane
              width={500}
              height="70vh"
              backgroundColor={theme.colors.tint3}
              borderRadius={4}
              overflowY="scroll"
              className="browseBodyNoScrollbar"
            >
              <Pane display="flex" flexDirection="column" alignItems="start">
                {items.map((item, index) => (
                  <Pane
                    key={index}
                    width="100%"
                    paddingLeft={4}
                    marginTop={4}
                    style={{ transition: 'opacity 0.1s', cursor: 'pointer' }}
                    onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                      e.currentTarget.style.opacity = '0.6';
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    onClick={() => onSelectItem(item.primary)}
                  >
                    <BrowseableItem
                      item={item as LightItem}
                      selected={false}
                      onSelect={() => null}
                    />
                  </Pane>
                ))}
              </Pane>
            </Pane>
          }
        >
          <Text></Text>
        </Popover>
      </Pane>
      {/* {!selectedItem && (
          <Pane>
            <Paragraph size={300} color="gray700" textAlign="center">
              Not a valid item.
            </Paragraph>
          </Pane>
        )} */}

      <Button
        marginLeft={16}
        appearance="primary"
        onClick={onLocalSave}
        iconBefore={LinkIcon}
        disabled={selectedItem === null}
      >
        Create Link
      </Button>
    </Pane>
  );
};

export default LinkButton;
