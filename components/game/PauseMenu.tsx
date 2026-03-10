"use client";

import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

interface PauseMenuProps {
  isOpen: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export default function PauseMenu({
  isOpen,
  soundEnabled,
  musicEnabled,
  onResume,
  onRestart,
  onMenu,
  onToggleSound,
  onToggleMusic,
}: PauseMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900/95 border border-white/10 rounded-3xl p-8 w-full max-w-xs text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="text-4xl mb-3">⏸</div>
            <h2 className="text-2xl font-bold text-white mb-6">Paused</h2>

            {/* Toggle settings */}
            <div className="space-y-3 mb-6">
              <ToggleRow
                label="Sound Effects"
                enabled={soundEnabled}
                onToggle={onToggleSound}
                icon={soundEnabled ? "🔊" : "🔇"}
              />
              <ToggleRow
                label="Music"
                enabled={musicEnabled}
                onToggle={onToggleMusic}
                icon={musicEnabled ? "🎵" : "🎵"}
              />
            </div>

            <div className="space-y-3">
              <Button variant="primary" size="lg" onClick={onResume} className="w-full">
                ▶ Resume
              </Button>
              <Button variant="secondary" size="md" onClick={onRestart} className="w-full">
                Restart Puzzle
              </Button>
              <Button variant="ghost" size="md" onClick={onMenu} className="w-full">
                Main Menu
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ToggleRow({
  label,
  enabled,
  onToggle,
  icon,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
  icon: string;
}) {
  return (
    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
      <span className="flex items-center gap-2 text-white/80 text-sm">
        <span>{icon}</span>
        {label}
      </span>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className={`w-12 h-6 rounded-full relative transition-colors ${
          enabled ? "bg-violet-600" : "bg-white/20"
        }`}
      >
        <motion.div
          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow"
          animate={{ x: enabled ? 24 : 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 400 }}
        />
      </motion.button>
    </div>
  );
}
