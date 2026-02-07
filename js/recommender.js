/* =========================
   READIFY – RECOMMENDER (Beginner Friendly)
   - Dropdown filters (genre + length)
   - Random pick
   - "Pick again" animation
   - Save to localStorage reading list
========================= */

/* ---------- 0) BOOK DATA ---------- */
if (!window.books) {
  console.error("Books not found. Make sure recommender.html loads data.js BEFORE recommender.js");
}
const BOOKS = window.books || [];

/* ---------- 1) HAMBURGER MENU ---------- */
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navMenu = document.getElementById("navMenu");

if (hamburgerBtn && navMenu) {
  hamburgerBtn.addEventListener("click", function () {
    navMenu.classList.toggle("show");
    const isOpen = navMenu.classList.contains("show");
    hamburgerBtn.setAttribute("aria-expanded", isOpen);
  });
}

/* ---------- 2) ELEMENTS ---------- */
const genreSelect = document.getElementById("genreSelect");
const lengthSelect = document.getElementById("lengthSelect");
const pickBtn = document.getElementById("pickBtn");
const againBtn = document.getElementById("againBtn");
const recoMsg = document.getElementById("recoMsg");

const resultBox = document.getElementById("resultBox");
const resultCover = document.getElementById("resultCover");
const resultTitle = document.getElementById("resultTitle");
const resultAuthor = document.getElementById("resultAuthor");
const resultGenre = document.getElementById("resultGenre");
const resultPages = document.getElementById("resultPages");
const resultSynopsis = document.getElementById("resultSynopsis");

const saveBtn = document.getElementById("saveBtn");

const savedListEl = document.getElementById("savedList");
const clearListBtn = document.getElementById("clearListBtn");

/* ---------- 3) STORAGE ---------- */
const LIST_KEY = "readify_reading_list";

/* ---------- 4) STATE ---------- */
let currentPick = null;

/* ---------- 5) HELPERS ---------- */
function showMsg(text, isError) {
  if (!recoMsg) return;
  recoMsg.textContent = text;
  recoMsg.style.color = isError ? "#b00020" : "#543310";
}

function getLengthBucket(pages) {
  if (pages <= 250) return "short";
  if (pages <= 450) return "medium";
  return "long";
}

/* ---------- 6) FILL GENRES ---------- */
function fillGenres() {
  if (!genreSelect) return;

  genreSelect.innerHTML = "";

  const genres = ["all"];
  BOOKS.forEach(function (b) {
    if (!genres.includes(b.genre)) genres.push(b.genre);
  });

  genres.forEach(function (g) {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = g === "all" ? "All genres" : g;
    genreSelect.appendChild(opt);
  });
}

/* ---------- 7) FILTER BOOKS ---------- */
function getFilteredBooks() {
  const chosenGenre = genreSelect ? genreSelect.value : "all";
  const chosenLen = lengthSelect ? lengthSelect.value : "all";

  return BOOKS.filter(function (b) {
    const matchGenre = chosenGenre === "all" || b.genre === chosenGenre;

    const pages = Number(b.pages) || 350;
    const matchLen = chosenLen === "all" || getLengthBucket(pages) === chosenLen;

    return matchGenre && matchLen;
  });
}

/* ---------- 8) PICK RANDOM BOOK ---------- */
function pickRandomBook() {
  const filtered = getFilteredBooks();

  if (filtered.length === 0) {
    showMsg("No books match that genre/length. Try different options.", true);
    if (resultBox) resultBox.style.display = "none";
    currentPick = null;
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  currentPick = filtered[randomIndex];

  if (resultCover) {
    resultCover.src = currentPick.cover;
    resultCover.alt = currentPick.title + " cover";
  }
  if (resultTitle) resultTitle.textContent = currentPick.title;
  if (resultAuthor) resultAuthor.textContent = "By " + currentPick.author;
  if (resultGenre) resultGenre.textContent = currentPick.genre;
  if (resultPages) resultPages.textContent = String(currentPick.pages || "");
  if (resultSynopsis) resultSynopsis.textContent = currentPick.synopsis || "";

  if (resultBox) resultBox.style.display = "block";
  showMsg("Here’s your recommendation!", false);

  if (resultBox) {
    resultBox.classList.remove("shake");
    void resultBox.offsetWidth;
    resultBox.classList.add("shake");
  }

  localStorage.setItem("readify_selected_book", JSON.stringify({ id: currentPick.id }));
}

/* ---------- 9) READING LIST ---------- */
function loadList() {
  try {
    const raw = localStorage.getItem(LIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveList(list) {
  localStorage.setItem(LIST_KEY, JSON.stringify(list));
}

function renderList() {
  if (!savedListEl) return;

  const list = loadList();
  savedListEl.innerHTML = "";

  if (list.length === 0) {
    savedListEl.innerHTML = `<p class="muted">No saved books yet.</p>`;
    return;
  }

  list.forEach(function (b, index) {
    const item = document.createElement("div");
    item.className = "saved-item";

    item.innerHTML = `
      <img src="${b.cover}" alt="${b.title} cover">
      <div>
        <p class="saved-title">${b.title}</p>
        <p class="muted">${b.author}</p>
      </div>
      <button class="saved-remove" type="button">Remove</button>
    `;

    const removeBtn = item.querySelector(".saved-remove");
    if (removeBtn) {
      removeBtn.addEventListener("click", function () {
        const newList = loadList();
        newList.splice(index, 1);
        saveList(newList);
        renderList();
      });
    }

    savedListEl.appendChild(item);
  });
}

/* ---------- 10) EVENTS ---------- */
if (pickBtn) pickBtn.addEventListener("click", pickRandomBook);
if (againBtn) againBtn.addEventListener("click", pickRandomBook);

if (saveBtn) {
  saveBtn.addEventListener("click", function () {
    if (!currentPick) {
      showMsg("Pick a book first.", true);
      return;
    }

    const list = loadList();
    const already = list.some(function (b) {
      return b.id === currentPick.id;
    });

    if (already) {
      showMsg("That book is already in your reading list.", false);
      return;
    }

    list.push(currentPick);
    saveList(list);
    renderList();
    showMsg("Saved to your reading list!", false);
  });
}

if (clearListBtn) {
  clearListBtn.addEventListener("click", function () {
    localStorage.removeItem(LIST_KEY);
    renderList();
    showMsg("Reading list cleared.", false);
  });
}

/* ---------- INIT ---------- */
fillGenres();
renderList();
