
import React from 'react';
import Header from '@/components/Header';
import QRScanner from '@/components/QRScanner';

const Scanner: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container px-4 py-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-center">Escaneo de QR</h1>
          
          <QRScanner />
        </div>
      </main>
    </div>
  );
};

export default Scanner;
