/* ============================================================
   Milli Café
   ミリプロファンメイド 3Dカフェ運営アクション
   ※ 追加・調整したいデータ（料理・タレント・ステージ）は
      本ファイル冒頭の DATA セクションにあります。
   ============================================================ */
"use strict";

/* ============================================================
   [0] ユーティリティ
   ============================================================ */
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function rand(a, b) { return a + Math.random() * (b - a); }
function randInt(a, b) { return Math.floor(rand(a, b + 1)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function dist3(ax, az, bx, bz) { return Math.hypot(ax - bx, az - bz); }
function $(id) { return document.getElementById(id); }
function now() { return performance.now(); }

/* ============================================================
   [1] DATA 定義（ここに足すだけで追加・調整できます）
   ============================================================ */

// ---- タレント ----
// id は全サイト共通の MILLIPRO_TALENTS と一致させています。
// 立ち絵画像は images/talents/<id>.webp を使用（無ければイニシャル表示）。
var TALENTS = {
  konomi:  { name: "甘狼このみ",   hair: 0xf2a0b8, outfit: 0xffd9e6, fav: "cake",    freq: 1.0, patience: 46, color: "#f2a0b8" },
  rizu:    { name: "雨夜リズ",     hair: 0x6fa8dc, outfit: 0xcfe3f7, fav: "drink",   freq: 1.0, patience: 42, color: "#6fa8dc" },
  nono:    { name: "音ノ乃のの",   hair: 0xb29dd6, outfit: 0xe6ddf5, fav: "cake",    freq: 1.0, patience: 44, color: "#b29dd6" },
  tukuri:  { name: "眠雲ツクリ",   hair: 0x9ccbd0, outfit: 0xd8f0f2, fav: "bread",   freq: 1.0, patience: 52, color: "#9ccbd0" },
  akubi:   { name: "あくび・でもんすぺーど", hair: 0xb8c0d6, outfit: 0xe0e4f0, fav: "bread",   freq: 1.0, patience: 48, color: "#b8c0d6" },
  nuhu:    { name: "虹深°ぬふ",     hair: 0x6f7bd9, outfit: 0xd5d9f5, fav: "parfait", freq: 1.0, patience: 40, color: "#6f7bd9" },
  rako:    { name: "音ノ瀬らこ",   hair: 0x8fcf8f, outfit: 0xd9f2d9, fav: "cake",    freq: 1.0, patience: 45, color: "#8fcf8f" },
  rei:     { name: "夕霧レイ",     hair: 0x8a7bb8, outfit: 0xe2ddf2, fav: "parfait", freq: 1.0, patience: 43, color: "#8a7bb8" },
  yura:    { name: "ゆらぎゆら",   hair: 0xc9d98a, outfit: 0xeef2cf, fav: "bread",   freq: 1.0, patience: 42, color: "#c9d98a" },
  koma:    { name: "小廻こま",     hair: 0xe0a080, outfit: 0xf7e0d0, fav: "drink",   freq: 1.0, patience: 39, color: "#e0a080" }
};
var TALENT_IDS = Object.keys(TALENTS);

// ---- アイテム ----
var ITEMS = {
  cakeBatter:  { name: "ケーキ生地", color: 0xffe9c4, kind: "raw",  desc: "オーブンで焼こう" },
  breadDough:  { name: "パン生地",   color: 0xffd9a0, kind: "raw",  desc: "オーブンで焼こう" },
  cup:         { name: "カップ",     color: 0xffffff, kind: "raw",  desc: "マシンで注ごう" },
  fruit:       { name: "フルーツ",   color: 0xff9ac1, kind: "raw",  desc: "マシンで組み立てよう" },
  bakedCake:   { name: "焼き上がり", color: 0xe8b06a, kind: "mid",  desc: "盛付台でお皿に" },
  parfaitBase: { name: "パフェ土台", color: 0xffb3d1, kind: "mid",  desc: "盛付台でお皿に" },
  bakedBread:  { name: "焼きパン",   color: 0xd9a05a, kind: "dish", desc: "このまま提供OK！" },
  drink:       { name: "ドリンク",   color: 0x8ecae6, kind: "dish", desc: "このまま提供OK！" },
  cake:        { name: "ケーキ",     color: 0xffc6d9, kind: "dish", desc: "このまま提供OK！" },
  parfait:     { name: "パフェ",     color: 0xff9ecb, kind: "dish", desc: "このまま提供OK！" },
  burnt:       { name: "焦げた食材", color: 0x4a3a30, kind: "burnt", desc: "ゴミ箱に捨てよう" }
};
var SHELF_ITEMS = ["cakeBatter", "breadDough", "cup", "fruit"];

// ---- レシピ ----
var RECIPES = {
  cake:    { name: "ケーキ",     base: 300, raw: "cakeBatter",  cook: "oven",   time: 4.2, burn: 6.0, plate: true,  final: "cake",        steps: "ケーキ生地→オーブン→盛付台" },
  bread:   { name: "パン",       base: 220, raw: "breadDough",  cook: "oven",   time: 3.0, burn: 6.0, plate: false, final: "bakedBread", steps: "パン生地→オーブン" },
  drink:   { name: "ドリンク",   base: 200, raw: "cup",         cook: "machine", time: 2.4, burn: 6.0, plate: false, final: "drink",      steps: "カップ→マシン" },
  parfait: { name: "パフェ",     base: 260, raw: "fruit",       cook: "machine", time: 3.6, burn: 6.0, plate: true,  final: "parfait",    steps: "フルーツ→マシン→盛付台" }
};
var RECIPE_IDS = Object.keys(RECIPES);
// 調理台の「素材 → 出力」対応表（出力が mid なら盛付台へ）
var COOK_OUT = {
  oven:    { cakeBatter: "bakedCake", breadDough: "bakedBread" },
  machine: { cup: "drink", fruit: "parfaitBase" }
};
// 盛付台の「途中 → 完成」対応表
var PLATE_MAP = { bakedCake: "cake", parfaitBase: "parfait" };

// ---- ステーション配置 ----
var STATION_DEFS = [
  { id: "shelf",   name: "食材置き場",    x: -4.6, z: -3.4, kind: "shelf" },
  { id: "oven",    name: "オーブン",      x: -2.6, z: -3.4, kind: "cook", cooks: COOK_OUT.oven },
  { id: "machine", name: "ドリンクマシン", x: -0.6, z: -3.4, kind: "cook", cooks: COOK_OUT.machine },
  { id: "plate",   name: "盛付台",        x: 1.4,  z: -3.4, kind: "plate", plateMap: PLATE_MAP },
  { id: "trash",   name: "ゴミ箱",        x: 4.8,  z: -3.6, kind: "trash" }
];

// ---- ステージ設定 ----
var STAGE = {
  timeLimit: 90,
  maxCustomers: 4,
  spawnBase: 6.2,
  spawnMin: 2.4,
  spawnDecay: 0.045,
  patienceBase: 46,
  serveRange: 2.8,
  interactRange: 2.1,
  comboWindow: 10
};

// ---- ランク閾値 ----
var RANK_THRESH = [700, 1500, 2600];
var RANK_NAMES = ["", "開店準備OK", "人気カフェ", "カフェマスター"];

/* ============================================================
   [2] オーディオ
   ============================================================ */
var AC = null, sfxGain = null, bgmGain = null, bgmTimer = null;
var settings = loadSettings();

function loadSettings() {
  try {
    var s = JSON.parse(localStorage.getItem("milliCafe_settings") || "null");
    if (s && typeof s === "object") {
      if (s.sfx === undefined) s.sfx = 80;
      if (s.bgm === undefined) s.bgm = 50;
      if (s.quality === undefined) s.quality = "high";
      if (s.control === undefined) s.control = "auto";
      return s;
    }
  } catch (e) {}
  return { sfx: 80, bgm: 50, quality: (navigator.maxTouchPoints > 0 ? "low" : "high"), control: "auto" };
}
function isKeyboardMode() {
  return settings.control === "keyboard" || (settings.control === "auto" && !isTouch);
}
function isTouchMode() {
  return settings.control === "touch" || (settings.control === "auto" && isTouch);
}
function saveSettings() {
  try { localStorage.setItem("milliCafe_settings", JSON.stringify(settings)); } catch (e) {}
}

function ensureAudio() {
  if (!AC) {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    AC = new Ctx();
    sfxGain = AC.createGain();
    bgmGain = AC.createGain();
    sfxGain.connect(AC.destination);
    bgmGain.connect(AC.destination);
    applyVolumes();
  }
  if (AC.state === "suspended") AC.resume();
}
function applyVolumes() {
  if (sfxGain) sfxGain.gain.value = (settings.sfx / 100) * 0.9;
  if (bgmGain) bgmGain.gain.value = (settings.bgm / 100) * 0.18;
}
function tone(freq, dur, type, vol, when, slideTo) {
  if (!AC) return;
  var t = AC.currentTime + (when || 0);
  var o = AC.createOscillator();
  var g = AC.createGain();
  o.type = type || "sine";
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(vol || 0.2, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g); g.connect(sfxGain);
  o.start(t); o.stop(t + dur + 0.02);
}
var SFX = {
  take:  function () { tone(760, 0.12, "triangle", 0.25); tone(1150, 0.1, "sine", 0.15, 0.03); },
  put:   function () { tone(320, 0.1, "triangle", 0.2); tone(210, 0.12, "sine", 0.16, 0.02, 150); },
  ready: function () { tone(620, 0.14, "sine", 0.2); tone(930, 0.18, "sine", 0.2, 0.12); },
  burn:  function () { tone(180, 0.4, "sawtooth", 0.22, 0, 90); },
  serve: function () { tone(660, 0.12, "sine", 0.24); tone(880, 0.12, "sine", 0.24, 0.09); tone(1320, 0.2, "sine", 0.22, 0.18); },
  combo: function () { tone(880, 0.1, "sine", 0.2); tone(1100, 0.1, "sine", 0.2, 0.07); tone(1460, 0.16, "sine", 0.2, 0.14); },
  leave: function () { tone(300, 0.25, "triangle", 0.2, 0, 160); },
  trash: function () { tone(240, 0.14, "square", 0.12, 0, 120); },
  count: function () { tone(520, 0.09, "sine", 0.2); },
  go:    function () { tone(660, 0.12, "sine", 0.22); tone(990, 0.3, "sine", 0.24, 0.1); },
  click: function () { tone(880, 0.07, "sine", 0.12); },
  fanfare: function () {
    var n = [523, 659, 784, 1046];
    for (var i = 0; i < 4; i++) tone(n[i], 0.22, "sine", 0.2, i * 0.12);
  }
};
var BGM_NOTES = [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25, 587.33, 783.99];
var bgmBeat = 0;
function bgmStart() {
  if (!AC || bgmTimer) return;
  bgmBeat = 0;
  bgmTimer = setInterval(function () {
    if (AC.state !== "running") return;
    var f = BGM_NOTES[bgmBeat % BGM_NOTES.length];
    var t = AC.currentTime;
    var o = AC.createOscillator();
    var g = AC.createGain();
    o.type = "sine";
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
    o.connect(g); g.connect(bgmGain);
    o.start(t); o.stop(t + 0.6);
    bgmBeat++;
  }, 420);
}
function bgmStop() {
  if (bgmTimer) { clearInterval(bgmTimer); bgmTimer = null; }
}

/* ============================================================
   [3] Three.js セットアップ
   ============================================================ */
var renderer, scene, camera, clock;
var W = 0, H = 0, aspect = 1;
var isTouch = (navigator.maxTouchPoints > 0) || ("ontouchstart" in window);

function setupRenderer() {
  var wrap = $("gl-wrap");
  renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor(0xdcbd9c, 1);
  wrap.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xdcbd9c, 12, 30);
  camera = new THREE.PerspectiveCamera(50, 1, 0.1, 90);

  var amb = new THREE.AmbientLight(0xffffff, 0.62);
  scene.add(amb);
  var dir = new THREE.DirectionalLight(0xffe9c8, 0.85);
  dir.position.set(5, 12, -4);
  scene.add(dir);
  var warm = new THREE.PointLight(0xffcf9e, 0.35, 18);
  warm.position.set(0, 4.2, 2.5);
  scene.add(warm);

  clock = new THREE.Clock();
}
function resize() {
  W = window.innerWidth; H = window.innerHeight;
  aspect = W / H;
  renderer.setSize(W, H);
  camera.aspect = aspect;
  camera.fov = aspect < 1 ? 56 : 50;
  camera.updateProjectionMatrix();
}

/* ============================================================
   [4] マテリアル・テクスチャヘルパ
   ============================================================ */
var matCache = {};
function mat(color, opts) {
  opts = opts || {};
  var key = color + "|" + (opts.flat ? "f" : "") + (opts.emissive ? "e" + opts.emissive : "");
  if (matCache[key]) return matCache[key];
  var m = new THREE.MeshLambertMaterial({ color: color, flatShading: opts.flat !== false });
  if (opts.emissive) m.emissive = new THREE.Color(opts.emissive);
  matCache[key] = m;
  return m;
}
function cssCol(n) {
  return "#" + n.toString(16).padStart(6, "0");
}
function itemColor(itemId) {
  var it = ITEMS[itemId];
  return it ? cssCol(it.color) : "#a08ab0";
}
function recipeColor(rid) {
  var fin = RECIPES[rid].final;
  return fin ? itemColor(fin) : "#a08ab0";
}
function makeTex(canvas) {
  var t = new THREE.CanvasTexture(canvas);
  t.minFilter = THREE.NearestFilter;
  t.magFilter = THREE.NearestFilter;
  return t;
}
function checkerTexture() {
  var c = document.createElement("canvas");
  c.width = c.height = 64;
  var g = c.getContext("2d");
  g.fillStyle = "#f0d7ae"; g.fillRect(0, 0, 64, 64);
  g.fillStyle = "#e0aebf"; g.fillRect(0, 0, 32, 32); g.fillRect(32, 32, 32, 32);
  var t = makeTex(c);
  t.repeat.set(7, 5);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
function brickTexture() {
  var c = document.createElement("canvas");
  c.width = 128; c.height = 128;
  var g = c.getContext("2d");
  var bw = 16, bh = 8;
  g.fillStyle = "#d9c3b3";
  g.fillRect(0, 0, 128, 128);
  var brickCols = ["#a34a3f", "#b2554a", "#99433a", "#ad4f45"];
  for (var row = 0; row < 16; row++) {
    var off = (row % 2) * (bw / 2);
    for (var col = -1; col < 8; col++) {
      var bx = col * bw + off, by = row * bh;
      g.fillStyle = brickCols[(row + col + 8) % brickCols.length];
      g.fillRect(bx + 1, by + 1, bw - 2, bh - 2);
      g.fillStyle = "rgba(0,0,0,0.06)";
      g.fillRect(bx + 1, by + bh - 2, bw - 2, 1);
    }
  }
  var t = makeTex(c);
  t.repeat.set(6, 3);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
function menuTexture() {
  var c = document.createElement("canvas");
  c.width = 256; c.height = 128;
  var g = c.getContext("2d");
  g.fillStyle = "#5d3a8a"; g.fillRect(0, 0, 256, 128);
  g.strokeStyle = "#ffe9a8"; g.lineWidth = 6;
  g.strokeRect(8, 8, 240, 112);
  g.fillStyle = "#ffffff";
  g.font = "bold 40px sans-serif"; g.textAlign = "center";
  g.fillText("本日のメニュー", 128, 56);
  var cols = ["#ffc6d9", "#ffb08a", "#8ecae6", "#ff9ecb"];
  for (var i = 0; i < 4; i++) {
    g.fillStyle = cols[i];
    g.beginPath();
    g.arc(62 + i * 44, 92, 11, 0, Math.PI * 2);
    g.fill();
  }
  var t = makeTex(c);
  return t;
}

/* ============================================================
   [5] メッシュビルダー
   ============================================================ */
function box(w, h, d, color, opts) {
  var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, opts));
  m.castShadow = false; m.receiveShadow = false;
  return m;
}
function sph(r, color, opts) {
  var m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), mat(color, opts));
  m.castShadow = false; m.receiveShadow = false;
  return m;
}
function cyl(rt, rb, h, color, opts, seg) {
  var m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 12), mat(color, opts));
  m.castShadow = false; m.receiveShadow = false;
  return m;
}
function plane(w, h, color) {
  var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat(color));
  m.rotation.x = -Math.PI / 2;
  return m;
}

// ---- アイテムの見た目（持ち物・台の上で共用） ----
var itemVisualCache = {};
function buildItemVisual(id) {
  if (itemVisualCache[id]) return itemVisualCache[id].clone();
  var g = new THREE.Group();
  var plate = function () {
    var p = cyl(0.3, 0.3, 0.04, 0xf7f2f7);
    p.position.y = -0.02;
    g.add(p);
  };
  switch (id) {
    case "cakeBatter": {
      var s = sph(0.17, 0xffe9c4); s.scale.y = 0.6; s.position.y = 0.1; g.add(s); break;
    }
    case "breadDough": {
      var s2 = sph(0.16, 0xffd9a0); s2.scale.y = 0.75; s2.position.y = 0.1; g.add(s2); break;
    }
    case "cup": {
      var cu = cyl(0.1, 0.09, 0.22, 0xffffff); cu.position.y = 0.13; g.add(cu);
      var li = cyl(0.085, 0.085, 0.03, 0x8ecae6); li.position.y = 0.2; g.add(li);
      break;
    }
    case "fruit": {
      var c1 = sph(0.09, 0xff7b9c); c1.position.set(-0.05, 0.13, 0);
      var c2 = sph(0.09, 0x8ecae6); c2.position.set(0.06, 0.1, 0.03);
      var c3 = sph(0.08, 0xf6d55c); c3.position.set(-0.01, 0.18, -0.02);
      g.add(c1); g.add(c2); g.add(c3);
      break;
    }
    case "bakedCake": {
      var b = cyl(0.16, 0.19, 0.13, 0xe8b06a); b.position.y = 0.09; g.add(b);
      var cr = sph(0.1, 0xfff6f0); cr.position.y = 0.2; g.add(cr);
      break;
    }
    case "bakedBread": {
      plate();
      var bd = sph(0.16, 0xd9a05a); bd.scale.set(1, 0.8, 1.3); bd.position.y = 0.12; g.add(bd);
      break;
    }
    case "drink": {
      var d = cyl(0.11, 0.1, 0.26, 0xfff6f0); d.position.y = 0.15; g.add(d);
      var dl = cyl(0.09, 0.09, 0.08, 0x8ecae6); dl.position.y = 0.21; g.add(dl);
      var st = box(0.025, 0.24, 0.025, 0xff5f9e); st.position.set(0.05, 0.28, 0); g.add(st);
      break;
    }
    case "parfaitBase": {
      var cn = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.26, 10), mat(0xffb3d1));
      cn.position.y = 0.16; g.add(cn);
      var pc = sph(0.1, 0xffffff); pc.position.y = 0.3; g.add(pc);
      break;
    }
    case "cake": {
      plate();
      var cb = cyl(0.17, 0.17, 0.12, 0xffb8ce); cb.position.y = 0.08; g.add(cb);
      var cw = cyl(0.18, 0.18, 0.03, 0xffffff); cw.position.y = 0.155; g.add(cw);
      var bb = sph(0.045, 0xff4d6d); bb.position.y = 0.22; g.add(bb);
      break;
    }
    case "parfait": {
      plate();
      var pn = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.24, 10), mat(0xff9ecb));
      pn.position.y = 0.16; g.add(pn);
      var pr = sph(0.09, 0xffffff); pr.position.y = 0.29; g.add(pr);
      var pb = sph(0.045, 0xff4d6d); pb.position.set(0.03, 0.1, 0); g.add(pb);
      break;
    }
    case "burnt": {
      var bu = sph(0.17, 0x4a3a30); bu.position.y = 0.1; g.add(bu);
      var sm = sph(0.11, 0x6b5a50); sm.position.y = 0.22; g.add(sm);
      break;
    }
    default: break;
  }
  itemVisualCache[id] = g;
  return g.clone();
}

// ---- ちびキャラ ----
function buildChibi(opts) {
  var g = new THREE.Group();
  var outfit = opts.outfit || 0xffd9e6;
  var hair = opts.hair || 0xf2a0b8;
  var skin = 0xffe3d0;

  var legMat = mat(0x5a3a5a);
  var l1 = box(0.13, 0.28, 0.14, null, { flat: false }); l1.material = legMat;
  l1.position.set(-0.09, 0.14, 0);
  var l2 = l1.clone(); l2.position.x = 0.09;
  g.add(l1); g.add(l2);

  var body = box(0.46, 0.46, 0.32, outfit);
  body.position.y = 0.5;
  g.add(body);
  if (opts.apron) {
    var ap = box(0.34, 0.3, 0.18, opts.apron);
    ap.position.set(0, 0.48, 0.1);
    g.add(ap);
  }
  var armMat = mat(skin);
  var a1 = box(0.09, 0.26, 0.1, null, { flat: false }); a1.material = armMat;
  a1.position.set(-0.28, 0.52, 0);
  var a2 = a1.clone(); a2.position.x = 0.28;
  g.add(a1); g.add(a2);

  var head = sph(0.22, skin);
  head.position.y = 0.9;
  g.add(head);

  var hairS = sph(0.235, hair);
  hairS.scale.y = 0.82;
  hairS.position.set(0, 0.96, -0.01);
  g.add(hairS);
  var fringe = sph(0.19, hair);
  fringe.scale.set(1.06, 0.62, 0.8);
  fringe.position.set(0, 0.93, 0.05);
  g.add(fringe);

  var eyeMat = mat(0x33334a);
  var e1 = sph(0.03, null, { flat: false }); e1.material = eyeMat; e1.position.set(-0.075, 0.88, 0.17);
  var e2 = e1.clone(); e2.position.x = 0.075;
  g.add(e1); g.add(e2);
  var mouth = box(0.05, 0.018, 0.01, 0xc96a5a);
  mouth.position.set(0, 0.8, 0.19);
  g.add(mouth);
  var blush = sph(0.022, 0xffb0c0);
  blush.position.set(-0.12, 0.82, 0.14);
  var blush2 = blush.clone(); blush2.position.x = 0.12;
  g.add(blush); g.add(blush2);

  if (opts.hat) {
    var hc = cyl(0.16, 0.17, 0.12, 0xffffff);
    hc.position.y = 1.12;
    var hp = sph(0.14, 0xffffff);
    hp.position.y = 1.22;
    g.add(hc); g.add(hp);
  }
  return g;
}

/* ============================================================
   [6] カフェ3Dシーン構築
   ============================================================ */
function buildShadow() {
  var s = new THREE.Mesh(new THREE.CircleGeometry(0.36, 18),
    new THREE.MeshBasicMaterial({ color: 0x241a33, transparent: true, opacity: 0.24, depthWrite: false }));
  s.rotation.x = -Math.PI / 2;
  s.position.y = 0.015;
  return s;
}
var caféGroup = null;
var colliders = [];
var stations = [];
var doorX = 6.4, doorZ = 1.5;
var SEATS = [{ x: -4.5 }, { x: -1.5 }, { x: 1.5 }, { x: 4.5 }];
var SERVE_Z = 2.85;

function buildCafé(quality) {
  var low = quality !== "high";
  if (caféGroup) scene.remove(caféGroup);
  caféGroup = new THREE.Group();
  colliders = [];

  function addCollider(x0, z0, x1, z1) { colliders.push({ x0: x0, z0: z0, x1: x1, z1: z1 }); }

  // 周囲の地面
  var ground = plane(120, 120, 0xc09c73);
  ground.position.y = -0.03;
  caféGroup.add(ground);

  // 床（チェッカー）
  var floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 9), new THREE.MeshLambertMaterial({ map: checkerTexture() }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 0);
  caféGroup.add(floor);

  var wood = 0xe8b88a, woodDark = 0x8a5a3a;

  // 壁（レンガ調）
  var brickMat = new THREE.MeshLambertMaterial({
    color: 0xc06a55,
    flatShading: true,
    map: low ? null : brickTexture()
  });
  function brickWall(w, h, d) {
    var m = box(w, h, d, 0xc06a55);
    m.material = brickMat;
    caféGroup.add(m);
    return m;
  }
  var north = brickWall(12.4, 3.0, 0.3); north.position.set(0, 1.5, -4.5);
  addCollider(-6.4, -4.8, 6.4, -4.4);
  var west = brickWall(0.3, 3.0, 9.4); west.position.set(-6, 1.5, 0);
  addCollider(-6.4, -4.7, -5.6, 4.7);
  var eTop = brickWall(0.3, 3.0, 5.2); eTop.position.set(6, 1.5, -2.0);
  addCollider(5.6, -4.7, 6.4, 0.5);
  var eBot = brickWall(0.3, 3.0, 2.4); eBot.position.set(6, 1.5, 3.5);
  addCollider(5.6, 2.5, 6.4, 4.7);

  // ドア枠（東側の入口）
  var dp1 = box(0.18, 3.0, 0.18, woodDark); dp1.position.set(6.0, 1.5, 0.5); caféGroup.add(dp1);
  var dp2 = box(0.18, 3.0, 0.18, woodDark); dp2.position.set(6.0, 1.5, 2.5); caféGroup.add(dp2);
  var dlint = box(0.18, 0.18, 2.2, woodDark); dlint.position.set(6.0, 2.92, 1.5); caféGroup.add(dlint);

  // 壁の腰板ライン（レンガの下をダーク木で引き締め）
  var wain1 = box(12.4, 0.22, 0.14, woodDark); wain1.position.set(0, 0.11, -4.56); caféGroup.add(wain1);
  var wain2 = box(0.14, 0.22, 9.4, woodDark); wain2.position.set(-6.11, 0.11, 0); caféGroup.add(wain2);
  var wain3 = box(0.14, 0.22, 5.2, woodDark); wain3.position.set(6.11, 0.11, -2.0); caféGroup.add(wain3);
  var wain4 = box(0.14, 0.22, 2.4, woodDark); wain4.position.set(6.11, 0.11, 3.5); caféGroup.add(wain4);

  // 窓（北側）
  function windowMesh(x, z) {
    var f = box(1.1, 1.1, 0.1, 0xaee7f0);
    f.position.set(x, 2.0, z);
    caféGroup.add(f);
    var cross = box(1.15, 0.08, 0.14, 0xffffff);
    cross.position.copy(f.position);
    caféGroup.add(cross);
  }
  windowMesh(-2.2, -4.34);
  windowMesh(0.2, -4.34);

  // メニューボード
  var menu = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.7), new THREE.MeshBasicMaterial({ map: menuTexture() }));
  menu.position.set(1.0, 2.2, -4.31);
  caféGroup.add(menu);
  var frame = box(3.7, 2.0, 0.12, wood); frame.position.set(1.0, 2.2, -4.28); caféGroup.add(frame);

  // サインボード
  var sign = box(2.6, 0.5, 0.12, 0xffffff);
  sign.position.set(-2.4, 2.55, -4.34);
  caféGroup.add(sign);

  // 天井ランタン列
  for (var i = 0; i < 6; i++) {
    var lx = -4.5 + i * 1.8;
    var bulb = sph(0.07, 0xfff2c9, { emissive: 0xffe9a0 });
    bulb.position.set(lx, 2.85, 0.2);
    caféGroup.add(bulb);
    var cord = cyl(0.012, 0.012, 0.4, 0x8a6ab0);
    cord.position.set(lx, 2.6, 0.2);
    caféGroup.add(cord);
  }

  // 観葉植物
  function plant(x, z) {
    var pot = cyl(0.22, 0.16, 0.28, 0xe8a0a0);
    pot.position.set(x, 0.14, z);
    caféGroup.add(pot);
    for (var i = 0; i < 4; i++) {
      var leaf = sph(0.15, i % 2 ? 0x7fbf6a : 0x94cc7a);
      leaf.position.set(x + Math.sin(i * 1.6) * 0.13, 0.45 + (i % 2) * 0.1, z + Math.cos(i * 1.6) * 0.13);
      leaf.scale.y = 1.3;
      caféGroup.add(leaf);
    }
  }
  plant(-5.5, 2.6); plant(5.5, 2.6);

  // 壁アート
  function art(x, z, col, ry) {
    var fr = box(0.62, 0.62, 0.08, wood);
    fr.position.set(x, 2.1, z); fr.rotation.y = ry;
    caféGroup.add(fr);
    var inner = box(0.42, 0.42, 0.06, col);
    inner.position.set(x, 2.1, z); inner.rotation.y = ry;
    caféGroup.add(inner);
  }
  if (!low) {
    art(-5.78, 0.5, 0xffc6d9, Math.PI / 2);
    art(-5.78, 2.0, 0x9ecbff, Math.PI / 2);
    art(-5.78, 3.5, 0xc3b2e7, Math.PI / 2);
  }

  // 中央の装飾テーブル＆花
  function decoTable(x, z) {
    var t = cyl(0.28, 0.28, 0.42, wood);
    t.position.set(x, 0.21, z);
    caféGroup.add(t);
    var top = cyl(0.32, 0.32, 0.05, 0xffffff);
    top.position.set(x, 0.45, z);
    caféGroup.add(top);
    var vase = cyl(0.07, 0.1, 0.22, 0xff9ecb);
    vase.position.set(x, 0.58, z);
    caféGroup.add(vase);
    for (var i = 0; i < 3; i++) {
      var fl = sph(0.05, [0xff6b8a, 0xffe08a, 0x8ecae6][i]);
      fl.position.set(x + (i - 1) * 0.05, 0.74, z);
      caféGroup.add(fl);
    }
  }
  if (!low) {
    decoTable(3.4, -1.2);
    decoTable(3.4, 1.2);
  }

  // キッチン背面カウンター
  var backCounter = box(11.4, 0.9, 0.9, wood);
  backCounter.position.set(0, 0.45, -3.7);
  caféGroup.add(backCounter);
  var counterTop = box(11.4, 0.12, 0.95, 0xfff6ee);
  counterTop.position.set(0, 0.93, -3.7);
  caféGroup.add(counterTop);
  addCollider(-5.8, -4.15, 5.8, -3.25);

  // ステーション本体
  stations = STATION_DEFS.map(function (def) {
    var s = {
      def: def,
      phase: "empty",
      raw: null,
      out: null,
      prog: 0,
      cookTime: 0,
      burnLeft: 0,
      plated: null,
      warned: false,
      display: new THREE.Group(),
      barFill: null,
      barMat: null
    };
    var base = box(1.5, 0.8, 1.1, wood);
    base.position.set(def.x, 0.4, def.z);
    caféGroup.add(base);
    var top = box(1.3, 0.12, 0.95, def.kind === "trash" ? 0xbfd9c8 : 0xffffff);
    top.position.set(def.x, 0.82, def.z);
    caféGroup.add(top);

    if (def.kind === "shelf") {
      for (var i = 0; i < SHELF_ITEMS.length; i++) {
        var iv = buildItemVisual(SHELF_ITEMS[i]);
        iv.position.set(def.x - 0.34 + i * 0.23, 1.02, def.z + 0.2);
        iv.scale.setScalar(0.75);
        caféGroup.add(iv);
      }
    } else if (def.kind === "trash") {
      var lid = cyl(0.42, 0.44, 0.1, 0x7aa08a);
      lid.position.set(def.x, 0.92, def.z);
      caféGroup.add(lid);
    } else if (def.kind === "cook") {
      var pad = box(def.id === "oven" ? 1.1 : 1.2, 0.16, 0.8, def.id === "oven" ? 0x8a8a9a : 0xbcd0e8);
      pad.position.set(def.x, 0.9, def.z);
      caféGroup.add(pad);
      var barBg = box(1.0, 0.06, 0.05, 0xd8c8dc);
      barBg.position.set(def.x, 1.62, def.z + 0.3);
      caféGroup.add(barBg);
      s.barMat = mat(0x6fcf8f);
      s.barFill = box(0.94, 0.04, 0.02, null, { flat: false });
      s.barFill.material = s.barMat;
      s.barFill.scale.x = 0.0001;
      s.barFill.position.set(def.x, 1.62, def.z + 0.32);
      s.barFill.visible = false;
      caféGroup.add(s.barFill);
    } else if (def.kind === "plate") {
      var pt = cyl(0.5, 0.5, 0.08, 0xf7f2f7);
      pt.position.set(def.x, 0.92, def.z);
      caféGroup.add(pt);
    }
    s.display.position.set(def.x, 1.15, def.z);
    s.display.visible = false;
    caféGroup.add(s.display);
    // ステーションは通過不可（プレイヤーの足場）
    var halfW = def.kind === "trash" ? 0.62 : 0.75;
    var halfD = def.kind === "trash" ? 0.6 : 0.55;
    addCollider(def.x - halfW, def.z - halfD, def.x + halfW, def.z + halfD);
    return s;
  });

  // 提供カウンター
  var counter = box(11.0, 1.05, 0.7, 0xd8a06a);
  counter.position.set(0, 0.52, SERVE_Z);
  caféGroup.add(counter);
  addCollider(-5.6, SERVE_Z - 0.4, 5.6, SERVE_Z + 0.4);
  var counterTop = box(11.2, 0.08, 0.9, 0xffffff);
  counterTop.position.set(0, 1.06, SERVE_Z);
  caféGroup.add(counterTop);
  if (!low) {
    for (var si = 0; si < SEATS.length; si++) {
      var stool = cyl(0.16, 0.16, 0.5, wood);
      stool.position.set(SEATS[si].x, 0.25, 4.05);
      caféGroup.add(stool);
      var cushion = cyl(0.18, 0.18, 0.08, 0xff9ecb);
      cushion.position.set(SEATS[si].x, 0.55, 4.05);
      caféGroup.add(cushion);
    }
  }
  var reg = box(0.4, 0.25, 0.3, 0xc3b2e7);
  reg.position.set(-5.0, 1.2, SERVE_Z);
  caféGroup.add(reg);

  // ドア枠
  var doorFrame = box(1.1, 2.3, 0.2, wood);
  doorFrame.position.set(doorX - 0.05, 1.15, doorZ);
  caféGroup.add(doorFrame);

  scene.add(caféGroup);
}

/* ============================================================
   [7] プレイヤー
   ============================================================ */
var player = { x: 0, z: -1, rot: 0, bob: 0, moving: false };
var playerGroup = null, playerHand = null, playerShadow = null;
var held = null;

function buildPlayer() {
  playerGroup = new THREE.Group();
  var chibi = buildChibi({ outfit: 0xff6b8a, apron: 0xffffff, hair: 0x7a5bb0, hat: true });
  playerGroup.add(chibi);
  playerHand = new THREE.Group();
  playerHand.position.set(0, 1.0, 0.52);
  playerGroup.add(playerHand);
  scene.add(playerGroup);
  playerShadow = buildShadow();
  playerShadow.scale.setScalar(1.35);
  scene.add(playerShadow);
  updatePlayerTransform(true);
}

function heldItemMesh() {
  if (playerHand.children.length) playerHand.remove(playerHand.children[0]);
  if (held) {
    var iv = buildItemVisual(held);
    iv.scale.setScalar(0.8);
    playerHand.add(iv);
  }
}
function updateHeldUI() {
  var el = $("held");
  if (!held) { el.classList.add("hidden"); return; }
  var it = ITEMS[held];
  el.classList.remove("hidden");
  el.innerHTML = '<div class="h-icon" style="background:' + itemColor(held) + '"></div>' +
    '<div><div class="h-name">' + it.name + '</div><div class="h-desc">' + it.desc + "</div></div>";
}
function setHeld(id) {
  held = id;
  heldItemMesh();
  updateHeldUI();
}

function updatePlayerTransform(instant) {
  playerGroup.position.set(player.x, 0, player.z);
  playerGroup.rotation.y = player.rot;
  var bob = player.moving ? Math.abs(Math.sin(player.bob)) * 0.03 : 0;
  playerGroup.position.y = bob;
  if (playerShadow) playerShadow.position.set(player.x, 0.015, player.z + 0.18);
}

var input = { ix: 0, iz: 0, keys: {} };

function resolveCollisions() {
  var r = 0.42;
  player.x = clamp(player.x, -5.6, 5.6);
  player.z = clamp(player.z, -4.2, 3.3);
  for (var i = 0; i < colliders.length; i++) {
    var c = colliders[i];
    var cx = clamp(player.x, c.x0, c.x1);
    var cz = clamp(player.z, c.z0, c.z1);
    var dx = player.x - cx, dz = player.z - cz;
    var d2 = dx * dx + dz * dz;
    if (d2 < r * r) {
      if (d2 < 0.0001) {
        var pushX = Math.min(player.x - c.x0, c.x1 - player.x);
        var pushZ = Math.min(player.z - c.z0, c.z1 - player.z);
        if (pushX < pushZ) player.x += (player.x > (c.x0 + c.x1) / 2 ? 1 : -1) * (r - pushX);
        else player.z += (player.z > (c.z0 + c.z1) / 2 ? 1 : -1) * (r - pushZ);
      } else {
        var d = Math.sqrt(d2);
        player.x = cx + (dx / d) * r;
        player.z = cz + (dz / d) * r;
      }
    }
  }
}

function updatePlayer(dt) {
  var ix = input.ix, iz = input.iz;
  var len = Math.hypot(ix, iz);
  if (len > 1) { ix /= len; iz /= len; }
  var speed = 3.4;
  player.x += ix * speed * dt;
  player.z += iz * speed * dt;
  player.moving = len > 0.05;
  if (player.moving) {
    player.rot = Math.atan2(ix, iz);
    player.bob += dt * 10;
  } else {
    player.bob = 0;
  }
  resolveCollisions();
  updatePlayerTransform(false);
}

/* ============================================================
   [8] ステーション・調理ロジック
   ============================================================ */
function findStation(id) {
  for (var i = 0; i < stations.length; i++) if (stations[i].def.id === id) return stations[i];
  return null;
}
function nearestStation() {
  var best = null, bestD = STAGE.interactRange + 1;
  for (var i = 0; i < stations.length; i++) {
    var s = stations[i];
    var d = dist3(player.x, player.z, s.def.x, s.def.z);
    if (d < bestD) { bestD = d; best = s; }
  }
  return best;
}

function recipeForRaw(rawId) {
  for (var i = 0; i < RECIPE_IDS.length; i++) {
    if (RECIPES[RECIPE_IDS[i]].raw === rawId) return RECIPES[RECIPE_IDS[i]];
  }
  return null;
}
function recipeNameForRaw(rawId) {
  var r = recipeForRaw(rawId);
  return r ? r.name : null;
}

function startCook(s) {
  var rec = recipeForRaw(held);
  if (!rec) return;
  var out = COOK_OUT[s.def.id][held];
  if (!out) return;
  s.phase = "cook";
  s.raw = held;
  s.out = out;
  s.cookTime = rec.time;
  s.burnLeft = rec.burn;
  s.prog = 0;
  setHeld(null);
  SFX.put();
  updateStationDisplay(s);
  s.barFill.visible = true;
  s.barMat.color.setHex(0x6fcf8f);
}

function updateStationDisplay(s) {
  var d = s.display;
  while (d.children.length) d.remove(d.children[0]);
  var id = null;
  if (s.phase === "cook") id = s.raw;
  else if (s.phase === "ready" || s.phase === "burnt") id = s.phase === "burnt" ? "burnt" : s.out;
  else if (s.phase === "plated") id = s.plated;
  if (!id) { d.visible = false; return; }
  d.visible = true;
  var iv = buildItemVisual(id);
  iv.scale.setScalar(0.85);
  var t = now() * 0.003;
  iv.position.y = Math.sin(t + s.def.x) * 0.02;
  d.add(iv);
}

function updateStations(dt) {
  var t = now();
  for (var i = 0; i < stations.length; i++) {
    var s = stations[i];
    if (s.phase === "cook") {
      s.prog += dt;
      s.barFill.scale.x = Math.max(0.001, (s.prog / s.cookTime) * 0.94);
      var f = s.prog / s.cookTime;
      s.barMat.color.setRGB(0.43 + 0.4 * f, 0.81 - 0.3 * f, 0.56 - 0.25 * f);
      if (s.prog >= s.cookTime) {
        s.phase = "ready";
        s.warned = false;
        SFX.ready();
        s.barMat.color.setHex(0x6fcf8f);
        s.barFill.scale.x = 0.94;
        updateStationDisplay(s);
        if (state.phase === "playing" || state.phase === "tutorial") {
          var readyName = recipeNameForRaw(s.raw);
          showToast((readyName || "料理") + "が焼き上がり！");
        }
      }
    } else if (s.phase === "ready") {
      s.burnLeft -= dt;
      if (s.burnLeft < 2.2) {
        var r = 0.75 + 0.25 * Math.sin(t * 0.02);
        s.barMat.color.setRGB(r, 0.3, 0.25);
        if (!s.warned) {
          s.warned = true;
          spawnPopup("焦げそう！", { x: s.def.x, y: 2.0, z: s.def.z }, true);
        }
      } else {
        s.barMat.color.setHex(0x6fcf8f);
      }
      if (s.burnLeft <= 0) {
        s.phase = "burnt";
        s.barFill.scale.x = 0.001;
        s.barMat.color.setHex(0x8a2a2a);
        SFX.burn();
        addPenalty("焦げてしまった… -15", s.def.x, s.def.z);
        if (state.phase === "playing" || state.phase === "tutorial") state.combo = 0;
        updateStationDisplay(s);
      }
    } else if (s.phase === "plated") {
      updateStationDisplay(s);
    }
  }
}

function interactStation(s) {
  var def = s.def;
  if (def.kind === "shelf") {
    if (!held) openChooser(true);
    return;
  }
  if (def.kind === "cook") {
    if (s.phase === "empty") {
      if (held && COOK_OUT[def.id][held]) startCook(s);
    } else if (s.phase === "ready" && !held) {
      setHeld(s.out);
      s.phase = "empty"; s.raw = null; s.out = null;
      s.barFill.visible = false;
      SFX.take();
      updateStationDisplay(s);
    } else if (s.phase === "burnt" && !held) {
      setHeld("burnt");
      s.phase = "empty"; s.raw = null; s.out = null;
      s.barFill.visible = false;
      SFX.trash();
      updateStationDisplay(s);
    }
    return;
  }
  if (def.kind === "plate") {
    if (s.phase === "empty") {
      if (held && PLATE_MAP[held]) {
        s.plated = PLATE_MAP[held];
        s.phase = "plated";
        setHeld(null);
        SFX.put();
        updateStationDisplay(s);
      }
    } else if (s.phase === "plated" && !held) {
      setHeld(s.plated);
      s.phase = "empty"; s.plated = null;
      SFX.take();
      updateStationDisplay(s);
    }
    return;
  }
  if (def.kind === "trash") {
    if (held) { setHeld(null); SFX.trash(); }
  }
}

/* ============================================================
   [9] スコア・ペナルティ
   ============================================================ */
var state = {
  phase: "title",
  score: 0,
  combo: 0,
  maxCombo: 0,
  served: 0,
  misses: 0,
  timeLeft: STAGE.timeLimit,
  elapsed: 0,
  lastServe: -1000,
  nextSpawnAt: 0,
  countdownVal: 3,
  cdTimer: 0,
  endingAt: 0,
  best: 0,
  tut: null
};
var customers = [];

function addPenalty(text, x, z) {
  state.score = Math.max(0, state.score - 15);
  state.misses++;
  spawnPopup(text, { x: x, y: 1.6, z: z }, true);
  updateHUD();
}
function serveScore(recipe, frac) {
  var within = now() - state.lastServe < STAGE.comboWindow * 1000;
  state.combo = within ? state.combo + 1 : 1;
  var mult = 1 + Math.min(state.combo - 1, 8) * 0.15;
  var pts = Math.round(recipe.base * (0.5 + 0.5 * frac) * mult);
  state.score += pts;
  state.served++;
  if (state.combo > state.maxCombo) state.maxCombo = state.combo;
  state.lastServe = now();
  updateHUD();
  return { pts: pts, mult: mult, combo: state.combo };
}

/* ============================================================
   [10] お客さん・注文
   ============================================================ */
function rollTalent() {
  var total = 0;
  var w = TALENT_IDS.map(function (id) { total += TALENTS[id].freq; return total; });
  var r = Math.random() * total;
  for (var i = 0; i < w.length; i++) if (r < w[i]) return TALENT_IDS[i];
  return TALENT_IDS[0];
}
function rollRecipe(talentId) {
  var t = TALENTS[talentId];
  var ws = [];
  var tot = 0;
  RECIPE_IDS.forEach(function (rid) {
    var v = rid === t.fav ? 3.2 : 1;
    ws.push({ rid: rid, v: v });
    tot += v;
  });
  var r = Math.random() * tot;
  for (var i = 0; i < ws.length; i++) { r -= ws[i].v; if (r <= 0) return ws[i].rid; }
  return RECIPE_IDS[0];
}
function freeSeat() {
  for (var i = 0; i < SEATS.length; i++) {
    var taken = customers.some(function (c) { return c.seat === i && c.state !== "leaving"; });
    if (!taken) return i;
  }
  return -1;
}
function findCustomer(recipeId) {
  var best = null, bestD = 1e9;
  for (var i = 0; i < customers.length; i++) {
    var c = customers[i];
    if (c.state !== "waiting" || c.recipeId !== recipeId) continue;
    var d = dist3(player.x, player.z, SEATS[c.seat].x, SERVE_Z);
    if (d < bestD) { bestD = d; best = c; }
  }
  return best;
}

function spawnCustomer(recipeId, talentId, patience, force) {
  var seat = force ? 0 : freeSeat();
  if (seat < 0) return null;
  var tid = talentId || rollTalent();
  var rid = recipeId || rollRecipe(tid);
  var maxPat = patience || (TALENTS[tid].patience + randInt(0, 10));
  var c = {
    talent: tid,
    recipeId: rid,
    seat: seat,
    state: "walking",
    x: doorX, z: doorZ,
    patience: maxPat,
    maxPatience: maxPat,
    angry: false,
    happyUntil: 0,
    serveT: 0,
    el: null,
    group: null,
    walkT: 0,
    alive: true
  };
  var t = TALENTS[tid];
  c.group = buildChibi({ outfit: t.outfit, hair: t.hair });
  c.group.position.set(doorX, 0, doorZ);
  scene.add(c.group);
  c.shadow = buildShadow();
  c.shadow.position.set(doorX, 0.015, doorZ);
  scene.add(c.shadow);
  var el = document.createElement("div");
  el.className = "bubble";
  el.innerHTML = '<div class="b-head"><img class="b-img" alt="">' +
    '<span class="b-dish"><i class="dot" style="background:' + recipeColor(rid) + '"></i>' + RECIPES[rid].name + "</span></div>" +
    '<div class="b-steps">' + RECIPES[rid].steps + "</div>" +
    '<div class="b-bar"><i></i></div>';
  var img = el.querySelector(".b-img");
  img.src = "../images/talents/" + tid + ".webp";
  img.onerror = function () { img.style.display = "none"; };
  $("bubbles").appendChild(el);
  c.el = el;
  customers.push(c);
  rebuildOrders();
  return c;
}

function updateCustomers(dt) {
  for (var i = customers.length - 1; i >= 0; i--) {
    var c = customers[i];
    if (!c.alive) {
      if (c.el && c.el.parentNode) c.el.parentNode.removeChild(c.el);
      scene.remove(c.group);
      if (c.shadow) scene.remove(c.shadow);
      customers.splice(i, 1);
      rebuildOrders();
      continue;
    }
    if (c.state === "walking") {
      var sx = SEATS[c.seat].x, sz = 4.0;
      var dx = sx - c.x, dz = sz - c.z;
      var d = Math.hypot(dx, dz);
      var spd = 2.3;
      if (d < 0.06) {
        c.x = sx; c.z = sz;
        c.state = "waiting";
        c.group.rotation.y = Math.PI;
      } else {
        c.x += (dx / d) * spd * dt;
        c.z += (dz / d) * spd * dt;
        c.group.rotation.y = Math.atan2(dx, dz);
      }
    } else if (c.state === "waiting") {
      c.patience -= dt;
      var frac = Math.max(0, c.patience / c.maxPatience);
      var bar = c.el.querySelector(".b-bar i");
      bar.style.width = (frac * 100) + "%";
      bar.style.background = frac > 0.5 ? "#6fcf8f" : (frac > 0.25 ? "#ffd94a" : "#ff6b6b");
      if (frac <= 0.25 && !c.angry) c.el.classList.add("urgent");
      if (c.patience <= 0) {
        c.patience = 0;
        c.angry = true;
        c.state = "leaving";
        c.el.classList.add("angry");
        SFX.leave();
        state.score = Math.max(0, state.score - 40);
        state.misses++;
        state.combo = 0;
        spawnPopup("お客さんが帰っちゃった -40", { x: c.x, y: 1.8, z: c.z }, true);
        updateHUD();
        rebuildOrders();
      }
    } else if (c.state === "served") {
      if (c.serveT < 1) {
        c.serveT = Math.min(1, c.serveT + dt * 3.6);
        c.group.position.y = Math.sin(c.serveT * Math.PI) * 0.24;
      } else {
        c.group.position.y = 0;
        if (now() >= c.happyUntil) c.state = "leaving";
      }
    }
    if (c.state === "leaving") {
      var dd = doorX - c.x, dz2 = doorZ - c.z;
      var dl = Math.hypot(dd, dz2);
      var sp = 2.6;
      if (dl < 0.1) { c.alive = false; continue; }
      c.x += (dd / dl) * sp * dt;
      c.z += (dz2 / dl) * sp * dt;
      c.group.rotation.y = Math.atan2(dd, dz2);
      if (c.el) c.el.classList.add("leaving");
    }
    var px = c.x, pz = c.z;
    c.group.position.x = px;
    c.group.position.z = pz;
    var bob = c.state === "walking" || c.state === "leaving" ? Math.abs(Math.sin(c.walkT += dt * 9)) * 0.02 : 0;
    c.group.position.y += bob;
    if (c.shadow) c.shadow.position.set(px, 0.015, pz + 0.18);
    positionBubble(c.el, px, 2.4, pz);
  }
}

function positionBubble(el, x, y, z) {
  var v = new THREE.Vector3(x, y, z).project(camera);
  var sx = (v.x * 0.5 + 0.5) * W;
  var sy = (-v.y * 0.5 + 0.5) * H;
  if (v.z > 1) { el.style.opacity = 0; return; }
  el.style.opacity = 1;
  sy = clamp(sy, 46, H - 60);
  sx = clamp(sx, 40, W - 40);
  el.style.left = sx + "px";
  el.style.top = sy + "px";
}

function rebuildOrders() {
  var panel = $("orders-panel");
  panel.innerHTML = "";
  var waiting = customers.filter(function (c) { return c.state === "waiting"; });
  if (!waiting.length) { panel.classList.add("hidden"); return; }
  panel.classList.remove("hidden");
  waiting.forEach(function (c) {
    var t = TALENTS[c.talent];
    var frac = Math.max(0, c.patience / c.maxPatience);
    var card = document.createElement("div");
    card.className = "order-card" + (frac <= 0.25 ? " urgent" : "");
    card.innerHTML = '<img class="order-portrait" alt="">' +
      '<div class="order-info">' +
      '<div class="order-dish"><span class="o-dot" style="background:' + recipeColor(c.recipeId) + '"></span>' + RECIPES[c.recipeId].name + "</div>" +
      '<div class="order-steps">' + RECIPES[c.recipeId].steps + "</div>" +
      '<div class="order-talent">' + t.name + "</div>" +
      '<div class="order-bar"><i></i></div></div>';
    var img = card.querySelector(".order-portrait");
    img.src = "../images/talents/" + c.talent + ".webp";
    img.onerror = function () { img.style.display = "none"; };
    var bar = card.querySelector(".order-bar i");
    bar.style.width = (frac * 100) + "%";
    bar.style.background = frac > 0.5 ? "#6fcf8f" : (frac > 0.25 ? "#ffd94a" : "#ff6b6b");
    panel.appendChild(card);
  });
}

/* ============================================================
   [11] 提供・インタラクト
   ============================================================ */
function recipeIdOfItem(itemId) {
  for (var i = 0; i < RECIPE_IDS.length; i++) if (RECIPES[RECIPE_IDS[i]].final === itemId) return RECIPE_IDS[i];
  return null;
}
function tryServe() {
  if (!held || !ITEMS[held] || ITEMS[held].kind !== "dish") return;
  var c = findCustomer(recipeIdOfItem(held));
  if (!c) return;
  var d = dist3(player.x, player.z, SEATS[c.seat].x, SERVE_Z);
  if (d > STAGE.serveRange) return;
  doServe(c);
}
function doServe(c) {
  var rid = c.recipeId;
  var recipe = RECIPES[rid];
  var frac = Math.max(0, c.patience / c.maxPatience);
  var res = serveScore(recipe, frac);
  c.state = "served";
  c.happyUntil = now() + 1000;
  setHeld(null);
  SFX.serve();
  spawnPopup("+" + res.pts + (res.mult > 1.01 ? " \u00d7" + res.mult.toFixed(1) : ""), { x: c.x, y: 2.2, z: c.z }, false);
  if (res.combo >= 2) {
    SFX.combo();
    spawnPopup("コンボ \u00d7" + res.combo + "!", { x: player.x, y: 2.2, z: player.z }, false, true);
  }
  rebuildOrders();
  if (state.phase === "tutorial") tutCheck();
}

function currentAction() {
  if (held && ITEMS[held] && ITEMS[held].kind === "dish") {
    var c = findCustomer(recipeIdOfItem(held));
    if (c) {
      var d = dist3(player.x, player.z, SEATS[c.seat].x, SERVE_Z);
      if (d <= STAGE.serveRange) return { text: "提供する", action: "serve", target: c };
    }
  }
  var s = nearestStation();
  if (!s) return null;
  var def = s.def;
  if (def.kind === "shelf") {
    return held ? { text: "手がふさがってる", action: "none", target: s } : { text: "食材を取る", action: "shelf", target: s };
  }
  if (def.kind === "cook") {
    if (s.phase === "empty") {
      return (held && COOK_OUT[def.id][held]) ? { text: "調理する", action: "interact", target: s }
        : { text: held ? "ここでは調理できない" : "素材を置いてね", action: "none", target: s };
    }
    if (s.phase === "cook") return { text: "調理中…", action: "none", target: s };
    if (s.phase === "ready") return { text: "取り出す", action: "interact", target: s };
    if (s.phase === "burnt") return { text: "焦げた… 取り出す", action: "interact", target: s };
  }
  if (def.kind === "plate") {
    if (s.phase === "empty") {
      return (held && PLATE_MAP[held]) ? { text: "盛り付ける", action: "interact", target: s }
        : { text: held ? "ここでは盛れない" : "焼いた素材を置いてね", action: "none", target: s };
    }
    if (s.phase === "plated") return { text: "取り出す", action: "interact", target: s };
  }
  if (def.kind === "trash") {
    return held ? { text: "捨てる", action: "interact", target: s } : { text: "ゴミ箱", action: "none", target: s };
  }
  return null;
}

function doInteract() {
  var act = currentAction();
  if (!act || act.action === "none") return;
  if (act.action === "serve") { tryServe(); return; }
  if (act.action === "shelf") { openChooser(true); return; }
  if (act.action === "interact" && act.target) interactStation(act.target);
}

/* ============================================================
   [12] スパウナー
   ============================================================ */
function updateSpawner() {
  if (state.phase !== "playing") return;
  if (state.timeLeft <= 8) return;
  var active = customers.filter(function (c) {
    return c.state === "waiting" || c.state === "walking" || c.state === "served";
  }).length;
  if (active >= STAGE.maxCustomers) return;
  if (now() >= state.nextSpawnAt) {
    spawnCustomer();
    var interval = Math.max(STAGE.spawnMin, STAGE.spawnBase - state.elapsed * STAGE.spawnDecay);
    state.nextSpawnAt = now() + interval * 1000;
  }
}

/* ============================================================
   [13] チュートリアル
   ============================================================ */
function tutCheck() {
  var tut = state.tut;
  if (!tut || tut.done) return;
  if (tut.step === 0 && held === "cakeBatter") tutStep(1);
  else if (tut.step === 1 && held === "bakedCake") tutStep(2);
  else if (tut.step === 2 && held === "cake") tutStep(3);
  else if (tut.step === 3 && state.served >= 1) tutDone();
}
function tutStep(n) {
  state.tut.step = n;
  if (n === 1) $("tutorial-text").textContent = "オーブンでケーキを焼こう！ 焼けたら取り出してね";
  else if (n === 2) $("tutorial-text").textContent = "盛付台でお皿に盛ろう！";
  else if (n === 3) $("tutorial-text").textContent = "お客さんに届けよう！カウンター近くでボタンを押して";
}
function tutDone() {
  state.tut.done = true;
  SFX.fanfare();
  showToast("チュートリアル完了！");
  setTimeout(function () {
    if (state.phase === "tutorial") goTitle();
  }, 1400);
}
function tutTargetPos() {
  var tut = state.tut;
  if (!tut || tut.done) return null;
  if (tut.step === 0) { var s = findStation("shelf"); return { x: s.def.x, y: 1.8, z: s.def.z }; }
  if (tut.step === 1) { var o = findStation("oven"); return { x: o.def.x, y: 1.8, z: o.def.z }; }
  if (tut.step === 2) { var p = findStation("plate"); return { x: p.def.x, y: 1.8, z: p.def.z }; }
  var c = customers[0];
  return { x: c ? c.x : 0, y: 2.4, z: c ? c.z : 0 };
}

/* ============================================================
   [14] UI：ポップアップ・プロンプト・トースト
   ============================================================ */
function spawnPopup(text, pos, neg, combo) {
  var el = document.createElement("div");
  el.className = "pop" + (neg ? " neg" : "") + (combo ? " combo" : "");
  el.textContent = text;
  $("floating").appendChild(el);
  var v = new THREE.Vector3(pos.x, pos.y, pos.z).project(camera);
  el.style.left = ((v.x * 0.5 + 0.5) * W) + "px";
  el.style.top = ((-v.y * 0.5 + 0.5) * H) + "px";
  setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 1150);
}

function updatePrompt() {
  var el = $("prompt");
  var ab = $("action-btn-label");
  var act = currentAction();
  if (!act || act.action === "none" || (state.phase !== "playing" && state.phase !== "tutorial")) {
    el.classList.add("hidden");
    if (ab) ab.textContent = "操作";
    return;
  }
  el.classList.remove("hidden");
  el.innerHTML = act.text + (isKeyboardMode() ? " <b>[SPACE]</b>" : "") + (act.action === "shelf" && isKeyboardMode() ? " / <b>[1-4]</b> で選択" : "");
  if (ab) ab.textContent = act.text.length > 8 ? act.text.slice(0, 8) + "…" : act.text;
  var v = new THREE.Vector3(player.x, 2.1, player.z).project(camera);
  if (v.z > 1) { el.classList.add("hidden"); return; }
  el.style.left = clamp(((v.x * 0.5 + 0.5) * W), 30, W - 30) + "px";
  el.style.top = clamp(((-v.y * 0.5 + 0.5) * H), 34, H - 130) + "px";
}

var toastTimer = null;
function showToast(text, ms) {
  var el = $("toast");
  el.textContent = text;
  el.classList.remove("hidden");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.add("hidden"); }, ms || 2200);
}

// ---- 食材選択（棚） ----
function openChooser(show) {
  var el = $("shelf-chooser");
  if (!show || held || (state.phase !== "playing" && state.phase !== "tutorial")) { el.classList.add("hidden"); return; }
  el.classList.remove("hidden");
  var key = "all" + (isKeyboardMode() ? ":k" : ":t");
  if (el.dataset.key === key) return;
  el.dataset.key = key;
  el.innerHTML = "";
  SHELF_ITEMS.forEach(function (id, i) {
    var it = ITEMS[id];
    var b = document.createElement("button");
    b.className = "ing-btn";
    var keyBadge = isKeyboardMode() ? '<span class="i-key">' + (i + 1) + "</span>" : "";
    b.innerHTML = keyBadge +
      '<span class="i-em" style="background:' + itemColor(id) + '"></span><span class="i-name">' + it.name + "</span>";
    b.addEventListener("click", function () {
      setHeld(id);
      SFX.take();
      el.classList.add("hidden");
      if (state.phase === "tutorial") tutCheck();
    });
    el.appendChild(b);
  });
}

/* ============================================================
   [15] HUD
   ============================================================ */
function updateComboTimer() {
  var bar = $("hud-combo-bar");
  if (!bar) return;
  var since = now() - state.lastServe;
  var frac = state.combo > 0 ? clamp(1 - since / (STAGE.comboWindow * 1000), 0, 1) : 0;
  bar.style.width = (frac * 100) + "%";
  if (bar.parentNode) bar.parentNode.classList.toggle("combo-active", frac > 0);
}

function updateHUD() {
  $("hud-score-val").textContent = state.score;
  var t = Math.max(0, Math.ceil(state.timeLeft));
  $("hud-time-val").textContent = t;
  $("hud-time-box").classList.toggle("low-time", t <= 15);
  var mult = state.combo > 0 ? 1 + Math.min(state.combo - 1, 8) * 0.15 : 1;
  $("hud-combo-val").textContent = "x" + mult.toFixed(1);
}
function resetRun() {
  state.score = 0; state.combo = 0; state.maxCombo = 0;
  state.served = 0; state.misses = 0; state.lastServe = -1000;
  for (var i = 0; i < stations.length; i++) {
    var s = stations[i];
    s.phase = "empty"; s.raw = null; s.out = null; s.prog = 0; s.burnLeft = 0; s.plated = null;
    if (s.barFill) { s.barFill.visible = false; s.barFill.scale.x = 0.001; }
    updateStationDisplay(s);
  }
  for (var j = customers.length - 1; j >= 0; j--) {
    var c = customers[j];
    if (c.el && c.el.parentNode) c.el.parentNode.removeChild(c.el);
    scene.remove(c.group);
  }
  customers.length = 0;
  setHeld(null);
  $("shelf-chooser").classList.add("hidden");
  $("orders-panel").innerHTML = "";
  $("orders-panel").classList.add("hidden");
  updateHUD();
}

function startRun(tutorial) {
  resetRun();
  state.phase = "countdown";
  state.countdownVal = 3;
  state.cdTimer = 0;
  state.nextSpawnAt = 0;
  state.elapsed = 0;
  state.timeLeft = tutorial ? 120 : STAGE.timeLimit;
  state.nextSpawnAt = now() + 10000;
  player.x = 0; player.z = -1; player.rot = 0; input.ix = 0; input.iz = 0;
  state.tut = tutorial ? { step: 0, done: false } : null;
  if (tutorial) {
    $("tutorial-bar").classList.remove("hidden");
    $("tutorial-text").textContent = "食材置き場で「ケーキ生地」を取ろう！";
    var skip = $("tut-skip");
    if (!skip) {
      skip = document.createElement("button");
      skip.id = "tut-skip";
      skip.textContent = "スキップ";
      skip.style.cssText = "margin-top:8px;font-size:.7rem;color:#a08ab0;background:none;border:none;text-decoration:underline;cursor:pointer;";
      skip.addEventListener("click", function () { tutDone(); });
      $("tutorial-bar").appendChild(skip);
    }
    showToast("ミリカフェへようこそ！");
  } else {
    $("tutorial-bar").classList.add("hidden");
  }
  hideAllScreens();
  $("hud").classList.remove("hidden");
  $("joy-zone").classList.toggle("hidden", !isTouchMode());
  $("action-btn").classList.toggle("hidden", !isTouchMode());
  showCountdown();
}
function showCountdown() {
  var el = $("countdown");
  el.classList.remove("hidden");
  el.textContent = "3";
  el.classList.add("pulse");
  setTimeout(function () { el.classList.remove("pulse"); }, 1000);
}
function countdownTick() {
  var el = $("countdown");
  state.countdownVal--;
  if (state.countdownVal > 0) {
    SFX.count();
    el.textContent = state.countdownVal;
    el.classList.add("pulse");
    setTimeout(function () { el.classList.remove("pulse"); }, 1000);
  } else {
    SFX.go();
    el.textContent = "GO!";
    el.classList.add("pulse");
    setTimeout(function () { el.classList.add("hidden"); }, 800);
    state.phase = state.tut ? "tutorial" : "playing";
    if (state.phase === "tutorial") spawnCustomer("cake", "konomi", 60, true);
    else state.nextSpawnAt = now() + 1800;
  }
}

function endRun() {
  state.phase = "ending";
  state.endingAt = now();
  showToast("営業終了！");
  for (var i = 0; i < customers.length; i++) {
    if (customers[i].state === "waiting") customers[i].state = "leaving";
  }
  SFX.fanfare();
}
function showResult() {
  try {
    var b = parseInt(localStorage.getItem("milliCafe_best") || "0", 10);
    if (state.score > b) { b = state.score; localStorage.setItem("milliCafe_best", String(b)); }
    state.best = b;
  } catch (e) {}
  if (typeof recordGameClear === "function") {
    try { recordGameClear("milli-cafe", state.score); } catch (e) {}
  }
  var rank = 0;
  for (var i = 0; i < RANK_THRESH.length; i++) if (state.score >= RANK_THRESH[i]) rank = i + 1;
  $("result-score").textContent = String(state.score);
  $("result-served").textContent = state.served;
  $("result-miss").textContent = state.misses;
  $("result-combo").textContent = state.maxCombo;
  $("result-best").textContent = state.best;
  var stars = $("result-stars");
  stars.innerHTML = "";
  for (var s = 0; s < 3; s++) {
    var sp = document.createElement("span");
    sp.textContent = "\u2605";
    sp.style.animationDelay = (0.25 + s * 0.3) + "s";
    if (s >= rank) sp.classList.add("off");
    stars.appendChild(sp);
  }
  state.phase = "result";
  showScreen("screen-result");
  bgmStop();
}

/* ============================================================
   [16] 画面管理・遷移
   ============================================================ */
var screenIds = ["screen-title", "screen-howto", "screen-settings", "screen-result", "screen-pause"];
function showScreen(id) {
  hideScreensExcept(id);
  $(id).classList.add("show");
  if (id === "screen-title") {
    $("hud").classList.add("hidden");
    $("tutorial-bar").classList.add("hidden");
  }
}
function hideScreensExcept(keep) {
  screenIds.forEach(function (id) { if (id !== keep) $(id).classList.remove("show"); });
}
function hideAllScreens() {
  screenIds.forEach(function (id) { $(id).classList.remove("show"); });
}
function goTitle() {
  state.phase = "title";
  hideScreensExcept("screen-title");
  showScreen("screen-title");
  applyControlPick();
  $("hud").classList.add("hidden");
  $("tutorial-bar").classList.add("hidden");
  $("joy-zone").classList.add("hidden");
  $("action-btn").classList.add("hidden");
  $("prompt").classList.add("hidden");
  $("shelf-chooser").classList.add("hidden");
  bgmStop();
  if (settings.bgm > 0) bgmStart();
}

/* ============================================================
   [17] 入力（キーボード / マウス / タッチ）
   ============================================================ */
var joyActive = false;

function updateKeyboardInput() {
  var k = input.keys;
  var kx = ((k["KeyD"] || k["ArrowRight"]) ? 1 : 0) - ((k["KeyA"] || k["ArrowLeft"]) ? 1 : 0);
  var kz = ((k["KeyS"] || k["ArrowDown"]) ? 1 : 0) - ((k["KeyW"] || k["ArrowUp"]) ? 1 : 0);
  if (kx || kz) { input.ix = kx; input.iz = kz; return; }
  if (!joyActive) { input.ix = 0; input.iz = 0; }
}

function setupInput() {
  document.addEventListener("keydown", function (e) {
    if (e.repeat) return;
    input.keys[e.code] = true;
    if (e.code === "Space" || e.code === "Enter" || e.code === "KeyE") {
      if (state.phase === "playing" || state.phase === "tutorial") { e.preventDefault(); doInteract(); }
    } else if (e.code === "KeyP" || e.code === "Escape") {
      if (state.phase === "playing" || state.phase === "tutorial") togglePause(true);
      else if (state.phase === "pause") togglePause(false);
    } else if (e.code.indexOf("Digit") === 0) {
      var n = parseInt(e.code.slice(5), 10) - 1;
      if (n >= 0 && n < SHELF_ITEMS.length && !held && (state.phase === "playing" || state.phase === "tutorial")) {
        var s = nearestStation();
        if (s && s.def.kind === "shelf") { setHeld(SHELF_ITEMS[n]); SFX.take(); }
      }
    }
  });
  document.addEventListener("keyup", function (e) { input.keys[e.code] = false; });

  // マウス/タップ：ゲーム中はクリック位置でインタラクト
  document.addEventListener("pointerdown", function (e) {
    if (state.phase !== "playing" && state.phase !== "tutorial") return;
    if (e.target.closest("button, .screen, #orders-panel, #held, #prompt, #shelf-chooser")) return;
    if (isKeyboardMode()) { ensureAudio(); doInteract(); }
  });

  // タッチ：ジョイスティック
  var joyZone = $("joy-zone");
  var joyId = null;
  function joyHandle(x, y) {
    var rect = joyZone.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var dx = x - cx, dy = y - cy;
    var len = Math.hypot(dx, dy);
    var max = rect.width / 2 - 8;
    if (len > max) { dx = (dx / len) * max; dy = (dy / len) * max; }
    $("joy-knob").style.transform = "translate(calc(-50% + " + dx + "px), calc(-50% + " + dy + "px))";
    input.ix = dx / max;
    input.iz = dy / max;
  }
  function joyEnd(e) {
    if (joyActive && e.pointerId === joyId) {
      joyActive = false;
      input.ix = 0; input.iz = 0;
      $("joy-knob").style.transform = "translate(-50%, -50%)";
    }
  }
  joyZone.addEventListener("pointerdown", function (e) {
    if (!isTouch) return;
    joyActive = true; joyId = e.pointerId;
    joyZone.setPointerCapture(e.pointerId);
    ensureAudio();
    joyHandle(e.clientX, e.clientY);
  });
  joyZone.addEventListener("pointermove", function (e) {
    if (joyActive && e.pointerId === joyId) joyHandle(e.clientX, e.clientY);
  });
  joyZone.addEventListener("pointerup", joyEnd);
  joyZone.addEventListener("pointercancel", joyEnd);

  // タッチ：アクションボタン
  $("action-btn").addEventListener("pointerdown", function (e) {
    if (!isTouch) return;
    e.preventDefault();
    ensureAudio();
    if (state.phase === "playing" || state.phase === "tutorial") doInteract();
  });

  $("hud-pause").addEventListener("click", function () {
    if (state.phase === "playing" || state.phase === "tutorial") togglePause(true);
  });
}

/* ============================================================
   [18] 設定・画面ボタン
   ============================================================ */
function applyQuality() {
  var dpr = (typeof window !== "undefined" && window.devicePixelRatio) || 1;
  var cap = settings.quality === "high" ? Math.min(dpr, 2) : 1.5;
  renderer.setPixelRatio(cap);
  renderer.setSize(W, H);
}
function setupScreens() {
  function wire(id, fn) { $(id).addEventListener("click", fn); }

  var startBtn = function () {
    ensureAudio();
    SFX.click();
    if (settings.bgm > 0) bgmStart();
    startRun(false);
  };
  wire("btn-start", startBtn);
  wire("howto-start", startBtn);

  wire("btn-howto", function () {
    ensureAudio(); SFX.click();
    state.phase = "howto";
    showScreen("screen-howto");
  });
  wire("howto-back", function () {
    SFX.click();
    state.phase = "title";
    showScreen("screen-title");
  });
  wire("btn-settings", function () {
    ensureAudio(); SFX.click();
    state.phase = "settings";
    showScreen("screen-settings");
  });
  wire("settings-back", function () {
    SFX.click();
    state.phase = "title";
    showScreen("screen-title");
  });
  wire("result-retry", function () {
    SFX.click();
    startRun(false);
  });
  wire("result-title", function () {
    SFX.click();
    goTitle();
  });
  wire("pause-resume", function () { togglePause(false); });
  wire("pause-title", function () { togglePause(false); goTitle(); });

  // 設定スライダー
  function bindVol(id, key, label) {
    var input = $(id), lab = $(label);
    input.value = settings[key];
    lab.textContent = settings[key] + "%";
    input.addEventListener("input", function () {
      settings[key] = parseInt(input.value, 10);
      lab.textContent = settings[key] + "%";
      applyVolumes();
      saveSettings();
      if (key === "bgm") { if (settings.bgm > 0 && (state.phase === "title" || state.phase === "howto" || state.phase === "settings")) bgmStart(); else if (settings.bgm === 0) bgmStop(); }
    });
  }
  bindVol("set-sfx", "sfx", "set-sfx-val");
  bindVol("set-bgm", "bgm", "set-bgm-val");

  var q = $("set-quality");
  q.value = settings.quality;
  q.addEventListener("change", function () {
    settings.quality = q.value;
    saveSettings();
    applyQuality();
    rebuildQualityDecor();
  });

  var ct = $("set-control");
  ct.value = settings.control;
  ct.addEventListener("change", function () {
    settings.control = ct.value;
    saveSettings();
    applyControlPick();
  });

  // タイトル画面の操作方式選択
  wire("ctrl-keyboard", function () { pickControl("keyboard"); });
  wire("ctrl-touch", function () { pickControl("touch"); });
  wire("ctrl-auto", function () { pickControl("auto"); });
}
function pickControl(mode) {
  ensureAudio();
  SFX.click();
  settings.control = mode;
  saveSettings();
  applyControlPick();
  if ($("set-control")) $("set-control").value = mode;
}
function applyControlPick() {
  var t = isTouchMode();
  $("joy-zone").classList.toggle("hidden", !t);
  $("action-btn").classList.toggle("hidden", !t);
  ["keyboard", "touch", "auto"].forEach(function (m) {
    var b = $("ctrl-" + m);
    if (b) b.classList.toggle("sel", settings.control === m);
  });
}
function rebuildQualityDecor() {
  buildCafé(settings.quality);
  resetStationDisplays();
}
function resetStationDisplays() {
  for (var i = 0; i < stations.length; i++) {
    var s = stations[i];
    s.phase = "empty"; s.raw = null; s.out = null; s.prog = 0; s.burnLeft = 0; s.plated = null; s.warned = false;
    if (s.barFill) { s.barFill.visible = false; s.barFill.scale.x = 0.001; }
    updateStationDisplay(s);
  }
}

/* ============================================================
   [19] メインループ・カメラ
   ============================================================ */
var camTarget = { x: 0, z: -1 };
var camAngle = 0;

function updateCamera(dt) {
  if (state.phase === "title" || state.phase === "howto" || state.phase === "settings") {
    camAngle += dt * 0.07;
    var r = 7.0;
    camera.position.set(Math.sin(camAngle) * r, 9.6, Math.cos(camAngle) * r);
    camera.lookAt(0, 0.9, 0);
    return;
  }
  var tx = clamp(player.x, -4.6, 4.6);
  var tz = clamp(player.z, -2.2, 2.0);
  var ease = 1 - Math.exp(-dt * 5);
  camTarget.x = lerp(camTarget.x, tx, ease);
  camTarget.z = lerp(camTarget.z, tz, ease);
  var back = aspect < 1 ? 6.2 : 4.9;
  var height = aspect < 1 ? 10.0 : 8.2;
  camera.position.set(camTarget.x, height, camTarget.z + back);
  camera.lookAt(camTarget.x, 0.85, camTarget.z - 1.8);
}

function updateChooserVisibility() {
  var el = $("shelf-chooser");
  var s = nearestStation();
  var near = s && s.def.kind === "shelf";
  if (near && !held && (state.phase === "playing" || state.phase === "tutorial")) openChooser(true);
  else if (!el.classList.contains("hidden")) el.classList.add("hidden");
}

function updateTutorialArrow() {
  var ar = $("tutorial-arrow");
  if (state.phase !== "tutorial" || !state.tut || state.tut.done) { ar.classList.add("hidden"); return; }
  var pos = tutTargetPos();
  if (!pos) { ar.classList.add("hidden"); return; }
  var v = new THREE.Vector3(pos.x, pos.y, pos.z).project(camera);
  if (v.z > 1) { ar.classList.add("hidden"); return; }
  var sx = (v.x * 0.5 + 0.5) * W;
  var sy = (-v.y * 0.5 + 0.5) * H;
  ar.classList.remove("hidden");
  ar.style.left = sx + "px";
  ar.style.top = sy + "px";
}

function updateServeArrow() {
  var ar = $("serve-arrow");
  var target = null;
  if (held && ITEMS[held] && ITEMS[held].kind === "dish") target = findCustomer(recipeIdOfItem(held));
  if (!target || (state.phase !== "playing" && state.phase !== "tutorial")) {
    ar.classList.add("hidden");
    return;
  }
  var v = new THREE.Vector3(SEATS[target.seat].x, 1.7, 4.0).project(camera);
  if (v.z > 1) { ar.classList.add("hidden"); return; }
  ar.classList.remove("hidden");
  ar.style.left = clamp(((v.x * 0.5 + 0.5) * W), 24, W - 24) + "px";
  ar.style.top = clamp(((-v.y * 0.5 + 0.5) * H), 22, H - 120) + "px";
}

function update(dt, t) {
  updateKeyboardInput();
  switch (state.phase) {
    case "countdown":
      updatePlayer(dt);
      state.cdTimer += dt;
      if (state.cdTimer >= 1) { state.cdTimer -= 1; countdownTick(); }
      break;
    case "playing":
    case "tutorial":
      state.elapsed += dt;
      state.timeLeft -= dt;
      updatePlayer(dt);
      updateStations(dt);
      updateCustomers(dt);
      updateSpawner();
      updateChooserVisibility();
      if (state.phase === "tutorial") {
        tutCheck();
        updateTutorialArrow();
        if (state.served === 0 && customers.length === 0 && now() >= state.nextSpawnAt) {
          spawnCustomer("cake", "konomi", 60, true);
        }
      }
      updateServeArrow();
      updateComboTimer();
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        updateHUD();
        endRun();
      }
      break;
    case "ending":
      updateCustomers(dt);
      if (now() - state.endingAt > 2200) showResult();
      break;
    default:
      break;
  }
  updateCamera(dt);
  updatePrompt();
}

var lastFrame = 0;
var pausedFlag = false;
function loop(t) {
  requestAnimationFrame(loop);
  var dt = Math.min(((t || now()) - lastFrame) / 1000, 0.05);
  lastFrame = t || now();
  if (state.phase === "pause") {
    renderer.render(scene, camera);
    return;
  }
  update(dt, t);
  renderer.render(scene, camera);
}

function togglePause(show) {
  if (show) {
    if (state.phase !== "playing" && state.phase !== "tutorial") return;
    state.pausedPhase = state.phase;
    state.phase = "pause";
    bgmStop();
    showScreen("screen-pause");
  } else {
    if (state.phase !== "pause") return;
    state.phase = state.pausedPhase || "playing";
    hideAllScreens();
    $("hud").classList.remove("hidden");
    $("joy-zone").classList.toggle("hidden", !isTouchMode());
    $("action-btn").classList.toggle("hidden", !isTouchMode());
    if (settings.bgm > 0) bgmStart();
    lastFrame = now();
  }
}

/* ============================================================
   [20] 起動
   ============================================================ */
function onResize() {
  resize();
  applyQuality();
}
function boot() {
  setupRenderer();
  resize();
  buildCafé(settings.quality);
  buildPlayer();
  applyQuality();
  setupInput();
  setupScreens();
  window.addEventListener("resize", onResize);
  document.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && (state.phase === "playing" || state.phase === "tutorial")) togglePause(true);
  });
  window.addEventListener("blur", function () {
    if (state.phase === "playing" || state.phase === "tutorial") togglePause(true);
  });
  if (isTouch) {
    setTimeout(function () { $("device-warn").classList.add("hidden"); }, 5000);
  } else {
    $("device-warn").classList.add("hidden");
  }
  goTitle();
  lastFrame = now();
  requestAnimationFrame(loop);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}