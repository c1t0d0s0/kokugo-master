import { describe, expect, it } from 'vitest';
import { addDays } from '../src/core/date';
import { buildDaily, buildPractice, shuffledOptions } from '../src/core/quiz';
import { clearsPoints, dailyClearId, scorePoints } from '../src/core/rewards';
import { GRADES, fitsGrade } from '../src/core/types';
import { CARDS } from '../src/data/cards';
import { UNITS } from '../src/data/units';

describe('今日のチャレンジ', () => {
  it('どの学年でも 10 問で、同じ問題は入らず、その学年の問題だけ', () => {
    for (const g of GRADES) {
      const items = buildDaily(UNITS, '2026-11-10', g);
      expect(items).toHaveLength(10);
      expect(new Set(items.map((it) => it.q.id)).size).toBe(10);
      for (const it of items) expect(fitsGrade(it.q, g)).toBe(true);
    }
  });

  it('同じ日・同じ学年なら同じ問題。日がかわると問題もかわる', () => {
    const ids = (d: string) => buildDaily(UNITS, d, 4).map((it) => it.q.id);
    expect(ids('2026-11-10')).toEqual(ids('2026-11-10'));
    const a = new Set(ids('2026-11-10'));
    expect(ids('2026-11-11').filter((id) => a.has(id)).length).toBeLessThan(3);
  });

  it('できるだけ別々の単元から出す', () => {
    for (const g of [3, 4, 5, 6] as const) {
      const units = buildDaily(UNITS, '2026-11-10', g).map((it) => it.unit.id);
      expect(new Set(units).size).toBe(10);
    }
  });

  it('1 か月の間に、同じ問題が何度も出すぎない', () => {
    const count = new Map<string, number>();
    for (let i = 0; i < 30; i++) for (const it of buildDaily(UNITS, addDays('2026-11-01', i), 3)) count.set(it.q.id, (count.get(it.q.id) ?? 0) + 1);
    expect(Math.max(...count.values())).toBeLessThanOrEqual(5);
  });
});

describe('練習', () => {
  it('その単元の、その学年の問題だけ (最大 10 問)', () => {
    for (const unit of UNITS) {
      for (const g of GRADES) {
        const items = buildPractice(unit, g);
        expect(items.length).toBe(Math.min(10, unit.questions.filter((q) => fitsGrade(q, g)).length));
        for (const it of items) expect(it.unit).toBe(unit);
      }
    }
  });
});

describe('選択肢のならびかえ', () => {
  it('正解の位置をおぼえている', () => {
    for (let i = 0; i < 50; i++) {
      const { options, answer } = shuffledOptions(['正', 'a', 'b', 'c'], `seed${i}`);
      expect(options[answer]).toBe('正');
      expect([...options].sort()).toEqual(['a', 'b', 'c', '正'].sort());
    }
  });
});

describe('ポイント', () => {
  it('1 問 10pt、全問正解で 50pt 足す', () => {
    expect(scorePoints(0)).toBe(0);
    expect(scorePoints(7)).toBe(70);
    expect(scorePoints(10)).toBe(150);
  });

  it('同じ日の記録は、よいほう 1 つだけ数える。練習はポイントにならない', () => {
    expect(clearsPoints([dailyClearId('2026-11-10', 4), dailyClearId('2026-11-10', 9), dailyClearId('2026-11-11', 10), 'unit-yoji-g4-2026-11-10'])).toBe(90 + 150);
  });

  it('毎日全問正解しても、カードを全部集めるには 2 か月以上かかる', () => {
    const total = CARDS.reduce((s, c) => s + c.price, 0);
    const perMonth = 30 * 150 + 4 * 500 + 3000;
    expect(total / perMonth).toBeGreaterThan(2);
    // はじめのカードは 1 日目に手に入る
    expect(CARDS[0].price).toBeLessThanOrEqual(scorePoints(5));
  });
});
