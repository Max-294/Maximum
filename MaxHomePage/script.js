// Visitor Counter
let visitorCount = localStorage.getItem('visitorCount') || 0;
visitorCount++;
localStorage.setItem('visitorCount', visitorCount);
document.getElementById('visitor-count').textContent = visitorCount;

// Word Search Game
const puzzleData = [
    "JLIBPNZQOAJD",
    "KBFAMZSBEARO",
    "OAKTMICETQGU",
    "YLLSHOEDAOGU",
    "SLHCOWZBTYAH",
    "MHANDSAOISLA",
    "TOPIFYPYAGJT",
    "EZTBELTEATAH"
];

const wordsToFind = ["BELT", "BEAR", "SHOE", "HAND", "BALL", "MICE", "TOYS", "BAT", "DOG", "TOP", "HAT", "ZAP", "GAL", "BOY", "CAT"];
let selectedCells = [];
let foundWords = new Set();

// Generate Puzzle
function generatePuzzle() {
    const puzzleDiv = document.getElementById('puzzle');
    puzzleData.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        row.split('').forEach((letter, colIndex) => {
            const cell = document.createElement('span');
            cell.textContent = letter;
            cell.dataset.row = rowIndex;
            cell.dataset.col = colIndex;
            cell.addEventListener('click', () => selectCell(cell));
            rowDiv.appendChild(cell);
        });
        puzzleDiv.appendChild(rowDiv);
    });

    const wordList = document.getElementById('words-to-find');
    wordsToFind.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        li.dataset.word = word;
        wordList.appendChild(li);
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

    if (wordsToFind.includes(word) && !foundWords.has(word)) {
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
    list.innerHTML = '';
    subscribers.forEach((name, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${name}`;
        list.appendChild(li);
    });
}

function addSubscriber() {
    const name = document.getElementById('subscriber-name').value.trim();
    const password = document.getElementById('password').value;

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
    document.getElementById('subscriber-name').value = '';
    document.getElementById('password').value = '';
}

function deleteSubscriber() {
    const name = document.getElementById('subscriber-name').value.trim();
    const password = document.getElementById('password').value;

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
    document.getElementById('subscriber-name').value = '';
    document.getElementById('password').value = '';
}

// Initialize
window.onload = () => {
    generatePuzzle();
    renderSubscribers();
};