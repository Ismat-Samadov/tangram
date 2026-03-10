"use client";

import { useRef, useCallback } from "react";

type SoundType =
  | "pick"
  | "place"
  | "rotate"
  | "complete"
  | "wrong"
  | "tick"
  | "click";

/**
 * Synthesize sound effects using Web Audio API
 */
function createAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch {
    return null;
  }
}

function playTone(
  ctx: AudioContext,
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  gainVal = 0.3,
  detune = 0
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  osc.detune.setValueAtTime(detune, ctx.currentTime);

  gain.gain.setValueAtTime(gainVal, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

/**
 * Hook for playing synthesized sound effects
 */
export function useSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = createAudioContext();
    }
    if (ctxRef.current?.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (sound: SoundType) => {
      if (!enabled) return;
      const ctx = getCtx();
      if (!ctx) return;

      switch (sound) {
        case "pick":
          // Soft click when picking up a piece
          playTone(ctx, 440, 0.08, "sine", 0.2);
          break;

        case "place":
          // Satisfying thunk when placing
          playTone(ctx, 220, 0.12, "triangle", 0.3);
          setTimeout(() => playTone(ctx, 330, 0.1, "triangle", 0.15), 50);
          break;

        case "rotate":
          // Quick swoosh
          playTone(ctx, 660, 0.06, "sawtooth", 0.1);
          break;

        case "complete":
          // Victory fanfare
          [523, 659, 784, 1047].forEach((freq, i) => {
            setTimeout(() => playTone(ctx, freq, 0.3, "sine", 0.35), i * 120);
          });
          break;

        case "wrong":
          // Error buzz
          playTone(ctx, 180, 0.2, "sawtooth", 0.25);
          break;

        case "tick":
          // Timer tick
          playTone(ctx, 800, 0.05, "square", 0.08);
          break;

        case "click":
          // UI click
          playTone(ctx, 550, 0.07, "sine", 0.15);
          break;
      }
    },
    [enabled, getCtx]
  );

  return { play };
}
