import React, { useCallback, useEffect } from 'react';
import { Button, Card, Dialog, Strong, TextInput } from 'evergreen-ui';
import { Pane } from 'evergreen-ui';
import { AppDispatch } from '../../state/store';
import { useSelector, useDispatch } from 'react-redux';
import useAPI from '../../hooks/useAPI';
import BrowseableTag from '../../components/BrowseableTag';
import { hsvToRgb } from '../../colourConversionAlgorithms';
import { selectTags, setTags } from '../../state/tagsSlice';

export interface TagManagerRef {
  open: () => void;
}
const getRandomTagColour = () => {
  const hue = Math.random() * 360;
  const saturation = 0.5;
  const value = 0.8;
  const [r, g, b] = hsvToRgb(hue, saturation, value);
  return `rgb(${r},${g},${b})`;
};

const TagManager = React.forwardRef<TagManagerRef>((props, ref) => {
  const [isShown, setIsShown] = React.useState(false);
  const [newTag, setNewTag] = React.useState<string>('');
  const [colour, setColour] = React.useState<string>(getRandomTagColour());
  const tags = useSelector(selectTags);

  const api = useAPI();
  const dispatch = useDispatch<AppDispatch>();

  // External trigger to open the dialog.
  const open = () => setIsShown(true);
  React.useImperativeHandle(ref, () => ({
    open
  }));

  useEffect(() => {
    api.listTags().then((tags) => {
      if (tags) dispatch(setTags(tags));
    });
  }, []);

  const onCreateTag = useCallback(() => {
    if (!newTag) return;
    setColour(getRandomTagColour());
    api
      .createTag({
        tag: {
          name: newTag.toLowerCase(),
          description: 'not used',
          colour: colour
        }
      })
      .then((tag) => {
        setNewTag('');
        if (!tag) return;
        dispatch(setTags([...tags, tag]));
      });
  }, [newTag, colour]);

  const newColour = useCallback(() => {
    setColour(getRandomTagColour());
  }, [colour]);

  return (
    <>
      <Dialog
        isShown={isShown}
        title="Tag Manager"
        onCloseComplete={() => setIsShown(false)}
        confirmLabel="Finished"
        hasCancel={false}
      >
        {tags.map((tag) => (
          <BrowseableTag
            key={tag.id}
            tag={tag}
            selected={false}
            onSelect={() => {
              console.log(tag.name);
            }}
          />
        ))}
        <Pane display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" marginTop={16}>
          <TextInput
            placeholder="New Tag"
            value={newTag}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTag(e.target.value)}
          />
          <Card
            backgroundColor={colour}
            onClick={() => newColour()}
            marginLeft={16}
            userSelect="none"
            width={64}
            height={32}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            fontSize={14}
          >
            <Strong color="white">Colour</Strong>
          </Card>
          <Button appearance="primary" onClick={() => onCreateTag()} marginLeft={16} disabled={newTag === ''}>
            Create Tag
          </Button>
        </Pane>
      </Dialog>
    </>
  );
});

export default TagManager;
