
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        isMenuOpen && 
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 z-10">
          <span className="text-2xl font-bold text-foodie-500">FoodieMatch</span>
        </Link>
        
        {/* Desktop navigation with NavigationMenu */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/"
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:bg-accent/50 disabled:pointer-events-none disabled:opacity-50",
                      isActive("/") 
                        ? "bg-accent/50 text-foodie-700 font-medium" 
                        : "text-gray-600 hover:bg-foodie-100 hover:text-foodie-500"
                    )}
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/recipes"
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:bg-accent/50 disabled:pointer-events-none disabled:opacity-50",
                      isActive("/recipes") 
                        ? "bg-accent/50 text-foodie-700 font-medium" 
                        : "text-gray-600 hover:bg-foodie-100 hover:text-foodie-500"
                    )}
                  >
                    Recipes
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/about"
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:bg-accent/50 disabled:pointer-events-none disabled:opacity-50",
                      isActive("/about") 
                        ? "bg-accent/50 text-foodie-700 font-medium" 
                        : "text-gray-600 hover:bg-foodie-100 hover:text-foodie-500"
                    )}
                  >
                    About
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            ref={buttonRef}
            onClick={toggleMenu}
            className="text-foodie-600 hover:text-foodie-700 p-2 rounded-md hover:bg-foodie-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X size={24} strokeWidth={2} />
            ) : (
              <Menu size={24} strokeWidth={2} />
            )}
          </button>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <div 
            ref={menuRef}
            className="absolute top-16 left-0 right-0 bg-white shadow-md z-50 md:hidden animate-in fade-in slide-in-from-top-5 duration-200"
          >
            <ul className="py-2">
              <li>
                <Link 
                  to="/" 
                  className={`block px-4 py-3 transition-colors ${isActive("/") ? "bg-foodie-50 text-foodie-700 font-medium" : "text-gray-600 hover:bg-foodie-50 hover:text-foodie-500"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/recipes" 
                  className={`block px-4 py-3 transition-colors ${isActive("/recipes") ? "bg-foodie-50 text-foodie-700 font-medium" : "text-gray-600 hover:bg-foodie-50 hover:text-foodie-500"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Recipes
                </Link>
              </li>
              <li>
                <Link 
                  to="/about"
                  className={`block px-4 py-3 transition-colors ${isActive("/about") ? "bg-foodie-50 text-foodie-700 font-medium" : "text-gray-600 hover:bg-foodie-50 hover:text-foodie-500"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
