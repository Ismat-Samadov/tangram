"use client";

import { motion } from "framer-motion";
import { GameState, Difficulty } from "@/types";
import Button from "@/components/ui/Button";
import { formatTime } from "@/lib/gameLogic";

interface EndScreenProps {
  state: GameState;
  onRestart: () => void;
  onNextPuzzle: () => void;
  onMenu: () => void;
}

const CONFETTI_COLORS = [
  "#ff6b9d", "#c44dff", "#4daaff", "#4dffb4", "#ffdd4d", "#ff884d", "#4dfff4",
];

export default function EndScreen({
  state,
  onRestart,
  onNextPuzzle,
  onMenu,
}: EndScreenProps) {
  const isWon = state.phase === "won";
  const currentPuzzle = state.puzzles[state.currentPuzzleIndex];
  const hasNextPuzzle = state.currentPuzzleIndex < state.puzzles.length - 1;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      {/* Confetti for win */}
      {isWon && <Confetti />}

      <motion.div
        className="relative w-full max-w-sm bg-gray-900/95 border border-white/10 rounded-3xl p-8 text-center overflow-hidden"
        initial={{ scale: 0.5, opacity: 0, y: 60 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 16, stiffness: 200 }}
      >
        {/* Gradient glow */}
        <div
          className={`absolute inset-0 rounded-3xl opacity-20 ${
            isWon
              ? "bg-gradient-to-br from-violet-500 via-pink-500 to-cyan-500"
              : "bg-gradient-to-br from-red-900 to-gray-900"
          }`}
        />

        <div className="relative z-10">
          {/* Emoji */}
          <motion.div
            className="text-6xl mb-4"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", damping: 10 }}
          >
            {isWon ? "🎉" : "⏰"}
          </motion.div>

          {/* Title */}
          <motion.h2
            className={`text-3xl font-black mb-2 ${
              isWon
                ? "bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
                : "text-red-400"
            }`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isWon ? "Puzzle Solved!" : "Time's Up!"}
          </motion.h2>

          <motion.p
            className="text-white/60 text-sm mb-6"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isWon
              ? `You completed "${currentPuzzle?.name}" on ${state.difficulty}!`
              : `Better luck next time!`}
          </motion.p>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-3 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <StatCard label="Score" value={state.score.toLocaleString()} accent="violet" />
            <StatCard label="Time" value={formatTime(state.timeElapsed)} accent="cyan" />
            <StatCard label="Hints" value={String(state.hintsUsed)} accent="amber" />
          </motion.div>

          {/* High score badge */}
          {isWon && state.score >= state.highScore && (
            <motion.div
              className="mb-4 inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-1.5 text-amber-300 text-sm font-semibold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
            >
              ⭐ New High Score!
            </motion.div>
          )}

          {/* Buttons */}
          <motion.div
            className="flex flex-col gap-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {isWon && hasNextPuzzle && (
              <Button variant="primary" size="lg" onClick={onNextPuzzle} className="w-full">
                Next Puzzle →
              </Button>
            )}
            <Button variant="secondary" size="md" onClick={onRestart} className="w-full">
              Try Again
            </Button>
            <Button variant="ghost" size="md" onClick={onMenu} className="w-full">
              Main Menu
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "violet" | "cyan" | "amber";
}) {
  const colors = {
    violet: "text-violet-400 border-violet-500/30",
    cyan: "text-cyan-400 border-cyan-500/30",
    amber: "text-amber-400 border-amber-500/30",
  };
  return (
    <div className={`bg-white/5 border rounded-xl p-3 ${colors[accent]}`}>
      <div className="text-xs text-white/40 mb-1">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            left: `${Math.random() * 100}%`,
            top: "-10px",
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: [0, Math.random() * 720 - 360],
            opacity: [1, 0.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 1.5,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}
