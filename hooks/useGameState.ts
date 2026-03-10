"use client";

import { useReducer, useCallback, useEffect, useRef } from "react";
import { GameState, GamePhase, Difficulty, TangramPiece, PieceType } from "@/types";
import { createInitialPieces } from "@/lib/pieces";
import {
  PUZZLES_BY_DIFFICULTY,
  TIME_LIMITS,
  SCORE_MULTIPLIERS,
  BASE_SCORE,
} from "@/lib/shapes";
import {
  checkPuzzleComplete,
  calculateScore,
  snapRotation,
  normalizeRotation,
  isPiecePlacedCorrectly,
} from "@/lib/gameLogic";

type GameAction =
  | { type: "START_GAME"; difficulty: Difficulty }
  | { type: "SET_PHASE"; phase: GamePhase }
  | { type: "MOVE_PIECE"; id: PieceType; x: number; y: number }
  | { type: "ROTATE_PIECE"; id: PieceType; delta: number }
  | { type: "FLIP_PIECE"; id: PieceType }
  | { type: "SET_DRAGGING"; id: PieceType | null }
  | { type: "RAISE_PIECE"; id: PieceType }
  | {
      type: "CHECK_PLACEMENT";
      canvasCenterX: number;
      canvasCenterY: number;
    }
  | { type: "TICK" }
  | { type: "TOGGLE_SOUND" }
  | { type: "TOGGLE_MUSIC" }
  | { type: "USE_HINT"; canvasCenterX: number; canvasCenterY: number }
  | { type: "NEXT_PUZZLE" }
  | { type: "SET_HIGH_SCORE"; score: number }
  | {
      type: "INIT_PIECES";
      trayX: number;
      trayY: number;
      trayWidth: number;
    };

function getInitialState(): GameState {
  return {
    phase: "menu",
    difficulty: "easy",
    currentPuzzleIndex: 0,
    puzzles: [],
    pieces: [],
    score: 0,
    highScore: 0,
    timeElapsed: 0,
    timeLimit: null,
    soundEnabled: true,
    musicEnabled: false,
    completedPuzzles: [],
    hintsUsed: 0,
    moveCount: 0,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      const puzzles = PUZZLES_BY_DIFFICULTY[action.difficulty];
      return {
        ...state,
        phase: "playing",
        difficulty: action.difficulty,
        currentPuzzleIndex: 0,
        puzzles,
        score: 0,
        timeElapsed: 0,
        timeLimit: TIME_LIMITS[action.difficulty],
        hintsUsed: 0,
        moveCount: 0,
      };
    }

    case "INIT_PIECES": {
      const pieces = createInitialPieces(
        action.trayX,
        action.trayY,
        action.trayWidth
      );
      return { ...state, pieces };
    }

    case "SET_PHASE":
      return { ...state, phase: action.phase };

    case "MOVE_PIECE":
      return {
        ...state,
        moveCount: state.moveCount + 1,
        pieces: state.pieces.map((p) =>
          p.id === action.id ? { ...p, x: action.x, y: action.y } : p
        ),
      };

    case "ROTATE_PIECE":
      return {
        ...state,
        pieces: state.pieces.map((p) =>
          p.id === action.id
            ? {
                ...p,
                rotation: normalizeRotation(
                  snapRotation(p.rotation + action.delta)
                ),
                isPlaced: false,
              }
            : p
        ),
      };

    case "FLIP_PIECE":
      return {
        ...state,
        pieces: state.pieces.map((p) =>
          p.id === action.id
            ? { ...p, flipped: !p.flipped, isPlaced: false }
            : p
        ),
      };

    case "SET_DRAGGING":
      return {
        ...state,
        pieces: state.pieces.map((p) => ({
          ...p,
          isDragging: p.id === action.id,
        })),
      };

    case "RAISE_PIECE": {
      const maxZ = Math.max(...state.pieces.map((p) => p.zIndex));
      return {
        ...state,
        pieces: state.pieces.map((p) =>
          p.id === action.id ? { ...p, zIndex: maxZ + 1 } : p
        ),
      };
    }

    case "CHECK_PLACEMENT": {
      const currentPuzzle = state.puzzles[state.currentPuzzleIndex];
      if (!currentPuzzle) return state;

      const updatedPieces = state.pieces.map((p) => {
        const placed = isPiecePlacedCorrectly(
          p,
          currentPuzzle.id,
          action.canvasCenterX,
          action.canvasCenterY
        );
        return { ...p, isPlaced: placed };
      });

      const allPlaced = checkPuzzleComplete(
        updatedPieces,
        currentPuzzle.id,
        action.canvasCenterX,
        action.canvasCenterY
      );

      if (allPlaced) {
        const multiplier = SCORE_MULTIPLIERS[state.difficulty];
        const gained = calculateScore(
          BASE_SCORE,
          state.timeElapsed,
          state.timeLimit,
          state.hintsUsed,
          multiplier
        );
        const newScore = state.score + gained;
        const newHighScore = Math.max(state.highScore, newScore);
        return {
          ...state,
          pieces: updatedPieces,
          phase: "won",
          score: newScore,
          highScore: newHighScore,
          completedPuzzles: [
            ...state.completedPuzzles,
            currentPuzzle.id,
          ],
        };
      }

      return { ...state, pieces: updatedPieces };
    }

    case "TICK": {
      const newTime = state.timeElapsed + 1;
      if (state.timeLimit !== null && newTime >= state.timeLimit) {
        return { ...state, timeElapsed: newTime, phase: "lost" };
      }
      return { ...state, timeElapsed: newTime };
    }

    case "TOGGLE_SOUND":
      return { ...state, soundEnabled: !state.soundEnabled };

    case "TOGGLE_MUSIC":
      return { ...state, musicEnabled: !state.musicEnabled };

    case "USE_HINT": {
      // Snap the first unplaced piece to its correct position
      const currentPuzzle = state.puzzles[state.currentPuzzleIndex];
      if (!currentPuzzle) return state;

      const unplaced = state.pieces.find((p) => !p.isPlaced);
      if (!unplaced) return state;

      const sol = currentPuzzle.solution[unplaced.id];
      if (!sol) return state;

      const hintX = action.canvasCenterX + sol.x * 40;
      const hintY = action.canvasCenterY + sol.y * 40;

      const updatedPieces = state.pieces.map((p) =>
        p.id === unplaced.id
          ? {
              ...p,
              x: hintX,
              y: hintY,
              rotation: sol.rotation,
              flipped: sol.flipped,
              isPlaced: true,
            }
          : p
      );

      return {
        ...state,
        hintsUsed: state.hintsUsed + 1,
        pieces: updatedPieces,
      };
    }

    case "NEXT_PUZZLE": {
      const nextIndex = state.currentPuzzleIndex + 1;
      if (nextIndex >= state.puzzles.length) {
        return { ...state, phase: "won" };
      }
      return {
        ...state,
        currentPuzzleIndex: nextIndex,
        phase: "playing",
        timeElapsed: 0,
        hintsUsed: 0,
      };
    }

    case "SET_HIGH_SCORE":
      return { ...state, highScore: Math.max(state.highScore, action.score) };

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, getInitialState());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer management
  useEffect(() => {
    if (state.phase === "playing") {
      timerRef.current = setInterval(() => {
        dispatch({ type: "TICK" });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.phase]);

  const startGame = useCallback((difficulty: Difficulty) => {
    dispatch({ type: "START_GAME", difficulty });
  }, []);

  const initPieces = useCallback(
    (trayX: number, trayY: number, trayWidth: number) => {
      dispatch({ type: "INIT_PIECES", trayX, trayY, trayWidth });
    },
    []
  );

  const movePiece = useCallback((id: PieceType, x: number, y: number) => {
    dispatch({ type: "MOVE_PIECE", id, x, y });
  }, []);

  const rotatePiece = useCallback((id: PieceType, delta: number) => {
    dispatch({ type: "ROTATE_PIECE", id, delta });
  }, []);

  const flipPiece = useCallback((id: PieceType) => {
    dispatch({ type: "FLIP_PIECE", id });
  }, []);

  const setDragging = useCallback((id: PieceType | null) => {
    dispatch({ type: "SET_DRAGGING", id });
  }, []);

  const raisePiece = useCallback((id: PieceType) => {
    dispatch({ type: "RAISE_PIECE", id });
  }, []);

  const checkPlacement = useCallback(
    (canvasCenterX: number, canvasCenterY: number) => {
      dispatch({ type: "CHECK_PLACEMENT", canvasCenterX, canvasCenterY });
    },
    []
  );

  const setPhase = useCallback((phase: GamePhase) => {
    dispatch({ type: "SET_PHASE", phase });
  }, []);

  const toggleSound = useCallback(() => {
    dispatch({ type: "TOGGLE_SOUND" });
  }, []);

  const toggleMusic = useCallback(() => {
    dispatch({ type: "TOGGLE_MUSIC" });
  }, []);

  const useHint = useCallback(
    (canvasCenterX: number, canvasCenterY: number) => {
      dispatch({ type: "USE_HINT", canvasCenterX, canvasCenterY });
    },
    []
  );

  const nextPuzzle = useCallback(() => {
    dispatch({ type: "NEXT_PUZZLE" });
  }, []);

  const setHighScore = useCallback((score: number) => {
    dispatch({ type: "SET_HIGH_SCORE", score });
  }, []);

  return {
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
  };
}
