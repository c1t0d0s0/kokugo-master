// カードのデザインを確認するページ (cards.html)。記録は読みも書きもしない
import './styles.css';
import { CARDS } from './data/cards';
import { h } from './ui/dom';
import { cardSvg } from './ui/lynx';

const face = (svg: string) => {
  const el = h('div', { class: 'card-face' });
  el.innerHTML = svg;
  return el;
};

document.getElementById('app')!.replaceChildren(
  h(
    'main',
    { class: 'cards-main' },
    h('h1', {}, '国語マスター カードのデザイン一覧'),
    h(
      'ul',
      { class: 'card-grid' },
      ...CARDS.map((c) => h('li', { class: 'card is-owned' }, face(cardSvg(c)), h('p', { class: 'card-name' }, `${c.name} (${c.price}pt)`))),
      h('li', { class: 'card is-back' }, h('div', { class: 'card-back' }, h('span', { class: 'card-price' }, '40pt')), h('p', { class: 'card-name' }, '裏面')),
    ),
  ),
);
