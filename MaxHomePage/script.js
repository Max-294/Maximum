// script.js

// Visitor counter
document.addEventListener("DOMContentLoaded", () => {
  const counterElement = document.getElementById("counter");
  let visits = localStorage.getItem("visitCount");
  visits = visits ? parseInt(visits) + 1 : 1;
  localStorage.setItem("visitCount", visits);
  counterElement.textContent = visits;
});

// Word Search Game Setup
const canvas = document.getElementById("wordsearch");
const ctx = canvas.getContext("2d");

const words = ["car", "smile", "man", "dog", "snow", "new", "boat", "show", "road", "same"];
const gridSize = 10;
const cellSize = 30;
canvas.width = gridSize * cellSize;
canvas.height = gridSize * cellSize;

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const grid = Array.from({ length: gridSize }, () =>
  Array.from({ length: gridSize }, () => letters[Math.floor(Math.random() * letters.length)])
);

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      ctx.fillText(grid[y][x], x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
    }
  }
}
drawGrid();

// Subscribe interaction
function subscribe() {
  const email = document.getElementById("emailInput").value;
  const msg = document.getElementById("subMessage");
  if (email.includes("@")) {
    msg.textContent = `感謝訂閱：${email}`;
    msg.style.color = "green";
  } else {
    msg.textContent = "請輸入正確的 Email 格式！";
    msg.style.color = "red";
  }
}
