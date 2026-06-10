import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const Layout: React.FC<{ children: React.ReactNode; onNavigate: (page: 'landing' | 'detection') => void }> = ({ children, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('landing')}
          >
            <div className="bg-primary/20 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight">RoadGuard AI</span>
          </motion.div>
          <motion.nav 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            <button 
              onClick={() => onNavigate('landing')} 
              className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('detection')} 
              className="text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-md transition-colors"
            >
              Try Detection
            </button>
          </motion.nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="py-6 md:px-8 md:py-0 border-t border-border/40 bg-black/20">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
          <p className="text-sm leading-loose text-center text-foreground/60 md:text-left">
            Built for safer roads. RoadGuard AI Pothole Detection.
          </p>
          <div className="flex flex-col items-center md:items-end">
            <p className="text-sm font-medium text-foreground/80">Developed by Saumya Srivastava</p>
            <p className="text-xs text-primary/80 uppercase tracking-widest font-semibold">ML Engineer</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
