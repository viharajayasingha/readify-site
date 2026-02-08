//hamburger menu
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navMenu = document.getElementById("navMenu");

if (hamburgerBtn && navMenu) {
  hamburgerBtn.addEventListener("click", function () {
    navMenu.classList.toggle("show");
    const isOpen = navMenu.classList.contains("show");
    hamburgerBtn.setAttribute("aria-expanded", isOpen);
  });
}

//Form elements
const feedbackForm = document.getElementById("feedbackForm");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const messageInput = document.getElementById("messageInput");

const feedbackMsg = document.getElementById("feedbackMsg");
const clearFeedbackBtn = document.getElementById("clearFeedbackBtn");

const savedFeedbackBox = document.getElementById("savedFeedbackBox");

//Local storage key. used to store feedback in local storage
const FEEDBACK_KEY = "readify_feedback_list";

//email validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
//show feedback message
function showMessage(text, isError) {
  feedbackMsg.textContent = text;
  feedbackMsg.style.color = isError ? "#b00020" : "#543310";
}
//load saved feedback from local storage
function loadFeedbackList() {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
//Save feedback list back to localStorage
function saveFeedbackList(list) {
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
}

//display the most recent feedback
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

//validates input and saves feedback
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

//clear all saved feedback from local storage
clearFeedbackBtn.addEventListener("click", function () {
  localStorage.removeItem(FEEDBACK_KEY);
  showMessage("Saved feedback cleared.", false);
  renderLatestFeedback();
});

//Expands and collapse faq answers
const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const item = btn.parentElement; // .faq-item
    item.classList.toggle("open");
  });
});

//load saved feedback when page opens
renderLatestFeedback();
