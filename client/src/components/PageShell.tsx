import { Link } from "wouter";
import { ASSETS } from "@/lib/assets";
import { QUEST_LIST, type QuestKey } from "@/lib/quest";
import { useProgress } from "@/contexts/ProgressContext";
import { Coins, Home as HomeIcon, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { sound } from "@/lib/sound";

export default function PageShell({
  current,
  children,
}: {
  current: QuestKey;
  children: React.ReactNode;
}) {
  const { completed, coins } = useProgress();
  const idx = QUEST_LIST.findIndex((q) => q.key === current);
  const [muted, setMuted] = useState(sound.isMuted());

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部条 */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#fff6e1cc] border-b-2 border-[#d9b878]">
        <div className="max-w-6xl mx-auto px-3 sm:px-5 py-3 flex items-center gap-3">
          <Link href="/">
            <button
              className="chip chip-blue !text-white"
              aria-label="返回数学王国"
            >
              <HomeIcon className="w-4 h-4" /> 王国
            </button>
          </Link>
          {/* 进度宝石 */}
          <div className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto">
            {QUEST_LIST.map((q, i) => {
              const done = completed[q.key];
              const isCur = q.key === current;
              return (
                <div key={q.key} className="flex items-center gap-1.5">
                  <motion.div
                    initial={false}
                    animate={isCur ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                    transition={{ duration: 1.2, repeat: isCur ? Infinity : 0 }}
                    className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 border-[#4a3416] flex items-center justify-center font-bold text-sm shadow-[0_3px_0_#4a3416] ${
                      done
                        ? "bg-gradient-to-b from-[#ffd166] to-[#f6b935] text-[#4a3416]"
                        : isCur
                        ? "bg-gradient-to-b from-[#6f96ff] to-[#3d6fe0] text-white"
                        : "bg-[#f0d8a8] text-[#8a6a3a]"
                    }`}
                    title={q.label + " · " + q.sub}
                  >
                    {done ? "★" : i + 1}
                  </motion.div>
                  {i < QUEST_LIST.length - 1 && (
                    <div className="w-3 sm:w-5 h-1 rounded-full bg-[#e7c98a]" />
                  )}
                </div>
              );
            })}
          </div>
          {/* 静音 */}
          <button
            onClick={() => {
              const next = !muted;
              setMuted(next);
              sound.setMuted(next);
              if (!next) sound.tap();
            }}
            className="chip"
            aria-label={muted ? "打开声音" : "关闭声音"}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          {/* 金币计数 */}
          <div className="chip chip-gold">
            <Coins className="w-4 h-4" />
            <span className="font-bold">{coins}</span>
          </div>
        </div>
        {/* 当前关卡标题条 */}
        {idx >= 0 && (
          <div className="max-w-6xl mx-auto px-5 pb-3 flex items-center gap-3">
            <img src={ASSETS.king} alt="国王" className="w-10 h-10 rounded-full border-2 border-[#4a3416] bg-[#fffaf0] object-contain" />
            <div className="text-[#2a52b8]" style={{ fontFamily: "var(--font-display)" }}>
              <span className="text-base text-[#8a6a3a]">第 {idx + 1} 站 ·</span>{" "}
              <span className="text-2xl">{QUEST_LIST[idx].label}</span>
              <span className="text-base text-[#8a6a3a]"> · {QUEST_LIST[idx].sub}</span>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6">{children}</main>

      <footer className="text-center text-[#8a6a3a] text-sm py-4 opacity-80">
        数学王国 · 玩转百数表 · 第 {idx + 1} / {QUEST_LIST.length} 站
      </footer>
    </div>
  );
}
