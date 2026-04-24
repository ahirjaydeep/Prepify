import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);

      // Update active section based on scroll position
      if (isLandingPage) {
        const sections = ["home", "features", "process", "testimonials", "about", "contact"];
        const currentSection = sections.find(section => {
          const element = document.getElementById(section === "home" ? "" : section);
          if (!element) return false;
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        });
        if (currentSection) {
          setActiveSection(currentSection);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLandingPage]);

  // Handle theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const navItems = [
    { href: "#features", label: "Features", section: "features", icon: "✨" },
    { href: "#process", label: "How it Works", section: "process", icon: "🚀" },
    { href: "#testimonials", label: "Reviews", section: "testimonials", icon: "💬" },
    { href: "#about", label: "About", section: "about", icon: "ℹ️" },
    { href: "#contact", label: "Contact", section: "contact", icon: "📧" }
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500${
          isScrolled 
            ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50 dark:border-gray-800/50' 
            : 'bg-transparent backdrop-blur-sm'
        }`}
      >
        {/* Animated background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 transition-opacity duration-500 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Enhanced Logo */}
            <Link 
              to="/" 
              className="relative group flex items-center space-x-2 z-10"
              onClick={() => setActiveSection("home")}
            >
              {/* Logo Icon */}
              <div className="relative">
               
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100 -z-10" />
              </div>
              
              {/* Logo Text */}
              <div className="flex items-center">
  <img
    src="https://res.cloudinary.com/harshitnakrani/image/upload/v1758721731/ChatGPT_Image_Sep_24__2025__07_15_55_PM-removebg-preview_md6inv.png"
    alt="Prepify Logo"
    className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
  />
  
</div>

              
              {/* Animated underline */}
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-500 group-hover:w-full rounded-full" />
            </Link>

            {/* Desktop Navigation */}
            {isLandingPage && (
              <nav className="hidden lg:flex items-center space-x-1">
                {navItems.map((item, index) => (
                  <button
                    key={item.section}
                    onClick={() => scrollToSection(item.href)}
                    className={`relative px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 group ${
                      activeSection === item.section
                        ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-sm opacity-70 group-hover:opacity-100 transition-opacity">
                      {item.icon}
                    </span>
                    <span className="text-sm">{item.label}</span>
                    
                    {/* Active indicator */}
                    {activeSection === item.section && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur-sm -z-10" />
                    )}
                  </button>
                ))}
              </nav>
            )}

            {/* Right Side Controls */}
            <div className="flex items-center space-x-3">
              
              {/* CTA Button for non-landing pages */}
              {!isLandingPage && (
                <Link 
                  to="/"
                  className="hidden sm:flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                >
                  <span>🏠</span>
                  <span>Home</span>
                </Link>
              )}
              
              {/* Enhanced Theme Toggle */}
              <div className="relative">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative p-3 rounded-xl transition-all duration-500 transform hover:scale-110 ${
                    darkMode 
                      ? 'bg-gradient-to-br from-yellow-400/20 to-orange-400/20 text-yellow-400 hover:from-yellow-400/30 hover:to-orange-400/30' 
                      : 'bg-gradient-to-br from-blue-400/20 to-purple-400/20 text-blue-600 hover:from-blue-400/30 hover:to-purple-400/30'
                  } shadow-lg hover:shadow-xl border border-gray-200/20 dark:border-gray-700/20`}
                  aria-label="Toggle theme"
                >
                  <div className="relative z-10">
                    {darkMode ? (
                      <svg className="w-5 h-5 animate-spin-slow" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    )}
                  </div>
                  <div className={`absolute inset-0 rounded-xl transition-all duration-500 ${
                    darkMode 
                      ? 'bg-gradient-to-br from-yellow-400/20 to-orange-400/20 blur-lg' 
                      : 'bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-lg'
                  } opacity-0 hover:opacity-100 -z-10`} />
                </button>
              </div>

              {/* Mobile Menu Button */}
              {isLandingPage && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden relative p-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all duration-300 border border-gray-200/20 dark:border-gray-700/20"
                  aria-label="Toggle menu"
                >
                  <div className="w-5 h-5 flex flex-col justify-center items-center space-y-1">
                    <span className={`block w-full h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${
                      isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''
                    }`} />
                    <span className={`block w-full h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${
                      isMobileMenuOpen ? 'opacity-0' : ''
                    }`} />
                    <span className={`block w-full h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${
                      isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''
                    }`} />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isLandingPage && (
          <div className={`lg:hidden absolute top-full left-0 right-0 transition-all duration-500 overflow-hidden ${
            isMobileMenuOpen 
              ? 'max-h-screen opacity-100 transform translate-y-0' 
              : 'max-h-0 opacity-0 transform -translate-y-4'
          }`}>
            <div className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-2xl">
              <div className="px-4 py-6 space-y-2">
                {navItems.map((item, index) => (
                  <button
                    key={item.section}
                    onClick={() => scrollToSection(item.href)}
                    className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                      activeSection === item.section
                        ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transform scale-105'
                        : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transform hover:scale-102'
                    }`}
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      animation: isMobileMenuOpen ? `slideInUp 0.5s ease-out ${index * 0.1}s both` : 'none'
                    }}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-base">{item.label}</span>
                    <div className="flex-1" />
                    {activeSection === item.section && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </button>
                ))}
                
                {/* Mobile CTA */}
                <div className="pt-4 border-t border-gray-200/30 dark:border-gray-700/30">
                  <button
                    onClick={() => {
                      scrollToSection("#");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <span>🚀</span>
                    <span>Start Interview</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Add keyframes for mobile menu animations */}
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </>
  );
};

export default Header;