// ===============================
//  main.js（完全修正版）
// ===============================

// 単語リスト
const words = [
  "maguro","ebi","salmon","tamago","ika","uni",
  "toro","anago","hamachi","saba","hotate","katsuo"
];

// 寿司画像（1枚でもOK）
const sushiImages = ["images/sushineta.jpeg"];

// ゲーム状態
let score = 0;
let time = 60;
let current = "";
let progress = 0;

// ステージ幅（CSS変数から取得）
function getStageWidth() {
  const v = getComputedStyle(document.documentElement)
              .getPropertyValue('--stage-width') || "900px";
  const num = parseInt(v.replace("px","").trim(), 10);
  return isNaN(num) ? 900 : num;
}
let stageWidth = getStageWidth();

// DOM取得
const wordEl = document.querySelector("#word .target");
const inputEl = document.getElementById("input");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const sushiWrapper = document.getElementById("sushi-wrapper");
const sushiImg = document.getElementById("sushi-img");

// 寿司サイズ（CSS変数）
function getSushiSize() {
  const v = getComputedStyle(document.documentElement)
              .getPropertyValue('--sushi-size') || "140px";
  const n = parseInt(v.replace("px","").trim(), 10);
  return isNaN(n) ? 140 : n;
}

// ===============================
//  ★ updateWordOffset は無効化
//  （CSS の中央寄せと競合するため）
// ===============================
function updateWordOffset() {
  // 何もしない（中央寄せは CSS に任せる）
}

// ===============================
//  単語を選んで表示
// ===============================
function pickWord() {
  current = words[Math.floor(Math.random() * words.length)];
  progress = 0;
  renderWord();

  // 寿司画像変更
  sushiImg.src = sushiImages[Math.floor(Math.random() * sushiImages.length)];

  // 寿司を左外にリセット
  sushiX = -(getSushiSize() + 60);
  sushiWrapper.style.transition = "none";
  sushiWrapper.style.transform = `translateX(${sushiX}px)`;
}

// ===============================
//  単語の描画
// ===============================
function renderWord() {
  const matched = current.slice(0, progress);
  const remaining = current.slice(progress);
  wordEl.innerHTML =
    `<span class="matched">${escapeHtml(matched)}</span>` +
    `<span class="remaining">${escapeHtml(remaining)}</span>`;
}

function escapeHtml(s) {
  return s.replace(/&/g,"&amp;")
          .replace(/</g,"&lt;")
          .replace(/>/g,"&gt;");
}

// ===============================
//  入力イベント（リアルタイム判定）
// ===============================
inputEl.addEventListener("input", () => {
  const val = inputEl.value;
  let newProgress = 0;

  for (let i = 0; i < Math.min(val.length, current.length); i++) {
    if (val[i] === current[i]) newProgress++;
    else break;
  }

  progress = newProgress;
  renderWord();

  // 完全一致 → 正解処理
  if (val === current) {
    score++;
    scoreEl.textContent = "スコア: " + score;
    inputEl.value = "";

    // 寿司を右へ飛ばす
    sushiX = stageWidth + 120;
    sushiWrapper.style.transition = "transform 0.6s ease-out";
    sushiWrapper.style.transform = `translateX(${sushiX}px)`;

    // 次の単語へ
    setTimeout(() => {
      sushiWrapper.style.transition = "none";
      pickWord();
    }, 650);
  }
});

// ===============================
//  タイマー & 寿司移動
// ===============================
let sushiX = 0;

const timerId = setInterval(() => {
  time--;
  timerEl.textContent = "残り時間: " + time;

  // 寿司を右へ動かす
  const speed = 10.0;
  sushiX += speed;
  sushiWrapper.style.transform = `translateX(${sushiX}px)`;

  // 右端に到達 → 次の単語
  if (sushiX > stageWidth - 80) {
    pickWord();
  }

  // 時間切れ
  if (time <= 0) {
    clearInterval(timerId);
    inputEl.disabled = true;
    setTimeout(() => alert("ゲーム終了！ スコア: " + score), 100);
  }
}, 1000);

// ===============================
//  リサイズ時（ステージ幅だけ更新）
// ===============================
window.addEventListener("resize", () => {
  stageWidth = getStageWidth();
});

// ===============================
//  初期化
// ===============================
pickWord();
setTimeout(() => inputEl.focus(), 200);
