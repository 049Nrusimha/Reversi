const board = document.querySelector('.board');
const statusElement = document.getElementById('status');
const gameOverMessage = document.getElementById('game-over-message');

let currentPlayer = 'black';
let gameOver = false;

function createCell(row, col) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.row = row;
    cell.dataset.col = col;
    board.appendChild(cell);
}

function initializeBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            createCell(row, col);
        }
    }

    // Initialize the starting discs
    getCell(3, 3).classList.add('white');
    getCell(4, 4).classList.add('white');
    getCell(3, 4).classList.add('black');
    getCell(4, 3).classList.add('black');
}

function getCell(row, col) {
    return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

initializeBoard();
updateStatus();

function updateStatus() {
    statusElement.textContent = `Current turn: ${currentPlayer === 'black' ? 'Black' : 'White'}`;
}

function updateGameOverMessage() {
    const blackCount = document.querySelectorAll('.black').length;
    const whiteCount = document.querySelectorAll('.white').length;

    if (blackCount > whiteCount) {
        gameOverMessage.textContent = 'Black wins!';
    } else if (whiteCount > blackCount) {
        gameOverMessage.textContent = 'White wins!';
    } else {
        gameOverMessage.textContent = 'It\'s a draw!';
    }
}



function isValidMove(row, col) {
    if (getCell(row, col).classList.contains('black') || getCell(row, col).classList.contains('white')) {
        return false; // Cell is already occupied
    }

    const directions = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
        { row: -1, col: -1 },
        { row: -1, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 1 }
    ];

    for (const dir of directions) {
        let newRow = row + dir.row;
        let newCol = col + dir.col;
        let foundOpponentDisc = false;

        while (isValidCell(newRow, newCol)) {
            const cell = getCell(newRow, newCol);

            if (cell.classList.contains(currentPlayer === 'black' ? 'white' : 'black')) {
                foundOpponentDisc = true;
            } else if (cell.classList.contains(currentPlayer)) {
                if (foundOpponentDisc) {
                    return true; // Valid move found
                } else {
                    break;
                }
            } else {
                break;
            }

            newRow += dir.row;
            newCol += dir.col;
        }
    }

    return false; // No valid move found in any direction
}




function flipDiscs(row, col) {
    const directions = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
        { row: -1, col: -1 },
        { row: -1, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 1 }
    ];

    for (const dir of directions) {
        const newRow = row + dir.row;
        const newCol = col + dir.col;

        if (isValidCell(newRow, newCol) && getCell(newRow, newCol).classList.contains(currentPlayer === 'black' ? 'white' : 'black')) {
            const discsToFlip = [];
            let r = newRow;
            let c = newCol;

            while (isValidCell(r, c) && getCell(r, c).classList.contains(currentPlayer === 'black' ? 'white' : 'black')) {
                discsToFlip.push(getCell(r, c));
                r += dir.row;
                c += dir.col;
            }

            if (isValidCell(r, c) && getCell(r, c).classList.contains(currentPlayer)) {
                for (const disc of discsToFlip) {
                    disc.classList.toggle('black');
                    disc.classList.toggle('white');
                }
            }
        }
    }
}

function isValidCell(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function checkGameOver() {
    const blackCanMove = canPlayerMove('black');
    const whiteCanMove = canPlayerMove('white');

    if (!blackCanMove && !whiteCanMove) {
        gameOver = true;
        updateGameOverMessage();
    }
}

function canPlayerMove(player) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (isValidMove(row, col) && isValidMove(row, col)) {
                return true;
            }
        }
    }
    return false;
}


board.addEventListener('click', (event) => {
    if (gameOver) {
        return;
    }

    const clickedCell = event.target;
    const row = parseInt(clickedCell.dataset.row);
    const col = parseInt(clickedCell.dataset.col);

    if (isValidMove(row, col)) {
        if (isValidMove(row, col)) {
            flipDiscs(row, col);
            clickedCell.classList.add(currentPlayer);
            currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
            updateStatus();
            checkGameOver();
        }
    }
});


        







