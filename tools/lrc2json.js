#!/usr/bin/env node
/**
 * tools/lrc2json.js
 * LRCとMIDI/手入力ピッチをマージして milikara 用の pitch.json を作る補助スクリプト
 *
 * 使い方:
 *   1) LRCを用意: games/milikara/lrc/kawibawibo.lrc
 *      [00:12.30]カウィバウィボ
 *   2) ピッチをMIDIで用意（MuseScore等で耳コピ）: games/milikara/pitch/kawibawibo.mid
 *      または手で pitch.json の雛形を作る
 *   3) 実行:
 *      node tools/lrc2json.js games/milikara/lrc/kawibawibo.lrc games/milikara/pitch/kawibawibo.mid
 *      → games/milikara/pitch/kawibawibo.json に出力
 *
 *   MIDIがない場合、LRCだけからダミーの pitch.json を作ることも可能:
 *      node tools/lrc2json.js games/milikara/lrc/kawibawibo.lrc --dummy
 *
 * 出力形式:
 *   [ { "t": 12.30, "d": 0.8, "midi": 60, "lyric": "カウィバウィボ" }, ... ]
 *   t: 開始秒, d: 長さ秒, midi: 60=C4, lyric: 歌詞
 */
"use strict";
const fs = require("fs");
const path = require("path");

function parseLRC(text) {
  const lines = text.split(/\r?\n/);
  const out = [];
  const re = /\[(\d+):(\d+)(?:\.(\d+))?\](.*)/;
  for (const line of lines) {
    const m = line.match(re);
    if (!m) continue;
    const min = parseInt(m[1], 10), sec = parseInt(m[2], 10), cs = m[3] ? parseInt((m[3] + "00").slice(0, 2), 10) : 0;
    const t = min * 60 + sec + cs / 100;
    const lyric = m[4].trim();
    if (lyric) out.push({ t, lyric });
  }
  out.sort((a, b) => a.t - b.t);
  // durationは次の行まで
  for (let i = 0; i < out.length; i++) {
    const next = out[i + 1];
    out[i].d = next ? Math.min(next.t - out[i].t - 0.05, 1.2) : 1.0;
    if (out[i].d < 0.3) out[i].d = 0.3;
  }
  return out;
}

// 簡易MIDIパーサ（Type0, 1トラックのみ対応、なければダミー）
function parseMidiDummy(lrcData) {
  // LRCだけの場合、仮にC4(60)で埋める
  return lrcData.map(l => ({ t: l.t, d: l.d, midi: 60, lyric: l.lyric }));
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log("Usage: node tools/lrc2json.js <lrc> [midi] [--dummy]");
    console.log("  例: node tools/lrc2json.js games/milikara/lrc/kawibawibo.lrc --dummy");
    process.exit(1);
  }
  const lrcPath = args[0];
  const midiPath = args[1] && !args[1].startsWith("--") ? args[1] : null;
  const isDummy = args.includes("--dummy");

  const lrcText = fs.readFileSync(lrcPath, "utf8");
  const lrcData = parseLRC(lrcText);
  console.log(`LRC: ${lrcData.length} 行 from ${lrcPath}`);
  for (const l of lrcData.slice(0, 3)) console.log(`  ${l.t.toFixed(2)}s "${l.lyric}" d=${l.d.toFixed(2)}`);

  let pitchData;
  if (isDummy || !midiPath) {
    console.log("-> ダミーピッチ (C4=60) で生成します。後で midi を手で修正してください。");
    pitchData = parseMidiDummy(lrcData);
  } else {
    // MIDIパースは外部ライブラリが必要なため、ここでは簡易にLRCベースで生成し警告
    console.log(`MIDI ${midiPath} が指定されましたが、このスクリプトの簡易版ではMIDIパースに 'midi-file-parser' が必要です。`);
    console.log("  npm install midi-file-parser してから tools/midi2pitch.js を使ってください。");
    console.log("  今回はダミーで出力します。");
    pitchData = parseMidiDummy(lrcData);
  }

  const outPath = lrcPath.replace(/\/lrc\//, "/pitch/").replace(/\.lrc$/, ".json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(pitchData, null, 2) + "\n");
  console.log(`\n出力: ${outPath} (${pitchData.length} ノーツ)`);
  console.log("このJSONを games/milikara.html の SONGS 配列の pitch に貼り付けるか、fetchで読み込んでください。");
  console.log("例: pitch: " + JSON.stringify(pitchData.slice(0, 1)) + " ...");
}

main();
