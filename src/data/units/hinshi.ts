import type { Question } from '../../core/types';

const N2 = 'ものの 名前を あらわす 言葉(ことば)';
const V2 = 'うごきを あらわす 言葉(ことば)';
const A2 = 'ようすを あらわす 言葉(ことば)';

const MEISHI = '名詞(めいし)';
const DOSHI = '動詞(どうし)';
const KEIYOSHI = '形容詞(けいようし)';
const KEIDO = '形容動詞(けいようどうし)';
const FUKUSHI = '副詞(ふくし)';
const RENTAI = '連体詞(れんたいし)';

export const questions: Question[] = [
  // ---- 2年: 名前・うごき・ようす ----
  {
    id: 'hinshi-001', g: 2, kind: 'choice',
    prompt: 'つぎの 言葉(ことば)は どの なかま？',
    text: '［つくえ］',
    options: [N2, V2, A2],
    explain: '「つくえ」は ものの 名前だね。',
  },
  {
    id: 'hinshi-002', g: 2, kind: 'choice',
    prompt: 'つぎの 言葉(ことば)は どの なかま？',
    text: '［はしる］',
    options: [V2, N2, A2],
    explain: '「はしる」は うごきを あらわす 言葉(ことば)だね。',
  },
  {
    id: 'hinshi-003', g: 2, kind: 'choice',
    prompt: 'つぎの 言葉(ことば)は どの なかま？',
    text: '［あかい］',
    options: [A2, N2, V2],
    explain: '「あかい」は どんな いろかと いう ようすを あらわして いるよ。',
  },
  {
    id: 'hinshi-004', g: 2, kind: 'choice',
    prompt: 'つぎの 言葉(ことば)は どの なかま？',
    text: '［およぐ］',
    options: [V2, N2, A2],
    explain: '「およぐ」は うごきを あらわす 言葉(ことば)だね。',
  },
  {
    id: 'hinshi-005', g: 2, kind: 'pick',
    prompt: 'うごきを あらわす 言葉(ことば)を えらぼう',
    parts: ['青い', '空を', 'とりが', 'とぶ。'], answer: 3,
    explain: '「とぶ」が うごきを あらわして いるよ。',
  },
  {
    id: 'hinshi-006', g: 2, kind: 'choice',
    prompt: 'ようすを あらわす 言葉(ことば)は どれ？',
    options: ['さむい', 'ゆき', 'ふる', 'てぶくろ'],
    explain: '「さむい」は ようすを あらわす 言葉(ことば)。「ゆき」「てぶくろ」は ものの 名前、「ふる」は うごきだよ。',
  },
  {
    id: 'hinshi-007', g: 2, kind: 'choice',
    prompt: 'ものの 名前を あらわす 言葉(ことば)は どれ？',
    options: ['りんご', 'たべる', 'あまい', 'まるい'],
    explain: '「りんご」は ものの 名前だね。',
  },

  // ---- 3年: 名詞・動詞・形容詞 ----
  {
    id: 'hinshi-008', g: 3, kind: 'choice',
    prompt: 'つぎの 言葉の 品詞(ひんし)は どれ？',
    text: '［走る］',
    options: [DOSHI, MEISHI, KEIYOSHI],
    explain: '「走る」は 動きを あらわす 動詞(どうし)。言い切りの 形が「う」の だんの 音で 終わるよ。',
  },
  {
    id: 'hinshi-009', g: 3, kind: 'choice',
    prompt: 'つぎの 言葉の 品詞(ひんし)は どれ？',
    text: '［うれしい］',
    options: [KEIYOSHI, MEISHI, DOSHI],
    explain: '「うれしい」は ようすや 気持ちを あらわす 形容詞(けいようし)。言い切りの 形が「い」で 終わるよ。',
  },
  {
    id: 'hinshi-010', g: 3, kind: 'choice',
    prompt: 'つぎの 言葉の 品詞(ひんし)は どれ？',
    text: '［学校］',
    options: [MEISHI, DOSHI, KEIYOSHI],
    explain: '「学校」は ものや 場所の 名前を あらわす 名詞(めいし)だよ。',
  },
  {
    id: 'hinshi-011', g: 3, kind: 'choice',
    prompt: 'つぎの 言葉の 品詞(ひんし)は どれ？',
    text: '［つめたい］',
    options: [KEIYOSHI, MEISHI, DOSHI],
    explain: '「つめたい」は ようすを あらわす 形容詞(けいようし)。「い」で 終わるね。',
  },
  {
    id: 'hinshi-012', g: 3, kind: 'choice',
    prompt: 'つぎの 言葉の 品詞(ひんし)は どれ？',
    text: '［書く］',
    options: [DOSHI, MEISHI, KEIYOSHI],
    explain: '「書く」は 動きを あらわす 動詞(どうし)だよ。',
  },
  {
    id: 'hinshi-013', g: 3, kind: 'choice',
    prompt: 'つぎの 言葉の 品詞(ひんし)は どれ？',
    text: '［えんぴつ］',
    options: [MEISHI, DOSHI, KEIYOSHI],
    explain: '「えんぴつ」は ものの 名前を あらわす 名詞(めいし)だよ。',
  },
  {
    id: 'hinshi-014', g: 3, kind: 'pick',
    prompt: '動詞(どうし)を えらぼう',
    parts: ['白い', '犬が', 'ボールを', '追いかける。'], answer: 3,
    explain: '「追いかける」が 動きを あらわす 動詞(どうし)。「白い」は 形容詞(けいようし)だよ。',
  },
  {
    id: 'hinshi-015', g: 3, kind: 'pick',
    prompt: '形容詞(けいようし)を えらぼう',
    parts: ['今日は', 'とても', '暑い。'], answer: 2,
    explain: '「暑い」が ようすを あらわす 形容詞(けいようし)。「い」で 終わるね。',
  },
  {
    id: 'hinshi-016', g: 3, kind: 'choice',
    prompt: '動詞(どうし)は どれ？',
    options: ['考える', '楽しい', '国語', '長い'],
    explain: '「考える」が 動きを あらわす 動詞(どうし)。「楽しい」「長い」は 形容詞(けいようし)、「国語」は 名詞(めいし)だよ。',
  },
  {
    id: 'hinshi-017', g: 3, kind: 'choice',
    prompt: '形容詞(けいようし)は どれ？',
    options: ['明るい', '明かり', '明ける', '明日'],
    explain: '「明るい」が ようすを あらわす 形容詞(けいようし)。「明ける」は 動詞(どうし)、「明かり」「明日」は 名詞(めいし)だよ。',
  },
  {
    id: 'hinshi-018', g: 3, kind: 'choice',
    prompt: '名詞(めいし)は どれ？',
    options: ['港', '泳ぐ', '深い', '遊ぶ'],
    explain: '「港」が 場所の 名前を あらわす 名詞(めいし)だよ。',
  },

  // ---- 4年 ----
  {
    id: 'hinshi-019', g: 4, kind: 'choice',
    prompt: 'つぎの 言葉の 品詞(ひんし)は どれ？',
    text: '［大きさ］',
    options: [MEISHI, KEIYOSHI, DOSHI],
    explain: '「大きい」に「さ」が ついて できた 名詞(めいし)。「大きさが ちがう」のように「が」を つけられるよ。',
  },
  {
    id: 'hinshi-020', g: 4, kind: 'choice',
    prompt: '［ ］の 言葉の 品詞(ひんし)は どれ？',
    text: '［遊び］は 楽しい。',
    options: [MEISHI, DOSHI, KEIYOSHI],
    explain: 'ここの「遊び」は「遊ぶ」から できた 名詞(めいし)。「遊びは」と 主語に なって いるね。',
  },
  {
    id: 'hinshi-021', g: 4, kind: 'choice',
    prompt: 'つぎの 言葉の 品詞(ひんし)は どれ？',
    text: '［美しい］',
    options: [KEIYOSHI, MEISHI, DOSHI],
    explain: '「美しい」は ようすを あらわし、「い」で 終わる 形容詞(けいようし)だよ。',
  },
  {
    id: 'hinshi-022', g: 4, kind: 'pick',
    prompt: '動詞(どうし)を えらぼう',
    parts: ['弟は', 'いつも', '元気に', '笑う。'], answer: 3,
    explain: '「笑う」が 動きを あらわす 動詞(どうし)。言い切りの 形が「う」の だんの 音で 終わるね。',
  },
  {
    id: 'hinshi-023', g: 4, kind: 'pick',
    prompt: '形容詞(けいようし)を えらぼう',
    parts: ['小さな', '子犬が', 'かわいい', '声で', 'ないた。'], answer: 2,
    explain: '「かわいい」が 形容詞(けいようし)。「小さな」は「い」で 終わらないので 形容詞(けいようし)では ないよ。',
  },
  {
    id: 'hinshi-024', g: 4, kind: 'choice',
    prompt: '名詞(めいし)は どれ？',
    options: ['悲しみ', '悲しい', '悲しむ'],
    explain: '「悲しみ」は ものごとの 名前に なった 名詞(めいし)。「悲しい」は 形容詞(けいようし)、「悲しむ」は 動詞(どうし)だよ。',
  },
  {
    id: 'hinshi-025', g: 4, kind: 'choice',
    prompt: '動詞(どうし)は どれ？',
    options: ['温める', '温かい', '温かさ'],
    explain: '「温める」は 動きを あらわす 動詞(どうし)。「温かい」は 形容詞(けいようし)、「温かさ」は 名詞(めいし)だよ。',
  },
  {
    id: 'hinshi-026', g: 4, kind: 'choice',
    prompt: '形容詞(けいようし)は どれ？',
    options: ['重い', '重さ', '重ねる', '重み'],
    explain: '「重い」が 形容詞(けいようし)。「重ねる」は 動詞(どうし)、「重さ」「重み」は 名詞(めいし)だよ。',
  },
  {
    id: 'hinshi-027', g: 4, kind: 'choice',
    prompt: '形容詞(けいようし)の 言い切りの 形は、さいごが どんな 音？',
    options: ['「い」で 終わる', '「だ」で 終わる', '「う」の だんの 音で 終わる', '「さ」で 終わる'],
    explain: '「高い」「白い」のように、形容詞(けいようし)は「い」で 終わるよ。',
  },

  // ---- 5年: 形容動詞・副詞 ----
  {
    id: 'hinshi-028', g: 5, kind: 'choice',
    prompt: 'つぎの 言葉の 品詞(ひんし)は どれ？',
    text: '［静かだ］',
    options: [KEIDO, KEIYOSHI, MEISHI, FUKUSHI],
    explain: 'ようすを あらわし、言い切りの 形が「だ」で 終わる 言葉は 形容動詞(けいようどうし)だよ。',
  },
  {
    id: 'hinshi-029', g: 5, kind: 'choice',
    prompt: '［ ］の 言葉の 品詞(ひんし)は どれ？',
    text: '［とても］大きい。',
    options: [FUKUSHI, KEIYOSHI, KEIDO, MEISHI],
    explain: '「とても」は 形が 変わらず、「大きい」を くわしく する 副詞(ふくし)だよ。',
  },
  {
    id: 'hinshi-030', g: 5, kind: 'choice',
    prompt: '［ ］の 言葉の 品詞(ひんし)は どれ？',
    text: '［ゆっくり］歩く。',
    options: [FUKUSHI, KEIDO, DOSHI, MEISHI],
    explain: '「ゆっくり」は 形が 変わらず、「歩く」を くわしく する 副詞(ふくし)だよ。',
  },
  {
    id: 'hinshi-031', g: 5, kind: 'choice',
    prompt: 'つぎの 言葉の 品詞(ひんし)は どれ？',
    text: '［元気だ］',
    options: [KEIDO, KEIYOSHI, DOSHI, FUKUSHI],
    explain: 'ようすを あらわし、「だ」で 終わるので 形容動詞(けいようどうし)だよ。',
  },
  {
    id: 'hinshi-032', g: 5, kind: 'pick',
    prompt: '形容動詞(けいようどうし)を えらぼう',
    parts: ['夏祭りは', 'とても', 'にぎやかだった。'], answer: 2,
    explain: '「にぎやかだった」は「にぎやかだ」が 形を 変えた もの。形容動詞(けいようどうし)だよ。',
  },
  {
    id: 'hinshi-033', g: 5, kind: 'pick',
    prompt: '副詞(ふくし)を えらぼう',
    parts: ['雨が', 'ざあざあ', 'ふって', 'いる。'], answer: 1,
    explain: '「ざあざあ」は「ふって いる」を くわしく する 副詞(ふくし)だよ。',
  },
  {
    id: 'hinshi-034', g: 5, kind: 'choice',
    prompt: '形容詞(けいようし)は どれ？',
    options: ['あたたかい', 'おだやかだ', 'すこやかだ', 'しずかだ'],
    explain: '「い」で 終わる「あたたかい」が 形容詞(けいようし)。ほかは「だ」で 終わる 形容動詞(けいようどうし)だよ。',
  },

  // ---- 6年 ----
  {
    id: 'hinshi-035', g: 6, kind: 'choice',
    prompt: '［ ］の 言葉の 品詞(ひんし)は どれ？',
    text: '［きれいな］花が さく。',
    options: [KEIDO, KEIYOSHI, MEISHI, FUKUSHI],
    explain: '言い切りの 形は「きれいだ」。「い」で 終わって いても、形容詞(けいようし)ではなく 形容動詞(けいようどうし)だよ。',
  },
  {
    id: 'hinshi-036', g: 6, kind: 'choice',
    prompt: '［ ］の 言葉の 品詞(ひんし)は どれ？',
    text: '［大きな］木が ある。',
    options: [RENTAI, KEIYOSHI, KEIDO, FUKUSHI],
    explain: '「大きな」は 形が 変わらず、名詞(めいし)だけを くわしく する 連体詞(れんたいし)。「大きい」なら 形容詞(けいようし)だよ。',
  },
  {
    id: 'hinshi-037', g: 6, kind: 'choice',
    prompt: '［ ］の 言葉の 品詞(ひんし)は どれ？',
    text: '［静かに］歩く。',
    options: [KEIDO, FUKUSHI, KEIYOSHI, DOSHI],
    explain: '「静かに」は「静かだ」が 形を 変えた もの。動詞(どうし)を くわしく して いても 形容動詞(けいようどうし)だよ。',
  },
  {
    id: 'hinshi-038', g: 6, kind: 'choice',
    prompt: '［ ］の 言葉の 品詞(ひんし)は どれ？',
    text: '［決して］わすれない。',
    options: [FUKUSHI, DOSHI, KEIDO, MEISHI],
    explain: '「決して」は 後に「〜ない」が 来る 副詞(ふくし)だよ。',
  },
  {
    id: 'hinshi-039', g: 6, kind: 'pick',
    prompt: '形容動詞(けいようどうし)を えらぼう',
    parts: ['ほがらかな', '姉は', 'いつも', 'よく', '笑う。'], answer: 0,
    explain: '「ほがらかな」は「ほがらかだ」が 形を 変えた 形容動詞(けいようどうし)。「いつも」「よく」は 副詞(ふくし)だよ。',
  },
  {
    id: 'hinshi-040', g: 6, kind: 'choice',
    prompt: '［ ］の 言葉の 品詞(ひんし)は どれ？',
    text: '［暖かな］日ざし',
    options: [KEIDO, KEIYOSHI, MEISHI, FUKUSHI],
    explain: '言い切りの 形は「暖かだ」なので 形容動詞(けいようどうし)。「暖かい」なら 形容詞(けいようし)だよ。',
  },
];
