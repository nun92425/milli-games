/* ============================================
  Princess Viral / 音ノ乃のの 譜面データ
  BPM: 134
  小節数: 54 (bar 0-53)
   レーンは全て1(左端), 全て通常ノーツ
   beat(0)=1拍目, beat(1)=2拍目, beat(2)=3拍目, beat(3)=4拍目
   ============================================ */
var CHARTS = CHARTS || {};


CHARTS.princess_viral = (function () {
 "use strict";


 var BPM = 134;
 var BEAT = 60 / BPM; // 0.44776s
 var b4 = BEAT * 4; // 1.79104s


 var notes = [];


 function push(t, l, type, dur, lvl) {
   var note = { t: +t.toFixed(3), l: l, type: type || "tap", d: dur || 0 };
   if (lvl !== undefined) note.lvl = lvl;
   notes.push(note);
 }


 function bar(n) { return n * b4; }
 function beat(n) { return n * BEAT; }


 // ========================================
 // bar 0
 // ========================================

 // ========================================
 // bar 1
 // ========================================
 // EASY
 push(bar(1) + beat(0), 0, "tap", 0, 0);
 // NORMAL
 push(bar(1) + beat(0), 0, "tap", 0, 1);
 push(bar(1) + beat(2), 0, "tap", 0, 1);
 // HARD
 push(bar(1) + beat(0), 0, "tap", 0, 2);
 push(bar(1) + beat(1), 0, "tap", 0, 2);
 push(bar(1) + beat(2), 0, "tap", 0, 2);
 push(bar(1) + beat(3), 0, "tap", 0, 2);
 push(bar(1) + beat(0), 3, "tap", 0, 2);
 push(bar(1) + beat(1), 3, "tap", 0, 2);
 push(bar(1) + beat(2), 3, "tap", 0, 2);
 push(bar(1) + beat(3), 3, "tap", 0, 2);


 // ========================================
 // bar 2
 // ========================================
 // EASY
 push(bar(2) + beat(0), 0, "tap", 0, 0);
 // NORMAL
 push(bar(2) + beat(0), 0, "tap", 0, 1);
 push(bar(2) + beat(2), 0, "tap", 0, 1);
 // HARD
 push(bar(2) + beat(0), 0, "tap", 0, 2);
 push(bar(2) + beat(1), 0, "tap", 0, 2);
 push(bar(2) + beat(2), 0, "tap", 0, 2);
 push(bar(2) + beat(3), 0, "tap", 0, 2);
 push(bar(2) + beat(0), 3, "tap", 0, 2);
 push(bar(2) + beat(1), 3, "tap", 0, 2);
 push(bar(2) + beat(2), 3, "tap", 0, 2);
 push(bar(2) + beat(3), 3, "tap", 0, 2);


 // ========================================
 // bar 3
 // ========================================
 // EASY
 push(bar(3) + beat(0), 0, "tap", 0, 0);
 // NORMAL
 push(bar(3) + beat(0), 0, "tap", 0, 1);
 push(bar(3) + beat(2), 0, "tap", 0, 1);
 // HARD
 push(bar(3) + beat(0), 0, "tap", 0, 2);
 push(bar(3) + beat(1), 0, "tap", 0, 2);
 push(bar(3) + beat(2), 0, "tap", 0, 2);
 push(bar(3) + beat(3), 0, "tap", 0, 2);
 push(bar(3) + beat(0), 3, "tap", 0, 2);
 push(bar(3) + beat(1), 3, "tap", 0, 2);
 push(bar(3) + beat(2), 3, "tap", 0, 2);
 push(bar(3) + beat(3), 3, "tap", 0, 2);


 // ========================================
 // bar 4
 // ========================================
 // EASY
 push(bar(4) + beat(0), 0, "tap", 0, 0);
 // NORMAL
 push(bar(4) + beat(0), 0, "tap", 0, 1);
 push(bar(4) + beat(2), 0, "tap", 0, 1);
 // HARD
 push(bar(4) + beat(0), 0, "tap", 0, 2);
 push(bar(4) + beat(1), 0, "tap", 0, 2);
 push(bar(4) + beat(2), 0, "tap", 0, 2);
 push(bar(4) + beat(3), 0, "tap", 0, 2);
 push(bar(4) + beat(0), 3, "tap", 0, 2);
 push(bar(4) + beat(1), 3, "tap", 0, 2);
 push(bar(4) + beat(2), 3, "tap", 0, 2);
 push(bar(4) + beat(3), 3, "tap", 0, 2);


 // ========================================
 // bar 5
 // ========================================
 // EASY
 push(bar(5) + beat(0), 0, "tap", 0, 0);
 // NORMAL
 push(bar(5) + beat(0), 0, "tap", 0, 1);
 push(bar(5) + beat(1), 0, "tap", 0, 1);
 push(bar(5) + beat(2), 0, "tap", 0, 1);
 push(bar(5) + beat(3), 0, "tap", 0, 1);
 // HARD
 push(bar(5) + beat(0), 1, "tap", 0, 2);
 push(bar(5) + beat(1), 1, "tap", 0, 2);
 push(bar(5) + beat(2), 1, "tap", 0, 2);
 push(bar(5) + beat(3), 1, "tap", 0, 2);
 push(bar(5) + beat(0), 2, "tap", 0, 2);
 push(bar(5) + beat(1), 2, "tap", 0, 2);
 push(bar(5) + beat(2), 2, "tap", 0, 2);
 push(bar(5) + beat(3), 2, "tap", 0, 2);


 // ========================================
 // bar 6
 // ========================================
 // EASY
 push(bar(6) + beat(0), 0, "tap", 0, 0);
 // NORMAL
 push(bar(6) + beat(0), 0, "tap", 0, 1);
 push(bar(6) + beat(1), 0, "tap", 0, 1);
 push(bar(6) + beat(2), 0, "tap", 0, 1);
 push(bar(6) + beat(3), 0, "tap", 0, 1);
 // HARD
 push(bar(6) + beat(0), 1, "tap", 0, 2);
 push(bar(6) + beat(1), 1, "tap", 0, 2);
 push(bar(6) + beat(2), 1, "tap", 0, 2);
 push(bar(6) + beat(3), 1, "tap", 0, 2);
 push(bar(6) + beat(0), 2, "tap", 0, 2);
 push(bar(6) + beat(1), 2, "tap", 0, 2);
 push(bar(6) + beat(2), 2, "tap", 0, 2);
 push(bar(6) + beat(3), 2, "tap", 0, 2);


 // ========================================
 // bar 7
 // ========================================
 // EASY
 push(bar(7) + beat(0), 0, "tap", 0, 0);
 // NORMAL
 push(bar(7) + beat(0), 0, "tap", 0, 1);
 push(bar(7) + beat(1), 0, "tap", 0, 1);
 push(bar(7) + beat(2), 0, "tap", 0, 1);
 push(bar(7) + beat(3), 0, "tap", 0, 1);
 // HARD
 push(bar(7) + beat(0), 1, "tap", 0, 2);
 push(bar(7) + beat(1), 1, "tap", 0, 2);
 push(bar(7) + beat(2), 1, "tap", 0, 2);
 push(bar(7) + beat(3), 1, "tap", 0, 2);
 push(bar(7) + beat(0), 2, "tap", 0, 2);
 push(bar(7) + beat(1), 2, "tap", 0, 2);
 push(bar(7) + beat(2), 2, "tap", 0, 2);
 push(bar(7) + beat(3), 2, "tap", 0, 2);


 // ========================================
 // bar 8
 // ========================================
 // EASY
 push(bar(8) + beat(0), 0, "tap", 0, 0);
 // NORMAL
 push(bar(8) + beat(0), 0, "tap", 0, 1);
 push(bar(8) + beat(1), 0, "tap", 0, 1);
 push(bar(8) + beat(2), 0, "tap", 0, 1);
 push(bar(8) + beat(3), 0, "tap", 0, 1);
 // HARD
 push(bar(8) + beat(0), 1, "tap", 0, 2);
 push(bar(8) + beat(1), 1, "tap", 0, 2);
 push(bar(8) + beat(2), 1, "tap", 0, 2);
 push(bar(8) + beat(3), 1, "tap", 0, 2);
 push(bar(8) + beat(0), 2, "tap", 0, 2);
 push(bar(8) + beat(1), 2, "tap", 0, 2);
 push(bar(8) + beat(2), 2, "tap", 0, 2);
 push(bar(8) + beat(3), 2, "tap", 0, 2);


 // ========================================
 // bar 9
 // ========================================
 // EASY
 push(bar(9) + beat(0), 0, "tap", 0, 0);
 // NORMAL
 push(bar(9) + beat(0), 0, "tap", 0, 1);
 push(bar(9) + beat(1), 0, "tap", 0, 1);
 push(bar(9) + beat(2), 0, "tap", 0, 1);
 push(bar(9) + beat(3), 0, "tap", 0, 1);
 push(bar(9) + beat(0), 3, "tap", 0, 1);
 push(bar(9) + beat(1), 3, "tap", 0, 1);
 push(bar(9) + beat(2), 3, "tap", 0, 1);
 push(bar(9) + beat(3), 3, "tap", 0, 1);
 // HARD
 push(bar(9) + beat(0), 0, "tap", 0, 2);
 push(bar(9) + beat(1), 0, "tap", 0, 2);
 push(bar(9) + beat(0), 1, "tap", 0, 2);
 push(bar(9) + beat(1), 1, "tap", 0, 2);
 push(bar(9) + beat(2), 2, "tap", 0, 2);
 push(bar(9) + beat(3), 2, "tap", 0, 2);
 push(bar(9) + beat(2), 3, "tap", 0, 2);
 push(bar(9) + beat(3), 3, "tap", 0, 2);


 // ========================================
 // bar 10
 // ========================================
 // EASY
 push(bar(10) + beat(0), 0, "tap", 0, 0);
 // NORMAL
 push(bar(10) + beat(0), 0, "tap", 0, 1);
 push(bar(10) + beat(1), 0, "tap", 0, 1);
 push(bar(10) + beat(2), 0, "tap", 0, 1);
 push(bar(10) + beat(3), 0, "tap", 0, 1);
 push(bar(10) + beat(0), 3, "tap", 0, 1);
 push(bar(10) + beat(1), 3, "tap", 0, 1);
 push(bar(10) + beat(2), 3, "tap", 0, 1);
 push(bar(10) + beat(3), 3, "tap", 0, 1);
 // HARD
 push(bar(10) + beat(0), 1, "tap", 0, 2);
 push(bar(10) + beat(1), 1, "tap", 0, 2);
 push(bar(10) + beat(0), 2, "tap", 0, 2);
 push(bar(10) + beat(1), 2, "tap", 0, 2);
 push(bar(10) + beat(2), 0, "tap", 0, 2);
 push(bar(10) + beat(3), 0, "tap", 0, 2);
 push(bar(10) + beat(2), 3, "tap", 0, 2);
 push(bar(10) + beat(3), 3, "tap", 0, 2);


 // ========================================
 // bar 11
 // ========================================
 // EASY
 push(bar(11) + beat(0), 0, "tap", 0, 0);
 // NORMAL
 push(bar(11) + beat(0), 0, "tap", 0, 1);
 push(bar(11) + beat(1), 0, "tap", 0, 1);
 push(bar(11) + beat(2), 0, "tap", 0, 1);
 push(bar(11) + beat(3), 0, "tap", 0, 1);
 push(bar(11) + beat(0), 3, "tap", 0, 1);
 push(bar(11) + beat(1), 3, "tap", 0, 1);
 push(bar(11) + beat(2), 3, "tap", 0, 1);
 push(bar(11) + beat(3), 3, "tap", 0, 1);
 // HARD
 push(bar(11) + beat(0), 0, "tap", 0, 2);
 push(bar(11) + beat(1), 0, "tap", 0, 2);
 push(bar(11) + beat(2), 0, "tap", 0, 2);
 push(bar(11) + beat(3), 0, "tap", 0, 2);
 push(bar(11) + beat(0.5), 0, "tap", beat(0.5), 2);
 push(bar(11) + beat(1.5), 0, "tap", beat(0.5), 2);
 push(bar(11) + beat(2.5), 0, "tap", beat(0.5), 2);
 push(bar(11) + beat(3.5), 0, "tap", beat(0.5), 2);
 push(bar(11) + beat(0), 3, "tap", 0, 2);
 push(bar(11) + beat(1), 3, "tap", 0, 2);
 push(bar(11) + beat(2), 3, "tap", 0, 2);
 push(bar(11) + beat(3), 3, "tap", 0, 2);
 push(bar(11) + beat(0.5), 3, "tap", beat(0.5), 2);
 push(bar(11) + beat(1.5), 3, "tap", beat(0.5), 2);
 push(bar(11) + beat(2.5), 3, "tap", beat(0.5), 2);
 push(bar(11) + beat(3.5), 3, "tap", beat(0.5), 2);


 // ========================================
 // bar 12
 // ========================================
 // EASY
 push(bar(12) + beat(0), 0, "tap", 0, 0);
 // NORMAL
 push(bar(12) + beat(0), 0, "tap", 0, 1);
 push(bar(12) + beat(1), 0, "tap", 0, 1);
 push(bar(12) + beat(2), 0, "tap", 0, 1);
 push(bar(12) + beat(3), 0, "tap", 0, 1);
 push(bar(12) + beat(0), 3, "tap", 0, 1);
 push(bar(12) + beat(1), 3, "tap", 0, 1);
 push(bar(12) + beat(2), 3, "tap", 0, 1);
 push(bar(12) + beat(3), 3, "tap", 0, 1);
 // HARD
 push(bar(12) + beat(0), 1, "tap", 0, 2);
 push(bar(12) + beat(1), 1, "tap", 0, 2);
 push(bar(12) + beat(2), 1, "tap", 0, 2);
 push(bar(12) + beat(3), 1, "tap", 0, 2);
 push(bar(12) + beat(0.5), 1, "tap", beat(0.5), 2);
 push(bar(12) + beat(1.5), 1, "tap", beat(0.5), 2);
 push(bar(12) + beat(2.5), 1, "tap", beat(0.5), 2);
 push(bar(12) + beat(3.5), 1, "tap", beat(0.5), 2);
 push(bar(12) + beat(0), 0, "tap", 0, 2);
 push(bar(12) + beat(1), 0, "tap", 0, 2);
 push(bar(12) + beat(2), 0, "tap", 0, 2);
 push(bar(12) + beat(3), 0, "tap", 0, 2);
 push(bar(12) + beat(0.5), 0, "tap", beat(0.5), 2);
 push(bar(12) + beat(1.5), 0, "tap", beat(0.5), 2);
 push(bar(12) + beat(2.5), 0, "tap", beat(0.5), 2);
 push(bar(12) + beat(3.5), 0, "tap", beat(0.5), 2);

 // ========================================
 // bar 13
 // ========================================
 // EASY
 push(bar(13) + beat(0), 0, "tap", 0, 0);
 push(bar(13) + beat(2), 0, "tap", 0, 0);
 // NORMAL
 push(bar(13) + beat(0), 0, "tap", 0, 1);
 push(bar(13) + beat(1), 0, "tap", beat(0.5), 1);
 push(bar(13) + beat(1.5), 0, "tap", beat(0.5), 1);
 push(bar(13) + beat(2), 0, "tap", 0, 1);
 push(bar(13) + beat(3), 0, "tap", beat(0.5), 1);
 push(bar(13) + beat(3.5), 0, "tap", beat(0.5), 1);
 // HARD
 push(bar(13) + beat(0), 0, "tap", 0, 2);
 push(bar(13) + beat(1), 0, "tap", beat(0.5), 2);
 push(bar(13) + beat(1.5), 0, "tap", beat(0.5), 2);
 push(bar(13) + beat(2), 0, "tap", 0, 2);
 push(bar(13) + beat(3), 0, "tap", beat(0.5), 2);
 push(bar(13) + beat(3.5), 0, "tap", beat(0.5), 2);
 push(bar(13) + beat(0), 3, "tap", 0, 2);
 push(bar(13) + beat(1), 3, "tap", beat(0.5), 2);
 push(bar(13) + beat(1.5), 3, "tap", beat(0.5), 2);
 push(bar(13) + beat(2), 3, "tap", 0, 2);
 push(bar(13) + beat(3), 3, "tap", beat(0.5), 2);
 push(bar(13) + beat(3.5), 3, "tap", beat(0.5), 2);


 // ========================================
 // bar 14
 // ========================================
 // EASY
 push(bar(14) + beat(0), 3, "tap", 0, 0);
 push(bar(14) + beat(2), 3, "tap", 0, 0);
 // NORMAL
 push(bar(14) + beat(0), 3, "tap", 0, 1);
 push(bar(14) + beat(1), 3, "tap", beat(0.5), 1);
 push(bar(14) + beat(1.5), 3, "tap", beat(0.5), 1);
 push(bar(14) + beat(2), 3, "tap", 0, 1);
 push(bar(14) + beat(3), 3, "tap", beat(0.5), 1);
 push(bar(14) + beat(3.5), 3, "tap", beat(0.5), 1);
 // HARD
 push(bar(14) + beat(0), 1, "tap", 0, 2);
 push(bar(14) + beat(1), 1, "tap", beat(0.5), 2);
 push(bar(14) + beat(1.5), 1, "tap", beat(0.5), 2);
 push(bar(14) + beat(2), 1, "tap", 0, 2);
 push(bar(14) + beat(3), 1, "tap", beat(0.5), 2);
 push(bar(14) + beat(3.5), 1, "tap", beat(0.5), 2);
 push(bar(14) + beat(0), 2, "tap", 0, 2);
 push(bar(14) + beat(1), 2, "tap", beat(0.5), 2);
 push(bar(14) + beat(1.5), 2, "tap", beat(0.5), 2);
 push(bar(14) + beat(2), 2, "tap", 0, 2);
 push(bar(14) + beat(3), 2, "tap", beat(0.5), 2);
 push(bar(14) + beat(3.5), 2, "tap", beat(0.5), 2);


 // ========================================
 // bar 15
 // ========================================
 // EASY
 push(bar(15) + beat(0), 1, "tap", 0, 0);
 push(bar(15) + beat(2), 1, "tap", 0, 0);
 // NORMAL
 push(bar(15) + beat(0), 2, "tap", 0, 1);
 push(bar(15) + beat(1), 2, "tap", beat(0.5), 1);
 push(bar(15) + beat(1.5), 2, "tap", beat(0.5), 1);
 push(bar(15) + beat(2), 2, "tap", 0, 1);
 push(bar(15) + beat(3), 2, "tap", beat(0.5), 1);
 push(bar(15) + beat(3.5), 2, "tap", beat(0.5), 1);
 // HARD
 push(bar(15) + beat(0), 1, "tap", 0, 2);
 push(bar(15) + beat(1), 1, "tap", beat(0.5), 2);
 push(bar(15) + beat(1.5), 1, "tap", beat(0.5), 2);
 push(bar(15) + beat(2), 1, "tap", 0, 2);
 push(bar(15) + beat(3), 1, "tap", beat(0.5), 2);
 push(bar(15) + beat(3.5), 1, "tap", beat(0.5), 2);
 push(bar(15) + beat(0), 3, "tap", 0, 2);
 push(bar(15) + beat(1), 3, "tap", beat(0.5), 2);
 push(bar(15) + beat(1.5), 3, "tap", beat(0.5), 2);
 push(bar(15) + beat(2), 3, "tap", 0, 2);
 push(bar(15) + beat(3), 3, "tap", beat(0.5), 2);
 push(bar(15) + beat(3.5), 3, "tap", beat(0.5), 2);


 // ========================================
 // bar 16
 // ========================================
 // EASY
 push(bar(16) + beat(0), 2, "tap", 0, 0);
 push(bar(16) + beat(2), 2, "tap", 0, 0);
 // NORMAL
 push(bar(16) + beat(0), 1, "tap", 0, 1);
 push(bar(16) + beat(1), 1, "tap", beat(0.5), 1);
 push(bar(16) + beat(1.5), 1, "tap", beat(0.5), 1);
 push(bar(16) + beat(2), 1, "tap", 0, 1);
 push(bar(16) + beat(3), 1, "tap", beat(0.5), 1);
 push(bar(16) + beat(3.5), 1, "tap", beat(0.5), 1);
 // HARD
 push(bar(16) + beat(0), 0, "tap", 0, 2);
 push(bar(16) + beat(1), 0, "tap", beat(0.5), 2);
 push(bar(16) + beat(1.5), 0, "tap", beat(0.5), 2);
 push(bar(16) + beat(2), 0, "tap", 0, 2);
 push(bar(16) + beat(3), 0, "tap", beat(0.5), 2);
 push(bar(16) + beat(3.5), 0, "tap", beat(0.5), 2);
 push(bar(16) + beat(0), 2, "tap", 0, 2);
 push(bar(16) + beat(1), 2, "tap", beat(0.5), 2);
 push(bar(16) + beat(1.5), 2, "tap", beat(0.5), 2);
 push(bar(16) + beat(2), 2, "tap", 0, 2);
 push(bar(16) + beat(3), 2, "tap", beat(0.5), 2);
 push(bar(16) + beat(3.5), 2, "tap", beat(0.5), 2);


 // ========================================
 // bar 17
 // ========================================
 // EASY
 push(bar(17) + beat(0), 1, "hold", beat(2), 0);
 push(bar(17) + beat(2), 2, "hold", beat(2), 0);
 // NORMAL
 push(bar(17) + beat(0), 0, "tap", beat(0.5), 1);
 push(bar(17) + beat(1), 1, "tap", beat(0.5), 1);
 push(bar(17) + beat(2), 2, "tap", beat(0.5), 1);
 push(bar(17) + beat(3), 3, "tap", beat(0.5), 1);
 push(bar(17) + beat(0.5), 0, "tap", beat(0.5), 1);
 push(bar(17) + beat(1.5), 1, "tap", beat(0.5), 1);
 push(bar(17) + beat(2.5), 2, "tap", beat(0.5), 1);
 push(bar(17) + beat(3.5), 3, "tap", beat(0.5), 1);
 // HARD
 push(bar(17) + beat(0), 0, "tap", beat(0.5), 2);
 push(bar(17) + beat(1), 1, "tap", beat(0.5), 2);
 push(bar(17) + beat(2), 0, "tap", beat(0.5), 2);
 push(bar(17) + beat(3), 1, "tap", beat(0.5), 2);
 push(bar(17) + beat(0.5), 0, "tap", beat(0.5), 2);
 push(bar(17) + beat(1.5), 1, "tap", beat(0.5), 2);
 push(bar(17) + beat(2.5), 0, "tap", beat(0.5), 2);
 push(bar(17) + beat(3.5), 1, "tap", beat(0.5), 2);
 push(bar(17) + beat(0), 3, "tap", beat(0.5), 2);
 push(bar(17) + beat(1), 2, "tap", beat(0.5), 2);
 push(bar(17) + beat(2), 3, "tap", beat(0.5), 2);
 push(bar(17) + beat(3), 2, "tap", beat(0.5), 2);
 push(bar(17) + beat(0.5), 3, "tap", beat(0.5), 2);
 push(bar(17) + beat(1.5), 2, "tap", beat(0.5), 2);
 push(bar(17) + beat(2.5), 3, "tap", beat(0.5), 2);
 push(bar(17) + beat(3.5), 2, "tap", beat(0.5), 2);


 // ========================================
 // bar 18
 // ========================================
 // EASY
 push(bar(18) + beat(0), 0, "hold", beat(2), 0);
 push(bar(18) + beat(2), 3, "hold", beat(2), 0);
 // NORMAL
 push(bar(18) + beat(0), 3, "tap", beat(0.5), 1);
 push(bar(18) + beat(1), 2, "tap", beat(0.5), 1);
 push(bar(18) + beat(2), 1, "tap", beat(0.5), 1);
 push(bar(18) + beat(3), 0, "tap", beat(0.5), 1);
 push(bar(18) + beat(0.5), 3, "tap", beat(0.5), 1);
 push(bar(18) + beat(1.5), 2, "tap", beat(0.5), 1);
 push(bar(18) + beat(2.5), 1, "tap", beat(0.5), 1);
 push(bar(18) + beat(3.5), 0, "tap", beat(0.5), 1);
 // HARD
 push(bar(18) + beat(0), 1, "tap", beat(0.5), 2);
 push(bar(18) + beat(1), 0, "tap", beat(0.5), 2);
 push(bar(18) + beat(2), 1, "tap", beat(0.5), 2);
 push(bar(18) + beat(3), 0, "tap", beat(0.5), 2);
 push(bar(18) + beat(0.5), 1, "tap", beat(0.5), 2);
 push(bar(18) + beat(1.5), 0, "tap", beat(0.5), 2);
 push(bar(18) + beat(2.5), 1, "tap", beat(0.5), 2);
 push(bar(18) + beat(3.5), 0, "tap", beat(0.5), 2);
 push(bar(18) + beat(0), 2, "tap", beat(0.5), 2);
 push(bar(18) + beat(1), 3, "tap", beat(0.5), 2);
 push(bar(18) + beat(2), 2, "tap", beat(0.5), 2);
 push(bar(18) + beat(3), 3, "tap", beat(0.5), 2);
 push(bar(18) + beat(0.5), 2, "tap", beat(0.5), 2);
 push(bar(18) + beat(1.5), 3, "tap", beat(0.5), 2);
 push(bar(18) + beat(2.5), 2, "tap", beat(0.5), 2);
 push(bar(18) + beat(3.5), 3, "tap", beat(0.5), 2);


 // ========================================
 // bar 19
 // ========================================
 // EASY
 push(bar(19) + beat(0), 2, "hold", beat(2), 0);
 push(bar(19) + beat(2), 1, "hold", beat(2), 0);
 // NORMAL
 push(bar(19) + beat(0), 0, "tap", 0, 1);
 push(bar(19) + beat(2), 3, "tap", 0, 1);
 // HARD
 push(bar(19) + beat(0), 0, "tap", 0, 2);
 push(bar(19) + beat(1), 0, "tap", 0, 2);
 push(bar(19) + beat(2), 3, "tap", 0, 2);
 push(bar(19) + beat(3), 3, "tap", 0, 2);


 // ========================================
 // bar 20
 // ========================================
 // EASY
 push(bar(20) + beat(0), 3, "tap", beat(2), 0);
 push(bar(20) + beat(2), 0, "tap", beat(2), 0);
 // NORMAL
 push(bar(20) + beat(0), 0, "tap", 0, 1);
 push(bar(20) + beat(2), 3, "tap", 0, 1);
 // HARD
 push(bar(20) + beat(0), 0, "tap", 0, 2);
 push(bar(20) + beat(1), 0, "hold", beat(3), 2);
 push(bar(20) + beat(0), 3, "tap", 0, 2);
 push(bar(20) + beat(1), 3, "hold", beat(3), 2);


 // ========================================
 // bar 21
 // ========================================
 // EASY
 push(bar(21) + beat(0), 1, "tap", 0, 0);
 push(bar(21) + beat(0), 2, "tap", 0, 0);
 push(bar(21) + beat(1), 1, "tap", 0, 0);
 push(bar(21) + beat(1), 2, "tap", 0, 0);
 // NORMAL
 push(bar(21) + beat(0), 0, "hold", beat(2), 1);
 push(bar(21) + beat(1), 1, "tap", 0, 1);
 push(bar(21) + beat(2), 3, "hold", beat(2), 1);
 push(bar(21) + beat(3), 2, "tap", 0, 1);
 // HARD
 push(bar(21) + beat(0), 0, "hold", beat(2), 2);
 push(bar(21) + beat(1), 1, "tap", beat(0.5), 2);
 push(bar(21) + beat(1.5), 1, "tap", beat(0.5), 2);
 push(bar(21) + beat(2), 3, "hold", beat(2), 2);
 push(bar(21) + beat(3), 2, "tap", beat(0.5), 2);
 push(bar(21) + beat(3.5), 2, "tap", beat(0.5), 2);


 // ========================================
 // bar 22
 // ========================================
 // EASY
 push(bar(22) + beat(0), 3, "hold", beat(4), 0);
 push(bar(22) + beat(2), 0, "tap", 0, 0);
 push(bar(22) + beat(3), 0, "tap", 0, 0);
 // NORMAL
 push(bar(22) + beat(0), 2, "hold", beat(2), 1);
 push(bar(22) + beat(1), 3, "tap", 0, 1);
 push(bar(22) + beat(2), 1, "hold", beat(2), 1);
 push(bar(22) + beat(3), 0, "tap", 0, 1);
 // HARD
 push(bar(22) + beat(0), 2, "hold", beat(2), 2);
 push(bar(22) + beat(1), 3, "tap", beat(0.5), 2);
 push(bar(22) + beat(1.5), 3, "tap", beat(0.5), 2);
 push(bar(22) + beat(2), 1, "hold", beat(2), 2);
 push(bar(22) + beat(3), 0, "tap", beat(0.5), 2);
 push(bar(22) + beat(3.5), 0, "tap", beat(0.5), 2);


 // ========================================
 // bar 23
 // ========================================
 // EASY
 push(bar(23) + beat(0), 0, "hold", beat(4), 0);
 push(bar(23) + beat(2), 3, "tap", 0, 0);
 push(bar(23) + beat(3), 3, "tap", 0, 0);
 // NORMAL
 push(bar(23) + beat(0), 0, "tap", 0, 1);
 push(bar(23) + beat(1), 0, "tap", 0, 1);
 push(bar(23) + beat(2), 1, "tap", 0, 1);
 push(bar(23) + beat(3), 1, "tap", 0, 1);
 push(bar(23) + beat(0), 2, "tap", 0, 1);
 push(bar(23) + beat(1), 2, "tap", 0, 1);
 push(bar(23) + beat(2), 3, "tap", 0, 1);
 push(bar(23) + beat(3), 3, "tap", 0, 1);
 // HARD
 push(bar(23) + beat(0), 1, "tap", 0, 2);
 push(bar(23) + beat(1), 1, "tap", 0, 2);
 push(bar(23) + beat(2), 3, "tap", 0, 2);
 push(bar(23) + beat(3), 3, "tap", 0, 2);
 push(bar(23) + beat(0), 2, "tap", 0, 2);
 push(bar(23) + beat(1), 2, "tap", 0, 2);
 push(bar(23) + beat(2), 0, "tap", 0, 2);
 push(bar(23) + beat(3), 0, "tap", 0, 2);


 // ========================================
 // bar 24
 // ========================================
 // EASY
 push(bar(24) + beat(0), 3, "hold", beat(4), 0);
 push(bar(24) + beat(1), 0, "tap", 0, 0);
 push(bar(24) + beat(2), 0, "tap", 0, 0);
 push(bar(24) + beat(3), 0, "tap", 0, 0);
 // NORMAL
 push(bar(24) + beat(0), 3, "tap", 0, 1);
 push(bar(24) + beat(1), 3, "tap", 0, 1);
 push(bar(24) + beat(2), 2, "tap", 0, 1);
 push(bar(24) + beat(3), 2, "tap", 0, 1);
 push(bar(24) + beat(0), 0, "tap", 0, 1);
 push(bar(24) + beat(1), 0, "tap", 0, 1);
 push(bar(24) + beat(2), 1, "tap", 0, 1);
 push(bar(24) + beat(3), 1, "tap", 0, 1);
 // HARD
 push(bar(24) + beat(0), 2, "tap", 0, 2);
 push(bar(24) + beat(1), 2, "tap", 0, 2);
 push(bar(24) + beat(2), 3, "tap", 0, 2);
 push(bar(24) + beat(3), 3, "tap", 0, 2);
 push(bar(24) + beat(0), 0, "tap", 0, 2);
 push(bar(24) + beat(1), 0, "tap", 0, 2);
 push(bar(24) + beat(2), 1, "tap", 0, 2);
 push(bar(24) + beat(3), 1, "tap", 0, 2);


 // ========================================
 // bar 25
 // ========================================
 // EASY
 push(bar(25) + beat(0), 0, "hold", beat(4), 0);
 push(bar(25) + beat(1), 3, "tap", 0, 0);
 push(bar(25) + beat(2), 3, "tap", 0, 0);
 push(bar(25) + beat(3), 3, "tap", 0, 0);
 // NORMAL
 push(bar(25) + beat(0), 0, "tap", beat(0.5), 1);
 push(bar(25) + beat(1), 2, "tap", beat(0.5), 1);
 push(bar(25) + beat(2), 1, "tap", beat(0.5), 1);
 push(bar(25) + beat(3), 3, "tap", beat(0.5), 1);
 push(bar(25) + beat(0.5), 2, "tap", beat(0.5), 1);
 push(bar(25) + beat(1.5), 3, "tap", beat(0.5), 1);
 push(bar(25) + beat(2.5), 0, "tap", beat(0.5), 1);
 push(bar(25) + beat(3.5), 1, "tap", beat(0.5), 1);
 // HARD
 push(bar(25) + beat(0), 0, "tap", 0, 2);
 push(bar(25) + beat(1), 0, "tap", 0, 2);
 push(bar(25) + beat(2), 0, "tap", 0, 2);
 push(bar(25) + beat(3), 0, "tap", 0, 2);
 push(bar(25) + beat(0), 1, "tap", 0, 2);
 push(bar(25) + beat(1), 1, "tap", 0, 2);
 push(bar(25) + beat(2), 1, "tap", 0, 2);
 push(bar(25) + beat(3), 1, "tap", 0, 2);


 // ========================================
 // bar 26
 // ========================================
 // EASY
 push(bar(26) + beat(0), 0, "tap", 0, 0);
 push(bar(26) + beat(1), 1, "tap", 0, 0);
 push(bar(26) + beat(2), 2, "tap", 0, 0);
 push(bar(26) + beat(3), 3, "tap", 0, 0);
 // NORMAL
 push(bar(26) + beat(0), 2, "tap", beat(0.5), 1);
 push(bar(26) + beat(1), 3, "tap", beat(0.5), 1);
 push(bar(26) + beat(2), 1, "tap", beat(0.5), 1);
 push(bar(26) + beat(3), 0, "tap", beat(0.5), 1);
 push(bar(26) + beat(0.5), 1, "tap", beat(0.5), 1);
 push(bar(26) + beat(1.5), 3, "tap", beat(0.5), 1);
 push(bar(26) + beat(2.5), 2, "tap", beat(0.5), 1);
 push(bar(26) + beat(3.5), 0, "tap", beat(0.5), 1);
 // HARD
 push(bar(26) + beat(0), 2, "tap", 0, 2);
 push(bar(26) + beat(1), 2, "tap", 0, 2);
 push(bar(26) + beat(2), 2, "tap", 0, 2);
 push(bar(26) + beat(3), 2, "tap", 0, 2);
 push(bar(26) + beat(0), 3, "tap", 0, 2);
 push(bar(26) + beat(1), 3, "tap", 0, 2);
 push(bar(26) + beat(2), 3, "tap", 0, 2);
 push(bar(26) + beat(3), 3, "tap", 0, 2);


 // ========================================
 // bar 27
 // ========================================
 // EASY
 push(bar(27) + beat(0), 3, "tap", 0, 0);
 push(bar(27) + beat(1), 2, "tap", 0, 0);
 push(bar(27) + beat(2), 1, "tap", 0, 0);
 push(bar(27) + beat(3), 0, "tap", 0, 0);
 // NORMAL
 push(bar(27) + beat(0), 0, "tap", 0, 1);
 push(bar(27) + beat(1), 0, "tap", 0, 1);
 push(bar(27) + beat(2), 0, "tap", 0, 1);
 push(bar(27) + beat(3), 0, "tap", 0, 1);
 // HARD
 push(bar(27) + beat(0), 0, "hold", beat(4), 2);
 push(bar(27) + beat(0), 1, "hold", beat(4), 2);
 push(bar(27) + beat(0), 2, "hold", beat(4), 2);
 push(bar(27) + beat(0), 3, "hold", beat(4), 2);


 // ========================================
 // bar 28
 // ========================================
 // EASY
 push(bar(28) + beat(0), 1, "hold", beat(4), 0);
 push(bar(28) + beat(0), 2, "hold", beat(4), 0);
 // NORMAL
 push(bar(28) + beat(0), 3, "tap", 0, 1);
 push(bar(28) + beat(1), 3, "tap", 0, 1);
 push(bar(28) + beat(2), 3, "tap", 0, 1);
 push(bar(28) + beat(3), 3, "tap", 0, 1);
 // HARD
 push(bar(28) + beat(0), 0, "tap", 0, 2);
 push(bar(28) + beat(1), 0, "tap", 0, 2);
 push(bar(28) + beat(2), 0, "tap", 0, 2);
 push(bar(28) + beat(3), 0, "tap", 0, 2);
 push(bar(28) + beat(0), 1, "tap", 0, 2);
 push(bar(28) + beat(1), 1, "tap", 0, 2);
 push(bar(28) + beat(2), 1, "tap", 0, 2);
 push(bar(28) + beat(3), 1, "tap", 0, 2);
 push(bar(28) + beat(0), 2, "tap", 0, 2);
 push(bar(28) + beat(1), 2, "tap", 0, 2);
 push(bar(28) + beat(2), 2, "tap", 0, 2);
 push(bar(28) + beat(3), 2, "tap", 0, 2);
 push(bar(28) + beat(0), 3, "tap", 0, 2);
 push(bar(28) + beat(1), 3, "tap", 0, 2);
 push(bar(28) + beat(2), 3, "tap", 0, 2);
 push(bar(28) + beat(3), 3, "tap", 0, 2);


 // ========================================
 // bar 29
 // ========================================
 // EASY
 push(bar(29) + beat(0), 0, "tap", 0, 0);
 push(bar(29) + beat(1), 0, "tap", 0, 0);
 push(bar(29) + beat(2), 0, "tap", 0, 0);
 push(bar(29) + beat(3), 0, "tap", 0, 0);
 // NORMAL
 push(bar(29) + beat(0), 3, "hold", beat(4), 1);
 push(bar(29) + beat(2), 0, "tap", 0, 1);
 push(bar(29) + beat(3), 0, "tap", 0, 1);
 // HARD
 push(bar(29) + beat(0), 3, "hold", beat(4), 2);
 push(bar(29) + beat(2), 1, "tap", 0, 2);
 push(bar(29) + beat(3), 1, "tap", 0, 2);
 push(bar(29) + beat(0), 0, "hold", beat(4), 2);
 push(bar(29) + beat(2), 2, "tap", 0, 2);
 push(bar(29) + beat(3), 2, "tap", 0, 2);


 // ========================================
 // bar 30
 // ========================================
 // EASY
 push(bar(30) + beat(0), 3, "tap", 0, 0);
 push(bar(30) + beat(1), 3, "tap", 0, 0);
 push(bar(30) + beat(2), 3, "tap", 0, 0);
 push(bar(30) + beat(3), 3, "tap", 0, 0);
 // NORMAL
 push(bar(30) + beat(0), 0, "hold", beat(4), 1);
 push(bar(30) + beat(2), 3, "tap", 0, 1);
 push(bar(30) + beat(3), 3, "tap", 0, 1);
 // HARD
 push(bar(30) + beat(0), 3, "hold", beat(4), 2);
 push(bar(30) + beat(2), 1, "tap", 0, 2);
 push(bar(30) + beat(3), 1, "tap", 0, 2);
 push(bar(30) + beat(0), 0, "hold", beat(4), 2);
 push(bar(30) + beat(2), 2, "tap", 0, 2);
 push(bar(30) + beat(3), 2, "tap", 0, 2);


 // ========================================
 // bar 31
 // ========================================
 // EASY
 push(bar(31) + beat(0), 1, "tap", 0, 0);
 push(bar(31) + beat(1), 1, "tap", 0, 0);
 push(bar(31) + beat(2), 2, "tap", 0, 0);
 push(bar(31) + beat(3), 2, "tap", 0, 0);
 // NORMAL
 push(bar(31) + beat(0), 2, "hold", beat(4), 1);
 push(bar(31) + beat(2), 1, "tap", 0, 1);
 push(bar(31) + beat(3), 1, "tap", 0, 1);
 // HARD
 push(bar(31) + beat(0), 2, "hold", beat(4), 2);
 push(bar(31) + beat(2), 3, "tap", 0, 2);
 push(bar(31) + beat(3), 3, "tap", 0, 2);
 push(bar(31) + beat(0), 1, "hold", beat(4), 2);
 push(bar(31) + beat(2), 0, "tap", 0, 2);
 push(bar(31) + beat(3), 0, "tap", 0, 2);


 // ========================================
 // bar 32
 // ========================================
 // EASY
 push(bar(32) + beat(0), 3, "tap", 0, 0);
 push(bar(32) + beat(1), 3, "tap", 0, 0);
 push(bar(32) + beat(2), 0, "tap", 0, 0);
 push(bar(32) + beat(3), 0, "tap", 0, 0);
 // NORMAL
 push(bar(32) + beat(0), 1, "hold", beat(4), 1);
 push(bar(32) + beat(2), 2, "tap", 0, 1);
 push(bar(32) + beat(3), 2, "tap", 0, 1);
 // HARD
 push(bar(32) + beat(0), 2, "hold", beat(4), 2);
 push(bar(32) + beat(2), 3, "tap", 0, 2);
 push(bar(32) + beat(3), 3, "tap", 0, 2);
 push(bar(32) + beat(0), 1, "hold", beat(4), 2);
 push(bar(32) + beat(2), 0, "tap", 0, 2);
 push(bar(32) + beat(3), 0, "tap", 0, 2);


 // ========================================
 // bar 33
 // ========================================
 // EASY
 push(bar(33) + beat(0), 0, "tap", 0, 0);
 push(bar(33) + beat(0), 1, "tap", 0, 0);
 push(bar(33) + beat(1), 0, "tap", 0, 0);
 push(bar(33) + beat(1), 1, "tap", 0, 0);
 push(bar(33) + beat(2), 0, "tap", 0, 0);
 push(bar(33) + beat(2), 1, "tap", 0, 0);
 push(bar(33) + beat(3), 0, "tap", 0, 0);
 push(bar(33) + beat(3), 1, "tap", 0, 0);
 // NORMAL
 push(bar(33) + beat(0), 0, "tap", 0, 1);
 push(bar(33) + beat(1), 0, "tap", 0, 1);
 push(bar(33) + beat(2), 0, "tap", 0, 1);
 push(bar(33) + beat(3), 0, "tap", 0, 1);
 push(bar(33) + beat(0), 3, "tap", 0, 1);
 push(bar(33) + beat(1), 3, "tap", 0, 1);
 push(bar(33) + beat(2), 3, "tap", 0, 1);
 push(bar(33) + beat(3), 3, "tap", 0, 1);
 // HARD
 push(bar(33) + beat(0), 0, "tap", 0, 2);
 push(bar(33) + beat(1), 0, "tap", 0, 2);
 push(bar(33) + beat(2), 0, "tap", 0, 2);
 push(bar(33) + beat(3), 0, "tap", 0, 2);
 push(bar(33) + beat(0), 3, "tap", 0, 2);
 push(bar(33) + beat(1), 3, "tap", 0, 2);
 push(bar(33) + beat(2), 3, "tap", 0, 2);
 push(bar(33) + beat(3), 3, "tap", 0, 2);

 // ========================================
 // bar 34
 // ========================================
 // EASY
 push(bar(34) + beat(0), 0, "tap", 0, 0);
 push(bar(34) + beat(0), 1, "tap", 0, 0);
 push(bar(34) + beat(1), 0, "tap", 0, 0);
 push(bar(34) + beat(1), 1, "tap", 0, 0);
 push(bar(34) + beat(2), 0, "tap", 0, 0);
 push(bar(34) + beat(2), 1, "tap", 0, 0);
 push(bar(34) + beat(3), 0, "tap", 0, 0);
 push(bar(34) + beat(3), 1, "tap", 0, 0);
 // NORMAL
 push(bar(34) + beat(0), 1, "tap", 0, 1);
 push(bar(34) + beat(1), 1, "tap", 0, 1);
 push(bar(34) + beat(2), 1, "tap", 0, 1);
 push(bar(34) + beat(3), 1, "tap", 0, 1);
 push(bar(34) + beat(0), 2, "tap", 0, 1);
 push(bar(34) + beat(1), 2, "tap", 0, 1);
 push(bar(34) + beat(2), 2, "tap", 0, 1);
 push(bar(34) + beat(3), 2, "tap", 0, 1);
 // HARD
 push(bar(34) + beat(0), 1, "tap", 0, 2);
 push(bar(34) + beat(1), 1, "tap", 0, 2);
 push(bar(34) + beat(2), 1, "tap", 0, 2);
 push(bar(34) + beat(3), 1, "tap", 0, 2);
 push(bar(34) + beat(0), 2, "tap", 0, 2);
 push(bar(34) + beat(1), 2, "tap", 0, 2);
 push(bar(34) + beat(2), 2, "tap", 0, 2);
 push(bar(34) + beat(3), 2, "tap", 0, 2);


 // ========================================
 // bar 35
 // ========================================
 // EASY
 push(bar(35) + beat(0), 0, "tap", beat(0.5), 0);
 push(bar(35) + beat(0.5), 0, "tap", beat(0.5), 0);
 push(bar(35) + beat(1), 0, "tap", beat(0.5), 0);
 push(bar(35) + beat(1.5), 0, "tap", beat(0.5), 0);
 push(bar(35) + beat(2), 0, "tap", beat(0.5), 0);
 push(bar(35) + beat(2.5), 0, "tap", beat(0.5), 0);
 push(bar(35) + beat(3), 0, "tap", beat(0.5), 0);
 push(bar(35) + beat(3.5), 0, "tap", beat(0.5), 0);
 push(bar(35) + beat(0), 3, "tap", beat(0.5), 0);
 push(bar(35) + beat(0.5), 3, "tap", beat(0.5), 0);
 push(bar(35) + beat(1), 3, "tap", beat(0.5), 0);
 push(bar(35) + beat(1.5), 3, "tap", beat(0.5), 0);
 push(bar(35) + beat(2), 3, "tap", beat(0.5), 0);
 push(bar(35) + beat(2.5), 3, "tap", beat(0.5), 0);
 push(bar(35) + beat(3), 3, "tap", beat(0.5), 0);
 push(bar(35) + beat(3.5), 3, "tap", beat(0.5), 0);
 // NORMAL
 push(bar(35) + beat(0), 0, "tap", beat(0.5), 1);
 push(bar(35) + beat(0.5), 0, "tap", beat(0.5), 1);
 push(bar(35) + beat(1), 0, "tap", beat(0.5), 1);
 push(bar(35) + beat(1.5), 0, "tap", beat(0.5), 1);
 push(bar(35) + beat(2), 0, "tap", beat(0.5), 1);
 push(bar(35) + beat(2.5), 0, "tap", beat(0.5), 1);
 push(bar(35) + beat(3), 0, "tap", beat(0.5), 1);
 push(bar(35) + beat(3.5), 0, "tap", beat(0.5), 1);
 push(bar(35) + beat(0), 0, "tap", beat(0.5), 1);
 push(bar(35) + beat(0.5), 0, "tap", beat(0.5), 1);
 push(bar(35) + beat(1), 0, "tap", beat(0.5), 1);
 push(bar(35) + beat(1.5), 0, "tap", beat(0.5), 1);
 push(bar(35) + beat(2), 0, "tap", beat(0.5), 1);
 push(bar(35) + beat(2.5), 0, "tap", beat(0.5), 1);
 push(bar(35) + beat(3), 0, "tap", beat(0.5), 1);
 push(bar(35) + beat(3.5), 0, "tap", beat(0.5), 1);
 push(bar(35) + beat(0), 3, "tap", beat(0.5), 1);
 push(bar(35) + beat(0.5), 3, "tap", beat(0.5), 1);
 push(bar(35) + beat(1), 3, "tap", beat(0.5), 1);
 push(bar(35) + beat(1.5), 3, "tap", beat(0.5), 1);
 push(bar(35) + beat(2), 3, "tap", beat(0.5), 1);
 push(bar(35) + beat(2.5), 3, "tap", beat(0.5), 1);
 push(bar(35) + beat(3), 3, "tap", beat(0.5), 1);
 push(bar(35) + beat(3.5), 3, "tap", beat(0.5), 1);
 push(bar(35) + beat(0), 3, "tap", beat(0.5), 1);
 push(bar(35) + beat(0.5), 3, "tap", beat(0.5), 1);
 push(bar(35) + beat(1), 3, "tap", beat(0.5), 1);
 push(bar(35) + beat(1.5), 3, "tap", beat(0.5), 1);
 push(bar(35) + beat(2), 3, "tap", beat(0.5), 1);
 push(bar(35) + beat(2.5), 3, "tap", beat(0.5), 1);
 push(bar(35) + beat(3), 3, "tap", beat(0.5), 1);
 push(bar(35) + beat(3.5), 3, "tap", beat(0.5), 1);
 // HARD
push(bar(35) + beat(0), 0, "tap", beat(0.5), 2);
 push(bar(35) + beat(0.5), 0, "tap", beat(0.5), 2);
 push(bar(35) + beat(1), 0, "tap", beat(0.5), 2);
 push(bar(35) + beat(1.5), 0, "tap", beat(0.5), 2);
 push(bar(35) + beat(2), 0, "tap", beat(0.5), 2);
 push(bar(35) + beat(2.5), 0, "tap", beat(0.5), 2);
 push(bar(35) + beat(3), 0, "tap", beat(0.5), 2);
 push(bar(35) + beat(3.5), 0, "tap", beat(0.5), 2);
 push(bar(35) + beat(0), 0, "tap", beat(0.5), 2);
 push(bar(35) + beat(0.5), 0, "tap", beat(0.5), 2);
 push(bar(35) + beat(1), 0, "tap", beat(0.5), 2);
 push(bar(35) + beat(1.5), 0, "tap", beat(0.5), 2);
 push(bar(35) + beat(2), 0, "tap", beat(0.5), 2);
 push(bar(35) + beat(2.5), 0, "tap", beat(0.5), 2);
 push(bar(35) + beat(3), 0, "tap", beat(0.5), 2);
 push(bar(35) + beat(3.5), 0, "tap", beat(0.5), 2);
 push(bar(35) + beat(0), 3, "tap", beat(0.5), 2);
 push(bar(35) + beat(0.5), 3, "tap", beat(0.5), 2);
 push(bar(35) + beat(1), 3, "tap", beat(0.5), 2);
 push(bar(35) + beat(1.5), 3, "tap", beat(0.5), 2);
 push(bar(35) + beat(2), 3, "tap", beat(0.5), 2);
 push(bar(35) + beat(2.5), 3, "tap", beat(0.5), 2);
 push(bar(35) + beat(3), 3, "tap", beat(0.5), 2);
 push(bar(35) + beat(3.5), 3, "tap", beat(0.5), 2);
 push(bar(35) + beat(0), 3, "tap", beat(0.5), 2);
 push(bar(35) + beat(0.5), 3, "tap", beat(0.5), 2);
 push(bar(35) + beat(1), 3, "tap", beat(0.5), 2);
 push(bar(35) + beat(1.5), 3, "tap", beat(0.5), 2);
 push(bar(35) + beat(2), 3, "tap", beat(0.5), 2);
 push(bar(35) + beat(2.5), 3, "tap", beat(0.5), 2);
 push(bar(35) + beat(3), 3, "tap", beat(0.5), 2);
 push(bar(35) + beat(3.5), 3, "tap", beat(0.5), 2);

 // ========================================
 // bar 36
 // ========================================
 // EASY
 push(bar(36) + beat(0), 1, "tap", 0, 0);
 push(bar(36) + beat(0), 2, "tap", 0, 0);
 push(bar(36) + beat(1), 1, "hold", beat(3), 0);
 push(bar(36) + beat(1), 2, "hold", beat(3), 0);
 // NORMAL
 push(bar(36) + beat(0), 1, "tap", 0, 1);
 push(bar(36) + beat(0), 2, "tap", 0, 1);
 push(bar(36) + beat(1), 1, "hold", beat(2), 1);
 push(bar(36) + beat(1), 2, "hold", beat(2), 1);
 push(bar(36) + beat(3), 0, "tap", 0, 1);
 push(bar(36) + beat(3), 3, "tap", 0, 1);
 // HARD
 push(bar(36) + beat(0), 1, "tap", 0, 2);
 push(bar(36) + beat(0), 2, "tap", 0, 2);
 push(bar(36) + beat(1), 1, "hold", beat(2), 2);
 push(bar(36) + beat(1), 2, "hold", beat(2), 2);
 push(bar(36) + beat(3), 0, "tap", 0, 2);
 push(bar(36) + beat(3), 3, "tap", 0, 2);


 // ========================================
 // bar 37
 // ========================================
 // EASY
 push(bar(37) + beat(0), 0, "tap", 0, 0);
 push(bar(37) + beat(1), 0, "tap", 0, 0);
 push(bar(37) + beat(2), 1, "tap", 0, 0);
 push(bar(37) + beat(3), 1, "tap", 0, 0);
 // NORMAL
 push(bar(37) + beat(0), 0, "tap", 0, 1);
 push(bar(37) + beat(1), 0, "tap", 0, 1);
 push(bar(37) + beat(2), 0, "tap", beat(0.5), 1);
 push(bar(37) + beat(2.5), 0, "hold", beat(1.5), 1);
 // HARD
 push(bar(37) + beat(0), 0, "tap", beat(0.5), 2);
 push(bar(37) + beat(0.75), 0, "hold", beat(1.25), 2);
 push(bar(37) + beat(3), 0, "tap", 0, 2);
 push(bar(37) + beat(0), 3, "tap", beat(0.5), 2);
 push(bar(37) + beat(0.75), 3, "hold", beat(1.25), 2);
 push(bar(37) + beat(3), 3, "tap", 0, 2);

 // ========================================
 // bar 38
 // ========================================
 // EASY
 push(bar(38) + beat(0), 3, "tap", 0, 0);
 push(bar(38) + beat(1), 3, "tap", 0, 0);
 push(bar(38) + beat(2), 2, "tap", 0, 0);
 push(bar(38) + beat(3), 2, "tap", 0, 0);
 // NORMAL
 push(bar(38) + beat(0), 2, "tap", beat(0.5), 1);
 push(bar(38) + beat(1), 1, "tap", beat(0.5), 1);
 push(bar(38) + beat(0.5), 2, "tap", beat(0.5), 1);
 push(bar(38) + beat(1.5), 1, "tap", beat(0.5), 1);
 push(bar(38) + beat(2), 0, "tap", 0, 1);
 // HARD
 push(bar(38) + beat(0), 1, "tap", beat(0.5), 2);
 push(bar(38) + beat(0.75), 1, "hold", beat(1.25), 2);
 push(bar(38) + beat(3), 1, "tap", 0, 2);
 push(bar(38) + beat(0), 2, "tap", beat(0.5), 2);
 push(bar(38) + beat(0.75), 2, "hold", beat(1.25), 2);
 push(bar(38) + beat(3), 2, "tap", 0, 2);


 // ========================================
 // bar 39
 // ========================================
 // EASY
 push(bar(39) + beat(0), 0, "tap", 0, 0);
 push(bar(39) + beat(1), 1, "tap", 0, 0);
 push(bar(39) + beat(2), 2, "tap", 0, 0);
 push(bar(39) + beat(3), 3, "tap", 0, 0);
 // NORMAL
 push(bar(39) + beat(0), 0, "tap", 0, 1);
 push(bar(39) + beat(1), 0, "tap", 0, 1);
 push(bar(39) + beat(2), 3, "tap", 0, 1);
 push(bar(39) + beat(3), 3, "tap", 0, 1);
 // HARD
 push(bar(39) + beat(0), 1, "tap", beat(0.5), 2);
 push(bar(39) + beat(0.75), 1, "hold", beat(1.25), 2);
 push(bar(39) + beat(3), 1, "tap", 0, 2);
 push(bar(39) + beat(0), 3, "tap", beat(0.5), 2);
 push(bar(39) + beat(0.75), 3, "hold", beat(1.25), 2);
 push(bar(39) + beat(3), 3, "tap", 0, 2);


 // ========================================
 // bar 40
 // ========================================
 // EASY
 push(bar(40) + beat(0), 3, "tap", 0, 0);
 push(bar(40) + beat(1), 2, "tap", 0, 0);
 push(bar(40) + beat(2), 1, "tap", 0, 0);
 push(bar(40) + beat(3), 0, "tap", 0, 0);
 // NORMAL
 push(bar(40) + beat(0), 2, "tap", beat(0.25), 1);
 push(bar(40) + beat(0.25), 1, "tap", beat(0.25), 1);
 push(bar(40) + beat(0.5), 2, "tap", beat(0.25), 1);
 push(bar(40) + beat(0.75), 1, "tap", beat(0.25), 1);
 push(bar(40) + beat(1), 2, "tap", beat(0.25), 1);
 push(bar(40) + beat(2), 3, "tap", 0, 1);
 // HARD
 push(bar(40) + beat(0), 2, "tap", beat(0.5), 2);
 push(bar(40) + beat(0.75), 2, "hold", beat(1.25), 2);
 push(bar(40) + beat(3), 2, "tap", 0, 2);
 push(bar(40) + beat(0), 0, "tap", beat(0.5), 2);
 push(bar(40) + beat(0.75), 0, "hold", beat(1.25), 2);
 push(bar(40) + beat(3), 0, "tap", 0, 2);



 // ========================================
 // bar 41
 // ========================================
 // EASY
 push(bar(41) + beat(0), 1, "tap", 0, 0);
 push(bar(41) + beat(1), 1, "hold", beat(3), 0);
 // NORMAL
 push(bar(41) + beat(0), 0, "tap", 0, 1);
 push(bar(41) + beat(1), 0, "tap", 0, 1);
 push(bar(41) + beat(2), 0, "tap", 0, 1);
 push(bar(41) + beat(2.5), 3, "hold", beat(1.5), 1);
 // HARD
 push(bar(41) + beat(0), 0, "tap", 0, 2);
 push(bar(41) + beat(1), 0, "tap", 0, 2);
 push(bar(41) + beat(2), 0, "tap", beat(0.5), 2);
 push(bar(41) + beat(2.5), 0, "tap", beat(0.5), 2);
 push(bar(41) + beat(3), 0, "tap", beat(0.5), 2);


 // ========================================
 // bar 42
 // ========================================
 // EASY
 push(bar(42) + beat(0), 2, "tap", 0, 0);
 push(bar(42) + beat(1), 2, "hold", beat(3), 0);
 // NORMAL
 push(bar(42) + beat(0), 1, "tap", 0, 1);
 push(bar(42) + beat(1), 1, "tap", 0, 1);
 push(bar(42) + beat(2), 1, "tap", 0, 1);
 push(bar(42) + beat(3), 1, "tap", 0, 1);
 // HARD
 push(bar(42) + beat(0), 0, "tap", beat(0.5), 2);
 push(bar(42) + beat(1), 1, "tap", beat(0.5), 2);
 push(bar(42) + beat(2), 2, "tap", beat(0.5), 2);
 push(bar(42) + beat(3), 3, "tap", 0, 2);
 push(bar(42) + beat(0.5), 0, "tap", beat(0.5), 2);
 push(bar(42) + beat(1.5), 1, "tap", beat(0.5), 2);
 push(bar(42) + beat(2.5), 2, "tap", beat(0.5), 2);


 // ========================================
 // bar 43
 // ========================================
 // EASY
 push(bar(43) + beat(0), 1, "tap", 0, 0);
 push(bar(43) + beat(1), 1, "tap", 0, 0);
 push(bar(43) + beat(2), 2, "tap", 0, 0);
 push(bar(43) + beat(3), 2, "tap", 0, 0);
 // NORMAL
 push(bar(43) + beat(0), 2, "tap", 0, 1);
 push(bar(43) + beat(1), 2, "tap", 0, 1);
 push(bar(43) + beat(2), 2, "tap", 0, 1);
 push(bar(43) + beat(3), 2, "tap", 0, 1);
 // HARD
 push(bar(43) + beat(0), 2, "tap", beat(0.5), 2);
 push(bar(43) + beat(1), 1, "tap", beat(0.5), 2);
 push(bar(43) + beat(2), 3, "tap", beat(0.5), 2);
 push(bar(43) + beat(3), 3, "tap", 0, 2);
 push(bar(43) + beat(0.5), 2, "tap", beat(0.5), 2);
 push(bar(43) + beat(1.5), 0, "tap", beat(0.5), 2);
 push(bar(43) + beat(2.5), 2, "tap", beat(0.5), 2);


 // ========================================
 // bar 44
 // ========================================
 // EASY
 push(bar(44) + beat(0), 0, "tap", 0, 0);
 push(bar(44) + beat(1), 0, "tap", 0, 0);
 push(bar(44) + beat(2), 3, "tap", 0, 0);
 push(bar(44) + beat(3), 3, "tap", 0, 0);
 // NORMAL
 push(bar(44) + beat(0), 0, "tap", 0, 1);
 push(bar(44) + beat(1), 0, "tap", 0, 1);
 push(bar(44) + beat(2), 0, "tap", 0, 1);
 push(bar(44) + beat(3), 0, "tap", 0, 1);
 push(bar(44) + beat(0), 3, "tap", 0, 1);
 push(bar(44) + beat(1), 3, "tap", 0, 1);
 push(bar(44) + beat(2), 3, "tap", 0, 1);
 push(bar(44) + beat(3), 3, "tap", 0, 1);
 // HARD
 push(bar(44) + beat(0), 1, "tap", beat(0.5), 2);
 push(bar(44) + beat(1), 1, "tap", beat(0.5), 2);
 push(bar(44) + beat(2), 1, "tap", beat(0.5), 2);
 push(bar(44) + beat(3), 1, "tap", 0, 2);
 push(bar(44) + beat(0.5), 1, "tap", beat(0.5), 2);
 push(bar(44) + beat(1.5), 1, "tap", beat(0.5), 2);
 push(bar(44) + beat(2.5), 1, "tap", beat(0.5), 2);
 push(bar(44) + beat(0), 2, "tap", beat(0.5), 2);
 push(bar(44) + beat(1), 2, "tap", beat(0.5), 2);
 push(bar(44) + beat(2), 2, "tap", beat(0.5), 2);
 push(bar(44) + beat(3), 2, "tap", 0, 2);
 push(bar(44) + beat(0.5), 2, "tap", beat(0.5), 2);
 push(bar(44) + beat(1.5), 2, "tap", beat(0.5), 2);
 push(bar(44) + beat(2.5), 2, "tap", beat(0.5), 2);


 // ========================================
 // bar 45
 // ========================================
 // EASY
 push(bar(45) + beat(0), 0, "tap", beat(0.5), 0);
 push(bar(45) + beat(0.5), 0, "hold", beat(3.5), 0);
 // NORMAL
 push(bar(45) + beat(0), 0, "tap", beat(0.5), 1);
 push(bar(45) + beat(0.5), 0, "hold", beat(3.5), 1);
 push(bar(45) + beat(2), 3, "tap", beat(0.5), 1);
 push(bar(45) + beat(2.5), 3, "hold", beat(3.5), 1);
 // HARD
 push(bar(45) + beat(0), 0, "tap", beat(0.5), 2);
 push(bar(45) + beat(0.5), 0, "hold", beat(3.5), 2);
 push(bar(45) + beat(2), 3, "tap", beat(0.5), 2);
 push(bar(45) + beat(2.5), 3, "hold", beat(3.5), 2);
 push(bar(45) + beat(0), 1, "tap", beat(0.5), 2);
 push(bar(45) + beat(0.5), 1, "hold", beat(3.5), 2);
 push(bar(45) + beat(2), 2, "tap", beat(0.5), 2);
 push(bar(45) + beat(2.5), 2, "hold", beat(3.5), 2);



 // ========================================
 // bar 46
 // ========================================
 // EASY
 push(bar(46) + beat(0), 3, "tap", beat(0.5), 0);
 push(bar(46) + beat(0.5), 3, "hold", beat(3.5), 0);
 // NORMAL
 push(bar(46) + beat(0), 0, "tap", beat(0.5), 1);
 push(bar(46) + beat(0.5), 0, "hold", beat(3.5), 1);
 push(bar(46) + beat(2), 3, "tap", beat(0.5), 1);
 push(bar(46) + beat(2.5), 3, "hold", beat(3.5), 1);
 // HARD
 push(bar(46) + beat(0), 0, "tap", beat(0.5), 2);
 push(bar(46) + beat(0.5), 0, "hold", beat(3.5), 2);
 push(bar(46) + beat(2), 3, "tap", beat(0.5), 2);
 push(bar(46) + beat(2.5), 3, "hold", beat(3.5), 2);
 push(bar(46) + beat(0), 1, "tap", beat(0.5), 2);
 push(bar(46) + beat(0.5), 1, "hold", beat(3.5), 2);
 push(bar(46) + beat(2), 2, "tap", beat(0.5), 2);
 push(bar(46) + beat(2.5), 2, "hold", beat(3.5), 2);


 // ========================================
 // bar 47
 // ========================================
 // EASY
 push(bar(47) + beat(0), 1, "tap", 0, 0);
 push(bar(47) + beat(1), 1, "tap", 0, 0);
 push(bar(47) + beat(2), 2, "tap", 0, 0);
 push(bar(47) + beat(3), 2, "tap", 0, 0);
 // NORMAL
 push(bar(47) + beat(0), 1, "tap", 0, 1);
 push(bar(47) + beat(1), 2, "tap", 0, 1);
 push(bar(47) + beat(2), 0, "tap", 0, 1);
 push(bar(47) + beat(3), 3, "tap", 0, 1);
 // HARD
 push(bar(47) + beat(0), 2, "tap", 0, 2);
 push(bar(47) + beat(1), 1, "tap", 0, 2);
 push(bar(47) + beat(2), 0, "tap", 0, 2);
 push(bar(47) + beat(3), 3, "tap", 0, 2);
 push(bar(47) + beat(0), 1, "tap", 0, 2);
 push(bar(47) + beat(1), 2, "tap", 0, 2);
 push(bar(47) + beat(2), 3, "tap", 0, 2);
 push(bar(47) + beat(3), 0, "tap", 0, 2);


 // ========================================
 // bar 48
 // ========================================
 // EASY
 push(bar(48) + beat(0), 1, "tap", 0, 0);
 push(bar(48) + beat(1), 1, "tap", 0, 0);
 push(bar(48) + beat(2), 2, "tap", 0, 0);
 push(bar(48) + beat(3), 2, "tap", 0, 0);
 // NORMAL
 push(bar(48) + beat(0), 1, "tap", 0, 1);
 push(bar(48) + beat(1), 2, "tap", 0, 1);
 push(bar(48) + beat(2), 0, "tap", 0, 1);
 push(bar(48) + beat(3), 3, "tap", 0, 1);
 // HARD
 push(bar(48) + beat(0), 2, "tap", 0, 2);
 push(bar(48) + beat(1), 2, "tap", 0, 2);
 push(bar(48) + beat(2), 3, "tap", 0, 2);
 push(bar(48) + beat(3), 3, "tap", 0, 2);
 push(bar(48) + beat(0), 1, "tap", 0, 2);
 push(bar(48) + beat(1), 1, "tap", 0, 2);
 push(bar(48) + beat(2), 0, "tap", 0, 2);
 push(bar(48) + beat(3), 0, "tap", 0, 2);


 // ========================================
 // bar 49
 // ========================================
 // EASY
 push(bar(49) + beat(0), 0, "hold", beat(2), 0);
 push(bar(49) + beat(1), 1, "tap", 0, 0);
 push(bar(49) + beat(2), 3, "hold", beat(2), 0);
 push(bar(49) + beat(3), 2, "tap", 0, 0);
 // NORMAL
 push(bar(49) + beat(0), 0, "hold", beat(2), 1);
 push(bar(49) + beat(1), 1, "tap", beat(0.5), 1);
 push(bar(49) + beat(1.5), 1, "tap", beat(0.5), 1);
 push(bar(49) + beat(2), 3, "hold", beat(2), 1);
 push(bar(49) + beat(3), 2, "tap", beat(0.5), 1);
 push(bar(49) + beat(3.5), 2, "tap", beat(0.5), 1);
 // HARD
 push(bar(49) + beat(0), 0, "tap", beat(0.5), 2);
 push(bar(49) + beat(0.5), 0, "tap", beat(0.5), 2);
 push(bar(49) + beat(1), 0, "tap", beat(0.5), 2);
 push(bar(49) + beat(2), 0, "tap", beat(0.5), 2);
 push(bar(49) + beat(2.5), 0, "tap", beat(0.5), 2);
 push(bar(49) + beat(3), 0, "tap", beat(0.5), 2);
 push(bar(49) + beat(0), 3, "tap", beat(0.5), 2);
 push(bar(49) + beat(0.5), 3, "tap", beat(0.5), 2);
 push(bar(49) + beat(1), 3, "tap", beat(0.5), 2);
 push(bar(49) + beat(2), 3, "tap", beat(0.5), 2);
 push(bar(49) + beat(2.5), 3, "tap", beat(0.5), 2);
 push(bar(49) + beat(3), 3, "tap", beat(0.5), 2);


 // ========================================
 // bar 50
 // ========================================
 // EASY
 push(bar(50) + beat(0), 2, "hold", beat(2), 0);
 push(bar(50) + beat(1), 3, "tap", 0, 0);
 push(bar(50) + beat(2), 1, "hold", beat(2), 0);
 push(bar(50) + beat(3), 0, "tap", 0, 0);
 // NORMAL
 push(bar(50) + beat(0), 2, "hold", beat(2), 1);
 push(bar(50) + beat(1), 3, "tap", beat(0.5), 1);
 push(bar(50) + beat(1.5), 3, "tap", beat(0.5), 1);
 push(bar(50) + beat(2), 1, "hold", beat(2), 1);
 push(bar(50) + beat(3), 0, "tap", beat(0.5), 1);
 push(bar(50) + beat(3.5), 0, "tap", beat(0.5), 1);
 // HARD
 push(bar(50) + beat(0), 1, "tap", beat(0.5), 2);
 push(bar(50) + beat(0.5), 1, "tap", beat(0.5), 2);
 push(bar(50) + beat(1), 1, "tap", beat(0.5), 2);
 push(bar(50) + beat(2), 1, "tap", beat(0.5), 2);
 push(bar(50) + beat(2.5), 1, "tap", beat(0.5), 2);
 push(bar(50) + beat(3), 1, "tap", beat(0.5), 2);
 push(bar(50) + beat(0), 2, "tap", beat(0.5), 2);
 push(bar(50) + beat(0.5), 2, "tap", beat(0.5), 2);
 push(bar(50) + beat(1), 2, "tap", beat(0.5), 2);
 push(bar(50) + beat(2), 2, "tap", beat(0.5), 2);
 push(bar(50) + beat(2.5), 2, "tap", beat(0.5), 2);
 push(bar(50) + beat(3), 2, "tap", beat(0.5), 2);


 // ========================================
 // bar 51
 // ========================================
 // EASY
 push(bar(51) + beat(0), 0, "tap", 0, 0);
 push(bar(51) + beat(1), 0, "tap", 0, 0);
 push(bar(51) + beat(2), 0, "tap", 0, 0);
 push(bar(51) + beat(3), 0, "tap", 0, 0);
 // NORMAL
 push(bar(51) + beat(0), 1, "tap", 0, 1);
 push(bar(51) + beat(1), 2, "tap", 0, 1);
 push(bar(51) + beat(2), 1, "tap", 0, 1);
 push(bar(51) + beat(3), 2, "tap", 0, 1);
 // HARD
 push(bar(51) + beat(0), 0, "tap", 0, 2);
 push(bar(51) + beat(1), 0, "tap", 0, 2);
 push(bar(51) + beat(2), 0, "tap", 0, 2);
 push(bar(51) + beat(3), 0, "tap", 0, 2);
 push(bar(51) + beat(0), 3, "tap", 0, 2);
 push(bar(51) + beat(1), 3, "tap", 0, 2);
 push(bar(51) + beat(2), 3, "tap", 0, 2);
 push(bar(51) + beat(3), 3, "tap", 0, 2);


 // ========================================
 // bar 52
 // ========================================
 // EASY
 push(bar(52) + beat(0), 3, "tap", 0, 0);
 push(bar(52) + beat(1), 3, "tap", 0, 0);
 push(bar(52) + beat(2), 3, "tap", 0, 0);
 push(bar(52) + beat(3), 3, "tap", 0, 0);
 // NORMAL
 push(bar(52) + beat(0), 0, "tap", 0, 1);
 push(bar(52) + beat(1), 3, "tap", 0, 1);
 push(bar(52) + beat(2), 0, "tap", 0, 1);
 push(bar(52) + beat(3), 3, "tap", 0, 1);
 // HARD
 push(bar(52) + beat(0), 0, "tap", 0, 2);
 push(bar(52) + beat(1), 0, "tap", 0, 2);
 push(bar(52) + beat(2), 0, "tap", 0, 2);
 push(bar(52) + beat(3), 0, "tap", 0, 2);
 push(bar(52) + beat(0), 3, "tap", 0, 2);
 push(bar(52) + beat(1), 3, "tap", 0, 2);
 push(bar(52) + beat(2), 3, "tap", 0, 2);
 push(bar(52) + beat(3), 3, "tap", 0, 2);


 // ========================================
 // bar 53
 // ========================================
 // EASY
 push(bar(53) + beat(0), 1, "hold", beat(4), 0);
 push(bar(53) + beat(0), 2, "hold", beat(4), 0);
 // NORMAL
 push(bar(53) + beat(0), 0, "tap", beat(0.5), 1);
 push(bar(53) + beat(1), 0, "tap", beat(0.5), 1);
 push(bar(53) + beat(2), 0, "tap", beat(0.5), 1);
 push(bar(53) + beat(3), 0, "tap", beat(0.5), 1);
 push(bar(53) + beat(0.5), 3, "tap", beat(0.5), 1);
 push(bar(53) + beat(1.5), 3, "tap", beat(0.5), 1);
 push(bar(53) + beat(2.5), 3, "tap", beat(0.5), 1);
 push(bar(53) + beat(3.5), 3, "tap", beat(0.5), 1);
 // HARD
 push(bar(53) + beat(0), 0, "hold", beat(4), 2);
 push(bar(53) + beat(0), 3, "hold", beat(4), 2);


 notes.sort(function (a, b) { return a.t - b.t; });


 return {
   videoId: "MF4Yw8IS6og",
   title: "Princess Viral",
   bpm: BPM,
   offset: 0,
   duration: 98,
   theme: {
     bgTop: "#0a1830",
     bgBottom: "#1d3a63",
     accent: "#5b9bff",
     lanes: ["#5b9bff", "#93b4e8", "#7fa6e0", "#3a6cb5"]
   },
   notes: notes
 };
})();


