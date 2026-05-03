export type QuestKey = "intro" | "explore" | "level1" | "level2" | "level3" | "ending";

export const QUEST_LIST: { key: QuestKey; label: string; sub: string; color: string }[] = [
  { key: "intro", label: "出发", sub: "数学王国", color: "chip-gold" },
  { key: "explore", label: "认识百数表", sub: "横竖斜找规律", color: "chip-blue" },
  { key: "level1", label: "第一关", sub: "解密百数表", color: "chip-pink" },
  { key: "level2", label: "第二关", sub: "玩转小金币", color: "chip-green" },
  { key: "level3", label: "第三关", sub: "金币大作战", color: "chip-gold" },
  { key: "ending", label: "凯旋", sub: "言有序 思有章", color: "chip-blue" },
];
