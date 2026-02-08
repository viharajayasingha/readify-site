//This file handles all interactive features on the Home page

// Get hamburger button and navigation menu
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navMenu = document.getElementById("navMenu");

// Only run if both elements exist
if (hamburgerBtn && navMenu) {
  hamburgerBtn.addEventListener("click", function () {
    navMenu.classList.toggle("show");
    
    const isOpen = navMenu.classList.contains("show");
    // Update aria-expanded for accessibility
    hamburgerBtn.setAttribute("aria-expanded", isOpen);
  });
}

//Auto rotating quotes
const quotes = [
  { text: "To go wrong in one's own way is better than to go right in someone else's.", author: "Fyodor Dostoevsky" },
  { text: "Many a book is like a key to unknown chambers within the castle of one’s own self.", author: "Franz Kafka" },
  { text: "Lock up your libraries if you like; but there is no gate, no lock, no bolt that you can set upon the freedom of my mind.", author: "Virginia Woolf" },
  { text: "Rest, nature, books, music...such is my idea of happiness.", author: "Leo Tolstoy" }
];

let quoteIndex = 0;
// Function to show a quote on the page
function showQuote() {
  const quoteText = document.getElementById("quoteText");
  const quoteAuthor = document.getElementById("quoteAuthor");
  //stops if elements do not exist
  if (!quoteText || !quoteAuthor) return;

  //update text content
  quoteText.textContent = "“" + quotes[quoteIndex].text + "”";
  quoteAuthor.textContent = "— " + quotes[quoteIndex].author;
  //move to next quote
  quoteIndex++;
  if (quoteIndex >= quotes.length) quoteIndex = 0;
}

showQuote();
setInterval(showQuote, 6000);


const authors = [
  { name: "Rebecca Yarros", tag: "Fantasy • Romance", bio: "Known for bestselling fantasy novels such as Fourth Wing." },
  { name: "Donna Tartt", tag: "Literary Fiction", bio: "Famous for richly detailed novels like The Secret History." },
  { name: "Alex Michaelides", tag: "Psychological Thriller", bio: "Known for suspenseful novels such as The Silent Patient." },
  { name: "Agustina Bazterrica", tag: "Dystopian • Horror", bio: "Writes disturbing dystopian fiction including Tender Is the Flesh." },
  { name: "Matt Haig", tag: "Contemporary • Fantasy", bio: "Known for emotional novels like The Midnight Library." }
];

// Use today’s date to select an author
const today = new Date();
const dayNumber = today.getDate(); // 1–31
const author = authors[dayNumber % authors.length];

//update author content
const aName = document.getElementById("aName");
const aTag = document.getElementById("aTag");
const aBio = document.getElementById("aBio");

if (aName) aName.textContent = author.name;
if (aTag) aTag.textContent = author.tag;
if (aBio) aBio.textContent = author.bio;

//show last updated date
const todayHint = document.getElementById("todayHint");
if (todayHint) todayHint.textContent = "Updated: " + today.toDateString();

//news letter. store in local storage
const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletterEmail");
const newsletterMsg = document.getElementById("newsletterMsg");
//key used in local storage 
const STORAGE_KEY = "readify_newsletter_email";

// show saved email if already subscribed
const savedEmail = localStorage.getItem(STORAGE_KEY);
if (savedEmail && newsletterEmail && newsletterMsg) {
  newsletterEmail.value = savedEmail;
  newsletterMsg.textContent = "You are already subscribed.";
}
//get form elements 
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
    //save email to local storage
    localStorage.setItem(STORAGE_KEY, email);
    newsletterMsg.textContent = "Thank you for subscribing!";
    newsletterForm.reset();
  });
}

//footer
const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

//displays trending featured books
const trendingBooks = [
  { id: "fourth-wing", title: "Fourth Wing", author: "Rebecca Yarros", cover: "images/BookCovers/FourthWing.jpg" },
  { id: "the-secret-history", title: "The Secret History", author: "Donna Tartt", cover: "images/BookCovers/SecretHistory.jpg" },
  { id: "silent-patient", title: "The Silent Patient", author: "Alex Michaelides", cover: "images/BookCovers/SilentPatient.jpg" },
  { id: "tender-is-the-flesh", title: "Tender Is the Flesh", author: "Agustina Bazterrica", cover: "images/BookCovers/Tenderistheflesh.jpg" },
  { id: "midnight-library", title: "The Midnight Library", author: "Matt Haig", cover: "images/BookCovers/MidnightLibrary.jpg" }
];
//inserts book to the shelf
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

//service worker pwa. enables offline support
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
