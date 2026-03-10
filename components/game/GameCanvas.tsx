"use client";

import {
  useRef,
  useEffect,
  useCallback,
  useState,
  MouseEvent,
  TouchEvent,
} from "react";
import { TangramPiece, PieceType, Point } from "@/types";
import {
  getTransformedVertices,
  UNIT_SIZE,
  PIECE_VERTICES,
  rotatePoint,
  flipPoint,
} from "@/lib/pieces";
import { findPieceAtPoint } from "@/lib/gameLogic";
import { PUZZLES } from "@/lib/shapes";

interface GameCanvasProps {
  pieces: TangramPiece[];
  puzzleId: string;
  onMovePiece: (id: PieceType, x: number, y: number) => void;
  onPickPiece: (id: PieceType) => void;
  onDropPiece: () => void;
  onSelectPiece: (id: PieceType | null) => void;
  selectedPieceId: PieceType | null;
  onCheckPlacement: (cx: number, cy: number) => void;
  width: number;
  height: number;
}

const TRAY_HEIGHT_RATIO = 0.3; // Bottom 30% is the piece tray

export default function GameCanvas({
  pieces,
  puzzleId,
  onMovePiece,
  onPickPiece,
  onDropPiece,
  onSelectPiece,
  selectedPieceId,
  onCheckPlacement,
  width,
  height,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const dragRef = useRef<{
    active: boolean;
    pieceId: PieceType | null;
    offsetX: number;
    offsetY: number;
  }>({ active: false, pieceId: null, offsetX: 0, offsetY: 0 });

  // Canvas center (where puzzle is centered)
  const centerX = width / 2;
  const centerY = (height * (1 - TRAY_HEIGHT_RATIO)) / 2;
  const trayY = height * (1 - TRAY_HEIGHT_RATIO);

  // Draw loop
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw puzzle area background
    drawPuzzleArea(ctx, width, trayY);

    // Draw silhouette
    drawSilhouette(ctx, puzzleId, centerX, centerY);

    // Draw tray separator
    drawTrayDivider(ctx, width, trayY);

    // Draw tray background
    drawTrayBackground(ctx, width, height, trayY);

    // Draw pieces (sorted by zIndex)
    const sorted = [...pieces].sort((a, b) => a.zIndex - b.zIndex);
    for (const piece of sorted) {
      drawPiece(ctx, piece, piece.id === selectedPieceId, puzzleId, centerX, centerY);
    }
  }, [pieces, puzzleId, width, height, trayY, centerX, centerY, selectedPieceId]);

  // Animate
  useEffect(() => {
    const loop = () => {
      draw();
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);

  // Pointer helpers
  const getCanvasPoint = useCallback(
    (e: MouseEvent | TouchEvent): Point => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;

      if ("touches" in e && e.touches.length > 0) {
        return {
          x: (e.touches[0].clientX - rect.left) * scaleX,
          y: (e.touches[0].clientY - rect.top) * scaleY,
        };
      }
      const me = e as MouseEvent;
      return {
        x: (me.clientX - rect.left) * scaleX,
        y: (me.clientY - rect.top) * scaleY,
      };
    },
    [width, height]
  );

  // Mouse / touch handlers
  const handlePointerDown = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const point = getCanvasPoint(e);
      const piece = findPieceAtPoint(pieces, point);

      if (piece) {
        e.preventDefault();
        dragRef.current = {
          active: true,
          pieceId: piece.id,
          offsetX: point.x - piece.x,
          offsetY: point.y - piece.y,
        };
        onSelectPiece(piece.id);
        onPickPiece(piece.id);
      } else {
        onSelectPiece(null);
      }
    },
    [pieces, getCanvasPoint, onSelectPiece, onPickPiece]
  );

  const handlePointerMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!dragRef.current.active || !dragRef.current.pieceId) return;
      e.preventDefault();
      const point = getCanvasPoint(e);
      onMovePiece(
        dragRef.current.pieceId,
        point.x - dragRef.current.offsetX,
        point.y - dragRef.current.offsetY
      );
    },
    [getCanvasPoint, onMovePiece]
  );

  const handlePointerUp = useCallback(() => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    dragRef.current.pieceId = null;
    onDropPiece();
    onCheckPlacement(centerX, centerY);
  }, [onDropPiece, onCheckPlacement, centerX, centerY]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="touch-none select-none cursor-grab active:cursor-grabbing w-full h-full"
      style={{ imageRendering: "crisp-edges" }}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    />
  );
}

// ─── Drawing helpers ────────────────────────────────────────────────────────

function drawPuzzleArea(ctx: CanvasRenderingContext2D, width: number, trayY: number) {
  ctx.save();
  // Subtle grid dots
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  const gridSize = 20;
  for (let x = gridSize; x < width; x += gridSize) {
    for (let y = gridSize; y < trayY; y += gridSize) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawTrayDivider(ctx: CanvasRenderingContext2D, width: number, trayY: number) {
  ctx.save();
  const grad = ctx.createLinearGradient(0, trayY, width, trayY);
  grad.addColorStop(0, "transparent");
  grad.addColorStop(0.2, "rgba(139,92,246,0.6)");
  grad.addColorStop(0.8, "rgba(139,92,246,0.6)");
  grad.addColorStop(1, "transparent");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(0, trayY);
  ctx.lineTo(width, trayY);
  ctx.stroke();
  ctx.restore();
}

function drawTrayBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  trayY: number
) {
  ctx.save();
  const grad = ctx.createLinearGradient(0, trayY, 0, height);
  grad.addColorStop(0, "rgba(17,10,40,0.5)");
  grad.addColorStop(1, "rgba(10,5,30,0.8)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, trayY, width, height - trayY);

  // Label
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.font = "12px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("PIECE TRAY — drag pieces to the puzzle area above", width / 2, trayY + 16);
  ctx.restore();
}

function drawSilhouette(
  ctx: CanvasRenderingContext2D,
  puzzleId: string,
  cx: number,
  cy: number
) {
  const puzzle = PUZZLES.find((p) => p.id === puzzleId);
  if (!puzzle) return;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(UNIT_SIZE, UNIT_SIZE);

  const path = new Path2D(puzzle.silhouettePath);

  // Glow effect
  ctx.shadowColor = "rgba(139,92,246,0.6)";
  ctx.shadowBlur = 20 / UNIT_SIZE;

  ctx.fillStyle = "rgba(139,92,246,0.12)";
  ctx.fill(path);

  ctx.strokeStyle = "rgba(139,92,246,0.5)";
  ctx.lineWidth = 2 / UNIT_SIZE;
  ctx.setLineDash([4 / UNIT_SIZE, 3 / UNIT_SIZE]);
  ctx.stroke(path);

  ctx.restore();

  // Puzzle label
  ctx.save();
  ctx.fillStyle = "rgba(139,92,246,0.6)";
  ctx.font = "bold 13px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(`TARGET: ${puzzle.name.toUpperCase()}`, cx, cy - UNIT_SIZE * 4.5 - 8);
  ctx.restore();
}

function drawPiece(
  ctx: CanvasRenderingContext2D,
  piece: TangramPiece,
  isSelected: boolean,
  puzzleId: string,
  canvasCenterX: number,
  canvasCenterY: number
) {
  const verts = getTransformedVertices(piece);
  if (verts.length === 0) return;

  ctx.save();

  // Shadow / lift effect for dragging
  if (piece.isDragging) {
    ctx.shadowColor = piece.glowColor + "aa";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 6;
  } else if (isSelected) {
    ctx.shadowColor = piece.glowColor + "88";
    ctx.shadowBlur = 14;
  }

  // Build path
  ctx.beginPath();
  ctx.moveTo(verts[0].x, verts[0].y);
  for (let i = 1; i < verts.length; i++) {
    ctx.lineTo(verts[i].x, verts[i].y);
  }
  ctx.closePath();

  // Fill
  if (piece.isPlaced) {
    // Placed pieces get a brighter, more saturated fill
    ctx.fillStyle = piece.color + "ee";
    ctx.shadowColor = piece.glowColor;
    ctx.shadowBlur = 16;
  } else {
    ctx.fillStyle = piece.color + "cc";
  }
  ctx.fill();

  // Stroke
  ctx.strokeStyle = isSelected
    ? "#ffffff"
    : piece.isPlaced
    ? piece.glowColor
    : "rgba(255,255,255,0.3)";
  ctx.lineWidth = isSelected ? 2.5 : piece.isPlaced ? 2 : 1.5;
  ctx.stroke();

  // Inner shine
  ctx.beginPath();
  ctx.moveTo(verts[0].x, verts[0].y);
  for (let i = 1; i < verts.length; i++) {
    ctx.lineTo(verts[i].x, verts[i].y);
  }
  ctx.closePath();
  const centX = verts.reduce((s, v) => s + v.x, 0) / verts.length;
  const centY = verts.reduce((s, v) => s + v.y, 0) / verts.length;
  const shine = ctx.createRadialGradient(
    centX - 5, centY - 5, 0,
    centX, centY, 30
  );
  shine.addColorStop(0, "rgba(255,255,255,0.2)");
  shine.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = shine;
  ctx.fill();

  ctx.restore();
}
