// Visitor Counter
let visitorCount = localStorage.getItem('visitorCount') || 0;
visitorCount++;
localStorage.setItem('visitorCount', visitorCount);
document.getElementById('visitor-count').textContent = visitorCount;

// Word Search Game
const fixedWords = ["SHRIMP", "THAI", "HOME", "WATER", "TANK", "FISH", "SEA", "FOOD", "SHELL", "CLAW"];
let puzzleData = [];
let selectedCells = [];
let foundWords = new Set();
let wordPositions = []; // To store the positions of words for the solution

// Generate a New Puzzle
function generatePuzzle() {
    const puzzleDiv = document.getElementById('puzzle');
    const wordList = document.getElementById('words-to-find');
    puzzleDiv.innerHTML = '';
    wordList.innerHTML = '';
    selectedCells = [];
    foundWords.clear();
    wordPositions = [];

    // Create a 10x10 grid
    const size = 10;
    puzzleData = Array(size).fill().map(() => Array(size).fill(' '));

    // Place words in the grid (horizontal or vertical)
    fixedWords.forEach(word => {
        let placed = false;
        while (!placed) {
            const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
            let row, col;

            if (direction === 'horizontal') {
                row = Math.floor(Math.random() * size);
                col = Math.floor(Math.random() * (size - word.length + 1));
                let canPlace = true;
                for (let i = 0; i < word.length; i++) {
                    if (puzzleData[row][col + i] !== ' ' && puzzleData[row][col + i] !== word[i]) {
                        canPlace = false;
                        break;
                    }
                }
                if (canPlace) {
                    const positions = [];
                    for (let i = 0; i < word.length; i++) {
                        puzzleData[row][col + i] = word[i];
                        positions.push({ row, col: col + i });
                    }
                    wordPositions.push({ word, positions });
                    placed = true;
                }
            } else {
                row = Math.floor(Math.random() * (size - word.length + 1));
                col = Math.floor(Math.random() * size);
                let canPlace = true;
                for (let i = 0; i < word.length; i++) {
                    if (puzzleData[row + i][col] !== ' ' && puzzleData[row + i][col] !== word[i]) {
                        canPlace = false;
                        break;
                    }
                }
                if (canPlace) {
                    const positions = [];
                    for (let i = 0; i < word.length; i++) {
                        puzzleData[row + i][col] = word[i];
                        positions.push({ row: row + i, col });
                    }
                    wordPositions.push({ word, positions });
                    placed = true;
                }
            }
        }
    });

    // Fill remaining spaces with random letters
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (puzzleData[row][col] === ' ') {
                puzzleData[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }

    // Render the puzzle
    puzzleData.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        row.forEach((letter, colIndex) => {
            const cell = document.createElement('span');
            cell.textContent = letter;
            cell.dataset.row = rowIndex;
            cell.dataset.col = colIndex;
            cell.addEventListener('click', () => selectCell(cell));
            rowDiv.appendChild(cell);
        });
        puzzleDiv.appendChild(rowDiv);
    });

    // Render the word list
    fixedWords.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        li.dataset.word = word;
        wordList.appendChild(li);
    });
}

// Regenerate Puzzle (called when clicking the link or button)
function regeneratePuzzle() {
    generatePuzzle();
}

// Show Solution
function showSolution() {
    document.querySelectorAll('#puzzle span').forEach(cell => {
        cell.classList.remove('selected', 'solution');
    });

    wordPositions.forEach(({ positions }) => {
        positions.forEach(({ row, col }) => {
            const cell = document.querySelector(`#puzzle span[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                cell.classList.add('solution');
            }
        });
    });

    // Mark all words as found
    fixedWords.forEach(word => {
        foundWords.add(word);
        const wordItem = document.querySelector(`#words-to-find li[data-word="${word}"]`);
        if (wordItem) {
            wordItem.classList.add('found');
        }
    });
}

// Select Cells for Word Search
function selectCell(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (selectedCells.some(c => c.row === row && c.col === col)) {
        // Deselect if already selected
        selectedCells = selectedCells.filter(c => !(c.row === row && c.col === col));
        cell.classList.remove('selected');
    } else {
        selectedCells.push({ row, col });
        cell.classList.add('selected');
    }

    checkWord();
}

// Check if Selected Cells Form a Word
function checkWord() {
    if (selectedCells.length < 3) return;

    // Check horizontal
    let word = '';
    const sortedByCol = [...selectedCells].sort((a, b) => a.col - b.col);
    if (sortedByCol.every((c, i) => i === 0 || c.col === sortedByCol[i-1].col + 1) && sortedByCol.every(c => c.row === sortedByCol[0].row)) {
        word = sortedByCol.map(c => puzzleData[c.row][c.col]).join('');
    }

    // Check vertical
    const sortedByRow = [...selectedCells].sort((a, b) => a.row - b.row);
    if (sortedByRow.every((c, i) => i === 0 || c.row === sortedByRow[i-1].row + 1) && sortedByRow.every(c => c.col === sortedByRow[0].col)) {
        word = sortedByRow.map(c => puzzleData[c.row][c.col]).join('');
    }

    if (fixedWords.includes(word) && !foundWords.has(word)) {
        foundWords.add(word);
        document.querySelector(`#words-to-find li[data-word="${word}"]`).classList.add('found');
        selectedCells = [];
        document.querySelectorAll('#puzzle span').forEach(cell => cell.classList.remove('selected'));
    }
}

// Subscription List
let subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];

function renderSubscribers() {
    const list = document.getElementById('subscriber-list');
    if (!list) {
        console.error('Subscriber list element not found!');
        return;
    }
    list.innerHTML = '';
    subscribers.forEach((name, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${name}`;
        list.appendChild(li);
    });
}

function addSubscriber() {
    const nameInput = document.getElementById('subscriber-name');
    const passwordInput = document.getElementById('password');

    if (!nameInput || !passwordInput) {
        console.error('Input elements not found!');
        return;
    }

    const name = nameInput.value.trim();
    const password = passwordInput.value;

    if (password !== '1125') {
        alert('密碼錯誤！請輸入正確密碼 (1125)。');
        return;
    }

    if (name === '') {
        alert('請輸入名稱！');
        return;
    }

    subscribers.push(name);
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
    renderSubscribers();
    alert(`成功新增訂閱者: ${name}`);
    nameInput.value = '';
    passwordInput.value = '';
}

function deleteSubscriber() {
    const nameInput = document.getElementById('subscriber-name');
    const passwordInput = document.getElementById('password');

    if (!nameInput || !passwordInput) {
        console.error('Input elements not found!');
        return;
    }

    const name = nameInput.value.trim();
    const password = passwordInput.value;

    if (password !== '1125') {
        alert('密碼錯誤！請輸入正確密碼 (1125)。');
        return;
    }

    const index = subscribers.indexOf(name);
    if (index === -1) {
        alert('找不到該名稱！');
        return;
    }

    subscribers.splice(index, 1);
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
    renderSubscribers();
    alert(`成功刪除訂閱者: ${name}`);
    nameInput.value = '';
    passwordInput.value = '';
}

// Initialize
window.onload = () => {
    generatePuzzle();
    renderSubscribers();
};