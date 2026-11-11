import { describe, expect, it } from 'vitest';
import { richHtml } from '../src/ui/dom';

describe('問題の文の表示', () => {
  const filled = (html: string) => [...html.matchAll(/<span class="blank is-filled">(.*?)<\/span>/g)].map((m) => m[1]);

  it('空らんに正解を入れる (ふりがなもつける)', () => {
    expect(filled(richHtml('手に ＿＿ 握(にぎ)る', '汗(あせ)'))).toEqual(['<ruby>汗<rt>あせ</rt></ruby>']);
  });

  it('空らんが 2 つあるときは、前から順に入れる', () => {
    expect(filled(richHtml('わたし＿＿ がっこう＿＿ いきます。', ['は', 'へ']))).toEqual(['は', 'へ']);
  });

  it('fill をわたさなければ、空らんのまま', () => {
    expect(richHtml('＿＿に 塩')).toContain('<span class="blank" aria-label="空らん"></span>');
  });
});
