"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Scale, BookOpen, Sparkles, ArrowRight, Shield, Gavel } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col">
      {/* ─── Liquid Background Blobs ──────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="liquid-blob absolute w-[600px] h-[600px] -top-32 -left-32"
          style={{ background: "radial-gradient(circle, #14532d 0%, #052e16 50%, transparent 70%)" }}
        />
        <div
          className="liquid-blob-2 absolute w-[500px] h-[500px] top-1/2 -right-48"
          style={{ background: "radial-gradient(circle, #854d0e 0%, #431407 50%, transparent 70%)" }}
        />
        <div
          className="liquid-blob absolute w-[400px] h-[400px] bottom-0 left-1/3"
          style={{
            background: "radial-gradient(circle, #1a3a2a 0%, #0a1f15 50%, transparent 70%)",
            animationDelay: "3s",
          }}
        />
        {/* Radial grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(245,200,66,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(245,200,66,0.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ─── Navbar ───────────────────────────────────────── */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-900/40">
            <Scale className="w-5 h-5 text-black" />
          </div>
          <span className="font-display text-xl text-white font-bold tracking-tight">
            Pak<span className="shimmer-text">Lex</span> AI
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <span className="text-sm text-emerald-400/70 font-mono">llama3.2 • local</span>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </motion.div>
      </nav>

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 text-yellow-400/80 text-sm font-mono mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Pakistan Legal Intelligence — RAG Powered
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="font-display text-6xl md:text-8xl font-black text-white leading-tight mb-6 max-w-4xl"
        >
          Your AI
          <br />
          <span className="shimmer-text">Legal Counsel</span>
          <br />
          for Pakistan
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-zinc-400 max-w-xl leading-relaxed mb-12"
        >
          Describe your legal scenario. PakLex AI retrieves relevant statutes, sections, and
          case precedents from Pakistan's full legal corpus — and delivers a professional legal opinion.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/query")}
          className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg rounded-xl shadow-2xl shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-shadow duration-300 animate-pulse-gold"
        >
          Start Legal Query
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {/* ─── Stats ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-3 gap-8 mt-20 max-w-lg"
        >
          {[
            { label: "Laws Indexed", value: "400+", icon: BookOpen },
            { label: "Sections", value: "12K+", icon: Gavel },
            { label: "100% Private", value: "Local AI", icon: Shield },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center">
              <Icon className="w-5 h-5 text-yellow-400/50 mx-auto mb-2" />
              <div className="font-display text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-zinc-500 mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ─── Floating decorative scales ───────────────────── */}
      <motion.div
        className="fixed bottom-8 right-8 opacity-10 text-yellow-400 animate-float"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 1 }}
      >
        <Scale className="w-24 h-24" />
      </motion.div>
    </main>
  );
}
