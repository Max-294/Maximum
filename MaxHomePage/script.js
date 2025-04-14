// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB2RNGWJ0VAgDyWRG84CuE_EHktd9ThkXI",
    authDomain: "shrimp-s-first-home.firebaseapp.com",
    databaseURL: "https://shrimp-s-first-home-default-rtdb.firebaseio.com",
    projectId: "shrimp-s-first-home",
    storageBucket: "shrimp-s-first-home.firebasestorage.app",
    messagingSenderId: "674906578968",
    appId: "1:674906578968:web:e7bbdd5261caacd201636d",
    measurementId: "G-MNCCYWXR83"
  };

// Initialize Firebase app
try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

// Reference to the Realtime Database
let db, visitorRef;
try {
    db = firebase.database();
    visitorRef = db.ref('visitorCount');
} catch (error) {
    console.error("Error setting up Firebase database reference:", error);
}

// Visitor Counter
function updateVisitorCount() {
    const visitorCountElement = document.getElementById('visitor-count');
    if (!visitorCountElement) {
        console.error("Visitor count element not found!");
        return;
    }

    // Fallback counter using localStorage
    let localVisitorCount = parseInt(localStorage.getItem('visitorCount')) || 0;

    if (visitorRef) {
        visitorRef.once('value', (snapshot) => {
            let visitorCount = snapshot.val() || 0;
            visitorCount++;
            visitorRef.set(visitorCount).then(() => {
                visitorCountElement.textContent = visitorCount;
                console.log("Visitor count updated in Firebase:", visitorCount);
            }).catch((error) => {
                console.error("Error updating visitor count in Firebase:", error);
                // Fallback to local counter
                localVisitorCount++;
                localStorage.setItem('visitorCount', localVisitorCount);
                visitorCountElement.textContent = localVisitorCount;
            });
        }, (error) => {
            console.error("Error fetching visitor count from Firebase:", error);
            // Fallback to local counter
            localVisitorCount++;
            localStorage.setItem('visitorCount', localVisitorCount);
            visitorCountElement.textContent = localVisitorCount;
        });
    } else {
        // If Firebase isn't available, use local counter
        localVisitorCount++;
        localStorage.setItem('visitorCount', localVisitorCount);
        visitorCountElement.textContent = localVisitorCount;
        console.warn("Firebase not available, using local counter:", localVisitorCount);
    }
}

// Word Search Game
const fixedWords = ["SHRIMP", "THAI", "HOME", "WATER", "TANK", "FISH", "SEA", "FOOD", "SHELL", "CLAW"];
let puzzleData = [];
let selectedCells = [];
let foundWords = new Set();
let wordPositions = [];

function generatePuzzle() {
    const puzzleDiv = document.getElementById('puzzle');
    const wordList = document.getElementById('words-to-find');
    if (!puzzleDiv || !wordList) {
        console.error("Puzzle or word list element not found!");
        return;
    }

    puzzleDiv.innerHTML = '';
    wordList.innerHTML = '';
    selectedCells = [];
    foundWords.clear();
    wordPositions = [];

    // Create a 10x10 grid
    const size = 10;
    puzzleData = Array(size).fill().map(() => Array(size).fill(' '));

    // Place words in the grid (horizontal, vertical, or diagonal)
    fixedWords.forEach(word => {
        let placed = false;
        while (!placed) {
            const direction = Math.floor(Math.random() * 4); // 0: horizontal, 1: vertical, 2: diagonal-right, 3: diagonal-left
            let row, col;

            if (direction === 0) { // Horizontal
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
            } else if (direction === 1) { // Vertical
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
            } else if (direction === 2) { // Diagonal-right (top-left to bottom-right)
                row = Math.floor(Math.random() * (size - word.length + 1));
                col = Math.floor(Math.random() * (size - word.length + 1));
                let canPlace = true;
                for (let i = 0; i < word.length; i++) {
                    if (puzzleData[row + i][col + i] !== ' ' && puzzleData[row + i][col + i] !== word[i]) {
                        canPlace = false;
                        break;
                    }
                }
                if (canPlace) {
                    const positions = [];
                    for (let i = 0; i < word.length; i++) {
                        puzzleData[row + i][col + i] = word[i];
                        positions.push({ row: row + i, col: col + i });
                    }
                    wordPositions.push({ word, positions });
                    placed = true;
                }
            } else { // Diagonal-left (top-right to bottom-left)
                row = Math.floor(Math.random() * (size - word.length + 1));
                col = Math.floor(Math.random() * word.length) + (word.length - 1);
                let canPlace = true;
                for (let i = 0; i < word.length; i++) {
                    if (puzzleData[row + i][col - i] !== ' ' && puzzleData[row + i][col - i] !== word[i]) {
                        canPlace = false;
                        break;
                    }
                }
                if (canPlace) {
                    const positions = [];
                    for (let i = 0; i < word.length; i++) {
                        puzzleData[row + i][col - i] = word[i];
                        positions.push({ row: row + i, col: col - i });
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

function regeneratePuzzle() {
    generatePuzzle();
}

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

    fixedWords.forEach(word => {
        foundWords.add(word);
        const wordItem = document.querySelector(`#words-to-find li[data-word="${word}"]`);
        if (wordItem) {
            wordItem.classList.add('found');
        }
    });
}

function selectCell(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (selectedCells.some(c => c.row === row && c.col === col)) {
        selectedCells = selectedCells.filter(c => !(c.row === row && c.col === col));
        cell.classList.remove('selected');
    } else {
        selectedCells.push({ row, col });
        cell.classList.add('selected');
    }

    checkWord();
}

function checkWord() {
    if (selectedCells.length < 3) return;

    let word = '';

    const sortedByCol = [...selectedCells].sort((a, b) => a.col - b.col);
    if (sortedByCol.every((c, i) => i === 0 || c.col === sortedByCol[i-1].col + 1) && sortedByCol.every(c => c.row === sortedByCol[0].row)) {
        word = sortedByCol.map(c => puzzleData[c.row][c.col]).join('');
    }

    const sortedByRow = [...selectedCells].sort((a, b) => a.row - b.row);
    if (sortedByRow.every((c, i) => i === 0 || c.row === sortedByRow[i-1].row + 1) && sortedByRow.every(c => c.col === sortedByRow[0].col)) {
        word = sortedByRow.map(c => puzzleData[c.row][c.col]).join('');
    }

    const sortedByRowCol = [...selectedCells].sort((a, b) => a.row - b.row || a.col - b.col);
    if (sortedByRowCol.every((c, i) => i === 0 || (c.row === sortedByRowCol[i-1].row + 1 && c.col === sortedByRowCol[i-1].col + 1))) {
        word = sortedByRowCol.map(c => puzzleData[c.row][c.col]).join('');
    }

    const sortedByRowColDesc = [...selectedCells].sort((a, b) => a.row - b.row || b.col - a.col);
    if (sortedByRowColDesc.every((c, i) => i === 0 || (c.row === sortedByRowColDesc[i-1].row + 1 && c.col === sortedByRowColDesc[i-1].col - 1))) {
        word = sortedByRowColDesc.map(c => puzzleData[c.row][c.col]).join('');
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
        console.error("Subscriber list element not found!");
        return;
    }
    list.innerHTML = '';
    subscribers.forEach((name, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${name}`; // Only display the name, not the password
        list.appendChild(li);
    });
}

function addSubscriber() {
    const nameInput = document.getElementById('subscriber-name');
    const passwordInput = document.getElementById('password');

    if (!nameInput || !passwordInput) {
        console.error("Input elements not found!");
        return;
    }

    const name = nameInput.value.trim();
    const password = passwordInput.value;

    if (password !== '1125') {
        alert('密碼錯誤！');
        return;
    }

    if (name === '') {
        alert('請輸入名稱！');
        return;
    }

    subscribers.push(name);
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
    renderSubscribers();
    alert(`成功新增訂閱者: ${name}`); // Do not display the password in the alert
    nameInput.value = '';
    passwordInput.value = '';
}

function deleteSubscriber() {
    const nameInput = document.getElementById('subscriber-name');
    const passwordInput = document.getElementById('password');

    if (!nameInput || !passwordInput) {
        console.error("Input elements not found!");
        return;
    }

    const name = nameInput.value.trim();
    const password = passwordInput.value;

    if (password !== '1125') {
        alert('密碼錯誤！');
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
    alert(`成功刪除訂閱者: ${name}`); // Do not display the password in the alert
    nameInput.value = '';
    passwordInput.value = '';
}

// Initialize
window.onload = () => {
    updateVisitorCount();
    generatePuzzle();
    renderSubscribers();
};