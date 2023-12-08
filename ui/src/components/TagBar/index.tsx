import { TagInput, toaster, Pane, Card, Text } from 'evergreen-ui';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectTags } from '../../state/tagsSlice';

interface TagBarProps {
  tags: number[];
  onSave: (tags: number[]) => void;
  frozen?: boolean;
}

const TagBar = React.forwardRef(({ tags, onSave, frozen }: TagBarProps, ref) => {
  const allTags = useSelector(selectTags);

  const values: string[] = React.useMemo(() => {
    if (!tags) return [];
    return tags.map((tag) => {
      const tagObj = allTags.find((t) => t.id === tag);
      if (tagObj) {
        return tagObj.name.toLowerCase();
      }
      return '';
    });
  }, [tags, allTags]);

  const allValues = useMemo(() => {
    return allTags.map((tag) => tag.name);
  }, [allTags]);

  const onChange = useCallback(
    (values: string[]) => {
      const tagIds: number[] = [];
      for (const value of values) {
        const tag = allTags.find((t) => t.name === value.toLowerCase());
        if (tag) {
          tagIds.push(tag.id);
        }
      }
      if (tagIds.length != values.length) {
        toaster.danger("That tag doesn't exist. Add it from the tag menu.");
        return;
      }
      onSave(tagIds);
    },
    [allTags, onSave]
  );

  const getTagProps = useCallback(
    (value: string) => {
      const tag = allTags.find((t) => t.name === value.toLowerCase());
      if (tag) {
        return {
          color: 'white',
          backgroundColor: tag.colour
        };
      }
      return {};
    },
    [allTags]
  );

  const autocompleteItems: string[] = React.useMemo(() => {
    return allValues.filter((i) => !values.includes(i));
  }, [allValues, values]);

  const editableUI = (
    <TagInput
      width="100%"
      inputRef={ref as React.RefObject<HTMLInputElement>}
      inputProps={{ placeholder: 'Ctrl + L to add a tag' }}
      values={values}
      onChange={onChange}
      autocompleteItems={autocompleteItems}
      tagProps={(value: string) => getTagProps(value)}
    />
  );

  const frozenUI = (
    <Pane display="flex" flexDirection="row" flexWrap="wrap">
      {values.map((value) => (
        <Card
          key={value}
          marginRight={8}
          paddingLeft={8}
          paddingRight={8}
          cursor="pointer"
          userSelect="none"
          style={{ backgroundColor: getTagProps(value).backgroundColor }}
        >
          <Text color="white" fontSize={12}>
            {value.toLowerCase()}
          </Text>
        </Card>
      ))}
    </Pane>
  );

  return frozen ? frozenUI : editableUI;
});

export default TagBar;
