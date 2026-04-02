import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import AboutPage from './AboutPage.tsx';
import AeoLandingPage from './AeoLandingPage.tsx';
import TemplatesIndex from './TemplatesIndex.tsx';
import TemplateDetails from './TemplateDetails.tsx';
import AdStudio from './AdStudio.tsx';
import BlueprintSalesPage from './components/BlueprintSalesPage.tsx';
import FulfillmentPage from './components/FulfillmentPage.tsx';
import StrategyResultsPage from './components/StrategyResultsPage.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/blueprint",
    element: <BlueprintSalesPage />,
  },
  {
    path: "/fulfillment",
    element: <FulfillmentPage />,
  },
  {
    path: "/fulfillment/:id",
    element: <FulfillmentPage />,
  },
  {
    path: "/strategy-results",
    element: <StrategyResultsPage />,
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
    path: "/geo",
    element: <AeoLandingPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>,
);
