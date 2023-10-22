import './App.css';
import React, { useCallback } from 'react';
import 'reactflow/dist/style.css';
import theme from './theme';
import { ThemeProvider } from 'evergreen-ui';
import Flow from './components/Flow';
import BottomBar from './components/BottomBar';
import Drawer from './components/Drawer';
import { Item } from './types';
import { toaster } from 'evergreen-ui';
import { store } from './state/store';
import { Provider } from 'react-redux';

// export type Item = {
//   id: number;
//   primary: string;
//   secondary: string;
//   confidence: number;
//   tags: number[];
//   evidence: number[];
//   frozen: boolean;
//   priority: boolean;
//   system: number;
// };

function App() {
  const [item, setItem] = React.useState(3);

  const onAddItem = useCallback((primary: string) => {
    const newItem = {
      primary: primary,
      secondary: 'null',
      confidence: 0,
      tags: [],
      evidence: [],
      frozen: false,
      priority: false,
      project: 1
    };
    fetch(`http://localhost:8000/api/items/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newItem)
    })
      .then((response) => response.json())
      .then((data) => {
        setItem(data.id);
      });
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider value={theme}>
        <div className="App" style={{ width: '100%', height: '100vh' }}>
          <Flow />
          <Drawer />
          <BottomBar onSave={onAddItem} />
        </div>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
