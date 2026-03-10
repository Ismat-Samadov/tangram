// Core game logic utilities

import { TangramPiece, PieceType, Point } from "@/types";
import {
  getTransformedVertices,
  UNIT_SIZE,
  rotatePoint,
  flipPoint,
  PIECE_VERTICES,
} from "./pieces";
import { PUZZLES } from "./shapes";

// Snap threshold in pixels
const SNAP_THRESHOLD = 20;
// Placement accuracy threshold (how close rotation/position needs to be)
const PLACEMENT_THRESHOLD = UNIT_SIZE * 0.35;
const ROTATION_THRESHOLD = 22; // degrees

/**
 * Snap rotation to nearest 45 degrees
 */
export function snapRotation(rotation: number): number {
  return Math.round(rotation / 45) * 45;
}

/**
 * Normalize rotation to 0-360 range
 */
export function normalizeRotation(rotation: number): number {
  return ((rotation % 360) + 360) % 360;
}

/**
 * Calculate angle difference (shortest path)
 */
export function angleDiff(a: number, b: number): number {
  let diff = ((b - a + 180) % 360) - 180;
  if (diff < -180) diff += 360;
  return Math.abs(diff);
}

/**
 * Check if a piece is placed correctly for a given puzzle
 */
export function isPiecePlacedCorrectly(
  piece: TangramPiece,
  puzzleId: string,
  canvasCenterX: number,
  canvasCenterY: number
): boolean {
  const puzzle = PUZZLES.find((p) => p.id === puzzleId);
  if (!puzzle) return false;

  const solution = puzzle.solution[piece.id];
  if (!solution) return false;

  // Target position in canvas coords
  const targetX = canvasCenterX + solution.x * UNIT_SIZE;
  const targetY = canvasCenterY + solution.y * UNIT_SIZE;

  const dx = Math.abs(piece.x - targetX);
  const dy = Math.abs(piece.y - targetY);
  const dist = Math.sqrt(dx * dx + dy * dy);

  const rotDiff = angleDiff(
    normalizeRotation(piece.rotation),
    normalizeRotation(solution.rotation)
  );

  const flipMatch = piece.flipped === solution.flipped;

  return dist < PLACEMENT_THRESHOLD && rotDiff < ROTATION_THRESHOLD && flipMatch;
}

/**
 * Get the target position for a piece in the current puzzle
 */
export function getPieceTarget(
  pieceId: PieceType,
  puzzleId: string,
  canvasCenterX: number,
  canvasCenterY: number
): { x: number; y: number; rotation: number; flipped: boolean } | null {
  const puzzle = PUZZLES.find((p) => p.id === puzzleId);
  if (!puzzle) return null;

  const solution = puzzle.solution[pieceId];
  if (!solution) return null;

  return {
    x: canvasCenterX + solution.x * UNIT_SIZE,
    y: canvasCenterY + solution.y * UNIT_SIZE,
    rotation: solution.rotation,
    flipped: solution.flipped,
  };
}

/**
 * Check if all pieces are placed correctly
 */
export function checkPuzzleComplete(
  pieces: TangramPiece[],
  puzzleId: string,
  canvasCenterX: number,
  canvasCenterY: number
): boolean {
  return pieces.every((piece) =>
    isPiecePlacedCorrectly(piece, puzzleId, canvasCenterX, canvasCenterY)
  );
}

/**
 * Calculate score based on time, hints used, difficulty
 */
export function calculateScore(
  baseScore: number,
  timeElapsed: number,
  timeLimit: number | null,
  hintsUsed: number,
  multiplier: number
): number {
  let score = baseScore;

  // Time bonus (if time limit exists)
  if (timeLimit !== null) {
    const timeBonus = Math.max(0, timeLimit - timeElapsed) * 2;
    score += timeBonus;
  }

  // Hint penalty
  score -= hintsUsed * 100;

  // Apply difficulty multiplier
  score = Math.max(100, Math.round(score * multiplier));

  return score;
}

/**
 * Find which piece (if any) is at a given canvas point
 */
export function findPieceAtPoint(
  pieces: TangramPiece[],
  point: Point
): TangramPiece | null {
  // Check in reverse z-order (top piece first)
  const sorted = [...pieces].sort((a, b) => b.zIndex - a.zIndex);
  for (const piece of sorted) {
    const verts = getTransformedVertices(piece);
    if (pointInPolygon(point, verts)) {
      return piece;
    }
  }
  return null;
}

/**
 * Ray casting point-in-polygon test
 */
function pointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  const n = polygon.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Format time as MM:SS
 */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/**
 * Get canvas dimensions based on viewport
 */
export function getCanvasDimensions(
  containerWidth: number,
  containerHeight: number
) {
  return {
    width: containerWidth,
    height: containerHeight,
    centerX: containerWidth / 2,
    centerY: containerHeight * 0.42,
  };
}
