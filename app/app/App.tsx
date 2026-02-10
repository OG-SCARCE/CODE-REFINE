
import React from 'react';
import AnalysisView from './components/AnalysisView';
import ParticlesBackground from './components/ParticlesBackground';

export default function App() {
  return (
    <main className="relative bg-black min-h-screen text-white overflow-x-hidden">
      <ParticlesBackground />
      <div className="relative z-10">
        <AnalysisView />
      </div>
    </main>
  );
}
