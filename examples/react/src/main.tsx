import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { PageTreeProvider } from './PageTreeProvider.tsx';
import { PageHandler } from './components/PageHandler.tsx';

const router = createBrowserRouter([
  {
    path: '*',
    element: <PageHandler />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageTreeProvider>
      <RouterProvider router={router} />
    </PageTreeProvider>
  </React.StrictMode>,
);
