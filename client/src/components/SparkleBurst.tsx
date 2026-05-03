import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type Sparkle = { id: number; x: number; y: number; r: number; delay: number; color: string };

const COLORS = ["#F6B935", "#FF93B5", "#3D6FE0", "#6BD18A", "#FFD166"];

export default function SparkleBurst({ trigger }: { trigger: number }) {
  const [items, setItems] = useState<Sparkle[]>([]);

  useEffect(() => {
    if (trigger <= 0) return;
    const arr: Sparkle[] = Array.from({ length: 28 }).map((_, i) => ({
      id: trigger * 1000 + i,
      x: (Math.random() - 0.5) * 360,
      y: (Math.random() - 0.5) * 360 - 60,
      r: Math.random() * 360,
      delay: Math.random() * 0.15,
      color: COLORS[i % COLORS.length],
    }));
    setItems(arr);
    const t = setTimeout(() => setItems([]), 1400);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {items.map((s) => (
          <motion.div
            key={s.id}
            className="absolute"
            initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
            animate={{ x: s.x, y: s.y, opacity: [0, 1, 1, 0], scale: [0, 1.3, 1, 0.6], rotate: s.r }}
            transition={{ duration: 1.2, delay: s.delay, ease: "easeOut" }}
            style={{ color: s.color }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.39 6.95L21 10l-5.5 4.4L17.6 22 12 17.8 6.4 22l2.1-7.6L3 10l6.61-1.05L12 2z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
