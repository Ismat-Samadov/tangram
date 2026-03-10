"use client";

import { motion } from "framer-motion";
import { GameState } from "@/types";
import { formatTime } from "@/lib/gameLogic";

interface HUDProps {
  state: GameState;
  onPause: () => void;
  onToggleSound: () => void;
  onHint: () => void;
}

export default function HUD({ state, onPause, onToggleSound, onHint }: HUDProps) {
  const currentPuzzle = state.puzzles[state.currentPuzzleIndex];
  const placedCount = state.pieces.filter((p) => p.isPlaced).length;
  const totalPieces = state.pieces.length;

  const timeRemaining =
    state.timeLimit !== null ? state.timeLimit - state.timeElapsed : null;
  const isUrgent = timeRemaining !== null && timeRemaining <= 30;

  return (
    <div className="flex items-center justify-between w-full px-3 py-2 gap-2">
      {/* Left: Score + Puzzle Info */}
      <div className="flex items-center gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 backdrop-blur-sm">
          <div className="text-white/50 text-xs uppercase tracking-wide">Score</div>
          <motion.div
            key={state.score}
            className="text-white font-bold text-lg leading-none"
            initial={{ scale: 1.3, color: "#a78bfa" }}
            animate={{ scale: 1, color: "#ffffff" }}
            transition={{ duration: 0.3 }}
          >
            {state.score.toLocaleString()}
          </motion.div>
        </div>

        <div className="hidden sm:block bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 backdrop-blur-sm">
          <div className="text-white/50 text-xs uppercase tracking-wide">Puzzle</div>
          <div className="text-white font-semibold text-sm leading-none">
            {currentPuzzle?.name ?? "—"}
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1">
          {Array.from({ length: totalPieces }).map((_, i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i < placedCount ? "bg-emerald-400" : "bg-white/20"
              }`}
              animate={i < placedCount ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Center: Timer */}
      <div className="flex flex-col items-center">
        {timeRemaining !== null ? (
          <motion.div
            className={`font-mono text-2xl font-bold transition-colors ${
              isUrgent ? "text-red-400" : "text-white"
            }`}
            animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: isUrgent ? Infinity : 0, duration: 1 }}
          >
            {formatTime(timeRemaining)}
          </motion.div>
        ) : (
          <div className="font-mono text-xl text-white/60">
            {formatTime(state.timeElapsed)}
          </div>
        )}
        <div className="text-white/30 text-xs capitalize">{state.difficulty}</div>
      </div>

      {/* Right: Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onHint}
          title="Use hint"
          className="bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/30 text-amber-300 rounded-xl px-3 py-1.5 text-sm font-medium transition-all active:scale-95 flex items-center gap-1"
        >
          <span className="text-base">💡</span>
          <span className="hidden sm:inline">{state.hintsUsed > 0 ? `×${state.hintsUsed}` : "Hint"}</span>
        </button>

        <button
          onClick={onToggleSound}
          title={state.soundEnabled ? "Mute sound" : "Enable sound"}
          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 rounded-xl px-3 py-1.5 text-lg transition-all active:scale-95"
        >
          {state.soundEnabled ? "🔊" : "🔇"}
        </button>

        <button
          onClick={onPause}
          title="Pause"
          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 rounded-xl px-3 py-1.5 text-sm font-medium transition-all active:scale-95"
        >
          ⏸
        </button>
      </div>
    </div>
  );
}
