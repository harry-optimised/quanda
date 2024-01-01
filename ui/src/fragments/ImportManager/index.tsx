import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAPI } from '../../hooks';
import { selectCurrentProject } from '../../state/projects';
import { Dialog, FileCard, FileUploader, majorScale, Pane, Paragraph, FileRejection } from 'evergreen-ui';

export interface ImportManagerRef {
  open: () => void;
}

const ImportManager = React.forwardRef<ImportManagerRef>((props, ref) => {
  const [isShown, setIsShown] = React.useState(false);
  const project = useSelector(selectCurrentProject);
  const [files, setFiles] = React.useState<File[]>([]);
  const [fileRejections, setFileRejections] = React.useState<FileRejection[]>([]);

  const handleChange = React.useCallback((files: File[]) => setFiles([files[0]]), []);
  const handleRejected = React.useCallback(
    (fileRejections: FileRejection[]) => setFileRejections([fileRejections[0]]),
    []
  );
  const handleRemove = React.useCallback(() => {
    setFiles([]);
    setFileRejections([]);
  }, []);

  const api = useAPI();

  // External trigger to open the dialog.
  const open = () => setIsShown(true);
  React.useImperativeHandle(ref, () => ({
    open
  }));

  const onImportData = useCallback(() => {
    if (files.length !== 1) return;
    const file = files[0];
    if (!project) return;
    api
      .importProject(project.id, file)
      .then(() => {
        setIsShown(false);
      })
      .catch((error) => {
        console.error('Error during import:', error);
      });
  }, [files, project, api]);

  return (
    <>
      <Dialog
        isShown={isShown}
        title="Import Data"
        onCloseComplete={() => setIsShown(false)}
        confirmLabel="Import"
        onConfirm={onImportData}
        hasCancel={false}
      >
        <Paragraph marginBottom={majorScale(4)}>
          Importing an existing <strong>.quanda </strong> file to add all items to this project. This will not overwrite
          any existing items. Items that already exist (matched by the ID) will be skipped.
        </Paragraph>
        <Pane maxWidth={654}>
          <FileUploader
            label="Upload File"
            description="You can upload 1 file. File can be up to 50 MB."
            maxSizeInBytes={50 * 1024 ** 2}
            maxFiles={1}
            onChange={handleChange}
            onRejected={handleRejected}
            renderFile={(file) => {
              const { name, size, type } = file;
              const fileRejection = fileRejections.find((fileRejection) => fileRejection.file === file);
              const { message } = fileRejection || {};
              return (
                <FileCard
                  key={name}
                  isInvalid={fileRejection != null}
                  name={name}
                  onRemove={handleRemove}
                  sizeInBytes={size}
                  type={type}
                  validationMessage={message}
                />
              );
            }}
            values={files}
          />
        </Pane>
      </Dialog>
    </>
  );
});

export default ImportManager;
