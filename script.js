function toggleTheme() {
  document.body.classList.toggle("dark");

  const btn = document.getElementById("themeToggle");
  if (document.body.classList.contains("dark")) {
    btn.innerText = "☀️ Light Mode";
  } else {
    btn.innerText = "🌙 Dark Mode";
  }
}


let startTime = null;
let endTime = null;

let totalKeystrokes = 0;
let backspaceCount = 0;
let longPauseCount = 0;
let flag=0;
let typespeed=0.0;
let CorrectionRate = 0.0;
let typedSentence = "";
let targetSentence = "";
let totalTime=0.0;
let reasons = [];
let pauseActive = false;

let lastKeyTime = null;
const LONG_PAUSE_THRESHOLD = 2000; 

const sentencePool = [
  "The cat is playing in the garden.",
  "Learning requires patience and regular practice.",
  "The sun rises in the east every morning.",
  "Children enjoy reading stories before bedtime.",
  "Technology helps people communicate more easily.",
  "Practice improves speed and accuracy over time.",
  "The teacher explained the lesson clearly.",
  "Music can improve focus and memory."
];

const baselineData = [
  { speed: 2.1, correction: 0.08, pauses: 1, wpm: 22 },
  { speed: 1.9, correction: 0.10, pauses: 2, wpm: 20 },
  { speed: 2.3, correction: 0.05, pauses: 0, wpm: 24 },
  { speed: 1.8, correction: 0.12, pauses: 3, wpm: 18 },
  { speed: 2.0, correction: 0.09, pauses: 1, wpm: 21 }
];


function initialize()
{
  const randomIndex = Math.floor(Math.random() * sentencePool.length);
  targetSentence = sentencePool[randomIndex];

  document.getElementById("targetSentence").innerText = targetSentence;
}

function mean(arr)
{
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function std(arr, mu)
{
  return Math.sqrt(arr.reduce((sum, x) => sum + Math.pow(x - mu, 2), 0) / arr.length );
}

function zScore(x, mu, sigma) 
{
  return (x - mu) / sigma;
}


function ending()
{
  startTime = null;
  endTime = null;

  totalKeystrokes = 0;
  backspaceCount = 0;
  longPauseCount = 0;

  flag = 0;
  lastKeyTime = null;
  typespeed=0.0;
  CorrectionRate=0.0;
  reasons = [];
}

function startTyping() 
{
  ending();
  if (!startTime) {
    startTime = Date.now();
    lastKeyTime = startTime;
  }
}

function recordKey(event) 
{ 
  if (!startTime) {
    startTime = Date.now();
    lastKeyTime = startTime;
  }
  if (event.key.length === 1 || event.key === "Backspace")
  {
    totalKeystrokes++;
  }

  if (event.key === "Backspace") {
    backspaceCount++;
  }

  if (Date.now() - lastKeyTime > LONG_PAUSE_THRESHOLD && !pauseActive) 
  {
    longPauseCount++;
    pauseActive = true;
  }
  pauseActive = false;

  lastKeyTime = Date.now();
}

function SubmitEvent()
{
  flag = 0;
  reasons = [];
  typedSentence = document.getElementById("typingArea").value;
  if (!startTime)
  {
    document.getElementById("Match").innerHTML = "Please start typing before submitting.";
    return;
  }

  endTime = Date.now();
  const timeTakenSeconds = ((endTime - startTime) / 1000);
  totalTime = (endTime - startTime) / 1000;
  let typedChars = typedSentence.length;
  typespeed = typedChars / totalTime;
  CorrectionRate=backspaceCount/totalKeystrokes;

  document.getElementById("timeTaken").textContent = timeTakenSeconds + " seconds";

  document.getElementById("keystrokes").textContent = totalKeystrokes;

  document.getElementById("backspaces").textContent = backspaceCount;

  document.getElementById("pauses").textContent = longPauseCount;

  totalTime=(endTime - startTime) / 1000;
  let length = typedSentence.length;
  let wpm=(length/5)/(totalTime/60);

  //document.getElementById("wpm").textContent = wpm.toFixed(2) + " WPM";
  const baseline = {
                     speed: {
                              mean: mean(baselineData.map(d => d.speed)),
                              std: std(baselineData.map(d => d.speed), mean(baselineData.map(d => d.speed)))
                            },
                     correction: {
                                   mean: mean(baselineData.map(d => d.correction)),
                                   std: std(baselineData.map(d => d.correction), mean(baselineData.map(d => d.correction)))
                               },
                     pauses: {
                               mean: mean(baselineData.map(d => d.pauses)),
                               std: std(baselineData.map(d => d.pauses), mean(baselineData.map(d => d.pauses)))
                            },
                     wpm: {
                            mean: mean(baselineData.map(d => d.wpm)),
                            std: std(baselineData.map(d => d.wpm), mean(baselineData.map(d => d.wpm)))
                         }
                    };

  if (zScore(typespeed, baseline.speed.mean, baseline.speed.std) < -1.5)
  {
    flag++;
    reasons.push("Typing speed significantly below normal");
  }
  if (zScore(CorrectionRate, baseline.correction.mean, baseline.correction.std) > 1.5)
  {
    flag++;
    reasons.push("High correction rate");
  }
  if (zScore(longPauseCount, baseline.pauses.mean, baseline.pauses.std) > 1.5)
  {
    flag++;
    reasons.push("Frequent pauses");
  }
  if (zScore(wpm, baseline.wpm.mean, baseline.wpm.std) < -1.5)
  {
   flag++;
   reasons.push("Low Words Per Minute");
  }

  if(flag==0)
  {
    document.getElementById("Risk").textContent = "Low";
  }
  else if(flag==1)
  {
    document.getElementById("Risk").textContent = "Mild";
  }
  else
  {
    document.getElementById("Risk").textContent = "Needs Attention";
  }

  if(targetSentence!=typedSentence)
  {
    document.getElementById("Match").innerHTML = "The two sentences do not match. Please Try Again.";

    document.getElementById("typingArea").value = "";
    document.getElementById("typingArea").focus();
    ending();
    document.getElementById("timeTaken").textContent = "—"; document.getElementById("keystrokes").textContent = "—"; document.getElementById("backspaces").textContent = "—"; document.getElementById("pauses").textContent = "—"; document.getElementById("Risk").textContent = "Low / Mild / Needs Attention";
  }
  if(targetSentence==typedSentence)
  {
    document.getElementById("Match").innerHTML = "";
    document.getElementById("Reason").innerText = reasons.length ? "Reason: " + reasons.join(", ") : "Reason: Normal typing behavior";
    
  }


  console.log(wpm);
}

function resetTest() {
  // Reset textarea
  document.getElementById("typingArea").value = "";
  reasons = [];

  // Reset metrics display
  document.getElementById("timeTaken").innerText = "—";
  document.getElementById("keystrokes").innerText = "—";
  document.getElementById("backspaces").innerText = "—";
  document.getElementById("pauses").innerText = "—";

  // Reset result
  document.getElementById("Risk").innerText = "Low / Mild / Needs Attention";
  document.getElementById("Reason").innerText = "Reason: Typing behavior indicators";

  // Reset match message (if any)
  const matchDiv = document.getElementById("Match");
  if (matchDiv) {
    matchDiv.innerText = "";
  }

  // Reset JS tracking variables
  startTime = null;
  lastKeyTime = null;
  totalKeystrokes = 0;
  backspaceCount = 0;
  longPauseCount = 0;

  initialize();
}
function enterSubmit(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    SubmitEvent();
  }
}
