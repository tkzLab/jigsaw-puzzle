class NinjaPuzzleGame {
    constructor() {
        this.currentDifficulty = 'easy';
        this.gridSize = 3;
        this.puzzleData = [];
        this.startTime = null;
        this.timerInterval = null;
        this.gameCompleted = false;
        
        this.initializeGame();
        this.setupEventListeners();
    }
    
    initializeGame() {
        this.generatePuzzleData();
        this.createPuzzleGrid();
        this.createPuzzlePieces();
        this.resetTimer();
    }
    
    setupEventListeners() {
        // Difficulty selector
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.currentDifficulty = e.target.value;
            this.setGridSize();
            this.resetGame();
        });
        
        // Control buttons
        document.getElementById('shuffleBtn').addEventListener('click', () => {
            this.shufflePieces();
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });
        
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.resetGame();
            this.hideCongratulations();
        });
        
        // Initialize drag and drop
        this.setupDragAndDrop();
    }
    
    setGridSize() {
        switch(this.currentDifficulty) {
            case 'easy':
                this.gridSize = 3;
                break;
            case 'medium':
                this.gridSize = 4;
                break;
            case 'hard':
                this.gridSize = 5;
                break;
        }
    }
    
    generatePuzzleData() {
        this.puzzleData = [];
        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            this.puzzleData.push({
                id: i,
                correctPosition: i,
                currentPosition: null,
                isPlaced: false,
                content: this.getPieceContent(i)
            });
        }
    }
    
    getPieceContent(index) {
        // Generate different ninja-themed emojis for each piece
        const ninjaEmojis = ['🥷', '☕', '⚔️', '🍃', '🌟', '💫', '🎯', '🔥', '⚡', '🌙', '✨', '🎪', '🎨', '🎭', '🎪', '🎸', '🎺', '🎻', '🎹', '🎵', '🎶', '🎤', '🎧', '🎬', '🎮'];
        return ninjaEmojis[index % ninjaEmojis.length];
    }
    
    createPuzzleGrid() {
        const puzzleGrid = document.getElementById('puzzleGrid');
        puzzleGrid.innerHTML = '';
        puzzleGrid.className = `puzzle-grid size-${this.gridSize}`;
        
        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot';
            slot.dataset.position = i;
            puzzleGrid.appendChild(slot);
        }
    }
    
    createPuzzlePieces() {
        const piecesContainer = document.getElementById('puzzlePieces');
        piecesContainer.innerHTML = '';
        
        // Create reference grid to show the correct solution
        this.createReferenceGrid();
        
        // Shuffle pieces for initial placement
        const shuffledPieces = [...this.puzzleData].sort(() => Math.random() - 0.5);
        
        shuffledPieces.forEach(piece => {
            const pieceElement = document.createElement('div');
            pieceElement.className = 'puzzle-piece';
            pieceElement.draggable = true;
            pieceElement.dataset.pieceId = piece.id;
            pieceElement.textContent = piece.content;
            piecesContainer.appendChild(pieceElement);
        });
    }
    
    createReferenceGrid() {
        const referenceContainer = document.querySelector('.ninja-cup-reference');
        referenceContainer.innerHTML = '';
        referenceContainer.className = `ninja-cup-reference reference-grid size-${this.gridSize}`;
        
        // Create reference grid with correct pieces
        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            const refPiece = document.createElement('div');
            refPiece.className = 'reference-piece';
            refPiece.textContent = this.puzzleData[i].content;
            referenceContainer.appendChild(refPiece);
        }
    }
    
    setupDragAndDrop() {
        let draggedElement = null;
        
        // Drag start
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('puzzle-piece')) {
                draggedElement = e.target;
                e.target.classList.add('dragging');
                
                // Start timer on first move
                if (!this.startTime && !this.gameCompleted) {
                    this.startTimer();
                }
            }
        });
        
        // Drag end
        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('puzzle-piece')) {
                e.target.classList.remove('dragging');
                draggedElement = null;
            }
        });
        
        // Drag over
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (e.target.classList.contains('puzzle-slot')) {
                e.target.classList.add('drop-zone');
            }
        });
        
        // Drag leave
        document.addEventListener('dragleave', (e) => {
            if (e.target.classList.contains('puzzle-slot')) {
                e.target.classList.remove('drop-zone');
            }
        });
        
        // Drop
        document.addEventListener('drop', (e) => {
            e.preventDefault();
            if (e.target.classList.contains('puzzle-slot') && draggedElement) {
                this.handlePieceDrop(draggedElement, e.target);
                e.target.classList.remove('drop-zone');
            }
        });
        
        // Touch events for mobile support
        this.setupTouchEvents();
    }
    
    setupTouchEvents() {
        let touchedPiece = null;
        
        document.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('puzzle-piece')) {
                touchedPiece = e.target;
                e.target.classList.add('dragging');
                
                if (!this.startTime && !this.gameCompleted) {
                    this.startTimer();
                }
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });
        
        document.addEventListener('touchend', (e) => {
            if (touchedPiece) {
                const touch = e.changedTouches[0];
                const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                
                if (elementBelow && elementBelow.classList.contains('puzzle-slot')) {
                    this.handlePieceDrop(touchedPiece, elementBelow);
                }
                
                touchedPiece.classList.remove('dragging');
                touchedPiece = null;
            }
        });
    }
    
    handlePieceDrop(pieceElement, slotElement) {
        const pieceId = parseInt(pieceElement.dataset.pieceId);
        const slotPosition = parseInt(slotElement.dataset.position);
        
        // Check if slot is already occupied
        if (slotElement.classList.contains('occupied')) {
            // Move existing piece back to pieces container
            const existingPiece = slotElement.querySelector('.puzzle-piece');
            if (existingPiece) {
                document.getElementById('puzzlePieces').appendChild(existingPiece);
                this.puzzleData[parseInt(existingPiece.dataset.pieceId)].currentPosition = null;
                this.puzzleData[parseInt(existingPiece.dataset.pieceId)].isPlaced = false;
            }
        }
        
        // Place new piece
        slotElement.innerHTML = '';
        slotElement.appendChild(pieceElement);
        slotElement.classList.add('occupied');
        
        // Update puzzle data
        this.puzzleData[pieceId].currentPosition = slotPosition;
        this.puzzleData[pieceId].isPlaced = true;
        
        // Add special effect for correct placement
        if (pieceId === slotPosition) {
            slotElement.classList.add('correct-placement');
            this.showCorrectPlacementEffect(slotElement);
        } else {
            slotElement.classList.remove('correct-placement');
        }
        
        // Check for game completion
        this.updateProgress();
        if (this.checkWinCondition()) {
            this.gameCompleted = true;
            this.stopTimer();
            this.showCongratulations();
        }
    }
    
    showCorrectPlacementEffect(element) {
        element.style.animation = 'correctPlacement 0.5s ease-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
        
        // Add the animation to CSS if not already present
        if (!document.querySelector('#correctPlacementAnimation')) {
            const style = document.createElement('style');
            style.id = 'correctPlacementAnimation';
            style.textContent = `
                @keyframes correctPlacement {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); background-color: rgba(76, 175, 80, 0.3); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    updateProgress() {
        const correctPieces = this.puzzleData.filter(piece => 
            piece.isPlaced && piece.currentPosition === piece.correctPosition
        ).length;
        
        const totalPieces = this.puzzleData.length;
        const progressPercentage = Math.round((correctPieces / totalPieces) * 100);
        
        document.getElementById('progress').textContent = `${progressPercentage}%`;
    }
    
    checkWinCondition() {
        return this.puzzleData.every(piece => 
            piece.isPlaced && piece.currentPosition === piece.correctPosition
        );
    }
    
    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }
    
    updateTimer() {
        if (this.startTime) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            document.getElementById('timer').textContent = timeString;
        }
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    resetTimer() {
        this.stopTimer();
        this.startTime = null;
        document.getElementById('timer').textContent = '00:00';
    }
    
    shufflePieces() {
        const piecesContainer = document.getElementById('puzzlePieces');
        const pieces = Array.from(piecesContainer.children);
        
        // Move all pieces back to pieces container
        document.querySelectorAll('.puzzle-slot').forEach(slot => {
            const piece = slot.querySelector('.puzzle-piece');
            if (piece) {
                piecesContainer.appendChild(piece);
                const pieceId = parseInt(piece.dataset.pieceId);
                this.puzzleData[pieceId].currentPosition = null;
                this.puzzleData[pieceId].isPlaced = false;
            }
            slot.classList.remove('occupied', 'correct-placement');
            slot.innerHTML = '';
        });
        
        // Shuffle pieces
        const shuffled = pieces.sort(() => Math.random() - 0.5);
        shuffled.forEach(piece => piecesContainer.appendChild(piece));
        
        this.updateProgress();
    }
    
    resetGame() {
        this.gameCompleted = false;
        this.resetTimer();
        this.setGridSize();
        this.generatePuzzleData();
        this.createPuzzleGrid();
        this.createPuzzlePieces();
        this.updateProgress();
        this.hideCongratulations();
    }
    
    showCongratulations() {
        const finalTime = document.getElementById('timer').textContent;
        document.getElementById('finalTime').textContent = finalTime;
        document.getElementById('congratulations').classList.remove('hidden');
        
        // Add celebration effects
        this.createCelebrationEffects();
    }
    
    hideCongratulations() {
        document.getElementById('congratulations').classList.add('hidden');
    }
    
    createCelebrationEffects() {
        // Create floating emojis
        const emojis = ['🎉', '🎊', '✨', '🌟', '🎈', '🎁'];
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                emoji.style.position = 'fixed';
                emoji.style.fontSize = '24px';
                emoji.style.left = Math.random() * window.innerWidth + 'px';
                emoji.style.top = '-50px';
                emoji.style.zIndex = '3000';
                emoji.style.pointerEvents = 'none';
                emoji.style.animation = 'fall 3s linear forwards';
                
                document.body.appendChild(emoji);
                
                setTimeout(() => {
                    emoji.remove();
                }, 3000);
            }, i * 100);
        }
        
        // Add fall animation if not already present
        if (!document.querySelector('#fallAnimation')) {
            const style = document.createElement('style');
            style.id = 'fallAnimation';
            style.textContent = `
                @keyframes fall {
                    to {
                        transform: translateY(${window.innerHeight + 100}px) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NinjaPuzzleGame();
});

// Add some fun sound effects (optional)
function playSound(type) {
    // This would play different sounds for different actions
    // For now, we'll use a simple audio context beep
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(type) {
            case 'correct':
                oscillator.frequency.value = 523.25; // C5
                break;
            case 'complete':
                oscillator.frequency.value = 659.25; // E5
                break;
            default:
                oscillator.frequency.value = 440; // A4
        }
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}