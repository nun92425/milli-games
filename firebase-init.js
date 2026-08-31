// Firebase 初期化（config 未設定なら何もしない）
// config 変数名は Firebase コンソール貼り付け時の firebaseConfig と、
// ハンドオフ資料記載の FIREBASE_CONFIG のどちらでも受け付ける
var firebaseReady = false

function getFirebaseConfig() {
  if (typeof FIREBASE_CONFIG !== 'undefined' && FIREBASE_CONFIG) return FIREBASE_CONFIG
  if (typeof firebaseConfig !== 'undefined' && firebaseConfig) return firebaseConfig
  return null
}

function initFirebase() {
  if (firebaseReady || typeof firebase === 'undefined') return
  var cfg = getFirebaseConfig()
  if (!cfg || !cfg.apiKey || !cfg.databaseURL) return
  try {
    firebase.initializeApp(cfg)
    firebaseReady = true
  } catch (e) {
    console.warn('Firebase init failed:', e)
  }
}

// 連携が利用可能か（config 設定済み + SDK 読込済み）
function firebaseAvailable() {
  initFirebase()
  // database SDK が読込めていない場合は利用不可扱い（部分的なCDN障害で例外を出さない）
  return firebaseReady && typeof firebase.database === 'function'
}

// 本アプリが発行した playerId を取得（milli-unishare / milli-games と共通形式）
function getMilliproPlayerId() {
  try {
    var ud = JSON.parse(localStorage.getItem('millipro_userdata'))
    return ud && ud.playerId ? ud.playerId : null
  } catch (e) {
    return null
  }
}

// 連携IDを手動設定（ログイン不要の「ID持ち込み方式」用。各サイトの入力UIから呼ぶ）
function setMilliproPlayerId(id) {
  var ud = null
  try { ud = JSON.parse(localStorage.getItem('millipro_userdata')) } catch (e) {}
  if (!ud || typeof ud !== 'object') ud = { createdAt: Date.now() }
  ud.playerId = String(id)
  ud.updatedAt = Date.now()
  localStorage.setItem('millipro_userdata', JSON.stringify(ud))
  return ud
}

// ミニゲームクリアイベントを送信（Milli Games用・ゲームIDはサイト内で一意な小文字・ハイフン形式）
function recordGameClear(gameId, score) {
  initFirebase()
  var pid = getMilliproPlayerId()
  if (!firebaseReady || !pid || !gameId) return
  firebase.database().ref('millipro/gameEvents/' + pid + '/' + gameId + '/' + Date.now())
    .set({ score: score || 0, playedAt: Date.now() })
    .catch(function (e) { console.warn('gameEvent write failed', e) })
}

// ============================================================
// Milli Orbis アカウント（Firebase Auth）: 3サイトすべてが同じユーザーを使う
// 中心は Milli Orbis。データパスは従来どおり millipro/ 配下
//   millipro/users/{uid}/profile = { playerId, playerName, icon, comment, updatedAt }
//   millipro/users/{uid}/gamedata = ゲームデータ（本アプリのみ同期）
// 名前・アイコン・一言は各サイト共通で表示できる（各サイトのローカルに反映）
// ============================================================

// 全サイト共通のタレント一覧（単一ソース）。全サイト共通プロフィール(最推し/推し)の他、
// 本アプリのセットアップ・ダンジョンの「推し選択」・アイコン等でも参照する。
// battle: 配信ダンジョンでのタイプ別バフ（±15%程度、勝率を壊さない範囲）
//   atk型=次の一撃重視 / def型=被ダメを抑える / balance=平均
var MILLIPRO_TALENTS = {
  konomi: { name: '甘狼このみ', group: null, battle: { atk: 1.0,  def: 1.0  } },
  nono:   { name: '音ノ乃のの',   group: null, battle: { atk: 1.0,  def: 1.0  } },
  akubi:  { name: 'あくび・でもんすぺーど', group: null, battle: { atk: 1.15, def: 0.9  } },
  rako:   { name: '音ノ瀬らこ',   group: 'nova', battle: { atk: 1.15, def: 0.9  } },
  yura:   { name: 'ゆらぎゆら',   group: 'nova', battle: { atk: 0.9,  def: 1.2  } },
  koma:   { name: '小廻こま',     group: null, battle: { atk: 0.9,  def: 1.2  } },
  rizu:   { name: '雨夜リズ',     group: 'uni',  battle: { atk: 1.15, def: 0.9  } },
  tukuri: { name: '眠雲ツクリ',   group: 'uni',  battle: { atk: 0.9,  def: 1.2  } },
  nuhu:   { name: '虹深°ぬふ',    group: 'nova', battle: { atk: 1.0,  def: 1.0  } },
  rei:    { name: '夕霧レイ',     group: 'uni',  battle: { atk: 1.15, def: 0.9  } },
  mahoro: { name: '鹿乃まほろ',   group: null, battle: { atk: 1.0,  def: 1.0  } },
}

// 最推し/推しをローカル（millipro_userdata）から取得
// ログイン後は applyMilliproProfile でクラウドの値が反映済み
// 戻り値: { ultimateOshi: string|null, favorites: string[] }
function getMilliproOshi() {
  var ud = null
  try { ud = JSON.parse(localStorage.getItem('millipro_userdata')) } catch (e) {}
  var ultimate = ud && MILLIPRO_TALENTS[ud.ultimateOshi] ? ud.ultimateOshi : null
  var favs = (ud && Array.isArray(ud.favorites)) ? ud.favorites.filter(function (id) { return MILLIPRO_TALENTS[id] }).slice(0, 10) : []
  return { ultimateOshi: ultimate, favorites: favs }
}

// 最推し/推しをローカル + クラウド（ログイン中のみ）に保存
// クラウドの profile.ultimateOshi / profile.favorites は全サイト共通
// 戻り値: Promise<boolean>（クラウドに保存できたか。未ログインでもローカル保存は行う）
function updateMilliproOshi(ultimateOshi, favorites) {
  var ud = null
  try { ud = JSON.parse(localStorage.getItem('millipro_userdata')) } catch (e) {}
  if (!ud || typeof ud !== 'object') ud = { createdAt: Date.now() }
  var ult = ultimateOshi && MILLIPRO_TALENTS[ultimateOshi] ? ultimateOshi : null
  var favs = (Array.isArray(favorites) ? favorites : []).filter(function (id) { return MILLIPRO_TALENTS[id] }).slice(0, 10)
  ud.ultimateOshi = ult
  ud.favorites = favs
  ud.updatedAt = Date.now()
  localStorage.setItem('millipro_userdata', JSON.stringify(ud))
  var uid = getMilliproUid()
  if (!uid) return Promise.resolve(false)
  return updateMilliproProfile({ ultimateOshi: ult, favorites: favs })
}

function isAuthAvailable() {
  return firebaseAvailable() && typeof firebase.auth === 'function'
}

function getMilliproUid() {
  if (!isAuthAvailable()) return null
  var u = firebase.auth().currentUser
  return u ? u.uid : null
}

// ログイン状態の変化を監視（未ログイン/未設定なら null を渡す）
function onMilliproAuth(cb) {
  if (!isAuthAvailable()) {
    cb(null)
    return
  }
  firebase.auth().onAuthStateChanged(function (user) {
    cb(user ? user.uid : null)
  })
}

function milliproLogin(email, password) {
  if (!isAuthAvailable()) return Promise.reject(new Error('auth unavailable'))
  return firebase.auth().signInWithEmailAndPassword(email, password)
}

function milliproSignup(email, password) {
  if (!isAuthAvailable()) return Promise.reject(new Error('auth unavailable'))
  return firebase.auth().createUserWithEmailAndPassword(email, password)
}

function milliproLogout() {
  if (!isAuthAvailable()) return Promise.resolve()
  return firebase.auth().signOut()
}

// ============================================================
// OAuth ログイン（Google / X）: 無料枠のまま利用可能
// Apple は Apple Developer Program が必要なため本リポジトリでは未対応
// Discord / LINE は Firebase ネイティブ非対応（Functions 等のバックエンドが必要）のため未対応
// ============================================================

// アプリ内ブラウザ（X / LINE / Instagram 等）は popup がブロックされるため redirect を使う
function isOAuthInAppBrowser() {
  var ua = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : ''
  return /Twitter|Line|Instagram|FBAN|FBAV|FB_IAB|FBAN\/Messenger/i.test(ua)
}

function signInWithOAuthProvider(provider) {
  if (!isAuthAvailable()) return Promise.reject(new Error('auth unavailable'))
  // アプリ内ブラウザでは最初から redirect
  if (isOAuthInAppBrowser()) {
    return firebase.auth().signInWithRedirect(provider)
  }
  return firebase.auth().signInWithPopup(provider).catch(function (e) {
    // popup がブロックされた場合は redirect にフォールバック
    if (e && (e.code === 'auth/popup-blocked' || e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request')) {
      // popup-blocked 時のみ redirect、それ以外はそのまま失敗として扱う（ユーザが閉じた等はエラー表示で十分）
      if (e.code === 'auth/popup-blocked') {
        return firebase.auth().signInWithRedirect(provider)
      }
    }
    return Promise.reject(e)
  })
}

function milliproLoginWithGoogle() {
  if (!isAuthAvailable()) return Promise.reject(new Error('auth unavailable'))
  var provider = new firebase.auth.GoogleAuthProvider()
  // 既存アカウントとリンクしやすいよう prompt を追加（任意）
  try { provider.setCustomParameters({ prompt: 'select_account' }) } catch (e) {}
  return signInWithOAuthProvider(provider)
}

function milliproLoginWithTwitter() {
  if (!isAuthAvailable()) return Promise.reject(new Error('auth unavailable'))
  var provider = new firebase.auth.TwitterAuthProvider()
  return signInWithOAuthProvider(provider)
}

// リダイレクトで戻ってきた直後の結果を回収する（エラー表示用）
// onAuthStateChanged でも uid は取れるが、account-exists-with-different-credential 等の
// エラーは getRedirectResult の reject でしか取れないため、起動時に一度呼ぶ
function consumeMilliproRedirectResult() {
  if (!isAuthAvailable() || typeof firebase.auth().getRedirectResult !== 'function') return Promise.resolve(null)
  return firebase.auth().getRedirectResult().catch(function (e) {
    return Promise.reject(e)
  })
}

function oauthErrorMessage(e) {
  if (!e || !e.code) return (e && e.message) || 'エラーが発生しました。'
  if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') return 'ログインがキャンセルされました。'
  if (e.code === 'auth/popup-blocked') return 'ポップアップがブロックされました。リダイレクトで再試行しています...'
  if (e.code === 'auth/account-exists-with-different-credential') return 'このメールアドレスは既に別のログイン方法（メール/ Google / X）で登録されています。元の方法でログインした後、マイページで紐付けてください。'
  if (e.code === 'auth/credential-already-in-use') return 'この Google/X アカウントは既に別のアカウントに紐付けられています。'
  if (e.code === 'auth/requires-recent-login') return 'セキュリティのため再ログインが必要です。一度ログアウトして再ログインしてください。'
  if (e.code === 'auth/network-request-failed') return '通信エラーです。接続を確認してください。'
  if (e.code === 'auth/user-disabled') return 'このアカウントは無効化されています。'
  if (e.code === 'auth/operation-not-allowed') return 'このログイン方法は現在無効です。管理者にお問い合わせください。'
  return e.message || 'エラーが発生しました。'
}

// ---- アカウント紐付け（ログイン中に別プロバイダを追加） ----
function getLinkedProviders() {
  if (!isAuthAvailable()) return []
  var u = firebase.auth().currentUser
  if (!u || !u.providerData) return []
  return u.providerData.map(function (p) { return p.providerId })
}

function linkWithOAuthProvider(provider) {
  if (!isAuthAvailable()) return Promise.reject(new Error('auth unavailable'))
  var user = firebase.auth().currentUser
  if (!user) return Promise.reject(new Error('not logged in'))
  if (isOAuthInAppBrowser()) {
    return user.linkWithRedirect(provider)
  }
  return user.linkWithPopup(provider).catch(function (e) {
    if (e && e.code === 'auth/popup-blocked') {
      return user.linkWithRedirect(provider)
    }
    return Promise.reject(e)
  })
}

function milliproLinkWithGoogle() {
  if (!isAuthAvailable()) return Promise.reject(new Error('auth unavailable'))
  var provider = new firebase.auth.GoogleAuthProvider()
  try { provider.setCustomParameters({ prompt: 'select_account' }) } catch (e) {}
  return linkWithOAuthProvider(provider)
}

function milliproLinkWithTwitter() {
  if (!isAuthAvailable()) return Promise.reject(new Error('auth unavailable'))
  var provider = new firebase.auth.TwitterAuthProvider()
  return linkWithOAuthProvider(provider)
}

function milliproUnlink(providerId) {
  if (!isAuthAvailable()) return Promise.reject(new Error('auth unavailable'))
  var user = firebase.auth().currentUser
  if (!user) return Promise.reject(new Error('not logged in'))
  if (!providerId) return Promise.reject(new Error('no provider'))
  // 最低1つは残す（Firebase 側でも弾かれるが先にガード）
  var linked = getLinkedProviders()
  if (linked.length <= 1) return Promise.reject({ code: 'auth/no-such-provider', message: '最後のログイン方法は解除できません。' })
  return user.unlink(providerId)
}

function milliproUnlinkWithGoogle() { return milliproUnlink('google.com') }
function milliproUnlinkWithTwitter() { return milliproUnlink('twitter.com') }
function milliproUnlinkWithPassword() { return milliproUnlink('password') }

// パスワード再設定メールを送信（どのサイトからでも共通アカウントに対して送れる）
// リセット後に戻る URL は呼び出し元サイトのオリジンを指定する（他のサイトでも同じ関数を使う）
function milliproResetPassword(email) {
  if (!isAuthAvailable()) return Promise.reject(new Error('auth unavailable'))
  return firebase.auth().sendPasswordResetEmail(String(email).trim(), {
    url: (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin + '/' : '',
    handleCodeInApp: false,
  })
}

function newPlayerIdFallback() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return 'P' + Date.now()
}

// プロフィールを保証する（無ければローカルの playerId / 名前 / アイコン / 一言で作成）
// 既存プロフィールに欠けている項目はローカル値で補充する
// 戻り値: Promise<profile>
function ensureMilliproProfile(uid) {
  var ud = null
  try { ud = JSON.parse(localStorage.getItem('millipro_userdata')) } catch (e) {}
  var localId = ud && ud.playerId
  var localName = ud && ud.playerName
  var localIcon = ud && ud.icon
  var localComment = ud && ud.comment
  var localUltimateOshi = ud && MILLIPRO_TALENTS[ud.ultimateOshi] ? ud.ultimateOshi : null
  var localFavorites = (ud && Array.isArray(ud.favorites)) ? ud.favorites.filter(function (id) { return MILLIPRO_TALENTS[id] }).slice(0, 10) : []

  return firebase.database().ref('millipro/users/' + uid + '/profile').once('value').then(function (snap) {
    var p = snap.val()
    var now = Date.now()
    if (p && typeof p === 'object') {
      var changed = false
      if (!p.playerId) { p.playerId = localId || newPlayerIdFallback(); changed = true }
      if (!p.playerName && localName) { p.playerName = localName; changed = true }
      if (!p.icon && localIcon) { p.icon = localIcon; changed = true }
      if (!p.comment && localComment) { p.comment = localComment; changed = true }
      if (!p.ultimateOshi && localUltimateOshi) { p.ultimateOshi = localUltimateOshi; changed = true }
      if (!p.favorites && localFavorites.length) { p.favorites = localFavorites; changed = true }
      if (changed) firebase.database().ref('millipro/users/' + uid + '/profile').set(p)
      return p
    }
    var np = {
      playerId: localId || newPlayerIdFallback(),
      playerName: localName || '',
      icon: localIcon || '',
      comment: localComment || '',
      ultimateOshi: localUltimateOshi,
      favorites: localFavorites,
      updatedAt: now,
    }
    firebase.database().ref('millipro/users/' + uid + '/profile').set(np)
    return np
  })
}

// プロフィールの playerId / playerName / icon / comment をこの端末の localStorage に反映（他項目は保持）
// 戻り値: 反映後のユーザーデータ（なければ新規作成）
function applyMilliproProfile(profile) {
  var ud = null
  try { ud = JSON.parse(localStorage.getItem('millipro_userdata')) } catch (e) {}
  if (!ud || typeof ud !== 'object') ud = { createdAt: Date.now() }
  ud.playerId = profile.playerId
  if (profile.playerName) ud.playerName = profile.playerName
  if (profile.icon) ud.icon = profile.icon
  if (profile.comment) ud.comment = profile.comment
  if (profile.ultimateOshi && MILLIPRO_TALENTS[profile.ultimateOshi]) ud.ultimateOshi = profile.ultimateOshi
  if (Array.isArray(profile.favorites)) {
    ud.favorites = profile.favorites.filter(function (id) { return MILLIPRO_TALENTS[id] }).slice(0, 10)
  }
  ud.updatedAt = Date.now()
  localStorage.setItem('millipro_userdata', JSON.stringify(ud))
  return ud
}

// プロフィールの一部をクラウドに保存（ログイン中のみ。未ログインなら何もしない）
// patch 例: { icon: '😊' } や { playerName: '...', comment: '...' }
// 戻り値: Promise<boolean>（保存できたか）
function updateMilliproProfile(patch) {
  if (!isAuthAvailable()) return Promise.resolve(false)
  var uid = getMilliproUid()
  if (!uid) return Promise.resolve(false)
  if (!patch || typeof patch !== 'object') return Promise.resolve(false)
  patch.updatedAt = Date.now()
  var ref = firebase.database().ref('millipro/users/' + uid + '/profile')
  return ref.once('value').then(function (snap) {
    var p = snap.val()
    if (p && typeof p === 'object') return ref.update(patch)
    return ref.set(patch)
  }).then(function () { return true }).catch(function (e) {
    console.warn('profile update failed:', e)
    return false
  })
}

// ログイン時にまとめて実行（Unishare / Games 版。gamedata 同期は本アプリのみの仕事）
// 戻り値: Promise<profile>
function completeMilliproLogin(uid) {
  return ensureMilliproProfile(uid).then(function (profile) {
    applyMilliproProfile(profile)
    return profile
  })
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

// ---------- アカウント連携UI（§2-4） ----------

function mpRender(uid) {
  var form = document.getElementById("mp-account-form");
  var ok = document.getElementById("mp-account-ok");
  if (!form || !ok) return;
  if (uid) {
    form.style.display = "none";
    ok.style.display = "block";
    document.getElementById("mp-pid").textContent = getMilliproPlayerId() || uid;
    try { if (typeof mpUpdateLinkedProviders === 'function') mpUpdateLinkedProviders(); } catch (e) {}
  } else {
    form.style.display = "block";
    ok.style.display = "none";
  }
  var ms = document.getElementById("mp-menu-status");
  if (ms) {
    var pid = getMilliproPlayerId();
    ms.textContent = pid ? "連携ID: " + pid : "未連携";
    ms.classList.toggle("linked", !!pid);
  }
  var pl = document.getElementById("profile-label");
  if (pl) {
    var info = mpProfileInfo();
    pl.textContent = info.name || info.pid || "ゲスト";
  }
  var pbtn = document.getElementById("profile-btn");
  var picon = document.getElementById("profile-header-icon");
  if (pbtn && picon) {
    renderUserIcon(picon, info);
    picon.style.display = info.icon ? "" : "none";
  }
}

// ログイン / 新規登録のタブ切替
function mpTab(tab) {
  var loginPanel = document.getElementById("mp-panel-login");
  var signupPanel = document.getElementById("mp-panel-signup");
  var loginTab = document.getElementById("mp-tab-login");
  var signupTab = document.getElementById("mp-tab-signup");
  if (!loginPanel || !signupPanel) return;
  loginPanel.style.display = tab === "login" ? "block" : "none";
  signupPanel.style.display = tab === "signup" ? "block" : "none";
  if (loginTab) loginTab.className = tab === "login" ? "mp-tab active" : "mp-tab";
  if (signupTab) signupTab.className = tab === "signup" ? "mp-tab active" : "mp-tab";
  var msg = document.getElementById("mp-msg");
  if (msg) msg.textContent = "";
}

// パスワードの表示 / 非表示を切り替え
function mpToggle(inputId, btnId) {
  var input = document.getElementById(inputId);
  var btn = document.getElementById(btnId);
  if (!input) return;
  var show = input.type === "password";
  input.type = show ? "text" : "password";
  if (btn) btn.textContent = show ? "🙈" : "👁";
}

function mpAuthError(e) {
  var j = e && e.code ? e.code : String(e);
  if (j.indexOf("email-already-in-use") >= 0) return "そのメールは既に登録されています。ログインしてください";
  if (j.indexOf("wrong-password") >= 0 || j.indexOf("user-not-found") >= 0) return "メールまたはパスワードが違います";
  if (j.indexOf("weak-password") >= 0) return "パスワードは6文字以上にしてください";
  if (j.indexOf("invalid-email") >= 0) return "メールアドレスの形式が正しくありません";
  return "エラー: " + j;
}

function mpSubmit(isSignup) {
  var email = document.getElementById(isSignup ? "mp2-email" : "mp-email").value.trim();
  var pass = document.getElementById(isSignup ? "mp2-pass" : "mp-pass").value;
  var msg = document.getElementById("mp-msg");
  if (!msg) return;
  if (!email || !pass) { msg.textContent = "メールとパスワードを入力してください"; return; }
  if (isSignup) {
    var pass2 = document.getElementById("mp2-pass2").value;
    if (pass !== pass2) { msg.textContent = "パスワードが一致しません"; return; }
  }
  var p = isSignup ? milliproSignup(email, pass) : milliproLogin(email, pass);
  p.then(function () {
    msg.textContent = isSignup ? "登録しました。playerId を端末に反映中..." : "連携しました。playerId を端末に反映中...";
  }).catch(function (e) {
    msg.textContent = mpAuthError(e);
  });
}

// パスワード再設定（§2-4・milliproResetPassword を使う）
function mpResetPassword() {
  var email = (document.getElementById("mp-email").value || "").trim();
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

function mpOpen() {
  var popup = document.getElementById("login-popup");
  if (popup) popup.classList.add("open");
}

function mpClose() {
  var popup = document.getElementById("login-popup");
  if (popup) popup.classList.remove("open");
}

// ---------- 連携案内バナー（ログイン任意・§2-4） ----------

// 未ログイン & 連携ID未設定ならバナーを表示（ページ表示時に毎回判定。あとで閉じても次回また出る）
function mpRefreshBanner() {
  var b = document.getElementById("mp-banner");
  if (!b) return;
  var connected = (isAuthAvailable() && getMilliproUid()) || !!getMilliproPlayerId();
  b.style.display = connected ? "none" : "flex";
}

function mpHideBanner() {
  var b = document.getElementById("mp-banner");
  if (b) b.style.display = "none";
}

// 「連携する」→ アカウント連携UI（モーダル）を開いて案内する
function mpOpenAccount() {
  var popup = document.getElementById("login-popup");
  if (popup) {
    mpOpen();
    return;
  }
  var el = document.getElementById("mp-account");
  if (el) {
    el.style.display = "block";
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function mpLogout() {
  milliproLogout().then(mpRender);
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
  var v = document.getElementById("mp-id").value.trim();
  if (!v) return;
  setMilliproPlayerId(v);
  mpRender(getMilliproUid());
  mpRefreshBanner();
  alert("連携IDを保存しました: " + v);
}

function mpUpdateLinkedProviders() {
  var el = document.getElementById("mp-linked-providers");
  if (!el) return;
  try {
    var providers = typeof getLinkedProviders === 'function' ? getLinkedProviders() : [];
    // getLinkedProviders is async in chronicle (returns Promise), but local old version may be sync. Handle both.
    if (providers && typeof providers.then === 'function') {
      providers.then(function(p){ el.textContent = p && p.length ? '連携: ' + p.join(', ') : '連携: メールのみ'; });
    } else {
      el.textContent = providers && providers.length ? '連携: ' + providers.join(', ') : '連携: メールのみ';
    }
  } catch (e) { el.textContent = ''; }
}

initFirebase();

// リダイレクトログインの結果を回収（X/Googleでリダイレクトした場合のエラー表示）
try {
  if (typeof consumeMilliproRedirectResult === 'function') {
    consumeMilliproRedirectResult().catch(function(e){
      var msg = typeof oauthErrorMessage === 'function' ? oauthErrorMessage(e) : String(e);
      var m = document.getElementById('mp-msg');
      if (m) m.textContent = msg;
      else alert(msg);
    });
  }
} catch (e) {}

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

if (document.getElementById("mp-popup-close")) {
  document.getElementById("mp-popup-close").addEventListener("click", function () {
    mpClose();
  });
}

// フォームのEnterキーで送信
(function () {
  var le = document.getElementById("mp-email");
  var lp = document.getElementById("mp-pass");
  if (le && lp) {
    le.addEventListener("keydown", function (e) { if (e.key === "Enter") mpSubmit(false); });
    lp.addEventListener("keydown", function (e) { if (e.key === "Enter") mpSubmit(false); });
  }
  var ne = document.getElementById("mp2-email");
  var np = document.getElementById("mp2-pass");
  var np2 = document.getElementById("mp2-pass2");
  if (ne && np && np2) {
    [ne, np, np2].forEach(function (inp) {
      inp.addEventListener("keydown", function (e) { if (e.key === "Enter") mpSubmit(true); });
    });
  }
})();
