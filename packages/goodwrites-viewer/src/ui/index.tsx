import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import { DocProvider } from './features/doc';

const createRootElement = () => {
  const rootContainer = document.createElement('div');
  rootContainer.setAttribute('id', 'root');
  document.body.appendChild(rootContainer);
  return rootContainer;
};

const rootElement = document.getElementById('root') || createRootElement();

const Root = () => {
  return (
    <DocProvider>
      <App />
    </DocProvider>
  );
};

createRoot(rootElement).render(<Root />);
