"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const stories = [
  {
    tag: "The Problem",
    tagColor: "bg-red-50 text-red-500 border-red-100",
    title: "Too much to study.\nToo little clarity.",
    body: "You open your laptop. Fifteen tabs. Three textbooks. A deadline tomorrow. And you have no idea where to start. Sound familiar?",
    img: "/student_stressed.png",
    imgAlt: "Overwhelmed student at a cluttered desk late at night",
    reverse: false,
    accent: "from-red-50 to-orange-50",
  },
  {
    tag: "The Shift",
    tagColor: "bg-blue-50 text-blue-600 border-blue-100",
    title: "Break down topics.\nFocus better.",
    body: "What if instead of staring at a wall of text, you had a calm voice walking you through it? Breaking it down. Making it click. One step at a time.",
    img: "/student_focused.png",
    imgAlt: "Focused student at a clean desk with warm morning light",
    reverse: true,
    accent: "from-blue-50 to-indigo-50",
  },
  {
    tag: "The Outcome",
    tagColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    title: "Feel in control\nof your studies.",
    body: "You close your laptop, notes organized, schedule clear, and actually feel ready. That's the feeling StudyPilot is built to give you — every single day.",
    img: "/student_confident.png",
    imgAlt: "Confident smiling student with organized notes",
    reverse: false,
    accent: "from-emerald-50 to-teal-50",
  },
];

const benefits = [
  "Get instant, clear answers to confusing topics",
  "Turn messy notes into clean summaries in seconds",
  "Build study schedules that actually match how you feel",
  "No overwhelm. Just progress.",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <header className="border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">✈</div>
            <span className="font-bold text-slate-900 tracking-tight">StudyPilot</span>
          </div>
          <Link
            href="/login"
            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Soft radial glow behind hero */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(37,99,235,0.08),transparent)] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 pt-28 pb-24 text-center relative">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <div className="inline-flex items-center gap-2 border border-slate-200 bg-white text-slate-600 text-xs font-medium px-3.5 py-1.5 rounded-full mb-7 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Trusted by students who stopped cramming
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6"
          >
            Study Faster.<br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Stress Less.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            You don't need to study harder. You need to study smarter —
            with a companion that understands what you're going through
            and helps you find your way through it.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Get Started — It&apos;s Free
              <ArrowRight size={16} />
            </Link>
            <a
              href="#story"
              className="inline-flex items-center gap-2 text-slate-600 px-6 py-3.5 rounded-xl font-medium text-sm border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              See how it works ↓
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-14 flex flex-col items-center gap-3"
          >
            <div className="flex -space-x-2">
              {["🧑‍💻", "👩‍🎓", "🧑‍🎓", "👩‍💻", "🧑‍🏫"].map((emoji, i) => (
                <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-white flex items-center justify-center text-base shadow-sm">
                  {emoji}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700">500+ students</span> already studying smarter
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Story Sections ──────────────────────────────────────────────── */}
      <section id="story" className="py-6">
        {stories.map((s, i) => (
          <motion.div
            key={s.tag}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={0}
            className={`bg-gradient-to-br ${s.accent} py-20 border-y border-slate-100`}
          >
            <div className={`max-w-6xl mx-auto px-6 flex flex-col ${s.reverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-14`}>
              {/* Image */}
              <div className="w-full lg:w-1/2 shrink-0">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                  <Image
                    src={s.img}
                    alt={s.imgAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="flex-1 text-center lg:text-left">
                <span className={`inline-block text-xs font-bold uppercase tracking-widest border px-3 py-1 rounded-full mb-5 ${s.tagColor}`}>
                  {s.tag}
                </span>
                <h2 className="text-4xl font-extrabold text-slate-900 leading-tight mb-5 whitespace-pre-line">
                  {s.title}
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  {s.body}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ── Benefits strip ─────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Made for real students, not perfect ones.
            </h2>
            <p className="text-slate-500 mb-10">
              Whether you&apos;re tired, confused, or behind schedule — StudyPilot meets you where you are.
            </p>
            <ul className="space-y-3 text-left max-w-md mx-auto">
              {benefits.map((b, i) => (
                <motion.li
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="flex items-start gap-3 text-slate-700 text-sm"
                >
                  <CheckCircle2 size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  {b}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-600 py-24 text-center text-white">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-2xl mx-auto px-6"
        >
          <p className="text-blue-200 text-sm font-medium mb-3 uppercase tracking-widest">You&apos;ve got this.</p>
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">
            Start your clearest study session yet.
          </h2>
          <p className="text-blue-100 text-lg mb-10 leading-relaxed">
            No setup. No overwhelm. Just open StudyPilot and begin.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Get Started Free
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-xs">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">✈</div>
          <span className="text-slate-300 font-semibold">StudyPilot</span>
        </div>
        © 2025 StudyPilot. Built for students who refuse to give up.
      </footer>

    </div>
  );
}
