import './styles.css';
import { restoreStore, startCloud } from './cloud';
import { jstDate } from './core/date';
import { buildDaily, buildPractice, dailyId, itemsSig, type Item } from './core/quiz';
import { dailyClearId, scorePoints } from './core/rewards';
import {
  addClear,
  addStamp,
  applyGrade,
  getGrade,
  loadProgress,
  saveProgress,
  unitClearId,
  unitCleared,
} from './core/storage';
import type { Grade } from './core/types';
import { UNITS, unitById } from './data/units';
import { playClear } from './ui/celebrate';
import { renderCards } from './ui/cards';
import { renderHome, todayScore } from './ui/home';
import { renderQuiz } from './ui/quiz';
import { openResult } from './ui/result';
import { renderStamps } from './ui/stamps';
import { TEXT } from './ui/text';

// 前にログインしていた人がいれば、通信を待たずに、この端末に残っているその人の写しで画面を出す
restoreStore();
applyGrade(location.search); // ?grade=3 などが付いていたら、その学年にする

const app = document.getElementById('app')!;
let cleanup: (() => void) | null = null;

/** クリアの演出に出す言葉。正解した問題の答えのうち、短いもの */
function fxWords(items: Item[], results: number[]): string[] {
  return items
    .filter((_, i) => results[i] === 1)
    .map(({ q }) => (q.kind === 'choice' || q.kind === 'karuta' ? q.options[0] : q.kind === 'pick' ? q.parts[q.answer] : ''))
    .map((w) => w.replace(/\(([ぁ-んー]+)\)/g, '').replace(/[［］＿]/g, ''))
    .filter((w) => w.length > 0 && w.length <= 8);
}

function startDaily(grade: Grade): () => void {
  const today = jstDate();
  const items = buildDaily(UNITS, today, grade);
  const id = dailyId(today, grade);
  const sig = itemsSig(items);
  const before = todayScore(today);
  // 今日のチャレンジを前に終えていたら、もう一度とくだけ (記録もポイントもかわらない)
  const progress = before === null ? loadProgress(id, sig) : { sig, results: [], done: false };
  return renderQuiz(app, {
    items,
    title: TEXT.daily,
    results: progress.results,
    onAnswer: (results) => {
      if (before === null) saveProgress(id, { sig, results: [...results], done: false });
    },
    onFinish: async (results) => {
      const score = results.filter((r) => r === 1).length;
      if (before !== null) {
        openResult({ items, results, already: true });
        return;
      }
      saveProgress(id, { sig, results: [...results], done: true });
      addClear(dailyClearId(today, score));
      const stamp = addStamp(today);
      await playClear(fxWords(items, results));
      openResult({ items, results, scorePoints: scorePoints(score), stamp, month: Number(today.slice(5, 7)) });
    },
  });
}

function startPractice(unitId: string, grade: Grade): () => void {
  const unit = unitById(unitId)!;
  let stop: (() => void) | null = null;
  const run = () => {
    stop?.();
    const items = buildPractice(unit, grade);
    stop = renderQuiz(app, {
      items,
      title: `${TEXT.practiceTitle}：${unit.name}`,
      onFinish: async (results) => {
        const perfect = results.length === items.length && results.every((r) => r === 1);
        const today = jstDate();
        const first = perfect && !unitCleared(unit.id, grade, today);
        if (first) addClear(unitClearId(unit.id, grade, today));
        if (perfect) await playClear(fxWords(items, results));
        openResult({ items, results, unitCleared: first, onRetry: run });
      },
    });
  };
  run();
  return () => stop?.();
}

function route(): void {
  cleanup?.();
  cleanup = null;
  document.querySelectorAll('dialog, .fx').forEach((d) => d.remove());
  const grade = getGrade();
  const hash = location.hash;
  const unit = hash.match(/^#\/unit\/([a-z]+)$/);

  if (hash === '#/daily' && grade) cleanup = startDaily(grade);
  else if (unit && grade && unitById(unit[1])) cleanup = startPractice(unit[1], grade);
  else if (hash === '#/cards') renderCards(app);
  else if (hash === '#/stamps') renderStamps(app);
  else renderHome(app);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();

// 最初の画面を出してから、ログインと Firestore の準備をする (Firebase の設定がないビルドでは何もしない)
void startCloud({
  // ログインやほぞんの状態が変わった。状態を出しているのはホームだけ
  onStatus: () => {
    if (app.querySelector('.home')) renderHome(app);
  },
  // Firestore から取りこんで、手元の記録が変わった。問題をといている途中でなければ、かき直す
  onData: () => {
    if (!app.querySelector('.quiz-page')) route();
  },
  askMigrate: () => confirm(TEXT.askMigrate),
});
