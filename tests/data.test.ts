import { describe, expect, it } from 'vitest';
import { GRADES, fitsGrade, type Question } from '../src/core/types';
import { UNITS } from '../src/data/units';

// 単元ごとに使ってよい問題の種類
const KINDS: Record<string, Question['kind'][]> = {
  kanyoku: ['karuta'],
  kotowaza: ['karuta'],
  yoji: ['choice'],
  ruigi: ['pair', 'choice'],
  goshu: ['choice'],
  shugo: ['pick', 'choice'],
  hinshi: ['choice', 'pick'],
  kosoado: ['choice', 'pick'],
  tsunagi: ['choice'],
  keigo: ['choice'],
  kanazukai: ['choice'],
  katakana: ['choice'],
  romaji: ['choice', 'order'],
  kutoten: ['choice', 'pick'],
  haiku: ['choice', 'order'],
  kobun: ['choice'],
};

const all = UNITS.flatMap((u) => u.questions.map((q) => ({ unit: u.id, q })));

/** ふりがなの書き方: 「漢字(かな)」のかっこの中はひらがなだけ。かっこの前は漢字 */
function badRuby(s: string): string | null {
  for (const m of s.matchAll(/\(([^)]*)\)/g)) {
    const before = s.slice(0, m.index);
    if (!/[一-龠々ヶ]$/.test(before)) return `かっこの前が漢字でない: ${s}`;
    if (!/^[ぁ-んー]+$/.test(m[1])) return `ふりがながひらがなでない: ${s}`;
  }
  if (/[（）]/.test(s) && /[一-龠々]（[ぁ-ん]+）/.test(s)) return `ふりがなが全角かっこ: ${s}`;
  return null;
}

function texts(q: Question): string[] {
  const out = [q.explain];
  if ('prompt' in q) out.push(q.prompt);
  if ('text' in q && q.text) out.push(q.text);
  if (q.kind === 'choice' || q.kind === 'karuta') out.push(...q.options);
  if (q.kind === 'karuta') out.push(q.meaning);
  if (q.kind === 'pair') out.push(...q.pairs.flat());
  if (q.kind === 'order') out.push(...q.tiles, ...(q.extra ?? []));
  if (q.kind === 'pick') out.push(...q.parts);
  return out;
}

describe('問題データ', () => {
  it('id が重ならず、単元名で始まる', () => {
    const ids = all.map((a) => a.q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const { unit, q } of all) expect(q.id.startsWith(`${unit}-`), q.id).toBe(true);
  });

  it('単元ごとに決めた種類の問題だけ', () => {
    for (const { unit, q } of all) expect(KINDS[unit], q.id).toContain(q.kind);
  });

  it('形が正しい', () => {
    for (const { q } of all) {
      expect(GRADES, q.id).toContain(q.g);
      expect(q.explain.length, q.id).toBeGreaterThan(0);
      if (q.kind === 'choice' || q.kind === 'karuta') {
        expect(q.options.length, q.id).toBeGreaterThanOrEqual(3);
        expect(q.options.length, q.id).toBeLessThanOrEqual(6);
        expect(new Set(q.options).size, `選択肢が重なっている ${q.id}`).toBe(q.options.length);
      }
      if (q.kind === 'karuta') expect(q.text.split('＿＿').length, `空らんは 1 つ ${q.id}`).toBe(2);
      if (q.kind === 'pair') {
        expect(q.pairs.length, q.id).toBeGreaterThanOrEqual(3);
        expect(q.pairs.length, q.id).toBeLessThanOrEqual(4);
        const words = q.pairs.flat();
        expect(new Set(words).size, `札が重なっている ${q.id}`).toBe(words.length);
      }
      if (q.kind === 'order') {
        expect(q.tiles.length, q.id).toBeGreaterThanOrEqual(2);
        for (const x of q.extra ?? []) expect(q.tiles, `まぎらわしいタイルが正解にある ${q.id}`).not.toContain(x);
      }
      if (q.kind === 'pick') {
        expect(q.parts.length, q.id).toBeGreaterThanOrEqual(3);
        expect(q.answer, q.id).toBeGreaterThanOrEqual(0);
        expect(q.answer, q.id).toBeLessThan(q.parts.length);
        // 同じ文字の区切りがあると、どちらをおしたか見分けられない
        expect(q.parts.filter((p) => p === q.parts[q.answer]).length, q.id).toBe(1);
      }
    }
  });

  it('ふりがなの書き方が正しい', () => {
    for (const { q } of all) for (const s of texts(q)) expect(badRuby(s), q.id).toBeNull();
  });

  it('どの学年でも、今日のチャレンジに 10 問を出せるだけの単元と問題がある', () => {
    for (const g of GRADES) {
      const units = UNITS.filter((u) => u.questions.some((q) => fitsGrade(q, g)));
      const count = all.filter(({ q }) => fitsGrade(q, g)).length;
      expect(units.length, `${g} 年生の単元`).toBeGreaterThanOrEqual(5);
      expect(count, `${g} 年生の問題`).toBeGreaterThanOrEqual(40);
    }
  });
});
