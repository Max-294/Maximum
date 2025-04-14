const words = ["SHRIMP", "WATER", "TANK", "FOOD", "FRESH"];
const puzzle = document.getElementById("puzzle");
const wordsList = document.getElementById("wordsList");

words.forEach(word => {
  const li = document.createElement("li");
  li.textContent = word;
  wordsList.appendChild(li);
});

// Generate random letters
for (let i = 0; i < 100; i++) {
  const div = document.createElement("div");
  div.textContent = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  puzzle.appendChild(div);
}