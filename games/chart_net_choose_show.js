/* ============================================
  net choose show / 雨夜リズ 譜面データ（雛形）
  BPM: 112 (表示BPMも112)
  動画: https://www.youtube.com/watch?v=MG3I1rUs5v8
  フェードアウト目安: 1:33 (93s)
  HARD: 準備中 (hasHard:false) のため EASY/NORMAL のみ
  作成: 雛形 — push の並びを編集して譜面を完成させてください
  参考: chart_luminous.js / chart_okiraku_superstar.js の bar/beat 記法
  beat(0)=1拍目, beat(1)=2拍目, beat(2)=3拍目, beat(3)=4拍目
  ============================================ */
var CHARTS = CHARTS || {};

CHARTS.net_choose_show = (function () {
"use strict";

var BPM = 112;
var BEAT = 60 / BPM; // 0.53571s
var b4 = BEAT * 4; // 2.14286s

var notes = [];

function push(t, l, type, dur, lvl) {
  var note = { t: +t.toFixed(3), l: l, type: type || "tap", d: dur || 0 };
  if (lvl !== undefined) note.lvl = lvl;
  notes.push(note);
}

function bar(n) { return n * b4; }
function beat(n) { return n * BEAT; }

// ========================================
// bar 0  (導入前 1小節休み)
// ========================================
// EASY
push(bar(1) + beat(0), 1, "tap", 0, 0);
push(bar(1) + beat(2), 2, "tap", 0, 0);
// NORMAL
push(bar(1) + beat(0), 1, "tap", 0, 1);
push(bar(1) + beat(1), 2, "tap", 0, 1);
push(bar(1) + beat(2), 1, "tap", 0, 1);
push(bar(1) + beat(3), 2, "tap", 0, 1);

// ========================================
// bar 2
// ========================================
// EASY
push(bar(2) + beat(0), 0, "tap", 0, 0);
push(bar(2) + beat(2), 3, "tap", 0, 0);
// NORMAL
push(bar(2) + beat(0), 0, "tap", 0, 1);
push(bar(2) + beat(1), 1, "tap", 0, 1);
push(bar(2) + beat(2), 2, "tap", 0, 1);
push(bar(2) + beat(3), 3, "tap", 0, 1);

// ========================================
// bar 3  (サビ頭などの目印に)
// ========================================
// EASY
push(bar(3) + beat(0), 1, "tap", 0, 0);
push(bar(3) + beat(2), 2, "tap", 0, 0);
// NORMAL
push(bar(3) + beat(0), 1, "tap", 0, 1);
push(bar(3) + beat(1), 1, "hold", beat(1), 1);
push(bar(3) + beat(2), 2, "tap", 0, 1);
push(bar(3) + beat(3), 2, "tap", 0, 1);

// ========================================
// ここから下を編集して楽曲に合わせて譜面を拡張
// bar 4 以降を 1:33 (bar 約43) まで追加してください
// 1小節 = 2.14s なので 93s / 2.14 ≈ 43小節
// 例:
//   push(bar(4) + beat(0), 0, "tap", 0, 0); // EASY
//   push(bar(4) + beat(0), 0, "tap", 0, 1); // NORMAL
//   push(bar(4) + beat(2), 3, "hold", beat(2), 1); // ロング
// ========================================

// TODO: bar 4 - 42 を楽曲に合わせて追加
// フェードアウト 1:33 以降はノーツを置かない (自然に終了)

notes.sort(function (a, b) { return a.t - b.t; });

return {
  videoId: "MG3I1rUs5v8",
  title: "net choose show",
  bpm: BPM,
  offset: 0, // オフセット調整はゲーム内のスライダーで確認後、ここにmsを反映 (例: 0.12)
  duration: 93, // 1:33 フェードアウト目安
  hasHard: false, // HARD準備中 (おきらく同様)
  theme: {
    bgTop: "#1a0b1a",
    bgBottom: "#3d1a3d",
    accent: "#ff4b8b", // 雨夜リズ イメージカラー (ピンク)
    lanes: ["#ff4b8b", "#ff8fb3", "#ffb3d1", "#d94a7a"]
  },
  notes: notes
};
})();
