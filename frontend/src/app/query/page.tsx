"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Search, BookOpen, Loader2, ChevronLeft, Sparkles, FileText, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { queryLaws } from "@/lib/api";
import type { QueryResponse, LawSource } from "@/types";

export default function QueryPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuery = async () => {
    if (!question.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const data = await queryLaws(question);
      setResponse(data);
    } catch (e: any) {
      setError(e.message || "Query failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleQuery();
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ─── Background ───────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="liquid-blob absolute w-[500px] h-[500px] -top-20 -right-20"
          style={{ background: "radial-gradient(circle, #14532d 0%, #052e16 60%, transparent 70%)" }}
        />
        <div
          className="liquid-blob-2 absolute w-[400px] h-[400px] bottom-0 -left-20"
          style={{ background: "radial-gradient(circle, #1c1917 0%, #0c0a09 50%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(245,200,66,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(245,200,66,0.2) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ─── Layout ───────────────────────────────────────── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Navbar */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-zinc-400 hover:text-yellow-400 transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Home
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
              <Scale className="w-4 h-4 text-black" />
            </div>
            <span className="font-display text-lg font-bold text-white">
              Pak<span className="shimmer-text">Lex</span> AI
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400/60">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            llama3.2:1b
          </div>
        </div>

        {/* Query Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            Describe your <span className="shimmer-text">legal scenario</span>
          </h1>
          <p className="text-zinc-500 text-sm mb-6">
            Be specific. Include details like parties involved, location, nature of dispute, timeline.
          </p>

          <div className="glass-card gold-glow rounded-2xl p-1">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. A landlord in Lahore forcibly evicted a tenant without a court order after the tenant missed 2 months of rent. The tenant's belongings were thrown out. What are the applicable laws and legal remedies available?"
              className="w-full bg-transparent text-zinc-200 placeholder:text-zinc-600 text-sm leading-relaxed px-5 py-4 resize-none outline-none min-h-[140px] font-body"
              rows={6}
            />
            <div className="flex items-center justify-between px-5 py-3 border-t border-yellow-400/10">
              <span className="text-xs text-zinc-600 font-mono">Ctrl+Enter to submit</span>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleQuery}
                disabled={loading || !question.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-sm rounded-xl disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-yellow-900/30 hover:shadow-yellow-900/50 transition-shadow"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {loading ? "Analyzing..." : "Find Laws"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm mb-6"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-yellow-400/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border-2 border-yellow-400/40 animate-ping animation-delay-150" />
                <div className="absolute inset-4 rounded-full bg-yellow-400/20 flex items-center justify-center">
                  <Scale className="w-4 h-4 text-yellow-400 animate-pulse" />
                </div>
              </div>
              <p className="text-zinc-400 font-display text-lg">Searching Pakistan law corpus...</p>
              <p className="text-zinc-600 text-sm mt-2 font-mono">RAG retrieval + llama3.2:1b inference</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Response */}
        <AnimatePresence>
          {response && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Sources */}
              {response.sources.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-mono text-yellow-400/70">
                      {response.total_sources} relevant law{response.total_sources !== 1 ? "s" : ""} retrieved
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {response.sources.map((src: LawSource, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08 }}
                        className="source-tag"
                      >
                        <FileText className="w-3 h-3" />
                        {src.law_number} § {src.section} • {src.year}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Answer */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-yellow-400/10">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="font-display font-bold text-yellow-400">Legal Analysis & Opinion</span>
                </div>
                <div
                  className="legal-content text-zinc-300 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: formatResponse(response.answer),
                  }}
                />
              </div>

              {/* Source Details */}
              {response.sources.length > 0 && (
                <div>
                  <h3 className="text-sm font-mono text-zinc-500 mb-3 uppercase tracking-wider">Source Documents</h3>
                  <div className="space-y-3">
                    {response.sources.map((src: LawSource, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + 0.3 }}
                        className="glass-card rounded-xl p-4 border border-yellow-400/5"
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <span className="text-yellow-400 font-bold text-sm">{src.law_name}</span>
                            <span className="text-zinc-600 text-xs ml-2 font-mono">
                              {src.law_number} | Section {src.section} | {src.year}
                            </span>
                          </div>
                        </div>
                        <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3">{src.excerpt}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-400/5 border border-yellow-400/10 text-xs text-zinc-500">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-400/50 mt-0.5 shrink-0" />
                <p>
                  This is AI-generated legal information for reference only. It does not constitute legal advice.
                  Consult a qualified lawyer admitted to the Bar Council of Pakistan for professional guidance.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function formatResponse(text: string): string {
  return text
    .replace(/## (.+)/g, "<h2>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>");
}
