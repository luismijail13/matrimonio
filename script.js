const weddingDate = new Date("2026-07-25T00:00:00-05:00");

const openButton = document.querySelector("#openInvitation");
const showEnvelopeButton = document.querySelector("#showEnvelope");
const invitationIntro = document.querySelector("#invitationIntro");
const envelopeScene = document.querySelector("#envelopeScene");
const music = document.querySelector("#backgroundMusic");
const musicButton = document.querySelector("#toggleMusic");
const petalLayer = document.querySelector(".floating-petals");
const photoCards = document.querySelectorAll(".photo-card");
const photos = document.querySelectorAll(".photo-card img");
const coverPhoto = document.querySelector(".cover-photo");
const main = document.querySelector("main");
const panels = Array.from(document.querySelectorAll(".panel"));
let activePanelIndex = 0;

music.volume = 0.35;

function goToPanel(targetSelector) {
  const target = document.querySelector(targetSelector);
  const targetIndex = panels.indexOf(target);

  if (!main || targetIndex < 0) {
    return;
  }

  activePanelIndex = targetIndex;
  main.style.transform = `translateY(${-activePanelIndex * 100}dvh)`;
  target.scrollTop = 0;
  history.replaceState(null, "", targetSelector);
}

window.addEventListener(
  "keydown",
  (event) => {
    if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
      event.preventDefault();
    }
  },
  { passive: false }
);

window.addEventListener("resize", () => {
  if (main) {
    main.style.transform = `translateY(${-activePanelIndex * 100}dvh)`;
  }
});

if (window.location.hash) {
  goToPanel(window.location.hash);
}

if (showEnvelopeButton && invitationIntro && envelopeScene) {
  showEnvelopeButton.addEventListener("click", () => {
    invitationIntro.classList.add("is-hidden");
    envelopeScene.classList.remove("is-hidden");
  });
}

if (openButton) {
  openButton.addEventListener("click", async () => {
    openButton.classList.add("open");

    try {
      await music.play();
    } catch (error) {
      musicButton.textContent = "Activar musica";
    }
  });
}

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    goToPanel(button.dataset.scroll);
  });
});

if (musicButton) {
  musicButton.addEventListener("click", async () => {
    if (music.paused) {
      try {
        await music.play();
        musicButton.textContent = "Pausar musica";
      } catch (error) {
        musicButton.textContent = "Activar musica";
      }
      return;
    }

    music.pause();
    musicButton.textContent = "Reproducir musica";
  });
}

function updateCountdown() {
  const now = new Date();
  const distance = Math.max(weddingDate - now, 0);

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  document.querySelector("#days").textContent = String(days).padStart(2, "0");
  document.querySelector("#hours").textContent = String(hours).padStart(2, "0");
  document.querySelector("#minutes").textContent = String(minutes).padStart(2, "0");
  document.querySelector("#seconds").textContent = String(seconds).padStart(2, "0");
}

function createPetal() {
  const petal = document.createElement("span");
  petal.className = "petal";
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.setProperty("--drift", `${Math.random() * 180 - 90}px`);
  petal.style.animationDuration = `${8 + Math.random() * 7}s`;
  petal.style.opacity = `${0.35 + Math.random() * 0.45}`;
  petalLayer.appendChild(petal);

  setTimeout(() => petal.remove(), 16000);
}

updateCountdown();
setInterval(updateCountdown, 1000);
setInterval(createPetal, 700);

photoCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) rotate(${x * 2}deg) translate(${x * 8}px, ${y * 8}px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

photos.forEach((photo) => {
  photo.addEventListener("error", () => {
    photo.classList.add("is-missing");
  });
});

if (coverPhoto) {
  coverPhoto.addEventListener("error", () => {
    coverPhoto.classList.add("is-missing");
  });
}
