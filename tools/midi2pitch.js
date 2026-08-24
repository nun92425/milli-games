#!/usr/bin/env node
/**
 * tools/midi2pitch.js
 * MIDIファイルから milikara 用の pitch.json を作る
 *
 * 使い方:
 *   npm install midi-file-parser  # 1回だけ
 *   node tools/midi2pitch.js input.mid
 *   → 同じフォルダに input.json を出力
 *
 * 出力: [ { t, d, midi, track } ]
 *   t: 開始秒, d: 長さ秒, midi: 0-127, track: トラック名
 *
 * ヒント:
 *   MuseScoreでメロディを打ち込み → ファイル > エクスポート > MIDI で保存
 *   テンポが120以外の場合も ticks -> 秒に自動変換されます
 */
"use strict";
const fs = require("fs");

function main() {
  const midiPath = process.argv[2];
  if (!midiPath) {
    console.log("Usage: node tools/midi2pitch.js <input.mid>");
    console.log("  npm install midi-file-parser");
    process.exit(1);
  }
  let MidiParser;
  try { MidiParser = require("midi-file-parser"); } catch (e) {
    console.error("midi-file-parser が見つかりません。");
    console.error("  npm install midi-file-parser");
    console.error("  または手で pitch.json を作ってください。");
    process.exit(1);
  }
  const data = fs.readFileSync(midiPath, "binary");
  const midi = MidiParser(data);
  const ticksPerBeat = midi.header.ticksPerBeat || 480;
  let bpm = 120;
  // テンポ取得
  for (const track of midi.tracks) {
    for (const ev of track) {
      if (ev.subtype === "setTempo") {
        bpm = 60000000 / ev.microsecondsPerBeat;
        break;
      }
    }
  }
  const secPerTick = 60 / bpm / ticksPerBeat;
  const notes = [];
  for (let ti = 0; ti < midi.tracks.length; ti++) {
    const track = midi.tracks[ti];
    let absTick = 0;
    const onNotes = new Map();
    for (const ev of track) {
      absTick += ev.deltaTime;
      if (ev.subtype === "noteOn" && ev.velocity > 0) {
        onNotes.set(ev.noteNumber + "_" + ev.channel, { t: absTick * secPerTick, midi: ev.noteNumber });
      } else if (ev.subtype === "noteOff" || (ev.subtype === "noteOn" && ev.velocity === 0)) {
        const key = ev.noteNumber + "_" + ev.channel;
        const on = onNotes.get(key);
        if (on) {
          onNotes.delete(key);
          const t = on.t;
          const d = absTick * secPerTick - t;
          if (d > 0.05) notes.push({ t: parseFloat(t.toFixed(2)), d: parseFloat(d.toFixed(2)), midi: on.midi });
        }
      }
    }
  }
  notes.sort((a, b) => a.t - b.t);
  const outPath = midiPath.replace(/\.mid$/i, ".json");
  fs.writeFileSync(outPath, JSON.stringify(notes, null, 2) + "\n");
  console.log(`MIDI: ${midiPath} bpm=${bpm} ticksPerBeat=${ticksPerBeat}`);
  console.log(`出力: ${outPath} (${notes.length} ノーツ)`);
  for (const n of notes.slice(0, 5)) console.log(`  t=${n.t} d=${n.d} midi=${n.midi}`);
}

main();
