import React from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { Services } from './components/Services.tsx';
import { Booking } from './components/Booking.tsx';
import { Footer } from './components/Footer.tsx';
import { Chatbot } from './components/Chatbot.tsx';

const App: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen bg-white font-sans selection:bg-accent-gold selection:text-corp-900"
    >
      <Header />
      <main>
        <Hero />
        <Services />
        <Booking />
      </main>
      <Footer />
      <Chatbot />
    </motion.div>
  );
};

export default App;