// Puzzle shape definitions for the Tangram game
// Solutions describe where each piece should be placed relative to the puzzle center

import { PuzzleShape } from "@/types";

// Puzzle center is at (0, 0) in normalized coordinates (grid units)
// Positions are in grid units (1 unit = UNIT_SIZE pixels)

export const PUZZLES: PuzzleShape[] = [
  // ===== EASY PUZZLES =====
  {
    id: "square",
    name: "Square",
    difficulty: "easy",
    hint: "A perfect square shape",
    solution: {
      "large-triangle-1": { x: -2, y: -2, rotation: 0, flipped: false },
      "large-triangle-2": { x: 2, y: 2, rotation: 180, flipped: false },
      "medium-triangle": { x: 0, y: 2, rotation: 270, flipped: false },
      "small-triangle-1": { x: -1, y: 1, rotation: 45, flipped: false },
      "small-triangle-2": { x: 1, y: 1, rotation: 225, flipped: false },
      square: { x: -1, y: -1, rotation: 0, flipped: false },
      parallelogram: { x: 1, y: -1, rotation: 0, flipped: false },
    },
    silhouettePath:
      "M -4 -4 L 4 -4 L 4 4 L -4 4 Z",
  },
  {
    id: "triangle",
    name: "Big Triangle",
    difficulty: "easy",
    hint: "A large triangle made from all 7 pieces",
    solution: {
      "large-triangle-1": { x: -2, y: 2, rotation: 0, flipped: false },
      "large-triangle-2": { x: 2, y: 2, rotation: 90, flipped: false },
      "medium-triangle": { x: 0, y: 0, rotation: 180, flipped: false },
      "small-triangle-1": { x: -1, y: -1, rotation: 180, flipped: false },
      "small-triangle-2": { x: 1, y: -1, rotation: 90, flipped: false },
      square: { x: 0, y: -2, rotation: 45, flipped: false },
      parallelogram: { x: -1, y: 1, rotation: 0, flipped: false },
    },
    silhouettePath: "M 0 -4 L 4 4 L -4 4 Z",
  },
  {
    id: "rectangle",
    name: "Rectangle",
    difficulty: "easy",
    hint: "A simple rectangle",
    solution: {
      "large-triangle-1": { x: -2, y: 0, rotation: 270, flipped: false },
      "large-triangle-2": { x: 2, y: 0, rotation: 90, flipped: false },
      "medium-triangle": { x: 0, y: -1, rotation: 180, flipped: false },
      "small-triangle-1": { x: -1, y: 1, rotation: 0, flipped: false },
      "small-triangle-2": { x: 1, y: 1, rotation: 90, flipped: false },
      square: { x: 0, y: 1, rotation: 0, flipped: false },
      parallelogram: { x: 0, y: -1, rotation: 90, flipped: false },
    },
    silhouettePath: "M -4 -2 L 4 -2 L 4 2 L -4 2 Z",
  },

  // ===== MEDIUM PUZZLES =====
  {
    id: "cat",
    name: "Cat",
    difficulty: "medium",
    hint: "A sitting cat silhouette",
    solution: {
      "large-triangle-1": { x: 0, y: 2, rotation: 0, flipped: false },
      "large-triangle-2": { x: 0, y: -2, rotation: 180, flipped: false },
      "medium-triangle": { x: -2, y: 0, rotation: 270, flipped: false },
      "small-triangle-1": { x: -2, y: -3, rotation: 180, flipped: false },
      "small-triangle-2": { x: 0, y: -3, rotation: 180, flipped: false },
      square: { x: 2, y: 1, rotation: 45, flipped: false },
      parallelogram: { x: 2, y: -1, rotation: 0, flipped: false },
    },
    silhouettePath:
      "M -1 -4 L 0 -3 L 1 -4 L 2 -3 L 2 -1 L 3 0 L 3 3 L -3 3 L -3 0 L -2 -1 L -2 -3 Z",
  },
  {
    id: "house",
    name: "House",
    difficulty: "medium",
    hint: "A simple house with a triangular roof",
    solution: {
      "large-triangle-1": { x: -1, y: -2, rotation: 270, flipped: false },
      "large-triangle-2": { x: 1, y: -2, rotation: 90, flipped: false },
      "medium-triangle": { x: 0, y: -4, rotation: 180, flipped: false },
      "small-triangle-1": { x: -2, y: 1, rotation: 0, flipped: false },
      "small-triangle-2": { x: 2, y: 1, rotation: 90, flipped: false },
      square: { x: 0, y: 2, rotation: 0, flipped: false },
      parallelogram: { x: -1, y: 2, rotation: 0, flipped: false },
    },
    silhouettePath:
      "M 0 -4 L 3 -1 L 3 3 L -3 3 L -3 -1 Z",
  },
  {
    id: "boat",
    name: "Sailboat",
    difficulty: "medium",
    hint: "A sailboat on the water",
    solution: {
      "large-triangle-1": { x: 0, y: -2, rotation: 0, flipped: false },
      "large-triangle-2": { x: -1, y: 2, rotation: 270, flipped: false },
      "medium-triangle": { x: 1, y: 0, rotation: 90, flipped: false },
      "small-triangle-1": { x: -2, y: 3, rotation: 0, flipped: false },
      "small-triangle-2": { x: 2, y: 3, rotation: 90, flipped: false },
      square: { x: 0, y: 3, rotation: 0, flipped: false },
      parallelogram: { x: 1, y: 2, rotation: 45, flipped: false },
    },
    silhouettePath:
      "M 0 -4 L 3 2 L 3 4 L -3 4 L -3 2 Z",
  },

  // ===== HARD PUZZLES =====
  {
    id: "fox",
    name: "Running Fox",
    difficulty: "hard",
    hint: "A fox running with its bushy tail",
    solution: {
      "large-triangle-1": { x: 2, y: 0, rotation: 45, flipped: false },
      "large-triangle-2": { x: -2, y: 0, rotation: 225, flipped: false },
      "medium-triangle": { x: 0, y: -2, rotation: 315, flipped: false },
      "small-triangle-1": { x: 3, y: -2, rotation: 45, flipped: false },
      "small-triangle-2": { x: -3, y: 2, rotation: 135, flipped: false },
      square: { x: 0, y: 2, rotation: 45, flipped: false },
      parallelogram: { x: 1, y: -1, rotation: 315, flipped: true },
    },
    silhouettePath:
      "M -4 -1 L -2 -3 L 0 -2 L 2 -4 L 4 -2 L 3 0 L 4 2 L 2 3 L 0 1 L -2 3 L -4 2 Z",
  },
  {
    id: "swan",
    name: "Swan",
    difficulty: "hard",
    hint: "An elegant swan with a curved neck",
    solution: {
      "large-triangle-1": { x: 0, y: 2, rotation: 90, flipped: false },
      "large-triangle-2": { x: -2, y: 2, rotation: 270, flipped: false },
      "medium-triangle": { x: 1, y: -1, rotation: 45, flipped: false },
      "small-triangle-1": { x: 2, y: -3, rotation: 135, flipped: false },
      "small-triangle-2": { x: 3, y: -1, rotation: 225, flipped: false },
      square: { x: -1, y: 0, rotation: 45, flipped: false },
      parallelogram: { x: 1, y: 1, rotation: 315, flipped: false },
    },
    silhouettePath:
      "M 2 -4 L 4 -2 L 3 0 L 2 1 L 1 2 L 2 4 L -2 4 L -4 2 L -3 0 L -1 -1 L 0 -3 Z",
  },
  {
    id: "rocket",
    name: "Rocket",
    difficulty: "hard",
    hint: "A rocket ship blasting off",
    solution: {
      "large-triangle-1": { x: -1, y: -2, rotation: 0, flipped: false },
      "large-triangle-2": { x: 1, y: -2, rotation: 0, flipped: false },
      "medium-triangle": { x: 0, y: -4, rotation: 180, flipped: false },
      "small-triangle-1": { x: -2, y: 2, rotation: 270, flipped: false },
      "small-triangle-2": { x: 2, y: 2, rotation: 90, flipped: false },
      square: { x: 0, y: 0, rotation: 0, flipped: false },
      parallelogram: { x: 0, y: 2, rotation: 0, flipped: false },
    },
    silhouettePath:
      "M 0 -5 L 2 -2 L 2 2 L 3 4 L 0 3 L -3 4 L -2 2 L -2 -2 Z",
  },
];

export const PUZZLES_BY_DIFFICULTY = {
  easy: PUZZLES.filter((p) => p.difficulty === "easy"),
  medium: PUZZLES.filter((p) => p.difficulty === "medium"),
  hard: PUZZLES.filter((p) => p.difficulty === "hard"),
};

export const TIME_LIMITS = {
  easy: null, // No time limit
  medium: 300, // 5 minutes
  hard: 180, // 3 minutes
};

export const SCORE_MULTIPLIERS = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export const BASE_SCORE = 1000;
