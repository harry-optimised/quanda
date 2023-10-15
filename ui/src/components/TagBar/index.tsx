import { TagInput, toaster } from 'evergreen-ui';
import React, { useCallback, useMemo } from 'react';
import useTags from '../../hooks/useTags';

interface TagBarProps {
  tags: number[];
  onSave: (tags: number[]) => void;
}

const TagBar = ({ tags, onSave }: TagBarProps) => {
  const { tags: allTags, error: tagError, isLoading: tagLoading } = useTags();

  const values: string[] = React.useMemo(() => {
    return tags.map((tag) => {
      const tagObj = allTags.find((t) => t.id === tag);
      if (tagObj) {
        return tagObj.name;
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
    [allTags]
  );

  const getTagProps = useCallback(
    (value: string) => {
      const tag = allTags.find((t) => t.name === value.toLowerCase());
      if (tag) {
        return {
          color: tag.colour
        };
      }
      return {};
    },
    [allTags]
  );

  const autocompleteItems: string[] = React.useMemo(() => {
    return allValues.filter((i) => !values.includes(i));
  }, [allValues, values]);

  return (
    <TagInput
      width="100%"
      inputProps={{ placeholder: 'Enter something...' }}
      values={values}
      onChange={onChange}
      autocompleteItems={autocompleteItems}
      tagProps={(value: string) => getTagProps(value)}
    />
  );
};

export default TagBar;
