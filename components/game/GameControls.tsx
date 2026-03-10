"use client";

import { motion } from "framer-motion";
import { PieceType } from "@/types";

interface GameControlsProps {
  selectedPieceId: PieceType | null;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onFlip: () => void;
}

export default function GameControls({
  selectedPieceId,
  onRotateLeft,
  onRotateRight,
  onFlip,
}: GameControlsProps) {
  const hasSelection = selectedPieceId !== null;

  return (
    <motion.div
      className="flex items-center justify-center gap-3"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 backdrop-blur-sm flex items-center gap-3">
        <span className="text-white/40 text-xs hidden sm:block">
          Selected: <span className="text-white/70">{selectedPieceId?.replace(/-/g, " ") ?? "none"}</span>
        </span>

        <div className="flex gap-2">
          <ControlButton
            onClick={onRotateLeft}
            disabled={!hasSelection}
            label="↺"
            title="Rotate left (Q)"
          />
          <ControlButton
            onClick={onRotateRight}
            disabled={!hasSelection}
            label="↻"
            title="Rotate right (E or R)"
          />
          <ControlButton
            onClick={onFlip}
            disabled={!hasSelection}
            label="⇄"
            title="Flip piece (F)"
          />
        </div>

        <span className="text-white/30 text-xs hidden md:block">
          Q/E rotate · F flip · Drag to move
        </span>
      </div>
    </motion.div>
  );
}

function ControlButton({
  onClick,
  disabled,
  label,
  title,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  title: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold
        transition-all border
        ${disabled
          ? "bg-white/5 border-white/5 text-white/20 cursor-not-allowed"
          : "bg-violet-600/30 border-violet-500/40 text-violet-300 hover:bg-violet-500/50 cursor-pointer active:bg-violet-600/60"}
      `}
    >
      {label}
    </motion.button>
  );
}
