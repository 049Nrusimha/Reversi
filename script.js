const gameContainer = document.getElementById('game-container');
const board = document.querySelector('.board');
const statusElement = document.getElementById('status');
const gameOverMessage = document.getElementById('game-over-message');
const blackScoreElement = document.getElementById('black-score');
const whiteScoreElement = document.getElementById('white-score');

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
    getCell(3, 4).appendChild(createPiece('white'));
    getCell(4, 3).appendChild(createPiece('white'));
    getCell(3, 3).appendChild(createPiece('black'));
    getCell(4, 4).appendChild(createPiece('black'));

    updateScores();
}

function getCell(row, col) {
    return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

function createPiece(color) {
    const piece = document.createElement('div');
    piece.classList.add('piece', color);
    return piece;
}

function updateStatus() {
    if (!gameOver) {
        statusElement.textContent = `Current turn: ${currentPlayer === 'black' ? 'Black' : 'White'}`;
    } else {
        statusElement.textContent = ''; // Clear status when game is over
    }
}

function updateScores() {
    const blackCount = document.querySelectorAll('.black').length;
    const whiteCount = document.querySelectorAll('.white').length;
    blackScoreElement.textContent = `Black: ${blackCount}`;
    whiteScoreElement.textContent = `White: ${whiteCount}`;
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

    // Display game over message in place of the board
    board.style.display = 'none';
    gameOverMessage.style.display = 'block';
    
    // Clear status when game is over
    statusElement.textContent = '';
}

function isValidMove(row, col) {
    if (getCell(row, col).querySelector('.piece')) {
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

    let validMove = false;

    for (const dir of directions) {
        let newRow = row + dir.row;
        let newCol = col + dir.col;
        let foundOpponentDisc = false;

        while (isValidCell(newRow, newCol)) {
            const cell = getCell(newRow, newCol);

            if (cell.querySelector(`.${currentPlayer === 'black' ? 'white' : 'black'}`)) {
                foundOpponentDisc = true;
            } else if (cell.querySelector(`.${currentPlayer}`)) {
                if (foundOpponentDisc) {
                    validMove = true;
                }
                break;
            } else {
                break;
            }

            newRow += dir.row;
            newCol += dir.col;
        }
    }

    return validMove;
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

        if (isValidCell(newRow, newCol) && getCell(newRow, newCol).querySelector(`.${currentPlayer === 'black' ? 'white' : 'black'}`)) {
            const discsToFlip = [];
            let r = newRow;
            let c = newCol;

            while (isValidCell(r, c) && getCell(r, c).querySelector(`.${currentPlayer === 'black' ? 'white' : 'black'}`)) {
                discsToFlip.push(getCell(r, c).querySelector('.piece'));
                r += dir.row;
                c += dir.col;
            }

            if (isValidCell(r, c) && getCell(r, c).querySelector(`.${currentPlayer}`)) {
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
    } else if (!canPlayerMove(currentPlayer)) {
        // If the current player cannot make a move, switch to the opponent
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        updateStatus();
        highlightValidMoves();
    }
}

function canPlayerMove(player) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (isValidMove(row, col)) {
                return true;
            }
        }
    }
    return false;
}

function highlightValidMoves() {
    document.querySelectorAll('.cell').forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        // Remove any existing valid-move class
        cell.classList.remove('valid-move');

        // Check if the cell is a valid move for the current player
        if (!getCell(row, col).querySelector('.piece') && isValidMove(row, col)) {
            cell.classList.add('valid-move');
        }
    });
}

board.addEventListener('click', (event) => {
    if (gameOver) {
        return;
    }

    const clickedCell = event.target.closest('.cell');
    if (!clickedCell) return;

    const row = parseInt(clickedCell.dataset.row);
    const col = parseInt(clickedCell.dataset.col);

    if (isValidMove(row, col)) {
        flipDiscs(row, col);
        clickedCell.appendChild(createPiece(currentPlayer));
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        updateStatus();
        updateScores();
        checkGameOver();
    }

    // Highlight valid moves for the new current player
    highlightValidMoves();
});

initializeBoard();
updateStatus();
highlightValidMoves(); // Initial highlighting of valid moves for the starting player
