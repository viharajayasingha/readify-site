/* =========================
   READIFY – FEEDBACK (Beginner Friendly)
   - Form validation
   - Save feedback in localStorage
   - Confirmation message
   - FAQ accordion
========================= */

/* HAMBURGER MENU */
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navMenu = document.getElementById("navMenu");

if (hamburgerBtn && navMenu) {
  hamburgerBtn.addEventListener("click", function () {
    navMenu.classList.toggle("show");
    const isOpen = navMenu.classList.contains("show");
    hamburgerBtn.setAttribute("aria-expanded", isOpen);
  });
}

/* FORM ELEMENTS */
const feedbackForm = document.getElementById("feedbackForm");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const messageInput = document.getElementById("messageInput");

const feedbackMsg = document.getElementById("feedbackMsg");
const clearFeedbackBtn = document.getElementById("clearFeedbackBtn");

const savedFeedbackBox = document.getElementById("savedFeedbackBox");

/* STORAGE KEY */
const FEEDBACK_KEY = "readify_feedback_list";

/* Simple email check (beginner friendly) */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMessage(text, isError) {
  feedbackMsg.textContent = text;
  feedbackMsg.style.color = isError ? "#b00020" : "#543310";
}

function loadFeedbackList() {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFeedbackList(list) {
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
}

/* Show latest saved feedback (optional display) */
function renderLatestFeedback() {
  const list = loadFeedbackList();
  savedFeedbackBox.innerHTML = "";

  if (list.length === 0) {
    savedFeedbackBox.innerHTML = `<p class="muted">No feedback saved yet.</p>`;
    return;
  }

  const latest = list[list.length - 1];

  savedFeedbackBox.innerHTML = `
    <div class="saved-feedback-item">
      <p><strong>Name:</strong> ${latest.name}</p>
      <p><strong>Email:</strong> ${latest.email}</p>
      <p><strong>Message:</strong> ${latest.message}</p>
      <p class="muted"><strong>Date:</strong> ${latest.date}</p>
    </div>
  `;
}

/* SUBMIT */
feedbackForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  // validation
  if (name.length < 2) {
    showMessage("Please enter your name (at least 2 characters).", true);
    return;
  }

  if (!isValidEmail(email)) {
    showMessage("Please enter a valid email address.", true);
    return;
  }

  if (message.length < 10) {
    showMessage("Message should be at least 10 characters.", true);
    return;
  }

  // save to localStorage
  const list = loadFeedbackList();
  list.push({
    name: name,
    email: email,
    message: message,
    date: new Date().toDateString()
  });
  saveFeedbackList(list);

  showMessage("Thank you! Your feedback has been saved.", false);
  feedbackForm.reset();
  renderLatestFeedback();
});

/* CLEAR SAVED */
clearFeedbackBtn.addEventListener("click", function () {
  localStorage.removeItem(FEEDBACK_KEY);
  showMessage("Saved feedback cleared.", false);
  renderLatestFeedback();
});

/* FAQ ACCORDION */
const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const item = btn.parentElement; // .faq-item
    item.classList.toggle("open");
  });
});

/* INIT */
renderLatestFeedback();
