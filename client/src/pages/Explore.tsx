/**
 * 设计：童话绘本 - 认识百数表
 * - 100 格交互百数表
 * - 三个模式按钮：横着看 / 竖着看 / 斜着看
 *   - 横：可滑动选择第几行（1-10），整行高亮粉色，并展示"+1"动画
 *   - 竖：可选第几列，整列高亮绿色，并展示"+10"提示
 *   - 斜：高亮主/副对角线，显示规律
 * - 完成至少 3 次切换即可解锁本关
 */
import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/PageShell";
import SparkleBurst from "@/components/SparkleBurst";
import { ASSETS } from "@/lib/assets";
import { useProgress } from "@/contexts/ProgressContext";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { sound } from "@/lib/sound";

type Mode = "none" | "row" | "col" | "diag";

const DIAG_MAIN = [1, 12, 23, 34, 45, 56, 67, 78, 89, 100];
const DIAG_ANTI = [10, 19, 28, 37, 46, 55, 64, 73, 82, 91];

export default function Explore() {
  const [mode, setMode] = useState<Mode>("none");
  const [rowIdx, setRowIdx] = useState(1); // 第几行 1-10
  const [colIdx, setColIdx] = useState(1); // 第几列 1-10
  const [picked, setPicked] = useState<number | null>(null);
  const [burst, setBurst] = useState(0);
  const [exploredModes, setExploredModes] = useState<Set<Mode>>(new Set());
  const { markComplete, addCoins, completed } = useProgress();

  const cells = useMemo(() => Array.from({ length: 100 }, (_, i) => i + 1), []);

  function isHighlight(n: number): "row" | "col" | "diag-main" | "diag-anti" | null {
    if (mode === "row") {
      const start = (rowIdx - 1) * 10 + 1;
      if (n >= start && n <= start + 9) return "row";
    }
    if (mode === "col") {
      const ones = n === 100 ? 0 : n % 10;
      const colOnes = colIdx === 10 ? 0 : colIdx;
      if (ones === colOnes) return "col";
    }
    if (mode === "diag") {
      if (DIAG_MAIN.includes(n)) return "diag-main";
      if (DIAG_ANTI.includes(n)) return "diag-anti";
    }
    return null;
  }

  function clickCell(n: number) {
    setPicked(n);
    sound.tap();
  }

  useEffect(() => {
    if (mode !== "none") setExploredModes((s) => new Set(s).add(mode));
  }, [mode]);

  function tryUnlock() {
    if (completed.explore) return;
    setBurst((b) => b + 1);
    sound.win();
    addCoins(3);
    markComplete("explore");
  }

  const tip = useMemo(() => {
    if (mode === "row") {
      const start = (rowIdx - 1) * 10 + 1;
      return `第 ${rowIdx} 行：${start} 到 ${start + 9}，每个数都比前一个 +1。`;
    }
    if (mode === "col") {
      const ones = colIdx === 10 ? 0 : colIdx;
      return `第 ${colIdx} 列（个位是 ${ones}）：从上到下每次 +10。`;
    }
    if (mode === "diag") {
      return "斜线 ↘ 是 +11（金色），斜线 ↙ 是 +9（粉色）。";
    }
    return "先观察整张百数表，看看数字是怎么排列的？";
  }, [mode, rowIdx, colIdx]);

  return (
    <PageShell current="explore">
      <SparkleBurst trigger={burst} />

      {/* 国王对话 */}
      <div className="flex items-start gap-4 mb-5">
        <img src={ASSETS.king} alt="国王" className="w-24 sm:w-28 shrink-0 king-breath drop-shadow-lg" />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="king-bubble flex-1">
          这就是<strong className="text-[#e89a18]">百数表</strong>啦！按下面的按钮试一试，
          <strong className="text-[#3d6fe0]">横着、竖着、斜着</strong>看，能发现什么秘密呢？
        </motion.div>
      </div>

      {/* 模式按钮 */}
      <div className="flex flex-wrap gap-3 justify-center mb-3">
        <button
          onClick={() => setMode(mode === "row" ? "none" : "row")}
          className={`btn-quest btn-pink !text-[#4a3416] ${mode === "row" ? "ring-4 ring-[#ff93b5]" : ""}`}
        >
          ↔ 横着看
        </button>
        <button
          onClick={() => setMode(mode === "col" ? "none" : "col")}
          className={`btn-quest btn-green !text-[#1f3d28] ${mode === "col" ? "ring-4 ring-[#6bd18a]" : ""}`}
        >
          ↕ 竖着看
        </button>
        <button
          onClick={() => setMode(mode === "diag" ? "none" : "diag")}
          className={`btn-quest ${mode === "diag" ? "ring-4 ring-[#f6b935]" : ""}`}
        >
          ↗ 斜着看
        </button>
      </div>

      {/* 行/列选择条 */}
      <AnimatePresence mode="wait">
        {mode === "row" && (
          <motion.div key="row-bar" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-2 justify-center mb-4 flex-wrap">
            <span className="text-[#8a6a3a]">选第几行：</span>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((r) => (
              <button
                key={r}
                onClick={() => setRowIdx(r)}
                className={`w-9 h-9 rounded-full border-2 border-[#4a3416] font-bold shadow-[0_2px_0_#4a3416] ${
                  rowIdx === r ? "bg-gradient-to-b from-[#ffb3ce] to-[#ff93b5] text-[#6b2240]" : "bg-[#fffaf0] text-[#8a6a3a]"
                }`}
              >
                {r}
              </button>
            ))}
          </motion.div>
        )}
        {mode === "col" && (
          <motion.div key="col-bar" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-2 justify-center mb-4 flex-wrap">
            <span className="text-[#8a6a3a]">选第几列：</span>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((c) => (
              <button
                key={c}
                onClick={() => setColIdx(c)}
                className={`w-9 h-9 rounded-full border-2 border-[#4a3416] font-bold shadow-[0_2px_0_#4a3416] ${
                  colIdx === c ? "bg-gradient-to-b from-[#95e8b1] to-[#6bd18a] text-[#1f3d28]" : "bg-[#fffaf0] text-[#8a6a3a]"
                }`}
              >
                {c}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 百数表 */}
      <div className="paper-card p-3 sm:p-5 mb-4">
        <div className="grid grid-cols-10 gap-1 sm:gap-1.5">
          {cells.map((n) => {
            const hi = isHighlight(n);
            const cls = [
              "num-cell",
              hi === "row" ? "h-row" : "",
              hi === "col" ? "h-col" : "",
              hi === "diag-main" ? "h-diag" : "",
              hi === "diag-anti" ? "h-diag-pink" : "",
              picked === n ? "ring-4 ring-[#3d6fe0] z-10" : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <motion.button
                key={n}
                whileTap={{ scale: 0.85 }}
                onClick={() => clickCell(n)}
                className={cls}
                aria-label={`数字 ${n}`}
                animate={hi ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={{ duration: 0.6, repeat: hi ? Infinity : 0, repeatDelay: 1 }}
              >
                {n}
              </motion.button>
            );
          })}
        </div>

        {/* 提示 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tip}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 text-center text-[17px] text-[#4a3416]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="chip chip-blue !text-white mr-2">小提示</span>
            {tip}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 数字气泡 */}
      <AnimatePresence>
        {picked !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className="paper-card-soft p-4 mb-5 flex items-center gap-4 max-w-md mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#ffd166] to-[#f6b935] border-2 border-[#4a3416] flex items-center justify-center text-2xl font-bold text-[#4a3416] shadow-[0_3px_0_#4a3416]">
              {picked}
            </div>
            <div className="flex-1 text-[#4a3416]">
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#2a52b8" }}>
                {picked} 里面有
              </div>
              <div className="text-[17px]">
                <strong className="text-[#e89a18]">{Math.floor(picked / 10)}</strong> 个十 和{" "}
                <strong className="text-[#e89a18]">{picked % 10}</strong> 个一
              </div>
            </div>
            <button onClick={() => setPicked(null)} className="text-[#8a6a3a] text-sm underline">
              收起
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 完成按钮 */}
      <div className="text-center mb-3">
        {completed.explore ? (
          <Link href="/level1">
            <button className="btn-quest">
              进入第一关 <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        ) : exploredModes.size >= 3 ? (
          <button onClick={tryUnlock} className="btn-quest btn-blue">
            <CheckCircle2 className="w-5 h-5" /> 我发现啦，三种秘密都试过了！
          </button>
        ) : (
          <p className="text-[#8a6a3a]">
            三种"看法"都试一试吧（已尝试 {exploredModes.size} / 3 种）
          </p>
        )}
      </div>
    </PageShell>
  );
}
