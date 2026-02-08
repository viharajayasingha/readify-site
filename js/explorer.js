//We load book data from data.js.
//data.js puts the array into: window.books
//So it can be reused in multiple pages
if (!window.books) {
  console.error("Books not found. Make sure explorer.html loads data.js BEFORE explorer.js");
}
// Use window.books safely (if missing, use empty list to avoid breaking page)
const bookData = window.books || [];

//selects the hamburger button and the navigation menu
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navMenu = document.getElementById("navMenu");

if (hamburgerBtn && navMenu) {
  //Runs the function only when the button is clicked
  hamburgerBtn.addEventListener("click", function () {
    navMenu.classList.toggle("show");
    const isOpen = navMenu.classList.contains("show");
    //menu open and close
    hamburgerBtn.setAttribute("aria-expanded", isOpen);
  });
}

//Get the main UI elements from explorer.html
const bookGrid = document.getElementById("bookGrid");
const searchInput = document.getElementById("searchInput");
const genreSelect = document.getElementById("genreSelect");
const clearBtn = document.getElementById("clearBtn");

//popup details
const bookModal = document.getElementById("bookModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalCover = document.getElementById("modalCover");
const modalTitle = document.getElementById("modalTitle");
const modalAuthor = document.getElementById("modalAuthor");
const modalGenre = document.getElementById("modalGenre");
const modalSynopsis = document.getElementById("modalSynopsis");
const modalSeriesList = document.getElementById("modalSeriesList");
const modalReviewsBody = document.getElementById("modalReviewsBody");

//safety check debugging if ids are wrong
if (!bookGrid || !searchInput || !genreSelect || !clearBtn || !bookModal) {
  console.error("Explorer page elements not found. Check explorer.html IDs.");
}

//genre drop down
function fillGenres() {
  if (!genreSelect) return;

  // clear old options to avoid duplicates
  genreSelect.innerHTML = "";

  const genres = ["all"];
  bookData.forEach(function (b) {
    if (b.genre && !genres.includes(b.genre)) genres.push(b.genre);
  });
  
  //adds each genre as an option
  genres.forEach(function (g) {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = g === "all" ? "All genres" : g;
    genreSelect.appendChild(opt);
  });
}

//creates the book cards and inserts them into the grid.
function renderBooks(list) {
  if (!bookGrid) return;

  //clear old cards first
  bookGrid.innerHTML = "";
  //if no results show a simple message
  if (!list || list.length === 0) {
    bookGrid.innerHTML = `<p class="muted">No books found. Try a different search or genre.</p>`;
    return;
  }

  //create one card per book
  list.forEach(function (book) {
    const card = document.createElement("div");
    card.className = "book-card";

    // Card content (cover + title + author + genre)
    card.innerHTML = `
      <img class="book-card-img" src="${book.cover}" alt="${book.title} cover">
      <div class="book-card-body">
        <p class="book-card-title">${book.title}</p>
        <p class="book-card-author">${book.author}</p>
        <span class="book-card-genre">${book.genre}</span>
      </div>
    `;

    // When a user clicks a card, open modal with details
    card.addEventListener("click", function () {
      openModal(book);
    });

    bookGrid.appendChild(card);
  });
}

//Filters books based on: text typed in search box selected genre dropdown
function applyFilters() {
  if (!searchInput || !genreSelect) return;

  const text = searchInput.value.trim().toLowerCase();
  const genre = genreSelect.value;

  const filtered = bookData.filter(function (book) {
    const title = (book.title || "").toLowerCase();
    const author = (book.author || "").toLowerCase();

    // Search matches title OR author
    const matchText = title.includes(text) || author.includes(text);
    // Genre matches selected genre (or show all)
    const matchGenre = genre === "all" || book.genre === genre;

    return matchText && matchGenre;
  });

  renderBooks(filtered);
}


function openModal(book) {
  if (!bookModal) return;

  // Fill modal details
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

//close modal button
if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", closeModal);
}

//close modal
if (bookModal) {
  bookModal.addEventListener("click", function (e) {
    if (e.target === bookModal) closeModal();
  });
}

//Close modal when user presses ESC key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && bookModal && bookModal.classList.contains("show")) {
    closeModal();
  }
});

//Clears the search input and resets genre filter
if (clearBtn) {
  clearBtn.addEventListener("click", function () {
    if (!searchInput || !genreSelect) return;
    searchInput.value = "";
    genreSelect.value = "all";
    applyFilters();
  });
}

//filter updates immedietly when changing genre and searching
if (searchInput) searchInput.addEventListener("input", applyFilters);
if (genreSelect) genreSelect.addEventListener("change", applyFilters);

//If Home/Recommender saved a selected book into localStorage, Explorer can auto-open that book in the modal.
(function focusSelectedBook() {
  const raw = localStorage.getItem("readify_selected_book");
  if (!raw) return;

  try {
    const selected = JSON.parse(raw);

    // store id
    let found = null;

    if (selected.id) {
      found = bookData.find(function (b) {
        return b.id === selected.id;
      });
    }

    // match title and author
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

//When page loads: Fill genre dropdown, Show all books in grid
if (genreSelect && bookGrid) {
  fillGenres();
  renderBooks(bookData);
}
