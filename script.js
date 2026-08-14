// ==========================================================
// БЫСТРАЯ НАСТРОЙКА ПРИГЛАШЕНИЯ
// Меняй только значения справа — остальной код трогать не нужно.
// ==========================================================
const invite = {
  girlName: "Любимая",
  yourName: "Бекназар",
  date: "26 августа 2026",
  time: "16:00",
  place: "Bellagio на Эркиндик💌",
  dressCode: "Ты выглядишь всегда прекрасна!",
  message: "На вечер, где никуда не нужно спешить. Только ты, я и немного магии.",
  note: "Просто будь готова. Всё остальное я беру на себя ❤️",
  ticketCode: "DATE • 160826"
};

const $ = (id) => document.getElementById(id);
const questionScreen = $("questionScreen");
const inviteScreen = $("inviteScreen");
const yesButton = $("yesButton");
const noButton = $("noButton");
const backButton = $("backButton");
const music = $("backgroundMusic");
const musicButton = $("musicButton");
const toast = $("toast");
const heartsLayer = $("floatingHearts");

// Подставляем данные из настройки выше
$("girlName").textContent = invite.girlName;
$("dateTime").textContent = `${invite.date} · ${invite.time}`;
$("place").textContent = invite.place;
$("waitingPerson").textContent = invite.yourName;
$("dressCode").textContent = invite.dressCode;
$("inviteMessage").textContent = invite.message;
$("loveNote").textContent = invite.note;
$("signatureName").textContent = invite.yourName;
$("ticketCode").textContent = invite.ticketCode;
document.title = `${invite.girlName}, у меня к тебе вопрос 💌`;

let noEscapeCount = 0;
let toastTimer;

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1900);
}

function safePlayMusic() {
  music.volume = 0.48;
  music.play()
    .then(() => musicButton.classList.add("is-playing"))
    .catch(() => {
      // Браузер может запретить autoplay до явного клика — это нормально.
    });
}

function toggleMusic() {
  if (music.paused) {
    safePlayMusic();
    showToast("Музыка включена ♫");
  } else {
    music.pause();
    musicButton.classList.remove("is-playing");
    showToast("Музыка на паузе");
  }
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function getSafeArea() {
  const styles = getComputedStyle(document.documentElement);
  return {
    top: parseFloat(styles.getPropertyValue("--safe-top")) || 0,
    right: parseFloat(styles.getPropertyValue("--safe-right")) || 0,
    bottom: parseFloat(styles.getPropertyValue("--safe-bottom")) || 0,
    left: parseFloat(styles.getPropertyValue("--safe-left")) || 0
  };
}

function getVisibleViewport() {
  const vv = window.visualViewport;
  return {
    width: vv?.width || window.innerWidth,
    height: vv?.height || window.innerHeight,
    left: vv?.offsetLeft || 0,
    top: vv?.offsetTop || 0
  };
}

function moveNoButton() {
  noEscapeCount += 1;
  noButton.classList.add("is-running");

  const rect = noButton.getBoundingClientRect();
  const viewport = getVisibleViewport();
  const safe = getSafeArea();
  const edge = 12;

  // На iPhone Safari высота visualViewport меняется вместе с нижней/верхней панелью.
  // Поэтому кнопку ограничиваем именно видимой областью + safe-area Dynamic Island/Home Indicator.
  const minX = viewport.left + safe.left + edge;
  const minY = viewport.top + safe.top + edge;
  const maxX = Math.max(minX, viewport.left + viewport.width - safe.right - rect.width - edge);
  const maxY = Math.max(minY, viewport.top + viewport.height - safe.bottom - rect.height - edge);

  let x = randomBetween(minX, maxX);
  let y = randomBetween(minY, maxY);

  // Не кладём кнопку прямо на "Конечно"
  const yesRect = yesButton.getBoundingClientRect();
  const nearYes = x < yesRect.right + 40 && x + rect.width > yesRect.left - 40 &&
                  y < yesRect.bottom + 40 && y + rect.height > yesRect.top - 40;
  if (nearYes) {
    x = x < viewport.left + viewport.width / 2 ? maxX : minX;
    y = y < viewport.top + viewport.height / 2 ? maxY : minY;
  }

  noButton.style.left = `${x}px`;
  noButton.style.top = `${y}px`;
  noButton.style.transform = `rotate(${randomBetween(-8, 8)}deg)`;

  const phrases = [
    "Не так быстро 😌",
    "Эта кнопка не работает сегодня 😏",
    "Попробуй ещё раз 😂",
    "Кажется, судьба против кнопки «Нет» 💗",
    "Ну всё, остаётся только «Конечно» 😇"
  ];
  if (noEscapeCount <= phrases.length) showToast(phrases[noEscapeCount - 1]);
}

function resetNoButton() {
  noButton.classList.remove("is-running");
  noButton.style.left = "";
  noButton.style.top = "";
  noButton.style.transform = "";
}

function createHeartBurst(count = 28) {
  for (let i = 0; i < count; i += 1) {
    setTimeout(() => {
      const heart = document.createElement("span");
      heart.className = "float-heart";
      heart.textContent = Math.random() > .25 ? "♥" : "♡";
      heart.style.left = `${randomBetween(3, 97)}vw`;
      heart.style.fontSize = `${randomBetween(14, 34)}px`;
      heart.style.animationDuration = `${randomBetween(3.8, 7)}s`;
      heart.style.animationDelay = `${randomBetween(0, .4)}s`;
      heartsLayer.appendChild(heart);
      setTimeout(() => heart.remove(), 7600);
    }, i * 45);
  }
}

function openInvitation() {
  resetNoButton();
  questionScreen.classList.remove("is-active");
  inviteScreen.classList.add("is-active");
  createHeartBurst(34);
  safePlayMusic();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function backToQuestion() {
  inviteScreen.classList.remove("is-active");
  questionScreen.classList.add("is-active");
  resetNoButton();
}

// Убегаем и от мыши, и от пальца на телефоне
noButton.addEventListener("pointerenter", moveNoButton);
noButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  moveNoButton();
});
noButton.addEventListener("focus", moveNoButton);
noButton.addEventListener("click", (event) => {
  event.preventDefault();
  moveNoButton();
});

yesButton.addEventListener("click", openInvitation);
backButton.addEventListener("click", backToQuestion);
musicButton.addEventListener("click", toggleMusic);

// На первом клике по странице браузер уже разрешает звук
window.addEventListener("pointerdown", () => safePlayMusic(), { once: true });


// Если Safari изменил видимую область (поворот, скрытие/появление панелей),
// возвращаем «Нет» в безопасное исходное место, чтобы она не осталась за экраном.
window.visualViewport?.addEventListener("resize", resetNoButton);
window.addEventListener("orientationchange", resetNoButton);
