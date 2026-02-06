/* =========================
   READIFY – FLOW (Beginner Friendly)
   - Ambient sounds (toggle)
   - Completed books list (localStorage)
========================= */

/* 1) HAMBURGER MENU */
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navMenu = document.getElementById("navMenu");

if (hamburgerBtn && navMenu) {
  hamburgerBtn.addEventListener("click", function () {
    navMenu.classList.toggle("show");
    const isOpen = navMenu.classList.contains("show");
    hamburgerBtn.setAttribute("aria-expanded", isOpen);
  });
}

/* =========================
   2) AMBIENT SOUNDS
========================= */

// Buttons
const pianoBtn = document.getElementById("pianoBtn");
const rainBtn = document.getElementById("rainBtn");
const cafeBtn = document.getElementById("cafeBtn");
const birdsBtn = document.getElementById("birdsBtn");
const fireBtn = document.getElementById("fireBtn");
const stopBtn = document.getElementById("stopBtn");

// Audios
const pianoAudio = document.getElementById("pianoAudio");
const rainAudio = document.getElementById("rainAudio");
const cafeAudio = document.getElementById("cafeAudio");
const birdsAudio = document.getElementById("birdsAudio");
const fireAudio = document.getElementById("fireAudio");

// Message
const soundMsg = document.getElementById("soundMsg");

/* Stop all sounds */
function stopAllSounds() {
  const all = [pianoAudio, rainAudio, cafeAudio, birdsAudio, fireAudio];

  all.forEach(function (a) {
    if (!a) return;
    a.pause();
    a.currentTime = 0;
  });
}

/* Play one sound */
function playSound(audioEl, messageText) {
  stopAllSounds();

  if (!audioEl) return;

  audioEl.play().then(function () {
    soundMsg.textContent = messageText;
  }).catch(function () {
    // Some browsers block autoplay until user interacts.
    soundMsg.textContent = " Click a sound button again (browser blocked autoplay).";
  });
}

/* Button events */
if (pianoBtn) {
  pianoBtn.addEventListener("click", function () {
    playSound(pianoAudio, "Piano is playing.");
  });
}

if (rainBtn) {
  rainBtn.addEventListener("click", function () {
    playSound(rainAudio, "Rain is playing.");
  });
}

if (cafeBtn) {
  cafeBtn.addEventListener("click", function () {
    playSound(cafeAudio, "Cafe sound is playing.");
  });
}

if (birdsBtn) {
  birdsBtn.addEventListener("click", function () {
    playSound(birdsAudio, "Birds are playing.");
  });
}

if (fireBtn) {
  fireBtn.addEventListener("click", function () {
    playSound(fireAudio, "Fireplace is playing.");
  });
}

if (stopBtn) {
  stopBtn.addEventListener("click", function () {
    stopAllSounds();
    soundMsg.textContent = " Sounds stopped.";
  });
}

/* =========================
   3) COMPLETED BOOKS (localStorage)
========================= */

const COMPLETE_KEY = "readify_completed_books";

const completeForm = document.getElementById("completeForm");
const bookTitleInput = document.getElementById("bookTitleInput");
const completedList = document.getElementById("completedList");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

function loadCompleted() {
  try {
    const raw = localStorage.getItem(COMPLETE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCompleted(list) {
  localStorage.setItem(COMPLETE_KEY, JSON.stringify(list));
}

function renderCompleted() {
  const list = loadCompleted();
  completedList.innerHTML = "";

  if (list.length === 0) {
    completedList.innerHTML = `<p class="muted">No completed books yet.</p>`;
    return;
  }

  list.forEach(function (title, index) {
    const row = document.createElement("div");
    row.className = "completed-item";

    row.innerHTML = `
      <span> ${title}</span>
      <button type="button" class="remove-btn">Remove</button>
    `;

    row.querySelector(".remove-btn").addEventListener("click", function () {
      const updated = loadCompleted();
      updated.splice(index, 1);
      saveCompleted(updated);
      renderCompleted();
    });

    completedList.appendChild(row);
  });
}

if (completeForm) {
  completeForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = bookTitleInput.value.trim();
    if (title.length === 0) return;

    const list = loadCompleted();

    // avoid duplicates (case-insensitive)
    const exists = list.some(function (t) {
      return t.toLowerCase() === title.toLowerCase();
    });

    if (exists) {
      bookTitleInput.value = "";
      return;
    }

    list.push(title);
    saveCompleted(list);

    bookTitleInput.value = "";
    renderCompleted();
  });
}

if (clearCompletedBtn) {
  clearCompletedBtn.addEventListener("click", function () {
    localStorage.removeItem(COMPLETE_KEY);
    renderCompleted();
  });
}

/* Load list on page load */
renderCompleted();
