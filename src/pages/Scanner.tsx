import React from 'react';
import Header from '@/components/Header';

const Scanner: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center text-orange-400">Página eliminada</h1>
          <p className="text-center">Ya no se utiliza el escáner QR en esta aplicación.</p>
        </div>
      </main>
    </div>
  );
};

export default Scanner;
