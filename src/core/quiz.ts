import { DAILY_COUNT } from './rewards';
import { rngFromString, shuffle, type Rng } from './rng';
import { fitsGrade, type Grade, type Question, type Unit } from './types';

export interface Item {
  unit: Unit;
  q: Question;
}

/** 今日のチャレンジの途中経過の id。学年ごとに別の問題 */
export const dailyId = (date: string, grade: Grade) => `daily-${date}-g${grade}`;

/**
 * 今日のチャレンジの 10 問。日付と学年から決まるので、同じ日・同じ学年ならだれが開いても同じ問題。
 * できるだけ別々の単元から 1 問ずつえらぶ (単元が 10 より少ない学年では、同じ単元から 2 問目もえらぶ)。
 * 前の日と同じ問題が出にくいよう、問題は日付で回していく。
 */
export function buildDaily(units: readonly Unit[], date: string, grade: Grade): Item[] {
  const rng = rngFromString(`daily:${date}:g${grade}`);
  const pools = units
    .map((unit) => ({ unit, qs: unit.questions.filter((q) => fitsGrade(q, grade)) }))
    .filter((p) => p.qs.length > 0);
  if (pools.length === 0) return [];
  const order = shuffle(pools, rng);
  // 日にちの通し番号。単元の中の問題を、日ごとに少しずつずらしてえらぶ
  const dayNum = Math.floor(Date.parse(`${date}T00:00:00Z`) / 86400000);
  const items: Item[] = [];
  for (let round = 0; items.length < DAILY_COUNT; round++) {
    for (const { unit, qs } of order) {
      if (items.length >= DAILY_COUNT) break;
      if (round >= qs.length) continue;
      // 単元ごとに決まった順番 (日付によらない) に問題をならべ、日付で回す
      const ring = shuffle(qs, rngFromString(`ring:${unit.id}:g${grade}`));
      items.push({ unit, q: ring[(dayNum + round) % ring.length] });
    }
    if (round > 20) break;
  }
  return shuffle(items, rng);
}

/** 練習の 10 問。その単元の、その学年の問題からえらぶ (開くたびにちがう問題) */
export function buildPractice(unit: Unit, grade: Grade, rng: Rng = Math.random): Item[] {
  const qs = unit.questions.filter((q) => fitsGrade(q, grade));
  return shuffle(qs, rng)
    .slice(0, DAILY_COUNT)
    .map((q) => ({ unit, q }));
}

/** 出題の印 (保存した途中経過が、今の問題のものかを見分ける) */
export const itemsSig = (items: readonly Item[]) => items.map((it) => it.q.id).join('|');

/** 選択肢をならべかえる。もどり値の answer は、ならべかえたあとの正解の位置 */
export function shuffledOptions(options: readonly string[], seed: string): { options: string[]; answer: number } {
  const order = shuffle(
    options.map((_, i) => i),
    rngFromString(seed),
  );
  return { options: order.map((i) => options[i]), answer: order.indexOf(0) };
}
