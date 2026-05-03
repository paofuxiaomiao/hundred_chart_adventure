/**
 * 结业页 · 言有序 思有章
 * - 古代书生形象 + 总结金句
 * - 闯关勋章墙：展示已通关数量
 * - "再玩一次"按钮重置进度
 */
import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import SparkleBurst from "@/components/SparkleBurst";
import { ASSETS } from "@/lib/assets";
import { QUEST_LIST } from "@/lib/quest";
import { useProgress } from "@/contexts/ProgressContext";
import { useState } from "react";
import { Home as HomeIcon, RotateCcw } from "lucide-react";
import { sound } from "@/lib/sound";

export default function Ending() {
  const { completed, coins, markComplete, reset } = useProgress();
  const doneCount = Object.values(completed).filter(Boolean).length;
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (!completed.ending) {
      markComplete("ending");
      setBurst((b) => b + 1);
      sound.win();
    }
  }, [completed.ending, markComplete]);

  return (
    <PageShell current="ending">
      <SparkleBurst trigger={burst} />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6 items-start">
        {/* 左：书生 + 金句 */}
        <div className="paper-card p-6 sm:p-8 text-center">
          <motion.img
            src={ASSETS.scholar}
            alt="古代学者"
            className="w-48 sm:w-56 mx-auto mb-3 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          />
          <h2 className="text-4xl sm:text-5xl mb-2" style={{ fontFamily: "var(--font-display)", color: "#2a52b8" }}>
            言有序 · 思有章
          </h2>
          <p className="text-[#8a6a3a] mb-4">说话要有顺序 · 思考要有条理</p>

          <div className="paper-card-soft p-4 max-w-xl mx-auto text-left text-[#4a3416] text-[16px] leading-7">
            今天我们在百数表里找规律，
            还玩了金币组合的小游戏，
            都用到了<strong className="text-[#3d6fe0]">"有序思考"</strong>的好办法。
            希望小朋友们以后在生活里，
            也能做一个<strong className="text-[#e89a18]">有条理、爱思考</strong>的好孩子！
          </div>

          <div className="mt-5 flex flex-wrap gap-3 justify-center">
            <Link href="/">
              <button className="btn-quest btn-blue">
                <HomeIcon className="w-5 h-5" /> 返回王国
              </button>
            </Link>
            <button
              onClick={() => {
                reset();
                location.href = "/";
              }}
              className="btn-quest btn-pink !text-[#4a3416]"
            >
              <RotateCcw className="w-5 h-5" /> 再玩一次
            </button>
          </div>
        </div>

        {/* 右：勋章墙 */}
        <div className="paper-card p-5 space-y-3">
          <h3 className="text-2xl text-center mb-1">勋章墙</h3>
          <div className="text-center text-[#8a6a3a] mb-2">
            已通关 <strong className="text-[#e89a18]">{doneCount}</strong> / {QUEST_LIST.length} 关 · 收获{" "}
            <strong className="text-[#e89a18]">{coins}</strong> 金币
          </div>
          <div className="grid grid-cols-3 gap-3">
            {QUEST_LIST.map((q) => {
              const done = completed[q.key];
              return (
                <motion.div
                  key={q.key}
                  whileHover={{ y: -4, scale: 1.04 }}
                  className="paper-card-soft p-3 text-center relative overflow-hidden"
                >
                  <img
                    src={ASSETS.badge}
                    alt="勋章"
                    className={`w-16 h-16 mx-auto ${done ? "drop-shadow-lg" : "grayscale opacity-40"}`}
                  />
                  <div
                    className="mt-1 text-base"
                    style={{ fontFamily: "var(--font-display)", color: done ? "#2a52b8" : "#a07a3a" }}
                  >
                    {q.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
