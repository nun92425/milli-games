#!/bin/bash
set -e
# Milli Games Cloudflare移行スクリプト
# docs/あ.md 仕様準拠 + main限定 + 共有リンク対応
# - og:url / og:image を https://milli-games.onrender.com → https://milli-games.pages.dev に置換
# - index.html と games/*.html の <head> にJSリダイレクト（onrender.com かつ非クローラなら pages.dev へ location.replace）を追加
# - index.html の <body> 直後に黄色バナー追加
# - games/*.js 内の共有テキスト内リンクも置換（結果画像の共有系は新リンクへ）
# - _redirects は作成しない（Pagesで無限ループの原因）

OLD="https://milli-games.onrender.com"
NEW="https://milli-games.pages.dev"
REDIRECT_JS='<script>var OLD_BASE="https://milli-games.onrender.com";var NEW_BASE="https://milli-games.pages.dev";(function(){if(location.hostname.indexOf("onrender.com")!==-1){var ua=navigator.userAgent||"";var isCrawler=/bot|crawler|spider|facebookexternalhit|Twitterbot|Slackbot|Discordbot|LinkedInBot|WhatsApp|Slack/i.test(ua);if(!isCrawler){location.replace(location.href.replace(OLD_BASE,NEW_BASE));}}})();</script>'
BANNER='<div style="background:#ffeb3b;color:#000;text-align:center;padding:8px 12px;font-size:14px;z-index:9999;position:relative;border-bottom:1px solid #e6c200;">移行しました: 新サイトはこちら → <a href="https://milli-games.pages.dev" style="color:#000;font-weight:bold;text-decoration:underline;">https://milli-games.pages.dev</a></div>'

if [ ! -f "index.html" ]; then
  echo "NG: index.html がルートに見つかりません。リポジトリルートで実行してください。"
  exit 1
fi

echo "[1/4] og:url / og:image 置換 (html)..."
# html files — リダイレクトJS内の OLD_BASE は置換しない（べき等性保全）
for f in index.html games/*.html; do
  if [ -f "$f" ]; then
    # OLD_BASE を含む行はスキップ（リダイレクトJS）
    sed -i '/OLD_BASE/! s|'"${OLD}"'|'"${NEW}"'|g' "$f"
    echo "  - $f"
  fi
done

echo "[2/4] 共有テキスト内リンク置換 (js)..."
for f in games/*.js; do
  if [ -f "$f" ] && grep -q "milli-games.onrender.com" "$f" 2>/dev/null; then
    sed -i "s|${OLD}|${NEW}|g" "$f"
    echo "  - $f"
  fi
done
# games 内の html に埋め込まれた共有リンクがあればそちらも（念のため）
for f in games/*.html; do
  if [ -f "$f" ] && grep -q "milli-games.onrender.com" "$f" 2>/dev/null; then
    # 既に [1/4] で置換済みだが念のため
    :;
  fi
done

echo "[3/4] JSリダイレクト追加..."

add_redirect() {
  local file="$1"
  if grep -q "NEW_BASE" "$file" 2>/dev/null; then
    echo "  - $file: 既にリダイレクトJSあり skip"
    return
  fi
  # </head> の直前に挿入 (最後の </head> のみ)
  # 一時ファイルで処理
  python3 -c "
import pathlib, sys
p = pathlib.Path(sys.argv[1])
t = p.read_text(encoding='utf-8')
js = sys.argv[2]
if 'NEW_BASE' in t:
    sys.exit(0)
# 最後の </head> の直前に挿入
idx = t.rfind('</head>')
if idx == -1:
    print('NG: </head> not found in ' + sys.argv[1], file=sys.stderr)
    sys.exit(1)
new = t[:idx] + js + '\n' + t[idx:]
p.write_text(new, encoding='utf-8')
print('  - ' + sys.argv[1] + ': リダイレクトJS追加')
" "$file" "$REDIRECT_JS"
}

add_redirect "index.html"
for f in games/*.html; do
  if [ -f "$f" ]; then
    add_redirect "$f"
  fi
done

echo "[4/4] 黄色バナー追加 (index.html の <body> 直後)..."
if grep -q "移行しました" index.html 2>/dev/null; then
  echo "  - index.html: 既にバナーあり skip"
else
  python3 -c "
import pathlib
p = pathlib.Path('index.html')
t = p.read_text(encoding='utf-8')
banner = '''${BANNER}'''
# <body> の直後に挿入（最初の <body> のみ）
import re
m = re.search(r'<body[^>]*>', t)
if not m:
    print('NG: <body> not found', file=__import__('sys').stderr)
    import sys; sys.exit(1)
idx = m.end()
new = t[:idx] + '\n' + banner + t[idx:]
p.write_text(new, encoding='utf-8')
print('  - index.html: バナー追加')
"
fi

echo ""
echo "Done. 検証:"
# OLD_BASE 内の onrender はリダイレクト用なので除外して検証（og:url等の残留のみをチェック）
if grep -rn "milli-games.onrender.com" --include="*.html" --include="*.js" . 2>/dev/null | grep -v ".git" | grep -v "APPLY_CLOUDFLARE_MIGRATION.sh" | grep -v "OLD_BASE" | grep -q .; then
  echo "NG: まだ milli-games.onrender.com が残っています:"
  grep -rn "milli-games.onrender.com" --include="*.html" --include="*.js" . 2>/dev/null | grep -v ".git" | grep -v "APPLY_CLOUDFLARE_MIGRATION.sh" | grep -v "OLD_BASE"
else
  echo "OK: 置換完了 (html/js に onrender 残存なし)"
fi
# 仕様準拠の検証（あ.md記載のまま）も表示
echo "--- 仕様準拠検証 (grep -rn onrender --include=*.html) ---"
if grep -rn "milli-games.onrender.com" --include="*.html" . 2>/dev/null | grep -v "APPLY_CLOUDFLARE_MIGRATION.sh" | grep -v "OLD_BASE" | grep -q .; then
  echo "NG: まだ残っています"
else
  echo "OK: 置換完了"
fi

if grep -q "NEW_BASE" index.html; then
  echo "OK: リダイレクトJSあり"
else
  echo "NG: リダイレクトJSなし"
fi

if grep -q "移行しました" index.html; then
  echo "OK: 黄色バナーあり"
else
  echo "NG: 黄色バナーなし"
fi

echo ""
echo "注意: _redirects は作成しません（Pagesで無限ループ防止）"
