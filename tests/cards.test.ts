import { describe, expect, it } from 'vitest';
import { CARDS } from '../src/data/cards';

// ほかのアプリ (Wordlynx・Reading Quest・漢字クイズ) のカードと着せかえで使っている持ち物と背景。
// 国語マスターのカードは、これらを使わない、国語マスターだけのデザインにする
const OTHER_APP_ITEMS = [
  // Wordlynx (漢字クイズの着せかえも同じ 12 こ)
  'ribbon', 'glasses', 'pencil', 'hat', 'scarf', 'flower', 'book', 'headband', 'headphones', 'cap', 'wizard', 'crown', 'zzz',
  // Reading Quest
  'bookmark', 'acorn', 'mittens', 'candle', 'magnifier', 'quill', 'scroll', 'lantern', 'maple', 'chestnut', 'shell', 'cello',
  'deerstalker', 'hood', 'mortarboard', 'conductor', 'beret', 'laurel',
];
const OTHER_APP_BACKGROUNDS = [
  // Wordlynx
  'paper', 'dots', 'grid', 'night', 'pink', 'sky', 'snow', 'sakura', 'notes', 'hanamaru', 'stars', 'rainbow', 'gold',
  // Reading Quest
  'library', 'forest', 'genko', 'moon', 'autumn', 'sea', 'galaxy', 'washi',
];
const OTHER_APP_FRAMES = ['plain', 'silver', 'gold'];

describe('ヤマネコカード', () => {
  it('ほかのアプリの持ち物・背景・ふちを使わない', () => {
    for (const c of CARDS) {
      for (const item of c.look.items ?? []) expect(OTHER_APP_ITEMS, `${c.name} の ${item}`).not.toContain(item);
      expect(OTHER_APP_BACKGROUNDS, c.name).not.toContain(c.bg);
      expect(OTHER_APP_FRAMES, c.name).not.toContain(c.frame);
    }
  });

  it('id と名前が重ならず、ほかのアプリの id ともちがう', () => {
    expect(new Set(CARDS.map((c) => c.id)).size).toBe(CARDS.length);
    expect(new Set(CARDS.map((c) => c.name)).size).toBe(CARDS.length);
    for (const c of CARDS) expect(c.id).toMatch(/^km\d{2}$/);
  });

  it('同じ見た目のカードがない (持ち物と背景の組み合わせがちがう)', () => {
    const looks = CARDS.map((c) => `${[...(c.look.items ?? [])].sort().join('+')}@${c.bg}`);
    expect(new Set(looks).size).toBe(CARDS.length);
  });

  it('値段の安い順', () => {
    for (let i = 1; i < CARDS.length; i++) expect(CARDS[i].price).toBeGreaterThan(CARDS[i - 1].price);
  });
});
