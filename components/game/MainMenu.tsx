"use client";

import { motion } from "framer-motion";
import { Difficulty } from "@/types";
import Button from "@/components/ui/Button";
import { PUZZLES_BY_DIFFICULTY } from "@/lib/shapes";

interface MainMenuProps {
  highScore: number;
  onStart: (difficulty: Difficulty) => void;
}

const difficulties: { key: Difficulty; label: string; emoji: string; desc: string; color: string }[] = [
  {
    key: "easy",
    label: "Easy",
    emoji: "🌿",
    desc: `${PUZZLES_BY_DIFFICULTY.easy.length} puzzles · No time limit`,
    color: "from-emerald-600/30 to-emerald-900/30 border-emerald-500/30 hover:border-emerald-400/60",
  },
  {
    key: "medium",
    label: "Medium",
    emoji: "⚡",
    desc: `${PUZZLES_BY_DIFFICULTY.medium.length} puzzles · 5 min limit`,
    color: "from-amber-600/30 to-amber-900/30 border-amber-500/30 hover:border-amber-400/60",
  },
  {
    key: "hard",
    label: "Hard",
    emoji: "🔥",
    desc: `${PUZZLES_BY_DIFFICULTY.hard.length} puzzles · 3 min limit`,
    color: "from-red-600/30 to-red-900/30 border-red-500/30 hover:border-red-400/60",
  },
];

export default function MainMenu({ highScore, onStart }: MainMenuProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
      {/* Animated background shapes */}
      <BackgroundShapes />

      <motion.div
        className="relative z-10 flex flex-col items-center max-w-md w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo / Title */}
        <motion.div
          className="mb-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 12 }}
        >
          <TangramLogo />
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-2 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            TANGRAM
          </span>
        </motion.h1>

        <motion.p
          className="text-white/50 text-base mb-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Ancient puzzle. Modern style.
        </motion.p>

        {/* High score */}
        {highScore > 0 && (
          <motion.div
            className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-full px-5 py-1.5 text-amber-300 text-sm font-semibold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            ⭐ Best Score: {highScore.toLocaleString()}
          </motion.div>
        )}

        {/* Difficulty selection */}
        <motion.div
          className="w-full space-y-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white/40 text-xs uppercase tracking-widest text-center mb-4">
            Choose Difficulty
          </p>
          {difficulties.map((d, i) => (
            <motion.button
              key={d.key}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onStart(d.key)}
              className={`
                w-full flex items-center gap-4 p-4 rounded-2xl
                bg-gradient-to-r ${d.color}
                border backdrop-blur-sm
                text-left transition-all duration-200 cursor-pointer
              `}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <span className="text-3xl">{d.emoji}</span>
              <div>
                <div className="text-white font-bold text-lg">{d.label}</div>
                <div className="text-white/50 text-sm">{d.desc}</div>
              </div>
              <span className="ml-auto text-white/30 text-xl">›</span>
            </motion.button>
          ))}
        </motion.div>

        {/* How to play */}
        <motion.div
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p className="font-semibold text-white/70 mb-2">How to play</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>🖱 Drag pieces to move</div>
            <div>Q / E — Rotate left/right</div>
            <div>F — Flip piece</div>
            <div>💡 Hint button — auto-place</div>
            <div>📱 Touch drag on mobile</div>
            <div>⏸ Pause anytime</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function TangramLogo() {
  // Simple SVG tangram square made of colored triangles
  return (
    <svg width="80" height="80" viewBox="0 0 8 8" className="drop-shadow-2xl">
      <polygon points="0,0 4,0 0,4" fill="#ff6b9d" opacity="0.9" />
      <polygon points="4,0 8,0 8,4 4,4" fill="#c44dff" opacity="0.9" />
      <polygon points="0,4 4,4 2,6" fill="#4daaff" opacity="0.9" />
      <polygon points="2,6 4,4 4,8 2,8" fill="#4dffb4" opacity="0.9" />
      <polygon points="4,4 6,6 4,8" fill="#ffdd4d" opacity="0.9" />
      <polygon points="6,6 8,4 8,8 6,8" fill="#ff884d" opacity="0.9" />
      <polygon points="0,4 2,6 2,8 0,8" fill="#4dfff4" opacity="0.9" />
    </svg>
  );
}

function BackgroundShapes() {
  const shapes = [
    { size: 200, x: "10%", y: "20%", color: "violet", delay: 0 },
    { size: 150, x: "80%", y: "60%", color: "pink", delay: 1 },
    { size: 100, x: "50%", y: "85%", color: "cyan", delay: 2 },
    { size: 80, x: "20%", y: "70%", color: "amber", delay: 0.5 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl opacity-10`}
          style={{
            width: s.size,
            height: s.size,
            left: s.x,
            top: s.y,
            background:
              s.color === "violet"
                ? "#8b5cf6"
                : s.color === "pink"
                ? "#ec4899"
                : s.color === "cyan"
                ? "#06b6d4"
                : "#f59e0b",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{
            duration: 4 + i,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
