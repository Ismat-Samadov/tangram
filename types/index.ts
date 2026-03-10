// Core game types for Tangram puzzle game

export type PieceType =
  | "large-triangle-1"
  | "large-triangle-2"
  | "medium-triangle"
  | "small-triangle-1"
  | "small-triangle-2"
  | "square"
  | "parallelogram";

export interface Point {
  x: number;
  y: number;
}

export interface TangramPiece {
  id: PieceType;
  // Polygon vertices relative to piece center (normalized 0-1 space on a 8x8 grid)
  vertices: Point[];
  color: string;
  glowColor: string;
  // Current position in canvas coords
  x: number;
  y: number;
  // Rotation in degrees (multiples of 45)
  rotation: number;
  // Whether piece is flipped (parallelogram only)
  flipped: boolean;
  // Is it currently being dragged
  isDragging: boolean;
  // Is it placed correctly
  isPlaced: boolean;
  // Z-order
  zIndex: number;
}

export interface PuzzleShape {
  id: string;
  name: string;
  difficulty: "easy" | "medium" | "hard";
  // Solution: each piece's position/rotation relative to puzzle center
  solution: Record<
    PieceType,
    { x: number; y: number; rotation: number; flipped: boolean }
  >;
  // SVG path for silhouette display
  silhouettePath: string;
  // Hint image description
  hint: string;
}

export type GamePhase = "menu" | "playing" | "paused" | "won" | "lost";
export type Difficulty = "easy" | "medium" | "hard";

export interface GameState {
  phase: GamePhase;
  difficulty: Difficulty;
  currentPuzzleIndex: number;
  puzzles: PuzzleShape[];
  pieces: TangramPiece[];
  score: number;
  highScore: number;
  timeElapsed: number;
  timeLimit: number | null;
  soundEnabled: boolean;
  musicEnabled: boolean;
  completedPuzzles: string[];
  hintsUsed: number;
  moveCount: number;
}

export interface DragState {
  isDragging: boolean;
  pieceId: PieceType | null;
  offsetX: number;
  offsetY: number;
  startX: number;
  startY: number;
}
