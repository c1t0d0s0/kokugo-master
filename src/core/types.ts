// 問題の形。データ (src/data/units/*.ts) はこの形で書く。
//
// 文字の書き方 (どの種類の問題でも共通):
// - 「漢字(かんじ)」と書くと、ふりがな付きで表示される (かっこは半角)。その学年でまだ習わない漢字には付ける
// - 文の中で注目させたいところは［ ］(全角の角かっこ) でかこむ → 太字・下線で表示される
// - 空らんは ＿＿ (全角のアンダースコア 2 つ) → 四角い空らんで表示される
//
// 選択肢の問題 (choice / karuta) は、**正解をかならず options[0] に書く**。画面では毎回ならびかえて出す。

export type Grade = 1 | 2 | 3 | 4 | 5 | 6;

interface Base {
  /** 全部の問題で重ならない id。単元の id + 番号 (例: "kotowaza-012") */
  id: string;
  /** いちばん合う学年。その学年から 2 学年上まで出題される */
  g: Grade;
  /** 答えたあとに出す説明 (1〜2 文) */
  explain: string;
}

/** 4 つ (3〜5 つ) の中から 1 つをえらぶ */
export interface ChoiceQ extends Base {
  kind: 'choice';
  /** 問い (例:「つぎの 四字熟語の 意味は どれ？」) */
  prompt: string;
  /** 大きく見せる文や言葉 (なくてもよい) */
  text?: string;
  /** 正解を options[0] に書く */
  options: string[];
}

/** かるたの札から えらぶ (慣用句・ことわざ・故事成語の穴うめ)。text に ＿＿ を 1 つ入れる */
export interface KarutaQ extends Base {
  kind: 'karuta';
  prompt: string;
  text: string;
  /** 札に書く言葉。正解を options[0] に書く。4〜6 枚 */
  options: string[];
  /** 言葉の意味 (答えたあとに出す) */
  meaning: string;
}

/** 2 枚 1 組の札合わせ (類義語・対義語)。3〜4 組 */
export interface PairQ extends Base {
  kind: 'pair';
  prompt: string;
  pairs: [string, string][];
}

/** タイルをならべて作る (ローマ字・五七五など)。tiles は正しい順 */
export interface OrderQ extends Base {
  kind: 'order';
  prompt: string;
  /** 大きく見せる文や言葉 (ローマ字なら元のひらがな) */
  text?: string;
  tiles: string[];
  /** まぎらわしいタイル (使わないもの)。なくてもよい */
  extra?: string[];
  /** 答えを見せるときにタイルの間に入れる文字。ローマ字は ''、俳句は ' ' */
  joiner: string;
}

/** 文を区切った中から 1 つをタップしてえらぶ (主語・述語など) */
export interface PickQ extends Base {
  kind: 'pick';
  prompt: string;
  /** 文を区切ったもの。つなげると元の文になる */
  parts: string[];
  /** 正解の parts の番号 (0 から) */
  answer: number;
}

export type Question = ChoiceQ | KarutaQ | PairQ | OrderQ | PickQ;

export type AreaId = 'goi' | 'bunpo' | 'hyoki' | 'bunka';

export interface Unit {
  id: string;
  area: AreaId;
  /** 単元の名前 (ふりがな記法つき) */
  name: string;
  /** 一言の説明 */
  note: string;
  questions: Question[];
}

export const GRADES: Grade[] = [1, 2, 3, 4, 5, 6];

/** その学年で出す問題か。ちょうどの学年から 2 学年下まで */
export function fitsGrade(q: Question, grade: Grade): boolean {
  return q.g <= grade && q.g >= grade - 2;
}
