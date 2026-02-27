import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-lg py-4 border-b border-gray-100 text-corp-900 shadow-sm' 
          : 'bg-transparent py-8 text-white'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-24 flex justify-between items-center">
        
        {/* Logo Text Only - Ultra Minimal */}
        <a 
          href="#" 
          onClick={scrollToTop}
          className="relative group z-50 cursor-pointer"
        >
          <motion.div 
            className="flex flex-col"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h1 className={`font-serif text-2xl tracking-tight font-bold leading-none ${scrolled ? 'text-corp-900' : 'text-white'}`}>
              ROMERO
              <span className="text-accent-gold">.</span>
            </h1>
            <span className={`text-[9px] uppercase tracking-[0.25em] mt-1 font-sans font-medium ${scrolled ? 'text-corp-500' : 'text-corp-300'}`}>
              Contador Público
            </span>
          </motion.div>
        </a>

        {/* Right Side: Navigation & Seal Logo */}
        <div className="flex items-center gap-6 sm:gap-8">
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            <motion.a 
              href="#services" 
              onClick={(e) => scrollToSection(e, 'services')}
              whileHover={{ y: -2 }}
              className={`text-[11px] font-bold uppercase tracking-[0.15em] hover:text-accent-gold transition-colors cursor-pointer ${
                scrolled ? 'text-corp-500' : 'text-corp-300'
              }`}
            >
              Servicios
            </motion.a>
            <motion.a 
              href="#booking" 
              onClick={(e) => scrollToSection(e, 'booking')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] border transition-all duration-300 cursor-pointer ${
                scrolled 
                  ? 'border-corp-900 text-corp-900 hover:bg-corp-900 hover:text-white' 
                  : 'border-white/30 text-white hover:bg-white hover:text-corp-900 hover:border-white'
              }`}
            >
              Contacto
            </motion.a>
          </nav>

          {/* Corner Logo (Seal) */}
          <motion.img 
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            src="https://i.imgur.com/Y5GoLoF.png" 
            alt="Sello CPA" 
            className="h-12 w-auto object-contain drop-shadow-md"
          />
        </div>
      </div>
    </motion.header>
  );
};
