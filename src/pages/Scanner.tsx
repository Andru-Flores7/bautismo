import React from 'react';
import Header from '@/components/Header';
import QRScanner from '@/components/QRScanner';

const Scanner: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center text-orange-400">Escanear QR</h1>
          
          <QRScanner />
        </div>
      </main>
    </div>
  );
};

export default Scanner;
