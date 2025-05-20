import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QrCode, UserPlus, User } from 'lucide-react';
import tigreImg from '../../public/tigre 2.svg';

const Header: React.FC = () => {
  const location = useLocation();
  
  // Check if the current path matches the link path
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-orange-500 text-white tiger-header py-4 px-4">
      <nav className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <Link to="/" className="font-bold text-2xl text-white mb-4 sm:mb-0 flex items-center">
          <img src={tigreImg} alt="Tigre" className="h-16 w-16 mr-2 bg-color-transparent" />
          <span>Tigres QR</span>
        </Link>
        
        <div className="flex gap-2">
          <Button
            variant={isActive("/") ? "default" : "outline"}
            asChild
            className={`flex items-center gap-1 ${isActive("/") ? "bg-black text-white" : "bg-white text-black"} hover:bg-orange-400 hover:text-white transition-colors`}
          >
            <Link to="/index">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Inicio</span>
            </Link>
          </Button>
          
          <Button
            variant={isActive("/register") ? "default" : "outline"}
            asChild
            className={`flex items-center gap-1 ${isActive("/register") ? "bg-black text-white" : "bg-white text-black"}`}
          >
            <Link to="/register">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Registrar</span>
            </Link>
          </Button>
          
          <Button
            variant={isActive("/scanner") ? "default" : "outline"}
            asChild
            className={`flex items-center gap-1 ${isActive("/scanner") ? "bg-black text-white" : "bg-white text-black"}`}
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
