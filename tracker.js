/* =========================================================
   GLOBAL USER SESSION
========================================================= */

let USER_NAME = "";
let USER_EMAIL = "";
let TEST_SET = "";
let TEST_START_TIME = null;

/* 🔁 CHANGE THIS TO YOUR APPS SCRIPT URL */
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxXILbHNQIytZKPsxlp6vGOc1KzMI3CZNRzPc9vOzbSHPiYbN1vK63OLmVZ9Qug7SeuCw/exec";

/* =========================================================
   INITIALIZATION (CALL THIS ON START)
========================================================= */

function initTracker(testSetName) {
  TEST_SET = testSetName;
  TEST_START_TIME = new Date();
}

/* =========================================================
   CAPTURE USER INFO (CALL FROM startApp())
========================================================= */

function captureUserInfo() {
  USER_NAME = document.getElementById("usernameInput")?.value.trim();
  USER_EMAIL = document.getElementById("emailInput")?.value.trim();

  if (!USER_NAME || !USER_EMAIL) {
    alert("Name and Email are required");
    return false;
  }
  return true;
}

/* =========================================================
   CALCULATE TIME TAKEN
========================================================= */

function getTimeTaken() {
  const end = new Date();
  const diff = Math.floor((end - TEST_START_TIME) / 1000);

  const hrs = String(Math.floor(diff / 3600)).padStart(2, "0");
  const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
  const secs = String(diff % 60).padStart(2, "0");

  return `${hrs}:${mins}:${secs}`;
}

/* =========================================================
   RESULT CALCULATION (AUTO)
========================================================= */
/*
  EXPECTED GLOBALS FROM YOUR EXISTING APP:
  - questions[]
  - userAnswers[]  (array of selected indexes)
*/

function calculateResults() {
  let correct = 0;
  let wrong = 0;

  questions.forEach((q, index) => {
    const userAnswer = userAnswers[index];
    if (!userAnswer) return;

    if (JSON.stringify(userAnswer.sort()) === JSON.stringify(q.c.sort())) {
      correct++;
    } else {
      wrong++;
    }
  });

  const total = questions.length;
  const score = Math.round((correct / total) * 100);

  return {
    totalQuestions: total,
    correct,
    wrong,
    score: `${score}%`
  };
}

/* =========================================================
   SEND DATA TO GOOGLE SHEET
========================================================= */

function sendResultsToGoogleSheet() {
  const results = calculateResults();

  const payload = {
    name: USER_NAME,
    email: USER_EMAIL,
    testSet: TEST_SET,
    totalQuestions: results.totalQuestions,
    correct: results.correct,
    wrong: results.wrong,
    score: results.score,
    timeTaken: getTimeTaken()
  };

  fetch(GOOGLE_SHEET_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.json())
  .then(() => {
    console.log("✅ Results stored successfully");
  })
  .catch(err => {
    console.error("❌ Failed to store results", err);
  });
}
