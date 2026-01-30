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

function initialize()
{
  const randomIndex = Math.floor(Math.random() * sentencePool.length);
  targetSentence = sentencePool[randomIndex];

  document.getElementById("targetSentence").innerText = targetSentence;
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

  totalKeystrokes++;

  if (event.key === "Backspace") {
    backspaceCount++;
  }

  if (lastKeyTime && Date.now() - lastKeyTime > LONG_PAUSE_THRESHOLD) {
    longPauseCount++;
  }

  lastKeyTime = Date.now();
}

function SubmitEvent()
{
  typedSentence = document.getElementById("typingArea").value;
  if (!startTime)
  {
    document.getElementById("Match").innerHTML = "Please start typing before submitting.";
    return;
  }

  endTime = Date.now();
  const timeTakenSeconds = ((endTime - startTime) / 1000);

  
  typespeed=totalKeystrokes/timeTakenSeconds.toFixed(2);
  CorrectionRate=backspaceCount/totalKeystrokes;

  document.getElementById("timeTaken").textContent = timeTakenSeconds + " seconds";

  document.getElementById("keystrokes").textContent = totalKeystrokes;

  document.getElementById("backspaces").textContent = backspaceCount;

  document.getElementById("pauses").textContent = longPauseCount;

  totalTime=(endTime - startTime) / 1000;
  let length=targetSentence.length;
  let wpm=(length/5)/(totalTime/60);

  //document.getElementById("wpm").textContent = wpm.toFixed(2) + " WPM";


  if(typespeed<1.5)
  {
    flag++;
  }
  if(CorrectionRate >= 25/100)
  {
    flag++;
  }
  if(longPauseCount >= 4)
  {
    flag++;
  }
  if(wpm<13)
  {
   flag++;
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

  let r1="";
  if(typespeed<1.5)
  {
    r1="Low Typing Speed";
  }
  if(CorrectionRate >= 25/100)
  {
    if(r1=="")
    {
      r1="High Correction Rate";
    }
    else
    {
      r1=r1+", High Correction Rate";
    }
  }
  if(longPauseCount >= 4)
  {
    if(r1=="")
    {
      r1="Frequent Pauses";
    }
    else
    {
      r1=r1+", Frequent Pauses";
    }
  }
  if(wpm<13)
  {
    if(r1=="")
    {
      r1="Low Words Per Minute";
    }
    else
    {
      r1=r1+", Low Words Per Minute";
    }
  }
  document.getElementById("Reason").textContent = r1;
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
    
  }


  console.log(wpm);
}

function resetTest() {
  // Reset textarea
  document.getElementById("typingArea").value = "";

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
}
function enterSubmit(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    SubmitEvent();
  }
}
