/**
 * 第二关 · 玩转小金币
 * - 顶部滑杆：选择圆片数量（0~18）
 * - 下方两个"位"框：十位 / 个位，点击金币区将金币"放入"框
 * - 实时显示组成的数；并在 0~99 百数表上高亮所有可能组合
 */
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/PageShell";
import SparkleBurst from "@/components/SparkleBurst";
import { ASSETS } from "@/lib/assets";
import { useProgress } from "@/contexts/ProgressContext";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { sound } from "@/lib/sound";

// 计算给定 total 圆片，能组成的所有 (十位, 个位) 对（十位 0~9，个位 0~9，总和 = total）
function combosFor(total: number) {
  const arr: { tens: number; ones: number; value: number }[] = [];
  for (let t = 0; t <= 9; t++) {
    const o = total - t;
    if (o >= 0 && o <= 9) arr.push({ tens: t, ones: o, value: t * 10 + o });
  }
  return arr;
}

export default function Level2() {
  const [total, setTotal] = useState(4);
  const [tens, setTens] = useState(0);
  const [discoveredTotals, setDiscoveredTotals] = useState<Set<number>>(new Set());
  const [burst, setBurst] = useState(0);
  const { markComplete, addCoins, completed } = useProgress();

  const ones = total - tens;
  const valid = ones >= 0 && ones <= 9 && tens >= 0 && tens <= 9;
  const value = valid ? tens * 10 + ones : null;

  const allCombos = useMemo(() => combosFor(total), [total]);
  const highlightSet = useMemo(() => new Set(allCombos.map((c) => c.value)), [allCombos]);

  function changeTotal(t: number) {
    setTotal(t);
    setTens(Math.min(9, Math.max(0, Math.min(t, tens))));
    setDiscoveredTotals((s) => new Set(s).add(t));
    sound.coin();
  }

  function tryComplete() {
    if (completed.level2) return;
    addCoins(8);
    markComplete("level2");
    setBurst((b) => b + 1);
    sound.win();
  }

  return (
    <PageShell current="level2">
      <SparkleBurst trigger={burst} />

      {/* 国王对话 */}
      <div className="flex items-start gap-4 mb-5">
        <img src={ASSETS.king} alt="国王" className="w-24 sm:w-28 shrink-0 king-breath drop-shadow-lg" />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="king-bubble flex-1">
          这里有 <strong className="text-[#e89a18]">小金币</strong>。
          先选一个金币数量，再分别放进<strong className="text-[#3d6fe0]">十位</strong>和<strong className="text-[#3d6fe0]">个位</strong>，
          看看能摆出多少个不同的数？
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左：操作区 */}
        <div className="paper-card p-5 space-y-5">
          {/* 选金币数 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl">① 选金币数量</h3>
              <span className="chip chip-gold">{total} 枚</span>
            </div>
            <div className="grid grid-cols-10 gap-1.5">
              {Array.from({ length: 19 }, (_, i) => i).map((n) => (
                <button
                  key={n}
                  onClick={() => changeTotal(n)}
                  className={`h-10 rounded-lg border-2 border-[#4a3416] font-bold text-sm shadow-[0_2px_0_#4a3416] ${
                    n === total
                      ? "bg-gradient-to-b from-[#ffd166] to-[#f6b935] text-[#4a3416]"
                      : "bg-[#fffaf0] text-[#8a6a3a]"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-xs text-[#8a6a3a] mt-2">提示：金币数 0~9 时能摆 (个数+1) 种；超过 18 摆不出哦。</p>
          </div>

          {/* 十位 / 个位 */}
          <div>
            <h3 className="text-2xl mb-2">② 把金币分到十位 / 个位</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* 十位 */}
              <div className="paper-card-soft p-3">
                <div className="text-center text-[#3d6fe0]" style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>
                  十位
                </div>
                <div className="min-h-[120px] flex flex-wrap content-start gap-1 p-2">
                  <AnimatePresence>
                    {Array.from({ length: tens }).map((_, i) => (
                      <motion.img
                        key={i}
                        src={ASSETS.coinGold}
                        alt="金币"
                        className="w-9 h-9"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 320, damping: 18 }}
                      />
                    ))}
                  </AnimatePresence>
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setTens(Math.max(0, tens - 1))}
                    className="w-9 h-9 rounded-full bg-[#ff93b5] border-2 border-[#4a3416] text-xl font-bold shadow-[0_2px_0_#4a3416]"
                  >
                    −
                  </button>
                  <span className="text-2xl font-bold text-[#2a52b8] w-8 text-center" style={{ fontFamily: "var(--font-display)" }}>
                    {tens}
                  </span>
                  <button
                    onClick={() => setTens(Math.min(9, Math.min(total, tens + 1)))}
                    className="w-9 h-9 rounded-full bg-[#6bd18a] border-2 border-[#4a3416] text-xl font-bold shadow-[0_2px_0_#4a3416]"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* 个位 */}
              <div className="paper-card-soft p-3">
                <div className="text-center text-[#e89a18]" style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>
                  个位
                </div>
                <div className="min-h-[120px] flex flex-wrap content-start gap-1 p-2">
                  <AnimatePresence>
                    {Array.from({ length: Math.max(0, ones) }).map((_, i) => (
                      <motion.img
                        key={i}
                        src={ASSETS.coinGold}
                        alt="金币"
                        className="w-9 h-9"
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 320, damping: 18 }}
                      />
                    ))}
                  </AnimatePresence>
                </div>
                <div className="text-center text-2xl font-bold text-[#2a52b8]" style={{ fontFamily: "var(--font-display)" }}>
                  {Math.max(0, ones)}
                </div>
              </div>
            </div>
          </div>

          {/* 显示组成的数 */}
          <div className="text-center paper-card-soft p-3">
            <div className="text-[#8a6a3a]">组成的数：</div>
            <div className="text-5xl mt-1" style={{ fontFamily: "var(--font-display)", color: "#e89a18" }}>
              {value !== null ? value : "—"}
            </div>
            <div className="text-sm text-[#8a6a3a] mt-1">
              {valid ? `${tens} 个十 + ${ones} 个一 = ${value}` : "金币太多啦，超过 9 颗放不下哦"}
            </div>
          </div>
        </div>

        {/* 右：百数表 + 所有组合 */}
        <div className="space-y-5">
          <div className="paper-card p-4">
            <h3 className="text-2xl mb-2 flex items-center gap-2">
              <Sparkles className="text-[#f6b935]" /> 百数表上的发现
            </h3>
            <p className="text-sm text-[#8a6a3a] mb-3">
              用 <strong>{total}</strong> 颗金币能摆出 <strong>{allCombos.length}</strong> 个数：
              <span className="ml-2">
                {allCombos.map((c) => (
                  <span key={c.value} className="inline-block mx-0.5 px-1.5 py-0.5 rounded bg-[#ffe39a] text-[#4a3416] text-xs font-bold">
                    {c.value}
                  </span>
                ))}
              </span>
            </p>
            <div className="grid grid-cols-10 gap-1">
              {Array.from({ length: 100 }, (_, i) => i).map((n) => {
                const isCur = n === value;
                const isHi = highlightSet.has(n);
                return (
                  <div
                    key={n}
                    className={`aspect-square rounded-md border-2 flex items-center justify-center text-[10px] sm:text-xs font-bold ${
                      isCur
                        ? "bg-[#3d6fe0] text-white border-[#1c3d8a] scale-110 shadow-lg"
                        : isHi
                        ? "bg-gradient-to-b from-[#ffd166] to-[#f6b935] border-[#b07300] text-[#4a3416]"
                        : "bg-[#fffaf0] border-[#e7c98a] text-[#8a6a3a]"
                    }`}
                  >
                    {n}
                  </div>
                );
              })}
            </div>
            <p className="text-center mt-3 text-[15px] text-[#4a3416]">
              <strong className="text-[#3d6fe0]">发现：</strong>
              从左上到右下，每斜着的一排都是用同一种圆片数量摆的！
            </p>
          </div>

          {/* 通关 */}
          <div className="text-center">
            {discoveredTotals.size >= 3 && !completed.level2 ? (
              <button onClick={tryComplete} className="btn-quest btn-green !text-[#1f3d28]">
                <CheckCircle2 className="w-5 h-5" /> 我发现规律啦，过关！
              </button>
            ) : completed.level2 ? (
              <Link href="/level3">
                <button className="btn-quest">
                  进入第三关 <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            ) : (
              <p className="text-[#8a6a3a]">
                试一试不同的金币数量吧（已尝试 {discoveredTotals.size} / 3 种）
              </p>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
