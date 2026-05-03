/**
 * 简单的合成音效——无需外部资源，靠 Web Audio API 合成短音符。
 * - tap: 轻点击
 * - good: 答对（上行三音符）
 * - bad: 答错（下行两音符）
 * - win: 通关（C 大调五音符）
 * 用户首次交互后才能播放（浏览器策略），所以 ensureCtx 在每次播放前调用。
 */
let ctx: AudioContext | null = null;
let muted = false;

function ensureCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq: number, dur: number, when = 0, type: OscillatorType = "sine", gain = 0.18) {
  const c = ensureCtx();
  if (!c || muted) return;
  const t = c.currentTime + when;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sound = {
  setMuted(v: boolean) {
    muted = v;
  },
  isMuted() {
    return muted;
  },
  tap() {
    tone(660, 0.08, 0, "triangle", 0.14);
  },
  good() {
    tone(523.25, 0.12, 0, "triangle", 0.16); // C5
    tone(659.25, 0.12, 0.1, "triangle", 0.16); // E5
    tone(783.99, 0.18, 0.2, "triangle", 0.18); // G5
  },
  bad() {
    tone(330, 0.15, 0, "sine", 0.12);
    tone(220, 0.2, 0.1, "sine", 0.12);
  },
  win() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => tone(f, 0.18, i * 0.12, "triangle", 0.18));
    tone(1318.51, 0.4, 0.55, "triangle", 0.2);
  },
  coin() {
    tone(987.77, 0.08, 0, "square", 0.1);
    tone(1318.51, 0.12, 0.06, "square", 0.1);
  },
};
