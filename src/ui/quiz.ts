import { shuffledOptions, type Item } from '../core/quiz';
import { rngFromString, shuffle } from '../core/rng';
import type { KarutaQ, OrderQ, PairQ, PickQ, Question, ChoiceQ } from '../core/types';
import { h, homeButton, present, rich } from './dom';
import { MOODS, lynx } from './lynx';
import { playCorrect, playTap, playWrong, primeSound } from './sound';
import { TEXT as t } from './text';

/** 問題 1 つの正解を、ふりかえりで見せる形にする */
export function answerText(q: Question): string {
  switch (q.kind) {
    case 'choice':
    case 'karuta':
      return q.options[0];
    case 'pair':
      return q.pairs.map(([a, b]) => `${a}・${b}`).join('　');
    case 'order':
      return q.tiles.join(q.joiner);
    case 'pick':
      return q.parts[q.answer];
  }
}

export interface QuizOptions {
  items: Item[];
  title: string;
  /** すでに答えた分 (今日のチャレンジのつづき) */
  results?: number[];
  /** 1 問答えるたびによぶ (途中経過の保存) */
  onAnswer?: (results: number[]) => void;
  /** 全部答えたらよぶ */
  onFinish: (results: number[]) => void;
}

/** 1 問の画面を作る。答えが決まったら judge(正解か) をよぶ */
type Renderer<Q extends Question> = (q: Q, judge: (ok: boolean) => void, seed: string) => HTMLElement;

const random = () => Math.random();

/** 4 つの中からえらぶ */
const renderChoice: Renderer<ChoiceQ> = (q, judge, seed) => {
  const { options, answer } = shuffledOptions(q.options, seed);
  const long = options.some((o) => [...o].length > 9);
  const list = h('div', { class: `choices${long ? ' is-long' : ''}` });
  options.forEach((opt, i) => {
    const btn = rich('button', 'choice', opt);
    btn.type = 'button';
    btn.dataset.key = String(i + 1);
    btn.prepend(h('span', { class: 'choice-key', 'aria-hidden': 'true' }, String(i + 1)));
    btn.addEventListener('click', () => {
      list.querySelectorAll('button').forEach((b) => (b.disabled = true));
      list.children[answer].classList.add('is-correct');
      if (i !== answer) btn.classList.add('is-wrong');
      judge(i === answer);
    });
    list.append(btn);
  });
  return list;
};

/** ふりがなをのぞいた字 */
const plain = (s: string) => s.replace(/([一-龠々ヶ]+)\(([ぁ-んー]+)\)/g, '$1');

/** かるたの札のすみに書く、はじめの音。漢字で始まるときは、そのふりがなの 1 字目 */
const headSound = (s: string) => s.match(/^[一-龠々ヶ]+\(([ぁ-んー])/)?.[1] ?? [...s][0];

/** かるたの札から、空らんに入る言葉をとる */
const renderKaruta: Renderer<KarutaQ> = (q, judge, seed) => {
  const { options, answer } = shuffledOptions(q.options, seed);
  const field = h('div', { class: 'karuta-field' });
  options.forEach((opt, i) => {
    const card = h(
      'button',
      { type: 'button', class: 'karuta', 'data-key': String(i + 1), 'aria-label': plain(opt) },
      h('span', { class: 'karuta-head', 'aria-hidden': 'true' }, headSound(opt)),
      rich('span', 'karuta-word', opt),
    );
    card.addEventListener('click', () => {
      field.querySelectorAll('button').forEach((b) => (b.disabled = true));
      field.children[answer].classList.add('is-correct');
      if (i !== answer) card.classList.add('is-wrong');
      // 空らんに正しい札の言葉を入れる
      const text = field.closest('.quiz-card')?.querySelector('.quiz-text');
      if (text) text.replaceWith(rich('p', 'quiz-text is-karuta', q.text, q.options[0]));
      judge(i === answer);
    });
    field.append(card);
  });
  return field;
};

/** 2 枚 1 組の札合わせ。まちがいが 1 回までなら正解 */
const renderPair: Renderer<PairQ> = (q, judge, seed) => {
  const cards = shuffle(
    q.pairs.flatMap(([a, b], pair) => [
      { word: a, pair },
      { word: b, pair },
    ]),
    rngFromString(seed),
  );
  const grid = h('div', { class: 'pairs' });
  const status = h('p', { class: 'pair-status', 'aria-live': 'polite' }, '');
  let selected: { el: HTMLButtonElement; pair: number } | null = null;
  let matched = 0;
  let misses = 0;
  for (const c of cards) {
    const el = rich('button', 'pair-card', c.word);
    el.type = 'button';
    el.addEventListener('click', () => {
      if (el.classList.contains('is-matched')) return;
      playTap();
      if (!selected) {
        selected = { el, pair: c.pair };
        el.setAttribute('aria-pressed', 'true');
        return;
      }
      const first = selected;
      selected = null;
      first.el.setAttribute('aria-pressed', 'false');
      if (first.el === el) return;
      if (first.pair === c.pair) {
        for (const x of [first.el, el]) {
          x.classList.add('is-matched', `pair-${matched % 4}`);
          x.disabled = true;
        }
        matched++;
        if (matched === q.pairs.length) {
          status.textContent = `${t.pairDone}${misses > 0 ? ` (${t.pairMiss(misses)})` : ''}`;
          judge(misses <= 1);
        }
      } else {
        misses++;
        status.textContent = t.pairMiss(misses);
        for (const x of [first.el, el]) {
          x.classList.remove('is-shake');
          void x.offsetWidth; // アニメーションを、もう一度はじめから動かす
          x.classList.add('is-shake');
        }
      }
    });
    grid.append(el);
  }
  return h('div', {}, h('p', { class: 'pair-rule' }, 'まちがい 1回までなら せいかい'), grid, status);
};

/** タイルをならべる */
const renderOrder: Renderer<OrderQ> = (q, judge, seed) => {
  const all = [...q.tiles, ...(q.extra ?? [])];
  let pool = shuffle(
    all.map((text, i) => ({ text, i })),
    rngFromString(seed),
  );
  // たまたま正しい順にならんだら、もう一度まぜる
  if (!q.extra?.length && pool.every((x, i) => x.i === i) && pool.length > 1) pool = [...pool.slice(1), pool[0]];
  const placed: { text: string; i: number }[] = [];
  const answerRow = h('div', { class: `order-answer${q.joiner === '' ? ' is-tight' : ''}`, 'aria-label': 'ならべた こたえ' });
  const poolRow = h('div', { class: 'order-pool' });
  const check = h('button', { type: 'button', class: 'btn btn-primary', disabled: true }, t.orderCheck);
  const reset = h('button', { type: 'button', class: 'btn' }, t.orderReset);
  let locked = false;

  const paint = () => {
    answerRow.replaceChildren(
      ...placed.map((tile, k) =>
        h(
          'button',
          {
            type: 'button',
            class: 'otile is-placed',
            onclick: () => {
              if (locked) return;
              placed.splice(k, 1);
              playTap();
              paint();
            },
          },
          tile.text,
        ),
      ),
      ...Array.from({ length: Math.max(0, q.tiles.length - placed.length) }, () => h('span', { class: 'otile-slot', 'aria-hidden': 'true' })),
    );
    poolRow.replaceChildren(
      ...pool.map((tile) => {
        const used = placed.includes(tile);
        return h(
          'button',
          {
            type: 'button',
            class: used ? 'otile is-used' : 'otile',
            disabled: used || locked,
            onclick: () => {
              if (locked || placed.length >= q.tiles.length) return;
              placed.push(tile);
              playTap();
              paint();
            },
          },
          tile.text,
        );
      }),
    );
    check.disabled = locked || placed.length !== q.tiles.length;
  };
  reset.addEventListener('click', () => {
    if (locked) return;
    placed.length = 0;
    paint();
  });
  check.addEventListener('click', () => {
    locked = true;
    // 同じ字のタイルがあってもよいよう、字の列でくらべる
    const ok = placed.map((x) => x.text).join('\u0000') === q.tiles.join('\u0000');
    answerRow.classList.add(ok ? 'is-correct' : 'is-wrong');
    reset.disabled = true;
    paint();
    judge(ok);
  });
  paint();
  return h('div', { class: 'order' }, answerRow, poolRow, h('div', { class: 'order-actions' }, reset, check));
};

/** 文の中の言葉をタップしてえらぶ */
const renderPick: Renderer<PickQ> = (q, judge) => {
  const line = h('p', { class: 'pick' });
  q.parts.forEach((part, i) => {
    const btn = rich('button', 'pick-part', part);
    btn.type = 'button';
    btn.addEventListener('click', () => {
      line.querySelectorAll('button').forEach((b) => (b.disabled = true));
      line.children[q.answer].classList.add('is-correct');
      if (i !== q.answer) btn.classList.add('is-wrong');
      judge(i === q.answer);
    });
    line.append(btn);
  });
  return line;
};

function renderBody(q: Question, judge: (ok: boolean) => void, seed: string): HTMLElement {
  switch (q.kind) {
    case 'choice':
      return renderChoice(q, judge, seed);
    case 'karuta':
      return renderKaruta(q, judge, seed);
    case 'pair':
      return renderPair(q, judge, seed);
    case 'order':
      return renderOrder(q, judge, seed);
    case 'pick':
      return renderPick(q, judge, seed);
  }
}

const pickOne = (list: string[]) => list[Math.floor(random() * list.length)];

/** 問題を 1 問ずつ出す画面。もどり値は、画面をはなれるときの後かたづけ */
export function renderQuiz(root: HTMLElement, opts: QuizOptions): () => void {
  const { items } = opts;
  const results = [...(opts.results ?? [])].slice(0, items.length);
  // 問題ごとに、選択肢のならびは開くたびにかわる (おぼえた位置で答えられないように)
  const salt = String(Math.floor(random() * 1e9));

  const meta = h('span', { class: 'bar-meta' });
  const dots = h('ol', { class: 'dots', 'aria-hidden': 'true' });
  const stage = h('div', { class: 'quiz-stage' });
  root.replaceChildren(
    h(
      'div',
      { class: 'quiz-page' },
      h('header', { class: 'bar' }, homeButton(t.goHome), rich('h1', '', opts.title), meta),
      dots,
      h('main', { class: 'quiz-main' }, stage),
    ),
  );

  let nextBtn: HTMLButtonElement | null = null;
  const onKey = (ev: KeyboardEvent) => {
    if (ev.target instanceof HTMLElement && ev.target.closest('dialog')) return;
    if (ev.key === 'Enter' && nextBtn && document.activeElement !== nextBtn) {
      ev.preventDefault();
      nextBtn.click();
      return;
    }
    if (/^[1-6]$/.test(ev.key)) {
      const btn = stage.querySelector<HTMLButtonElement>(`[data-key="${ev.key}"]:not(:disabled)`);
      btn?.click();
    }
  };
  document.addEventListener('keydown', onKey);

  const paintDots = (current: number) => {
    dots.replaceChildren(
      ...items.map((_, i) =>
        h('li', { class: i < results.length ? (results[i] ? 'dot is-ok' : 'dot is-ng') : i === current ? 'dot is-now' : 'dot' }),
      ),
    );
    meta.textContent = t.progress(Math.min(current + 1, items.length), items.length);
  };

  const show = (index: number) => {
    nextBtn = null;
    if (index >= items.length) {
      paintDots(items.length);
      opts.onFinish(results);
      return;
    }
    paintDots(index);
    const { unit, q } = items[index];
    const bubble = h('p', { class: 'bubble', 'aria-live': 'polite' }, pickOne(t.lynxSay.start));
    const mascot = h('div', { class: 'mascot' }, lynx(MOODS.start, 'lynx lynx-mascot'), bubble);
    const feedback = h('div', { class: 'feedback', hidden: true });
    const card = h(
      'article',
      { class: `quiz-card area-${unit.area}` },
      h('p', { class: 'quiz-unit' }, rich('span', '', unit.name)),
      rich('h2', 'quiz-prompt', q.prompt),
      'text' in q && q.text ? rich('p', `quiz-text${q.kind === 'karuta' ? ' is-karuta' : ''}`, q.text) : null,
    );

    const judge = (ok: boolean) => {
      results.push(ok ? 1 : 0);
      opts.onAnswer?.(results);
      if (ok) playCorrect();
      else playWrong();
      mascot.replaceChildren(lynx(ok ? MOODS.correct : MOODS.wrong, 'lynx lynx-mascot'), bubble);
      bubble.textContent = pickOne(ok ? t.lynxSay.correct : t.lynxSay.wrong);
      mascot.classList.toggle('is-happy', ok);
      paintDots(index + 1);
      meta.textContent = t.progress(index + 1, items.length);
      const last = index + 1 >= items.length;
      nextBtn = h('button', { type: 'button', class: 'btn btn-primary btn-big' }, last ? t.finish : t.next);
      nextBtn.addEventListener('click', () => show(index + 1));
      feedback.replaceChildren(
        ...present(
        h('p', { class: `verdict ${ok ? 'is-ok' : 'is-ng'}` }, ok ? t.correct : t.wrong),
        ok && q.kind !== 'pair' ? null : rich('p', 'feedback-answer', t.correctIs(answerText(q))),
        q.kind === 'karuta' ? rich('p', 'feedback-meaning', q.meaning) : null,
        rich('p', 'feedback-explain', q.explain),
        h('div', { class: 'feedback-actions' }, nextBtn),
        ),
      );
      feedback.hidden = false;
      feedback.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      nextBtn.focus({ preventScroll: true });
    };

    card.append(
      renderBody(
        q,
        (ok) => {
          primeSound();
          judge(ok);
        },
        `${q.id}:${salt}`,
      ),
      feedback,
    );
    stage.replaceChildren(mascot, card);
    window.scrollTo(0, 0);
  };

  show(results.length);
  return () => document.removeEventListener('keydown', onKey);
}
