import { useEffect, useState } from "react";

interface Piece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  rotate: number;
}

const COLORS = [
  "oklch(0.7 0.18 50)",
  "oklch(0.55 0.22 265)",
  "oklch(0.65 0.2 145)",
  "oklch(0.7 0.18 320)",
  "oklch(0.75 0.18 70)",
];

export function Confetti({
  trigger,
  onDone,
}: {
  trigger: number; // change this number to fire
  onDone?: () => void;
}) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!trigger) return;
    const arr: Piece[] = Array.from({ length: 60 }).map((_, i) => ({
      id: trigger * 1000 + i,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 1.6 + Math.random() * 1.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotate: Math.random() * 360,
    }));
    setPieces(arr);
    const t = setTimeout(() => {
      setPieces([]);
      onDone?.();
    }, 3200);
    return () => clearTimeout(t);
  }, [trigger, onDone]);

  if (pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-20px] block h-2.5 w-2 rounded-[2px] confetti-fall"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
