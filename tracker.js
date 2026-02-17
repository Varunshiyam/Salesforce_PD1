/* ============================
   GLOBAL SESSION STATE
============================ */
let USER_NAME = "";
let USER_EMAIL = "";
let TEST_SET = "";
let TEST_START_TIME = null;

/* 🔴 PUT YOUR GOOGLE APPS SCRIPT URL HERE */
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxXILbHNQIytZKPsxlp6vGOc1KzMI3CZNRzPc9vOzbSHPiYbN1vK63OLmVZ9Qug7SeuCw/exec";

/* ============================
   USER CAPTURE
============================ */
function captureUserInfo() {
  const nameEl = document.getElementById("usernameInput");
  const emailEl = document.getElementById("emailInput");

  if (!nameEl || !emailEl) {
    alert("Input fields missing");
    return false;
  }

  USER_NAME = nameEl.value.trim();
  USER_EMAIL = emailEl.value.trim();

  if (!USER_NAME || !USER_EMAIL) {
    alert("Please enter Name and Email");
    return false;
  }

  return true;
}

/* ============================
   TRACKER INIT
============================ */
function initTracker(setName) {
  TEST_SET = setName;
  TEST_START_TIME = new Date();
}

/* ============================
   TIME CALC
============================ */
function getTimeTaken() {
  if (!TEST_START_TIME) return "00:00:00";

  const diff = Math.floor((Date.now() - TEST_START_TIME.getTime()) / 1000);
  const h = String(Math.floor(diff / 3600)).padStart(2, "0");
  const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
  const s = String(diff % 60).padStart(2, "0");

  return `${h}:${m}:${s}`;
}

/* ============================
   GOOGLE SHEET SUBMIT
============================ */
function sendResultsToGoogleSheet(payload) {
  fetch(GOOGLE_SHEET_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(() => console.log("✅ Google Sheet updated"))
    .catch(err => console.error("❌ Sheet update failed", err));
}
