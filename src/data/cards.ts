/** ヤマネコの絵柄の指定。指定しない項目は、タイトル画面のヤマネコと同じになる */
export interface Look {
  fur?: string;
  light?: string;
  pink?: string;
  /** 目に色をつける (夜のヤマネコなど) */
  eyeColor?: string;
  eyes?: 'open' | 'wink' | 'sleep' | 'happy' | 'sparkle' | 'brave';
  mouth?: 'tongue' | 'smile' | 'open';
  marks?: 'stripes' | 'spots' | 'none';
  items?: Item[];
}

export type Item =
  | 'ribbon'
  | 'glasses'
  | 'pencil'
  | 'hat'
  | 'scarf'
  | 'flower'
  | 'book'
  | 'headband'
  | 'headphones'
  | 'cap'
  | 'wizard'
  | 'crown'
  | 'zzz'
  // ---- ここから下は国語マスターのカードだけで使う持ち物 ----
  | 'fude'
  | 'hanko'
  | 'fuda'
  | 'tanzaku'
  | 'sensu'
  | 'jisho'
  | 'suzuri'
  | 'kasa'
  | 'hokamuri'
  | 'kanzashi'
  | 'mic'
  | 'kabuto'
  | 'uchiwa'
  | 'eboshi'
  | 'kanmuri'
  | 'ink'
  | 'monocle'
  | 'eri'
  | 'medal';

/** カードの背景。どれも国語マスターだけのもの (和のもようと、ことばにまつわる景色) */
export type Background =
  | 'hiragana'
  | 'ichimatsu'
  | 'tatami'
  | 'tanabata'
  | 'seigaiha'
  | 'shoji'
  | 'fuji'
  | 'yagasuri'
  | 'asanoha'
  | 'kokuban'
  | 'koinobori'
  | 'hanabi'
  | 'kasumi'
  | 'enso'
  | 'take'
  | 'kinbyobu';

/** カードのふち。墨 (ふつう)・朱 (めずらしい)・金 (とてもめずらしい) */
export type Frame = 'sumi' | 'shu' | 'kin';

export interface Card {
  id: string;
  /** 初級でも読めるよう、漢字は 3 年生までに習うものだけ */
  name: string;
  price: number;
  look: Look;
  bg: Background;
  frame: Frame;
}

/**
 * 値段の安い順。合計は 28,420pt (tests/quiz.test.ts で、集めるのにかかる日数を確かめている)。
 * 絵柄は国語マスターだけのもの。Wordlynx・Reading Quest・漢字クイズのカードや着せかえにある
 * 持ち物・背景・ふちは使わない (tests/cards.test.ts で確かめている)。
 */
export const CARDS: Card[] = [
  { id: 'km01', name: 'ふでの ヤマネコ', price: 40, look: { items: ['fude'], mouth: 'smile' }, bg: 'hiragana', frame: 'sumi' },
  { id: 'km02', name: 'はんこの ヤマネコ', price: 80, look: { items: ['hanko'], eyes: 'wink', mouth: 'smile' }, bg: 'ichimatsu', frame: 'sumi' },
  { id: 'km03', name: 'かるたの ヤマネコ', price: 300, look: { items: ['fuda'], eyes: 'happy', mouth: 'open' }, bg: 'tatami', frame: 'sumi' },
  { id: 'km04', name: 'たんざくの ヤマネコ', price: 500, look: { items: ['tanzaku'], eyes: 'sparkle', mouth: 'smile', fur: '#f1cf93' }, bg: 'tanabata', frame: 'sumi' },
  { id: 'km05', name: 'せんすの ヤマネコ', price: 800, look: { items: ['sensu'], eyes: 'happy', mouth: 'smile' }, bg: 'seigaiha', frame: 'sumi' },
  { id: 'km06', name: 'じしょを 引く ヤマネコ', price: 1000, look: { items: ['jisho'], eyes: 'brave', mouth: 'smile' }, bg: 'shoji', frame: 'sumi' },
  { id: 'km07', name: 'すずりの ヤマネコ', price: 1100, look: { items: ['suzuri', 'ink'], eyes: 'wink', mouth: 'open', fur: '#d9a55b' }, bg: 'enso', frame: 'sumi' },
  { id: 'km08', name: '旅を する ヤマネコ', price: 1200, look: { items: ['kasa'], mouth: 'smile', fur: '#dba862' }, bg: 'fuji', frame: 'sumi' },
  { id: 'km09', name: 'ほおかむり ヤマネコ', price: 1300, look: { items: ['hokamuri'], eyes: 'happy', mouth: 'tongue' }, bg: 'yagasuri', frame: 'sumi' },
  { id: 'km10', name: 'かんざしの ヤマネコ', price: 1400, look: { items: ['kanzashi', 'eri'], eyes: 'wink', mouth: 'smile', fur: '#f3c98b' }, bg: 'asanoha', frame: 'sumi' },
  { id: 'km11', name: '音読の ヤマネコ', price: 1500, look: { items: ['mic'], eyes: 'happy', mouth: 'open' }, bg: 'kokuban', frame: 'shu' },
  { id: 'km12', name: 'かぶとの ヤマネコ', price: 1600, look: { items: ['kabuto'], eyes: 'brave', mouth: 'open' }, bg: 'koinobori', frame: 'shu' },
  { id: 'km13', name: 'なつまつりの ヤマネコ', price: 1700, look: { items: ['uchiwa', 'eri'], eyes: 'sparkle', mouth: 'open', fur: '#e3b268' }, bg: 'hanabi', frame: 'shu' },
  { id: 'km14', name: 'えぼしの ヤマネコ', price: 1800, look: { items: ['eboshi', 'sensu'], mouth: 'smile', fur: '#cdb08a', light: '#fbf3e4' }, bg: 'kasumi', frame: 'shu' },
  { id: 'km15', name: 'しょどうの ヤマネコ', price: 1900, look: { items: ['fude', 'ink'], eyes: 'brave', mouth: 'smile', fur: '#c9984a' }, bg: 'enso', frame: 'shu' },
  { id: 'km16', name: 'はいくの ヤマネコ', price: 2000, look: { items: ['kasa', 'tanzaku'], eyes: 'sleep', mouth: 'smile', fur: '#b98d5e' }, bg: 'take', frame: 'shu' },
  { id: 'km17', name: 'ことばの はかせ ヤマネコ', price: 2200, look: { items: ['monocle', 'jisho'], mouth: 'smile', fur: '#d8b27a' }, bg: 'kokuban', frame: 'kin' },
  { id: 'km18', name: 'かぐやひめの ヤマネコ', price: 2400, look: { items: ['kanzashi', 'sensu'], eyes: 'sparkle', mouth: 'smile', fur: '#f6e6c4', light: '#ffffff', pink: '#f6b6c8', marks: 'none' }, bg: 'take', frame: 'kin' },
  { id: 'km19', name: '百人一首の ヤマネコ', price: 2600, look: { items: ['kanmuri', 'fuda'], eyes: 'happy', mouth: 'smile', fur: '#e6c48a' }, bg: 'kasumi', frame: 'kin' },
  { id: 'km20', name: '国語マスター ヤマネコ', price: 3000, look: { items: ['kanmuri', 'medal'], eyes: 'sparkle', mouth: 'open', fur: '#f0c260' }, bg: 'kinbyobu', frame: 'kin' },
];
