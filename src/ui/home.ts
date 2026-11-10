import { jstDate } from '../core/date';
import { buildDaily, dailyId, itemsSig } from '../core/quiz';
import { balance, getClears, getGrade, getSound, loadProgress, pruneOldClears, pruneOldProgress, setGrade, setSound, unitCleared } from '../core/storage';
import { GRADES, fitsGrade, type Grade } from '../core/types';
import { AREAS, UNITS } from '../data/units';
import { accountBox } from './account';
import { h, hanamaru, rich } from './dom';
import { lynx } from './lynx';
import { TEXT as t } from './text';

/** 右の列を出す画面のはば (styles.css の .home と同じ値) */
const WIDE = '(min-width: 64rem)';

/** 原稿用紙に、たて書きで「ことば」「まなぶ」と書いたかざり (右の列から読む) */
function crest(): HTMLElement {
  const el = h('div', { class: 'crest', 'aria-hidden': 'true' });
  const cols = ['まなぶ', 'ことば'];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 2; c++) {
      el.append(h('span', { class: r === 2 && c === 1 ? 'crest-cell crest-cross' : 'crest-cell' }, cols[c][r]));
    }
  }
  return el;
}

function gradeSwitch(root: HTMLElement, current: Grade | null): HTMLElement {
  return h(
    'div',
    { class: 'grade', role: 'group', 'aria-label': '学年の えらびかた' },
    ...GRADES.map((g) =>
      h(
        'button',
        {
          type: 'button',
          class: 'grade-option',
          'aria-pressed': String(g === current),
          onclick: () => {
            if (g === current) return;
            setGrade(g);
            renderHome(root);
          },
        },
        h('b', {}, String(g)),
        h('span', {}, '年生'),
      ),
    ),
  );
}

function soundSwitch(): HTMLElement {
  const btn = h('button', { type: 'button', class: 'btn sound-switch' });
  const paint = () => {
    const on = getSound();
    btn.textContent = on ? t.soundOn : t.soundOff;
    btn.setAttribute('aria-pressed', String(on));
  };
  btn.addEventListener('click', () => {
    setSound(!getSound());
    paint();
  });
  paint();
  return h('p', { class: 'settings' }, btn);
}

/** 今日のチャレンジの、いちばんよい正解の数 (まだなら null)。学年をかえても 1 日 1 回分 */
export function todayScore(today: string): number | null {
  let best: number | null = null;
  for (const id of getClears()) {
    const m = id.match(/^daily-(\d{4}-\d{2}-\d{2}):(\d+)$/);
    if (m && m[1] === today) best = Math.max(best ?? 0, Number(m[2]));
  }
  return best;
}

function dailyBox(grade: Grade, today: string): HTMLElement {
  const items = buildDaily(UNITS, today, grade);
  const progress = loadProgress(dailyId(today, grade), itemsSig(items));
  const score = todayScore(today);
  const state = score !== null ? 'done' : progress.results.length > 0 ? 'playing' : 'new';
  const d = new Date(`${today}T00:00:00Z`);
  return h(
    'section',
    { class: 'daily', 'aria-labelledby': 'daily-title' },
    h(
      'div',
      { class: 'daily-text' },
      withId(rich('h2', '', t.daily), 'daily-title'),
      h('p', { class: 'daily-date' }, t.dateLabel(d.getUTCMonth() + 1, d.getUTCDate(), d.getUTCDay())),
      rich('p', 'daily-note', t.dailyNote(state, score ?? 0, progress.results.length)),
    ),
    state === 'done' ? hanamaru('hanamaru hanamaru-daily') : null,
    h('a', { class: 'btn btn-primary btn-big', href: '#/daily' }, { new: t.start, playing: t.resume, done: t.review }[state]),
  );
}

function withId<T extends HTMLElement>(el: T, id: string): T {
  el.id = id;
  return el;
}

function unitTile(unit: (typeof UNITS)[number], grade: Grade, today: string): HTMLElement {
  const count = unit.questions.filter((q) => fitsGrade(q, grade)).length;
  const done = unitCleared(unit.id, grade, today);
  const body = [
    rich('span', 'unit-name', unit.name),
    rich('span', 'unit-note', count > 0 ? unit.note : t.unitEmpty),
    count > 0 ? h('span', { class: 'unit-count' }, t.questions(count)) : null,
    done ? hanamaru('hanamaru hanamaru-small') : null,
  ];
  return count > 0
    ? h('a', { class: `unit unit-${unit.area}${done ? ' is-done' : ''}`, href: `#/unit/${unit.id}` }, ...body)
    : h('span', { class: `unit unit-${unit.area} is-empty`, 'aria-disabled': 'true' }, ...body);
}

export function renderHome(root: HTMLElement): void {
  const grade = getGrade();
  const today = jstDate();
  pruneOldProgress(today);
  pruneOldClears(today); // 単元のはなまるは、その日だけ

  const main: (HTMLElement | null)[] = [
    h(
      'header',
      { class: 'hero' },
      crest(),
      h('div', { class: 'hero-text' }, h('h1', { class: 'brand' }, t.brand), rich('p', 'lead', t.lead)),
      lynx({ mouth: 'smile', items: ['book', 'glasses'] }),
    ),
    grade === null ? h('p', { class: 'grade-ask' }, t.gradeAsk) : null,
    gradeSwitch(root, grade),
  ];

  if (grade !== null) {
    main.push(
      dailyBox(grade, today),
      h(
        'nav',
        { class: 'reward-links', 'aria-label': t.rewardLinks },
        h('p', { class: 'points' }, h('span', { class: 'points-label' }, t.pointsLabel), h('b', { class: 'points-num' }, t.points(balance()))),
        h('div', { class: 'reward-buttons' }, h('a', { class: 'btn', href: '#/stamps' }, t.stampTitle), h('a', { class: 'btn', href: '#/cards' }, t.cardsTitle)),
      ),
      h(
        'section',
        { class: 'units', 'aria-labelledby': 'units-title' },
        h('h2', { id: 'units-title' }, t.unitsTitle),
        h('p', { class: 'section-note' }, t.unitsNote),
        ...AREAS.map((area) =>
          h(
            'section',
            { class: `area area-${area.id}` },
            rich('h3', 'area-title', area.name),
            h('div', { class: 'unit-grid' }, ...UNITS.filter((u) => u.area === area.id).map((u) => unitTile(u, grade, today))),
          ),
        ),
      ),
    );
  }

  root.replaceChildren(
    h(
      'main',
      { class: 'home' },
      h('div', { class: 'home-main' }, ...main),
      h(
        'aside',
        { class: 'home-side' },
        accountBox(t),
        h(
          'details',
          { class: 'howto', open: matchMedia(WIDE).matches },
          h('summary', {}, t.howto),
          h('ul', {}, ...t.howtoItems.map((item) => h('li', {}, item))),
        ),
        soundSwitch(),
      ),
    ),
  );
}
