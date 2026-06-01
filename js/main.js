const words = ["maguro", "ebi", "salmon", "tamago", "ika", "uni", "toro"];
let score = 0;
let time = 30;

const wordEl = document.getElementById("word");
const inputEl = document.getElementById("input");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");

function setNewWord() {
  const random = Math.floor(Math.random() * words.length);
  wordEl.textContent = words[random];
}

inputEl.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    if (inputEl.value === wordEl.textContent) {
      score++;
      scoreEl.textContent = "スコア: " + score;
      setNewWord();
    }
    inputEl.value = "";
  }
});

setInterval(() => {
  time--;
  timerEl.textContent = "残り時間: " + time;
  if (time <= 0) {
    alert("ゲーム終了！スコア: " + score);
    location.reload();
  }
}, 1000);

setNewWord();
