import { clearsPoints, earnedPoints, normalizeStamps, rewardFor, type StampReward } from './rewards';
import { emptySnapshot, isGrade, type OwnedCard, type Progress, type Snapshot } from './snapshot';
import type { Grade } from './types';

export type { OwnedCard, Progress } from './snapshot';

// 記録を置く場所。ログインしていない人の記録は GUEST_PREFIX の下。
// ログイン中の人の記録 (Firestore の写し) は、人ごとに別の場所に置き、ログアウトしたら消す。
const GUEST_PREFIX = 'kokugo:v1:';
const USER_PREFIX = 'kokugo:u:';
const userPrefix = (uid: string) => `${USER_PREFIX}${uid}:`;
const ACTIVE_UID_KEY = 'kokugo:auth-uid';

let prefix = GUEST_PREFIX;
let listener: ((key: string) => void) | null = null;
let muted = false;

/** 読み書きする記録を切りかえる。uid が null ならログインなしの記録 */
export function useStore(uid: string | null): void {
  prefix = uid ? userPrefix(uid) : GUEST_PREFIX;
}

/** 今、読み書きしているのがだれの記録か。ログインなしの記録なら null */
export function currentUid(): string | null {
  return prefix === GUEST_PREFIX ? null : prefix.slice(USER_PREFIX.length, -1);
}

/** この端末で、さいごにログインしていた人。次に開いたとき、通信を待たずにその人の写しを出すために使う */
export function rememberedUid(): string | null {
  try {
    return localStorage.getItem(ACTIVE_UID_KEY);
  } catch {
    return null;
  }
}

export function rememberUid(uid: string | null): void {
  try {
    if (uid) localStorage.setItem(ACTIVE_UID_KEY, uid);
    else localStorage.removeItem(ACTIVE_UID_KEY);
  } catch {
    /* 無視 */
  }
}

/** 記録が書きかわったら知らせてもらう (Firestore に送るため)。key は「stamps」「progress:daily-…」など */
export function onStorageChange(cb: ((key: string) => void) | null): void {
  listener = cb;
}

// localStorage が使えない環境 (プライベートブラウズなど) でも遊べるよう、失敗は無視する
function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(prefix + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(prefix + key, JSON.stringify(value));
  } catch {
    /* 保存できなくても続行 */
  }
  if (!muted) listener?.(key);
}

function removeKey(fullKey: string): void {
  try {
    localStorage.removeItem(fullKey);
  } catch {
    /* 無視 */
  }
}

/** 今の場所にあるキーの一覧 (prefix をのぞいた形) */
function keys(at: string = prefix): string[] {
  const out: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(at)) out.push(key.slice(at.length));
    }
  } catch {
    /* 無視 */
  }
  return out;
}

// ---- 設定 ----

/** えらんでいる学年。まだえらんでいなければ null */
export function getGrade(): Grade | null {
  const g = read<number>('grade');
  return isGrade(g) ? g : null;
}

export function setGrade(grade: Grade): void {
  write('settings-at', Date.now()); // 2 か所の記録を合わせるとき、あとから変えたほうを使う
  write('grade', grade);
}

/** URL に ?grade=1〜6 が付いていたら、その学年にする */
export function applyGrade(search: string): void {
  const g = Number(new URLSearchParams(search).get('grade'));
  if (isGrade(g)) setGrade(g);
}

/** 効果音を鳴らすかどうか。何もえらんでいなければ鳴らす */
export function getSound(): boolean {
  return read<boolean>('sound') !== false;
}

export function setSound(on: boolean): void {
  write('settings-at', Date.now());
  write('sound', on);
}

// ---- 今日のチャレンジの途中経過 ----

export function loadProgress(id: string, sig: string): Progress {
  const saved = read<Progress>(`progress:${id}`);
  if (saved && saved.sig === sig && Array.isArray(saved.results)) return saved;
  return { sig, results: [], done: false };
}

export function saveProgress(id: string, progress: Progress): void {
  write(`progress:${id}`, { ...progress, at: Date.now() });
}

/** もういらない途中経過かどうか。前の日までの今日のチャレンジ */
export function isStaleProgress(progressId: string, today: string): boolean {
  return progressId.startsWith('daily-') && !progressId.startsWith(`daily-${today}`);
}

/** 前の日までの途中経過を消す */
export function pruneOldProgress(today: string): void {
  for (const key of keys()) {
    if (key.startsWith('progress:') && isStaleProgress(key.slice('progress:'.length), today)) removeKey(prefix + key);
  }
}

// ---- スタンプ・ポイント・カード ----

/** 今日のチャレンジを終えた日の一覧 */
export function getStamps(): string[] {
  const saved = read<string[]>('stamps');
  return Array.isArray(saved) ? normalizeStamps(saved) : [];
}

/** その日のスタンプを押す。1 日に何回よんでも 1 個だけ */
export function addStamp(date: string): StampReward {
  const before = getStamps();
  const reward = rewardFor(before, date);
  if (reward.added) write('stamps', normalizeStamps([...before, date]));
  return reward;
}

export function getClears(): string[] {
  const saved = read<string[]>('clears');
  return Array.isArray(saved) ? saved.filter((id) => typeof id === 'string') : [];
}

/** やりとげたことを記録する。もう記録してあれば何もしない */
export function addClear(id: string): void {
  const clears = getClears();
  if (!clears.includes(id)) write('clears', [...clears, id].sort());
}

export const unitClearId = (unitId: string, grade: Grade) => `unit-${unitId}-g${grade}`;

/** その単元の練習を、その学年で全問正解したことがあるか */
export function unitCleared(unitId: string, grade: Grade): boolean {
  return getClears().includes(unitClearId(unitId, grade));
}

export function getCards(): OwnedCard[] {
  const saved = read<OwnedCard[]>('cards');
  return Array.isArray(saved) ? saved.filter((c) => typeof c?.id === 'string' && c.paid >= 0) : [];
}

function getSpent(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [key, points] of Object.entries(read<Record<string, number>>('spent') ?? {})) {
    if (typeof points === 'number' && points > 0) out[key] = points;
  }
  return out;
}

/** 今つかえるポイント = 今日のチャレンジとスタンプでもらった分 − カードに使った分 */
export function balance(): number {
  return (
    clearsPoints(getClears()) +
    earnedPoints(getStamps()).total -
    getCards().reduce((sum, c) => sum + c.paid, 0) -
    Object.values(getSpent()).reduce((sum, p) => sum + p, 0)
  );
}

/** ポイントとカードを交換する。ポイントが足りないときや、もう持っているときは何もしない */
export function buyCard(card: { id: string; price: number }): boolean {
  const owned = getCards();
  if (owned.some((c) => c.id === card.id) || balance() < card.price) return false;
  write('cards', [...owned, { id: card.id, paid: card.price }]);
  return true;
}

// ---- 記録をまるごと出し入れする (ログイン・Firestore との同期で使う) ----

export function exportSnapshot(): Snapshot {
  const s = emptySnapshot();
  s.stamps = getStamps();
  s.clears = getClears().slice().sort();
  s.cards = getCards();
  s.spent = getSpent();
  const sound = read<boolean>('sound');
  const at = read<number>('settings-at');
  s.settings = { grade: getGrade(), sound: typeof sound === 'boolean' ? sound : null, at: typeof at === 'number' ? at : 0 };
  for (const key of keys()) {
    if (!key.startsWith('progress:')) continue;
    const p = read<Progress>(key);
    if (p && typeof p.sig === 'string' && Array.isArray(p.results)) s.progress[key.slice('progress:'.length)] = p;
  }
  return s;
}

/**
 * 今の場所の記録を、わたされた内容に入れかえる。
 * Firestore から取りこんだ結果を書くためのものなので、「書きかわった」という知らせは出さない。
 * keepProgress が true のときは、途中経過にはさわらない。
 */
export function importSnapshot(s: Snapshot, opts: { keepProgress?: boolean } = {}): void {
  muted = true;
  try {
    write('stamps', s.stamps);
    write('clears', s.clears);
    write('cards', s.cards);
    write('spent', s.spent);
    if (s.settings.grade) write('grade', s.settings.grade);
    if (s.settings.sound !== null) write('sound', s.settings.sound);
    write('settings-at', s.settings.at);
    if (!opts.keepProgress) {
      for (const key of keys()) {
        if (key.startsWith('progress:') && !(key.slice('progress:'.length) in s.progress)) removeKey(prefix + key);
      }
      for (const [id, p] of Object.entries(s.progress)) write(`progress:${id}`, p);
    }
  } finally {
    muted = false;
  }
}

/** その人の記録 (uid が null ならログインなしの記録) を、この端末から消す */
export function clearStore(uid: string | null): void {
  const at = uid ? userPrefix(uid) : GUEST_PREFIX;
  for (const key of keys(at)) removeKey(at + key);
}
