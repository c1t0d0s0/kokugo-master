import type { Item } from '../core/quiz';
import type { StampReward } from '../core/rewards';
import { balance } from '../core/storage';
import { h, hanamaru, present, rich } from './dom';
import { answerText } from './quiz';
import { TEXT as t } from './text';

export interface ResultInfo {
  items: Item[];
  results: number[];
  /** 今日のチャレンジでもらったポイント (はじめて終えたときだけ) */
  scorePoints?: number;
  stamp?: StampReward;
  month?: number;
  /** 今日のチャレンジを前に終えていて、ポイントはふえなかった */
  already?: boolean;
  /** 練習で全問正解して、はなまるがついた */
  unitCleared?: boolean;
  /** 「もう一ど」をおしたとき */
  onRetry?: () => void;
}

/** 全部答えたあとの、けっかとふりかえり */
export function openResult(info: ResultInfo): void {
  const score = info.results.filter((r) => r === 1).length;
  const n = info.items.length;
  const stamp = info.stamp?.added ? info.stamp : undefined;
  const gained = (info.scorePoints ?? 0) + (stamp ? stamp.weekPoints + stamp.monthPoints : 0);

  const rewards: (HTMLElement | null)[] = [
    info.scorePoints ? h('p', { class: 'result-reward' }, t.rewardScore(info.scorePoints)) : null,
    info.scorePoints && score === n ? h('p', { class: 'result-note' }, t.rewardPerfect) : null,
    stamp ? h('p', { class: 'result-stamp-title' }, t.stampDone) : null,
    stamp && stamp.weekPoints > 0 ? h('p', { class: 'result-reward' }, t.rewardWeek(stamp.run)) : null,
    stamp && stamp.monthPoints > 0 ? h('p', { class: 'result-reward' }, t.rewardMonth(info.month ?? 0)) : null,
    info.already ? h('p', { class: 'result-note' }, t.alreadyDone) : null,
    info.unitCleared ? h('p', { class: 'result-stamp-title' }, t.unitCleared) : null,
  ];
  const rewardBox = rewards.some(Boolean)
    ? h(
        'div',
        { class: 'result-stamp' },
        ...rewards,
        gained > 0 ? h('p', { class: 'result-balance' }, `${t.pointsLabel} ${t.points(balance())}`) : null,
        stamp ? h('a', { class: 'btn', href: '#/stamps' }, t.seeStamps) : gained > 0 ? h('a', { class: 'btn', href: '#/cards' }, t.seeCards) : null,
      )
    : null;

  const review = h(
    'ol',
    { class: 'review' },
    ...info.items.map(({ q }, i) =>
      h(
        'li',
        { class: info.results[i] ? 'review-item is-ok' : 'review-item is-ng' },
        h('span', { class: 'review-mark', 'aria-label': info.results[i] ? '正解' : 'まちがい' }, info.results[i] ? '○' : '×'),
        h(
          'div',
          {},
          rich('p', 'review-q', q.kind === 'karuta' || ('text' in q && q.text && [...q.text].length < 30) ? `${q.prompt}　${q.text ?? ''}` : q.prompt),
          rich('p', 'review-a', t.correctIs(answerText(q))),
          rich('p', 'review-explain', q.kind === 'karuta' ? q.meaning : q.explain),
        ),
      ),
    ),
  );

  const dialog = h('dialog', { class: 'result', 'aria-labelledby': 'result-title' });
  dialog.append(
    ...present<HTMLElement>(
    h(
      'div',
      { class: 'result-head' },
      score >= Math.ceil(n * 0.7) ? hanamaru() : null,
      h('div', {}, h('h2', { id: 'result-title' }, t.resultTitle(score)), h('p', { class: 'result-sub' }, t.resultSub(score, n))),
    ),
    rewardBox,
    h('h3', { class: 'review-title' }, t.reviewTitle),
    review,
    h(
      'div',
      { class: 'result-actions' },
      info.onRetry
        ? h(
            'button',
            {
              type: 'button',
              class: 'btn',
              onclick: () => {
                dialog.close();
                info.onRetry?.();
              },
            },
            t.retry,
          )
        : null,
      h('a', { class: 'btn btn-primary', href: '#/' }, t.goHome),
    ),
    ),
  );
  dialog.addEventListener('close', () => dialog.remove());
  // Esc でとじたときは、ホームにもどる (問題の画面は、もう終わっている)
  dialog.addEventListener('cancel', () => (location.hash = '#/'));
  document.body.append(dialog);
  dialog.showModal();
  dialog.scrollTop = 0;
}
