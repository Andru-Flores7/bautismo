import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserPlus, User } from 'lucide-react';
import tigreImg from '../../public/tigreheader.svg';

const Header: React.FC = () => {
  const location = useLocation();
  
  // Check if the current path matches the link path
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-orange-500 text-white tiger-header py-2 px-2">
      <nav className="container mx-auto flex flex-col sm:flex-row items-center justify-between min-h-0">
        <Link to="/" className="font-bold text-2xl text-white mb-2 sm:mb-0 flex items-center min-h-0">
          <img src={tigreImg} alt="Tigre" className="h-28 w-28 mr-3 bg-color-transparent flex-shrink-0" style={{minWidth: '7rem', minHeight: '7rem', height: '7rem', width: '7rem'}} />
          <div className="flex flex-col justify-center">
            <span className="leading-tight">Tigres QR</span>
            <span className="text-orange-400 font-extrabold uppercase text-lg tracking-widest leading-tight" style={{letterSpacing: '0.15em', textShadow: '1px 1px 3px rgba(0,0,0,0.15)'}}>LA GLORIOSA</span>
          </div>
        </Link>
        <div className="flex gap-2 mt-2 sm:mt-0">
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
              <span className="hidden sm:inline ml-1">Registro</span>
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
