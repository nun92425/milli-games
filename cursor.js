/* ============================================
   Milli Games - カスタムカーソル JS
   移植元: milli-unishare-preview js/video.js + js/storage.js
   32px .cur 対応、完成5種のみ有効
   ============================================ */
"use strict";
(function () {
  var CURSOR_KEY = "milpro_cursor";

  // 完成5種のみ。残り6種は将来追加（コメントアウトを解除してCSSも有効化）
  var CURSOR_TALENTS = [
    { id: "mahoro", name: "鹿乃まほろ" },
    { id: "rako",   name: "音ノ瀬らこ" },
    { id: "yura",   name: "ゆらぎゆら" },
    { id: "rei",    name: "夕霧レイ" },
    { id: "nuhu",   name: "虹深°ぬふ" }
    // 未完成（今は無効）
    // { id: "konomi", name: "こま" }, // 例: 正式名に置換
    // { id: "nono", name: "—" },
    // { id: "akubi", name: "—" },
    // { id: "koma", name: "—" },
    // { id: "rizu", name: "—" },
    // { id: "tsukuri", name: "—" },
  ];

  function isGamesPage() {
    return location.pathname.indexOf("/games/") !== -1;
  }
  function cursorBase() {
    // JSで生成する <img src> はHTML基準で解決されるため games/ では ../ が必要
    return isGamesPage() ? "../images/cursors/" : "images/cursors/";
  }
  function cursorBaseAlt() {
    // 将来 talent-icons を用意した場合の優先パス
    return isGamesPage() ? "../images/cursors/talent-icons/" : "images/cursors/talent-icons/";
  }

  function getCursorSettings() {
    try { return JSON.parse(localStorage.getItem(CURSOR_KEY) || "null"); } catch (e) { return null; }
  }
  function saveCursorSettings(s) {
    try { localStorage.setItem(CURSOR_KEY, JSON.stringify(s)); } catch (e) {}
  }
  function initCursorSettings() {
    var existing = getCursorSettings();
    if (existing && typeof existing === "object" && "enabled" in existing) return existing;
    var s = { enabled: false, talentId: "default" };
    saveCursorSettings(s);
    return s;
  }

  function applyCursor(s) {
    var html = document.documentElement;
    // 既存カーソルクラスを全除去
    for (var i = html.classList.length - 1; i >= 0; i--) {
      var c = html.classList[i];
      if (c === "cursor-custom" || c.indexOf("cursor-") === 0) html.classList.remove(c);
    }
    if (!s || !s.enabled) {
      // OFF
    } else {
      html.classList.add("cursor-custom");
      var id = (s.talentId && s.talentId !== "default") ? s.talentId : "";
      if (id) html.classList.add("cursor-" + id);
    }
    // ヘッダーUI更新
    try { updateTopBarUI(s); } catch (e) {}
    try { updateMenuUI(s); } catch (e) {}
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // ── ヘッダー（#cursorTopWrap / #cursorTopBtn / #cursorDropdown） ──
  function updateTopBarUI(s) {
    var label = document.getElementById("cursorTopLabel");
    var preview = document.getElementById("cursorTopPreview");
    var btn = document.getElementById("cursorTopBtn");
    var talent = null;
    if (s && s.enabled && s.talentId && s.talentId !== "default") {
      for (var i = 0; i < CURSOR_TALENTS.length; i++) if (CURSOR_TALENTS[i].id === s.talentId) { talent = CURSOR_TALENTS[i]; break; }
    }
    if (label) {
      if (!s || !s.enabled) label.textContent = "カーソルOFF";
      else if (talent) label.textContent = talent.name;
      else if (s.talentId === "default") label.textContent = "デフォルト";
      else label.textContent = "カーソル";
    }
    if (preview) {
      if (s && s.enabled && talent) {
        // 将来 talent-icons があればそちらを優先、なければ cursors/{id}.png
        preview.style.backgroundImage = "url('" + cursorBase() + s.talentId + ".png')";
        preview.style.backgroundSize = "cover";
        preview.style.backgroundColor = "#fff";
        preview.style.backgroundPosition = "center";
      } else if (s && s.enabled && s.talentId === "default") {
        preview.style.backgroundImage = "url('" + cursorBase() + "default.png')";
        preview.style.backgroundSize = "cover";
        preview.style.backgroundColor = "#fff";
      } else {
        preview.style.backgroundImage = "";
        preview.style.backgroundColor = "#8582fb";
      }
    }
    if (btn) btn.style.opacity = s && s.enabled ? "1" : "0.75";
    // ドロップダウンの active 更新
    var items = document.querySelectorAll(".cursor-dropdown-item");
    for (var j = 0; j < items.length; j++) {
      var el = items[j];
      var id = el.getAttribute("data-id");
      var curId = !s || !s.enabled ? "__off" : (s.talentId || "default");
      el.classList.toggle("active", id === curId);
    }
    // ハンバーガー側も同期
    var mItems = document.querySelectorAll(".menu-cursor-item");
    for (var k = 0; k < mItems.length; k++) {
      var me = mItems[k];
      var mid = me.getAttribute("data-id");
      var mcur = !s || !s.enabled ? "__off" : (s.talentId || "default");
      me.classList.toggle("active", mid === mcur);
    }
  }

  function renderDropdown() {
    var dd = document.getElementById("cursorDropdown");
    if (!dd) return;
    var cur = getCursorSettings() || { enabled: false, talentId: "default" };
    var base = cursorBase();
    var items = [];
    var offActive = !cur.enabled ? " active" : "";
    items.push(
      '<button class="cursor-dropdown-item' + offActive + '" data-id="__off" role="menuitem">' +
      '<span style="width:28px;height:28px;border-radius:50%;background:#eee;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">\uD83D\uDEAB</span>' +
      '<span>OFF（標準）</span>' +
      '<span class="check">\u2713</span></button>'
    );
    var defActive = cur.enabled && cur.talentId === "default" ? " active" : "";
    items.push(
      '<button class="cursor-dropdown-item' + defActive + '" data-id="default" role="menuitem">' +
      '<img src="' + base + 'default.png" alt="" onerror="this.style.display=\'none\'">' +
      '<span>デフォルト</span><span class="check">\u2713</span></button>'
    );
    for (var i = 0; i < CURSOR_TALENTS.length; i++) {
      var m = CURSOR_TALENTS[i];
      var active = cur.enabled && cur.talentId === m.id ? " active" : "";
      // タレントアイコン: 将来用に talent-icons を優先、なければ cursors/{id}.png
      var icon = base + m.id + ".png";
      items.push(
        '<button class="cursor-dropdown-item' + active + '" data-id="' + escapeHtml(m.id) + '" role="menuitem">' +
        '<img src="' + icon + '" alt="" onerror="this.src=\'' + base + 'default.png\'">' +
        '<span>' + escapeHtml(m.name) + '</span><span class="check">\u2713</span></button>'
      );
    }
    dd.innerHTML = items.join("");
    dd.querySelectorAll(".cursor-dropdown-item").forEach(function (el) {
      el.addEventListener("click", function () {
        var id = el.getAttribute("data-id");
        var s;
        if (id === "__off") s = { enabled: false, talentId: "default" };
        else s = { enabled: true, talentId: id };
        saveCursorSettings(s);
        applyCursor(s);
        dd.classList.remove("open");
        var btn = document.getElementById("cursorTopBtn");
        if (btn) btn.setAttribute("aria-expanded", "false");
        dd.setAttribute("aria-hidden", "true");
        renderDropdown();
        renderMenuList();
      });
    });
  }

  function initCursorTopBar() {
    var wrap = document.getElementById("cursorTopWrap");
    var btn = document.getElementById("cursorTopBtn");
    var dd = document.getElementById("cursorDropdown");
    if (!wrap || !btn || !dd) return;
    // preview と同様: JSロード後に表示（CSSの @media でPCのみ表示）
    wrap.style.display = "";
    renderDropdown();
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = dd.classList.contains("open");
      dd.classList.toggle("open", !open);
      btn.setAttribute("aria-expanded", String(!open));
      dd.setAttribute("aria-hidden", String(open));
      if (!open) renderDropdown();
    });
    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) {
        dd.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        dd.setAttribute("aria-hidden", "true");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        dd.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        dd.setAttribute("aria-hidden", "true");
      }
    });
    // 初期UI反映
    applyCursor(getCursorSettings());
  }

  // ── ハンバーガーメニュー内フォールバック ──
  function renderMenuList() {
    var panel = document.getElementById("menuCursorList");
    if (!panel) return;
    var cur = getCursorSettings() || { enabled: false, talentId: "default" };
    var base = cursorBase();
    var html = "";
    var items = [{ id: "__off", name: "OFF（標準）", icon: null }].concat(
      [{ id: "default", name: "デフォルト", icon: base + "default.png" }],
      CURSOR_TALENTS.map(function (m) { return { id: m.id, name: m.name, icon: base + m.id + ".png" }; })
    );
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var curId = !cur.enabled ? "__off" : (cur.talentId || "default");
      var active = it.id === curId ? " active" : "";
      var iconHtml = it.icon
        ? '<img src="' + it.icon + '" alt="" onerror="this.src=\'' + base + 'default.png\'">'
        : '<span style="width:28px;height:28px;border-radius:50%;background:#eee;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">\uD83D\uDEAB</span>';
      html += '<button class="menu-cursor-item' + active + '" data-id="' + escapeHtml(it.id) + '">' + iconHtml + '<span>' + escapeHtml(it.name) + '</span><span class="check">\u2713</span></button>';
    }
    panel.innerHTML = html;
    panel.querySelectorAll(".menu-cursor-item").forEach(function (el) {
      el.addEventListener("click", function () {
        var id = el.getAttribute("data-id");
        var s = id === "__off" ? { enabled: false, talentId: "default" } : { enabled: true, talentId: id };
        saveCursorSettings(s);
        applyCursor(s);
        renderMenuList();
        renderDropdown();
      });
    });
  }

  function updateMenuUI(s) {
    // applyCursor から呼ばれる。renderではなくactive切替のみでも良いが再描画の方が確実
    // ここでは軽量に active 切替のみ（renderMenuListは既に呼んでいる場合の差分）
    var panel = document.getElementById("menuCursorList");
    if (!panel || !panel.children.length) return;
    var curId = !s || !s.enabled ? "__off" : (s.talentId || "default");
    panel.querySelectorAll(".menu-cursor-item").forEach(function (el) {
      el.classList.toggle("active", el.getAttribute("data-id") === curId);
    });
  }

  function initMenuCursor() {
    var sec = document.getElementById("menuCursorSection");
    var panel = document.getElementById("menuCursorList");
    if (!sec || !panel) return;
    renderMenuList();

    function isPointerFine() {
      try { return window.matchMedia("(pointer: fine)").matches; } catch (e) { return false; }
    }
    function updateVisibility() {
      // PC (>=768): ヘッダー側が見えるのでハンバーガー側は非表示
      // モバイル: ポインタがfine(マウス)なら表示、そうでなければ一旦非表示→ mousemoveで表示
      if (window.innerWidth >= 768) {
        sec.style.display = "none";
        return;
      }
      if (isPointerFine()) {
        sec.style.display = "";
      } else {
        sec.style.display = "none";
        // マウスが動き始めたら表示（タブレット+マウスのケース）
        var once = function () {
          if (isPointerFine()) sec.style.display = "";
          window.removeEventListener("mousemove", once);
        };
        window.removeEventListener("mousemove", once);
        window.addEventListener("mousemove", once, { once: true });
        // pointer media変更でも追従
        try {
          window.matchMedia("(pointer: fine)").addEventListener("change", function (e) {
            if (e.matches && window.innerWidth < 768) sec.style.display = "";
            else if (!e.matches && window.innerWidth < 768) sec.style.display = "none";
          });
        } catch (e2) {}
      }
    }
    updateVisibility();
    window.addEventListener("resize", updateVisibility);
    try {
      window.matchMedia("(pointer: fine)").addEventListener("change", updateVisibility);
    } catch (e) {}
  }

  // ── ゲームページ用: ヘッダーにカーソルボタンを自動注入（静的HTMLがない場合のフォールバック） ──
  function ensureGameHeader() {
    // index.html は静的HTMLを持つので何もしない。games/*.html で #top-bar があるが #cursorTopWrap がない場合に注入
    if (document.getElementById("cursorTopWrap")) return;
    var topBar = document.getElementById("top-bar");
    if (!topBar) return;
    // games の header は flexでロゴのみ。右側にwrapを入れる
    // topBar 自体が flex, justify-content がない場合があるので右寄せ用にスタイルを調整
    topBar.style.justifyContent = "space-between";
    var wrap = document.createElement("div");
    wrap.className = "cursor-top-wrap";
    wrap.id = "cursorTopWrap";
    wrap.style.display = "none";
    wrap.innerHTML =
      '<button id="cursorTopBtn" class="cursor-top-btn" aria-label="カーソル選択" aria-expanded="false" aria-haspopup="true">' +
      '<span class="cursor-top-preview" id="cursorTopPreview"></span>' +
      '<span id="cursorTopLabel">カーソル</span>' +
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.6"><path d="M6 9l6 6 6-6"/></svg>' +
      '</button>' +
      '<div id="cursorDropdown" class="cursor-dropdown" role="menu" aria-hidden="true"></div>';
    topBar.appendChild(wrap);
  }

  // ── 初期化 ──
  function init() {
    try { ensureGameHeader(); } catch (e) {}
    try {
      var s = initCursorSettings();
      applyCursor(s);
    } catch (e) {}
    try { initCursorTopBar(); } catch (e) { console.warn("cursor topbar init failed", e); }
    try { initMenuCursor(); } catch (e) { console.warn("cursor menu init failed", e); }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  // games/*.html で DOMContentLoaded 後に top-bar が遅れて生成されるケースに備えて再試行
  window.addEventListener("load", function () {
    try { ensureGameHeader(); initCursorTopBar(); } catch (e) {}
  });

  // グローバル公開（デバッグ用）
  window.CursorApp = {
    get: getCursorSettings,
    save: saveCursorSettings,
    apply: applyCursor
  };
})();
