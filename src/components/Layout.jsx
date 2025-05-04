
import React from 'react';
import { motion } from 'framer-motion';
import { Toaster } from "@/components/ui/toaster";

function Layout({ children }) {
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-background to-muted">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {children}
      </motion.div>
      <Toaster />
    </div>
  );
}

export default Layout;
