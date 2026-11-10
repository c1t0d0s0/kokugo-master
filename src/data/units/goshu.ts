import type { Question } from '../../core/types';

const KINDS = ['和語', '漢語', '外来語'];
/** 正解の 言葉の 種類を 先頭に した 選択肢 */
const kind = (k: string): string[] => [k, ...KINDS.filter((x) => x !== k)];

const WHAT = 'つぎの 言葉は、和語・漢語・外来語の どれ？';

// 言葉の 種類の 説明 (正解を 先頭に ならべかえて 使う)
const WAGO = 'もともと 日本に あった 言葉で、やわらかく 親しみの ある 感じが する';
const KANGO = '漢字の 音読みで 読み、かたく 改まった 感じが する。短く 正確に 言い表せる';
const GAIRAI = '主に 西洋などの 外国から 入って きた 言葉で、ふつう かたかなで 書く';
const KONSHU = 'いくつかの 種類の 言葉が 組み合わさって できて いる';
const FEATURES = [WAGO, KANGO, GAIRAI, KONSHU];
const feature = (f: string): string[] => [f, ...FEATURES.filter((x) => x !== f)];

const MIX = ['和語＋漢語', '和語＋外来語', '漢語＋外来語', '外来語＋漢語', '漢語＋漢語', '外来語＋外来語'];
/** 混種語の 組み合わせの 選択肢 (正解と ほか 3 つ) */
const mix = (m: string, ...others: string[]): string[] => [m, ...others.filter((x) => MIX.includes(x))];

export const questions: Question[] = [
  // ---- 3年 ----
  {
    id: 'goshu-001', g: 3, kind: 'choice',
    prompt: 'つぎの 中で、外来語は どれ？',
    options: ['ノート', 'ふでばこ', '学校', '手紙'],
    explain: '「ノート」は 英語(えいご)から 入って きた 外来語だよ。外来語は かたかなで 書くよ。',
  },
  {
    id: 'goshu-002', g: 3, kind: 'choice',
    prompt: 'つぎの 中で、外来語は どれ？',
    options: ['パン', 'ごはん', '牛肉', '野菜(やさい)'],
    explain: '「パン」は、むかし ポルトガル語から 入って きた 外来語だよ。',
  },
  {
    id: 'goshu-003', g: 3, kind: 'choice',
    prompt: 'つぎの 中で、漢語は どれ？',
    options: ['学校', 'やま', 'はな', 'くつ'],
    explain: '「学校」は「がっ・こう」と 漢字の 音読みで 読む 漢語だよ。',
  },
  {
    id: 'goshu-004', g: 3, kind: 'choice',
    prompt: 'つぎの 中で、和語は どれ？',
    options: ['はなし', '会話', 'スピーチ'],
    explain: '「はなし」は もともと 日本に あった 和語。「会話」は 漢語、「スピーチ」は 外来語だよ。',
  },
  {
    id: 'goshu-005', g: 3, kind: 'choice',
    prompt: '漢字の 音読みで 読む 言葉を、何と いう？',
    options: kind('漢語'),
    explain: '漢語は、むかし 中国から 伝(つた)わった 言葉や、それを まねて 作った 言葉だよ。',
  },
  {
    id: 'goshu-006', g: 3, kind: 'choice',
    prompt: '外来語は、ふつう どの 文字で 書く？',
    options: ['かたかな', 'ひらがな', '漢字'],
    explain: '「テレビ」「ボール」のように、外来語は かたかなで 書くよ。',
  },
  {
    id: 'goshu-007', g: 3, kind: 'choice',
    prompt: 'もともと 日本に あった 言葉を、何と いう？',
    options: kind('和語'),
    explain: '「やま」「かわ」「たべる」のような 言葉が 和語だよ。漢字の 訓(くん)読みで 読む 言葉も 和語だよ。',
  },

  // ---- 4年 ----
  {
    id: 'goshu-008', g: 4, kind: 'choice',
    prompt: 'にた 意味の 三つの 言葉です。漢語は どれ？',
    options: ['旅館', '宿屋(やどや)', 'ホテル'],
    explain: '「りょ・かん」と 音読みで 読む「旅館」が 漢語。「宿屋(やどや)」は 和語、「ホテル」は 外来語だよ。',
  },
  {
    id: 'goshu-009', g: 4, kind: 'choice',
    prompt: 'にた 意味の 三つの 言葉です。外来語は どれ？',
    options: ['スピード', '速さ', '速度'],
    explain: '「スピード」は 英語から 来た 外来語。「速さ」は 和語、「速度」は 漢語だよ。',
  },
  {
    id: 'goshu-010', g: 4, kind: 'choice',
    prompt: 'にた 意味の 三つの 言葉です。和語は どれ？',
    options: ['決まり', '規則(きそく)', 'ルール'],
    explain: '「決まり」は 訓読みの 和語。「規則(きそく)」は 漢語、「ルール」は 外来語だよ。',
  },
  {
    id: 'goshu-011', g: 4, kind: 'choice',
    prompt: '［昼ごはん］を 漢語で 言うと どれ？',
    options: ['昼食(ちゅうしょく)', 'ランチ', 'お昼'],
    explain: '「ちゅう・しょく」と 音読みで 読む「昼食」が 漢語。「ランチ」は 外来語だよ。',
  },
  {
    id: 'goshu-012', g: 4, kind: 'choice',
    prompt: '外来語の［テスト］と 同じ 意味の 漢語は どれ？',
    options: ['試験', '練習', '宿題', '遊び'],
    explain: '「テスト」は「試験」の ことだよ。',
  },
  {
    id: 'goshu-013', g: 4, kind: 'choice',
    prompt: '［山登り］を 漢語で 言うと どれ？',
    options: ['登山', 'ハイキング', '山道(やまみち)'],
    explain: '「と・ざん」と 音読みで 読む「登山」が 漢語だよ。',
  },
  {
    id: 'goshu-014', g: 4, kind: 'choice',
    prompt: 'つぎの 中で、漢語は どれ？',
    options: ['午前', '朝', 'ゆうがた', 'モーニング'],
    explain: '「ご・ぜん」と 音読みで 読む「午前」が 漢語。「朝」「ゆうがた」は 和語だよ。',
  },
  {
    id: 'goshu-015', g: 4, kind: 'choice',
    prompt: '［くだもの］を 漢語で 言うと どれ？',
    options: ['果実', 'フルーツ', '木の実'],
    explain: '「か・じつ」と 音読みで 読む「果実」が 漢語。「フルーツ」は 外来語、「木の実」は 和語だよ。',
  },
  {
    id: 'goshu-016', g: 4, kind: 'choice',
    prompt: 'つぎの 中で、外来語は どれ？',
    options: ['テレビ', '電話', '新聞', '手紙'],
    explain: '「テレビ」は 英語の テレビジョンを 短く した 外来語だよ。',
  },

  // ---- 5年 ----
  {
    id: 'goshu-017', g: 5, kind: 'choice',
    prompt: '［消しゴム］のように、和語・漢語・外来語が 組み合わさって できた 言葉を 何と いう？',
    options: ['混種語(こんしゅご)', '和語', '漢語', '外来語'],
    explain: '「消し」は 和語、「ゴム」は 外来語。このような 言葉を 混種語(こんしゅご)と いうよ。',
  },
  {
    id: 'goshu-018', g: 5, kind: 'choice',
    prompt: 'つぎの 中で、混種語(こんしゅご)は どれ？',
    options: ['電子レンジ', '調理', 'なべ', 'キッチン'],
    explain: '「電子」は 漢語、「レンジ」は 外来語なので、「電子レンジ」は 混種語だよ。',
  },
  {
    id: 'goshu-019', g: 5, kind: 'choice',
    prompt: '外来語の［ルール］と 同じ 意味の 漢語は どれ？',
    options: ['規則', '決まり', 'マナー'],
    explain: '「規則」は 音読みの 漢語。「決まり」も 同じ 意味だけれど 和語だよ。',
  },
  {
    id: 'goshu-020', g: 5, kind: 'choice',
    prompt: '漢語の 説明として 正しい ものは どれ？',
    options: feature(KANGO),
    explain: '「開始」「規則」のような 漢語は、かたい 感じが するけれど、短く 正確に 伝えられるよ。',
  },
  {
    id: 'goshu-021', g: 5, kind: 'choice',
    prompt: '和語の 説明として 正しい ものは どれ？',
    options: feature(WAGO),
    explain: '「始め」「決まり」のような 和語は、やわらかく 親しみの ある 感じが するよ。',
  },
  {
    id: 'goshu-022', g: 5, kind: 'choice',
    prompt: '外来語の 説明として 正しい ものは どれ？',
    options: feature(GAIRAI),
    explain: '「スタート」「ルール」のような 外来語は、新しい 感じや 軽い 感じが するよ。',
  },
  {
    id: 'goshu-023', g: 5, kind: 'choice', prompt: WHAT,
    text: '生物(なまもの)',
    options: kind('和語'),
    explain: '「なま・もの」は 訓読みなので 和語。同じ 漢字でも「せいぶつ」と 読むと 漢語に なるよ。',
  },
  {
    id: 'goshu-024', g: 5, kind: 'choice', prompt: WHAT,
    text: '生物(せいぶつ)',
    options: kind('漢語'),
    explain: '「せい・ぶつ」は 音読みなので 漢語。「なまもの」と 読むと 和語に なるよ。',
  },
  {
    id: 'goshu-025', g: 5, kind: 'choice', prompt: WHAT,
    text: '色紙(しきし)',
    options: kind('漢語'),
    explain: '「しき・し」は 音読みなので 漢語。「いろがみ」と 読むと 和語に なるよ。',
  },
  {
    id: 'goshu-026', g: 5, kind: 'choice', prompt: WHAT,
    text: '市場(いちば)',
    options: kind('和語'),
    explain: '「いち・ば」は 訓読みなので 和語。「しじょう」と 読むと 漢語に なるよ。',
  },
  {
    id: 'goshu-027', g: 5, kind: 'choice',
    prompt: '［サッカー部］は、どんな 言葉の 組み合わせ？',
    options: mix('外来語＋漢語', '和語＋漢語', '外来語＋和語', '漢語＋漢語'),
    explain: '「サッカー」は 外来語、「部(ぶ)」は 音読みの 漢語だよ。',
  },
  {
    id: 'goshu-028', g: 5, kind: 'choice',
    prompt: '［歯ブラシ］は、どんな 言葉の 組み合わせ？',
    options: mix('和語＋外来語', '漢語＋外来語', '外来語＋外来語', '和語＋漢語'),
    explain: '「歯(は)」は 訓読みの 和語、「ブラシ」は 外来語だよ。',
  },
  {
    id: 'goshu-029', g: 5, kind: 'choice',
    prompt: 'ひらがなで 書く ことも 多いけれど、じつは 外来語なのは どれ？',
    options: ['かるた', 'すもう', 'こま', 'たこあげ'],
    explain: '「かるた」は、むかし ポルトガル語から 入って きた 外来語だよ。',
  },
  {
    id: 'goshu-030', g: 5, kind: 'choice',
    prompt: 'にた 意味の 三つの 言葉です。漢語は どれ？',
    options: ['開始', '始め', 'スタート'],
    explain: '「かい・し」と 音読みで 読む「開始」が 漢語。「始め」は 和語、「スタート」は 外来語だよ。',
  },

  // ---- 6年 ----
  {
    id: 'goshu-031', g: 6, kind: 'choice',
    prompt: '外来語の［リサイクル］を 漢語で 言いかえると どれ？',
    options: ['再利用', '再出発', '再放送', '再開'],
    explain: 'リサイクルは、使い終わった 物を もう 一度 利用する ことだよ。',
  },
  {
    id: 'goshu-032', g: 6, kind: 'choice',
    prompt: '外来語の［メリット］を 漢語で 言いかえると どれ？',
    options: ['利点', '欠点', '目的', '方法'],
    explain: 'メリットは よい 点の こと。反対の［デメリット］は「欠点」だよ。',
  },
  {
    id: 'goshu-033', g: 6, kind: 'choice',
    prompt: '外来語の［スケジュール］を 漢語で 言いかえると どれ？',
    options: ['予定', '予算', '記録', '目標'],
    explain: 'スケジュールは、いつ 何を するかの 予定の ことだよ。',
  },
  {
    id: 'goshu-034', g: 6, kind: 'choice',
    prompt: '外来語の［テーマ］を 漢語で 言いかえると どれ？',
    options: ['主題', '主人公', '結論', '記号'],
    explain: 'テーマは、作品や 話し合いの 中心と なる 考えの ことだよ。',
  },
  {
    id: 'goshu-035', g: 6, kind: 'choice',
    prompt: 'だれにでも 分かるように、外来語の［リスク］を 漢語で 言いかえると どれ？',
    options: ['危険', '利益', '計画', '用意'],
    explain: '外来語は 分かりにくい ことも あるので、相手に 合わせて 言いかえる 工夫が 大切だよ。',
  },
  {
    id: 'goshu-036', g: 6, kind: 'choice',
    prompt: '［プロ野球］は、どんな 言葉の 組み合わせ？',
    options: mix('外来語＋漢語', '和語＋漢語', '外来語＋和語', '漢語＋漢語'),
    explain: '「プロ」は 外来語の プロフェッショナルを 短く した 言葉、「野球」は 音読みの 漢語だよ。',
  },
  {
    id: 'goshu-037', g: 6, kind: 'choice', prompt: WHAT,
    text: '草原(くさはら)',
    options: kind('和語'),
    explain: '「くさ・はら」は 訓読みなので 和語。「そうげん」と 読むと 漢語に なるよ。',
  },
  {
    id: 'goshu-038', g: 6, kind: 'choice', prompt: WHAT,
    text: '風車(ふうしゃ)',
    options: kind('漢語'),
    explain: '「ふう・しゃ」は 音読みなので 漢語。「かざぐるま」と 読むと 和語に なるよ。',
  },
];
