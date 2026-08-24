const zlib = require("zlib");
const fs = require("fs");

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

function png(w, h, px) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    px.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function hex(c) {
  return [c >> 16, (c >> 8) & 0xff, c & 0xff, 255];
}

function save(path, w, h, px) {
  fs.writeFileSync(path, png(w, h, px));
  console.log("wrote", path, w + "x" + h);
}

function canvas(w, h) {
  return { w, h, data: Buffer.alloc(w * h * 4) };
}

function put(cv, x, y, r, g, b, a) {
  if (x < 0 || y < 0 || x >= cv.w || y >= cv.h) return;
  const i = (y * cv.w + x) * 4;
  cv.data[i] = r;
  cv.data[i + 1] = g;
  cv.data[i + 2] = b;
  cv.data[i + 3] = a;
}

function fillGradient(cv, c1, c2, vertical) {
  for (let y = 0; y < cv.h; y++) {
    for (let x = 0; x < cv.w; x++) {
      const t = vertical ? y / cv.h : x / cv.w;
      const r = Math.round((c1 >> 16) + ((c2 >> 16) - (c1 >> 16)) * t);
      const g = Math.round(((c1 >> 8) & 0xff) + (((c2 >> 8) & 0xff) - ((c1 >> 8) & 0xff)) * t);
      const b = Math.round((c1 & 0xff) + ((c2 & 0xff) - (c1 & 0xff)) * t);
      put(cv, x, y, r, g, b, 255);
    }
  }
}

function fillCircle(cv, cx, cy, rad, rgb, alpha) {
  for (let y = Math.floor(cy - rad); y <= cy + rad; y++) {
    for (let x = Math.floor(cx - rad); x <= cx + rad; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d <= rad) put(cv, x, y, (rgb >> 16) & 0xff, (rgb >> 8) & 0xff, rgb & 0xff, alpha);
    }
  }
}

function fillRect(cv, x0, y0, x1, y1, rgb, alpha) {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      put(cv, x, y, (rgb >> 16) & 0xff, (rgb >> 8) & 0xff, rgb & 0xff, alpha);
    }
  }
}

function icon(path, c1, c2, draw) {
  const cv = canvas(512, 512);
  fillGradient(cv, c1, c2, false);
  if (draw) draw(cv);
  save(path, 512, 512, cv.data);
}

// Milli Pulse: 紫→ピンク グラデ + 白い円
icon("images/games/icon/Milli Pulse -icon.png", 0x8582fb, 0xf472b6, (cv) => {
  fillCircle(cv, 256, 256, 120, 0xffffff, 235);
  fillCircle(cv, 256, 256, 96, 0xffffff, 255);
});

// Milli Spectrum: 青→緑 グラデ + 虹色の縦バー
icon("images/games/icon/Milli Spectrum-icon.png", 0x60a5fa, 0x34d399, (cv) => {
  const bars = [0xff6b6b, 0xfbbf24, 0x34d399, 0x60a5fa, 0xa78bfa];
  const bw = 40;
  for (let i = 0; i < bars.length; i++) {
    fillRect(cv, 156 + i * bw - 16, 160, 156 + i * bw + 16, 352, bars[i], 255);
  }
});

// Milli Choice: オレンジ→赤 グラデ + 白い二つの四角
icon("images/games/icon/Milli Choice-icon.png", 0xfb923c, 0xef4444, (cv) => {
  fillRect(cv, 156, 200, 246, 312, 0xffffff, 235);
  fillRect(cv, 266, 200, 356, 312, 0xffffff, 255);
});

// Millipro 2048: 青→紫 グラデ + 2x2グリッド
icon("images/games/icon/Millipro 2048-icon.png", 0x38bdf8, 0x8b5cf6, (cv) => {
  const s = 90;
  const off = 236;
  fillRect(cv, off, off, off + s, off + s, 0xffffff, 255);
  fillRect(cv, off + s + 20, off, off + s * 2 + 20, off + s, 0xffffff, 220);
  fillRect(cv, off, off + s + 20, off + s, off + s * 2 + 20, 0xffffff, 220);
  fillRect(cv, off + s + 20, off + s + 20, off + s * 2 + 20, off + s * 2 + 20, 0xffffff, 255);
});

// ゲームロゴ(ヘッダー用プレースホルダ)
function rogo(path, c1, c2) {
  const cv = canvas(512, 160);
  fillGradient(cv, c1, c2, false);
  save(path, 512, 160, cv.data);
}

rogo("images/games/rogo/Millipro 2048-rogo.png", 0x38bdf8, 0x8b5cf6);
rogo("images/games/rogo/Milli Pulse-rogo.png", 0x8582fb, 0xf472b6);
rogo("images/games/rogo/Milli Spectrum-rogo.png", 0x60a5fa, 0x34d399);
rogo("images/games/rogo/Milli Choice-rogo.png", 0xfb923c, 0xef4444);
rogo("images/games/rogo/TEMPLATE-rogo.png", 0x8582fb, 0x716ed5);

// TEMPLATE 用アイコン
icon("images/games/icon/TEMPLATE-icon.png", 0x8582fb, 0x716ed5, (cv) => {
  fillCircle(cv, 256, 256, 120, 0xffffff, 255);
});

// みりこれ！用アイコン（ピンク→紫 + 白いカード模様）
icon("images/games/icon/Miri Kore-icon.png", 0xf472b6, 0x8582fb, (cv) => {
  fillRect(cv, 136, 136, 376, 376, 0xffffff, 255);
  fillRect(cv, 176, 176, 336, 336, 0xf472b6, 255);
});
rogo("images/games/rogo/Miri Kore-rogo.png", 0xf472b6, 0x8582fb);

// Milli Fortune 用アイコン（暗い紫 + 金のチップ）
icon("images/games/icon/Milli Fortune-icon.png", 0x2d1b4e, 0x140a26, (cv) => {
  fillCircle(cv, 256, 256, 150, 0xf5b93f, 255);
  fillCircle(cv, 256, 256, 110, 0xffe9a8, 255);
  fillCircle(cv, 256, 256, 95, 0xf5b93f, 255);
  fillCircle(cv, 256, 256, 40, 0xffffff, 255);
});
rogo("images/games/rogo/Milli Fortune-rogo.png", 0x2d1b4e, 0x8b5cf6);

// ミリカラ用アイコン（紫→ピンク + マイク）
icon("images/games/icon/milikara-icon.png", 0x8582fb, 0xf472b6, (cv) => {
  // マイク本体
  fillRect(cv, 236, 160, 276, 320, 0xffffff, 255);
  fillCircle(cv, 256, 320, 40, 0xffffff, 255);
  // マイクヘッド
  fillCircle(cv, 256, 180, 55, 0x2d1b4e, 255);
  for (let y = 145; y < 215; y += 12) {
    for (let x = 221; x < 291; x += 12) {
      fillCircle(cv, x, y, 3, 0xffffff, 90);
    }
  }
  // 音符
  fillCircle(cv, 360, 200, 22, 0xffffff, 255);
  fillCircle(cv, 340, 260, 18, 0xffffff, 255);
});
rogo("images/games/rogo/milikara-rogo.png", 0x8582fb, 0xf472b6);

console.log("done");