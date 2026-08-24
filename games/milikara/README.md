# milikara データ置き場

このフォルダに曲データを置きます。`games/milikara.html` の `SONGS` 配列から参照されます。

## 置き方

```
games/milikara/
  audio/kawibawibo_inst.mp3   # 公式インスト音源（mp3/wav/ogg）
  lrc/kawibawibo.lrc          # 歌詞
  pitch/kawibawibo.json       # 正解ピッチ
```

`milikara.html` の `SONGS` 配列でパスを指定:
```js
{ id:"kawibawibo", title:"カウィバウィボ", artist:"音ノ乃のの", audio:"milikara/audio/kawibawibo_inst.mp3", lrcText: null, pitch: [...] }
```

`lrcText` が null の場合は `fetch` で `lrc/*.lrc` を読み込みます（同一オリジン）。

## LRCの作り方

```
[00:12.30]カウィバウィボ
[00:15.10]踊りだす魔法
```

* Audacityや https://lrc-maker.github.io/ でタイムコードを打つ
* `tools/lrc2json.js` のコメント参照

## ピッチJSONの作り方

```json
[ { "t": 12.30, "d": 0.8, "midi": 60 }, ... ]
```

* `t`: 開始秒, `d`: 長さ秒, `midi`: 60=C4
* `tools/midi2pitch.js` でMIDIから変換、または `tools/lrc2json.js` で生成

詳しくは `tools/` 内のスクリプトのコメントを参照。
