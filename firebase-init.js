// Firebase 初期化・共通ヘルパ（Milli Games / Milli Unishare 共有バックエンド連携）
// 設定手順は「連携ハンドオフ.md」§6 を参照。
// config 未設定（apiKey が空）の間は連携機能は無効（エラーも出さない）
var firebaseReady = false;

function getFirebaseConfig() {
  if (typeof FIREBASE_CONFIG !== "undefined" && FIREBASE_CONFIG) return FIREBASE_CONFIG;
  if (typeof firebaseConfig !== "undefined" && firebaseConfig) return firebaseConfig;
  return null;
}

function initFirebase() {
  if (firebaseReady || typeof firebase === "undefined") return;
  var cfg = getFirebaseConfig();
  if (!cfg || !cfg.apiKey || !cfg.databaseURL) return;
  firebase.initializeApp(cfg);
  firebaseReady = true;
}

function firebaseAvailable() {
  return firebaseReady && typeof firebase !== "undefined";
}

// 本アプリ（Millipro-Chronicle）が保存する localStorage の playerId を読む
function getMilliproPlayerId() {
  try {
    var ud = JSON.parse(localStorage.getItem("millipro_userdata"));
    return ud && ud.playerId ? ud.playerId : null;
  } catch (e) { return null; }
}

// 連携IDの手動設定（ログイン不要フォールバック用・§1-4）
function setMilliproPlayerId(id) {
  var ud = null;
  try { ud = JSON.parse(localStorage.getItem("millipro_userdata")); } catch (e) {}
  if (!ud || typeof ud !== "object") ud = { createdAt: Date.now() };
  ud.playerId = String(id);
  ud.updatedAt = Date.now();
  localStorage.setItem("millipro_userdata", JSON.stringify(ud));
  return ud;
}

// ミニゲームクリアイベントを送信（ゲームIDはサイト内で一意な小文字・ハイフン形式）
function recordGameClear(gameId, score) {
  initFirebase();
  var pid = getMilliproPlayerId();
  if (!firebaseReady || !pid || !gameId) return;
  firebase.database().ref("millipro/gameEvents/" + pid + "/" + gameId + "/" + Date.now())
    .set({ score: score || 0, playedAt: Date.now() })
    .catch(function (e) { console.warn("gameEvent write failed", e); });
}

// ---------- アカウント連携（Firebase Auth・§2-4） ----------

function isAuthAvailable() {
  return firebaseAvailable() && typeof firebase.auth === "function";
}

function getMilliproUid() {
  if (!isAuthAvailable()) return null;
  var u = firebase.auth().currentUser;
  return u ? u.uid : null;
}

// ログイン状態の変化を監視（未ログイン/未設定なら null を渡す）
function onMilliproAuth(cb) {
  if (!isAuthAvailable()) { cb(null); return; }
  firebase.auth().onAuthStateChanged(function (user) {
    cb(user ? user.uid : null);
  });
}

function milliproLogin(email, password) {
  if (!isAuthAvailable()) return Promise.reject(new Error("auth unavailable"));
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

function milliproSignup(email, password) {
  if (!isAuthAvailable()) return Promise.reject(new Error("auth unavailable"));
  return firebase.auth().createUserWithEmailAndPassword(email, password);
}

function milliproLogout() {
  if (!isAuthAvailable()) return Promise.resolve();
  return firebase.auth().signOut();
}

// 最推し / 推しで使うタレントID一覧（全サイト共通・§2-4「最推し/推しの共有」）
var MILLIPRO_TALENTS = {
  konomi: { name: "甘狼このみ" },
  rizu:   { name: "雨夜リズ" },
  nono:   { name: "音ノ乃のの" },
  tukuri: { name: "眠雲ツクリ" },
  akubi:  { name: "あくび・でもんすぺーど" },
  nuhu:   { name: "虹深°ぬふ" },
  rako:   { name: "音ノ瀬らこ" },
  rei:    { name: "夕霧レイ" },
  yura:   { name: "ゆらぎゆら" },
  koma:   { name: "小廻こま" }
};

// パスワード再設定メールを送信（全サイト共通。リセット後に自サイトへ戻る）
function milliproResetPassword(email) {
  if (!isAuthAvailable()) return Promise.reject(new Error("auth unavailable"));
  return firebase.auth().sendPasswordResetEmail(String(email).trim(), {
    url: (typeof window !== "undefined" && window.location && window.location.origin) ? window.location.origin + "/" : "",
    handleCodeInApp: false
  });
}

function newPlayerIdFallback() {
  if (typeof crypto !== "undefined" && crypto && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return "P" + Date.now();
}

// プロフィールを保証する（無ければローカルの playerId / 名前 / アイコン / 一言で作成）→ Promise<profile>
function ensureMilliproProfile(uid) {
  var ud = null;
  try { ud = JSON.parse(localStorage.getItem("millipro_userdata")); } catch (e) {}
  var localId = ud && ud.playerId;
  var localName = ud && ud.playerName;
  var localIcon = ud && ud.icon;
  var localComment = ud && ud.comment;
  var localUltimateOshi = ud && MILLIPRO_TALENTS[ud.ultimateOshi] ? ud.ultimateOshi : null;
  var localFavorites = (ud && Array.isArray(ud.favorites)) ? ud.favorites.filter(function (id) { return MILLIPRO_TALENTS[id]; }).slice(0, 10) : [];

  return firebase.database().ref("millipro/users/" + uid + "/profile").once("value").then(function (snap) {
    var p = snap.val();
    var now = Date.now();
    if (p && typeof p === "object") {
      var changed = false;
      if (!p.playerId) { p.playerId = localId || newPlayerIdFallback(); changed = true; }
      if (!p.playerName && localName) { p.playerName = localName; changed = true; }
      if (!p.icon && localIcon) { p.icon = localIcon; changed = true; }
      if (!p.comment && localComment) { p.comment = localComment; changed = true; }
      if (!p.ultimateOshi && localUltimateOshi) { p.ultimateOshi = localUltimateOshi; changed = true; }
      if (!p.favorites && localFavorites.length) { p.favorites = localFavorites; changed = true; }
      if (changed) firebase.database().ref("millipro/users/" + uid + "/profile").set(p);
      return p;
    }
    var np = {
      playerId: localId || newPlayerIdFallback(),
      playerName: localName || "",
      icon: localIcon || "",
      comment: localComment || "",
      ultimateOshi: localUltimateOshi,
      favorites: localFavorites,
      updatedAt: now
    };
    firebase.database().ref("millipro/users/" + uid + "/profile").set(np);
    return np;
  });
}

// profile の playerId / playerName / icon / comment / 最推し / 推し をこの端末の localStorage に反映（他項目は保持）
function applyMilliproProfile(profile) {
  var ud = null;
  try { ud = JSON.parse(localStorage.getItem("millipro_userdata")); } catch (e) {}
  if (!ud || typeof ud !== "object") ud = { createdAt: Date.now() };
  ud.playerId = profile.playerId;
  if (profile.playerName) ud.playerName = profile.playerName;
  if (profile.icon) ud.icon = profile.icon;
  if (profile.comment) ud.comment = profile.comment;
  if (profile.ultimateOshi && MILLIPRO_TALENTS[profile.ultimateOshi]) ud.ultimateOshi = profile.ultimateOshi;
  if (Array.isArray(profile.favorites)) {
    ud.favorites = profile.favorites.filter(function (id) { return MILLIPRO_TALENTS[id]; }).slice(0, 10);
  }
  ud.updatedAt = Date.now();
  localStorage.setItem("millipro_userdata", JSON.stringify(ud));
  return ud;
}

// プロフィールの一部をクラウドに保存（ログイン中のみ。未ログインなら何もしない）
// patch 例: { icon: '😊' } や { playerName: '...', comment: '...' } や { ultimateOshi: 'konomi', favorites: [...] }
// 戻り値: Promise<boolean>（保存できたか）
function updateMilliproProfile(patch) {
  if (!isAuthAvailable()) return Promise.resolve(false);
  var uid = getMilliproUid();
  if (!uid) return Promise.resolve(false);
  if (!patch || typeof patch !== "object") return Promise.resolve(false);
  patch.updatedAt = Date.now();
  var ref = firebase.database().ref("millipro/users/" + uid + "/profile");
  return ref.once("value").then(function (snap) {
    var p = snap.val();
    if (p && typeof p === "object") return ref.update(patch);
    return ref.set(patch);
  }).then(function () { return true; }).catch(function (e) {
    console.warn("profile update failed:", e);
    return false;
  });
}

// 最推し / 推しをローカル（+ ログイン中はクラウド）に保存する
// 不正IDの除去・10人上限の切り詰めを自動で行う
// 戻り値: Promise<boolean>（クラウドに保存できたか。未ログインなら false）
function updateMilliproOshi(ultimateId, favIds) {
  var ud = null;
  try { ud = JSON.parse(localStorage.getItem("millipro_userdata")); } catch (e) {}
  if (!ud || typeof ud !== "object") ud = { createdAt: Date.now() };
  var ult = MILLIPRO_TALENTS[ultimateId] ? ultimateId : null;
  var favs = Array.isArray(favIds) ? favIds.filter(function (id) { return MILLIPRO_TALENTS[id]; }).slice(0, 10) : [];
  if (ult) {
    ud.ultimateOshi = ult;
    if (favs.indexOf(ult) < 0) favs.unshift(ult);
  } else {
    ud.ultimateOshi = null;
  }
  ud.favorites = favs.slice(0, 10);
  ud.updatedAt = Date.now();
  localStorage.setItem("millipro_userdata", JSON.stringify(ud));
  return updateMilliproProfile({ ultimateOshi: ud.ultimateOshi, favorites: ud.favorites });
}

// ローカルの最推し / 推しをまとめて返す
function getMilliproOshi() {
  var ud = null;
  try { ud = JSON.parse(localStorage.getItem("millipro_userdata")); } catch (e) {}
  var ult = ud && MILLIPRO_TALENTS[ud.ultimateOshi] ? ud.ultimateOshi : null;
  var favs = (ud && Array.isArray(ud.favorites)) ? ud.favorites.filter(function (id) { return MILLIPRO_TALENTS[id]; }).slice(0, 10) : [];
  return { ultimateOshi: ult, favorites: favs };
}

// ログイン時にまとめて実行（Unishare / Games 版。gamedata 同期は本アプリのみの仕事）
function completeMilliproLogin(uid) {
  return ensureMilliproProfile(uid).then(function (profile) {
    applyMilliproProfile(profile);
    return profile;
  });
}

// localStorage の連携情報と Auth メールをまとめて返す
function mpProfileInfo() {
  var ud = null;
  try { ud = JSON.parse(localStorage.getItem("millipro_userdata")); } catch (e) {}
  var pid = ud && ud.playerId ? ud.playerId : "";
  var name = ud && ud.playerName ? ud.playerName : "";
  var icon = ud && ud.icon ? ud.icon : "";
  var comment = ud && ud.comment ? ud.comment : "";
  var email = "";
  try {
    if (isAuthAvailable() && firebase.auth().currentUser) email = firebase.auth().currentUser.email || "";
  } catch (e) {}
  return { pid: pid, name: name, icon: icon, comment: comment, email: email };
}

// profile.icon (絵文字 or 画像 dataURL) を表示する（§2-4 参考実装と同じロジック）
function renderUserIcon(el, user) {
  if (!el) return;
  var icon = user && user.icon;
  if (typeof icon === "string" && icon.indexOf("data:image/") === 0) {
    el.innerHTML = '<img src="' + icon + '" alt="icon">';
  } else if (icon) {
    el.textContent = icon;
  } else {
    el.textContent = user && user.playerName ? user.playerName.charAt(0) : "?";
  }
}

// ---------- アカウント連携UI（Milli Orbis準拠・4モーダル） ----------

function mp$(id) { return document.getElementById(id); }

function mpOpenAcct(id) {
  var el = mp$(id);
  if (!el) return;
  el.classList.add("open");
  el.setAttribute("aria-hidden", "false");
}

function mpCloseAcct(id) {
  var el = mp$(id);
  if (!el) return;
  el.classList.remove("open");
  el.setAttribute("aria-hidden", "true");
}

function mpCloseAllAcct() {
  ["acctModal", "loginModal", "signupModal", "mypageModal", "password-reset-dialog"].forEach(mpCloseAcct);
  mpClose();
}

function mpWelcome(msg) {
  var el = mp$("mpWelcome");
  if (!el) { if (msg) alert(msg); return; }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(mpWelcome._t);
  mpWelcome._t = setTimeout(function () { el.classList.remove("show"); }, 2600);
}

function mpRender(uid) {
  var guest = mp$("mp-account-guest");
  var ok = mp$("mp-account-ok");
  var info = mpProfileInfo();
  var pid = getMilliproPlayerId() || uid || info.pid || "";
  if (guest && ok) {
    if (uid || pid) {
      guest.style.display = "none";
      ok.style.display = "block";
      var pidEl = mp$("mp-pid");
      if (pidEl) pidEl.textContent = pid;
      var nm = mp$("mp-profile-name");
      if (nm) nm.textContent = info.name || pid || "ゲスト";
      var cm = mp$("mp-profile-msg");
      if (cm) cm.textContent = info.comment || info.email || "";
      var ic = mp$("mp-profile-icon");
      if (ic) renderUserIcon(ic, { icon: info.icon, playerName: info.name || pid });
      var locked = mp$("mp-edit-locked");
      if (locked) locked.style.display = uid ? "none" : "block";
      mpRenderProviders();
    } else {
      guest.style.display = "block";
      ok.style.display = "none";
    }
  } else {
    // 旧UI互換（万が一新モーダルが無い場合）
    var form = mp$("mp-account-form");
    if (form && ok) {
      if (uid) {
        form.style.display = "none";
        ok.style.display = "block";
        var p2 = mp$("mp-pid");
        if (p2) p2.textContent = getMilliproPlayerId() || uid;
      } else {
        form.style.display = "block";
        ok.style.display = "none";
      }
    }
  }
  var ms = mp$("mp-menu-status");
  if (ms) {
    var cur = getMilliproPlayerId();
    ms.textContent = cur ? "連携ID: " + cur : "未連携";
    ms.classList.toggle("linked", !!cur);
  }
  var pl = mp$("profile-label");
  if (pl) pl.textContent = info.name || info.pid || "ゲスト";
  var picon = mp$("profile-header-icon");
  if (picon) {
    renderUserIcon(picon, info);
    picon.style.display = info.icon ? "" : "none";
  }
}

function mpRenderProviders() {
  var box = mp$("mp-link-providers");
  if (!box) return;
  if (!isAuthAvailable()) { box.innerHTML = ""; return; }
  var u = null;
  try { u = firebase.auth().currentUser; } catch (e) {}
  if (!u) { box.innerHTML = ""; return; }
  var providers = (u.providerData || []).map(function (p) { return p.providerId; });
  var html = '<p class="acct-hint" style="margin:0 0 6px;">連携中: ' + (providers.join(", ") || "メール") + '</p>';
  var hasGoogle = providers.indexOf("google.com") >= 0;
  var hasTwitter = providers.indexOf("twitter.com") >= 0;
  if (!hasGoogle || !hasTwitter) {
    html += '<div class="acct-row">';
    if (!hasGoogle) html += '<button type="button" onclick="mpLinkProvider(\'google\')">Google連携</button>';
    if (!hasTwitter) html += '<button type="button" onclick="mpLinkProvider(\'twitter\')">X連携</button>';
    html += "</div>";
  }
  box.innerHTML = html;
}

function mpLinkProvider(which) {
  var msg = mp$("mp-link-msg");
  if (!isAuthAvailable()) { if (msg) msg.textContent = "認証が無効です"; return; }
  var provider = null;
  try {
    if (which === "google") provider = new firebase.auth.GoogleAuthProvider();
    else provider = new firebase.auth.TwitterAuthProvider();
  } catch (e) { if (msg) msg.textContent = "このプロバイダは無効です"; return; }
  var user = firebase.auth().currentUser;
  if (!user) { if (msg) msg.textContent = "先にログインしてください"; return; }
  user.linkWithPopup(provider).then(function () {
    if (msg) msg.textContent = "連携しました";
    mpRender(getMilliproUid());
  }).catch(function (e) {
    if (msg) msg.textContent = mpAuthError(e);
  });
}

// ログイン / 新規登録のタブ切替（旧UI互換。新UIではモーダル切替に転送）
function mpTab(tab) {
  var loginPanel = mp$("mp-panel-login");
  var signupPanel = mp$("mp-panel-signup");
  if (!loginPanel || !signupPanel || !loginPanel.parentNode || loginPanel.offsetParent === null && !mp$("loginModal")) {
    if (tab === "signup") mpOpenSignup();
    else mpOpenLogin();
    return;
  }
  var loginTab = mp$("mp-tab-login");
  var signupTab = mp$("mp-tab-signup");
  loginPanel.style.display = tab === "login" ? "block" : "none";
  signupPanel.style.display = tab === "signup" ? "block" : "none";
  if (loginTab) loginTab.className = tab === "login" ? "mp-tab active" : "mp-tab";
  if (signupTab) signupTab.className = tab === "signup" ? "mp-tab active" : "mp-tab";
  var msg = mp$("mp-msg");
  if (msg) msg.textContent = "";
}

// パスワードの表示 / 非表示を切り替え
function mpToggle(inputId, btnId) {
  mpTogglePw(inputId);
  var input = mp$(inputId);
  var btn = btnId ? mp$(btnId) : null;
  if (input && btn) btn.textContent = input.type === "text" ? "🙈" : "👁";
}

function mpTogglePw(inputId) {
  var input = mp$(inputId);
  if (!input) return;
  var show = input.type === "password";
  input.type = show ? "text" : "password";
  var btn = input.parentNode ? input.parentNode.querySelector(".acct-pw-btn") : null;
  if (btn) btn.textContent = show ? "🙈" : "👁";
}

function mpAuthError(e) {
  var j = e && e.code ? e.code : String(e);
  if (j.indexOf("email-already-in-use") >= 0) return "そのメールは既に登録されています。ログインしてください";
  if (j.indexOf("wrong-password") >= 0 || j.indexOf("user-not-found") >= 0 || j.indexOf("invalid-credential") >= 0) return "メールまたはパスワードが違います";
  if (j.indexOf("weak-password") >= 0) return "パスワードは6文字以上にしてください";
  if (j.indexOf("invalid-email") >= 0) return "メールアドレスの形式が正しくありません";
  if (j.indexOf("auth unavailable") >= 0 || j.indexOf("operation-not-allowed") >= 0) return "このログイン方法は現在無効です。連携IDをご利用ください";
  if (j.indexOf("popup-closed-by-user") >= 0 || j.indexOf("cancelled-popup-request") >= 0) return "キャンセルされました";
  if (j.indexOf("account-exists-with-different-credential") >= 0) return "別の方法で登録済みです。元の方法でログインしてください";
  return "エラー: " + j;
}

function mpRead(idList) {
  for (var i = 0; i < idList.length; i++) {
    var el = mp$(idList[i]);
    if (el && typeof el.value === "string" && el.value.trim() !== "") return el.value.trim();
  }
  return "";
}

function mpSubmit(isSignup) {
  if (isSignup) mpSubmitSignup();
  else mpSubmitLogin();
}

function mpSubmitLogin() {
  var email = mpRead(["mp-email"]);
  var passEl = mp$("mp-pass");
  var pass = passEl ? passEl.value : "";
  var msg = mp$("mp-msg-login") || mp$("mp-msg");
  if (!msg) return;
  if (!email || !pass) { msg.textContent = "メールとパスワードを入力してください"; return; }
  milliproLogin(email, pass).then(function () {
    msg.textContent = "連携しました。反映中...";
    mpWelcome("ログインしました");
  }).catch(function (e) {
    msg.textContent = mpAuthError(e);
  });
}

function mpSubmitSignup() {
  var email = mpRead(["mp-semail", "mp2-email"]);
  var p1 = mp$("mp-spass1") || mp$("mp2-pass");
  var p2 = mp$("mp-spass2") || mp$("mp2-pass2");
  var msg = mp$("mp-msg-signup") || mp$("mp2-msg") || mp$("mp-msg");
  if (!p1 || !p2 || !msg) return;
  if (!email || !p1.value) { msg.textContent = "メールとパスワードを入力してください"; return; }
  if (p1.value !== p2.value) { msg.textContent = "パスワードが一致しません"; return; }
  // 旧IDにも同期（互換）
  var oe = mp$("mp2-email");
  if (oe && !oe.value) oe.value = email;
  milliproSignup(email, p1.value).then(function () {
    msg.textContent = "登録しました。反映中...";
    mpWelcome("登録しました");
  }).catch(function (e) {
    msg.textContent = mpAuthError(e);
  });
}

function mpOAuthLogin(which) {
  var msg = mp$("mp-msg-login") || mp$("mp-msg-signup") || mp$("mp-msg");
  if (!isAuthAvailable()) {
    var m = "このログイン方法は現在無効です。連携IDをご利用ください";
    if (msg) msg.textContent = m; else alert(m);
    return;
  }
  var provider = null;
  try {
    if (which === "google") provider = new firebase.auth.GoogleAuthProvider();
    else provider = new firebase.auth.TwitterAuthProvider();
  } catch (e) {
    if (msg) msg.textContent = "このログイン方法は無効です";
    return;
  }
  firebase.auth().signInWithPopup(provider).then(function () {
    mpWelcome("ログインしました");
  }).catch(function (e) {
    if (msg) msg.textContent = mpAuthError(e);
  });
}

// パスワード再設定（旧mpResetPassword互換＋新ダイアログ用）
function mpResetPassword() {
  var email = mpRead(["mp-email", "reset-email"]);
  if (!email) { alert("メールアドレスを入力してください"); return; }
  milliproResetPassword(email).then(function () {
    alert("再設定メールを送信しました。メールのリンクからパスワードを再設定してください。");
  }).catch(function (e) {
    var j = e && e.code ? e.code : String(e);
    if (j.indexOf("user-not-found") >= 0) alert("そのメールアドレスは登録されていません");
    else if (j.indexOf("invalid-email") >= 0) alert("メールアドレスの形式が正しくありません");
    else if (j.indexOf("too-many-requests") >= 0) alert("試行回数が多すぎます。しばらくしてから再度お試しください");
    else alert("送信に失敗しました: " + j);
  });
}

function mpOpenReset() {
  var em = mp$("mp-email");
  var re = mp$("reset-email");
  if (em && re && em.value && !re.value) re.value = em.value;
  mpCloseAllAcct();
  mpOpenAcct("password-reset-dialog");
}

function mpResetSubmit() {
  var email = (mp$("reset-email") ? mp$("reset-email").value : "").trim();
  var msg = mp$("reset-msg");
  if (!email) { if (msg) msg.textContent = "メールアドレスを入力してください"; return; }
  milliproResetPassword(email).then(function () {
    if (msg) msg.textContent = "送信しました。メールをご確認ください";
  }).catch(function (e) {
    if (msg) msg.textContent = mpAuthError(e);
  });
}

function mpCloseReset() {
  mpCloseAcct("password-reset-dialog");
  mpOpenAcct("loginModal");
}

function mpOpen() {
  mpOpenAccount();
}

function mpClose() {
  var popup = mp$("login-popup");
  if (popup) popup.classList.remove("open");
  mpCloseAllAcct();
}

function mpOpenAccount() {
  mpRender(getMilliproUid());
  mpCloseAllAcct();
  mpOpenAcct("acctModal");
}

function mpOpenLogin() {
  mpCloseAllAcct();
  var m = mp$("mp-msg-login");
  if (m) m.textContent = "";
  mpOpenAcct("loginModal");
}

function mpOpenSignup() {
  mpCloseAllAcct();
  var m = mp$("mp-msg-signup");
  if (m) m.textContent = "";
  mpOpenAcct("signupModal");
}

function mpOpenLinkId() {
  mpCloseAllAcct();
  mpOpenAcct("acctModal");
  setTimeout(function () {
    var el = mp$("mp-id");
    if (el) el.focus();
  }, 100);
}

function mpStartEdit() {
  var info = mpProfileInfo();
  var edit = mp$("mp-account-edit");
  if (!edit) return;
  var uid = getMilliproUid();
  if (!uid) {
    var locked = mp$("mp-edit-locked");
    if (locked) locked.style.display = "block";
    return;
  }
  edit.style.display = "block";
  if (mp$("mp-pname")) mp$("mp-pname").value = info.name || "";
  if (mp$("mp-pmsg")) mp$("mp-pmsg").value = info.comment || "";
  if (mp$("mp-picon")) mp$("mp-picon").value = info.icon || "";
  if (mp$("mp-edit-name")) mp$("mp-edit-name").value = info.name || "";
  mpUpdatePiconPreview();
}

function mpCancelEdit() {
  var edit = mp$("mp-account-edit");
  if (edit) edit.style.display = "none";
  var note = mp$("mp-edit-note");
  if (note) note.textContent = "";
}

function mpUpdatePiconPreview() {
  var prev = mp$("mp-picon-preview");
  var inp = mp$("mp-picon");
  var prev2 = mp$("mp-edit-icon-preview");
  if (!prev || !inp) return;
  var v = inp.value || "";
  if (v.indexOf("http") === 0 || v.indexOf("data:image/") === 0) {
    prev.innerHTML = '<img src="' + v.replace(/"/g, "") + '" alt="icon">';
    if (prev2) prev2.textContent = v;
  } else if (v) {
    prev.textContent = v;
    if (prev2) prev2.textContent = v;
  } else {
    var info = mpProfileInfo();
    renderUserIcon(prev, info);
  }
}

function mpPickEmoji(emoji) {
  var inp = mp$("mp-picon");
  if (inp) {
    inp.value = emoji;
    mpUpdatePiconPreview();
  }
}

function mpPickIconFile(input) {
  var f = input && input.files && input.files[0];
  if (!f) return;
  if (f.size > 200 * 1024) {
    var note = mp$("mp-edit-note");
    if (note) note.textContent = "画像は200KB以下にしてください";
    return;
  }
  var r = new FileReader();
  r.onload = function () {
    var inp = mp$("mp-picon");
    if (inp) {
      inp.value = r.result;
      mpUpdatePiconPreview();
    }
  };
  r.readAsDataURL(f);
}

function mpSaveProfile() {
  var note = mp$("mp-edit-note");
  var uid = getMilliproUid();
  if (!uid) {
    if (note) note.textContent = "ログイン後に使えます";
    return;
  }
  var name = mp$("mp-pname") ? mp$("mp-pname").value.trim() : (mp$("mp-edit-name") ? mp$("mp-edit-name").value.trim() : "");
  var icon = mp$("mp-picon") ? mp$("mp-picon").value.trim() : "";
  var comment = mp$("mp-pmsg") ? mp$("mp-pmsg").value.trim() : "";
  if (/公式|運営|ミリプロ|Million/i.test(name)) {
    if (note) note.textContent = "公式と誤解される名前は使えません";
    return;
  }
  if (note) note.textContent = "保存中...";
  updateMilliproProfile({ playerName: name, icon: icon, comment: comment }).then(function (okFlag) {
    try {
      var ud = JSON.parse(localStorage.getItem("millipro_userdata") || "{}");
      ud.playerName = name;
      ud.icon = icon;
      ud.comment = comment;
      ud.updatedAt = Date.now();
      localStorage.setItem("millipro_userdata", JSON.stringify(ud));
    } catch (e) {}
    if (note) note.textContent = okFlag ? "保存しました" : "端末に保存しました（クラウド未反映）";
    mpRender(uid);
    if (typeof mpRefreshMypage === "function") mpRefreshMypage();
  });
}

// ---------- マイページ（モーダル完結） ----------

function mpGameHistory() {
  try { return JSON.parse(localStorage.getItem("milliGames_history") || "[]"); } catch (e) { return []; }
}

function mpRefreshMypage() {
  var box = mp$("mp-mypage-stats");
  if (!box) return;
  var info = mpProfileInfo();
  var history = mpGameHistory();
  var plays = history.length;
  var games = {};
  var best = null;
  history.forEach(function (h) {
    if (h && h.game) games[h.game] = (games[h.game] || 0) + 1;
    if (h && typeof h.score === "number") {
      if (!best || h.score > best.score) best = h;
    }
  });
  var gameCount = Object.keys(games).length;
  var html = '<div class="acct-profile">'
    + '<div class="acct-avatar" id="mp-mypage-icon">?</div>'
    + '<div><div style="font-size:15px;font-weight:800;">' + escapeHtml(info.name || info.pid || "ゲスト") + '</div>'
    + '<div style="font-size:12px;color:var(--text-secondary);">' + escapeHtml(info.pid ? "連携ID: " + info.pid : "未連携") + '</div></div>'
    + "</div>"
    + '<div class="mp-stat-grid">'
    + '<div class="mp-stat-card"><div class="mp-stat-num">' + plays + '</div><div class="mp-stat-cap">プレイ回数</div></div>'
    + '<div class="mp-stat-card"><div class="mp-stat-num">' + gameCount + '</div><div class="mp-stat-cap">遊んだゲーム数</div></div>'
    + "</div>";
  if (best) {
    html += '<div class="mp-stat-row"><span class="mp-stat-label">ベスト: ' + escapeHtml(String(best.game || "")) + '</span><span class="mp-stat-val">' + escapeHtml(String(best.score)) + '</span></div>';
  }
  if (info.comment) html += '<div class="mp-stat-row"><span class="mp-stat-label">一言</span></div><p class="acct-hint">' + escapeHtml(info.comment) + '</p>';
  var names = Object.keys(games).sort().slice(0, 8);
  if (names.length) {
    html += '<div class="mp-stat-row"><span class="mp-stat-label">最近遊んだゲーム</span></div><p class="acct-hint">' + names.map(escapeHtml).join(" / ") + "</p>";
  } else {
    html += '<p class="acct-hint">まだプレイ履歴がありません。各ゲームをプレイするとここに表示されます。</p>';
  }
  html += '<div class="acct-row" style="margin-top:12px;"><button type="button" onclick="mpOpenAccount()">アカウント設定を開く</button></div>'
    + '<p class="acct-hint" style="text-align:center;">お問い合わせは <a href="https://milli-orbis-portal.pages.dev/contact.html" target="_blank" rel="noopener">こちら（Milli Games枠）</a></p>';
  box.innerHTML = html;
  var mi = mp$("mp-mypage-icon");
  if (mi) renderUserIcon(mi, info);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
  });
}

function mpOpenMypage() {
  mpCloseAllAcct();
  mpRefreshMypage();
  mpOpenAcct("mypageModal");
}

// ---------- 連携案内バナー（ログイン任意・§2-4） ----------

// 未ログイン & 連携ID未設定ならバナーを表示（ページ表示時に毎回判定。あとで閉じても次回また出る）
function mpRefreshBanner() {
  var b = mp$("mp-banner");
  if (!b) return;
  var connected = (isAuthAvailable() && getMilliproUid()) || !!getMilliproPlayerId();
  b.style.display = connected ? "none" : "flex";
}

function mpHideBanner() {
  var b = mp$("mp-banner");
  if (b) b.style.display = "none";
}

// 「連携する」→ アカウント連携UI（モーダル）を開いて案内する
function mpOpenAccountCompat() {
  mpOpenAccount();
}

function mpLogout() {
  milliproLogout().then(function () { mpRender(null); mpRefreshBanner(); });
}

function mpCopyId() {
  var pid = getMilliproPlayerId();
  if (!pid) { alert("連携IDが未設定です"); return; }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(pid).then(function () { alert("コピーしました: " + pid); });
  } else {
    var t = document.createElement("textarea");
    t.value = pid;
    document.body.appendChild(t);
    t.select();
    document.execCommand("copy");
    t.remove();
    alert("コピーしました: " + pid);
  }
}

function mpSetId() {
  var el = mp$("mp-id");
  var v = el ? el.value.trim() : "";
  if (!v) return;
  setMilliproPlayerId(v);
  mpRender(getMilliproUid());
  mpRefreshBanner();
  mpWelcome("連携IDを保存しました");
}

initFirebase();

// 画面初期化時に1回呼ぶ（auth 未設定でも mpRender(null) になるだけで安全）
onMilliproAuth(function (uid) {
  if (uid) {
    completeMilliproLogin(uid).then(function () {
      mpRender(uid);
      mpRefreshBanner();
    });
  } else {
    mpRender(null);
    mpRefreshBanner();
  }
});

document.addEventListener("click", function (e) {
  var t = e.target;
  if (t && t.dataset && t.dataset.close) {
    mpCloseAcct(t.dataset.close);
    return;
  }
  if (t && t.classList && t.classList.contains("acct-overlay")) {
    t.classList.remove("open");
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") mpCloseAllAcct();
});

// フォームのEnterキーで送信
(function () {
  function bindEnter(id, fn) {
    var el = mp$(id);
    if (el) el.addEventListener("keydown", function (e) { if (e.key === "Enter") fn(); });
  }
  bindEnter("mp-email", function () { mpSubmitLogin(); });
  bindEnter("mp-pass", function () { mpSubmitLogin(); });
  bindEnter("mp-semail", function () { mpSubmitSignup(); });
  bindEnter("mp-spass1", function () { mpSubmitSignup(); });
  bindEnter("mp-spass2", function () { mpSubmitSignup(); });
  bindEnter("reset-email", function () { mpResetSubmit(); });
  bindEnter("mp-id", function () { mpSetId(); });
  var oldClose = mp$("mp-popup-close");
  if (oldClose) oldClose.addEventListener("click", function () { mpClose(); });
})();
