'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

const stats = [
  { value: '500+', label: 'Members' },
  { value: '40+', label: 'Events' },
  { value: '25+', label: 'Workshops' },
  { value: '8+', label: 'Partners' },
];

const GOOGLE_COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-15"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/60 via-dark-bg/40 to-dark-bg" />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-30" />

      {/* Blue edge glow (from reference) */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-g-blue/30 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-g-green/20 to-transparent" />

      {/* Large background number */}
      <div className="bg-number">01</div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Google dots strip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          {GOOGLE_COLORS.map((color, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{ backgroundColor: color, width: 10, height: 10 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity, repeatDelay: 2 }}
            />
          ))}
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="section-number mb-6"
        >
          01 — Google Developer Groups On Campus
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none mb-6"
        >
          Build.{' '}
          <span className="google-gradient-text">Learn.</span>
          <br />
          <span className="text-white/90">Connect.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-white/50 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
        >
          The official developer community of{' '}
          <span className="text-white/80">Institute of Advanced Research</span>.
          Join hundreds of passionate students building real-world solutions with Google technologies.
        </motion.p>

        {/* CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/login?mode=register"
            className="btn-skew bg-g-blue border border-g-blue text-white text-xs font-mono uppercase tracking-widest px-8 py-3.5 hover:bg-g-blue/80 transition-all flex items-center gap-2"
          >
            <span className="flex items-center gap-2">
              Join the Community
              <ArrowRight size={14} />
            </span>
          </Link>
          <Link
            href="/events"
            className="btn-skew bg-transparent border border-white/15 text-white text-xs font-mono uppercase tracking-widest px-8 py-3.5 hover:border-white/40 transition-all flex items-center gap-2"
          >
            <span className="flex items-center gap-2">
              <Play size={12} />
              Explore Events
            </span>
          </Link>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex items-center justify-center gap-0 border border-white/6 divide-x divide-white/6 glass-card rounded-xl overflow-hidden max-w-lg mx-auto"
        >
          {stats.map(({ value, label }, i) => (
            <div key={i} className="flex-1 px-4 py-4 text-center">
              <div className="font-heading text-xl font-bold text-white">{value}</div>
              <div className="text-white/30 text-[10px] font-mono uppercase tracking-widest mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/20 text-[10px] font-mono uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent"
        />
      </motion.div>
    </section>
  );
}
