/* ============================================
   Milli Pulse メインエンジン
   YouTube連携 + 譜面再生 + tap/hold/flick判定
   ============================================ */
(function () {
  "use strict";

  // ============================================
  // 曲リスト
  // ============================================
  var SONGS = [
    { id: "princess_viral", title: "Princess Viral", artist: "音ノ乃のの", bpm: 134 },
    { id: "luminous", title: "ルミナス", artist: "音ノ瀬らこ", bpm: 170 },
    { id: "okiraku_superstar", title: "おきらくスーパースター", artist: "小廻こま", bpm: 178 }
  ];

  // ============================================
  // 定数
  // ============================================
  var LANE_COUNT = 4;
  var LANE_COLORS = ["#8582fb", "#dbbee1", "#b794d4", "#716ed5"];
  var DEFAULT_THEME = {
    bgTop: "#1a0a2e",
    bgBottom: "#2d1b4e",
    accent: "#8582fb",
    lanes: LANE_COLORS
  };
  var theme = DEFAULT_THEME;
  var LANE_KEYS = ["KeyD", "KeyF", "KeyJ", "KeyK"];
  var JUDGE_Y_RATIO = 0.80;
  var SCROLL_AHEAD = 2.0;
  var PERFECT_RANGE = 0.040;
  var GREAT_RANGE = 0.080;
  var GOOD_RANGE = 0.120;
  var MISS_THRESHOLD = 0.200;
  var SCORE_PERFECT = 300;
  var SCORE_GREAT = 200;
  var SCORE_GOOD = 100;
  var HOLD_BONUS = 100;


  // ============================================
  // DOM参照
  // ============================================
  var canvas = document.getElementById("game-canvas");
  var ctx = canvas.getContext("2d");
  var boardWrapper = document.getElementById("board-wrapper");
  var elScore = document.getElementById("score");
  var elBest = document.getElementById("best-score");
  var elCombo = document.getElementById("combo");
  var elJudge = document.getElementById("judge");
  var elAccuracy = document.getElementById("accuracy");
  var elFinalScore = document.getElementById("final-score");
  var elResultJudges = document.getElementById("result-judges");
  var elFinalAccuracy = document.getElementById("final-accuracy");
  var elBestResult = document.getElementById("best-result");
  var elSongSelectOverlay = document.getElementById("overlay-song-select");
  var elStartOverlay = document.getElementById("overlay-start");
  var elResultOverlay = document.getElementById("overlay-result");
  var elBtnStart = document.getElementById("btn-start");
  var elBtnRetry = document.getElementById("btn-retry");
  var elBtnBackSelect = document.getElementById("btn-back-select");
  var elBtnBackSelectResult = document.getElementById("btn-back-select-result");
  var elStatusText = document.getElementById("video-status");
  var laneButtons = document.querySelectorAll(".lane-btn");
  var elOffsetSlider = document.getElementById("offset-slider");
  var elOffsetValue = document.getElementById("offset-value");
  var elOffsetDisplay = document.getElementById("offset-display");
  var elOffsetHud = document.getElementById("offset-hud");
  var elTestSound = document.getElementById("btn-test-sound");
  var diffBtns = document.querySelectorAll(".diff-btn");
  var elSongList = document.getElementById("song-list");
  var elSongTitle = document.getElementById("song-title");
  var elSettingsSongTitle = document.getElementById("settings-song-title");
  var elSettingsSongArtist = document.getElementById("settings-song-artist");
  var elResultSongTitle = document.getElementById("result-song-title");
  var elResultDifficulty = document.getElementById("result-difficulty");
  var elQuitBtn = document.getElementById("quit-btn");
  var elShareCanvas = document.getElementById("share-canvas");
  var elBtnSave = document.getElementById("btn-save");
  var elBtnShare = document.getElementById("btn-share");
  var elBtnX = document.getElementById("btn-x");

  // ============================================
  // 状態
  // ============================================
  var cw = 0, ch = 0, lw = 0, judgeY = 0, dpr = 1;
  var score = 0, bestScore = 0, combo = 0, maxCombo = 0;
  var totalNotes = 0, judgedNotes = 0, accuracyTotal = 0, accuracyMax = 0;
  var counts = { perfect: 0, great: 0, good: 0, miss: 0 };
  var running = false, started = false, chartTime = 0;
  var lastResult = null;
  var player = null, playerReady = false, animId = null;
  var activeNotes = [], effects = [], judgeTexts = [];
  var laneFlash = [0, 0, 0, 0];
  var laneHeld = [false, false, false, false];
  var holdActive = [null, null, null, null];
  var chart = null, noteIdx = 0;

  var fadeOutActive = false, fadeOutStart = 0;
  var FADE_DURATION = 4.0;
  var selectedSongId = null;
  var offsetToastTimer = 0;
  var rings = [];
  var shakeOffset = 0, shakeTime = 0;
  var touchMap = {};
  var rippleEffects = [];

  // ============================================
  // 設定（ユーザーが変更可能）
  // ============================================
  var config = {
    difficulty: "normal",
    userOffset: 0
  };

  function updateJudgment() {
    switch (config.difficulty) {
      case "easy":
        PERFECT_RANGE = 0.060; GREAT_RANGE = 0.120; GOOD_RANGE = 0.180; MISS_THRESHOLD = 0.260;
        break;
      case "hard":
        PERFECT_RANGE = 0.025; GREAT_RANGE = 0.050; GOOD_RANGE = 0.090; MISS_THRESHOLD = 0.160;
        break;
      default:
        PERFECT_RANGE = 0.040; GREAT_RANGE = 0.080; GOOD_RANGE = 0.120; MISS_THRESHOLD = 0.200;
    }
  }

  // ============================================
  // YouTube API
  // ============================================
  window.onYouTubeIframeAPIReady = function () {
    var vid = (typeof CHARTS !== "undefined" && selectedSongId && CHARTS[selectedSongId])
      ? CHARTS[selectedSongId].videoId : "MF4Yw8IS6og";
    createPlayer(vid);
  };

  function createPlayer(vid) {
    if (player) {
      try { player.destroy(); } catch (e) {}
      player = null;
      playerReady = false;
    }
    player = new YT.Player("player", {
      height: "100%",
      width: "100%",
      videoId: vid,
      playerVars: {
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        enablejsapi: 1,
        origin: window.location.origin
      },
      events: {
        onReady: function () {
          playerReady = true;
          elStatusText.parentElement.style.display = "none";
        },
        onStateChange: function (e) {
          if (e.data === YT.PlayerState.ENDED && running && !fadeOutActive) {
            fadeOutActive = true;
            fadeOutStart = chartTime;
          }
        },
        onError: function () {
          elStatusText.parentElement.style.display = "";
          elStatusText.textContent = "動画の読み込みに失敗しました";
        }
      }
    });
  }

  (function loadYT() {
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    var first = document.getElementsByTagName("script")[0];
    first.parentNode.insertBefore(tag, first);
  })();

  // ============================================
  // Canvas初期化
  // ============================================
  function initCanvas() {
    dpr = window.devicePixelRatio || 1;
    var rect = boardWrapper.getBoundingClientRect();
    var btnsEl = document.getElementById("lane-buttons");
    var btnsH = btnsEl ? btnsEl.offsetHeight : 48;

    cw = rect.width;
    ch = Math.max(1, rect.height - btnsH);

    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    canvas.style.width = cw + "px";
    canvas.style.height = ch + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    lw = cw / LANE_COUNT;
    judgeY = ch * JUDGE_Y_RATIO;
  }

  // ============================================
  // スコア管理（曲ごと）
  // ============================================
  function bestKey(songId, diff) {
    return "rhythmBest_" + songId + "_" + diff;
  }

  function loadBest() {
    if (!selectedSongId) { elBest.textContent = "0"; return; }
    var key = bestKey(selectedSongId, config.difficulty);
    var v = localStorage.getItem(key);
    bestScore = v ? parseInt(v, 10) : 0;
    elBest.textContent = bestScore;
  }

  function saveBest() {
    if (!selectedSongId) return;
    if (score > bestScore) {
      bestScore = score;
      var key = bestKey(selectedSongId, config.difficulty);
      localStorage.setItem(key, bestScore);
      elBest.textContent = bestScore;
    }
  }

  // ============================================
  // 設定の読み込み/保存
  // ============================================
  function loadConfig() {
    var savedDiff = localStorage.getItem("rhythmDifficulty");
    if (savedDiff) {
      if (savedDiff === "hard" && !chartHasHard()) savedDiff = "normal";
      config.difficulty = savedDiff;
      diffBtns.forEach(function (b) {
        b.classList.toggle("active", b.getAttribute("data-diff") === savedDiff);
      });
    }
    updateHardButton();
    updateJudgment();

    var savedOffset = localStorage.getItem("rhythmOffset");
    if (savedOffset !== null) {
      config.userOffset = parseInt(savedOffset, 10);
      elOffsetSlider.value = config.userOffset;
      var label = (config.userOffset >= 0 ? "+" : "") + config.userOffset + "ms";
      elOffsetValue.textContent = label;
    }
  }

  function updateHUD() {
    elScore.textContent = score;
    elCombo.textContent = combo;
    var total = counts.perfect + counts.great + counts.good + counts.miss;
    var acc = total > 0
      ? Math.round((counts.perfect * 3 + counts.great * 2 + counts.good) / (total * 3) * 100)
      : 100;
    elAccuracy.textContent = acc + "%";
  }

  // ============================================
  // ノーツ管理
  // ============================================
  function spawnNotes() {
    while (noteIdx < chart.notes.length) {
      var n = chart.notes[noteIdx];
      if (n.t - chartTime > SCROLL_AHEAD + 0.5) break;
      if (!shouldInclude(n)) { noteIdx++; continue; }
      activeNotes.push({
        t: n.t, l: n.l, type: n.type, d: n.d || 0,
        lvl: n.lvl || 0,
        hit: false, judged: false, held: false, holdProgress: 0
      });
      noteIdx++;
    }
  }

  function cleanupNotes() {
    for (var i = activeNotes.length - 1; i >= 0; i--) {
      var n = activeNotes[i];
      if (n.judged && n.type !== "hold") {
        activeNotes.splice(i, 1);
      } else if (n.judged && n.type === "hold" && n.holdProgress >= 1) {
        activeNotes.splice(i, 1);
      }
    }
  }

  // ============================================
  // 判定
  // ============================================
  function judgeNote(note, diff) {
    var absDiff = Math.abs(diff);
    var judgeText = "", judgeColor = "", points = 0;

    if (absDiff <= PERFECT_RANGE) {
      judgeText = "PERFECT"; judgeColor = theme.lanes[0]; points = SCORE_PERFECT; counts.perfect++;
    } else if (absDiff <= GREAT_RANGE) {
      judgeText = "GREAT"; judgeColor = theme.lanes[1]; points = SCORE_GREAT; counts.great++;
    } else if (absDiff <= GOOD_RANGE) {
      judgeText = "GOOD"; judgeColor = theme.lanes[2]; points = SCORE_GOOD; counts.good++;
    } else {
      return;
    }

    note.hit = true; note.judged = true; judgedNotes++;

    if (points > 0) {
      combo++;
      if (combo > maxCombo) maxCombo = combo;
      points += Math.floor(combo * 5);
    }

    accuracyTotal += points > 0 ? (absDiff <= PERFECT_RANGE ? 3 : absDiff <= GREAT_RANGE ? 2 : 1) : 0;
    accuracyMax += 3;

    score += points;
    updateHUD();

    elJudge.textContent = judgeText;
    elJudge.style.color = judgeColor;

    playHitSound(judgeText);

    var nx = note.l * lw + lw / 2;
    spawnHitEffect(nx, judgeY, judgeColor);
    spawnRing(nx, judgeY, judgeColor);
    spawnJudgeText(judgeText, judgeColor, cw / 2, judgeY - 30, combo);
  }

  function autoMiss(note) {
    note.judged = true; judgedNotes++; combo = 0; counts.miss++;
    updateHUD();
    elJudge.textContent = "MISS"; elJudge.style.color = "#e74c3c";
    spawnJudgeText("MISS", "#e74c3c", cw / 2, judgeY - 30, 0);
  }

  // ============================================
  // エフェクト
  // ============================================
  function spawnHitEffect(x, y, color) {
    for (var i = 0; i < 16; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = 1.5 + Math.random() * 5;
      effects.push({ x: x, y: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 0.8 + Math.random() * 0.4, color: color, r: 2 + Math.random() * 4 });
    }
  }

  function spawnJudgeText(text, color, x, y, comboCount) {
    judgeTexts.push({ text: text, color: color, x: x, y: y, life: 1, combo: comboCount, scale: 0.5 });
  }

  function spawnRing(x, y, color) {
    rings.push({ x: x, y: y, color: color, r: 0, life: 1 });
  }

  function spawnRipple(x, lane) {
    rippleEffects.push({ x: x, y: judgeY, lane: lane, life: 1 });
  }

  // ============================================
  // 効果音（打楽器的タップ音・ノイズベース）
  // ============================================
  var audioCtx = null;
  var noiseBuf = null;

  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function getNoiseBuf(ctx) {
    if (!noiseBuf) {
      var len = ctx.sampleRate * 0.06;
      noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
      var data = noiseBuf.getChannelData(0);
      for (var i = 0; i < len; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }
    return noiseBuf;
  }

  function playHitSound(type) {
    try {
      var ctx = getAudioCtx();
      var now = ctx.currentTime;

      var src = ctx.createBufferSource();
      src.buffer = getNoiseBuf(ctx);

      var gain = ctx.createGain();
      var filter = ctx.createBiquadFilter();
      filter.type = "lowpass";

      if (type === "PERFECT") {
        filter.frequency.setValueAtTime(4000, now);
        filter.frequency.exponentialRampToValueAtTime(400, now + 0.04);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      } else if (type === "GREAT") {
        filter.frequency.setValueAtTime(2500, now);
        filter.frequency.exponentialRampToValueAtTime(300, now + 0.035);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      } else {
        filter.frequency.setValueAtTime(1500, now);
        filter.frequency.exponentialRampToValueAtTime(200, now + 0.03);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      }

      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      src.start(now);
      src.stop(now + 0.06);
    } catch (e) {}
  }

  function shouldInclude(note) {
    var level = note.lvl || 0;
    if (config.difficulty === "easy") return level === 0;
    if (config.difficulty === "normal") return level === 1;
    return level === 2;
  }

  function chartHasHard() {
    if (typeof CHARTS === "undefined" || !selectedSongId || !CHARTS[selectedSongId]) return false;
    var ch = CHARTS[selectedSongId];
    if (ch.hasHard === false) return false;
    for (var i = 0; i < ch.notes.length; i++) {
      if (ch.notes[i].lvl === 2) return true;
    }
    return false;
  }

  function updateHardButton() {
    var wrapper = document.getElementById("hard-wrapper");
    if (!wrapper) return;
    var btn = wrapper.querySelector(".diff-btn");
    if (!btn) return;
    var available = chartHasHard();
    wrapper.classList.toggle("disabled", !available);
    btn.classList.toggle("disabled", !available);
    wrapper.classList.remove("touch-hover");
    if (!available && config.difficulty === "hard") {
      config.difficulty = "normal";
      diffBtns.forEach(function (b) {
        b.classList.toggle("active", b.getAttribute("data-diff") === "normal");
      });
      elResultDifficulty.textContent = "NORMAL";
      loadBest();
    }
    updateJudgment();
  }

  // ============================================
  // 更新
  // ============================================
  function update() {
    if (!running) return;

    try {
      if (player && player.getCurrentTime) {
        chartTime = player.getCurrentTime() - (chart.offset || 0) + (config.userOffset / 1000);
      }
    } catch (e) {}

    spawnNotes();
    cleanupNotes();

    for (var i = 0; i < activeNotes.length; i++) {
      var n = activeNotes[i];
      if (n.judged) continue;
      var diff = n.t - chartTime;
      if (diff < -MISS_THRESHOLD) autoMiss(n);
    }

    for (var i = 0; i < activeNotes.length; i++) {
      var n = activeNotes[i];
      if (n.type !== "hold" || !n.hit || n.holdProgress >= 1) continue;
      if (laneHeld[n.l]) {
        n.holdProgress = Math.min(1, (chartTime - n.t) / n.d);
        if (n.holdProgress >= 1) {
          score += HOLD_BONUS; updateHUD();
          spawnJudgeText("HOLD OK", theme.accent, cw / 2, judgeY - 55, 0);
          holdActive[n.l] = null;
        }
      }
    }

    for (var i = effects.length - 1; i >= 0; i--) {
      var e = effects[i];
      e.x += e.vx; e.y += e.vy; e.life -= 0.04;
      if (e.life <= 0) effects.splice(i, 1);
    }

    for (var i = rings.length - 1; i >= 0; i--) {
      var r = rings[i];
      r.r += 3; r.life -= 0.03;
      if (r.life <= 0) rings.splice(i, 1);
    }

    for (var i = judgeTexts.length - 1; i >= 0; i--) {
      var jt = judgeTexts[i];
      jt.y -= 0.8; jt.life -= 0.02;
      jt.scale = Math.min(1, jt.scale + 0.06);
      if (jt.life <= 0) judgeTexts.splice(i, 1);
    }

    for (var i = rippleEffects.length - 1; i >= 0; i--) {
      var rp = rippleEffects[i];
      rp.life -= 0.04;
      if (rp.life <= 0) rippleEffects.splice(i, 1);
    }

    for (var i = 0; i < LANE_COUNT; i++) {
      if (laneFlash[i] > 0) { laneFlash[i] *= 0.92; if (laneFlash[i] < 0.01) laneFlash[i] = 0; }
    }

    if (!fadeOutActive) {
      var duration = (chart && chart.duration) ? chart.duration : 109;
      if (chartTime >= duration) {
        startFadeOut();
      }
    }

    if (fadeOutActive) {
      var fadeElapsed = chartTime - fadeOutStart;
      var fadeProgress = Math.min(1, fadeElapsed / FADE_DURATION);
      try { player.setVolume(Math.round((1 - fadeProgress) * 100)); } catch (e) {}
      if (fadeProgress >= 1) {
        fadeOutActive = false; running = false;
        try { player.pauseVideo(); } catch (e) {}
        endGame(); return;
      }
    }

    // シェイク（オフ）
    shakeOffset = 0; shakeTime = 0;
  }

  // ============================================
  // 描画（3D立体風 + エフェクト強化）
  // ============================================
  function draw() {
    ctx.clearRect(0, 0, cw, ch);

    // ===== 背景 =====
    var grad = ctx.createLinearGradient(0, 0, 0, ch);
    grad.addColorStop(0, theme.bgTop);
    grad.addColorStop(1, theme.bgBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);

    // ===== レーン背景・奥行き（上部が暗く、判定線に近づくほど明るく） =====
    for (var i = 0; i < LANE_COUNT; i++) {
      var laneGrad = ctx.createLinearGradient(0, 0, 0, judgeY);
      laneGrad.addColorStop(0, "rgba(26,10,46,0.35)");
      laneGrad.addColorStop(0.6, "rgba(26,10,46,0.1)");
      laneGrad.addColorStop(1, "rgba(238,242,255,0.03)");
      ctx.fillStyle = laneGrad;
      ctx.fillRect(i * lw, 0, lw, ch);
      if (i % 2 === 0) {
        ctx.fillStyle = "rgba(238,242,255,0.015)";
        ctx.fillRect(i * lw, 0, lw, ch);
      }
    }

    // レーン側面影（立体的な区切り）
    for (var i = 1; i < LANE_COUNT; i++) {
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.fillRect(i * lw - 1, 0, 2, ch);
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.fillRect(i * lw + 1, 0, 1, ch);
    }

    // レーン下端（判定線手前）に明るい輝き
    var laneBottomGrad = ctx.createLinearGradient(0, judgeY * 0.85, 0, judgeY);
    laneBottomGrad.addColorStop(0, "rgba(" + hexToRgb(theme.accent) + ",0)");
    laneBottomGrad.addColorStop(1, "rgba(" + hexToRgb(theme.accent) + ",0.05)");
    ctx.fillStyle = laneBottomGrad;
    ctx.fillRect(0, judgeY * 0.85, cw, judgeY * 0.15);

    // レーンカバー（上部）
    var coverH = judgeY * 0.08;
    for (var i = 0; i < LANE_COUNT; i++) {
      var coverGrad = ctx.createLinearGradient(0, 0, 0, coverH);
      coverGrad.addColorStop(0, "rgba(0,0,0,0.4)");
      coverGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = coverGrad;
      ctx.fillRect(i * lw, 0, lw, coverH);
      // レーン番号
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(i + 1, i * lw + lw / 2, 4);
    }

    // ===== レーンフラッシュ =====
    for (var i = 0; i < LANE_COUNT; i++) {
      if (laneFlash[i] > 0) {
        ctx.fillStyle = "rgba(" + hexToRgb(theme.lanes[i]) + "," + (laneFlash[i] * 0.15) + ")";
        ctx.fillRect(i * lw, 0, lw, ch);
      }
    }

    // ===== 判定ライン（3D風） =====
    // 下敷き（影）
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(0, judgeY + 2, cw, 4);
    // メインライン
    ctx.beginPath(); ctx.moveTo(0, judgeY); ctx.lineTo(cw, judgeY);
    ctx.strokeStyle = "rgba(238,242,255,0.5)"; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, judgeY); ctx.lineTo(cw, judgeY);
    ctx.strokeStyle = "rgba(" + hexToRgb(theme.accent) + ",0.3)"; ctx.lineWidth = 6; ctx.stroke();
    // グロー
    var glowGrad = ctx.createLinearGradient(0, judgeY - 10, 0, judgeY + 10);
    glowGrad.addColorStop(0, "rgba(" + hexToRgb(theme.accent) + ",0)");
    glowGrad.addColorStop(0.4, "rgba(" + hexToRgb(theme.accent) + ",0.1)");
    glowGrad.addColorStop(0.6, "rgba(" + hexToRgb(theme.accent) + ",0.1)");
    glowGrad.addColorStop(1, "rgba(" + hexToRgb(theme.accent) + ",0)");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, judgeY - 10, cw, 20);
    // レーン区切りマーカー
    for (var i = 0; i <= LANE_COUNT; i++) {
      var mx = i * lw;
      ctx.beginPath(); ctx.moveTo(mx, judgeY - 4); ctx.lineTo(mx, judgeY + 4);
      ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 1; ctx.stroke();
    }

    // ===== ビートパルス =====
    if (running && chart) {
      var bpm = chart.bpm || 134;
      var beatMs = 60000 / bpm;
      var elapsed = chartTime * 1000;
      var beatPhase = (elapsed % beatMs) / beatMs;
      var pulse = Math.max(0, 1 - beatPhase * 4);
      if (pulse > 0) {
        ctx.fillStyle = "rgba(" + hexToRgb(theme.accent) + "," + (pulse * 0.05) + ")";
        ctx.fillRect(0, 0, cw, ch);
      }
    }

    // ===== ノーツ描画（3D立体風） =====
    var noteW = lw * 0.72;
    var noteH = ch * 0.045;
    var noteR = noteH / 2;

    for (var i = 0; i < activeNotes.length; i++) {
      var n = activeNotes[i];
      if (n.judged && n.type !== "hold") continue;
      if (n.type === "hold" && n.holdProgress >= 1) continue;

      var diff = n.t - chartTime;
      var ny = judgeY - (diff / SCROLL_AHEAD) * judgeY;

      var nx = n.l * lw + lw / 2;
      var color = theme.lanes[n.l];

      var approachRatio = Math.max(0.2, Math.min(1, (diff / SCROLL_AHEAD) + 0.2));
      var scale = 0.7 + (1 - approachRatio) * 0.65;
      var sW = noteW * scale;
      var sH = noteH * scale;
      var sR = noteR * scale;

      // ホールドテール — 頭が画面外でも描画
      if (n.type === "hold") {
        var tailEnd = judgeY - ((n.t + n.d) - chartTime) / SCROLL_AHEAD * judgeY;
        var tailTop = Math.min(ny - sH / 2, tailEnd - sH / 2);
        var tailBottom = Math.max(ny + sH / 2, tailEnd + sH / 2);
        if (tailBottom > 0 && tailTop < ch) {
          var tw = sW * 0.55;
          var tx = nx - tw / 2;
          var tt = Math.max(0, tailTop);
          var tb = Math.min(ch, tailBottom);
          var tGrad = ctx.createLinearGradient(tx, 0, tx + tw, 0);
          if (n.hit) {
            tGrad.addColorStop(0, "rgba(" + hexToRgb(theme.accent) + ",0.5)");
            tGrad.addColorStop(0.5, "rgba(" + hexToRgb(theme.accent) + ",0.8)");
            tGrad.addColorStop(1, "rgba(" + hexToRgb(theme.accent) + ",0.3)");
          } else {
            tGrad.addColorStop(0, "rgba(238,242,255,0.08)");
            tGrad.addColorStop(0.5, "rgba(238,242,255,0.15)");
            tGrad.addColorStop(1, color + "30");
          }
          ctx.fillStyle = tGrad;
          ctx.fillRect(tx, tt, tw, tb - tt);
          ctx.fillStyle = n.hit ? "rgba(26,10,46,0.3)" : "rgba(0,0,0,0.15)";
          ctx.fillRect(tx + tw, tt, 3, tb - tt);
        }
      }

      if (ny < -noteH * 3 || ny > ch + noteH * 2) continue;

      // 背景の影（ドロップシャドウ）
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 8 * scale;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 4;

      // ノーツ本体（3D円柱風: 白枠 + グラデ + グロー）
      ctx.beginPath();
      roundRect(ctx, nx - sW / 2, ny - sH / 2, sW, sH, sR);

      // 白枠
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fill();

      // 内部グラデーション（左上→右下 光源）
      var nGrad = ctx.createRadialGradient(
        nx - sW * 0.25, ny - sH * 0.25, sH * 0.1,
        nx, ny, sW * 0.8
      );
      nGrad.addColorStop(0, lighten(color, 80));
      nGrad.addColorStop(0.3, color);
      nGrad.addColorStop(0.7, darken(color, 20));
      nGrad.addColorStop(1, darken(color, 50));
      ctx.fillStyle = nGrad;
      ctx.fill();

      // 白枠の輪郭を際立たせる
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // グロー（アプローチに応じて増加）
      if (!n.judged || (n.type === "hold" && n.hit)) {
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = color;
        ctx.shadowBlur = 6 + (1 - approachRatio) * 18;
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.fill();
      }

      ctx.restore();

      // トップの光沢ライン
      ctx.save();
      ctx.beginPath();
      roundRect(ctx, nx - sW / 2 + sW * 0.12, ny - sH / 2 + 2, sW * 0.76, sH * 0.25, sR * 0.3);
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fill();
      ctx.restore();

      if (n.type === "hold") {
        ctx.save();
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.font = "bold " + Math.round(sH * 0.6) + "px sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 4;
        ctx.fillText("▼", nx, ny);
        ctx.restore();
      }
    }

    // ===== リングエフェクト =====
    for (var i = 0; i < rings.length; i++) {
      var r = rings[i];
      ctx.globalAlpha = r.life * 0.6;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.strokeStyle = r.color; ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // ===== パーティクル =====
    for (var i = 0; i < effects.length; i++) {
      var e = effects[i];
      ctx.globalAlpha = e.life;
      ctx.beginPath(); ctx.arc(e.x, e.y, e.r * e.life, 0, Math.PI * 2);
      ctx.fillStyle = e.color; ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ===== タップ波紋 =====
    for (var i = 0; i < rippleEffects.length; i++) {
      var rp = rippleEffects[i];
      ctx.globalAlpha = rp.life * 0.4;
      var rpx = rp.lane * lw + lw / 2;
      ctx.beginPath(); ctx.arc(rpx, rp.y, (1 - rp.life) * lw * 0.8 + 4, 0, Math.PI * 2);
      ctx.fillStyle = theme.lanes[rp.lane];
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ===== 判定テキスト（スケールアニメーション） =====
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (var i = 0; i < judgeTexts.length; i++) {
      var jt = judgeTexts[i];
      ctx.globalAlpha = jt.life;
      var ts = 16 + jt.scale * 8;
      ctx.font = "bold " + Math.round(ts) + "px sans-serif";
      ctx.fillStyle = jt.color;
      ctx.shadowColor = jt.color;
      ctx.shadowBlur = 8;
      ctx.fillText(jt.text, jt.x, jt.y);
      ctx.shadowBlur = 0;
      if (jt.combo > 1) {
        ctx.font = "bold 12px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fillText(jt.combo + " COMBO", jt.x, jt.y + Math.round(ts * 0.7));
      }
    }
    ctx.globalAlpha = 1;

    // ===== 進行度バー（シンプル） =====
    if (running && chart && chart.notes.length > 0) {
      var lastNoteTime = chart.notes[chart.notes.length - 1].t;
      var progress = Math.min(chartTime / lastNoteTime, 1);
      if (progress >= 0) {
        ctx.fillStyle = "rgba(238,242,255,0.06)";
        ctx.fillRect(0, 0, cw, 3);
        ctx.fillStyle = theme.accent;
        ctx.fillRect(0, 0, cw * progress, 3);
      }
    }

    // ===== フェードアウト（Canvasのみ） =====
    if (fadeOutActive) {
      var fadeElapsed = chartTime - fadeOutStart;
      var fadeProgress = Math.min(1, fadeElapsed / FADE_DURATION);
      ctx.fillStyle = "rgba(0,0,0," + fadeProgress + ")";
      ctx.fillRect(0, 0, cw, ch);
    }

    // ===== オフセットトースト =====
    if (offsetToastTimer > 0) {
      offsetToastTimer--;
      ctx.fillStyle = "rgba(" + hexToRgb(theme.accent) + ",0.85)";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      var label = "OFFSET " + (config.userOffset >= 0 ? "+" : "") + config.userOffset + "ms";
      ctx.fillText(label, cw / 2, 6);
    }

  }

  // ============================================
  // 描画ヘルパー
  // ============================================
  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function hexToRgb(hex) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return r + "," + g + "," + b;
  }

  function lighten(hex, amt) {
    var r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amt);
    var g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amt);
    var b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amt);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function darken(hex, amt) {
    var r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amt);
    var g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amt);
    var b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amt);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // ============================================
  // ヒット処理
  // ============================================
  function hitLane(lane) {
    if (!running) return;

    laneFlash[lane] = 1;
    laneHeld[lane] = true;
    var closest = null, closestDist = Infinity;
    for (var i = 0; i < activeNotes.length; i++) {
      var n = activeNotes[i];
      if (n.l !== lane || n.judged) continue;
      var diff = Math.abs(n.t - chartTime);
      if (diff < closestDist) { closestDist = diff; closest = n; }
    }

    if (!closest || closestDist > GOOD_RANGE + 0.02) return;

    if (closest.type === "hold") {
      judgeNote(closest, closest.t - chartTime);
      if (closest.judged) holdActive[lane] = { note: closest };
      return;
    }
    judgeNote(closest, closest.t - chartTime);
  }

  function releaseLane(lane) {
    if (!running) return;
    laneHeld[lane] = false;

    if (holdActive[lane]) {
      var h = holdActive[lane], n = h.note;
      if (n && n.hit && n.holdProgress < 1) {
        var completion = n.holdProgress;
        if (completion > 0.8) {
          score += HOLD_BONUS; updateHUD();
          spawnJudgeText("HOLD OK", theme.accent, cw / 2, judgeY - 55, 0);
        } else {
          spawnJudgeText("HOLD BREAK", "#e74c3c", cw / 2, judgeY - 55, 0);
        }
        n.holdProgress = 1;
      }
      holdActive[lane] = null;
    }
  }

  // ============================================
  // キーボード入力
  // ============================================
  document.addEventListener("keydown", function (e) {
    var idx = LANE_KEYS.indexOf(e.code);
    if (idx !== -1) { e.preventDefault(); hitLane(idx); }

    // プレイ中のオフセット調整
    if (running) {
      var step = e.shiftKey ? 50 : 10;
      if (e.code === "BracketLeft" || e.code === "Minus") {
        e.preventDefault();
        config.userOffset = Math.max(-300, config.userOffset - step);
        elOffsetSlider.value = config.userOffset;
        var label = (config.userOffset >= 0 ? "+" : "") + config.userOffset + "ms";
        elOffsetValue.textContent = label;
        elOffsetDisplay.textContent = label;
        localStorage.setItem("rhythmOffset", config.userOffset);
        offsetToastTimer = 60;
      }
      if (e.code === "BracketRight" || e.code === "Equal") {
        e.preventDefault();
        config.userOffset = Math.min(300, config.userOffset + step);
        elOffsetSlider.value = config.userOffset;
        var label = (config.userOffset >= 0 ? "+" : "") + config.userOffset + "ms";
        elOffsetValue.textContent = label;
        elOffsetDisplay.textContent = label;
        localStorage.setItem("rhythmOffset", config.userOffset);
        offsetToastTimer = 60;
      }
    }
  });

  document.addEventListener("keyup", function (e) {
    var idx = LANE_KEYS.indexOf(e.code);
    if (idx !== -1) releaseLane(idx);
  });

  // ============================================
  // Canvas直タッチ入力（スマホ対応・マルチタッチ）
  // ============================================

  function getLaneFromX(clientX) {
    var rect = canvas.getBoundingClientRect();
    var relX = (clientX - rect.left) * (cw / rect.width);
    var lane = Math.floor(relX / lw);
    return Math.max(0, Math.min(LANE_COUNT - 1, lane));
  }

  canvas.addEventListener("pointerdown", function (e) {
    e.preventDefault();
    var lane = getLaneFromX(e.clientX);
    touchMap[e.pointerId] = lane;
    hitLane(lane);
    spawnRipple(e.clientX, lane);
  });

  // pointermoveはスライド追尾せず、hold維持のため何もしない

  canvas.addEventListener("pointerup", function (e) {
    var lane = touchMap[e.pointerId];
    if (lane !== undefined) {
      releaseLane(lane);
      delete touchMap[e.pointerId];
    }
  });

  canvas.addEventListener("pointercancel", function (e) {
    var lane = touchMap[e.pointerId];
    if (lane !== undefined) {
      releaseLane(lane);
      delete touchMap[e.pointerId];
    }
  });

  // レーンボタン（補助）
  for (var i = 0; i < laneButtons.length; i++) {
    (function (btn) {
      var lane = parseInt(btn.getAttribute("data-lane"), 10);
      btn.addEventListener("pointerdown", function (e) { e.preventDefault(); btn.classList.add("pressed"); hitLane(lane); spawnRipple(e.clientX, lane); });
      btn.addEventListener("pointerup", function (e) { e.preventDefault(); btn.classList.remove("pressed"); releaseLane(lane); });
      btn.addEventListener("pointerleave", function (e) { btn.classList.remove("pressed"); releaseLane(lane); });
      btn.addEventListener("pointercancel", function (e) { btn.classList.remove("pressed"); releaseLane(lane); });
    })(laneButtons[i]);
  }

  // ============================================
  // ゲームループ
  // ============================================
  function gameLoop() {
    if (!running && !started) return;
    update();
    draw();
    animId = requestAnimationFrame(gameLoop);
  }

  // ============================================
  // フェードアウト
  // ============================================
  function startFadeOut() { fadeOutActive = true; fadeOutStart = chartTime; }

  // ============================================
  // テスト音
  // ============================================
  function playTestSound() {
    try {
      var actx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = actx.createOscillator();
      var gain = actx.createGain();
      osc.connect(gain); gain.connect(actx.destination);
      osc.frequency.value = 880; osc.type = "sine";
      gain.gain.setValueAtTime(0.2, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.1);
      osc.start(actx.currentTime); osc.stop(actx.currentTime + 0.1);
    } catch (e) {}
  }

  // ============================================
  // 曲選択
  // ============================================
  var elGameWrapper = document.getElementById("game-wrapper");

  function setVideoVisible(show) {
    if (show) {
      elGameWrapper.classList.remove("video-hidden");
    } else {
      elGameWrapper.classList.add("video-hidden");
    }
  }

  function showSongSelect() {
    elQuitBtn.classList.remove("visible");
    elSongSelectOverlay.classList.add("active");
    elStartOverlay.classList.remove("active");
    elResultOverlay.classList.remove("active");
    document.getElementById("hud-row").style.display = "none";
    setVideoVisible(false);
  }

  function applyTheme() {
    var chartData = (typeof CHARTS !== "undefined" && selectedSongId && CHARTS[selectedSongId])
      ? CHARTS[selectedSongId] : null;
    theme = (chartData && chartData.theme) ? chartData.theme : DEFAULT_THEME;
    elGameWrapper.style.setProperty("--accent", theme.accent);
    elGameWrapper.style.setProperty("--accent-rgb", hexToRgb(theme.accent));
  }

  function selectSong(songId) {
    selectedSongId = songId;
    var song = null;
    for (var i = 0; i < SONGS.length; i++) {
      if (SONGS[i].id === songId) { song = SONGS[i]; break; }
    }
    if (!song) return;

    elSongTitle.textContent = song.title + " / " + song.artist;
    elSettingsSongTitle.textContent = song.title;
    elSettingsSongArtist.textContent = song.artist;

    // 曲テーマを反映（プレイ画面・HUDの配色）
    applyTheme();

    // この曲の難しい度別ベストスコアを表示
    loadBest();
    updateHardButton();

    elSongSelectOverlay.classList.remove("active");
    elStartOverlay.classList.add("active");
    elResultOverlay.classList.remove("active");
    setVideoVisible(true);

    // YouTubeプレーヤーを切り替え
    if (typeof CHARTS !== "undefined" && CHARTS[songId]) {
      var chartData = CHARTS[songId];
      if (typeof YT !== "undefined" && YT.Player) {
        createPlayer(chartData.videoId);
      } else {
        // API未ロード - onYouTubeIframeAPIReadyで処理済み or 後で処理
      }
    }
  }

  function buildSongList() {
    var html = "";
    for (var i = 0; i < SONGS.length; i++) {
      var s = SONGS[i];
      var chartData = (typeof CHARTS !== "undefined" && CHARTS[s.id]) ? CHARTS[s.id] : null;
      var noteCount = chartData ? chartData.notes.length : "?";
      html +=
        '<button class="song-card" data-song="' + s.id + '">' +
        '<span class="song-title">' + s.title + '</span>' +
        '<span class="song-artist">' + s.artist + '</span>' +
        '<span class="song-meta">BPM ' + s.bpm + ' &middot; ' + noteCount + 'ノーツ</span>' +
        '</button>';
    }
    elSongList.innerHTML = html;

    // クリックイベント
    var cards = elSongList.querySelectorAll(".song-card");
    for (var i = 0; i < cards.length; i++) {
      (function (card) {
        card.addEventListener("click", function () {
          selectSong(card.getAttribute("data-song"));
        });
      })(cards[i]);
    }
  }

  // ============================================
  // ゲーム制御
  // ============================================
  function startGame() {
    if (!player || !playerReady) {
      elStatusText.parentElement.style.display = "";
      elStatusText.textContent = "YouTubeプレーヤー準備中...";
      elBtnStart.style.opacity = "0.5";
      setTimeout(function () { elBtnStart.style.opacity = "1"; }, 300);
      return;
    }

    if (!selectedSongId || typeof CHARTS === "undefined" || !CHARTS[selectedSongId]) {
      elStatusText.parentElement.style.display = "";
      elStatusText.textContent = "譜面データの読み込みに失敗しました";
      return;
    }

    initCanvas();

    offsetToastTimer = 0;
    score = 0; combo = 0; maxCombo = 0;
    noteIdx = 0; judgedNotes = 0; accuracyTotal = 0; accuracyMax = 0;
    counts = { perfect: 0, great: 0, good: 0, miss: 0 };
    activeNotes = []; effects = []; judgeTexts = []; rings = []; rippleEffects = [];
    touchMap = {}; shakeOffset = 0; shakeTime = 0;
    laneFlash = [0, 0, 0, 0]; laneHeld = [false, false, false, false];
    holdActive = [null, null, null, null];
    chartTime = 0;
    fadeOutActive = false;

    chart = CHARTS[selectedSongId];
    applyTheme();
    totalNotes = 0;
    for (var ni = 0; ni < chart.notes.length; ni++) {
      if (shouldInclude(chart.notes[ni])) totalNotes++;
    }

    updateHUD();
    elScore.textContent = "0"; elCombo.textContent = "0";
    elJudge.textContent = "-"; elJudge.style.color = theme.accent;
    elAccuracy.textContent = "100%";
    elOffsetHud.style.display = "";

    elStartOverlay.classList.remove("active");
    elResultOverlay.classList.remove("active");
    document.getElementById("hud-row").style.display = "";
    elQuitBtn.classList.add("visible");
    setVideoVisible(true);

    running = true; started = true;

    try { player.seekTo(0); player.playVideo(); } catch (e) {}

    if (animId) cancelAnimationFrame(animId);
    gameLoop();
  }

  function calcRank(accuracy) {
    if (accuracy >= 98) return { rank: "SS", color: "#fbbf24" };
    if (accuracy >= 90) return { rank: "S", color: "#8582fb" };
    if (accuracy >= 80) return { rank: "A", color: "#dbbee1" };
    if (accuracy >= 70) return { rank: "B", color: "#b794d4" };
    if (accuracy >= 60) return { rank: "C", color: "#716ed5" };
    return { rank: "D", color: "#9ca3af" };
  }

  function saveHistory(data) {
    try {
      var history = JSON.parse(localStorage.getItem('milliGames_history') || '[]');
      history.unshift({
        game: 'リズムゲーム',
        date: new Date().toISOString(),
        score: data.score,
        accuracy: data.acc,
        rank: data.rankLabel || data.rank,
        maxCombo: data.maxCombo,
        song: data.chartTitle,
        difficulty: data.difficulty,
        counts: data.counts
      });
      if (history.length > 50) history = history.slice(0, 50);
      localStorage.setItem('milliGames_history', JSON.stringify(history));
    } catch (e) {}
  }

  function endGame() {
    running = false; started = false;
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    try { player.pauseVideo(); } catch (e) {}
    saveBest();

    elOffsetHud.style.display = "none";
    elFinalScore.textContent = score;

    var diffLabel = config.difficulty.toUpperCase();
    elResultSongTitle.textContent = chart ? chart.title || "" : "";
    elResultDifficulty.textContent = diffLabel;

    var total = counts.perfect + counts.great + counts.good + counts.miss;
    var acc = total > 0
      ? Math.round((counts.perfect * 3 + counts.great * 2 + counts.good) / (total * 3) * 100)
      : 0;

    // ランク計算
    var rankInfo = calcRank(acc);
    var rankHtml = '<div class="rank-badge rank-' + rankInfo.rank + '">' + rankInfo.rank + '</div>';

    elResultJudges.innerHTML =
      rankHtml +
      "<br>" +
      "PERFECT: " + counts.perfect + "<br>" +
      "GREAT: " + counts.great + "<br>" +
      "GOOD: " + counts.good + "<br>" +
      "MISS: " + counts.miss + "<br>" +
      "MAX COMBO: " + maxCombo;

    elFinalAccuracy.textContent = "ACCURACY: " + acc + "%";

    if (score >= bestScore && score > 0) {
      elBestResult.textContent = "NEW BEST!";
    } else {
      elBestResult.textContent = "ベスト: " + bestScore;
    }

    var currentArtist = "";
    for (var si = 0; si < SONGS.length; si++) {
      if (SONGS[si].id === selectedSongId) { currentArtist = SONGS[si].artist; break; }
    }

    lastResult = {
      score: score,
      bestScore: bestScore,
      isNewBest: score >= bestScore && score > 0,
      acc: acc,
      rankLabel: rankInfo.rank,
      rankColor: rankInfo.color,
      chartTitle: chart ? (chart.title || elResultSongTitle.textContent || "") : "",
      artist: currentArtist,
      difficulty: config.difficulty.toUpperCase(),
      counts: {
        perfect: counts.perfect,
        great: counts.great,
        good: counts.good,
        miss: counts.miss
      },
      maxCombo: maxCombo
    };

    saveHistory(lastResult);
    recordGameClear('milli-pulse', score);

    elQuitBtn.classList.remove("visible");
    document.getElementById("hud-row").style.display = "none";
    elResultOverlay.classList.add("active");
    setVideoVisible(false);
  }

  // ============================================
  // 共有機能
  // ============================================
  function getResultForShare() {
    if (!lastResult) return null;
    var r = lastResult;
    var perfect = r.counts.perfect;
    var great = r.counts.great;
    var good = r.counts.good;
    var miss = r.counts.miss;
    var total = perfect + great + good + miss;
    var acc = total > 0
      ? Math.round((perfect * 3 + great * 2 + good) / (total * 3) * 100)
      : 0;
    return {
      title: r.chartTitle,
      artist: r.artist,
      difficulty: r.difficulty,
      score: r.score,
      acc: acc,
      rank: r.rankLabel,
      rankColor: r.rankColor,
      perfect: perfect,
      great: great,
      good: good,
      miss: miss,
      maxCombo: r.maxCombo,
      isNewBest: r.isNewBest,
      bestScore: r.bestScore
    };
  }

  function loadImage(src) {
    return new Promise(function(resolve) {
      var img = new Image();
      img.onload = function() { resolve(img); };
      img.onerror = function() { resolve(null); };
      img.src = src;
    });
  }

  function generateShareImage() {
    var r = getResultForShare();
    if (!r) return Promise.reject("no result");

    var W = 360, H = 520;
    var scale = 2;
    var cvs = elShareCanvas;
    cvs.width = W * scale;
    cvs.height = H * scale;
    var ctx = cvs.getContext("2d");
    ctx.scale(scale, scale);

    var isOkiraku = selectedSongId === "okiraku_superstar";
    var shareBg = isOkiraku
      ? "../images/games/share/Milli Pulse-share-okiraku.png"
      : "../images/games/share/Milli Pulse-share.PNG";

    var inkRGB = isOkiraku ? "78,43,13" : "45,27,78";
    function ink(a) {
      var k = isOkiraku ? Math.min(a * 2, 1) : a;
      return "rgba(" + inkRGB + "," + k.toFixed(2) + ")";
    }

    return Promise.all([
      loadImage("../images/games/rogo/Milli Pulse-rogo.png"),
      loadImage(shareBg)
    ]).then(function(imgs) {
      var rogoImg = imgs[0], bgImg = imgs[1];
      // background
      if (bgImg && bgImg.width > 0 && bgImg.height > 0) {
        ctx.drawImage(bgImg, 0, 0, W, H);
      } else {
        var grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, "#f5e6ff");
        grad.addColorStop(1, "#e8d4f0");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      // rogo at top
      var yBase = 12;
      if (rogoImg && rogoImg.width > 0 && rogoImg.height > 0) {
        var rogoW = 160;
        var rogoH = rogoW * rogoImg.height / rogoImg.width;
        ctx.drawImage(rogoImg, (W - rogoW) / 2, yBase, rogoW, rogoH);
        yBase = yBase + rogoH + 6;
      }

      // song title & artist
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      var yPos = yBase + 2;
      ctx.fillStyle = ink(0.8);
      ctx.font = "bold 13px -apple-system, sans-serif";
      ctx.fillText(r.title, W / 2, yPos);
      yPos += 18;
      ctx.fillStyle = ink(0.5);
      ctx.font = "11px -apple-system, sans-serif";
      ctx.fillText(r.artist, W / 2, yPos);
      yBase = yPos + 8;

      // difficulty
      ctx.fillStyle = ink(0.35);
      ctx.font = "11px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      yPos = yBase + 2;
      ctx.fillText(r.difficulty, W / 2, yPos);

      // rank badge
      var rs = 72;
      var rankCY = yPos + 28;
      ctx.shadowColor = r.rankColor;
      ctx.shadowBlur = 28;
      ctx.beginPath();
      ctx.arc(W / 2, rankCY + rs / 2, rs / 2, 0, Math.PI * 2);
      ctx.fillStyle = r.rankColor + "18";
      ctx.fill();
      ctx.strokeStyle = r.rankColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = r.rankColor;
      ctx.font = "bold 36px -apple-system, sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillText(r.rank, W / 2, rankCY + rs / 2);

      // score
      yPos = rankCY + rs + 12;
      ctx.textBaseline = "top";
      ctx.fillStyle = "#8582fb";
      ctx.font = "bold 28px -apple-system, sans-serif";
      ctx.fillText(r.score.toLocaleString(), W / 2, yPos);
      ctx.fillStyle = ink(0.3);
      ctx.font = "12px -apple-system, sans-serif";
      ctx.fillText("SCORE", W / 2, yPos + 32);

      // bars
      yPos += 56;
      var barItems = [
        { label: "ACCURACY", val: r.acc, suffix: "%", color: "#8582fb" },
        { label: "MAX COMBO", val: r.maxCombo, suffix: "", color: "#dbbee1" }
      ];
      for (var bi = 0; bi < barItems.length; bi++) {
        ctx.fillStyle = ink(0.7);
        ctx.textAlign = "left";
        ctx.font = "13px -apple-system, sans-serif";
        ctx.fillText(barItems[bi].label, 50, yPos);
        ctx.textAlign = "right";
        ctx.font = "bold 13px -apple-system, sans-serif";
        ctx.fillText(String(barItems[bi].val) + barItems[bi].suffix, W - 50, yPos);
        ctx.fillStyle = ink(0.12);
        ctx.fillRect(50, yPos + 17, W - 100, 4);
        ctx.fillStyle = barItems[bi].color;
        var bv = typeof barItems[bi].val === "number" ? barItems[bi].val : 0;
        ctx.fillRect(50, yPos + 17, (W - 100) * Math.min(bv / 100, 1), 4);
        yPos += 40;
      }

      // divider
      ctx.strokeStyle = ink(0.1);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, yPos);
      ctx.lineTo(W - 40, yPos);
      ctx.stroke();
      yPos += 10;

      // judge counts header
      ctx.textBaseline = "top";
      ctx.fillStyle = ink(0.6);
      ctx.font = "11px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("DETAILS", W / 2, yPos);
      yPos += 18;

      var items = [
        { label: "PERFECT", color: "#8582fb", val: r.perfect },
        { label: "GREAT", color: "#dbbee1", val: r.great },
        { label: "GOOD", color: "#b794d4", val: r.good },
        { label: "MISS", color: ink(0.3), val: r.miss }
      ];
      for (var i = 0; i < items.length; i++) {
        ctx.fillStyle = ink(0.25);
        ctx.textAlign = "left";
        ctx.font = "14px -apple-system, sans-serif";
        ctx.fillText(items[i].label, 55, yPos);
        ctx.fillStyle = items[i].color;
        ctx.textAlign = "right";
        ctx.fillText(String(items[i].val), W - 55, yPos);
        yPos += 24;
      }

      // best
      yPos += 4;
      if (r.isNewBest) {
        ctx.fillStyle = isOkiraku ? "#4a2608" : "#fbbf24";
        ctx.font = "bold 14px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("NEW BEST!", W / 2, yPos);
      } else {
        ctx.fillStyle = ink(0.3);
        ctx.font = "12px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("BEST " + r.bestScore.toLocaleString(), W / 2, yPos);
      }

      return new Promise(function (resolve) {
        cvs.toBlob(function (blob) {
          resolve(blob);
        }, "image/png");
      });
    });
  }

  function getXText() {
    var r = getResultForShare();
    if (!r) return "";
    return "\uD83C\uDFB5 " + r.title + " / " + r.difficulty + " \u3092\u30D7\u30EC\u30A4\uFF01\n" +
      "\u30B9\u30B3\u30A2: " + r.score.toLocaleString() + "\n" +
      "ACCURACY: " + r.acc + "%\n" +
      "\u30E9\u30F3\u30AF: " + r.rank + "\n" +
      "#MilliPulse #\u30DF\u30EA\u30D7\u30ED #MilliGames\n" +
      "https://milli-games.onrender.com/games/music.html";
  }

  function handleSave() {
    generateShareImage().then(function (blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "milligame_result.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  function handleShare() {
    generateShareImage().then(function (blob) {
      var text = getXText();
      var file = new File([blob], "result.png", { type: "image/png" });
      if (navigator.share) {
        var data = { title: "Milli Pulse", text: text };
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          data.files = [file];
        }
        navigator.share(data);
      } else {
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "milligame_result.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        try { navigator.clipboard.writeText(text); } catch (e) {}
      }
    });
  }

  function handlePostX() {
    generateShareImage().then(function (blob) {
      var text = getXText();
      var file = new File([blob], "result.png", { type: "image/png" });
      if (navigator.share) {
        var data = { text: text };
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          data.files = [file];
        }
        navigator.share(data);
      } else {
        window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(text), "_blank");
      }
    });
  }

  // ============================================
  // イベント登録
  // ============================================
  // 曲選択リスト生成
  buildSongList();

  // 難易度ボタン
  for (var i = 0; i < diffBtns.length; i++) {
    (function (btn) {
      btn.addEventListener("click", function () {
        var diff = btn.getAttribute("data-diff");
        if (diff === "hard") {
          var wrapper = document.getElementById("hard-wrapper");
          if (wrapper && wrapper.classList.contains("disabled")) {
            if (wrapper.classList.contains("touch-hover")) {
              wrapper.classList.remove("touch-hover");
            } else {
              wrapper.classList.add("touch-hover");
            }
            return;
          }
        }
        diffBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        config.difficulty = diff;
        updateJudgment();
        localStorage.setItem("rhythmDifficulty", config.difficulty);
        loadBest();
        elResultDifficulty.textContent = config.difficulty.toUpperCase();
      });
    })(diffBtns[i]);
  }

  // オフセットスライダー
  elOffsetSlider.addEventListener("input", function () {
    config.userOffset = parseInt(elOffsetSlider.value, 10);
    var label = (config.userOffset >= 0 ? "+" : "") + config.userOffset + "ms";
    elOffsetValue.textContent = label;
    elOffsetDisplay.textContent = label;
    localStorage.setItem("rhythmOffset", config.userOffset);
  });

  // テスト音
  elTestSound.addEventListener("click", playTestSound);

  // スタート
  elBtnStart.addEventListener("click", startGame);

  // リトライ
  elBtnRetry.addEventListener("click", function () {
    if (selectedSongId) sessionStorage.setItem("retrySongId", selectedSongId);
    location.reload();
  });

  // 共有
  elBtnSave.addEventListener("click", handleSave);
  elBtnShare.addEventListener("click", handleShare);
  elBtnX.addEventListener("click", handlePostX);

  // 途中終了
  elQuitBtn.addEventListener("click", function () {
    running = false; started = false;
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    try { player.pauseVideo(); } catch (e) {}
    elQuitBtn.classList.remove("visible");
    document.getElementById("hud-row").style.display = "none";
    showSongSelect();
  });

  // 曲選択に戻る
  elBtnBackSelect.addEventListener("click", function () {
    elStartOverlay.classList.remove("active");
    showSongSelect();
  });
  elBtnBackSelectResult.addEventListener("click", function () {
    elResultOverlay.classList.remove("active");
    showSongSelect();
  });

  // 長押しメニュー防止
  canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  boardWrapper.addEventListener("contextmenu", function (e) { e.preventDefault(); });

  window.addEventListener("resize", function () {
    if (!running) { initCanvas(); draw(); }
  });

  // ============================================
  // 初期化
  // ============================================
  loadBest();
  loadConfig();
  initCanvas();

  // リトライ（ページ再読込後、同じ曲の設定画面へ）
  var retrySongId = sessionStorage.getItem("retrySongId");
  if (retrySongId && CHARTS[retrySongId]) {
    sessionStorage.removeItem("retrySongId");
    selectedSongId = retrySongId;
    var song = null;
    for (var i = 0; i < SONGS.length; i++) {
      if (SONGS[i].id === retrySongId) { song = SONGS[i]; break; }
    }
    if (song) {
      elSongTitle.textContent = song.title + " / " + song.artist;
      elSettingsSongTitle.textContent = song.title;
      elSettingsSongArtist.textContent = song.artist;
      loadBest();
      updateHardButton();
    }
    applyTheme();
    var rt = setInterval(function () {
      if (playerReady) {
        clearInterval(rt);
        elSongSelectOverlay.classList.remove("active");
        elStartOverlay.classList.add("active");
        setVideoVisible(true);
      }
    }, 100);
  }

  // 初期描画
  (function () {
    initCanvas();
    var grad = ctx.createLinearGradient(0, 0, 0, ch);
    grad.addColorStop(0, theme.bgTop);
    grad.addColorStop(1, theme.bgBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = "rgba(" + hexToRgb(theme.accent) + ",0.1)";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("曲を選択してください", cw / 2, ch / 2);
  })();

})();
