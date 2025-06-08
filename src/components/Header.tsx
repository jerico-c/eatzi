// src/components/Header.jsx

import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Menangani klik di luar area menu untuk menutupnya
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Fungsi untuk menentukan class CSS pada link
  const linkClass = (path) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? "bg-foodie-100 text-foodie-700"
        : "text-gray-600 hover:bg-foodie-50 hover:text-foodie-600"
    }`;
  
  const mobileLinkClass = (path) => 
    `block px-4 py-3 transition-colors ${
        isActive(path) 
            ? "bg-foodie-50 text-foodie-700 font-medium" 
            : "text-gray-600 hover:bg-foodie-50 hover:text-foodie-500"
    }`;

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <Link to="/" className="flex items-center z-10">
          <img 
            src="/images/logo.png" 
            alt="Eatzi Logo" 
            className="h-10" 
          />
        </Link>
        
        {/* Navigasi Desktop */}
        <nav className="hidden md:flex items-center space-x-2">
          <Link to="/" className={linkClass("/")}>Home</Link>
          <Link to="/recipes" className={linkClass("/recipes")}>Recipes</Link>
          <Link to="/stories" className={linkClass("/stories")}>Cooking Stories</Link>
          <Link to="/about" className={linkClass("/about")}>About</Link>
          {/* 1. Link baru ditambahkan di sini untuk Desktop */}
         
        </nav>

        {/* Tombol Menu Mobile */}
        <div className="md:hidden">
          <button
            ref={buttonRef}
            onClick={toggleMenu}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-foodie-500"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Menu Mobile */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute top-16 left-0 right-0 bg-white shadow-md z-50 md:hidden animate-in fade-in slide-in-from-top-5 duration-200"
        >
          <ul className="py-2">
            <li><Link to="/" className={mobileLinkClass("/")} onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link to="/recipes" className={mobileLinkClass("/recipes")} onClick={() => setIsMenuOpen(false)}>Recipes</Link></li>
            <li><Link to="/stories" className={mobileLinkClass("/stories")} onClick={() => setIsMenuOpen(false)}>Cooking Stories</Link></li>
            <li><Link to="/about" className={mobileLinkClass("/about")} onClick={() => setIsMenuOpen(false)}>About</Link></li>
    
            
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;