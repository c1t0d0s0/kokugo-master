import { beforeEach, describe, expect, it } from 'vitest';
import { Sync, type AuthPort, type Remote, type SyncHooks } from '../src/cloud/sync';
import { addDays, jstDate } from '../src/core/date';
import { dailyClearId } from '../src/core/rewards';
import { emptySnapshot, type Snapshot } from '../src/core/snapshot';
import {
  addClear,
  addStamp,
  balance,
  buyCard,
  currentUid,
  exportSnapshot,
  getCards,
  getClears,
  getGrade,
  getStamps,
  loadProgress,
  onStorageChange,
  pruneOldClears,
  rememberedUid,
  saveProgress,
  setGrade,
  unitClearId,
  unitCleared,
  useStore,
} from '../src/core/storage';
import { CARDS } from '../src/data/cards';


// ---- 代用品 ----

/** 端末ごとの localStorage。current を入れかえると、別の端末になる */
let current = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (k: string) => current.get(k) ?? null,
    setItem: (k: string, v: string) => void current.set(k, v),
    removeItem: (k: string) => void current.delete(k),
    key: (i: number) => [...current.keys()][i] ?? null,
    get length() {
      return current.size;
    },
  },
});

/** メモリ上の Firestore。fail を true にすると、通信できない状態になる */
class FakeCloud implements Remote {
  data = new Map<string, Snapshot>();
  fail = false;
  writes = 0;
  reads = 0;
  private check() {
    if (this.fail) throw new Error('offline');
  }
  private copy<T>(v: T): T {
    return JSON.parse(JSON.stringify(v)) as T;
  }
  async loadAll(uid: string) {
    this.check();
    this.reads++;
    const s = this.data.get(uid);
    return s ? this.copy(s) : null;
  }
  async loadSummary(uid: string) {
    this.check();
    this.reads++;
    const s = this.data.get(uid);
    return s ? { ...this.copy(s), progress: {} } : null;
  }
  async saveSummary(uid: string, snapshot: Snapshot) {
    this.check();
    this.writes++;
    const old = this.data.get(uid);
    this.data.set(uid, { ...this.copy(snapshot), progress: old?.progress ?? {} });
  }
  async saveProgress(uid: string, id: string, progress: Snapshot['progress'][string]) {
    this.check();
    this.writes++;
    const s = this.data.get(uid) ?? emptySnapshot();
    s.progress[id] = this.copy(progress);
    this.data.set(uid, s);
  }
  async deleteProgress(uid: string, id: string) {
    this.check();
    this.writes++;
    delete this.data.get(uid)?.progress[id];
  }
}

class FakeAuth implements AuthPort {
  private cb: (uid: string | null) => void = () => {};
  nextUid = 'alice';
  onUser(cb: (uid: string | null) => void) {
    this.cb = cb;
  }
  /** ページを開いたときに、ログインの状態が分かる */
  resolve(uid: string | null) {
    this.cb(uid);
  }
  async signIn() {
    this.cb(this.nextUid);
  }
  async signOut() {
    this.cb(null);
  }
}

interface Device {
  storage: Map<string, string>;
  auth: FakeAuth;
  sync: Sync;
  asked: number;
  dataChanged: number;
  answer: boolean;
}

function makeDevice(cloud: FakeCloud): Device {
  const d = { storage: new Map<string, string>(), auth: new FakeAuth(), asked: 0, dataChanged: 0, answer: true } as Device;
  const hooks: SyncHooks = {
    onStatus: () => {},
    onData: () => void d.dataChanged++,
    askMigrate: () => {
      d.asked++;
      return d.answer;
    },
  };
  d.sync = new Sync(cloud, d.auth, hooks, { debounceMs: 60_000, retryMs: 60_000 });
  return d;
}

/** その端末を手に取る (localStorage と、記録の場所と、書きかえの知らせ先を切りかえる) */
function use(d: Device): void {
  current = d.storage;
  useStore(d.sync.uid);
  d.sync.attach();
}

const done = { sig: 's', results: [1, 1, 0], done: true };
const playing = { sig: 's', results: [1], done: false };
const today = jstDate();
const daysBefore = (n: number) => Array.from({ length: n }, (_, i) => addDays(today, -i));
const pid = (date: string) => `daily-${date}-g3`;
/** その日の今日のチャレンジを、正解 score 問で終えた記録 */
const finish = (date: string, score: number) => {
  addClear(dailyClearId(date, score));
  addStamp(date);
};

let cloud: FakeCloud;
let a: Device;

beforeEach(() => {
  cloud = new FakeCloud();
  a = makeDevice(cloud);
  onStorageChange(null);
  use(a);
  a.sync.start();
});

describe('ログインしない人', () => {
  it('この端末だけに記録される (Firestore には何も送らない)', async () => {
    a.auth.resolve(null);
    await a.sync.flush();
    expect(a.sync.status).toBe('signed-out');
    finish(today, 8);
    saveProgress(pid(today), done);
    await a.sync.flush();
    expect(cloud.writes).toBe(0);
    expect(cloud.reads).toBe(0);
    expect(currentUid()).toBeNull();
    expect(a.storage.has('kokugo:v1:stamps')).toBe(true);
    expect(balance()).toBe(80);
  });
});

describe('ログインして記録をうつす', () => {
  beforeEach(async () => {
    a.auth.resolve(null);
    await a.sync.flush();
    // ログインなしで 7 日つづけた (毎日 10 問中 10 問 → 150pt。7 日で 500pt)
    for (const d of daysBefore(7)) finish(d, 10);
    saveProgress(pid(today), done);
    expect(balance()).toBe(7 * 150 + 500);
    expect(buyCard(CARDS[0])).toBe(true); // 40pt
  });

  it('「うつす」をえらぶと、Firestore に入り、端末のログインなしの記録は消える', async () => {
    await a.sync.signIn();
    await a.sync.flush();
    expect(a.asked).toBe(1);
    expect(a.sync.status).toBe('synced');
    const remote = cloud.data.get('alice')!;
    expect(remote.stamps).toHaveLength(7);
    expect(remote.clears).toHaveLength(7);
    expect(remote.cards).toEqual([{ id: 'km01', paid: 40 }]);
    expect(remote.progress[pid(today)].done).toBe(true);
    expect(currentUid()).toBe('alice');
    expect(balance()).toBe(7 * 150 + 500 - 40);
    expect([...a.storage.keys()].filter((k) => k.startsWith('kokugo:v1:'))).toEqual([]);
    expect(rememberedUid()).toBe('alice');
  });

  it('「うつさない」をえらぶと、アカウントの記録だけになり、ログアウトするともどる', async () => {
    a.answer = false;
    await a.sync.signIn();
    await a.sync.flush();
    expect(getStamps()).toEqual([]);
    expect(balance()).toBe(0);
    expect(await a.sync.signOut()).toBe('ok');
    await a.sync.flush();
    expect(currentUid()).toBeNull();
    expect(getStamps()).toHaveLength(7);
  });

  it('アカウントにすでに記録があるときは、両方を合わせる', async () => {
    cloud.data.set('alice', {
      ...emptySnapshot(),
      stamps: [addDays(today, -7)],
      clears: [dailyClearId(addDays(today, -7), 5), dailyClearId(today, 3)],
      cards: [{ id: 'km02', paid: 80 }],
    });
    await a.sync.signIn();
    await a.sync.flush();
    expect(getStamps()).toHaveLength(8);
    expect(getCards().map((c) => c.id).sort()).toEqual(['km01', 'km02']);
    // 同じ日の記録が 2 つあっても、よいほうだけを数える (今日は 10 問)
    expect(balance()).toBe(7 * 150 + 50 + 500 - 120);
  });
});

describe('ブラウザを変えても記録が続く', () => {
  it('端末 A で遊んだ記録が、端末 B でログインすると出てくる', async () => {
    await a.sync.signIn();
    await a.sync.flush();
    finish(today, 6);
    saveProgress(pid(today), playing);
    setGrade(5);
    await a.sync.flush();
    expect(a.sync.status).toBe('synced');

    const b = makeDevice(cloud);
    use(b);
    b.sync.start();
    b.auth.resolve(null);
    await b.sync.flush();
    await b.sync.signIn();
    await b.sync.flush();
    expect(b.asked).toBe(0);
    expect(getStamps()).toEqual([today]);
    expect(balance()).toBe(60);
    expect(loadProgress(pid(today), 's').results).toEqual([1]);
    expect(getGrade()).toBe(5);
  });

  it('2 台で別々に遊んでも、どちらの記録も残り、途中経過は進んだほう', async () => {
    await a.sync.signIn();
    await a.sync.flush();
    const b = makeDevice(cloud);
    use(b);
    b.sync.start();
    await b.sync.signIn();
    await b.sync.flush();

    finish(addDays(today, -1), 4);
    saveProgress(pid(today), done);
    use(a);
    finish(today, 7);
    saveProgress(pid(today), playing);
    await a.sync.flush();
    use(b);
    await b.sync.flush();
    expect(getClears().length).toBe(2);
    expect(balance()).toBe(40 + 70);
    expect(cloud.data.get('alice')!.progress[pid(today)].done).toBe(true);
  });

  it('前の日までの途中経過は、取りこまずに Firestore からも消す', async () => {
    cloud.data.set('alice', { ...emptySnapshot(), progress: { [pid(addDays(today, -1))]: done, [pid(today)]: playing } });
    await a.sync.signIn();
    await a.sync.flush();
    expect(Object.keys(exportSnapshot().progress)).toEqual([pid(today)]);
    expect(Object.keys(cloud.data.get('alice')!.progress)).toEqual([pid(today)]);
  });
});

describe('通信できないとき', () => {
  it('手元の写しで遊べて、つながったら送る', async () => {
    await a.sync.signIn();
    await a.sync.flush();
    cloud.fail = true;
    finish(today, 10);
    await a.sync.flush();
    expect(a.sync.status).toBe('offline');
    expect(a.sync.hasPending()).toBe(true);
    expect(balance()).toBe(150);
    cloud.fail = false;
    await a.sync.flush();
    expect(a.sync.status).toBe('synced');
    expect(cloud.data.get('alice')!.stamps).toEqual([today]);
  });
});

describe('ログアウト', () => {
  it('この端末から、その人の写しが消える', async () => {
    await a.sync.signIn();
    await a.sync.flush();
    finish(today, 3);
    expect(await a.sync.signOut()).toBe('ok');
    await a.sync.flush();
    expect(currentUid()).toBeNull();
    expect([...a.storage.keys()].filter((k) => k.startsWith('kokugo:u:'))).toEqual([]);
    expect(getClears()).toEqual([]);
    expect(cloud.data.get('alice')!.clears).toEqual([dailyClearId(today, 3)]);
  });

  it('送れていない変更があるときは、たしかめてからでないとログアウトしない', async () => {
    await a.sync.signIn();
    await a.sync.flush();
    cloud.fail = true;
    finish(today, 3);
    expect(await a.sync.signOut()).toBe('unsynced');
    expect(await a.sync.signOut(true)).toBe('ok');
    await a.sync.flush();
    expect(currentUid()).toBeNull();
  });
});

describe('単元のはなまる (その日だけ)', () => {
  const yesterday = addDays(today, -1);

  it('今日つけたはなまるは見え、次の日には見えない', () => {
    addClear(unitClearId('yoji', 4, today));
    expect(unitCleared('yoji', 4, today)).toBe(true);
    expect(unitCleared('yoji', 4, addDays(today, 1))).toBe(false);
    expect(unitCleared('yoji', 5, today)).toBe(false);
  });

  it('ホームを開くと、前の日のはなまるは消え、今日のチャレンジの記録とポイントは残る', () => {
    finish(yesterday, 10);
    addClear(unitClearId('yoji', 4, yesterday));
    addClear('unit-kanyoku-g4'); // 日付のない前の形
    addClear(unitClearId('ruigi', 4, today));
    pruneOldClears(today);
    expect(getClears().sort()).toEqual([dailyClearId(yesterday, 10), unitClearId('ruigi', 4, today)].sort());
    expect(balance()).toBe(150);
  });

  it('Firestore にある前の日のはなまるも、合わせたあとは手元にも Firestore にも残らない', async () => {
    cloud.data.set('alice', {
      ...emptySnapshot(),
      clears: [dailyClearId(yesterday, 7), unitClearId('yoji', 4, yesterday), 'unit-kanyoku-g4', unitClearId('ruigi', 4, today)],
    });
    await a.sync.signIn();
    await a.sync.flush();
    const expected = [dailyClearId(yesterday, 7), unitClearId('ruigi', 4, today)].sort();
    expect(getClears().sort()).toEqual(expected);
    expect(cloud.data.get('alice')!.clears.slice().sort()).toEqual(expected);
    expect(balance()).toBe(70);

    // 変更を送るときも、Firestore に古いはなまるが入っていたら消してから書く
    cloud.data.get('alice')!.clears.push(unitClearId('keigo', 5, yesterday));
    addClear(unitClearId('keigo', 5, today));
    await a.sync.flush();
    expect(cloud.data.get('alice')!.clears).not.toContain(unitClearId('keigo', 5, yesterday));
    expect(cloud.data.get('alice')!.clears).toContain(unitClearId('keigo', 5, today));
  });
});
