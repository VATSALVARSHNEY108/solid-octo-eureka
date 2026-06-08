import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative flex items-center justify-center min-h-[80vh] bg-[var(--bg-glass)] backdrop-blur-xl rounded-3xl m-8 shadow-glass">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 opacity-30"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
      />
      <div className="relative z-10 text-center p-8">
        <h1 className="text-5xl font-bold text-white mb-4">Regularization</h1>
        <p className="text-lg text-gray-300 mb-6">
          Tame over‑fitting and improve model generalisation with simple penalties.
        </p>
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white" onClick={() => {
          // Scroll to simulation section
          document.getElementById('simulation')?.scrollIntoView({ behavior: 'smooth' });
        }}>
          Start Simulation
        </Button>
      </div>
    </section>
  );
}
