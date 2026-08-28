/* ============================================
   Milli Games - メインスクリプト
   ============================================ */
"use strict";

// ============================================
// サイトタイプ設定
//   "demo"    : ポイント/EXPを非表示（獲得ポイント未実装の状態）
//   "complete": ポイント/EXPを全て表示（完全版）
// ============================================
const SITE_TYPE = "demo";
const VERSION = "Ver.2.0";
document.addEventListener("DOMContentLoaded", function() {
  var vb = document.getElementById("version-badge");
  if (vb) vb.textContent = VERSION;
});

// ============================================
// UA通知
// ============================================
var deferredPrompt = null;
window.addEventListener("beforeinstallprompt", function (e) {
  e.preventDefault();
  deferredPrompt = e;
});

(function () {
  // スタンドアロン（ホーム画面追加済み/PWA起動）なら何もしない
  if (window.navigator.standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches) {
    return;
  }

  var ua = navigator.userAgent;
  var isMobile = /Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  var isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  var isWide = window.innerWidth >= 1024;
  var isPC = !isMobile && (!isTouch || isWide);

  // アプリ内ブラウザ判定
  var inApp = null;
  if (/Twitter for (iPhone|Android)/i.test(ua)) {
    inApp = "twitter";
  } else if (/LINE\//i.test(ua)) {
    inApp = "line";
  } else if (/Instagram/i.test(ua)) {
    inApp = "instagram";
  }

  var overlay = document.getElementById("ua-overlay");
  var titleEl = document.getElementById("ua-title");
  var bodyEl = document.getElementById("ua-body");
  var closeBtn = document.getElementById("ua-close");

  if (!overlay) return;

  function show(title, html, blocking) {
    titleEl.textContent = title;
    bodyEl.innerHTML = html;
    overlay.classList.remove("ua-hidden");
    if (blocking) {
      overlay.classList.add("ua-blocking");
    } else {
      overlay.classList.remove("ua-blocking");
    }
  }

  function dismiss() {
    overlay.classList.add("ua-hidden");
    localStorage.setItem("milli_ua_notified", "1");
  }

  // 閉じる/背景クリック
  closeBtn.addEventListener("click", dismiss);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay && !overlay.classList.contains("ua-blocking")) {
      dismiss();
    }
  });

  // アプリ内ブラウザ（閉じられない）
  if (inApp) {
    var msgs = {
      twitter: {
        title: "ブラウザで開いてください",
        html: "Xアプリ内で閲覧しています。<br>" +
              "画面下部中央の<span style=\"font-weight:700\">︙</span>から" +
              "<strong>「ブラウザで開く」</strong>を選んでください。"
      },
      line: {
        title: "ブラウザで開いてください",
        html: "LINEアプリ内で閲覧しています。<br>" +
              "右下の<span style=\"font-weight:700\">︙</span>から" +
              "<strong>「ブラウザで開く」</strong>を選んでください。"
      },
      instagram: {
        title: "ブラウザで開いてください",
        html: "Instagramアプリ内で閲覧しています。<br>" +
              "画面右上の<span style=\"font-weight:700\">⋯</span>から" +
              "<strong>「外部ブラウザを選んでください」</strong>。"
      }
    };
    var msg = msgs[inApp];
    show(msg.title, msg.html, true);
    return;
  }

  // 既に閉じたことがあるならスキップ
  if (localStorage.getItem("milli_ua_notified")) return;

  // PC
  if (isPC) {
    show(
      "より快適にプレイするには",
      '<p style="margin:0 0 12px;font-size:0.85rem">全画面表示またはアプリとしてインストールすると、より快適にご利用いただけます。</p>' +
      '<div class="ua-actions">' +
        '<button id="ua-btn-fs" class="ua-btn">全画面表示</button>' +
        '<button id="ua-btn-install" class="ua-btn ua-btn-primary">インストール</button>' +
      '</div>',
      false
    );

    document.getElementById("ua-btn-fs").addEventListener("click", function () {
      var el = document.documentElement;
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(function () {});
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }
      dismiss();
    });

    document.getElementById("ua-btn-install").addEventListener("click", function () {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function () { deferredPrompt = null; });
        dismiss();
      } else {
        var note = document.createElement("p");
        note.style.cssText = "margin:8px 0 0;font-size:0.75rem;color:rgba(45,27,78,0.4);text-align:center";
        note.textContent = "このブラウザではインストールに対応していません。メニューから「インストール」をお試しください。";
        document.getElementById("ua-btn-install").after(note);
      }
    });
    return;
  }

  // スマホ 通常ブラウザ（iOS ChromeはCriOSで判別）
  var isSafari = /Safari/i.test(ua) && !/Chrome|CriOS|Edg\/|EdgiOS/i.test(ua);
  var isChrome = /Chrome|CriOS/i.test(ua) && !/Edg\/|EdgiOS/i.test(ua);
  var isEdge = /Edg\/|EdgiOS/i.test(ua);

  var steps = "";
  if (isSafari) {
    steps =
      '<span class="ua-step">1. 下部の<span style="font-weight:700">共有ボタン</span>をタップ</span>' +
      '<span class="ua-step">2. <strong>「ホーム画面に追加」</strong>を選択</span>';
  } else if (isChrome) {
    steps =
      '<span class="ua-step">1. 右上の<span style="font-weight:700">メニュー</span>（︙）をタップ</span>' +
      '<span class="ua-step">2. <strong>「ホーム画面に追加」</strong>を選択</span>';
  } else if (isEdge) {
    steps =
      '<span class="ua-step">1. 右下の<span style="font-weight:700">メニュー</span>をタップ</span>' +
      '<span class="ua-step">2. <strong>「スマホにインストール」</strong>を選択</span>';
  } else {
    steps =
      '<span class="ua-step">ブラウザのメニューから<strong>「ホーム画面に追加」</strong>をお試しください</span>';
  }

  show(
    "ホーム画面に追加をおすすめします",
    steps + "<br>ホーム画面に追加すると、アプリのようにすばやくアクセスできます。",
    false
  );
})();
const games = [
  {
    id: 8,
    title: "Milli Pulse",
    description: "ミリプロの音楽を、リズムに乗せて楽しもう。\n\nお気に入りの楽曲をプレイして、最高スコアを目指そう。\n刻んだリズムと積み重ねたスコアが、あなたの「推し活」の記録になる。\n\n音楽を聴く。\nリズムを刻む。\n推しへの想いを、Pulseに。",
    image: "images/games/icon/Milli Pulse -icon.png",
    points: 150,
    exp: "x1.3",
    tags: ["おすすめ", "新着"],
    link: "games/music.html"
  },
  {
    id: 3,
    title: "Milli Spectrum",
    description: "20の質問で、あなたの中にあるミリプロの色を見つけよう。",
    image: "images/games/icon/Milli Spectrum-icon.png",
    points: 0,
    exp: "-",
    tags: ["診断", "新着"],
    link: "games/diagnosis.html"
  },
  {
    id: 4,
    title: "Milli Choice",
    description: "音ノ乃ののの曲に合わせて二択クイズに即答せよ！\n\n曲のリズムに乗せて表示されるミリプロクイズ。\n制限時間内に正解してコンボを繋げ！\n\n速さと正確さ、どちらも求められる新感覚クイズゲーム。",
    image: "images/games/icon/Milli Choice-icon.png",
    points: 100,
    exp: "x1.2",
    tags: ["おすすめ", "新着"],
    link: "games/dotchi.html"
  },
  {
    id: 2,
    title: "Millipro 2048",
    description: "数字を合わせて2048を目指せ！\n\nミリプロデザインの2048パズル。\nスワイプでタイルを移動して、同じ数字を重ねて大きい数字を作ろう。\n\nシンプルだけど奥が深い、定番パズルゲーム。",
    image: "images/games/icon/Millipro 2048-icon.png",
    points: 50,
    exp: "x1.0",
    tags: ["パズル"],
    link: "games/2048.html"
  }
];

// お知らせデータ
const newsData = [];

// ============================================
// DOM参照（最小限）
// ============================================
const el = {
  track: document.getElementById("carousel-track"),
  container: document.getElementById("carousel-container"),
  indicators: document.getElementById("carousel-indicators"),
  prevBtn: document.getElementById("carousel-prev"),
  nextBtn: document.getElementById("carousel-next"),
  sideMenu: document.getElementById("side-menu"),
  menuOverlay: document.getElementById("menu-overlay"),
  menuBtn: document.getElementById("menu-btn"),
  closeMenuBtn: document.getElementById("close-menu"),
  volumeSlider: document.getElementById("volume-slider"),
  volumeLabel: document.getElementById("volume-label"),
  homeView: document.getElementById("home-view"),
  allGamesView: document.getElementById("all-games-view"),
  allGamesBtn: document.getElementById("all-games-btn"),
  allGamesList: document.getElementById("all-games-list"),
  allGamesFilters: document.getElementById("all-games-filters"),
  popupOverlay: document.getElementById("popup-overlay"),
  popupClose: document.getElementById("popup-close"),
  popupTitle: document.getElementById("popup-title"),
  popupBody: document.getElementById("popup-body"),
  menuPopupBtns: document.querySelectorAll(".menu-popup-btn"),
  profileBtn: document.getElementById("profile-btn"),
};

// ============================================
// 状態
// ============================================
const state = {
  currentIndex: 0,
  allGamesFilter: "すべて",
  isDragging: false,
  startX: 0,
  startY: 0,
  currentTranslate: 0,
  previousTranslate: 0,
  lastMoveX: 0,
  lastMoveTime: 0,
  velocity: 0,
  autoPlayTimer: null,
  isTransitioning: false,
  isPaused: false
};

// ============================================
// 表示するゲームを取得（フィルター）
// ============================================
function getFilteredGames() {
  return games;
}

// ============================================
// カードHTMLを生成
// ============================================
function createCardHTML(game) {
  var btnHtml = game.link
    ? '<a href="' + game.link + '" class="card-btn">ゲームスタート</a>'
    : '<button class="card-btn coming-soon" disabled>準備中</button>';

  var badgeHtml = game.comingSoon
    ? '<div class="card-badge coming-soon-badge">準備中</div>'
    : "";

  var pointsHtml = "";
  var expHtml = "";
  if (SITE_TYPE === "complete") {
    pointsHtml = game.comingSoon ? "???" : game.points + "pt";
    expHtml = game.comingSoon ? "???" : "EXP " + game.exp;
  }

  return (
    '<div class="game-card">' +
      '<div class="card-image">' +
        '<img src="' + game.image + '" alt="' + game.title + '" loading="lazy">' +
        '<div class="card-reflection"></div>' +
        badgeHtml +
      "</div>" +
      '<div class="card-body">' +
        '<h3 class="card-title">' + game.title + "</h3>" +
        '<p class="card-description">' + game.description + "</p>" +
      "</div>" +
      '<div class="card-footer">' +
        (SITE_TYPE === "complete"
          ? '<div class="card-stats">' +
            '<span class="card-points">' + pointsHtml + "</span>" +
            '<span class="card-exp">' + expHtml + "</span>" +
          "</div>"
          : "") +
        btnHtml +
      "</div>" +
    "</div>"
  );
}

// ============================================
// カードを生成してトラックに追加
// ============================================
function generateCards() {
  var filtered = getFilteredGames();
  var html = "";

  for (var i = 0; i < filtered.length; i++) {
    html += createCardHTML(filtered[i]);
  }

  el.track.innerHTML = html;

  // 無限ループ用に最初と最後のカードをクローン
  var cards = el.track.children;
  if (cards.length > 1) {
    var firstClone = cards[0].cloneNode(true);
    var lastClone = cards[cards.length - 1].cloneNode(true);
    el.track.appendChild(firstClone);
    el.track.insertBefore(lastClone, cards[0]);
  }

  // カード枚数に応じて矢印の表示制御
  var total = filtered.length;
  if (total <= 1) {
    el.prevBtn.classList.remove("visible");
    el.nextBtn.classList.remove("visible");
    stopAutoPlay();
  } else {
    el.prevBtn.classList.add("visible");
    el.nextBtn.classList.add("visible");
  }
}

// ============================================
// カルーセルのサイズ情報を取得（CSSと同期）
// ============================================
function getCardSpecs() {
  var containerWidth = el.container.offsetWidth;
  var gap = 16;
  var w = window.innerWidth;
  var ratio;
  if (w < 768) ratio = 0.85;
  else if (w < 1024) ratio = 0.70;
  else if (w < 1280) ratio = 0.50;
  else ratio = 0.42;
  var cardWidth = containerWidth * ratio;
  return {
    containerWidth: containerWidth,
    cardWidth: cardWidth,
    gap: gap,
    cardOffset: cardWidth + gap
  };
}

// ============================================
// トラックのtransform値を取得
// ============================================
function getTranslateX() {
  var transform = window.getComputedStyle(el.track).transform;
  if (transform === "none") return 0;
  var match = transform.match(/matrix(?:3d)?\((.+)\)/);
  if (!match) return 0;
  var values = match[1].split(/,\s*/);
  var tx = values.length === 6 ? parseFloat(values[4]) : parseFloat(values[12]);
  return tx || 0;
}

// ============================================
// カルーセルを更新
// ============================================
function updateCarousel(index, animate) {
  var filtered = getFilteredGames();
  if (filtered.length === 0) return;

  var cloneOffset = 1;
  var realIndex = index + cloneOffset;
  var specs = getCardSpecs();
  var translateX = (specs.containerWidth - specs.cardWidth) / 2 - realIndex * specs.cardOffset;

  if (!animate) {
    el.track.style.transition = "none";
  } else {
    el.track.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
  }

  el.track.style.transform = "translateX(" + translateX + "px)";
  state.currentTranslate = translateX;
  state.previousTranslate = translateX;

  // アクティブカードを設定
  var cards = el.track.querySelectorAll(".game-card");
  for (var i = 0; i < cards.length; i++) {
    if (i === realIndex) {
      cards[i].classList.add("active");
    } else {
      cards[i].classList.remove("active");
    }
  }

  updateIndicators(index);
  state.currentIndex = index;
}

// ============================================
// インジケーター（ドット）を更新
// ============================================
function updateIndicators(index) {
  var filtered = getFilteredGames();
  var html = "";
  for (var i = 0; i < filtered.length; i++) {
    html +=
      '<button class="carousel-dot' +
      (i === index ? " active" : "") +
      '" data-slide="' +
      i +
      '" aria-label="' +
      (i + 1) +
      "枚目\"></button>";
  }
  el.indicators.innerHTML = html;
}

// ============================================
// 無限ループ処理
// ============================================
function handleInfiniteLoop() {
  var filtered = getFilteredGames();
  if (filtered.length <= 1) return;

  var total = filtered.length;

  if (state.currentIndex < 0) {
    el.track.style.transition = "none";
    state.currentIndex = total - 1;
    updateCarousel(state.currentIndex, false);
  } else if (state.currentIndex >= total) {
    el.track.style.transition = "none";
    state.currentIndex = 0;
    updateCarousel(state.currentIndex, false);
  }

  // 強制再描画
  void el.track.offsetHeight;
}

// ============================================
// ナビゲーション
// ============================================
function goToPrev() {
  if (state.isTransitioning) return;
  state.isTransitioning = true;
  state.currentIndex--;
  updateCarousel(state.currentIndex, true);
  setTimeout(function () {
    handleInfiniteLoop();
    state.isTransitioning = false;
  }, 500);
}

function goToNext() {
  if (state.isTransitioning) return;
  state.isTransitioning = true;
  state.currentIndex++;
  updateCarousel(state.currentIndex, true);
  setTimeout(function () {
    handleInfiniteLoop();
    state.isTransitioning = false;
  }, 500);
}

function goToSlide(index) {
  if (state.isTransitioning) return;
  state.isTransitioning = true;
  state.currentIndex = index;
  updateCarousel(index, true);
  setTimeout(function () {
    state.isTransitioning = false;
  }, 500);
}

// ============================================
// 一番近いカードにスナップ
// ============================================
function snapToNearest() {
  var specs = getCardSpecs();
  var translate = getTranslateX();
  var filtered = getFilteredGames();
  var total = filtered.length;
  var cloneOffset = 1;

  var naturalCenter = (specs.containerWidth - specs.cardWidth) / 2;
  var rawPosition = (naturalCenter - translate) / specs.cardOffset;
  var nearestPosition = Math.round(rawPosition);
  var constrainedPos = Math.max(0, Math.min(nearestPosition, total + 1));

  var newTranslate = naturalCenter - constrainedPos * specs.cardOffset;

  el.track.style.transition = "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
  el.track.style.transform = "translateX(" + newTranslate + "px)";
  state.currentTranslate = newTranslate;
  state.previousTranslate = newTranslate;

  // UI更新
  var realIndex = constrainedPos - cloneOffset;
  state.currentIndex = Math.max(0, Math.min(realIndex, total - 1));
  updateIndicators(state.currentIndex);

  // アクティブカード
  var cards = el.track.querySelectorAll(".game-card");
  for (var i = 0; i < cards.length; i++) {
    if (i === constrainedPos) {
      cards[i].classList.add("active");
    } else {
      cards[i].classList.remove("active");
    }
  }

  // アニメーション完了後
  setTimeout(function () {
    if (constrainedPos <= 0 || constrainedPos >= total + 1) {
      handleInfiniteLoop();
    }
  }, 400);

  // 自動再生（3秒後に再開）
  setTimeout(startAutoPlay, 3000);
}

// ============================================
// 慣性スクロール
// ============================================
function applyInertia() {
  var friction = 0.95;
  var v = state.velocity;
  var translate = getTranslateX();
  var frameCount = 0;

  function step() {
    v *= friction;
    translate += v * 16;
    frameCount++;

    if (Math.abs(v) < 0.5 || frameCount > 60) {
      el.track.style.transition = "none";
      el.track.style.transform = "translateX(" + translate + "px)";
      state.currentTranslate = translate;
      snapToNearest();
      return;
    }

    el.track.style.transition = "none";
    el.track.style.transform = "translateX(" + translate + "px)";
    state.currentTranslate = translate;

    requestAnimationFrame(step);
  }

  step();
}

// ============================================
// ドラッグ操作
// ============================================
function handleDragStart(clientX, clientY) {
  if (state.isTransitioning) return;
  state.isDragging = true;
  state.isPaused = true;
  stopAutoPlay();
  el.track.classList.add("dragging");

  state.startX = clientX;
  state.startY = clientY;
  state.lastMoveX = clientX;
  state.lastMoveTime = Date.now();
  state.velocity = 0;
  state.previousTranslate = getTranslateX();

  el.track.style.transition = "none";
}

function handleDragMove(clientX) {
  if (!state.isDragging) return;

  var deltaX = clientX - state.startX;
  var newTranslate = state.previousTranslate + deltaX;

  // 速度計算
  var now = Date.now();
  var dt = now - state.lastMoveTime;
  if (dt > 0) {
    state.velocity = (clientX - state.lastMoveX) / dt;
  }
  state.lastMoveX = clientX;
  state.lastMoveTime = now;

  state.currentTranslate = newTranslate;
  el.track.style.transform = "translateX(" + newTranslate + "px)";
}

function handleDragEnd() {
  if (!state.isDragging) return;
  state.isDragging = false;
  state.isPaused = false;
  el.track.classList.remove("dragging");

  if (Math.abs(state.velocity) > 0.3) {
    applyInertia();
  } else {
    snapToNearest();
  }
}

// ============================================
// 自動再生
// ============================================
function startAutoPlay() {
  stopAutoPlay();
  if (getFilteredGames().length <= 1) return;
  if (state.isPaused) return;

  state.autoPlayTimer = setInterval(function () {
    if (!state.isDragging && !state.isPaused) {
      state.currentIndex++;
      updateCarousel(state.currentIndex, true);
      setTimeout(function () {
        handleInfiniteLoop();
      }, 500);
    }
  }, 4000);
}

function stopAutoPlay() {
  if (state.autoPlayTimer) {
    clearInterval(state.autoPlayTimer);
    state.autoPlayTimer = null;
  }
}

// ============================================
// メニュー開閉
// ============================================
function openMenu() {
  el.sideMenu.classList.add("open");
  el.menuOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  el.sideMenu.classList.remove("open");
  el.menuOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

// ============================================
// 音量設定
// ============================================
function setupVolume() {
  // 保存された音量を復元
  var saved = localStorage.getItem("milli-volume");
  if (saved !== null) {
    el.volumeSlider.value = saved;
    el.volumeLabel.textContent = saved + "%";
  }

  el.volumeSlider.addEventListener("input", function () {
    var val = el.volumeSlider.value;
    el.volumeLabel.textContent = val + "%";
    localStorage.setItem("milli-volume", val);
  });
}

// ============================================
// サイドパネル・メニュー内容を生成
// ============================================
function generateSideContent() {
  // サイドパネルのお知らせ
  var newsPanel = document.querySelector("#news-panel .panel-content");
  if (newsPanel) {
    if (newsData.length > 0) {
      var html = "";
      for (var i = 0; i < newsData.length; i++) {
        html +=
          '<div class="news-item">' +
          '<span class="news-date">' + newsData[i].date + "</span>" +
          '<span class="news-text">' + newsData[i].text + "</span>" +
          "</div>";
      }
      newsPanel.innerHTML = html;
    } else {
      newsPanel.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 12px;">お知らせはありません</p>';
    }
  }

  // 最近追加
  var recentPanel = document.querySelector("#recent-panel .panel-content");
  if (recentPanel) {
    var html = "";
    for (var i = 0; i < games.length; i++) {
      html +=
        '<div class="recent-item">' +
        '<span class="recent-title">' + games[i].title + "</span>" +
        "</div>";
    }
    recentPanel.innerHTML = html;
  }
}

// ============================================
// イベント登録
// ============================================

// タッチイベント（カルーセル）
el.track.addEventListener("touchstart", function (e) {
  // リンクやボタン上でのタッチはドラッグ処理をスキップ
  if (e.target.closest("a") || e.target.closest(".card-btn")) return;
  state.startY = e.touches[0].clientY;
  handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

el.track.addEventListener("touchmove", function (e) {
  var deltaY = Math.abs(e.touches[0].clientY - state.startY);
  var deltaX = Math.abs(e.touches[0].clientX - state.startX);
  if (state.isDragging && deltaX > deltaY) {
    e.preventDefault();
    handleDragMove(e.touches[0].clientX);
  }
}, { passive: false });

el.track.addEventListener("touchend", function () {
  if (!state.isDragging) return;
  handleDragEnd();
});

// マウスイベント（カルーセル）
el.track.addEventListener("mousedown", function (e) {
  // リンクやボタン上でのクリックはドラッグ処理をスキップ
  if (e.target.closest("a") || e.target.closest(".card-btn")) return;
  handleDragStart(e.clientX, e.clientY);
  e.preventDefault();
});

document.addEventListener("mousemove", function (e) {
  handleDragMove(e.clientX);
});

document.addEventListener("mouseup", function () {
  handleDragEnd();
});

// カルーセル上でマウスリーブ時にドラッグ解除
document.addEventListener("mouseleave", function () {
  if (state.isDragging) {
    handleDragEnd();
  }
});

// 矢印ボタン
el.prevBtn.addEventListener("click", goToPrev);
el.nextBtn.addEventListener("click", goToNext);

// インジケーター（ドット）
el.indicators.addEventListener("click", function (e) {
  var dot = e.target.closest(".carousel-dot");
  if (dot) {
    var index = parseInt(dot.getAttribute("data-slide"));
    goToSlide(index);
  }
});

// 全ゲーム画面切り替え
function renderAllGamesTable() {
  var filter = state.allGamesFilter;
  var filtered = filter === "すべて"
    ? games
    : games.filter(function (g) { return g.tags.indexOf(filter) !== -1; });
  var html = "";
  for (var i = 0; i < filtered.length; i++) {
    html += createCardHTML(filtered[i]);
  }
  if (filtered.length === 0) {
    html = '<p style="color: var(--text-muted); text-align: center; padding: 24px;">該当するゲームがありません</p>';
  }
  el.allGamesList.innerHTML = html;
}

function showAllGames() {
  state.allGamesFilter = "すべて";
  el.homeView.style.display = "none";
  el.allGamesView.style.display = "block";
  el.allGamesBtn.textContent = "← ホームに戻る";
  stopAutoPlay();
  renderAllGamesTable();
  // フィルタータブをリセット
  var tabs = el.allGamesFilters.querySelectorAll(".filter-tab");
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove("active");
  tabs[0].classList.add("active");
}

function showHome() {
  el.homeView.style.display = "block";
  el.allGamesView.style.display = "none";
  el.allGamesBtn.textContent = "全てのゲーム ▾";
  startAutoPlay();
}

el.allGamesBtn.addEventListener("click", function () {
  if (el.allGamesView.style.display === "block") {
    showHome();
  } else {
    showAllGames();
  }
});

// 全てのゲーム内フィルタータブ
el.allGamesFilters.addEventListener("click", function (e) {
  var tab = e.target.closest(".filter-tab");
  if (!tab) return;
  var filter = tab.getAttribute("data-filter");
  if (filter === state.allGamesFilter) return;
  var tabs = el.allGamesFilters.querySelectorAll(".filter-tab");
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove("active");
  tab.classList.add("active");
  state.allGamesFilter = filter;
  renderAllGamesTable();
});

// 汎用ポップアップ
function openPopup(title, contentHtml) {
  el.popupTitle.textContent = title;
  el.popupBody.innerHTML = contentHtml;
  el.popupOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closePopup() {
  el.popupOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

el.popupClose.addEventListener("click", closePopup);
el.popupOverlay.addEventListener("click", function (e) {
  if (e.target === el.popupOverlay) closePopup();
});

// メニューポップアップボタン
for (var i = 0; i < el.menuPopupBtns.length; i++) {
  (function (btn) {
    btn.addEventListener("click", function () {
      var section = btn.getAttribute("data-section");
      var title = "";
      var content = "";
      if (section === "news") {
        title = "お知らせ";
        if (newsData.length > 0) {
          var html = "";
          for (var j = 0; j < newsData.length; j++) {
            html +=
              '<div class="news-item">' +
              '<span class="news-date">' + newsData[j].date + "</span>" +
              '<span class="news-text">' + newsData[j].text + "</span>" +
              "</div>";
          }
          content = html;
        } else {
          content = '<p style="color: var(--text-muted); text-align: center; padding: 12px;">お知らせはありません</p>';
        }
      } else if (section === "recent") {
        title = "ゲーム一覧";
        var html = "<h3 class=\"panel-title\">ゲーム一覧</h3>";
        for (var j = 0; j < games.length; j++) {
          html +=
            '<div class="recent-item">' +
            '<span class="recent-title">' + games[j].title + "</span>" +
            "</div>";
        }
        content = html;
      }
      closeMenu();
      setTimeout(function () { openPopup(title, content); }, 300);
    });
  })(el.menuPopupBtns[i]);
}

// クレジット
var creditBtn = document.getElementById("credit-btn");
if (creditBtn) {
  creditBtn.addEventListener("click", function () {
    var html = '<div class="credit-content">'
      + '<div class="credit-item"><span class="credit-label">制作者</span><span class="credit-value"><a href="https://x.com/SunSunmachi" target="_blank" rel="noopener">すんすん</a></span></div>'
      + '<div class="credit-item"><span class="credit-label">イラスト</span><span class="credit-value">すんすん<br>なこ 様</span></div>'
      + '<p class="credit-note">このゲームは一部にYouTubeの埋め込み機能を使用しています。</p>'
      + '<p class="credit-note">この作品はファンによる二次創作であり、著作権はMillion Productionに帰属します。</p>'
      + '<p class="credit-note disclaimer">Milli Gamesは今後もアップデートを予定しています！<br>ゲーム内の表現や診断結果などは、ミリプロのメンバー様や関係者の方々の実際の性格などを正確に表したものではありません。<br>あくまでファンによる創作としてお楽しみください。</p>'
      + '</div>';
    closeMenu();
    setTimeout(function () { openPopup("クレジット", html); }, 300);
  });
}

// メニュー
el.menuBtn.addEventListener("click", openMenu);
el.closeMenuBtn.addEventListener("click", closeMenu);
el.menuOverlay.addEventListener("click", closeMenu);

// インストールボタン（PCメニュー）
var installBtn = document.getElementById("menu-install-btn");
if (installBtn) {
  installBtn.addEventListener("click", function () {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function () { deferredPrompt = null; });
      closeMenu();
    } else {
      installBtn.textContent = "対応していません";
      installBtn.style.opacity = "0.5";
      setTimeout(function () {
        installBtn.textContent = "アプリとしてインストール";
        installBtn.style.opacity = "1";
      }, 2000);
    }
  });
}

// プロフィール（プレイ履歴）
if (el.profileBtn) {
  el.profileBtn.addEventListener("click", function () {
    var history = [];
    try { history = JSON.parse(localStorage.getItem('milliGames_history') || '[]'); } catch (e) {}

    var info = { pid: '', name: '', email: '' };
    if (typeof mpProfileInfo === 'function') { try { info = mpProfileInfo(); } catch (e) {} }
    var displayName = info.name || info.pid || 'ゲスト';
    var statusHtml = '';
    if (info.pid) {
      statusHtml = '連携ID: ' + info.pid;
      if (info.name) statusHtml += '<br>プレイヤー名: ' + info.name;
      if (info.email) statusHtml += '<br>' + info.email;
      statusHtml += '<br><span style="font-size:0.75rem;color:var(--text-muted)">※ 本アプリ・Milli Unishare と連携中</span>';
    } else {
      statusHtml = '未連携です<br><span style="font-size:0.75rem;color:var(--text-muted)">ログインまたは連携IDの設定で報酬を受け取れます</span>';
    }
    var commentHtml = '';
    if (info.comment) {
      commentHtml = '<div class="profile-comment">' + info.comment + '</div>';
    }
    var profileLabel = document.getElementById("profile-label");
    if (profileLabel) profileLabel.textContent = displayName;

    var avatarHtml = '<div class="profile-avatar">';
    if (typeof renderUserIcon === 'function') {
      try { avatarHtml += '<span id="profile-icon"></span>'; } catch (e) {}
    } else {
      avatarHtml += '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>';
    }
    avatarHtml += '</div>';

    var html = '<div class="profile-header">'
      + avatarHtml
      + '<div class="profile-info"><div class="profile-name">' + displayName + '</div>' + commentHtml + '<div class="profile-status">' + statusHtml + '</div></div>'
      + '</div>';

    if (history.length === 0) {
      html += '<p style="text-align:center;color:var(--text-muted);padding:24px 0;">まだプレイ履歴がありません<br>各ゲームをプレイするとここに表示されます</p>';
    } else {
      var gameNames = [];
      var gameMap = {};
      for (var i = 0; i < history.length; i++) {
        var g = history[i].game;
        if (!gameMap[g]) { gameMap[g] = true; gameNames.push(g); }
      }
      gameNames.sort();
      gameNames.unshift('すべて');

      var tabsHtml = '<div class="hist-tabs">';
      var panesHtml = '';
      for (var ti = 0; ti < gameNames.length; ti++) {
        var gn = gameNames[ti];
        var active = ti === 0 ? ' active' : '';
        tabsHtml += '<button class="hist-tab' + active + '" data-tab="' + ti + '">' + gn + '</button>';

        var entries = gn === 'すべて' ? history : history.filter(function(h) { return h.game === gn; });
        var listHtml = '<div class="hist-pane' + active + '" data-pane="' + ti + '">';
        for (var j = 0; j < entries.length; j++) {
          var h = entries[j];
          var d = new Date(h.date);
          var dateStr = d.getFullYear() + '/' + String(d.getMonth()+1).padStart(2,'0') + '/' + String(d.getDate()).padStart(2,'0') + ' ' + String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
          listHtml += '<div class="history-item">'
            + '<div class="history-date">' + dateStr + '</div>'
            + '<div class="history-game">' + h.game + '</div>'
            + (h.type ? '<div class="history-type">' + h.type + (h.name ? '（' + h.name + '）' : '') + '</div>' : '')
            + (h.score !== undefined ? '<div class="history-score">スコア: ' + h.score.toLocaleString() + '</div>' : '')
            + (h.matchPct !== undefined ? '<div class="history-match">一致度 ' + h.matchPct + '%</div>' : '')
            + (h.accuracy !== undefined ? '<div class="history-match">精度 ' + h.accuracy + '%</div>' : '')
            + (h.rank ? '<div class="history-rank">' + h.rank + '</div>' : '')
            + (h.clear !== undefined ? '<div class="history-rank">' + (h.clear ? 'クリア' : 'ゲームオーバー') + '</div>' : '')
            + '</div>';
        }
        listHtml += '</div>';
        panesHtml += listHtml;
      }
      tabsHtml += '</div>';

      html += '<div class="hist-container">' + tabsHtml + panesHtml + '</div>';
    }
    closeMenu();
    setTimeout(function () {
      openPopup('プレイ履歴', html);
      if (typeof renderUserIcon === 'function') {
        try { renderUserIcon(document.getElementById('profile-icon'), info); } catch (e) {}
      }
    }, 300);
  });
}

// タブ切り替え（イベント委譲）
document.addEventListener('click', function (e) {
  var tab = e.target.closest('.hist-tab');
  if (!tab) return;
  var paneId = tab.getAttribute('data-tab');
  document.querySelectorAll('.hist-tab').forEach(function(t) { t.classList.remove('active'); });
  document.querySelectorAll('.hist-pane').forEach(function(p) { p.classList.remove('active'); });
  tab.classList.add('active');
  var pane = document.querySelector('.hist-pane[data-pane="' + paneId + '"]');
  if (pane) pane.classList.add('active');
});

// ESCキーでメニュー・モーダルを閉じる
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    if (el.popupOverlay.classList.contains("open")) {
      closePopup();
    } else if (el.allGamesView.style.display === "block") {
      showHome();
    } else if (el.sideMenu.classList.contains("open")) {
      closeMenu();
    }
  }
});

// 音量設定
setupVolume();

// サイドパネル内容生成
generateSideContent();

// ============================================
// リサイズ対応
// ============================================
var resizeTimer = null;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    updateCarousel(state.currentIndex, false);
  }, 150);
});

// ============================================
// 初期化
// ============================================
(function init() {
  generateCards();
  updateCarousel(0, false);
  startAutoPlay();
})();
