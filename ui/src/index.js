import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as Sentry from '@sentry/react';

if (window.location.origin !== 'http://localhost:3000') {
  Sentry.init({
    dsn: 'https://41fe9e6df2964c49435033d84472adab@o382306.ingest.us.sentry.io/4507040224444416',
    integrations: [new Sentry.Replay()],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
