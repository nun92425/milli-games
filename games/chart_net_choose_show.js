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
// 雛形: 1番左レーン (lane 0 = D) を 4分音符で 4拍 × bar34まで延々
// EASY / NORMAL ともに同じ配置
// ========================================
for (var n = 0; n <= 34; n++) {
  // EASY: 4分で4発
  push(bar(n) + beat(0), 0, "tap", 0, 0);
  push(bar(n) + beat(1), 0, "tap", 0, 0);
  push(bar(n) + beat(2), 0, "tap", 0, 0);
  push(bar(n) + beat(3), 0, "tap", 0, 0);
  // NORMAL: 同じく 4分で4発
  push(bar(n) + beat(0), 0, "tap", 0, 1);
  push(bar(n) + beat(1), 0, "tap", 0, 1);
  push(bar(n) + beat(2), 0, "tap", 0, 1);
  push(bar(n) + beat(3), 0, "tap", 0, 1);
}

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
