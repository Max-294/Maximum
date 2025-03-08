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

    if (type === "WordSearch") {
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
        const addsubscriber = document.createElement("div");
        addsubscriber.innerHTML = `
        <button onclick="openPrompt()">新增訂閱者</button>
	<button onclick="openPrompt2()">取消訂閱者</button>
        <div id="subscriber-list">
            <h3>訂閱者清單</h3>
            <ul id="name-list"></ul>
        </div>
        `;
        content.appendChild(addsubscriber);
    }
}

function openPrompt() {
    let name = prompt("請輸入訂閱者的姓名：");
    if (name && name.trim() !== "") {
        let list = document.getElementById("name-list");
        let listItem = document.createElement("li");
        listItem.textContent = name;
        list.appendChild(listItem);
        saveSubscribers();
    }
}

function openPrompt2() {
    let nameToDelete = prompt("請輸入要刪除的訂閱者姓名：");
    if (!nameToDelete || nameToDelete.trim() === "") return;

    let list = document.getElementById("name-list");
    let items = list.getElementsByTagName("li");
    let found = false;

    for (let i = 0; i < items.length; i++) {
        if (items[i].textContent === nameToDelete) {
            items[i].remove();
            found = true;
            break;
        }
    }

    if (found) {
        saveSubscribers();
        alert(`已刪除 ${nameToDelete}`);
    } else {
        alert(`找不到 ${nameToDelete}`);
    }
}



function saveSubscribers() {
    let names = [];
    document.querySelectorAll("#name-list li").forEach(li => names.push(li.textContent));
    
    console.log("準備存入 localStorage 的訂閱者名單:", names);
    localStorage.setItem("subscribers", JSON.stringify(names));

    // 確認 localStorage 內的數據是否已經正確存入
    console.log("存入後 localStorage.getItem('subscribers'):", localStorage.getItem("subscribers"));
}


function loadData() {
    console.log("開始執行 loadData()...");
    let checkExist = setInterval(() => {
        let nameList = document.getElementById("name-list");
        if (nameList) {
            clearInterval(checkExist); // 停止檢查
            console.log("成功找到 #name-list，開始載入資料");

            let savedNames = JSON.parse(localStorage.getItem("subscribers")) || [];
            console.log("載入的訂閱者名單:", savedNames);

            savedNames.forEach(name => {
                console.log("新增訂閱者:", name);
                let listItem = document.createElement("li");
                listItem.textContent = name;
                nameList.appendChild(listItem);
            });
        }
    }, 100); // 每 100 毫秒檢查一次，直到找到 #name-list
}
document.addEventListener("DOMContentLoaded", loadData);

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
