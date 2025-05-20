import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '@/utils/storage';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

const Index: React.FC = () => {
  const [stats, setStats] = useState({ total: 0, attended: 0, notAttended: 0 });

  useEffect(() => {
    const currentStats = getStats();
    setStats(currentStats);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-orange-400 mb-2">Bautizo QR</h1>
            <p className="text-orange-200">Sistema de registro y asistencia con códigos QR</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-orange-400">{stats.total}</CardTitle>
                <CardDescription className="text-orange-200">Alumnos registrados</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-green-300">{stats.attended}</CardTitle>
                <CardDescription className="text-orange-200">Asistencias</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-orange-200">{stats.notAttended}</CardTitle>
                <CardDescription className="text-orange-200">Pendientes</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-400">Registrar Alumnos</CardTitle>
                <CardDescription className="text-orange-200">
                  Agrega alumnos y genera códigos QR para cada uno
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-orange-500 hover:bg-black active:bg-black focus:bg-black text-white transition-colors">
                  <Link to="/register" className="flex items-center justify-center">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Ir a Registro
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-orange-500 text-white py-6">
        <div className="container mx-auto px-4 text-center">
    
          <p className="text-sm">
            E-mail: <a href="mailto:andresflores160200@gmail.com" className="text-white hover:underline">andresflores160200@gmail.com</a>
          </p>
          <p className="text-sm mt-1">
            <a href="https://wa.me/543884636451" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">3884636451</a>
          </p>
          <div className="flex justify-center my-2">
            {/* SVG de huella de gato */}
            <span className="mx-1 opacity-80 transform -rotate-12">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="7" cy="7" rx="2" ry="3" fill="white"/>
                <ellipse cx="17" cy="7" rx="2" ry="3" fill="white"/>
                <ellipse cx="12" cy="17" rx="5" ry="4" fill="white"/>
                <ellipse cx="4" cy="14" rx="1.2" ry="2" fill="white"/>
                <ellipse cx="20" cy="14" rx="1.2" ry="2" fill="white"/>
              </svg>
            </span>
            <span className="mx-1 opacity-80">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="7" cy="7" rx="2" ry="3" fill="white"/>
                <ellipse cx="17" cy="7" rx="2" ry="3" fill="white"/>
                <ellipse cx="12" cy="17" rx="5" ry="4" fill="white"/>
                <ellipse cx="4" cy="14" rx="1.2" ry="2" fill="white"/>
                <ellipse cx="20" cy="14" rx="1.2" ry="2" fill="white"/>
              </svg>
            </span>
            <span className="mx-1 opacity-80 transform rotate-12">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="7" cy="7" rx="2" ry="3" fill="white"/>
                <ellipse cx="17" cy="7" rx="2" ry="3" fill="white"/>
                <ellipse cx="12" cy="17" rx="5" ry="4" fill="white"/>
                <ellipse cx="4" cy="14" rx="1.2" ry="2" fill="white"/>
                <ellipse cx="20" cy="14" rx="1.2" ry="2" fill="white"/>
              </svg>
            </span>
          </div>
          <p className="text-xs mt-2 text-orange-100">
            © {new Date().getFullYear()} Tigres QR - Sistema de Asistencia
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
