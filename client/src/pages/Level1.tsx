/**
 * 第一关 · 解密百数表
 * - 屏幕中显示一列：1, 11, 21, 31, ..., 91
 * - 学生选两个数字，点击不同"问题卡"（多一些/少一些/多得多/少得多/数的组成）
 * - 系统给出正确反馈
 */
import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/PageShell";
import SparkleBurst from "@/components/SparkleBurst";
import { ASSETS } from "@/lib/assets";
import { useProgress } from "@/contexts/ProgressContext";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { sound } from "@/lib/sound";

const COLUMN = [1, 11, 21, 31, 41, 51, 61, 71, 81, 91];

type QType = "more_a_little" | "less_a_little" | "more_a_lot" | "less_a_lot" | "compose";

const QUESTIONS: { key: QType; label: string; emoji: string; cls: string }[] = [
  { key: "more_a_little", label: "比一比 · 多一些", emoji: "🔼", cls: "btn-pink !text-[#4a3416]" },
  { key: "less_a_little", label: "比一比 · 少一些", emoji: "🔽", cls: "btn-green !text-[#1f3d28]" },
  { key: "more_a_lot", label: "比一比 · 多得多", emoji: "⏫", cls: "btn-pink !text-[#4a3416]" },
  { key: "less_a_lot", label: "比一比 · 少得多", emoji: "⏬", cls: "btn-green !text-[#1f3d28]" },
  { key: "compose", label: "数的组成", emoji: "🧩", cls: "btn-blue" },
];

function describe(qtype: QType, a: number, b: number): { ok: boolean; text: string } {
  if (qtype === "compose") {
    return {
      ok: true,
      text: `${a} 里面有 ${Math.floor(a / 10)} 个十和 ${a % 10} 个一；${b} 里面有 ${Math.floor(b / 10)} 个十和 ${b % 10} 个一。`,
    };
  }
  const diff = a - b; // 正：a 大
  const abs = Math.abs(diff);
  switch (qtype) {
    case "more_a_little":
      return diff > 0 && abs <= 20
        ? { ok: true, text: `${a} 比 ${b} 多一些（多 ${abs}）。` }
        : { ok: false, text: `不太对哦，再选两个相近的数试试。` };
    case "less_a_little":
      return diff < 0 && abs <= 20
        ? { ok: true, text: `${a} 比 ${b} 少一些（少 ${abs}）。` }
        : { ok: false, text: `不太对哦，再选两个相近的数试试。` };
    case "more_a_lot":
      return diff > 0 && abs >= 40
        ? { ok: true, text: `${a} 比 ${b} 多得多（多 ${abs}）！` }
        : { ok: false, text: `差距还不够大，要选差距很大的两个数哦。` };
    case "less_a_lot":
      return diff < 0 && abs >= 40
        ? { ok: true, text: `${a} 比 ${b} 少得多（少 ${abs}）！` }
        : { ok: false, text: `差距还不够大，要选差距很大的两个数哦。` };
  }
}

export default function Level1() {
  const [picks, setPicks] = useState<number[]>([]);
  const [qtype, setQType] = useState<QType | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [solvedCount, setSolvedCount] = useState(0);
  const [burst, setBurst] = useState(0);
  const { markComplete, addCoins, completed } = useProgress();

  function pick(n: number) {
    setFeedback(null);
    sound.tap();
    setPicks((p) => {
      if (p.includes(n)) return p.filter((x) => x !== n);
      if (p.length >= 2) return [p[1], n];
      return [...p, n];
    });
  }

  function ask(q: QType) {
    setQType(q);
    if (picks.length < 2) {
      setFeedback({ ok: false, text: "先在数字列里点两个数字哦～" });
      return;
    }
    const [a, b] = picks;
    const r = describe(q, a, b);
    setFeedback(r);
    if (r.ok) {
      setSolvedCount((c) => c + 1);
      setBurst((x) => x + 1);
      sound.good();
    } else {
      sound.bad();
    }
  }

  function tryComplete() {
    if (completed.level1) return;
    addCoins(5);
    markComplete("level1");
    setBurst((b) => b + 1);
    sound.win();
  }

  return (
    <PageShell current="level1">
      <SparkleBurst trigger={burst} />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* 左：数字列 */}
        <div className="paper-card p-4">
          <h3 className="text-2xl mb-3 text-center">数字列</h3>
          <div className="flex flex-col gap-2">
            {COLUMN.map((n) => {
              const sel = picks.includes(n);
              const order = picks.indexOf(n);
              return (
                <motion.button
                  key={n}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => pick(n)}
                  className={`relative h-12 rounded-xl border-[3px] border-[#4a3416] font-bold text-xl shadow-[0_3px_0_#4a3416] transition ${
                    sel
                      ? "bg-gradient-to-b from-[#6f96ff] to-[#3d6fe0] text-white"
                      : "bg-[#fffaf0] text-[#4a3416]"
                  }`}
                >
                  {n}
                  {sel && (
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#f6b935] border-2 border-[#4a3416] text-sm flex items-center justify-center shadow-[0_2px_0_#4a3416]">
                      {order + 1}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-[#8a6a3a] text-center">点两个数字来比一比</p>
        </div>

        {/* 右：问答区 */}
        <div className="space-y-5">
          {/* 国王提问 */}
          <div className="flex items-start gap-4">
            <img src={ASSETS.king} alt="国王" className="w-24 sm:w-28 shrink-0 king-breath drop-shadow-lg" />
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="king-bubble flex-1">
              结合我们之前学过的知识，
              <strong className="text-[#3d6fe0]">你能提出哪些问题</strong>呢？
              选两个数字，再点下面的问题卡片吧！
            </motion.div>
          </div>

          {/* 当前选择 */}
          <div className="paper-card-soft p-3 flex items-center gap-3 justify-center">
            <span className="text-[#8a6a3a]">你选了：</span>
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

          {/* 问题卡 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {QUESTIONS.map((q) => (
              <button
                key={q.key}
                onClick={() => ask(q.key)}
                className={`btn-quest ${q.cls} !text-base !py-3`}
              >
                <span>{q.emoji}</span> {q.label}
              </button>
            ))}
          </div>

          {/* 回答区 */}
          <AnimatePresence mode="wait">
            {feedback && (
              <motion.div
                key={feedback.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`paper-card p-4 flex items-start gap-3 ${
                  feedback.ok ? "border-[#2f7a48] !shadow-[0_5px_0_#2f7a48]" : "border-[#b3506e] !shadow-[0_5px_0_#b3506e]"
                }`}
                style={{ background: feedback.ok ? "#eaf8ee" : "#ffeaea" }}
              >
                <div className="text-3xl">{feedback.ok ? "🎉" : "🤔"}</div>
                <div className="flex-1">
                  <div className="text-[17px] text-[#4a3416] leading-7">{feedback.text}</div>
                  {qtype === "compose" && picks.length === 2 && (
                    <div className="mt-2 text-sm text-[#8a6a3a]">数的组成可以帮我们看清每个数字的"骨架"。</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 通关 */}
          <div className="text-center pt-2">
            {solvedCount >= 2 && !completed.level1 ? (
              <button onClick={tryComplete} className="btn-quest btn-blue">
                <CheckCircle2 className="w-5 h-5" /> 我答对了 {solvedCount} 题，过关！
              </button>
            ) : completed.level1 ? (
              <Link href="/level2">
                <button className="btn-quest">
                  进入第二关 <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            ) : (
              <p className="text-[#8a6a3a]">答对 2 题就可以过关啦（已答对 {solvedCount} 题）</p>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
