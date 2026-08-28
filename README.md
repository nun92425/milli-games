# Milli Games（本番兼開発）

[Milli Games](https://milli-games.onrender.com/index.html) 本番兼開発リポジトリです。旧本番 `tsukikage-R8/milligame` の履歴を統合し、このリポジトリで本番開発を行います。

## ブランチ運用（WIP非公開）

- `main` — 本番デプロイ用（Renderが監視）。公開済みの4ゲームのみ。WIPは物理的に存在しません。
  - `script.js:275` の `getFilteredGames()` は保険として `devOnly:true` を除外。
  - 直接URL (`games/milikara.html` 等) でもWIPに到達不可。
- `dev` — 開発統合用。WIP3件（ミリカラ/Milli Fortune/みりこれ！）を含む7ゲーム。Codespacesは `dev` で起動。
  - `dev` → `main` へのPRで1ゲームずつ公開（`devOnly:true` を外す）。
- `feature/<game>` — 各ゲームの作業ブランチ → `dev` にPR。

```
main  ──●──●──●── (Renderがデプロイ。4ゲーム)
          ╲
dev        ●──●── (7ゲーム, WIP含む)
            ╲
feature/*    ●── (各ゲーム開発)
```

旧 `Milli-Games-plus` は開発用テスト環境でしたが、2026-08-28に本番統合しました。

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

## 新ゲーム公開手順（dev → main）

1. `feature/<game>` で開発 → `dev` にPR（この時点ではまだ非公開、本番影響なし）
2. 公開準備完了後、`dev` → `main` にPRを作成。このPRで以下を実施:
   - `games/<ゲーム名>.html` を `main` に含める
   - `images/games/icon/` , `images/games/rogo/` の実アイコンを `main` に含める
   - `script.js` の該当エントリから `devOnly:true` を削除
3. レビュー後マージ → Renderが `main` を自動デプロイ

```js
// devブランチでのWIP登録例（devOnly:true でmainでは非表示）
{
  id: 9,
  title: "ゲーム名",
  description: "ゲームの説明",
  image: "images/games/icon/ゲーム名-icon.png",
  points: 100,
  exp: "x1.2",
  tags: ["おすすめ", "新着"],
  link: "games/ゲーム名.html",
  devOnly: true  // ← 公開時にこの行を削除
}
```

4. **Firebase設定**: `firebase-config.js` は `millipro-shared`（`sunmachia/Millipro-Chronicle` と同一）を使用。`firebase-config.example.js` がプレースホルダ。

## 注意事項

- `firebase-config.js` はプレースホルダです（apiKeyなし）。このままでは連携機能は自動的に無効になり、ローカル開発に支障はありません
- 実APIキーをこのリポジトリに**コミットしない**こと
- 既存ゲーム（2048等）のタイル画像 `images/games/2048/*.svg` はこのリポジトリに含めていません。必要になったら本番サイトからコピーしてください
- 既存ゲームのアイコンは仮のプレースホルダ画像です。本番の見た目を再現するには本番サイトから `images/games/icon/` をコピーしてください

## プレースホルダ画像の再生成

```bash
node tools/gen-placeholders.js
```