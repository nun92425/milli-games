"use strict";
(function () {
  if (window.navigator.standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches) {
    return;
  }
  var ua = navigator.userAgent;
  var inApp = null;
  if (/Twitter for (iPhone|Android)/i.test(ua)) {
    inApp = "twitter";
  } else if (/LINE\//i.test(ua)) {
    inApp = "line";
  } else if (/Instagram/i.test(ua)) {
    inApp = "instagram";
  }
  if (!inApp) return;

  var overlay = document.getElementById("ua-overlay");
  var titleEl = document.getElementById("ua-title");
  var bodyEl = document.getElementById("ua-body");
  if (!overlay || !titleEl || !bodyEl) return;

  var msgs = {
    twitter: {
      title: "ブラウザで開いてください",
      html: "Xアプリ内で閲覧しています。<br>" +
            "画面下部中央の<span style=\"font-weight:700\">︙</span>から" +
            "<strong>「ブラウザで開く」</strong>を選んでください。<br>" +
            "<span style=\"font-size:0.78rem;color:rgba(45,27,78,0.5)\">Milli Pulseは外部ブラウザでのプレイを推奨しています。</span>"
    },
    line: {
      title: "ブラウザで開いてください",
      html: "LINEアプリ内で閲覧しています。<br>" +
            "右下の<span style=\"font-weight:700\">︙</span>から" +
            "<strong>「ブラウザで開く」</strong>を選んでください。<br>" +
            "<span style=\"font-size:0.78rem;color:rgba(45,27,78,0.5)\">Milli Pulseは外部ブラウザでのプレイを推奨しています。</span>"
    },
    instagram: {
      title: "ブラウザで開いてください",
      html: "Instagramアプリ内で閲覧しています。<br>" +
            "画面右上の<span style=\"font-weight:700\">⋯</span>から" +
            "<strong>「外部ブラウザで開く」</strong>を選んでください。<br>" +
            "<span style=\"font-size:0.78rem;color:rgba(45,27,78,0.5)\">Milli Pulseは外部ブラウザでのプレイを推奨しています。</span>"
    }
  };
  var msg = msgs[inApp];
  titleEl.textContent = msg.title;
  bodyEl.innerHTML = msg.html;
  overlay.classList.remove("ua-hidden");
  overlay.classList.add("ua-blocking");
})();
