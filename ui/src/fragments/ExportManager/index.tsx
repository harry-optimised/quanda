import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAPI } from '../../hooks';
import { selectCurrentProject } from '../../state/projects';
import { Dialog, Paragraph } from 'evergreen-ui';

export interface ExportManagerRef {
  open: () => void;
}

const ExportManager = React.forwardRef<ExportManagerRef>((props, ref) => {
  const [isShown, setIsShown] = React.useState(false);
  const project = useSelector(selectCurrentProject);

  const api = useAPI();

  // External trigger to open the dialog.
  const open = () => setIsShown(true);
  React.useImperativeHandle(ref, () => ({
    open
  }));

  const onExportData = useCallback(() => {
    console.log('!');
    if (!project) return;
    api
      .exportProject(project.id)
      .then((response) => {
        if (!response) return;

        const url = window.URL.createObjectURL(response.blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', response.name);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Error during export:', error);
      });

    setIsShown(false);
  }, [project, api]);

  return (
    <>
      <Dialog
        isShown={isShown}
        title="Export Data"
        onCloseComplete={() => setIsShown(false)}
        confirmLabel="Export"
        onConfirm={onExportData}
        hasCancel={false}
      >
        <Paragraph>
          Exporting data will generate a Pickle file containing all the data in the project. This can be used to import
          at a later time, or import into another project.
        </Paragraph>
      </Dialog>
    </>
  );
});

export default ExportManager;
