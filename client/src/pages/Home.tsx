/**
 * 设计：童话绘本闯关地图首页
 * - 左侧国王形象 + 右侧标题与"开始冒险"按钮
 * - 底部关卡地图：5 个宝石路径，已通关亮金，未通关灰色
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ASSETS } from "@/lib/assets";
import { QUEST_LIST } from "@/lib/quest";
import { useProgress } from "@/contexts/ProgressContext";
import { Sparkles, RotateCcw, Crown } from "lucide-react";

const PATH_FOR: Record<string, string> = {
  intro: "/explore",
  explore: "/explore",
  level1: "/level1",
  level2: "/level2",
  level3: "/level3",
  ending: "/ending",
};

export default function Home() {
  const { completed, coins, reset } = useProgress();
  const doneCount = Object.values(completed).filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部条 */}
      <header className="px-5 py-4 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="chip chip-blue !text-white">
          <Crown className="w-4 h-4" /> 数学王国
        </div>
        <div className="flex items-center gap-2">
          <div className="chip chip-gold">★ 已闯 {doneCount} / {QUEST_LIST.length} 站</div>
          <div className="chip">金币 {coins}</div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto w-full px-5 py-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* 左侧国王 */}
        <div className="relative flex justify-center">
          {/* 漂浮气球点缀 */}
          <motion.div
            className="absolute -top-2 left-2 text-3xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            aria-hidden
          >🎈</motion.div>
          <motion.div
            className="absolute top-10 right-2 text-3xl"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, delay: 0.4 }}
            aria-hidden
          >✨</motion.div>
          <motion.img
            src={ASSETS.king}
            alt="国王"
            className="w-72 sm:w-96 drop-shadow-[0_20px_30px_rgba(74,52,22,0.25)] king-breath"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          />
        </div>

        {/* 右侧文案 */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p
              className="inline-block text-lg text-[#8a6a3a] mb-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              一年级数学 · 互动小课堂
            </p>
            <h1
              className="text-5xl sm:text-6xl leading-tight mb-3"
              style={{ fontFamily: "var(--font-display)", color: "#2a52b8" }}
            >
              玩转百数表
            </h1>
            <p
              className="text-2xl mb-5"
              style={{ fontFamily: "var(--font-display)", color: "#e89a18" }}
            >
              数学王国大冒险
            </p>
            <p className="text-[17px] text-[#4a3416] leading-7 mb-6">
              数学王国的国王邀请小朋友们一起，
              <br className="hidden sm:block" />
              在百数表里寻找数字的秘密，
              一关一关闯过去吧！
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/explore">
                <button className="btn-quest">
                  <Sparkles className="w-5 h-5" /> 开始冒险
                </button>
              </Link>
              <button onClick={reset} className="btn-quest btn-pink !text-[#4a3416]">
                <RotateCcw className="w-5 h-5" /> 重新挑战
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 闯关地图 */}
      <section className="max-w-6xl mx-auto w-full px-5 py-8">
        <div className="paper-card p-5 sm:p-7">
          <h2
            className="text-3xl mb-4 flex items-center gap-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span>🗺️</span> 闯关地图
          </h2>

          <div className="relative">
            {/* 蜿蜒路径 */}
            <svg viewBox="0 0 1000 160" className="w-full h-auto" preserveAspectRatio="none">
              <path
                d="M 40 110 C 180 30, 280 180, 420 90 S 700 20, 840 110 S 960 80, 980 80"
                fill="none"
                stroke="#e89a18"
                strokeWidth="6"
                strokeDasharray="2 14"
                strokeLinecap="round"
              />
            </svg>

            {/* 关卡宝石 */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 -mt-4">
              {QUEST_LIST.map((q, i) => {
                const done = completed[q.key];
                const href = PATH_FOR[q.key];
                return (
                  <Link key={q.key} href={href}>
                    <motion.div
                      whileHover={{ y: -6, scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="paper-card-soft p-3 text-center cursor-pointer"
                    >
                      <div
                        className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center text-xl border-[3px] border-[#4a3416] shadow-[0_4px_0_#4a3416] ${
                          done
                            ? "bg-gradient-to-b from-[#ffd166] to-[#f6b935] text-[#4a3416]"
                            : "bg-gradient-to-b from-[#cfe1ff] to-[#9bb8ff] text-white"
                        }`}
                      >
                        {done ? "★" : i + 1}
                      </div>
                      <div
                        className="mt-2 text-lg"
                        style={{ fontFamily: "var(--font-display)", color: "#2a52b8" }}
                      >
                        {q.label}
                      </div>
                      <div className="text-xs text-[#8a6a3a]">{q.sub}</div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center text-[#8a6a3a] text-sm py-4 opacity-80">
        © 数学王国 · 一年级互动课堂
      </footer>
    </div>
  );
}
