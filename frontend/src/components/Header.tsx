import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail } from "lucide-react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Cars", href: "/cars" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-600 text-white py-2">
        <div className="container">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+250 788445011</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>safetravelmotors@gmail.com</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="https://www.facebook.com/ST_Motors_Rwanda"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-200 transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/stmotorsrwanda"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-200 transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-lg" : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Safe Travel Motors Logo"
                className="h-10 w-auto object-contain"
              />
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                Safe Travel Motors
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-link ${
                    isActive(item.href) ? "nav-link-active" : ""
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link to="/cars" className="btn-primary">
                View Cars
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="container py-4">
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-link ${
                      isActive(item.href) ? "nav-link-active" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  <Link
                    to="/cars"
                    className="btn-primary w-full justify-center"
                  >
                    View Cars
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
