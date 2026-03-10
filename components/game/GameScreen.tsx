"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieceType, Difficulty } from "@/types";
import { useGameState } from "@/hooks/useGameState";
import { useSound } from "@/hooks/useSound";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import GameCanvas from "./GameCanvas";
import HUD from "./HUD";
import GameControls from "./GameControls";
import PauseMenu from "./PauseMenu";
import EndScreen from "./EndScreen";
import MainMenu from "./MainMenu";

export default function GameScreen() {
  const {
    state,
    startGame,
    initPieces,
    movePiece,
    rotatePiece,
    flipPiece,
    setDragging,
    raisePiece,
    checkPlacement,
    setPhase,
    toggleSound,
    toggleMusic,
    useHint,
    nextPuzzle,
    setHighScore,
  } = useGameState();

  const { play } = useSound(state.soundEnabled);
  const [storedHighScore, setStoredHighScore] = useLocalStorage<number>(
    "tangram-highscore",
    0
  );

  const [selectedPieceId, setSelectedPieceId] = useState<PieceType | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Sync high score from localStorage on mount
  useEffect(() => {
    setHighScore(storedHighScore);
  }, [storedHighScore, setHighScore]);

  // Persist high score when it changes
  useEffect(() => {
    if (state.highScore > storedHighScore) {
      setStoredHighScore(state.highScore);
    }
  }, [state.highScore, storedHighScore, setStoredHighScore]);

  // Track canvas container size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const obs = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      setCanvasSize({ width: Math.floor(width), height: Math.floor(height) });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Initialize pieces whenever canvas resizes or puzzle changes
  const trayY = canvasSize.height * 0.7;
  const centerX = canvasSize.width / 2;
  const centerY = (canvasSize.height * 0.7) / 2;

  const prevPuzzleIdxRef = useRef<number>(-1);
  const prevCanvasRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    if (state.phase !== "playing") return;
    const sizeChanged =
      prevCanvasRef.current.w !== canvasSize.width ||
      prevCanvasRef.current.h !== canvasSize.height;
    const puzzleChanged = prevPuzzleIdxRef.current !== state.currentPuzzleIndex;

    if (
      (sizeChanged || puzzleChanged || state.pieces.length === 0) &&
      canvasSize.width > 0
    ) {
      initPieces(0, trayY + 8, canvasSize.width);
      prevCanvasRef.current = { w: canvasSize.width, h: canvasSize.height };
      prevPuzzleIdxRef.current = state.currentPuzzleIndex;
      setSelectedPieceId(null);
    }
  }, [
    state.phase,
    state.currentPuzzleIndex,
    state.pieces.length,
    canvasSize,
    trayY,
    initPieces,
  ]);

  // Keyboard controls
  useEffect(() => {
    if (state.phase !== "playing") return;

    const handleKey = (e: globalThis.KeyboardEvent) => {
      if (!selectedPieceId) return;
      switch (e.key.toLowerCase()) {
        case "q":
          rotatePiece(selectedPieceId, -45);
          play("rotate");
          break;
        case "e":
        case "r":
          rotatePiece(selectedPieceId, 45);
          play("rotate");
          break;
        case "f":
          flipPiece(selectedPieceId);
          play("rotate");
          break;
        case "escape":
          setPhase("paused");
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [state.phase, selectedPieceId, rotatePiece, flipPiece, setPhase, play]);

  // Handlers
  const handlePickPiece = useCallback(
    (id: PieceType) => {
      raisePiece(id);
      setDragging(id);
      play("pick");
    },
    [raisePiece, setDragging, play]
  );

  const handleDropPiece = useCallback(() => {
    setDragging(null);
    play("place");
  }, [setDragging, play]);

  const handleCheckPlacement = useCallback(
    (cx: number, cy: number) => {
      checkPlacement(cx, cy);
    },
    [checkPlacement]
  );

  const handleHint = useCallback(() => {
    useHint(centerX, centerY);
    play("click");
  }, [useHint, centerX, centerY, play]);

  const handleStart = useCallback(
    (difficulty: Difficulty) => {
      play("click");
      startGame(difficulty);
    },
    [startGame, play]
  );

  const handleRestart = useCallback(() => {
    play("click");
    startGame(state.difficulty);
  }, [startGame, state.difficulty, play]);

  const handleNextPuzzle = useCallback(() => {
    play("click");
    nextPuzzle();
  }, [nextPuzzle, play]);

  const currentPuzzle = state.puzzles[state.currentPuzzleIndex];

  return (
    <div className="fixed inset-0 bg-gray-950 overflow-hidden flex flex-col">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950 pointer-events-none" />

      <AnimatePresence mode="wait">
        {state.phase === "menu" && (
          <motion.div
            key="menu"
            className="relative z-10 flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MainMenu
              highScore={Math.max(state.highScore, storedHighScore)}
              onStart={handleStart}
            />
          </motion.div>
        )}

        {(state.phase === "playing" ||
          state.phase === "paused" ||
          state.phase === "won" ||
          state.phase === "lost") && (
          <motion.div
            key="game"
            className="relative z-10 flex flex-col flex-1 min-h-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {/* HUD */}
            <div className="flex-none border-b border-white/5 bg-black/20 backdrop-blur-sm">
              <HUD
                state={state}
                onPause={() => { setPhase("paused"); play("click"); }}
                onToggleSound={toggleSound}
                onHint={handleHint}
              />
            </div>

            {/* Canvas area */}
            <div
              ref={containerRef}
              className="flex-1 relative min-h-0"
              tabIndex={0}
              style={{ outline: "none" }}
            >
              {currentPuzzle && canvasSize.width > 0 && (
                <GameCanvas
                  pieces={state.pieces}
                  puzzleId={currentPuzzle.id}
                  onMovePiece={movePiece}
                  onPickPiece={handlePickPiece}
                  onDropPiece={handleDropPiece}
                  onSelectPiece={setSelectedPieceId}
                  selectedPieceId={selectedPieceId}
                  onCheckPlacement={handleCheckPlacement}
                  width={canvasSize.width}
                  height={canvasSize.height}
                />
              )}
            </div>

            {/* Controls bar */}
            <div className="flex-none border-t border-white/5 bg-black/20 backdrop-blur-sm py-2 px-3">
              <GameControls
                selectedPieceId={selectedPieceId}
                onRotateLeft={() => {
                  if (selectedPieceId) { rotatePiece(selectedPieceId, -45); play("rotate"); }
                }}
                onRotateRight={() => {
                  if (selectedPieceId) { rotatePiece(selectedPieceId, 45); play("rotate"); }
                }}
                onFlip={() => {
                  if (selectedPieceId) { flipPiece(selectedPieceId); play("rotate"); }
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause menu overlay */}
      <PauseMenu
        isOpen={state.phase === "paused"}
        soundEnabled={state.soundEnabled}
        musicEnabled={state.musicEnabled}
        onResume={() => { setPhase("playing"); play("click"); }}
        onRestart={handleRestart}
        onMenu={() => { setPhase("menu"); play("click"); }}
        onToggleSound={toggleSound}
        onToggleMusic={toggleMusic}
      />

      {/* End screen overlay */}
      {(state.phase === "won" || state.phase === "lost") && (
        <EndScreen
          state={state}
          onRestart={handleRestart}
          onNextPuzzle={handleNextPuzzle}
          onMenu={() => { setPhase("menu"); play("click"); }}
        />
      )}
    </div>
  );
}
