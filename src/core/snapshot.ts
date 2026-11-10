import type { Grade } from './types';

// ---- 手元の記録の形 ----

/** 今日のチャレンジの途中経過 */
export interface Progress {
  /** 出題した問題の id をつなげたもの。問題が変わっていたら、前の途中経過は使わない */
  sig: string;
  /** 答えた順に、正解なら 1、まちがいなら 0 */
  results: number[];
  done: boolean;
  /** さいごに保存した時刻 (ミリ秒)。2 か所の記録を合わせるときに使う */
  at?: number;
}

export interface OwnedCard {
  id: string;
  /** 交換したときに使ったポイント。あとで値段を変えても残高がずれないように残す */
  paid: number;
}

export interface Settings {
  grade: Grade | null;
  sound: boolean | null;
  /** 学年や音をさいごに変えた時刻 (ミリ秒) */
  at: number;
}

/** 1 人分の記録の全部。ログインなしの記録も、ログイン中の人の記録も、この形であつかう */
export interface Snapshot {
  /** 今日のチャレンジを終えた日 */
  stamps: string[];
  /** やりとげたもの。今日のチャレンジ (daily-YYYY-MM-DD:正解数) と、その日に練習で全問正解した単元 (unit-単元-g学年-YYYY-MM-DD。前の日のものは消す) */
  clears: string[];
  cards: OwnedCard[];
  /** カードのほかにポイントを使ったもの (今は使っていない。形をそろえるために残す) */
  spent: Record<string, number>;
  settings: Settings;
  progress: Record<string, Progress>;
}

export function emptySnapshot(): Snapshot {
  return { stamps: [], clears: [], cards: [], spent: {}, settings: { grade: null, sound: null, at: 0 }, progress: {} };
}

/** 記録が 1 つでもあるか (設定だけのときは「ない」とみなす) */
export function hasRecords(s: Snapshot): boolean {
  return (
    s.stamps.length > 0 ||
    s.clears.length > 0 ||
    s.cards.length > 0 ||
    Object.keys(s.spent).length > 0 ||
    Object.values(s.progress).some((p) => p.done || p.results.length > 0)
  );
}

export const isGrade = (v: unknown): v is Grade => typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 6;

// ---- Firestore に保存する形 (小学生向けの学習アプリで共通。Wordlynx と同じ形) ----
//
//   users/{uid}                                その人の情報 (全アプリ共通)。名前やメールアドレスは入れない
//   users/{uid}/apps/{appId}                   アプリごとの記録のまとめ (AppDoc)
//   users/{uid}/apps/{appId}/progress/{itemId} 教材 1 つごとの途中経過 (ProgressDoc)
//
// 国語マスターの appId は "kokugo-master"。

export const SCHEMA = 1;
export const APP_ID = 'kokugo-master';

export interface AppDoc {
  schema: number;
  updatedAt: number;
  /** その日の目標を達成した日 (YYYY-MM-DD)。国語マスターでは今日のチャレンジを終えた日 */
  activeDays: string[];
  /** やりとげた教材の id */
  completed: string[];
  /** 手に入れたごほうび。国語マスターではヤマネコカード */
  inventory: Record<string, { paid: number }>;
  spent: Record<string, number>;
  settings: Record<string, unknown>;
}

export interface ProgressDoc {
  schema: number;
  updatedAt: number;
  status: 'playing' | 'done';
  data: Record<string, unknown>;
}

export function toAppDoc(s: Snapshot, now: number): AppDoc {
  return {
    schema: SCHEMA,
    updatedAt: now,
    activeDays: s.stamps,
    completed: s.clears,
    inventory: Object.fromEntries(s.cards.map((c) => [c.id, { paid: c.paid }])),
    spent: s.spent,
    settings: { grade: s.settings.grade, sound: s.settings.sound, at: s.settings.at },
  };
}

const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);

/** Firestore から読んだものは形がくずれているかもしれないので、1 つずつ確かめながらもどす */
export function fromAppDoc(doc: Partial<AppDoc> | null | undefined): Snapshot {
  const s = emptySnapshot();
  if (!doc) return s;
  s.stamps = strings(doc.activeDays);
  s.clears = strings(doc.completed);
  for (const [id, item] of Object.entries(doc.inventory ?? {})) {
    if (typeof item?.paid === 'number' && item.paid >= 0) s.cards.push({ id, paid: item.paid });
  }
  for (const [key, points] of Object.entries(doc.spent ?? {})) {
    if (typeof points === 'number' && points > 0) s.spent[key] = points;
  }
  const st = doc.settings ?? {};
  s.settings = {
    grade: isGrade(st.grade) ? st.grade : null,
    sound: typeof st.sound === 'boolean' ? st.sound : null,
    at: typeof st.at === 'number' ? st.at : 0,
  };
  return s;
}

export function toProgressDoc(p: Progress, now: number): ProgressDoc {
  return { schema: SCHEMA, updatedAt: p.at ?? now, status: p.done ? 'done' : 'playing', data: { sig: p.sig, results: p.results } };
}

export function fromProgressDoc(doc: Partial<ProgressDoc> | null | undefined): Progress | null {
  const d = doc?.data;
  if (!d || typeof d.sig !== 'string' || !Array.isArray(d.results)) return null;
  return {
    sig: d.sig,
    results: d.results.map((r) => (r === 1 ? 1 : 0)),
    done: doc?.status === 'done',
    at: typeof doc?.updatedAt === 'number' ? doc.updatedAt : undefined,
  };
}
