import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Shell from './components/Shell.jsx';
import Home from './pages/Home.jsx';
import ProjectRoute, { LegacyProjectRedirect } from './pages/Project.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projeto/:slug" element={<ProjectRoute />} />
          <Route path="/projeto.html" element={<LegacyProjectRedirect />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}
