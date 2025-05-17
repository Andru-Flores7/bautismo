
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '@/utils/storage';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, UserPlus } from 'lucide-react';

const Index: React.FC = () => {
  const [stats, setStats] = useState({ total: 0, attended: 0, notAttended: 0 });

  useEffect(() => {
    const currentStats = getStats();
    setStats(currentStats);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bautizo QR</h1>
            <p className="text-gray-600">Sistema de registro y asistencia con códigos QR</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{stats.total}</CardTitle>
                <CardDescription>Alumnos registrados</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-green-600">{stats.attended}</CardTitle>
                <CardDescription>Asistencias</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-orange-500">{stats.notAttended}</CardTitle>
                <CardDescription>Pendientes</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Registrar Alumnos</CardTitle>
                <CardDescription>
                  Agrega alumnos y genera códigos QR para cada uno
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/register" className="flex items-center justify-center">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Ir a Registro
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Escanear Códigos QR</CardTitle>
                <CardDescription>
                  Escanea los códigos QR para registrar asistencia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/scanner" className="flex items-center justify-center">
                    <QrCode className="mr-2 h-5 w-5" />
                    Ir a Scanner
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-700 font-medium mb-1">DESARROLLADO POR ANDRÉS </p>
          <p className="text-gray-500 text-sm">
            E-mail: <a href="mailto:andresflores160200@gmail.com" className="text-blue-500 hover:underline">andresflores160200@gmail.com</a>
          </p>
          <p>3884636451</p>
          <p className="text-gray-400 text-xs mt-2">
            © {new Date().getFullYear()} Bautizo QR - Sistema de Asistencia
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
