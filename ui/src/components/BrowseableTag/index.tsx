import React, { useCallback } from 'react';
import theme from '../../theme';
import { Tag } from '../../types';
import { Pane, Card, Text, Icon, Strong, TrashIcon } from 'evergreen-ui';
import useAPI from '../../hooks/useAPI';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../state/store';
import { removeTag } from '../../state/tagsSlice';

interface BrowseableTagProps {
  tag: Tag;
  selected: boolean;
  onSelect: (tag: Tag) => void;
}

function BrowseableTag({ tag, selected, onSelect }: BrowseableTagProps) {
  const [hover, setHover] = React.useState<boolean>(false);
  const api = useAPI();
  const dispatch = useDispatch<AppDispatch>();
  const [confirmDelete, setConfirmDelete] = React.useState<boolean>(false);

  const opacity = hover && !selected ? 0.6 : 1;

  const onDelete = useCallback(() => {
    api.deleteTag(tag.id).then(() => {
      dispatch(removeTag(tag.id));
    });
  }, [tag]);

  return (
    <Pane>
      <Card
        key={tag.id}
        display="flex"
        padding={8}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        cursor="pointer"
        userSelect="none"
        onClick={() => onSelect(tag)}
        style={{ backgroundColor: tag.colour }}
        marginBottom={8}
      >
        <Strong color="white" textAlign="left">
          {tag.name}
        </Strong>

        <Icon
          icon={TrashIcon}
          onClick={() => setConfirmDelete(true)}
          color="white"
          opacity={opacity}
          style={{ transition: 'opacity 0.1s' }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
      </Card>
      {confirmDelete && (
        <Pane marginTop={12} userSelect="none" backgroundColor={theme.colors.white} borderRadius={4} padding={4}>
          <Pane display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
            <Strong color={theme.colors.gray800} textAlign="left" fontSize={14}>
              Are you sure?
            </Strong>
          </Pane>
          <Pane display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
            <Text color={theme.colors.gray800} textAlign="left" fontSize={14}>
              This tag be removed from all items and cannot be recovered.
            </Text>
          </Pane>
          <Pane display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end" marginTop={16}>
            <Strong
              color={theme.colors.gray800}
              textAlign="left"
              fontSize={14}
              cursor="pointer"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Strong>
            <Strong
              color={theme.colors.red500}
              textAlign="left"
              marginLeft={16}
              fontSize={14}
              cursor="pointer"
              onClick={() => onDelete()}
            >
              Delete
            </Strong>
          </Pane>
        </Pane>
      )}
    </Pane>
  );
}

export default BrowseableTag;
