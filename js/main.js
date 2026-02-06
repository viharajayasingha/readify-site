/* =========================
   READIFY – HOME PAGE JS
   Beginner friendly version
========================= */

/* =========================
   1) HAMBURGER MENU
========================= */
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
   2) AUTO-ROTATING QUOTES
========================= */
const quotes = [
  { text: "To go wrong in one's own way is better than to go right in someone else's.", author: "Fyodor Dostoevsky" },
  { text: "Many a book is like a key to unknown chambers within the castle of one’s own self.", author: "Franz Kafka" },
  { text: "Lock up your libraries if you like; but there is no gate, no lock, no bolt that you can set upon the freedom of my mind.", author: "Virginia Woolf" },
  { text: "Rest, nature, books, music...such is my idea of happiness.", author: "Leo Tolstoy" }
];

let quoteIndex = 0;

function showQuote() {
  const quoteText = document.getElementById("quoteText");
  const quoteAuthor = document.getElementById("quoteAuthor");

  if (!quoteText || !quoteAuthor) return;

  quoteText.textContent = "“" + quotes[quoteIndex].text + "”";
  quoteAuthor.textContent = "— " + quotes[quoteIndex].author;

  quoteIndex++;
  if (quoteIndex >= quotes.length) quoteIndex = 0;
}

showQuote();
setInterval(showQuote, 6000);

/* =========================
   3) AUTHOR OF THE DAY
   (changes daily using date)
========================= */
const authors = [
  { name: "Rebecca Yarros", tag: "Fantasy • Romance", bio: "Known for bestselling fantasy novels such as Fourth Wing." },
  { name: "Donna Tartt", tag: "Literary Fiction", bio: "Famous for richly detailed novels like The Secret History." },
  { name: "Alex Michaelides", tag: "Psychological Thriller", bio: "Known for suspenseful novels such as The Silent Patient." },
  { name: "Agustina Bazterrica", tag: "Dystopian • Horror", bio: "Writes disturbing dystopian fiction including Tender Is the Flesh." },
  { name: "Matt Haig", tag: "Contemporary • Fantasy", bio: "Known for emotional novels like The Midnight Library." }
];

const today = new Date();
const dayNumber = today.getDate(); // 1–31
const author = authors[dayNumber % authors.length];

const aName = document.getElementById("aName");
const aTag = document.getElementById("aTag");
const aBio = document.getElementById("aBio");

if (aName) aName.textContent = author.name;
if (aTag) aTag.textContent = author.tag;
if (aBio) aBio.textContent = author.bio;

const todayHint = document.getElementById("todayHint");
if (todayHint) todayHint.textContent = "Updated: " + today.toDateString();

/* =========================
   4) NEWSLETTER (localStorage)
========================= */
const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletterEmail");
const newsletterMsg = document.getElementById("newsletterMsg");

const STORAGE_KEY = "readify_newsletter_email";

// show saved email if already subscribed
const savedEmail = localStorage.getItem(STORAGE_KEY);
if (savedEmail && newsletterEmail && newsletterMsg) {
  newsletterEmail.value = savedEmail;
  newsletterMsg.textContent = "You are already subscribed.";
}

if (newsletterForm && newsletterEmail && newsletterMsg) {
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = newsletterEmail.value.trim();

    // simple email validation (basic pattern)
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValid) {
      newsletterMsg.textContent = "Please enter a valid email address.";
      return;
    }

    localStorage.setItem(STORAGE_KEY, email);
    newsletterMsg.textContent = "Thank you for subscribing!";
    newsletterForm.reset();
  });
}

/* =========================
   5) FOOTER YEAR
========================= */
const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

/* =========================
   6) TRENDING BOOKS WITH COVERS
   (Fill the right-side shelf)
========================= */
const trendingBooks = [
  { id: "fourth-wing", title: "Fourth Wing", author: "Rebecca Yarros", cover: "images/BookCovers/FourthWing.jpg" },
  { id: "the-secret-history", title: "The Secret History", author: "Donna Tartt", cover: "images/BookCovers/SecretHistory.jpg" },
  { id: "silent-patient", title: "The Silent Patient", author: "Alex Michaelides", cover: "images/BookCovers/SilentPatient.jpg" },
  { id: "tender-is-the-flesh", title: "Tender Is the Flesh", author: "Agustina Bazterrica", cover: "images/BookCovers/Tenderistheflesh.jpg" },
  { id: "midnight-library", title: "The Midnight Library", author: "Matt Haig", cover: "images/BookCovers/MidnightLibrary.jpg" }
];

const trendingShelf = document.getElementById("trendingShelf");

if (trendingShelf) {
  trendingShelf.innerHTML = ""; // clear existing demo covers

  trendingBooks.forEach(function (book, index) {
    const bookDiv = document.createElement("div");
    bookDiv.className = "cover c" + ((index % 5) + 1);

    bookDiv.innerHTML = `
      <img src="${book.cover}" alt="${book.title} cover" class="book-cover-img">
      <span class="cover-title">${book.title}</span>
      <span class="cover-author">${book.author}</span>
    `;

    // When clicked:
    // 1) save selected book id
    // 2) go to explorer page, which will open the modal for that book
    bookDiv.addEventListener("click", function () {
      localStorage.setItem("readify_selected_book", JSON.stringify({ id: book.id }));
      window.location.href = "explorer.html";
    });

    trendingShelf.appendChild(bookDiv);
  });
}

/* =========================
   7) SERVICE WORKER (PWA)
   (Must be in project root)
========================= */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(function () {
      console.log("Service Worker registered");
    })
    .catch(function (err) {
      console.log("Service Worker error:", err);
    });
}
