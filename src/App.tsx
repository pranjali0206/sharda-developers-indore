import { Route, Routes } from 'react-router-dom';
import { LazyMotion, MotionConfig } from 'framer-motion';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProjectPage } from './pages/ProjectPage';
import { ThankYouPage } from './pages/ThankYouPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { NotFoundPage } from './pages/NotFoundPage';

const loadMotionFeatures = () => import('./lib/motionFeatures').then((m) => m.default);

export function App() {
  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ ease: [0.2, 0.7, 0.2, 1] }}>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/sharda-paradise" element={<ProjectPage slug="paradise" />} />
            <Route path="/sharda-greens" element={<ProjectPage slug="greens" />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/privacy-policy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </MotionConfig>
    </LazyMotion>
  );
}
