// 單字遊戲相關代碼
const wordsToFind = [
    "SHRIMP", "SWAM", "RAIN", "BIG", "THE",
    "GET", "GIA", "ANIMAL", "HAD", "VIA",
    "NAME", "EAT", "RIVER", "FIND", "FULL"
];
let matrix = [];
let selectedLetters = [];
let foundWords = new Set();

// 顯示不同內容
function showContent(type) {
    const content = document.getElementById("content");
    content.innerHTML = ""; // 清空右側內容

    if (type === "word-search") {
        const message = document.createElement("p");
        message.textContent = `Word search 區域，它是這個網站裡面唯一的好玩遊戲，它叫做：word search，它可以幫助您的意志力變強。`;
        message.style.whiteSpace = "pre-line";
        content.appendChild(message);
    } else if (type === "Idea") {
        const message = document.createElement("p");
        message.textContent = `idea區域。\n第１個『idea』：您可以點第１個框，那個框裡面寫著：word search，看它的內容，去做做看吧。\n第２個『idea』：您可以點第２個框，那個框裡面寫著：解說，您也可看一看裡面寫了什麼？\n第３個『idea』：您可以點第３個框，也就是現在在的這個圖面上，您也可以照著這些提示去做。\n第４個『idea』：您可以點第４個框，那個框裡面寫著：試玩，您可以玩裡面的 word search 遊戲。`;
        message.style.whiteSpace = "pre-line";
        content.appendChild(message);
    } else if (type === "解說") {
        const message = document.createElement("p");
        message.textContent = `解說區域。\n『解說』１：word search, 請點下 word search 框紀錄ㄧ下您玩到的地方吧！\n『解說』２：先告訴您，試玩框裡面的遊戲只是試玩的，但是它有♾️關。`;
        message.style.whiteSpace = "pre-line";
        content.appendChild(message);
    } else if (type === "試玩") {
        // 加載遊戲界面
        const gameContainer = document.createElement("div");
        gameContainer.innerHTML = `
            <h1>找單字遊戲</h1>
            <p>請從矩陣中找到以下單字：</p>
            <ul id="word-list"></ul>
            <div class="grid" id="letter-grid"></div>
            <button onclick="resetGame()">生成新矩陣</button>
            <button onclick="revealAnswers()">顯示所有答案</button>
            <p id="message"></p>
        `;
        content.appendChild(gameContainer);
        resetGame(); // 初始化遊戲
    } else {
        // 顯示其他內容 (訂閱)
        const message = document.createElement("p");
        message.textContent = `訂閱者名單：\n`;
        content.appendChild(message);
    }
}

function generateMatrixWithWords(rows, cols, words) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const matrix = Array.from({ length: rows }, () => Array(cols).fill(''));

    function placeWord(word) {
        const directions = [
            [0, 1], [1, 0], [1, 1], [-1, 1] // 橫向、直向、斜向
        ];
        let placed = false;

        while (!placed) {
            const startRow = Math.floor(Math.random() * rows);
            const startCol = Math.floor(Math.random() * cols);
            const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
            let canPlace = true;

            for (let i = 0; i < word.length; i++) {
                const newRow = startRow + i * dx;
                const newCol = startCol + i * dy;
                if (
                    newRow < 0 || newRow >= rows || 
                    newCol < 0 || newCol >= cols ||
                    (matrix[newRow][newCol] && matrix[newRow][newCol] !== word[i])
                ) {
                    canPlace = false;
                    break;
                }
            }

            if (canPlace) {
                for (let i = 0; i < word.length; i++) {
                    const newRow = startRow + i * dx;
                    const newCol = startCol + i * dy;
                    matrix[newRow][newCol] = word[i];
                }
                placed = true;
            }
        }
    }

    words.forEach(placeWord);

    // 填充其餘空白處
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (!matrix[row][col]) {
                matrix[row][col] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
    }

    return matrix;
}

function renderGrid(matrix) {
    const letterGrid = document.getElementById("letter-grid");
    letterGrid.innerHTML = "";

    for (let row = 0; row < matrix.length; row++) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "grid-row";

        for (let col = 0; col < matrix[row].length; col++) {
            const cell = document.createElement("span");
            cell.className = "grid-cell";
            cell.textContent = matrix[row][col];
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.onclick = () => selectLetter(row, col, cell);
            rowDiv.appendChild(cell);
        }

        letterGrid.appendChild(rowDiv);
    }
}

function displayWords() {
    const wordListContainer = document.getElementById("word-list");
    wordListContainer.innerHTML = '';

    for (let i = 0; i < wordsToFind.length; i += 5) {
        const wordRow = document.createElement("div");
        wordRow.className = "word-row";

        const wordGroup = wordsToFind.slice(i, i + 5);
        wordGroup.forEach((word, index) => {
            const wordSpan = document.createElement("span");
            wordSpan.textContent = `${i + index + 1}. ${word}`;
            wordSpan.id = `word-${word}`;
            wordRow.appendChild(wordSpan);
        });

        wordListContainer.appendChild(wordRow);
    }
}

function selectLetter(row, col, cell) {
    if (cell.classList.contains("selected")) return;

    cell.classList.add("selected");
    selectedLetters.push({ row, col });

    const wordFormed = selectedLetters.map(({ row, col }) => matrix[row][col]).join('');

    if (wordsToFind.includes(wordFormed)) {
        document.getElementById(`word-${wordFormed}`).style.textDecoration = "line-through";
        foundWords.add(wordFormed);
        selectedLetters = [];
        document.getElementById("message").textContent = "您找到了！";

        if (foundWords.size === wordsToFind.length) {
            document.getElementById("message").textContent = "恭喜！您找到所有單字！";
        }
    }
}

function revealAnswers() {
    const letterGrid = document.getElementById("letter-grid");
    const allCells = letterGrid.getElementsByClassName("grid-cell");

    // 高亮所有單字
    for (const word of wordsToFind) {
        const positions = findWordInMatrix(word);
        if (positions) {
            positions.forEach(({ row, col }) => {
                const cell = [...allCells].find(
                    c => c.dataset.row == row && c.dataset.col == col
                );
                if (cell) cell.classList.add("selected"); // 高亮
            });

            // 單字列表加刪除線
            const wordSpan = document.getElementById(`word-${word}`);
            if (wordSpan) wordSpan.style.textDecoration = "line-through";
        }
    }

    document.getElementById("message").textContent = "所有答案已顯示！";
}

// 尋找單字在矩陣中的位置
function findWordInMatrix(word) {
    const directions = [
        [0, 1], [1, 0], [1, 1], [-1, 1], // 橫向、直向、斜向
        [0, -1], [-1, 0], [-1, -1], [1, -1] // 反方向
    ];

    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            for (const [dx, dy] of directions) {
                const positions = [];
                let match = true;

                for (let i = 0; i < word.length; i++) {
                    const newRow = row + i * dx;
                    const newCol = col + i * dy;

                    if (
                        newRow < 0 || newRow >= matrix.length || 
                        newCol < 0 || newCol >= matrix[0].length || 
                        matrix[newRow][newCol] !== word[i]
                    ) {
                        match = false;
                        break;
                    }

                    positions.push({ row: newRow, col: newCol });
                }

                if (match) return positions; // 返回整個單字的位置
            }
        }
    }

    return null; // 單字未找到
}

function isPartOfWord(row, col, word) {
    const directions = [
        [0, 1], [1, 0], [1, 1], [-1, 1], // 橫向、直向、斜向
        [0, -1], [-1, 0], [-1, -1], [1, -1] // 反方向
    ];

    for (const [dx, dy] of directions) {
        let match = true;
        for (let i = 0; i < word.length; i++) {
            const newRow = row + i * dx;
            const newCol = col + i * dy;

            if (
                newRow < 0 || newRow >= matrix.length || 
                newCol < 0 || newCol >= matrix[0].length || 
                matrix[newRow][newCol] !== word[i]
            ) {
                match = false;
                break;
            }
        }

        if (match) return true;
    }

    return false;
}

function resetGame() {
    selectedLetters = [];
    foundWords = new Set();
    document.getElementById("message").textContent = "";
    matrix = generateMatrixWithWords(20, 20, wordsToFind);
    renderGrid(matrix);
    displayWords();
}

document.addEventListener("DOMContentLoaded", resetGame);
