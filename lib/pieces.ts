// Tangram piece definitions
// All vertices are defined on an 8x8 grid unit system
// The classic tangram fits inside a square of side 8 units

import { TangramPiece, PieceType, Point } from "@/types";

// Piece colors with neon theme
export const PIECE_COLORS: Record<PieceType, { fill: string; glow: string }> = {
  "large-triangle-1": { fill: "#ff6b9d", glow: "#ff6b9d" },
  "large-triangle-2": { fill: "#c44dff", glow: "#c44dff" },
  "medium-triangle": { fill: "#4daaff", glow: "#4daaff" },
  "small-triangle-1": { fill: "#4dffb4", glow: "#4dffb4" },
  "small-triangle-2": { fill: "#ffdd4d", glow: "#ffdd4d" },
  square: { fill: "#ff884d", glow: "#ff884d" },
  parallelogram: { fill: "#4dfff4", glow: "#4dfff4" },
};

// Vertices defined as [x, y] on 0-8 grid unit system
// Each piece's vertices are centered around (0,0) for easy rotation
export const PIECE_VERTICES: Record<PieceType, Point[]> = {
  // Large triangle: legs = 4 units (hypotenuse = 4√2)
  "large-triangle-1": [
    { x: -2, y: 2 },
    { x: 2, y: 2 },
    { x: -2, y: -2 },
  ],
  "large-triangle-2": [
    { x: -2, y: 2 },
    { x: 2, y: 2 },
    { x: 2, y: -2 },
  ],
  // Medium triangle: legs = 2√2
  "medium-triangle": [
    { x: -2, y: 1 },
    { x: 0, y: -1 },
    { x: 2, y: 1 },
  ],
  // Small triangle: legs = 2
  "small-triangle-1": [
    { x: -1, y: 1 },
    { x: 1, y: 1 },
    { x: -1, y: -1 },
  ],
  "small-triangle-2": [
    { x: -1, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: -1 },
  ],
  // Square: side = 2
  square: [
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: 1 },
  ],
  // Parallelogram
  parallelogram: [
    { x: -2, y: 0 },
    { x: 0, y: -1 },
    { x: 2, y: 0 },
    { x: 0, y: 1 },
  ],
};

// Scale factor: 1 grid unit = UNIT_SIZE pixels
export const UNIT_SIZE = 40;

/**
 * Rotate a point around origin by angle (degrees)
 */
export function rotatePoint(p: Point, angleDeg: number): Point {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: p.x * Math.cos(rad) - p.y * Math.sin(rad),
    y: p.x * Math.sin(rad) + p.y * Math.cos(rad),
  };
}

/**
 * Flip a point horizontally (for parallelogram)
 */
export function flipPoint(p: Point): Point {
  return { x: -p.x, y: p.y };
}

/**
 * Get the transformed vertices of a piece in canvas coordinates
 */
export function getTransformedVertices(piece: TangramPiece): Point[] {
  return PIECE_VERTICES[piece.id].map((v) => {
    let p = { ...v };
    if (piece.flipped) p = flipPoint(p);
    p = rotatePoint(p, piece.rotation);
    return {
      x: piece.x + p.x * UNIT_SIZE,
      y: piece.y + p.y * UNIT_SIZE,
    };
  });
}

/**
 * Check if a point is inside a polygon (ray casting)
 */
export function pointInPolygon(point: Point, polygon: Point[]): boolean {
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
 * Create initial pieces spread out in the piece tray
 */
export function createInitialPieces(
  trayX: number,
  trayY: number,
  trayWidth: number
): TangramPiece[] {
  const pieceTypes: PieceType[] = [
    "large-triangle-1",
    "large-triangle-2",
    "medium-triangle",
    "small-triangle-1",
    "small-triangle-2",
    "square",
    "parallelogram",
  ];

  const cols = 4;
  const cellW = trayWidth / cols;

  return pieceTypes.map((id, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      id,
      vertices: PIECE_VERTICES[id],
      color: PIECE_COLORS[id].fill,
      glowColor: PIECE_COLORS[id].glow,
      x: trayX + cellW * col + cellW / 2,
      y: trayY + row * 100 + 60,
      rotation: 0,
      flipped: false,
      isDragging: false,
      isPlaced: false,
      zIndex: i,
    };
  });
}
