

//hamburger menu
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navMenu = document.getElementById("navMenu");

if (hamburgerBtn && navMenu) {
  hamburgerBtn.addEventListener("click", function () {
    navMenu.classList.toggle("show");
    const isOpen = navMenu.classList.contains("show");
    hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
  });
}

//elements 
const trackerForm = document.getElementById("trackerForm");
const totalPagesEl = document.getElementById("totalPages");
const pagesReadEl = document.getElementById("pagesRead");
const speedEl = document.getElementById("speed");

const formMsg = document.getElementById("formMsg");
const resultsBox = document.getElementById("resultsBox"); 

const percentText = document.getElementById("percentText");
const remainingText = document.getElementById("remainingText");
const progressBar = document.getElementById("progressBar");
const daysText = document.getElementById("daysText");
const finishDateText = document.getElementById("finishDateText");

const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");

// Progress wrapper is used to update aria-valuenow (screen readers)
const progressWrap = document.querySelector(".progress-wrap");

// Safety: if the page doesn’t have required elements, stop 
if (!trackerForm || !totalPagesEl || !pagesReadEl || !speedEl) {
  console.error("Tracker elements missing. Check tracker.html IDs.");
}

//key name used inside the browser storage. keeps the user’s progress even after refresh.
const TRACKER_KEY = "readify_tracker_progress";

// Show a message below the form
function showMessage(text, isError) {
  if (!formMsg) return;
  formMsg.textContent = text;
  formMsg.style.color = isError ? "#b00020" : "#543310";
}
// Keep a number inside a safe range 
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

// Reset results area back to default values
function resetResultsUI() {
  if (resultsBox) resultsBox.style.display = "none";

  if (percentText) percentText.textContent = "0%";
  if (remainingText) remainingText.textContent = "0";
  if (daysText) daysText.textContent = "0";
  if (finishDateText) finishDateText.textContent = "—";

  if (progressBar) progressBar.style.width = "0%";
  if (progressWrap) progressWrap.setAttribute("aria-valuenow", "0");
}

function calculateAndShow(totalPages, pagesRead, speed) {
  // Remaining pages cannot be negative
  const remaining = Math.max(totalPages - pagesRead, 0);

  // Percent completed (0–100)
  const percentRaw = (pagesRead / totalPages) * 100;
  const percent = clamp(Math.round(percentRaw), 0, 100);

  // Days to finish
  let daysToFinish = 0;
  let finishDateTextValue = "—";

  if (remaining === 0) {
    daysToFinish = 0;
    finishDateTextValue = "Completed";
  } else {
    // Round up to full days
    daysToFinish = Math.ceil(remaining / speed);
    const finishDate = new Date();
    finishDate.setDate(finishDate.getDate() + daysToFinish);
    finishDateTextValue = finishDate.toDateString();
  }

  // Update UI
  if (percentText) percentText.textContent = percent + "%";
  if (remainingText) remainingText.textContent = String(remaining);
  if (daysText) daysText.textContent = String(daysToFinish);
  if (finishDateText) finishDateText.textContent = finishDateTextValue;

  // Progress bar
  if (progressBar) progressBar.style.width = percent + "%";

  // Update aria progress value for accessibility
  if (progressWrap) progressWrap.setAttribute("aria-valuenow", String(percent));

  if (resultsBox) resultsBox.style.display = "block";
}

//form submit (calculation)
if (trackerForm) {
  trackerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const totalPages = Number(totalPagesEl.value);
    const pagesRead = Number(pagesReadEl.value);
    const speed = Number(speedEl.value);

    // Validation
    if (!Number.isFinite(totalPages) || totalPages <= 0) {
      showMessage("Total pages must be more than 0.", true);
      return;
    }
    
    if (!Number.isFinite(pagesRead) || pagesRead < 0 || pagesRead > totalPages) {
      showMessage("Pages read must be between 0 and total pages.", true);
      return;
    }
    if (!Number.isFinite(speed) || speed <= 0) {
      showMessage("Reading speed must be more than 0.", true);
      return;
    }

    showMessage("Calculated successfully.", false);
    calculateAndShow(totalPages, pagesRead, speed);
  });
}

//save button
if (saveBtn) {
  saveBtn.addEventListener("click", function () {
    const totalPages = Number(totalPagesEl.value);
    const pagesRead = Number(pagesReadEl.value);
    const speed = Number(speedEl.value);

    // Require valid input before saving
    if (!Number.isFinite(totalPages) || totalPages <= 0) {
      showMessage("Enter a valid Total pages value before saving.", true);
      return;
    }
    if (!Number.isFinite(pagesRead) || pagesRead < 0 || pagesRead > totalPages) {
      showMessage("Enter a valid Pages read value before saving.", true);
      return;
    }
    if (!Number.isFinite(speed) || speed <= 0) {
      showMessage("Enter a valid Reading speed before saving.", true);
      return;
    }

    const data = { totalPages, pagesRead, speed };
    localStorage.setItem(TRACKER_KEY, JSON.stringify(data));
    showMessage("Saved to localStorage.", false);
  });
}

//Clears: form inputs, localStorage saved progress, results section
if (clearBtn) {
  clearBtn.addEventListener("click", function () {
    if (trackerForm) trackerForm.reset();
    localStorage.removeItem(TRACKER_KEY);
    resetResultsUI();
    showMessage("", false);
  });
}

//load data. When the page opens: Check if localStorage has saved progress, If yes → fill inputs + show results
(function loadSaved() {
  const raw = localStorage.getItem(TRACKER_KEY);
  //if nothing saved keep ui clean
  if (!raw) {
    resetResultsUI();
    return;
  }

  try {
    const saved = JSON.parse(raw);

    //fill inputs 
    totalPagesEl.value = saved.totalPages ?? "";
    pagesReadEl.value = saved.pagesRead ?? "";
    speedEl.value = saved.speed ?? "";

    // Only show results if saved values are valid
    const totalPages = Number(saved.totalPages);
    const pagesRead = Number(saved.pagesRead);
    const speed = Number(saved.speed);

    if (
      Number.isFinite(totalPages) && totalPages > 0 &&
      Number.isFinite(pagesRead) && pagesRead >= 0 && pagesRead <= totalPages &&
      Number.isFinite(speed) && speed > 0
    ) {
      calculateAndShow(totalPages, pagesRead, speed);
      showMessage("Loaded saved progress.", false);
    } else {
      //if stored data is wrong delete it
      localStorage.removeItem(TRACKER_KEY);
      resetResultsUI();
    }
  } catch (err) {
    //if json is broken delete it
    localStorage.removeItem(TRACKER_KEY);
    resetResultsUI();
  }
})();
