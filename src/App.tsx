import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import Threshold from './pages/universe/Threshold';
import { exhibitPath } from './content/sections';

// Every destination loads on demand, so the Threshold downloads only itself.
const Universe = lazy(() => import('./pages/universe/Universe'));
const Identity = lazy(() => import('./pages/universe/Identity'));
const Process = lazy(() => import('./pages/universe/Process'));
const Exhibition = lazy(() => import('./pages/universe/Exhibition'));
const Elsewhere = lazy(() => import('./pages/universe/Elsewhere'));
const Contact = lazy(() => import('./pages/universe/Contact'));
const Brief = lazy(() => import('./pages/Brief'));
const CaseStudy = lazy(() => import('./pages/CaseStudy'));
const NotFound = lazy(() => import('./pages/NotFound'));

function Loading() {
  return <div className="min-h-[60vh]" aria-busy="true" />;
}

/** Old project addresses (/work/naad-ai) forward to their rooms. */
function OldWork() {
  const { slug } = useParams();
  return <Navigate to={exhibitPath(slug ?? '')} replace />;
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Threshold />} />
          <Route path="universe" element={<Universe />} />
          <Route path="identity" element={<Identity />} />
          <Route path="process" element={<Process />} />
          <Route path="exhibition" element={<Exhibition />} />
          <Route path="exhibition/:slug" element={<CaseStudy />} />
          <Route path="elsewhere" element={<Elsewhere />} />
          <Route path="contact" element={<Contact />} />
          <Route path="brief" element={<Brief />} />
          <Route path="work" element={<Navigate to="/exhibition" replace />} />
          <Route path="work/:slug" element={<OldWork />} />
          <Route path="about" element={<Navigate to="/identity" replace />} />
          <Route path="design" element={<Navigate to="/universe" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
