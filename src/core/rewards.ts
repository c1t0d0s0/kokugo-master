import { addDays } from './date';

/** 今日のチャレンジの問題の数 */
export const DAILY_COUNT = 10;
/** 今日のチャレンジで 1 問正解するごとにもらえるポイント */
export const CORRECT_POINTS = 10;
/** 今日のチャレンジで全問正解したときに、さらにもらえるポイント */
export const PERFECT_POINTS = 50;
/** 7 日連続するたびにもらえるポイント */
export const WEEK_POINTS = 500;
/** その月の 1 日から末日まで、すべてスタンプがそろうともらえるポイント */
export const MONTH_POINTS = 3000;
export const WEEK_LENGTH = 7;

/** 今日のチャレンジの記録の id。正解の数を id に入れておく (daily-2026-11-10:8) */
export const dailyClearId = (date: string, correct: number) => `daily-${date}:${correct}`;

/** 今日のチャレンジを、その正解の数で終えたときのポイント */
export function scorePoints(correct: number): number {
  const n = Math.max(0, Math.min(DAILY_COUNT, Math.floor(correct)));
  return n * CORRECT_POINTS + (n === DAILY_COUNT ? PERFECT_POINTS : 0);
}

/**
 * やりとげた記録から、もらったポイントを計算する。
 * 今日のチャレンジは 1 日 1 回分だけ数える (2 台で同じ日に遊んで記録が 2 つあっても、いちばんよいほう)。
 * 練習 (unit-…) ではポイントはもらえない。
 */
export function clearsPoints(clears: readonly string[]): number {
  const best = new Map<string, number>();
  for (const id of clears) {
    const m = id.match(/^daily-(\d{4}-\d{2}-\d{2}):(\d+)$/);
    if (m) best.set(m[1], Math.max(best.get(m[1]) ?? 0, Number(m[2])));
  }
  let sum = 0;
  for (const n of best.values()) sum += scorePoints(n);
  return sum;
}

export interface Earned {
  /** 7 日連続を達成した回数 */
  weeks: number;
  /** スタンプがすべてそろった月 (YYYY-MM) */
  months: string[];
  total: number;
}

/** 重複をのぞいて日付順にならべる */
export function normalizeStamps(stamps: readonly string[]): string[] {
  return [...new Set(stamps.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)))].sort();
}

/** 連続する日のかたまりごとの日数 */
export function runLengths(stamps: readonly string[]): number[] {
  const days = normalizeStamps(stamps);
  const runs: number[] = [];
  days.forEach((day, i) => {
    if (i > 0 && addDays(days[i - 1], 1) === day) runs[runs.length - 1]++;
    else runs.push(1);
  });
  return runs;
}

export function daysInMonth(month: string): number {
  const [y, m] = month.split('-').map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/**
 * スタンプの日付から、これまでにもらったポイントを計算する。
 * 合計を保存せずに毎回ここで計算するので、二重にもらったり取りこぼしたりしない。
 */
export function earnedPoints(stamps: readonly string[]): Earned {
  const days = normalizeStamps(stamps);
  const weeks = runLengths(days).reduce((sum, len) => sum + Math.floor(len / WEEK_LENGTH), 0);
  const perMonth = new Map<string, number>();
  for (const day of days) perMonth.set(day.slice(0, 7), (perMonth.get(day.slice(0, 7)) ?? 0) + 1);
  const months = [...perMonth].filter(([month, count]) => count === daysInMonth(month)).map(([month]) => month);
  return { weeks, months, total: weeks * WEEK_POINTS + months.length * MONTH_POINTS };
}

/** date の日まで何日つづいているか (date にスタンプがなければ 0) */
export function runEndingAt(stamps: readonly string[], date: string): number {
  const set = new Set(stamps);
  let n = 0;
  for (let d = date; set.has(d); d = addDays(d, -1)) n++;
  return n;
}

/** 今つづいている日数。今日がまだでも、きのうまで続いていれば数える */
export function currentRun(stamps: readonly string[], today: string): number {
  return runEndingAt(stamps, today) || runEndingAt(stamps, addDays(today, -1));
}

/** その月の 1 日から順に、スタンプがあるかどうか */
export function monthView(stamps: readonly string[], month: string): boolean[] {
  const set = new Set(stamps);
  return Array.from({ length: daysInMonth(month) }, (_, i) => set.has(`${month}-${String(i + 1).padStart(2, '0')}`));
}

export interface StampReward {
  /** 新しくスタンプが押されたか (同じ日の 2 回目は false) */
  added: boolean;
  /** この日まで何日つづいているか */
  run: number;
  weekPoints: number;
  monthPoints: number;
}

/** date にスタンプを足したとき、新しくもらえるポイント */
export function rewardFor(before: readonly string[], date: string): StampReward {
  const added = !before.includes(date);
  const after = added ? [...before, date] : before;
  const a = earnedPoints(before);
  const b = earnedPoints(after);
  return {
    added,
    run: runEndingAt(after, date),
    weekPoints: (b.weeks - a.weeks) * WEEK_POINTS,
    monthPoints: (b.months.length - a.months.length) * MONTH_POINTS,
  };
}
