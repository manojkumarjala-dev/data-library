'use client';

import { motion } from 'framer-motion';
import ChatWidget from './components/ChatWidget';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="font-sans min-h-screen p-8 pb-20"
    >
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={item} className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to the Heartland Community Network Data Library
          </h1>
          <p className="text-lg max-w-3xl mx-auto">
            HCN supports small businesses and rural communities by delivering
            accessible, tech-focused consulting services in digital presence,
            marketing, and business strategy—driven by a dedicated team of
            professionals working to foster local innovation and sustainable
            growth through technology
          </p>
        </motion.div>

        <motion.div
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-12 mx-[20%] md:mx-[10%] lg:mx-[20%]"
        >
          <motion.a
            variants={item}
            href="/sector-1"
            className="p-6 rounded-lg bg-slate-100 shadow-lg transition-shadow"
            whileHover={{ scale: 1.05, z: 10 }}
          >
            <h2 className="text-2xl font-bold mb-2">Sector 1</h2>
            <p>Explore the data for Sector 1.</p>
          </motion.a>
          <motion.a
            variants={item}
            href="/sector-2"
            className="p-6 rounded-lg bg-slate-100 shadow-lg transition-shadow"
            whileHover={{ scale: 1.05, z: 10 }}
          >
            <h2 className="text-2xl font-bold mb-2">Sector 2</h2>
            <p>Explore the data for Sector 2.</p>
          </motion.a>
          <motion.a
            variants={item}
            href="/sector-3"
            className="p-6 rounded-lg bg-slate-100 shadow-lg transition-shadow"
            whileHover={{ scale: 1.05, z: 10 }}
          >
            <h2 className="text-2xl font-bold mb-2">Sector 3</h2>
            <p>Explore the data for Sector 3.</p>
          </motion.a>
          <motion.a
            variants={item}
            href="/sector-4"
            className="p-6 rounded-lg bg-slate-100 shadow-lg transition-shadow"
            whileHover={{ scale: 1.05, z: 10 }}
          >
            <h2 className="text-2xl font-bold mb-2">Sector 4</h2>
            <p>Explore the data for Sector 4.</p>
          </motion.a>
        </motion.div>
      </main>

      <motion.footer variants={item} className="text-center mt-16">
        <p>&copy; 2025 Heartland Community Network</p>
      </motion.footer>

      {/* Chat widget floats at bottom-right; opens with a greeting */}
      <ChatWidget
        defaultOpen
        greeting="Hi! I’m here to help. What would you like to know?"
      />
    </motion.div>
  );
}
