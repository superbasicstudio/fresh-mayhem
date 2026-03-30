import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';
import DashboardLayout from './layouts/DashboardLayout';
import OverviewPage from './pages/OverviewPage';
import ControlsPage from './pages/ControlsPage';
import ReceivePage from './pages/ReceivePage';
import TransmitPage from './pages/TransmitPage';
import ToolsPage from './pages/ToolsPage';
import SafetyPage from './pages/SafetyPage';
import FrequenciesPage from './pages/FrequenciesPage';
import LearnPage from './pages/LearnPage';
import QuickStartPage from './pages/QuickStartPage';
import TroubleshootingPage from './pages/CommonIssuesPage';
import WhereToBuyPage from './pages/WhereToBuyPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="controls" element={<ControlsPage />} />
          <Route path="receive" element={<ReceivePage />} />
          <Route path="transmit" element={<TransmitPage />} />
          <Route path="tools" element={<ToolsPage />} />
          <Route path="safety" element={<SafetyPage />} />
          <Route path="frequencies" element={<FrequenciesPage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="quickstart" element={<QuickStartPage />} />
          <Route path="troubleshooting" element={<TroubleshootingPage />} />
          <Route path="where-to-buy" element={<WhereToBuyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
