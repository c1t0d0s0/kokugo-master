import type { AreaId, Unit } from '../core/types';
import { questions as goshu } from './units/goshu';
import { questions as haiku } from './units/haiku';
import { questions as hinshi } from './units/hinshi';
import { questions as kanazukai } from './units/kanazukai';
import { questions as katakana } from './units/katakana';
import { questions as keigo } from './units/keigo';
import { questions as kobun } from './units/kobun';
import { questions as kosoado } from './units/kosoado';
import { questions as kanyoku } from './units/kanyoku';
import { questions as kotowaza } from './units/kotowaza';
import { questions as kutoten } from './units/kutoten';
import { questions as romaji } from './units/romaji';
import { questions as ruigi } from './units/ruigi';
import { questions as shugo } from './units/shugo';
import { questions as tsunagi } from './units/tsunagi';
import { questions as yoji } from './units/yoji';

export const AREAS: { id: AreaId; name: string; color: string }[] = [
  { id: 'goi', name: 'ことばの 知識(ちしき)', color: 'goi' },
  { id: 'bunpo', name: '文法(ぶんぽう)・ことばの きまり', color: 'bunpo' },
  { id: 'hyoki', name: '表記(ひょうき)', color: 'hyoki' },
  { id: 'bunka', name: '言語(げんご)文化(ぶんか)', color: 'bunka' },
];

export const UNITS: Unit[] = [
  { id: 'kanyoku', area: 'goi', name: '慣用句(かんようく)', note: 'かるたで 穴(あな)うめ', questions: kanyoku },
  { id: 'kotowaza', area: 'goi', name: 'ことわざ・故事成語(こじせいご)', note: 'かるたで 穴(あな)うめ', questions: kotowaza },
  { id: 'yoji', area: 'goi', name: '四字熟語(よじじゅくご)', note: '意味(いみ)を 答えよう', questions: yoji },
  { id: 'ruigi', area: 'goi', name: '類義語(るいぎご)・対義語(たいぎご)', note: '2 枚(まい) 1 組の 札(ふだ)合わせ', questions: ruigi },
  { id: 'goshu', area: 'goi', name: '和語(わご)・漢語(かんご)・外来語(がいらいご)', note: '使い分けを えらぼう', questions: goshu },
  { id: 'shugo', area: 'bunpo', name: '主語(しゅご)・述語(じゅつご)・修飾語(しゅうしょくご)', note: '文の 中から えらぼう', questions: shugo },
  { id: 'hinshi', area: 'bunpo', name: '品詞(ひんし)', note: '名詞(めいし)・動詞(どうし)・形容詞(けいようし)を 見分けよう', questions: hinshi },
  { id: 'kosoado', area: 'bunpo', name: 'こそあど言葉', note: '指(さ)している 言葉は？', questions: kosoado },
  { id: 'tsunagi', area: 'bunpo', name: 'つなぎ言葉', note: '「だから」「しかし」を 入れよう', questions: tsunagi },
  { id: 'keigo', area: 'bunpo', name: '敬語(けいご)', note: '尊敬語(そんけいご)・謙譲語(けんじょうご)・丁寧語(ていねいご)', questions: keigo },
  { id: 'kanazukai', area: 'hyoki', name: 'かなづかい・送りがな', note: '「こおり」？「こうり」？', questions: kanazukai },
  { id: 'katakana', area: 'hyoki', name: 'かたかなで 書く 言葉', note: '外来語(がいらいご)や 鳴き声', questions: katakana },
  { id: 'romaji', area: 'hyoki', name: 'ローマ字', note: '読み書きと タイルならべ', questions: romaji },
  { id: 'kutoten', area: 'hyoki', name: '句読点(くとうてん)・かぎ', note: '「、」「。」「 」の 打ち方', questions: kutoten },
  { id: 'haiku', area: 'bunka', name: '季語(きご)・俳句(はいく)・短歌(たんか)', note: '季節(きせつ)当てと 五七五', questions: haiku },
  { id: 'kobun', area: 'bunka', name: '昔(むかし)の 言葉・古文(こぶん)', note: '「いとをかし」って どんな 意味(いみ)？', questions: kobun },
];

export const unitById = (id: string): Unit | undefined => UNITS.find((u) => u.id === id);

/** 問題の id から単元をさがす */
export const unitOfQuestion = (qid: string): Unit | undefined => UNITS.find((u) => u.questions.some((q) => q.id === qid));
