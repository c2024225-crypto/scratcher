// js/main.js（中央寄せ対応版）
const words = ["maguro","ebi","salmon","tamago","ika","uni","toro","anago","hamachi","saba","hotate","katsuo"];
const sushiImages = ["images/sushineta.jpeg"]; // 実際のファイル名に合わせる

let score = 0;
let time = 60;
let current = "";
let progress = 0;

// sushiX は画像幅に応じて初期化（下の getSushiSize() を参照）
let sushiX = 0;

// ステージ幅は CSS 変数から取得（レスポンシブ対応）
function getStageWidth() {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--stage-width') || "900px";
  const num = parseInt(v.replace("px","").trim(), 10);
  return isNaN(num) ? 900 : num;
}
let stageWidth = getStageWidth();

const wordEl = document.querySelector("#word .target");
const inputEl = document.getElementById("input");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const sushiWrapper = document.getElementById("sushi-wrapper");
const sushiImg = document.getElementById("sushi-img");

// sushi の表示サイズを CSS 変数から取得（フォールバックあり）
function getSushiSize() {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--sushi-size') || "140px";
  const n = parseInt(v.replace("px","").trim(), 10);
  return isNaN(n) ? 140 : n;
}

// 単語ブロックをステージ中央に寄せる（寿司画像の右側に来るように調整）
function updateWordOffset() {
  const stageEl = document.getElementById("stage");
  const stageRect = stageEl.getBoundingClientRect();
  const stageW = stageRect.width;

  const wordBox = document.getElementById("word");
  // まだ描画されていない場合は少し待つ
  if (!wordBox) return;
  const wordRect = wordBox.getBoundingClientRect();
  const wordW = wordRect.width || 220;

  const sushiW = sushiImg.getBoundingClientRect().width || getSushiSize();

  // 単語をステージ中央に置きたい位置を計算
  // 寿司の右側に単語が来るように寿司幅の半分を引く
  const desiredLeft = (stageW / 2) - (wordW / 2) - (sushiW / 2) + 10;

  // 最小値は 0（負の値は無効）
  const ml = Math.max(0, Math.round(desiredLeft));
  wordBox.style.marginLeft = ml + "px";
}

// 単語を選んで表示する
function pickWord() {
  current = words[Math.floor(Math.random() * words.length)];
  progress = 0;
  renderWord();
  sushiImg.src = sushiImages[Math.floor(Math.random() * sushiImages.length)];

  // sushiX を画像幅に応じて左外にセット
  sushiX = -(getSushiSize() + 60);
  sushiWrapper.style.transition = "none";
  sushiWrapper.style.transform = `translateX(${sushiX}px)`;

  // 単語の位置を更新（画像ロード後に再計算するため少し遅らせる）
  setTimeout(updateWordOffset, 80);
}

function renderWord() {
  const matched = current.slice(0, progress);
  const remaining = current.slice(progress);
  wordEl.innerHTML = `<span class="matched">${escapeHtml(matched)}</span><span class="remaining">${escapeHtml(remaining)}</span>`;
}

function escapeHtml(s) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

// リアルタイム判定
inputEl.addEventListener("input", () => {
  const val = inputEl.value;
  let newProgress = 0;
  for (let i = 0; i < Math.min(val.length, current.length); i++) {
    if (val[i] === current[i]) newProgress++;
    else break;
  }
  progress = newProgress;
  renderWord();

  if (val === current) {
    score++;
    scoreEl.textContent = "スコア: " + score;
    inputEl.value = "";
    sushiX = stageWidth + 120;
    //sushiWrapper.style.transition = "transform 0.6s ease-out";
    //sushiWrapper.style.transform = `translateX(${sushiX}px)`;
    setTimeout(() => {
      sushiWrapper.style.transition = "none";
      pickWord();
    }, 650);
  }
});

// タイマーと寿司移動
const timerId = setInterval(() => {
  time--;
  timerEl.textContent = "残り時間: " + time;

  const speed = 10.0;
  sushiX += speed;
  sushiWrapper.style.transform = `translateX(${sushiX}px)`;

  if (sushiX > stageWidth - 80) {
    pickWord();
  }

  if (time <= 0) {
    clearInterval(timerId);
    inputEl.disabled = true;
    setTimeout(() => alert("ゲーム終了！ スコア: " + score), 100);
  }
}, 1000);

// リサイズ時にステージ幅と単語位置を再計算
window.addEventListener("resize", () => {
  stageWidth = getStageWidth();
  setTimeout(() => {
    updateWordOffset();
  }, 80);
});

// 初期化
pickWord();
setTimeout(() => inputEl.focus(), 200);
