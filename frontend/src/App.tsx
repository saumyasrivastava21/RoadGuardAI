import { useState } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { DetectionPage } from './pages/DetectionPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'detection'>('landing');

  return (
    <Layout onNavigate={setCurrentPage}>
      {currentPage === 'landing' ? (
        <LandingPage onNavigate={setCurrentPage} />
      ) : (
        <DetectionPage />
      )}
    </Layout>
  );
}

export default App;
