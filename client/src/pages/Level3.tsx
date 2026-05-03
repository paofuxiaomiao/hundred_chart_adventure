/**
 * 第三关 · 金币大作战
 * - 4 枚带编号的金币（1/2/3/4），一次拿 2 枚
 * - 玩家依次组合，系统记录所有不重复的组合，目标找到全部 6 种
 * - 鼓励"按顺序拿"以做到不重复、不遗漏
 */
import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/PageShell";
import SparkleBurst from "@/components/SparkleBurst";
import { ASSETS } from "@/lib/assets";
import { useProgress } from "@/contexts/ProgressContext";
import { ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { sound } from "@/lib/sound";

const COIN_IMG: Record<number, string> = {
  1: ASSETS.coinGold,
  2: ASSETS.coinBlue,
  3: ASSETS.coinPink,
  4: ASSETS.coinCyan,
};

const ALL_PAIRS: [number, number][] = [
  [1, 2], [1, 3], [1, 4],
  [2, 3], [2, 4],
  [3, 4],
];

function pairKey(a: number, b: number) {
  const [x, y] = a < b ? [a, b] : [b, a];
  return `${x}-${y}`;
}

export default function Level3() {
  const [picks, setPicks] = useState<number[]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [lastMsg, setLastMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [burst, setBurst] = useState(0);
  const { markComplete, addCoins, completed } = useProgress();

  function pick(n: number) {
    setLastMsg(null);
    sound.tap();
    setPicks((p) => {
      if (p.includes(n)) {
        // 取消选择
        return p.filter((x) => x !== n);
      }
      if (p.length === 1) {
        // 凑成一对
        const newPair = [p[0], n];
        const k = pairKey(p[0], n);
        setTimeout(() => {
          if (found.has(k)) {
            setLastMsg({ ok: false, text: `${p[0]} 和 ${n} 这一组已经拿过啦，再试一组没拿过的吧！` });
            sound.bad();
          } else {
            const next = new Set(found);
            next.add(k);
            setFound(next);
            setBurst((b) => b + 1);
            sound.good();
            setLastMsg({
              ok: true,
              text: `太棒了！${p[0]} 和 ${n} 是一种新的拿法，已经找到 ${next.size} / 6 种。`,
            });
          }
          setPicks([]);
        }, 350);
        return newPair;
      }
      if (p.length >= 2) return [n];
      return [...p, n];
    });
  }

  function resetPicks() {
    setPicks([]);
    setFound(new Set());
    setLastMsg(null);
  }

  function tryComplete() {
    if (completed.level3) return;
    addCoins(10);
    markComplete("level3");
    setBurst((b) => b + 1);
    sound.win();
  }

  const allDone = found.size >= 6;

  return (
    <PageShell current="level3">
      <SparkleBurst trigger={burst} />

      {/* 国王对话 */}
      <div className="flex items-start gap-4 mb-5">
        <img src={ASSETS.king} alt="国王" className="w-24 sm:w-28 shrink-0 king-breath drop-shadow-lg" />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="king-bubble flex-1">
          这里有 <strong className="text-[#e89a18]">4 枚金币</strong>（1、2、3、4），
          一次只能拿 <strong className="text-[#3d6fe0]">2 枚</strong>。
          要按顺序拿，<strong className="text-[#d9648a]">不重复、不遗漏</strong>哦！
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* 左：金币 + 当前选择 */}
        <div className="paper-card p-6 space-y-5">
          <h3 className="text-2xl text-center">点两枚金币组成一对</h3>

          {/* 4 枚金币 */}
          <div className="grid grid-cols-4 gap-3 sm:gap-5">
            {[1, 2, 3, 4].map((n) => {
              const sel = picks.includes(n);
              return (
                <motion.button
                  key={n}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => pick(n)}
                  className={`relative paper-card-soft p-3 flex flex-col items-center ${
                    sel ? "ring-4 ring-[#3d6fe0]" : ""
                  }`}
                  animate={sel ? { y: -10 } : { y: 0 }}
                >
                  <img src={COIN_IMG[n]} alt={`金币 ${n}`} className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md" />
                  <div
                    className="absolute top-1 right-1 w-7 h-7 rounded-full bg-[#fff] border-2 border-[#4a3416] text-sm flex items-center justify-center font-bold shadow-[0_2px_0_#4a3416]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {n}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* 当前选择 */}
          <div className="flex items-center justify-center gap-3 paper-card-soft p-3">
            <span className="text-[#8a6a3a]">当前组合：</span>
            {[0, 1].map((i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-full border-[3px] border-[#4a3416] flex items-center justify-center text-xl font-bold shadow-[0_3px_0_#4a3416] ${
                  picks[i] !== undefined
                    ? "bg-gradient-to-b from-[#ffd166] to-[#f6b935] text-[#4a3416]"
                    : "bg-[#f0d8a8] text-[#a07a3a]"
                }`}
              >
                {picks[i] ?? "?"}
              </div>
            ))}
          </div>

          {/* 反馈 */}
          <AnimatePresence>
            {lastMsg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`paper-card-soft p-3 text-center ${lastMsg.ok ? "" : "wiggle"}`}
                style={{ background: lastMsg.ok ? "#eaf8ee" : "#fff2d4" }}
              >
                <span className="text-2xl mr-2">{lastMsg.ok ? "🎉" : "🤔"}</span>
                <span className="text-[#4a3416]">{lastMsg.text}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 右：成就墙 */}
        <div className="paper-card p-5 space-y-3">
          <h3 className="text-2xl text-center">已找到的拿法</h3>
          <div className="space-y-2">
            {ALL_PAIRS.map(([a, b]) => {
              const k = pairKey(a, b);
              const got = found.has(k);
              return (
                <motion.div
                  key={k}
                  initial={false}
                  animate={got ? { scale: [1, 1.06, 1] } : {}}
                  className={`flex items-center justify-between p-2 rounded-xl border-2 ${
                    got
                      ? "border-[#2f7a48] bg-[#eaf8ee]"
                      : "border-[#d9b878] bg-[#fffaf0]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img src={COIN_IMG[a]} alt="" className={`w-8 h-8 ${got ? "" : "grayscale opacity-50"}`} />
                    <span className="text-xl text-[#8a6a3a]">+</span>
                    <img src={COIN_IMG[b]} alt="" className={`w-8 h-8 ${got ? "" : "grayscale opacity-50"}`} />
                    <span className="font-bold text-[#4a3416] ml-2">
                      {a} + {b}
                    </span>
                  </div>
                  <span className="text-xl">{got ? "✅" : "·"}</span>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center text-sm text-[#8a6a3a]">
            进度：{found.size} / {ALL_PAIRS.length}
          </div>
          <button onClick={resetPicks} className="btn-quest btn-pink !text-[#4a3416] !text-sm !py-2 !px-4 w-full">
            <RotateCcw className="w-4 h-4" /> 重新挑战
          </button>
        </div>
      </div>

      {/* 通关 */}
      <div className="text-center mt-6">
        {allDone && !completed.level3 ? (
          <button onClick={tryComplete} className="btn-quest btn-green !text-[#1f3d28]">
            <CheckCircle2 className="w-5 h-5" /> 全部 6 种都找到了，过关！
          </button>
        ) : completed.level3 ? (
          <Link href="/ending">
            <button className="btn-quest">
              凯旋归来 <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        ) : null}
      </div>
    </PageShell>
  );
}
