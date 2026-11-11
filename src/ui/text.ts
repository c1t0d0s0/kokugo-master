import { CORRECT_POINTS, DAILY_COUNT, MONTH_POINTS, PERFECT_POINTS, PRACTICE_POINTS, WEEK_LENGTH, WEEK_POINTS } from '../core/rewards';

// 画面の文言。1 年生も読めるよう、ひらがなを多くし、むずかしい漢字には「漢字(かんじ)」でふりがなを付ける
// (rich() で表示する文だけ。ボタンなどの短い文は、ひらがなと 1〜2 年生の漢字だけで書く)
const pt = (n: number) => `${n.toLocaleString('ja-JP')}pt`;
const WEEKDAYS = '日月火水木金土';

export const TEXT = {
  brand: '国語マスター',
  brandRuby: '国語(こくご)マスター',
  lead: 'ことわざ・ことばの きまり・ローマ字・俳句(はいく)まで。毎日(まいにち) 10 問(もん)で ことばの 力を のばそう。',
  gradeLabel: '学年(がくねん)',
  gradeName: (g: number) => `${g}年生`,
  gradeAsk: 'なん年生か えらんでね',
  daily: '今日(きょう)のチャレンジ',
  dateLabel: (m: number, d: number, w: number) => `${m}月${d}日 (${WEEKDAYS[w]})`,
  dailyNote: (state: 'new' | 'playing' | 'done', score: number, answered: number) =>
    state === 'done'
      ? `${DAILY_COUNT}問(もん)中 ${score}問 せいかい！ また あした あそぼう`
      : state === 'playing'
        ? `${answered}問 まで こたえたよ。つづきから はじめよう`
        : `毎日(まいにち) ちがう ${DAILY_COUNT}問。せいかい 1問で ${pt(CORRECT_POINTS)}`,
  start: 'はじめる',
  resume: 'つづきから',
  review: 'もう一ど とく',
  unitsTitle: 'たんげんを えらんで れんしゅう',
  unitsNote: `れんしゅうでも、せいかい 1問で ${pt(PRACTICE_POINTS)} (1つの たんげんで 1日 1回)。ぜんぶ せいかいすると、その 日は はなまるが つくよ`,
  unitEmpty: 'この 学年の 問題(もんだい)は まだ ないよ',
  questions: (n: number) => `${n}問`,
  howto: 'あそびかた',
  howtoItems: [
    `「今日のチャレンジ」は 毎日 ちがう ${DAILY_COUNT}問。せいかい 1問で ${pt(CORRECT_POINTS)}、ぜんぶ せいかいで さらに ${pt(PERFECT_POINTS)}`,
    'チャレンジを さいごまで やると、スタンプカードに はなまるが おされるよ',
    `${WEEK_LENGTH}日 つづけるたびに ${pt(WEEK_POINTS)}、1か月 ぜんぶ そろうと ${pt(MONTH_POINTS)}`,
    'ためた ポイントで ヤマネコカードと こうかんできるよ',
    `たんげんの れんしゅうは なんかいでも できるよ。ポイントは せいかい 1問で ${pt(PRACTICE_POINTS)} (1つの たんげんで 1日 1回)`,
    'れんしゅうで ぜんぶ せいかいすると はなまるが つくよ。はなまるは つぎの 日に きえるよ',
    'URL に ?grade=3 と つけると、3年生で ひらけるよ',
  ],
  soundOn: '音：オン',
  soundOff: '音：オフ',
  goHome: 'ホームに もどる',
  // 問題の画面
  progress: (i: number, n: number) => `${i} / ${n}`,
  practiceTitle: 'れんしゅう',
  answer: 'こたえる',
  next: 'つぎへ',
  finish: 'けっかを 見る',
  correct: 'せいかい！',
  wrong: 'ざんねん…',
  correctIs: (a: string) => `こたえは「${a}」`,
  pairDone: 'ぜんぶ そろったね！',
  pairMiss: (n: number) => `まちがい ${n}回`,
  orderReset: 'やりなおす',
  orderCheck: 'できた！',
  lynxSay: {
    start: ['がんばろう！', 'いっしょに とこう！', 'よく 読んでね'],
    correct: ['すごい！', 'やったね！', 'その ちょうし！', 'さすが！'],
    wrong: ['おしい！', 'つぎは できるよ', 'ドンマイ！'],
  },
  // けっか
  resultTitle: (score: number) => (score === DAILY_COUNT ? 'ぜんもん せいかい！' : score >= 7 ? 'よく できました！' : 'おつかれさま！'),
  resultSub: (score: number, n: number) => `${n}問中 ${score}問 せいかい`,
  rewardScore: (p: number) => `チャレンジで +${pt(p)}`,
  rewardPerfect: `ぜんもん せいかいで +${pt(PERFECT_POINTS)} も 入っているよ`,
  rewardWeek: (run: number) => `${run}日 れんぞく！ +${pt(WEEK_POINTS)}`,
  rewardMonth: (m: number) => `${m}月の スタンプが ぜんぶ そろった！ +${pt(MONTH_POINTS)}`,
  stampDone: 'スタンプカードに はなまるが おされたよ',
  alreadyDone: 'きょうの ポイントは もう もらったよ (こたえなおしても ふえないよ)',
  unitCleared: 'ぜんもん せいかいで、きょうの はなまるが ついたよ',
  rewardPractice: (p: number) => `れんしゅうで +${pt(p)}`,
  practiceAlready: 'この たんげんの ポイントは、きょうは もう もらったよ',
  practiceChip: (n: number) => `きょう +${pt(n * PRACTICE_POINTS)} まで`,
  retry: 'もう一ど',
  reviewTitle: 'ふりかえり',
  // スタンプ・ポイント・カード
  pointsLabel: 'ポイント',
  points: pt,
  stampTitle: 'スタンプカード',
  stampMonth: (m: number) => `${m}月`,
  stampDayLabel: (d: number, stamped: boolean) => `${d}日${stamped ? ' スタンプあり' : ''}`,
  stampRun: (run: number, left: number) =>
    run > 0 ? `いま ${run}日 れんぞく！ あと ${left}日で ${pt(WEEK_POINTS)}` : `今日のチャレンジを やって、スタンプを ためよう`,
  stampRule: `${WEEK_LENGTH}日 つづけるたびに ${pt(WEEK_POINTS)}。その月の 1日から さいごの日まで ぜんぶ そろうと ${pt(MONTH_POINTS)}。`,
  seeStamps: 'スタンプカードを 見る',
  seeCards: 'ヤマネコカードを 見る',
  rewardLinks: 'スタンプとカード',
  cardsTitle: 'ヤマネコカード',
  cardsLead: 'ポイントを ためて、ヤマネコカードと こうかんしよう。ぜんぶで 20しゅるい あるよ。',
  cardsOwned: (n: number, all: number) => `${n} / ${all}まい`,
  cardBackLabel: (price: number) => `まだ もっていない カード。${pt(price)}`,
  cardShort: (n: number) => `あと ${pt(n)}`,
  cardGet: 'こうかんする',
  cardConfirm: (price: number) => `${pt(price)} つかって こうかんしますか？`,
  // ログインと記録の保存
  accountTitle: 'きろくの ほぞん',
  accountNote: 'Google で ログインすると、ほかの パソコンや タブレットでも 同じ きろくで あそべるよ (おうちの人と いっしょにね)。',
  signIn: 'Google で ログイン',
  signedIn: 'ログイン中',
  signOut: 'ログアウト',
  syncLoading: 'たしかめています…',
  syncSaving: 'ほぞんしています…',
  syncSaved: 'ほぞんしました',
  syncOffline: 'まだ ほぞんできていません (つながったら ほぞんします)',
  askMigrate: 'この たんまつの きろく (スタンプ・ポイント・カード) を、ログインした アカウントに うつしますか？',
  signOutUnsynced: 'まだ ほぞんできていない きろくが あります。ログアウトすると、その 分は きえます。ログアウトしますか？',
  signInFailed: 'ログインできませんでした。',
};

export type Text = typeof TEXT;
