# Milli Games plus（開発用テスト環境）

[Milli Games](https://milli-games.onrender.com/index.html) に新しくゲームを追加するための開発用リポジトリです。
本番サイトと同じフォルダ構成を再現しているので、このリポジトリ内で開発・動作確認して、**できあがったファイルを本番サイトにコピーするだけで追加できます**。

## フォルダ構成

```
├── index.html            # 本番サイトと同内容のポータルページ
├── style.css             # 本番サイトと同内容のスタイル
├── script.js             # 本番サイトと同内容のメインスクリプト（games配列）
├── firebase-config.js    # ★テスト環境用プレースホルダ（キーなし）
├── firebase-init.js      # 本番サイトと同内容の連携ヘルパー
├── images/
│   ├── rogo.png          # ヘッダーのロゴ（本番から取得）
│   ├── icon/             # favicon・アプリアイコン（本番から取得）
│   ├── ogp.png           # シェア用画像（本番から取得）
│   └── games/
│       ├── icon/         # ゲームアイコン（既存ゲームはプレースホルダ）
│       └── rogo/         # ゲームロゴ（既存ゲームはプレースホルダ）
├── games/
│   └── TEMPLATE.html     # ★新ゲーム開発用のテンプレート
└── tools/
    └── gen-placeholders.js # プレースホルダ画像生成ツール
```

## ローカルでの動作確認

```bash
# このリポジトリのルートで静的サーバーを起動
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000/index.html` を開くと、本番サイトと同じポータルが表示されます。
（VS Code の Live Server などでも OK。`file://` 直開きよりサーバー経由が推奨）

## 新ゲームの作り方（開発手順）

1. `games/TEMPLATE.html` をコピーして `games/<ゲーム名>.html` を作る
2. `<title>`・OG設定・ゲーム名・`GAME_ID` を書き換える
3. テンプレート内の `<!-- ★ここにゲーム本体のUIを作る -->` 以降を自分のゲームに置き換える
4. `saveHistory()` でプレイ結果を記録する（テンプレート内に説明あり）
5. ゲームアイコンを `images/games/icon/`、ゲームロゴを `images/games/rogo/` に置く
6. ローカルで動作確認

### 履歴に記録できる項目

本番サイトの「プレイ履歴」に表示されるデータです（`games/TEMPLATE.html` の `saveHistory` 参照）:

| 項目 | 説明 | 例 |
|---|---|---|
| `score` | スコア | `12345` |
| `clear` | クリア/ゲームオーバー | `true` / `false` |
| `type` + `name` | 種類と結果名 | 診断結果など |
| `matchPct` | 一致度(%) | `87` |
| `accuracy` | 精度(%) | `92` |
| `rank` | ランク | `SS` |

## 本番サイトへの反映手順

1. **ゲーム本体**: `games/<ゲーム名>.html` を本番の `games/` フォルダにアップロード
2. **ゲーム画像**: `images/games/icon/` と `images/games/rogo/` にアイコン・ロゴをアップロード
3. **ゲーム登録**: 本番の `script.js` の `games` 配列にエントリを追加（`TEMPLATE` を参考に）

```js
{
  id: 9,                      // ★既存のidと重複しない一意な数字
  title: "ゲーム名",
  description: "ゲームの説明",
  image: "images/games/icon/ゲーム名-icon.png",
  points: 100,                // 獲得ポイント（SITE_TYPE=demoの間は表示されない）
  exp: "x1.2",
  tags: ["おすすめ", "新着"], // フィルター用タグ
  link: "games/ゲーム名.html"
}
```

4. **Firebase設定**: 本番の `firebase-config.js`（実キー入り）は、このリポジトリのプレースホルダで**上書きしない**こと。本番のものをそのまま使い続ける

## 注意事項

- `firebase-config.js` はプレースホルダです（apiKeyなし）。このままでは連携機能は自動的に無効になり、ローカル開発に支障はありません
- 実APIキーをこのリポジトリに**コミットしない**こと
- 既存ゲーム（2048等）のタイル画像 `images/games/2048/*.svg` はこのリポジトリに含めていません。必要になったら本番サイトからコピーしてください
- 既存ゲームのアイコンは仮のプレースホルダ画像です。本番の見た目を再現するには本番サイトから `images/games/icon/` をコピーしてください

## プレースホルダ画像の再生成

```bash
node tools/gen-placeholders.js
```