'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative h-[40vh] min-h-[200px] mb-12 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/hero-groceries.jpg"
          alt="Fresh groceries"
          fill
          priority
          className="object-cover"
        />
      </motion.div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-20 text-center px-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
          Welcome to Freshbasket
        </h1>
        <p className="text-lg md:text-2xl text-white drop-shadow-md">
          Shop fresh produce from your nearest store
        </p>
      </motion.div>
    </section>
  );
}
