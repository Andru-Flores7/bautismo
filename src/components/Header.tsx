
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QrCode, UserPlus, User } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  // Check if the current path matches the link path
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm py-4 px-4">
      <nav className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <Link to="/" className="font-bold text-2xl text-baptism-blue mb-4 sm:mb-0">
          Bautizo QR
        </Link>
        
        <div className="flex gap-2">
          <Button
            variant={isActive("/") ? "default" : "outline"}
            asChild
            className="flex items-center gap-1"
          >
            <Link to="/index">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Inicio</span>
            </Link>
          </Button>
          
          <Button
            variant={isActive("/register") ? "default" : "outline"}
            asChild
            className="flex items-center gap-1"
          >
            <Link to="/register">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Registrar</span>
            </Link>
          </Button>
          
          <Button
            variant={isActive("/scanner") ? "default" : "outline"}
            asChild
            className="flex items-center gap-1"
          >
            <Link to="/scanner">
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Escanear</span>
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
