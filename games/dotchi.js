(function () {
  "use strict";

  // ============================================
  // 定数
  // ============================================
  var BPM = 148;
  var BEAT_MS = 60000 / BPM;
  var BEATS_PER_BAR = 4;
  var START_OFFSET_BEATS = 6;

  var D = { B: "beginner", I: "intermediate", A: "advanced" };

  var POINTS = {};
  POINTS[D.B] = 100;
  POINTS[D.I] = 200;
  POINTS[D.A] = 300;

  var YT_VIDEOS = {
    nono: "VfZaDBPnzqs",
    rako: "fHaRxiDVCjE",
    koma: "NAoBxWcJAG0"
  };
  var YT_VIDEO_NAMES = {
    VfZaDBPnzqs: "\u97F3\u30CE\u4E43\u306E\u306E",
    fHaRxiDVCjE: "\u97F3\u30CE\u702C\u3089\u3053",
    NAoBxWcJAG0: "\u5C0F\u5EC1\u3053\u307E"
  };
  var selectedVideoId = "VfZaDBPnzqs";

  // ============================================
  // 9つの出題スロット
  // ============================================
  var SLOTS = [
    { bar: 1, beat: 1, beatsToAnswer: 3, diff: D.B },
    { bar: 2, beat: 1, beatsToAnswer: 3, diff: D.B },
    { bar: 3, beat: 1, beatsToAnswer: 3, diff: D.B },
    { bar: 4, beat: 1, beatsToAnswer: 19, diff: D.A },
    { bar: 9, beat: 1, beatsToAnswer: 3, diff: D.I },
    { bar: 10, beat: 1, beatsToAnswer: 3, diff: D.I },
    { bar: 11, beat: 1, beatsToAnswer: 3, diff: D.I },
    { bar: 12, beat: 1, beatsToAnswer: 11, diff: D.A },
    { bar: 15, beat: 1, beatsToAnswer: 6, diff: D.B }
  ];

  function slotTime(slot) {
    var absBeat = slot.bar * BEATS_PER_BAR + slot.beat;
    return (absBeat - START_OFFSET_BEATS) * BEAT_MS / 1000;
  }

  // ============================================
  // 問題プール（36問）
  // ============================================
  var POOL = [
    // ===== 基本 =====
    { id: "b1", diff: D.B, q: "甘狼このみのモチーフ動物は？", left: "狼", right: "狐", correct: 0 },
    { id: "b2", diff: D.B, q: "ゆらぎゆらのモチーフ動物は？", left: "魚", right: "クラゲ", correct: 1 },
    { id: "b3", diff: D.B, q: "甘狼このみのテーマカラーは？", left: "赤", right: "ミントグリーン", correct: 1 },
    { id: "b4", diff: D.B, q: "甘狼このみはどっち？", left: "イラストレーター", right: "体操選手", correct: 0 },
    { id: "b5", diff: D.B, q: "ミリプロの正式名称は？", left: "Million Production", right: "Military Production", correct: 0 },
    { id: "b6", diff: D.B, q: "ミリプロのマスコット的キャラクターは？", left: "ミリちゃん", right: "ビリちゃん", correct: 0 },
    { id: "b7", diff: D.B, q: "音ノ瀬らこのモチーフ動物は？", left: "ラッコ", right: "カワウソ", correct: 0 },
    { id: "b8", diff: D.B, q: "あくびでもんすぺーどの名前に含まれるトランプのマークは？", left: "スペード", right: "ダイヤ", correct: 0 },
    { id: "b9", diff: D.B, q: "音ノ乃のののテーマカラーは？", left: "赤", right: "水色", correct: 1 },
    { id: "b10", diff: D.B, q: "音ノ瀬らこのテーマカラーは？", left: "黄色", right: "緑", correct: 0 },
    { id: "b11", diff: D.B, q: "ゆらぎゆらのテーマカラーは？", left: "黒", right: "青", correct: 1 },
    { id: "b12", diff: D.B, q: "小廻こまのテーマカラーは？", left: "白", right: "オレンジ", correct: 1 },
    { id: "b13", diff: D.B, q: "雨夜リズのテーマカラーは？", left: "黄色", right: "緑", correct: 1 },
    { id: "b14", diff: D.B, q: "あくび・でもんすぺーどのテーマカラーは？", left: "赤", right: "白", correct: 0 },
    { id: "b15", diff: D.B, q: "眠雲ツクリのテーマカラーは？", left: "ピンク", right: "白", correct: 1 },
    { id: "b16", diff: D.B, q: "虹深°ぬふのテーマカラーは？", left: "水色", right: "ピンク", correct: 1 },
    { id: "b17", diff: D.B, q: "夕霧レイのテーマカラーは？", left: "虹色", right: "水色", correct: 1 },
    { id: "b18", diff: D.B, q: "甘狼このみのファンネームは？", left: "このっ子", right: "このみんちょす", correct: 0 },
    { id: "b19", diff: D.B, q: "音ノ乃のののファンネームは？", left: "のの好き", right: "ののの隊", correct: 1 },
    { id: "b20", diff: D.B, q: "あくび・でもんすぺーどのファンネームは？", left: "びぃの一族", right: "すぺーどの騎士団", correct: 0 },
    { id: "b21", diff: D.B, q: "音ノ瀬らこのファンネームは？", left: "らっ好", right: "らっ子", correct: 1 },
    { id: "b22", diff: D.B, q: "小廻こまのファンネームは？", left: "こまの駒", right: "こまめいと", correct: 1 },
    { id: "b23", diff: D.B, q: "ゆらぎゆらのファンネームは？", left: "ゆらゆら", right: "ゆらふぃら", correct: 1 },
    { id: "b24", diff: D.B, q: "雨夜リズのファンネームは？", left: "リズナイト", right: "リズむ", correct: 0 },
    { id: "b25", diff: D.B, q: "眠雲ツクリのファンネームは？", left: "つくらうど", right: "ツクられた者", correct: 0 },
    { id: "b26", diff: D.B, q: "虹深°ぬふのファンネームは？", left: "ぷかファミリー", right: "ぷかぬファミリー", correct: 1 },
    { id: "b27", diff: D.B, q: "夕霧レイのファンネームは？", left: "オペレーター", right: "的", correct: 0 },
    { id: "b28", diff: D.B, q: "ミリプロのファンネームは？", left: "ミリリス", right: "ミリ隊", correct: 0 },
    { id: "b29", diff: D.B, q: "ミリプロの設立メンバーであり、0期生兼クリエイターなのは誰？", left: "甘狼このみ", right: "音ノ乃のの", correct: 0 },
    { id: "b30", diff: D.B, q: "ミリプロの事務所としての目標は「デビュー1年で登録者何万人」？", left: "10万人", right: "30万人", correct: 1 },
    { id: "b31", diff: D.B, q: "ミリプロに所属するタレントの性別は現在どちらに限定されている？", left: "女性のみ", right: "男女混合", correct: 0 },
    { id: "b32", diff: D.B, q: "ミリプロオーディションに応募できる最低年齢は何歳以上？", left: "16歳以上", right: "18歳以上", correct: 0 },
    { id: "b33", diff: D.B, q: "甘狼このみのように、イラストやモデルを全て自分で作ることを何と呼ぶ？", left: "完全セルフ受肉", right: "フルスクラッチ", correct: 0 },
    { id: "b34", diff: D.B, q: "ミリプロの1st 3D LIVEのタイトルは何？", left: "Mile Stone", right: "Million Story", correct: 1 },
    { id: "b35", diff: D.B, q: "2026年5月にコラボが行われた中古品買取チェーン店はどこ？", left: "BOOKOFF", right: "ゲオ", correct: 0 },

    // ===== ふつう =====
    { id: "i1", diff: D.I, q: "甘狼このみの誕生日は？", left: "08/28", right: "02/14", correct: 1 },
    { id: "i2", diff: D.I, q: "音ノ乃ののの誕生日は？", left: "05/04", right: "04/11", correct: 0 },
    { id: "i3", diff: D.I, q: "あくび・でもんすぺーどの誕生日は？", left: "07/31", right: "10/31", correct: 1 },
    { id: "i4", diff: D.I, q: "音ノ瀬らこの誕生日は？", left: "05/05", right: "04/08", correct: 1 },
    { id: "i5", diff: D.I, q: "ゆらぎゆらの誕生日は？", left: "10/21", right: "11/03", correct: 1 },
    { id: "i6", diff: D.I, q: "小廻こまの誕生日は？", left: "08/01", right: "07/26", correct: 0 },
    { id: "i7", diff: D.I, q: "雨夜リズの誕生日は？", left: "03/19", right: "09/11", correct: 0 },
    { id: "i8", diff: D.I, q: "眠雲ツクリの誕生日は？", left: "09/03", right: "05/03", correct: 0 },
    { id: "i9", diff: D.I, q: "虹深°ぬふの誕生日は？", left: "06/29", right: "11/30", correct: 1 },
    { id: "i10", diff: D.I, q: "夕霧レイの誕生日は？", left: "01/30", right: "11/08", correct: 0 },
    { id: "i11", diff: D.I, q: "ミリプロの誕生日は？", left: "04/01", right: "12/07", correct: 0 },
    { id: "i12", diff: D.I, q: "ミリプロに所属するタレントの主な配信プラットフォームは？", left: "YouTube", right: "Twitch", correct: 0 },
    { id: "i13", diff: D.I, q: "音ノ瀬らこ、ゆらぎゆら、虹深°ぬふが所属するグループ名は？", left: "ミリプロUNI", right: "ミリプロNOVA", correct: 1 },
    { id: "i14", diff: D.I, q: "VSingerとして活動し、3Dお披露目も果たしている1期生は誰？", left: "音ノ乃のの", right: "あくび・でもんすぺーど", correct: 0 },
    { id: "i15", diff: D.I, q: "2026年7月にチャンネル登録者数50万人を突破した2期生は誰？", left: "甘狼このみ", right: "あくび・でもんすぺーど", correct: 1 },
    { id: "i16", diff: D.I, q: "小廻こまの特技として記載されている、特徴的なスキルは何？", left: "DJ", right: "いろんな声と大声をだすこと", correct: 1 },
    { id: "i17", diff: D.I, q: "ミリプロ初のオリジナル全体楽曲のタイトルは何？", left: "Mile Stone", right: "Million Story", correct: 0 },
    { id: "i18", diff: D.I, q: "2026年5月に開催されたミリプロ初の3Dライブの会場は？", left: "Zepp Shinjuku", right: "日本武道館", correct: 0 },
    { id: "i19", diff: D.I, q: "「マルチクリエイティブVTuber」を名乗り、作曲や動画編集もこなすのは？", left: "眠雲ツクリ", right: "夕霧レイ", correct: 0 },
    { id: "i20", diff: D.I, q: "2026年7月時点で、公式LINEスタンプは第何弾まで発売されている？", left: "第2弾", right: "第3弾", correct: 0 },
    { id: "i21", diff: D.I, q: "音ノ乃のののメジャー1stデジタルシングルのタイトルは？", left: "約束", right: "アルテマ", correct: 0 },
    { id: "i22", diff: D.I, q: "甘狼このみの年齢は現在「約何歳」？", left: "約2歳", right: "約2000歳", correct: 0 },

    // ===== 難問 =====
    { id: "a1", diff: D.A, q: "甘狼このみの初配信はいつ？", left: "2022/12/23", right: "2026/10/28", correct: 0 },
    { id: "a2", diff: D.A, q: "音ノ乃ののの初配信はいつ？", left: "2023/06/03", right: "2026/11/09", correct: 0 },
    { id: "a3", diff: D.A, q: "あくび・でもんすぺーどの初配信はいつ？", left: "2026/06/16", right: "2024/01/09", correct: 1 },
    { id: "a4", diff: D.A, q: "音ノ瀬らこの初投稿はいつ？", left: "2023/12/17", right: "2026/12/08", correct: 0 },
    { id: "a5", diff: D.A, q: "ゆらぎゆらの活動開始はいつ？", left: "2026/02/15", right: "2023/12/23", correct: 1 },
    { id: "a6", diff: D.A, q: "小廻こまの初配信はいつ？", left: "2026/08/17", right: "2025/03/22", correct: 1 },
    { id: "a7", diff: D.A, q: "雨夜リズの初配信はいつ？", left: "2026/08/19", right: "2025/05/18", correct: 1 },
    { id: "a8", diff: D.A, q: "眠雲ツクリの初配信はいつ？", left: "2025/05/17", right: "2026/08/12", correct: 0 },
    { id: "a9", diff: D.A, q: "虹深°ぬふの初配信はいつ？", left: "2026/07/22", right: "2025/08/08", correct: 1 },
    { id: "a10", diff: D.A, q: "夕霧レイの初配信はいつ？", left: "2026/07/07", right: "2026/07/11", correct: 1 },
    { id: "a11", diff: D.A, q: "甘狼このみの身長150cmという設定に「含まれている」ものは？", left: "耳・ヒール", right: "アホ毛・靴", correct: 0 },
    { id: "a12", diff: D.A, q: "あくび・でもんすぺーどの身長140cmに「含まれていない」ものは？", left: "ヒール", right: "がぶ丸", correct: 1 },
    { id: "a13", diff: D.A, q: "音ノ瀬らこの身長151cmという設定に「含まれている」ものは？", left: "アホ毛", right: "厚底靴", correct: 0 },
    { id: "a14", diff: D.A, q: "眠雲ツクリの「厚底靴なし」の公称身長は何cm？", left: "156cm", right: "158cm", correct: 0 },
    { id: "a15", diff: D.A, q: "夕霧レイの特技「ごはんとおかずを○○に食べ切ること」の○○は何？", left: "3分以内", right: "ぴったり同時", correct: 1 },
    { id: "a16", diff: D.A, q: "虹深°ぬふは「めんだこ」と「人間」の何と説明されている？", left: "妖精", right: "ハーフ", correct: 1 },
    { id: "a17", diff: D.A, q: "あくび・でもんすぺーどの年齢設定は何歳くらい？", left: "20歳くらい", right: "2000歳くらい", correct: 1 },
    { id: "a18", diff: D.A, q: "公式Q&Aによると、ミリプロは年間で何名ほどの新人がデビューする予定？", left: "1〜2名", right: "4〜5名", correct: 1 },
    { id: "a19", diff: D.A, q: "音ノ瀬らこがミリプロに加入した日付はいつ？", left: "2024年3月4日", right: "2024年3月31日", correct: 0 },
    { id: "a20", diff: D.A, q: "夕霧レイがミリプロUNIへの「加入を発表」した日はいつ？", left: "2026/05/09", right: "2026/07/11", correct: 0 },
    { id: "a21", diff: D.A, q: "音ノ乃ののの3Dお披露目が行われた日付はいつ？", left: "2024/12/21", right: "2025/01/01", correct: 0 }
  ];

  // ============================================
  // DOM参照
  // ============================================
  var $ = function (id) { return document.getElementById(id); };
  var el = {
    startOverlay: $("overlay-start"),
    resultOverlay: $("overlay-result"),
    screenPlay: $("screen-play"),
    btnStart: $("btn-start"),
    btnRetry: $("btn-retry"),
    btnSave: $("btn-save"),
    btnShare: $("btn-share"),
    btnX: $("btn-x"),
    qNumber: $("q-number"),
    qText: $("q-text"),
    qDiff: $("q-difficulty"),
    leftBtn: $("btn-left"),
    rightBtn: $("btn-right"),
    leftText: $("left-text"),
    rightText: $("right-text"),
    timerFill: $("timer-bar-fill"),
    feedback: $("feedback-overlay"),
    feedbackIcon: $("feedback-icon"),
    feedbackText: $("feedback-text"),
    hudProgress: $("hud-progress"),
    comboDisplay: $("combo-display"),
    accDisplay: $("accuracy-display"),
    finalScore: $("final-score"),
    resultCorrect: $("result-correct"),
    resultTotal: $("result-total"),
    resultAcc: $("result-accuracy"),
    resultMaxCombo: $("result-maxcombo"),
    resultRank: $("result-rank"),
    rB: $("r-beginner"),
    rI: $("r-intermediate"),
    rA: $("r-advanced"),
    shareCanvas: $("share-canvas"),
    questionCard: $("question-card"),
    beatOverlay: $("beat-overlay"),
    beatCircle: $("beat-circle"),
    beatNumber: $("beat-number"),
    beatLabel: $("beat-label")
  };

  // ============================================
  // 状態
  // ============================================
  var ytPlayer = null;
  var ytReady = false;
  var ytPlaying = false;
  var questions = [];
  var cursor = -1;
  var score = 0;
  var combo = 0;
  var maxCombo = 0;
  var answerCount = 0;
  var correctCount = 0;
  var diffResult = {};
  diffResult[D.B] = { total: 0, correct: 0 };
  diffResult[D.I] = { total: 0, correct: 0 };
  diffResult[D.A] = { total: 0, correct: 0 };
  var isPlaying = false;
  var qActive = false;
  var qDone = false;
  var animId = null;
  var timerStart = 0;
  var timerDur = 0;
  var lastResult = null;
  var pendingSeekTo = 0;
  var pendingPlay = false;

  // ============================================
  // ユーティリティ
  // ============================================
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // ============================================
  // 問題選択
  // ============================================
  function buildQuiz() {
    var pool = POOL.slice();
    var byDiff = {};
    byDiff[D.B] = []; byDiff[D.I] = []; byDiff[D.A] = [];
    for (var i = 0; i < pool.length; i++) {
      byDiff[pool[i].diff].push(pool[i]);
    }
    shuffle(byDiff[D.B]);
    shuffle(byDiff[D.I]);
    shuffle(byDiff[D.A]);

    var bIdx = 0, iIdx = 0, aIdx = 0;
    questions = [];
    for (var s = 0; s < SLOTS.length; s++) {
      var slot = SLOTS[s];
      var q = null;
      if (slot.diff === D.B && bIdx < byDiff[D.B].length) {
        q = byDiff[D.B][bIdx++];
      } else if (slot.diff === D.I && iIdx < byDiff[D.I].length) {
        q = byDiff[D.I][iIdx++];
      } else if (slot.diff === D.A && aIdx < byDiff[D.A].length) {
        q = byDiff[D.A][aIdx++];
      }
      if (!q) q = { diff: D.B, q: "?", left: "？", right: "？", correct: 0 };
      q.slot = s;
      q.bar = slot.bar;
      q.beat = slot.beat;
      q.beatsToAnswer = slot.beatsToAnswer;
      questions.push(q);
    }
  }

  // ============================================
  // YouTube Player
  // ============================================
  window.onYouTubeIframeAPIReady = function () {
    if (!ytPlayer) { createPlayer(selectedVideoId); }
  };

  function createPlayer(vid) {
    if (ytPlayer) { try { ytPlayer.destroy(); } catch (e) {} }
    ytPlayer = new YT.Player("yt-player", {
      videoId: vid,
      width: 640,
      height: 360,
      playerVars: {
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        fs: 0,
        playsinline: 1,
        enablejsapi: 1,
        origin: window.location.origin
      },
      events: {
        onReady: function () {
          ytReady = true;
          if (pendingPlay) {
            ytPlayer.seekTo(pendingSeekTo, true);
            ytPlayer.playVideo();
            pendingPlay = false;
          }
        },
        onStateChange: function (e) {
          if (e.data === YT.PlayerState.PLAYING) { ytPlaying = true; }
          if (e.data === YT.PlayerState.ENDED) { endGame(); }
        }
      }
    });
  }

  function getAudioTime() {
    try { return ytPlayer && ytPlaying ? ytPlayer.getCurrentTime() : 0; } catch (e) { return 0; }
  }

  function getDuration() {
    try { return ytPlayer ? ytPlayer.getDuration() : 0; } catch (e) { return 0; }
  }

  // ============================================
  // UI
  // ============================================
  function feedback(ok, pts) {
    el.feedbackIcon.textContent = ok ? "⭕" : "❌";
    el.feedbackText.textContent = ok ? "+" + pts : "\u30DF\u30B9";
    el.feedbackText.style.color = ok ? "#4caf50" : "#e74c3c";
    el.feedback.classList.remove("feedback-hidden");
    setTimeout(function () { el.feedback.classList.add("feedback-hidden"); }, 300);
  }

  function hudUpdate() {
    el.hudProgress.textContent = "Q" + (cursor + 1) + " / " + questions.length;
    el.comboDisplay.textContent = combo;
    el.accDisplay.textContent = answerCount > 0 ? Math.round(correctCount / answerCount * 100) + "%" : "--";
  }

  function showQ(q) {
    hideBeat();
    stopInterlude();
    qActive = true;
    qDone = false;

    el.qNumber.textContent = "Q" + (q.slot + 1);
    var dL = "", dC = "";
    if (q.diff === D.B) { dL = "\u57FA\u672C"; dC = "diff-beginner"; }
    else if (q.diff === D.I) { dL = "\u3075\u3064\u3046"; dC = "diff-intermediate"; }
    else { dL = "\u96E3\u554F"; dC = "diff-advanced"; }
    el.qDiff.textContent = dL;
    el.qDiff.className = "diff-badge " + dC;

    el.qText.textContent = q.q;
    el.leftText.textContent = q.left;
    el.rightText.textContent = q.right;

    el.leftBtn.className = "option-btn";
    el.rightBtn.className = "option-btn";
    el.leftBtn.disabled = false;
    el.rightBtn.disabled = false;

    timerDur = q.beatsToAnswer * BEAT_MS;
    timerStart = performance.now();
    el.timerFill.style.width = "100%";
    el.timerFill.style.background = "linear-gradient(90deg, #8582fb, #b388ff)";

    el.questionCard.style.transition = "none";
    el.questionCard.style.transform = "scale(0.9)";
    el.questionCard.style.opacity = "0";
    setTimeout(function () {
      el.questionCard.style.transition = "transform 0.15s ease, opacity 0.15s ease";
      el.questionCard.style.transform = "scale(1)";
      el.questionCard.style.opacity = "1";
    }, 10);

    hudUpdate();
  }

  function waitForQ(idx) {
    if (idx >= questions.length) { checkEnd(); return; }
    var q = questions[idx];
    var t = slotTime({ bar: q.bar, beat: q.beat });

    // Check if gap from previous question end is long enough for interlude
    var gapLong = false;
    if (idx > 0) {
      var prev = questions[idx - 1];
      var prevEnd = slotTime({ bar: prev.bar, beat: prev.beat }) + (prev.beatsToAnswer * BEAT_MS / 1000);
      gapLong = (t - prevEnd) > (4 * BEAT_MS / 1000);
    }
    if (gapLong) { startInterlude(); }

    function poll() {
      if (!isPlaying) return;
      if (getAudioTime() >= t) {
        stopInterlude();
        cursor = idx;
        showQ(q);
      } else {
        if (interludeActive) { updateInterlude(getAudioTime()); }
        setTimeout(poll, 50);
      }
    }
    poll();
  }

  function scheduleNext() {
    setTimeout(function () {
      el.questionCard.style.transition = "transform 0.1s ease, opacity 0.1s ease";
      el.questionCard.style.transform = "scale(0.9)";
      el.questionCard.style.opacity = "0";
      setTimeout(function () { waitForQ(cursor + 1); }, 100);
    }, 400);
  }

  // ============================================
  // タイマー
  // ============================================
  function updateTimer() {
    if (!qActive || qDone) return;
    var elapsed = performance.now() - timerStart;
    var remain = Math.max(0, timerDur - elapsed);
    var pct = remain / timerDur * 100;
    el.timerFill.style.width = pct + "%";
    if (pct < 30) {
      el.timerFill.style.background = "linear-gradient(90deg, #e74c3c, #ff9800)";
    }
    if (elapsed >= timerDur) { timeoutQ(); }
  }

  function timeoutQ() {
    if (qDone) return;
    qDone = true; qActive = false;
    combo = 0;
    answerCount++;
    var q = questions[cursor];
    diffResult[q.diff].total++;

    el.leftBtn.disabled = true;
    el.rightBtn.disabled = true;
    el.leftBtn.classList.add("disabled");
    el.rightBtn.classList.add("disabled");
    if (q.correct === 0) el.leftBtn.classList.add("reveal-correct");
    else el.rightBtn.classList.add("reveal-correct");

    feedback(false, 0);
    hudUpdate();
    scheduleNext();
  }

  // ============================================
  // 回答
  // ============================================
  function answer(choice) {
    if (qDone) return;
    qDone = true; qActive = false;

    var q = questions[cursor];
    var ok = (choice === q.correct);
    answerCount++;
    diffResult[q.diff].total++;

    el.leftBtn.disabled = true;
    el.rightBtn.disabled = true;
    el.leftBtn.classList.add("disabled");
    el.rightBtn.classList.add("disabled");

    if (ok) {
      correctCount++;
      diffResult[q.diff].correct++;
      combo++;
      if (combo > maxCombo) maxCombo = combo;

      var base = POINTS[q.diff];
      var elapsed = performance.now() - timerStart;
      var remain = Math.max(0, timerDur - elapsed);
      var speed = Math.floor(base * 0.5 * (remain / timerDur));
      var comboPts = Math.floor(combo * 10);
      var total = base + speed + comboPts;
      score += total;

      (choice === 0 ? el.leftBtn : el.rightBtn).classList.add("selected-correct");
      feedback(true, total);
    } else {
      combo = 0;
      (choice === 0 ? el.leftBtn : el.rightBtn).classList.add("selected-wrong");
      if (q.correct === 0) el.leftBtn.classList.add("reveal-correct");
      else el.rightBtn.classList.add("reveal-correct");
      feedback(false, 0);
    }

    hudUpdate();
    scheduleNext();
  }

  // ============================================
  // 入力
  // ============================================
  document.addEventListener("keydown", function (e) {
    if (e.code === "KeyA" || e.code === "ArrowLeft" || e.code === "Digit1") {
      e.preventDefault(); if (isPlaying) answer(0);
    }
    if (e.code === "KeyD" || e.code === "ArrowRight" || e.code === "Digit2") {
      e.preventDefault(); if (isPlaying) answer(1);
    }
  });

  el.leftBtn.addEventListener("click", function () { if (isPlaying) answer(0); });
  el.rightBtn.addEventListener("click", function () { if (isPlaying) answer(1); });

  // ============================================
  // ゲームループ
  // ============================================
  function loop() {
    if (!isPlaying) return;
    updateTimer();
    animId = requestAnimationFrame(loop);
  }

  // ============================================
  // ゲーム制御
  // ============================================
  // ============================================
  // ビートアニメーション
  // ============================================
  var beatTimerId = null;

  function triggerBeat(num, label) {
    var circle = el.beatCircle;
    circle.classList.remove("animate");
    void circle.offsetWidth;
    circle.classList.add("animate");

    if (num) {
      el.beatNumber.textContent = num;
      el.beatNumber.style.display = "";
    } else {
      el.beatNumber.style.display = "none";
    }

    el.beatLabel.textContent = label || "";
    el.beatOverlay.classList.remove("beat-hidden");
  }

  function hideBeat() {
    el.beatOverlay.classList.add("beat-hidden");
    if (beatTimerId) { clearTimeout(beatTimerId); beatTimerId = null; }
  }

  // ============================================
  // 間奏アニメーション
  // ============================================
  var interludeActive = false;
  var lastInterludeBeat = -1;

  function startInterlude() {
    interludeActive = true;
    lastInterludeBeat = -1;
    el.beatLabel.textContent = "\u5C0F\u4F11\u61A9\uFF01";
    el.beatNumber.textContent = "";
    el.beatOverlay.classList.remove("beat-hidden");
  }

  function stopInterlude() {
    interludeActive = false;
    el.beatOverlay.classList.add("beat-hidden");
  }

  function updateInterlude(currentTime) {
    if (!interludeActive) return;
    var absBeat = currentTime * 1000 / BEAT_MS + START_OFFSET_BEATS;
    var currentBeat = Math.floor(absBeat);
    if (currentBeat !== lastInterludeBeat) {
      lastInterludeBeat = currentBeat;
      var beatNum = (currentBeat % 4) + 1;
      var circle = el.beatCircle;
      circle.classList.remove("animate");
      void circle.offsetWidth;
      circle.classList.add("animate");
      el.beatNumber.textContent = beatNum;
      el.beatNumber.style.display = "";
      el.beatLabel.textContent = "\u5C0F\u4F11\u61A9\uFF01";
    }
  }

  // ============================================
  // ゲーム制御
  // ============================================
  function startGame() {
    buildQuiz();
    cursor = -1;
    score = 0; combo = 0; maxCombo = 0;
    answerCount = 0; correctCount = 0;
    diffResult = {};
    diffResult[D.B] = { total: 0, correct: 0 };
    diffResult[D.I] = { total: 0, correct: 0 };
    diffResult[D.A] = { total: 0, correct: 0 };
    isPlaying = false; qActive = false; qDone = false;
    ytPlaying = false;

    el.comboDisplay.textContent = "0";
    el.accDisplay.textContent = "--";
    el.timerFill.style.width = "100%";
    el.timerFill.style.background = "linear-gradient(90deg, #8582fb, #b388ff)";
    el.questionCard.style.opacity = "0";
    el.questionCard.style.transform = "scale(0.9)";
    el.questionCard.style.transition = "none";

    hideBeat();

    // Get selected singer
    var checked = document.querySelector('input[name="singer"]:checked');
    if (checked) { selectedVideoId = checked.value; }

    var countInSec = 0;

    if (!ytPlayer || !ytReady) {
      return; // Player not ready yet - click start again
    }

    el.startOverlay.classList.remove("active");
    hideBeat();

    // Start video immediately within user gesture (required for mobile)
    ytPlayer.loadVideoById(selectedVideoId, countInSec);

    isPlaying = true;

    // First question appears from 3rd beat onward
    setTimeout(function () { waitForQ(0); }, 3 * BEAT_MS);

    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  function checkEnd() {
    if (!isPlaying) return;
    var t = getAudioTime();
    var dur = getDuration();
    if (dur > 0 && t >= dur - 0.3) { endGame(); }
    else { setTimeout(checkEnd, 100); }
  }

  function endGame() {
    isPlaying = false;
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    qActive = false;
    hideBeat();
    stopInterlude();
    if (beatTimerId) { clearTimeout(beatTimerId); beatTimerId = null; }
    try { if (ytPlayer) { ytPlayer.pauseVideo(); } } catch (e) {}
    showResult();
  }

  // ============================================
  // リザルト
  // ============================================
  function calcRank(acc) {
    if (acc >= 95) return { rank: "SS", color: "#fbbf24" };
    if (acc >= 85) return { rank: "S", color: "#8582fb" };
    if (acc >= 70) return { rank: "A", color: "#dbbee1" };
    if (acc >= 55) return { rank: "B", color: "#b794d4" };
    if (acc >= 40) return { rank: "C", color: "#716ed5" };
    return { rank: "D", color: "#9ca3af" };
  }

  function showResult() {
    var total = answerCount;
    var acc = total > 0 ? Math.round(correctCount / total * 100) : 0;
    var rankInfo = calcRank(acc);

    el.resultRank.textContent = rankInfo.rank;
    el.resultRank.className = "rank-badge rank-" + rankInfo.rank;
    el.finalScore.textContent = score;
    el.resultCorrect.textContent = correctCount;
    el.resultTotal.textContent = questions.length;
    el.resultAcc.textContent = acc + "%";
    el.resultMaxCombo.textContent = maxCombo;

    el.rB.textContent = diffResult[D.B].correct + "/" + diffResult[D.B].total;
    el.rI.textContent = diffResult[D.I].correct + "/" + diffResult[D.I].total;
    el.rA.textContent = diffResult[D.A].correct + "/" + diffResult[D.A].total;

    lastResult = {
      score: score, correct: correctCount, total: questions.length,
      accuracy: acc, rank: rankInfo.rank, rankColor: rankInfo.color,
      maxCombo: maxCombo,
      b: diffResult[D.B], i: diffResult[D.I], a: diffResult[D.A]
    };

    saveHistory(lastResult);
    recordGameClear('milli-choice', score);
    el.resultOverlay.classList.add("active");
  }

  // ============================================
  // 履歴
  // ============================================
  function saveHistory(data) {
    try {
      var h = JSON.parse(localStorage.getItem("milliGames_history") || "[]");
      h.unshift({
        game: "Milli Choice",
        date: new Date().toISOString(),
        score: data.score, accuracy: data.accuracy,
        rank: data.rank, maxCombo: data.maxCombo
      });
      if (h.length > 50) h = h.slice(0, 50);
      localStorage.setItem("milliGames_history", JSON.stringify(h));
    } catch (e) {}
  }

  // ============================================
  // リトライ
  // ============================================
  function retry() {
    el.resultOverlay.classList.remove("active");
    el.startOverlay.classList.add("active");
    if (ytPlayer) { try { ytPlayer.pauseVideo(); } catch (e) {} }
  }

  // ============================================
  // 共有
  // ============================================
  function getXText() {
    if (!lastResult) return "";
    return "\uD83E\uDD14 Milli Choice \u3092\u30D7\u30EC\u30A4\uFF01\n" +
      "\u30B9\u30B3\u30A2: " + lastResult.score + "\n" +
      "\u6B63\u89E3\u7387: " + lastResult.accuracy + "%\n" +
      "\u30E9\u30F3\u30AF: " + lastResult.rank + "\n" +
      "\u6700\u5927\u30B3\u30F3\u30DC: " + lastResult.maxCombo + "\n" +
      "#MilliChoice #\u30DF\u30EA\u30D7\u30ED #MilliGames\n" +
      "https://milli-games.onrender.com/games/dotchi.html";
  }

  function loadImage(src) {
    return new Promise(function (r) {
      var img = new Image();
      img.onload = function () { r(img); };
      img.onerror = function () { r(null); };
      img.src = src;
    });
  }

  function generateShareImage() {
    if (!lastResult) return Promise.reject();
    var r = lastResult;
    var W = 360, H = 520, s = 2;
    var c = el.shareCanvas;
    c.width = W * s; c.height = H * s;
    var ctx = c.getContext("2d");
    ctx.scale(s, s);

    var bgMap = {
      "VfZaDBPnzqs": "../images/games/share/Milli Choice-share-nono.JPEG",
      "fHaRxiDVCjE": "../images/games/share/Milli Choice-share-rako.JPEG",
      "NAoBxWcJAG0": "../images/games/share/Milli Choice-share-koma.JPEG"
    };
    var bgSrc = bgMap[selectedVideoId] || "../images/games/share/Milli Choice-share-nono.JPEG";
    return Promise.all([
      loadImage("../images/games/rogo/Milli Choice-rogo.png"),
      loadImage(bgSrc)
    ]).then(function (imgs) {
      var rogoImg = imgs[0], bgImg = imgs[1];
      // background
      if (bgImg && bgImg.width > 0 && bgImg.height > 0) {
        ctx.drawImage(bgImg, 0, 0, W, H);
      } else {
        var g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, "#f5e6ff"); g.addColorStop(1, "#e8d4f0");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }

      // rogo at top
      var yBase = 12;
      if (rogoImg && rogoImg.width > 0 && rogoImg.height > 0) {
        var rogoW = 160;
        var rogoH = rogoW * rogoImg.height / rogoImg.width;
        ctx.drawImage(rogoImg, (W - rogoW) / 2, yBase, rogoW, rogoH);
        yBase = yBase + rogoH + 6;
      }

      // rank badge
      var rs = 72;
      var rankCY = yBase + 28;
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
      ctx.textAlign = "center";
      ctx.fillText(r.rank, W / 2, rankCY + rs / 2);

      // score
      var yPos = rankCY + rs + 12;
      ctx.textBaseline = "top";
      ctx.fillStyle = "#8582fb";
      ctx.font = "bold 28px -apple-system, sans-serif";
      ctx.fillText(r.score.toLocaleString(), W / 2, yPos);
      ctx.fillStyle = "rgba(45,27,78,0.3)";
      ctx.font = "12px -apple-system, sans-serif";
      ctx.fillText("SCORE", W / 2, yPos + 32);

      // bars
      yPos += 56;
      var barItems = [
        { label: "ACCURACY", val: r.accuracy, suffix: "%", color: "#8582fb" },
        { label: "MAX COMBO", val: r.maxCombo, suffix: "", color: "#dbbee1" }
      ];
      for (var bi = 0; bi < barItems.length; bi++) {
        ctx.fillStyle = "rgba(45,27,78,0.7)";
        ctx.textAlign = "left";
        ctx.font = "13px -apple-system, sans-serif";
        ctx.fillText(barItems[bi].label, 50, yPos);
        ctx.textAlign = "right";
        ctx.font = "bold 13px -apple-system, sans-serif";
        ctx.fillText(String(barItems[bi].val) + barItems[bi].suffix, W - 50, yPos);
        ctx.fillStyle = "rgba(45,27,78,0.12)";
        ctx.fillRect(50, yPos + 17, W - 100, 4);
        ctx.fillStyle = barItems[bi].color;
        var bv = typeof barItems[bi].val === "number" ? barItems[bi].val : 0;
        ctx.fillRect(50, yPos + 17, (W - 100) * Math.min(bv / 100, 1), 4);
        yPos += 40;
      }

      // divider
      ctx.strokeStyle = "rgba(45,27,78,0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, yPos);
      ctx.lineTo(W - 40, yPos);
      ctx.stroke();
      yPos += 10;

      // details header
      ctx.textBaseline = "top";
      ctx.fillStyle = "rgba(45,27,78,0.6)";
      ctx.font = "11px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("DETAILS", W / 2, yPos);
      yPos += 18;

      var items = [
        { label: "CORRECT", color: "#4caf50", val: r.correct },
        { label: "INCORRECT", color: "rgba(45,27,78,0.3)", val: r.total - r.correct },
        { label: "MAX COMBO", color: "#dbbee1", val: r.maxCombo },
        { label: "TOTAL Q", color: "#8582fb", val: r.total }
      ];
      for (var i = 0; i < items.length; i++) {
        ctx.fillStyle = "rgba(45,27,78,0.25)";
        ctx.textAlign = "left";
        ctx.font = "14px -apple-system, sans-serif";
        ctx.fillText(items[i].label, 55, yPos);
        ctx.fillStyle = items[i].color;
        ctx.textAlign = "right";
        ctx.fillText(String(items[i].val), W - 55, yPos);
        yPos += 24;
      }

      return new Promise(function (resolve) {
        c.toBlob(function (b) { resolve(b); }, "image/png");
      });
    });
  }

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

  function handleSave() {
    generateShareImage().then(function (blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = "milli_choice_result.png";
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
    });
  }

  function handleShare() {
    generateShareImage().then(function (blob) {
      var text = getXText();
      var file = new File([blob], "result.png", { type: "image/png" });
      if (navigator.share) {
        var data = { title: "Milli Choice", text: text };
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          data.files = [file];
        }
        navigator.share(data);
      } else {
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "milli_choice_result.png";
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
  // 初期化
  // ============================================
  el.btnStart.addEventListener("click", startGame);
  el.btnRetry.addEventListener("click", retry);
  el.btnSave.addEventListener("click", handleSave);
  el.btnShare.addEventListener("click", handleShare);
  el.btnX.addEventListener("click", handlePostX);

  el.questionCard.style.opacity = "0";
  el.questionCard.style.transform = "scale(0.9)";
})();
