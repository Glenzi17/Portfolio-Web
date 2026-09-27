import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router';
import Shell from './components/Shell.jsx';
import Home from './pages/Home.jsx';

// A página de projeto vira um pacote à parte, baixado sob demanda. Para a
// cortina nunca abrir sobre uma tela vazia, ele é pré-carregado assim que o
// navegador fica ocioso (e o próprio clique já o encontra em cache).
const loadProject = () => import('./pages/Project.jsx');
const ProjectRoute = lazy(loadProject);

function LegacyProjectRedirect() {
  const [params] = useSearchParams();
  const slug = params.get('p');
  return <Navigate to={slug ? `/projeto/${slug}` : '/'} replace />;
}

function Prefetch() {
  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
    const id = idle(() => { loadProject(); });
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(id) : clearTimeout(id));
  }, []);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Prefetch />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projeto/:slug" element={<Suspense fallback={null}><ProjectRoute /></Suspense>} />
          <Route path="/projeto.html" element={<LegacyProjectRedirect />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}
