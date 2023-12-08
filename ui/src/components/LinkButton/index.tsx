import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';

import { Pane, Popover, Select, Position, Text, LinkIcon, Button, SearchInput } from 'evergreen-ui';

import { LightItem, SetLink } from '../../types';
import theme from '../../theme';
import BrowseableItem from '../BrowseableItem';
import useAPI from '../../hooks/useAPI';
import { useSelector } from 'react-redux';
import { selectCurrentProject } from '../../state/projects';

interface LinkButtonProps {
  onSave: (link: SetLink) => void;
  parentID: number;
}

type BasicItem = {
  id: number;
  primary: string;
  secondary: string;
};

type LinkType = 'relates_to' | 'supports';

const LinkButton: React.FC<LinkButtonProps> = ({ onSave, parentID }) => {
  const [linkType, setLinkType] = useState<LinkType>('relates_to');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [items, setItems] = useState<BasicItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<BasicItem | null>();
  const [editMode, setEditMode] = useState<boolean>(false);
  const project = useSelector(selectCurrentProject);
  const api = useAPI();

  const fetchItems = useCallback(
    debounce(async (searchQuery: string) => {
      setIsLoading(true);
      if (!project) return;
      const items = await api.listItems({ searchTerm: searchQuery, project: project.id });
      if (items) {
        setItems(items.filter((i) => i.id !== parentID));
      }
      setIsLoading(false);
    }, 250),
    []
  );

  useEffect(() => {
    fetchItems(searchTerm);
  }, [searchTerm]);

  const openSearch = useCallback(() => {
    fetchItems(searchTerm);
    setEditMode(true);
  }, []);

  const onSearchTermChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

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
    <Pane display="flex" flexDirection="row" alignItems="center" width="100%" justifyContent="flex-end">
      <Pane>
        <Select value={linkType} onChange={(event) => setLinkType(event.target.value as LinkType)}>
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
                    <BrowseableItem item={item as LightItem} selected={false} onSelect={() => null} />
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
