/* =========================
   READIFY – EXPLORER (Beginner Friendly)
   - Hamburger menu
   - Uses books from data.js (window.books)
   - Search + Genre filter
   - Card click opens modal
========================= */

/* ---------- 0) BOOK DATA ---------- */
/* IMPORTANT:
   data.js should contain:
   const books = [...];
   window.books = books;
*/
if (!window.books) {
  console.error("Books not found. Make sure explorer.html loads data.js BEFORE explorer.js");
}
const bookData = window.books || [];

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
const bookGrid = document.getElementById("bookGrid");
const searchInput = document.getElementById("searchInput");
const genreSelect = document.getElementById("genreSelect");
const clearBtn = document.getElementById("clearBtn");

/* Modal elements */
const bookModal = document.getElementById("bookModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalCover = document.getElementById("modalCover");
const modalTitle = document.getElementById("modalTitle");
const modalAuthor = document.getElementById("modalAuthor");
const modalGenre = document.getElementById("modalGenre");
const modalSynopsis = document.getElementById("modalSynopsis");
const modalSeriesList = document.getElementById("modalSeriesList");
const modalReviewsBody = document.getElementById("modalReviewsBody");

/* Safety check */
if (!bookGrid || !searchInput || !genreSelect || !clearBtn || !bookModal) {
  console.error("Explorer page elements not found. Check explorer.html IDs.");
}

/* ---------- 3) POPULATE GENRE DROPDOWN ---------- */
function fillGenres() {
  if (!genreSelect) return;

  // clear old options to avoid duplicates
  genreSelect.innerHTML = "";

  const genres = ["all"];
  bookData.forEach(function (b) {
    if (b.genre && !genres.includes(b.genre)) genres.push(b.genre);
  });

  genres.forEach(function (g) {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = g === "all" ? "All genres" : g;
    genreSelect.appendChild(opt);
  });
}

/* ---------- 4) RENDER BOOK CARDS ---------- */
function renderBooks(list) {
  if (!bookGrid) return;

  bookGrid.innerHTML = "";

  if (!list || list.length === 0) {
    bookGrid.innerHTML = `<p class="muted">No books found. Try a different search or genre.</p>`;
    return;
  }

  list.forEach(function (book) {
    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
      <img class="book-card-img" src="${book.cover}" alt="${book.title} cover">
      <div class="book-card-body">
        <p class="book-card-title">${book.title}</p>
        <p class="book-card-author">${book.author}</p>
        <span class="book-card-genre">${book.genre}</span>
      </div>
    `;

    card.addEventListener("click", function () {
      openModal(book);
    });

    bookGrid.appendChild(card);
  });
}

/* ---------- 5) FILTER LOGIC ---------- */
function applyFilters() {
  if (!searchInput || !genreSelect) return;

  const text = searchInput.value.trim().toLowerCase();
  const genre = genreSelect.value;

  const filtered = bookData.filter(function (book) {
    const title = (book.title || "").toLowerCase();
    const author = (book.author || "").toLowerCase();

    const matchText = title.includes(text) || author.includes(text);
    const matchGenre = genre === "all" || book.genre === genre;

    return matchText && matchGenre;
  });

  renderBooks(filtered);
}

/* ---------- 6) MODAL OPEN/CLOSE ---------- */
function openModal(book) {
  if (!bookModal) return;

  modalCover.src = book.cover;
  modalCover.alt = book.title + " cover";
  modalTitle.textContent = book.title;
  modalAuthor.textContent = "By " + book.author;
  modalGenre.textContent = book.genre;
  modalSynopsis.textContent = book.synopsis || "";

  // series list
  modalSeriesList.innerHTML = "";
  (book.series || []).forEach(function (item) {
    const li = document.createElement("li");
    li.textContent = item;
    modalSeriesList.appendChild(li);
  });

  // reviews table
  modalReviewsBody.innerHTML = "";
  (book.reviews || []).forEach(function (r) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.source || ""}</td>
      <td>${r.rating || ""}</td>
      <td>${r.text || ""}</td>
    `;
    modalReviewsBody.appendChild(tr);
  });

  bookModal.classList.add("show");
  bookModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  if (!bookModal) return;
  bookModal.classList.remove("show");
  bookModal.setAttribute("aria-hidden", "true");
}

/* Close modal button */
if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", closeModal);
}

/* Close modal when clicking outside content */
if (bookModal) {
  bookModal.addEventListener("click", function (e) {
    if (e.target === bookModal) closeModal();
  });
}

/* Close modal with Escape key */
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && bookModal && bookModal.classList.contains("show")) {
    closeModal();
  }
});

/* ---------- 7) CLEAR BUTTON ---------- */
if (clearBtn) {
  clearBtn.addEventListener("click", function () {
    if (!searchInput || !genreSelect) return;
    searchInput.value = "";
    genreSelect.value = "all";
    applyFilters();
  });
}

/* ---------- 8) EVENTS FOR FILTERING ---------- */
if (searchInput) searchInput.addEventListener("input", applyFilters);
if (genreSelect) genreSelect.addEventListener("change", applyFilters);

/* ---------- 9) OPTIONAL: If Recommender stored a selected book ---------- */
(function focusSelectedBook() {
  const raw = localStorage.getItem("readify_selected_book");
  if (!raw) return;

  try {
    const selected = JSON.parse(raw);

    // best: store id
    let found = null;

    if (selected.id) {
      found = bookData.find(function (b) {
        return b.id === selected.id;
      });
    }

    // fallback: match title + author
    if (!found && selected.title && selected.author) {
      found = bookData.find(function (b) {
        return b.title === selected.title && b.author === selected.author;
      });
    }

    if (found) openModal(found);
  } catch (err) {
    // ignore parsing errors
  }
})();

/* ---------- INIT ---------- */
if (genreSelect && bookGrid) {
  fillGenres();
  renderBooks(bookData);
}
