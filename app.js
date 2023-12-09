import { texts } from "./texts.js";

const textElement = document.querySelector(".texts");
const userInp = document.getElementById("user-inp");
const startBtn = document.querySelector(".start");
const time = document.querySelector(".time");
const wordCount = document.querySelector(".word-count");

let timerSec = 60;
let wordsIndex = 0;
let totalWordsTyped = 0;
let startTime;
let shuffledTexts;
let timerInterval;

startBtn.addEventListener("click", startGame);
  function startGame() {
    // wordCount.classList.add("none");
    startBtn.classList.add("none");
    textElement.classList.remove("none");

    // Reset values
    wordsIndex = 0;
    totalWordsTyped = 0;

    // Shuffle the texts array
    shuffledTexts = shuffleArray([...texts]);

    // Start the timer
    startTime = new Date().getTime();
    timerSec = 60;
    updateTimer(); // Update the initial timer value
    timerInterval = setInterval(() => {
      if (timerSec <= 0) {
        clearInterval(timerInterval);
        time.innerText = "Time's up!";
        showResult();
      } else {
        updateTimer();
        timerSec--;
      }
    }, 1000);

    // Display the initial text
    updateTextColors();

    // Listen for user input
    userInp.value = ""; // Clear the input field
    userInp.removeEventListener("input", checkInput); // Remove the previous event listener
    userInp.addEventListener("input", checkInput); // Add a new event listener
  }
// document.getElementById("logo").addEventListener("click", function () {
//   window.location.href = "index.html";
// });

function updateTimer() {
  if (timerSec <= 10) {
    time.classList.add("alert");
  }
  time.innerText = `${timerSec} Seconds Left`;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function checkInput() {
  const userInput = userInp.value.trim().split(" ");
  const currentWords = shuffledTexts[wordsIndex].split(" ");

  let coloredText = "";

  for (let i = 0; i < currentWords.length; i++) {
    if (userInput[i] === undefined) {
      // Word hasn't been typed yet, color it white
      coloredText += `<span class="not-typed">${currentWords[i]}</span> `;
    } else {
      const isCorrect = userInput[i] === currentWords[i];
      const colorClass = isCorrect ? "correct" : "incorrect";
      coloredText += `<span class="${colorClass}">${currentWords[i]}</span> `;
    }
  }

  textElement.innerHTML = coloredText.trim();

  // Check if the user has completed the current sentence
  if (
    userInput.length === currentWords.length &&
    userInput.every((word, index) => word === currentWords[index])
  ) {
    totalWordsTyped += currentWords.length;
    wordsIndex++;
    userInp.value = "";

    // Check if there are more sentences
    if (wordsIndex < shuffledTexts.length) {
      updateTextColors();
    } else {
      // All sentences are completed
      clearInterval(timerInterval);
      time.innerText = "Congratulations! You completed the challenge!";
      showResult();
    }
  }
}

function updateTextColors() {
  const words = shuffledTexts[wordsIndex].split(" ");
  let coloredText = "";

  for (let i = 0; i < words.length; i++) {
    coloredText += `<span>${words[i]}</span> `;
  }

  textElement.innerHTML = coloredText.trim();
}

function showResult() {
  time.classList.remove("alert");
  wordCount.classList.remove("none");
  const endTime = new Date().getTime();
  const minutes = (endTime - startTime) / 60000;
  const wpm = Math.round(totalWordsTyped / minutes);

  if (wpm < 10) {
    wordCount.innerText = `You might be typing with one finger: ${wpm} WPM`;
  } else if (wpm >= 10 && wpm < 15) {
    wordCount.innerText = `You're still warming up: ${wpm} WPM`;
  } else if (wpm >= 15 && wpm < 20) {
    wordCount.innerText = `You're getting into the flow: ${wpm} WPM`;
  } else if (wpm >= 20 && wpm < 30) {
    wordCount.innerText = `Impressive! Keep it up: ${wpm} WPM`;
  } else if (wpm >= 30 && wpm < 40) {
    wordCount.innerText = `You're a typing machine: ${wpm} WPM`;
  } else if (wpm >= 40) {
    wordCount.innerText = `Unbelievable! Are you even human? ${wpm} WPM`;
  } else {
    wordCount.innerText = `Your speed was ${wpm} WPM`;
  }
  startBtn.classList.remove("none");
  textElement.classList.add("none");
  userInp.value = "";
  totalWordsTyped = 0;
  wordsIndex = 0;

  // localStorage'dan mevcut en iyi skorları al veya boş bir dizi olarak başlat
  const topScores = JSON.parse(localStorage.getItem("topScores")) || [];

  // Şuanki WPM'yi en iyi skorlar listesine ekle
  topScores.push(wpm);

  // En iyi skorları azalan sırayla sırala
  topScores.sort((a, b) => b - a);

  // Sadece ilk 5 skoru sakla
  const top5Scores = topScores.slice(0, 5);

  // Güncellenmiş en iyi skorları localStorage'da sakla
  localStorage.setItem("topScores", JSON.stringify(top5Scores));
}
