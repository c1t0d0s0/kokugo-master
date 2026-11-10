// 国語マスターのヤマネコカードの絵柄 (持ち物・背景・ふち)。
// Wordlynx・Reading Quest・漢字クイズにはない、和のものと ことばにまつわるものだけでかく。
// 持ち物は顔 (たて 110 × よこ 120) の座標、背景とふちはカード (たて 156 × よこ 120) の座標。
import type { Background, Frame, Item } from '../data/cards';

const LINE = '#1c2a4a';
const SUMI = '#23211f';
const SHU = '#d9452b';
const KIN = '#d9a520';
const W = 120;
const H = 156;

const rect = (fill: string) => `<rect width="${W}" height="${H}" fill="${fill}"/>`;
const text = (x: number, y: number, size: number, fill: string, s: string, extra = '') =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-family="'Klee One','Hiragino Mincho ProN',serif" font-weight="600" text-anchor="middle" stroke="none"${extra}>${s}</text>`;

/** 中心 (cx, cy)・半径 r の扇形 (角度は度。0 が右、時計回り) */
function fan(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const p = (a: number) => `${(cx + r * Math.cos((a * Math.PI) / 180)).toFixed(1)} ${(cy + r * Math.sin((a * Math.PI) / 180)).toFixed(1)}`;
  return `M${cx} ${cy}L${p(a0)}A${r} ${r} 0 0 1 ${p(a1)}Z`;
}

/** 扇形の骨 (中心から外へ n 本) */
function ribs(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number, n: number): string {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    d += `M${(cx + r0 * Math.cos(a)).toFixed(1)} ${(cy + r0 * Math.sin(a)).toFixed(1)}L${(cx + r1 * Math.cos(a)).toFixed(1)} ${(cy + r1 * Math.sin(a)).toFixed(1)}`;
  }
  return d;
}

/** 梅の花 (かんざしなどに使う) */
const ume = (x: number, y: number, r: number, fill: string) =>
  `<g transform="translate(${x} ${y})">` +
  [0, 72, 144, 216, 288].map((a) => `<circle r="${r * 0.55}" cy="${-r * 0.6}" fill="${fill}" transform="rotate(${a})"/>`).join('') +
  `<circle r="${r * 0.32}" fill="#ffd23f"/></g>`;

/** 顔の上にかぶるもの。これがあるときは、ひたいのもようをかかない */
export const KOKUGO_HEADWEAR: Item[] = ['kasa', 'hokamuri', 'kabuto', 'eboshi', 'kanmuri'];

export const KOKUGO_ITEMS: Partial<Record<Item, string>> = {
  // 筆。右のほおの横に、ななめに持つ
  fude:
    `<g transform="rotate(28 104 92)" stroke="${LINE}" stroke-width="2" stroke-linejoin="round">` +
    `<path fill="none" stroke-width="1.4" d="M104 52Q108 46 104 44Q100 46 104 52"/>` +
    `<rect x="100" y="52" width="8" height="36" rx="2" fill="#b07a3c"/>` +
    `<rect x="99.5" y="86" width="9" height="6" fill="#3a2a1a"/>` +
    `<path fill="#f4efe3" d="M99.5 92Q99 104 104 116Q109 104 108.5 92Z"/>` +
    `<path fill="${SUMI}" stroke="none" d="M100.8 102Q102.5 111 104 116Q105.5 111 107.2 102Q104 105 100.8 102Z"/></g>`,
  // はんこ。ほおに「語」の朱い印
  hanko:
    `<g transform="translate(97 101) rotate(-12)">` +
    `<circle r="12.5" fill="#fff8f0" stroke="${SHU}" stroke-width="2.6"/>` +
    `<circle r="9.6" fill="none" stroke="${SHU}" stroke-width="1"/>` +
    text(0, 5.2, 13.5, SHU, '語') +
    `</g>`,
  // かるたの取り札。口の前に持つ
  fuda:
    `<g transform="translate(60 106) rotate(-8)" stroke-linejoin="round">` +
    `<rect x="-12" y="-2" width="24" height="32" rx="2" fill="#fffaf0" stroke="#2b6a4f" stroke-width="2.4"/>` +
    `<circle cy="6" r="5.4" fill="#f4d9d4"/>` +
    text(0, 9.6, 8.5, '#b0342a', 'あ') +
    `<path fill="none" stroke="${LINE}" stroke-width="1.5" stroke-linecap="round" d="M3 15V26M-3 15V22"/></g>`,
  // 七夕の短冊。右がわにつるす
  tanzaku:
    `<g transform="translate(100 60) rotate(10)" stroke="${LINE}" stroke-linejoin="round">` +
    `<path fill="none" stroke-width="1.2" d="M0 -10V0"/>` +
    `<rect x="-6.5" y="0" width="13" height="48" fill="#f7a8bd" stroke-width="2"/>` +
    `<path fill="none" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="5 3" d="M1.5 6V42M-2 10V30"/></g>`,
  // 扇子 (日の丸の扇)。左下に広げて持つ
  sensu:
    `<g stroke="${LINE}" stroke-width="2" stroke-linejoin="round">` +
    `<path fill="#fffaf0" d="${fan(26, 124, 30, 200, 300)}"/>` +
    `<path fill="none" stroke="#c9b28a" stroke-width="1" d="${ribs(26, 124, 8, 29, 200, 300, 7)}"/>` +
    `<circle cx="22" cy="104" r="6" fill="${SHU}" stroke="none"/>` +
    `<path fill="#fffaf0" d="${fan(26, 124, 8, 200, 300)}"/></g>`,
  // 国語辞典。むねの前にかかえる
  jisho:
    `<g transform="translate(60 112) rotate(-4)" stroke="${LINE}" stroke-width="2.2" stroke-linejoin="round">` +
    `<rect x="-22" y="-13" width="44" height="28" rx="2.5" fill="#c0392b"/>` +
    `<path fill="#fffaf0" d="M-22 15H22V19H-22Z"/>` +
    `<rect x="-14" y="-8" width="28" height="13" rx="1.5" fill="#fff3c4" stroke-width="1.2"/>` +
    text(0, 2.6, 8.5, LINE, '国語') +
    `</g>`,
  // すずり。左下に置く
  suzuri:
    `<g transform="translate(22 116) rotate(-6)" stroke="${LINE}" stroke-width="2" stroke-linejoin="round">` +
    `<rect x="-14" y="-9" width="28" height="22" rx="5" fill="#3b3a40"/>` +
    `<path fill="${SUMI}" stroke="#55545c" stroke-width="1.2" d="M-10 -5H10V2Q0 -1 -10 2Z"/>` +
    `<ellipse cx="0" cy="7" rx="6" ry="2.5" fill="#55545c" stroke="none"/></g>`,
  // 旅笠 (俳人の旅のかさ)
  kasa:
    `<g stroke="${LINE}" stroke-width="2.5" stroke-linejoin="round">` +
    `<path fill="#e2c27a" d="M4 40L60 4L116 40Q60 50 4 40Z"/>` +
    `<path fill="none" stroke="#b8924a" stroke-width="1.2" d="M60 4L32 44M60 4L46 46M60 4L60 47M60 4L74 46M60 4L88 44"/></g>`,
  // ほおかむり (からくさもようの手ぬぐい)
  hokamuri:
    `<g stroke="${LINE}" stroke-width="2.4" stroke-linejoin="round">` +
    `<path fill="#3f6fb5" d="M18 64C14 18 106 18 102 64Q96 56 92 50Q60 38 28 50Q24 56 18 64Z"/>` +
    `<path fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity="0.85" d="M34 36q4-6 8 0t8 0M54 30q4-6 8 0t8 0M74 36q4-6 8 0t8 0M44 44q4-6 8 0t8 0M66 44q4-6 8 0"/>` +
    `<path fill="#3f6fb5" d="M98 58L114 50L112 62L118 70L102 68Z"/></g>`,
  // かんざし (梅の花と、ゆれるかざり)
  kanzashi:
    `<g transform="translate(84 34) rotate(24)" stroke="${LINE}">` +
    `<path stroke="#c9a227" stroke-width="2.6" stroke-linecap="round" d="M-16 0H18"/>` +
    `<path fill="none" stroke="#c9a227" stroke-width="1.2" d="M6 2V16M11 2V12"/>` +
    `<circle cx="6" cy="17" r="2.4" fill="${SHU}" stroke-width="1"/><circle cx="11" cy="13" r="2.4" fill="#4a90e2" stroke-width="1"/></g>` +
    `<g stroke="${LINE}" stroke-width="1.2">${ume(80, 30, 9, '#e8546a')}</g>`,
  // マイク (音読の発表)
  mic:
    `<g transform="rotate(-22 100 104)" stroke="${LINE}" stroke-width="2" stroke-linejoin="round">` +
    `<rect x="96" y="100" width="8" height="26" rx="3" fill="#4b4f5c"/>` +
    `<circle cx="100" cy="94" r="8.5" fill="#c3cad6"/>` +
    `<path fill="none" stroke="#8a93a3" stroke-width="1.1" d="M93 92H107M93.5 96H106.5M96 87.5V100.5M100 86V102M104 87.5V100.5"/></g>`,
  // かぶと (こどもの日)
  kabuto:
    `<g stroke="${LINE}" stroke-width="2.4" stroke-linejoin="round">` +
    `<path fill="${KIN}" d="M57 22Q42 -6 26 -2Q40 8 52 28ZM63 22Q78 -6 94 -2Q80 8 68 28Z"/>` +
    `<path fill="#2f3f73" d="M28 38C28 8 92 8 92 38Z"/>` +
    `<path fill="#3f5fa8" d="M18 50Q22 38 28 36Q60 30 92 36Q98 38 102 50Q60 40 18 50Z"/>` +
    `<circle cx="60" cy="24" r="4.2" fill="${KIN}"/></g>`,
  // うちわ (花火のもよう)
  uchiwa:
    `<g transform="rotate(-18 22 106)" stroke="${LINE}" stroke-width="2" stroke-linejoin="round">` +
    `<path stroke="#8a5a2b" stroke-width="3.2" stroke-linecap="round" d="M22 106V128"/>` +
    `<circle cx="22" cy="92" r="15" fill="#2c4fa3"/>` +
    `<path fill="none" stroke="#ffd23f" stroke-width="1.5" stroke-linecap="round" d="${ribs(22, 92, 3, 10, 0, 330, 11)}"/></g>`,
  // 烏帽子 (平安時代のぼうし)
  eboshi:
    `<g stroke="${LINE}" stroke-width="2.4" stroke-linejoin="round">` +
    `<path fill="#22232b" d="M38 34Q32 -12 62 -20Q74 -12 74 4Q82 18 82 34Q60 40 38 34Z"/>` +
    `<path fill="none" stroke="#4a4b55" stroke-width="1.4" d="M44 24Q60 18 76 24M42 12Q56 6 72 10"/></g>`,
  // 冠 (平安時代の貴族の冠。うしろに纓 (えい) がのびる)
  kanmuri:
    `<g stroke="${LINE}" stroke-width="2.4" stroke-linejoin="round">` +
    `<path fill="none" stroke="#22232b" stroke-width="6" stroke-linecap="round" d="M66 4Q96 -10 112 14"/>` +
    `<path fill="#22232b" d="M38 36Q38 14 60 12Q82 14 82 36Q60 31 38 36Z"/>` +
    `<rect x="54" y="-6" width="12" height="22" rx="4" fill="#22232b"/>` +
    `<path fill="none" stroke="${KIN}" stroke-width="1.6" d="M40 30Q60 25 80 30"/></g>`,
  // 墨のあと (ほっぺと鼻に、ちょんと墨がついた)
  ink:
    `<g fill="${SUMI}" opacity="0.85"><path d="M18 76Q22 70 28 73Q33 76 30 80Q26 84 21 81Q16 79 18 76Z"/>` +
    `<circle cx="34" cy="76" r="1.6"/><circle cx="15" cy="72" r="1.2"/><path d="M64 77q3-2 4 1t-3 2z"/></g>`,
  // 片めがね (はかせ)
  monocle:
    `<circle cx="78" cy="69" r="11.5" fill="rgba(255,255,255,0.3)" stroke="${KIN}" stroke-width="2.8"/>` +
    `<circle cx="78" cy="69" r="11.5" fill="none" stroke="${LINE}" stroke-width="0.8"/>` +
    `<path fill="none" stroke="${KIN}" stroke-width="1.6" stroke-linecap="round" d="M88 75Q100 94 92 112"/>`,
  // 着物のえり (あごの下)
  eri:
    `<g stroke="${LINE}" stroke-width="2.2" stroke-linejoin="round">` +
    `<path fill="#7d4fb3" d="M14 104Q36 102 60 130Q84 102 106 104L110 150H10Z"/>` +
    `<path fill="#fffaf0" d="M26 100L60 134L68 126L40 98Z"/>` +
    `<path fill="#fffaf0" d="M94 100L60 134L52 126L80 98Z"/>` +
    `<path fill="${SHU}" d="M40 98L60 118L80 98Q60 108 40 98Z"/></g>`,
  // 金メダル (国語マスター)
  medal:
    `<g stroke="${LINE}" stroke-width="2" stroke-linejoin="round">` +
    `<path fill="${SHU}" d="M46 98L54 114H60L54 98ZM74 98L66 114H60L66 98Z"/>` +
    `<circle cx="60" cy="121" r="11" fill="#ffd23f"/>` +
    `<circle cx="60" cy="121" r="7.5" fill="none" stroke="#c9a227" stroke-width="1.4"/>` +
    text(60, 125, 9, '#9a6b00', '国') +
    `</g>`,
};

// ---- 背景 ----

const KANA = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';

export function kokugoBackground(bg: Background): string {
  switch (bg) {
    case 'hiragana': {
      // ひらがながちらばる
      const colors = ['#e8546a', '#4f7fd1', '#3f9a7a', '#e0864a', '#b0619e'];
      let s = rect('#fff8e8');
      for (let i = 0; i < 24; i++) {
        const x = 10 + ((i * 37) % 104);
        const y = 14 + ((i * 53) % 138);
        s += text(x, y, 12 + (i % 3) * 3, colors[i % colors.length], KANA[(i * 7) % KANA.length], ` opacity="0.4" transform="rotate(${(i % 5) * 9 - 18} ${x} ${y})"`);
      }
      return s;
    }
    case 'ichimatsu': {
      let d = '';
      for (let y = 0; y < H; y += 13) for (let x = (y / 13) % 2 === 0 ? 0 : 13; x < W; x += 26) d += `M${x} ${y}h13v13h-13z`;
      return rect('#e4efe7') + `<path fill="#bcd9c8" d="${d}"/>`;
    }
    case 'tatami': {
      let d = '';
      for (let x = 2; x < W; x += 3.2) d += `M${x.toFixed(1)} 0V${H}`;
      return (
        rect('#d8d29a') +
        `<path stroke="#c4bd7a" stroke-width="1.2" d="${d}"/>` +
        `<rect y="0" width="${W}" height="9" fill="#2f4a36"/><rect y="${H - 9}" width="${W}" height="9" fill="#2f4a36"/>` +
        `<path stroke="#e7d9a8" stroke-width="1" stroke-dasharray="3 3" d="M0 4.5H${W}M0 ${H - 4.5}H${W}"/>`
      );
    }
    case 'tanabata': {
      // 笹の葉と、色とりどりの短冊
      const leaves = [[8, 20, -30], [20, 44, 20], [6, 70, -40], [18, 96, 30], [8, 124, -20], [104, 30, 200], [112, 80, 160], [100, 120, 210]];
      const strips = [[28, 26, '#ffd23f'], [98, 58, '#4f7fd1'], [26, 104, '#e8546a'], [104, 102, '#3f9a7a']];
      return (
        rect('#eaf2ff') +
        `<path fill="none" stroke="#6ca86a" stroke-width="2.4" d="M14 0Q10 80 16 ${H}M108 0Q112 80 106 ${H}"/>` +
        leaves.map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="3.4" fill="#7cc178" transform="rotate(${a} ${x} ${y})"/>`).join('') +
        strips.map(([x, y, c]) => `<path stroke="#888" stroke-width="0.8" d="M${x} ${Number(y) - 8}V${y}"/><rect x="${Number(x) - 4}" y="${y}" width="8" height="24" fill="${c}"/>`).join('')
      );
    }
    case 'seigaiha': {
      let s = rect('#2a5d9f');
      for (let row = 0; row < 14; row++) {
        const y = row * 12;
        for (let col = -1; col < 7; col++) {
          const x = col * 20 + (row % 2) * 10;
          s += `<g fill="#2a5d9f" stroke="#cfe3fa" stroke-width="1.2">${[10, 7, 4].map((r) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`;
        }
      }
      return s;
    }
    case 'shoji': {
      let d = '';
      for (let x = 0; x <= W; x += 30) d += `M${x} 0V${H}`;
      for (let y = 0; y <= H; y += 39) d += `M0 ${y}H${W}`;
      return rect('#fbf8ef') + `<path stroke="#c9a46a" stroke-width="3" d="${d}"/>` + `<rect x="62" y="80" width="26" height="36" fill="#f3d9a0" opacity="0.5"/>`;
    }
    case 'fuji':
      return (
        rect('#cbe8f7') +
        `<circle cx="96" cy="26" r="11" fill="${SHU}" opacity="0.85"/>` +
        `<path fill="#4f74b8" d="M-10 ${H}L52 66Q60 60 68 66L130 ${H}Z"/>` +
        `<path fill="#fff" d="M44 77L52 66Q60 60 68 66L76 77L70 74L64 79L58 73L51 79Z"/>` +
        `<path fill="#fff" opacity="0.8" d="M0 128Q30 118 60 128T120 128V${H}H0Z"/>`
      );
    case 'yagasuri': {
      let s = rect('#efe6fa');
      for (let col = 0; col < 6; col++) {
        const x = col * 20;
        const fill = col % 2 ? '#7d4fb3' : '#efe6fa';
        if (col % 2 === 0) continue;
        for (let y = -10; y < H; y += 20) s += `<path fill="${fill}" d="M${x} ${y}L${x + 10} ${y + 10}L${x + 20} ${y}V${y + 12}L${x + 10} ${y + 22}L${x} ${y + 12}Z"/>`;
      }
      return s;
    }
    case 'asanoha': {
      // 麻の葉もよう (六角形の中に星)
      let d = '';
      const r = 14;
      for (let row = -1; row < 8; row++) {
        for (let col = -1; col < 6; col++) {
          const cx = col * r * 1.732 + (row % 2) * r * 0.866;
          const cy = row * r * 1.5 + 6;
          for (let k = 0; k < 6; k++) {
            const a = ((k * 60 + 30) * Math.PI) / 180;
            d += `M${cx.toFixed(1)} ${cy.toFixed(1)}L${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
          }
        }
      }
      return rect('#fde6ea') + `<path stroke="#f29bb0" stroke-width="1" fill="none" d="${d}"/>`;
    }
    case 'kokuban':
      return (
        rect('#2f5d4a') +
        `<rect y="${H - 10}" width="${W}" height="10" fill="#9a6b3a"/>` +
        `<rect x="18" y="${H - 14}" width="14" height="4" rx="1" fill="#fff"/><rect x="38" y="${H - 14}" width="10" height="4" rx="1" fill="#f7a8bd"/>` +
        text(24, 26, 14, '#f4f4ea', 'あ', ' opacity="0.75"') +
        text(98, 30, 12, '#f4f4ea', '言葉', ' opacity="0.6"') +
        text(100, 128, 12, '#ffe36e', '○', ' opacity="0.8"') +
        `<path fill="none" stroke="#f4f4ea" stroke-width="1.6" stroke-linecap="round" opacity="0.55" d="M10 128Q24 120 38 128T66 128"/>`
      );
    case 'koinobori': {
      const carp = (y: number, len: number, body: string) =>
        `<path fill="${body}" stroke="${LINE}" stroke-width="1.4" d="M14 ${y}H${14 + len}L${14 + len - 8} ${y + 7}L${14 + len} ${y + 14}H14Z"/>` +
        `<circle cx="22" cy="${y + 6}" r="3" fill="#fff" stroke="${LINE}" stroke-width="1"/><circle cx="22" cy="${y + 6}" r="1.3" fill="${LINE}"/>`;
      return (
        rect('#d8efff') +
        `<g fill="#fff"><ellipse cx="90" cy="130" rx="22" ry="7"/><ellipse cx="96" cy="124" rx="12" ry="7"/></g>` +
        `<path stroke="#9a6b3a" stroke-width="3" d="M12 4V${H}"/><circle cx="12" cy="4" r="4" fill="${KIN}"/>` +
        carp(12, 92, '#2c3e70') +
        carp(32, 78, SHU) +
        carp(52, 62, '#4aa3e8')
      );
    }
    case 'hanabi': {
      const burst = (cx: number, cy: number, r: number, c: string) =>
        `<path fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" d="${ribs(cx, cy, r * 0.35, r, 0, 345, 23)}"/>` +
        `<circle cx="${cx}" cy="${cy}" r="${r * 0.18}" fill="${c}"/>`;
      return rect('#1b2340') + burst(30, 32, 22, '#ff9fb5') + burst(92, 22, 16, '#ffd23f') + burst(98, 120, 20, '#7cd6f2') + burst(18, 128, 12, '#b9f27c');
    }
    case 'kasumi':
      // 平安の絵巻のような、金のかすみ
      return (
        rect('#fbf1e6') +
        [[-10, 14, 70], [56, 34, 80], [-20, 120, 76], [64, 136, 70], [30, 4, 50]]
          .map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="14" rx="7" fill="#f2d98b" opacity="0.8"/>`)
          .join('') +
        `<g fill="#f2d98b" opacity="0.8">${[[14, 40], [96, 60], [20, 100], [104, 112]].map(([x, y]) => `<rect x="${x}" y="${y}" width="5" height="5" transform="rotate(45 ${x} ${y})"/>`).join('')}</g>`
      );
    case 'enso':
      // 書道の円相 (ひと筆でかいた円)
      return (
        rect('#fdfbf6') +
        `<path fill="none" stroke="${SUMI}" stroke-width="9" stroke-linecap="round" opacity="0.18" d="M78 20C112 30 116 96 84 126C52 150 6 128 8 84C10 46 40 18 70 22"/>` +
        `<g fill="${SUMI}" opacity="0.18"><circle cx="100" cy="14" r="2.5"/><circle cx="108" cy="22" r="1.6"/></g>` +
        `<rect x="94" y="132" width="13" height="13" fill="none" stroke="${SHU}" stroke-width="1.6" opacity="0.8"/>` +
        text(100.5, 142.5, 10, SHU, '印', ' opacity="0.8"')
      );
    case 'take': {
      // 竹林 (かぐやひめの竹)
      let s = rect('#e6f3df');
      for (const [x, w, c] of [[6, 9, '#8cc47e'], [30, 7, '#a5d396'], [94, 10, '#7fb971'], [112, 7, '#a5d396']] as const) {
        s += `<rect x="${x}" y="0" width="${w}" height="${H}" fill="${c}"/>`;
        for (let y = 18 + x % 13; y < H; y += 34) s += `<rect x="${x - 1}" y="${y}" width="${w + 2}" height="2.4" fill="#5d9a52"/>`;
      }
      return s + `<circle cx="64" cy="18" r="9" fill="#fff6c8"/>`;
    }
    case 'kinbyobu': {
      // 金屏風 (たたんだ屏風と、金ぱく)
      let s = '';
      for (let i = 0; i < 4; i++) s += `<rect x="${i * 30}" y="0" width="30" height="${H}" fill="${i % 2 ? '#e9c55a' : '#f3d77a'}"/>`;
      s += `<path stroke="#c99a2e" stroke-width="1" d="M30 0V${H}M60 0V${H}M90 0V${H}"/>`;
      for (let i = 0; i < 18; i++) {
        const x = (i * 41) % 112;
        const y = (i * 67) % 148;
        s += `<rect x="${x}" y="${y}" width="8" height="8" fill="#fbe9a6" opacity="0.7"/>`;
      }
      return s;
    }
  }
}

// ---- ふち ----

export const KOKUGO_FRAMES: Record<Frame, string> = {
  // 墨: 筆でかいたような太い黒のふち
  sumi:
    `<rect x="2" y="2" width="116" height="152" rx="7" fill="none" stroke="${SUMI}" stroke-width="4"/>` +
    `<rect x="6" y="6" width="108" height="144" rx="4" fill="none" stroke="${SUMI}" stroke-width="0.8" stroke-dasharray="6 2 1 2"/>`,
  // 朱: 朱色のふちと、右下の落款 (らっかん)
  shu:
    `<rect x="2.5" y="2.5" width="115" height="151" rx="6.5" fill="none" stroke="${SHU}" stroke-width="5"/>` +
    `<rect x="6.5" y="6.5" width="107" height="143" rx="4" fill="none" stroke="#f6d7a4" stroke-width="1.2"/>` +
    `<rect x="103" y="141" width="11" height="11" fill="${SHU}"/>` +
    text(108.5, 150, 8, '#fff', '国'),
  // 金: 金のふちと、四すみの雲のかざり
  kin:
    `<rect x="2.5" y="2.5" width="115" height="151" rx="6.5" fill="none" stroke="${KIN}" stroke-width="5"/>` +
    `<rect x="7" y="7" width="106" height="142" rx="3" fill="none" stroke="#8a5a14" stroke-width="1"/>` +
    [[9, 9, 0], [111, 9, 90], [111, 147, 180], [9, 147, 270]]
      .map(([x, y, a]) => `<path fill="${KIN}" stroke="#8a5a14" stroke-width="1" transform="translate(${x} ${y}) rotate(${a})" d="M-2 -2H14Q14 4 8 4Q4 4 4 8Q4 14 -2 14Z"/>`)
      .join(''),
};
