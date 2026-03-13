import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import AboutPage from './AboutPage.tsx';
import AeoLandingPage from './AeoLandingPage.tsx';
import TemplatesIndex from './TemplatesIndex.tsx';
import TemplateDetails from './TemplateDetails.tsx';
import AdStudio from './AdStudio.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/studio",
    element: <AdStudio />,
  },
  {
    path: "/templates",
    element: <TemplatesIndex />,
  },
  {
    path: "/templates/:category",
    element: <TemplatesIndex />,
  },
  {
    path: "/templates/:category/:templateId",
    element: <TemplateDetails />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/aeo",
    element: <AeoLandingPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
