
    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let vsAI = false;
    
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    const cells = document.querySelectorAll('.cell');
    const status = document.querySelector('.status');

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    function createConfetti() {
        for(let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.animation = `celebrate ${1 + Math.random() * 2}s linear`;
            document.body.appendChild(confetti);
            
            confetti.addEventListener('animationend', () => {
                confetti.remove();
            });
        }
    }

    function handleCellClick(e) {
        const cell = e.target;
        const index = cell.dataset.index;

        if (gameBoard[index] !== '' || !gameActive) return;

        makeMove(index);

        if (vsAI && gameActive) {
            setTimeout(makeAIMove, 500);
        }
    }

    function makeMove(index) {
        gameBoard[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        cells[index].style.animation = 'pulse 0.3s ease';

        if (checkWin()) {
            status.textContent = `Player ${currentPlayer} Wins!`;
            gameActive = false;
            createConfetti();
            return;
        }

        if (gameBoard.every(cell => cell !== '')) {
            status.textContent = "It's a Draw!";
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s Turn`;
    }

    function makeAIMove() {
        // Simple AI: Find first empty cell
        const emptyIndices = gameBoard
            .map((cell, index) => cell === '' ? index : null)
            .filter(index => index !== null);

        if (emptyIndices.length > 0) {
            const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            makeMove(randomIndex);
        }
    }

    function checkWin() {
        return winningCombos.some(combo => {
            if (
                gameBoard[combo[0]] &&
                gameBoard[combo[0]] === gameBoard[combo[1]] &&
                gameBoard[combo[0]] === gameBoard[combo[2]]
            ) {
                combo.forEach(index => {
                    cells[index].classList.add('winning-line');
                });
                return true;
            }
            return false;
        });
    }

    function resetGame() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        status.textContent = `Player ${currentPlayer}'s Turn`;
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('winning-line');
            cell.style.animation = '';
        });
    }

    function toggleAI() {
        vsAI = !vsAI;
        resetGame();
        const aiButton = document.querySelector('.controls button:last-child');
        aiButton.textContent = vsAI ? 'Play vs Human' : 'Play vs AI';
    }
