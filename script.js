// Constants for the game
const DIFFICULTIES = {
    easy: { gridSize: 3, name: 'かんたん' },
    medium: { gridSize: 4, name: 'ふつう' },
    hard: { gridSize: 5, name: 'むずかしい' },
};

const IMAGE_SIZE = 300; // The size of the puzzle image

// --- SoundManager Class ---
// A robust and simple way to handle audio playback using <audio> elements.
class SoundManager {
    constructor() {
        this.sounds = {};
        this.isUnlocked = false;

        // Base64 encoded audio data to avoid external file dependencies.
        const audioData = {
            correct: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
            complete: 'data:audio/wav;base64,UklGRlIAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhWAAAAAEACgAIAAYABAAKAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAgABgAEAAoACAAEAAg-…'
        };

        for (const key in audioData) {
            const audio = new Audio();
            audio.src = audioData[key];
            this.sounds[key] = audio;
        }

        // Unlock audio on the first user interaction
        this.unlockAudio = () => {
            if (!this.isUnlocked) {
                for (const key in this.sounds) {
                    this.sounds[key].play().catch(() => {});
                    this.sounds[key].pause();
                    this.sounds[key].currentTime = 0;
                }
                this.isUnlocked = true;
            }
            // Remove the event listener after it has run once.
            document.removeEventListener('touchstart', this.unlockAudio);
            document.removeEventListener('mousedown', this.unlockAudio);
        };

        document.addEventListener('touchstart', this.unlockAudio, { once: true });
        document.addEventListener('mousedown', this.unlockAudio, { once: true });
    }

    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(error => {
                console.error(`Error playing sound: ${soundName}`, error);
            });
        }
    }
}


class PuzzleUI {
    constructor() {
        this.elements = {
            puzzleGrid: document.getElementById('puzzleGrid'),
            piecesContainer: document.getElementById('puzzlePieces'),
            referenceImageContainer: document.querySelector('.reference-image'),
        };
        this.dragPreview = null;
    }

    createReferenceImage(imageSrc) {
        if (!this.elements.referenceImageContainer) return;
        this.elements.referenceImageContainer.innerHTML = '';
        const img = document.createElement('img');
        img.src = imageSrc;
        img.className = 'reference-image-display';
        this.elements.referenceImageContainer.appendChild(img);
    }

    createPuzzleGrid(gridSize) {
        const grid = this.elements.puzzleGrid;
        
        const slots = grid.querySelectorAll('.puzzle-slot');
        slots.forEach(slot => slot.remove());

        grid.className = `puzzle-grid size-${gridSize}`;
        
        for (let i = 0; i < gridSize * gridSize; i++) {
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot';
            slot.dataset.position = i;
            grid.appendChild(slot);
        }
    }

    createPuzzlePieces(puzzleData) {
        this.elements.piecesContainer.innerHTML = '';
        const shuffledPieces = [...puzzleData].sort(() => Math.random() - 0.5);
        shuffledPieces.forEach(piece => {
            const pieceElement = document.createElement('div');
            pieceElement.className = 'puzzle-piece';
            pieceElement.draggable = true;
            pieceElement.dataset.pieceId = piece.id;
            const img = document.createElement('img');
            img.src = piece.imageData;
            Object.assign(img.style, {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
            });
            pieceElement.appendChild(img);
            this.elements.piecesContainer.appendChild(pieceElement);
        });
    }

    showInGameMessage(message) {
        const puzzleContainer = document.querySelector('.puzzle-container');
        if (!puzzleContainer) return;

        const messageEl = document.createElement('div');
        messageEl.className = 'in-game-message';
        messageEl.textContent = message;
        
        puzzleContainer.appendChild(messageEl);
        setTimeout(() => messageEl.remove(), 3100);
    }

    highlightNextActions() {
        document.getElementById('shuffleBtn').classList.add('highlight-action');
        document.getElementById('difficulty').classList.add('highlight-action');
    }

    removeNextActionsHighlight() {
        document.getElementById('shuffleBtn').classList.remove('highlight-action');
        document.getElementById('difficulty').classList.remove('highlight-action');
    }

    createCelebrationEffects() {
        const emojis = ['🎉', '🎊', '✨', '🌟', '🎈', '🎁'];
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                Object.assign(emoji.style, {
                    position: 'fixed',
                    fontSize: '24px',
                    left: `${Math.random() * window.innerWidth}px`,
                    top: '-50px',
                    zIndex: '3000',
                    pointerEvents: 'none',
                    animation: 'fall 3s linear forwards',
                });
                document.body.appendChild(emoji);
                setTimeout(() => emoji.remove(), 3000);
            }, i * 100);
        }
        if (!document.querySelector('#fallAnimation')) {
            const style = document.createElement('style');
            style.id = 'fallAnimation';
            style.textContent = `
                @keyframes fall {
                    to {
                        transform: translateY(${window.innerHeight + 100}px) rotate(360deg);
                        opacity: 0;
                    }
                }`;
            document.head.appendChild(style);
        }
    }
    
    resetPieceStyles(piece) {
        piece.classList.remove('dragging');
        Object.assign(piece.style, {
            transform: '',
            opacity: '',
            zIndex: '',
            position: '',
            pointerEvents: '',
        });
    }

    createTouchFeedback(piece, touch) {
        const preview = piece.cloneNode(true);
        preview.classList.add('touch-preview');
        Object.assign(preview.style, {
            position: 'fixed',
            left: `${touch.clientX - 40}px`,
            top: `${touch.clientY - 40}px`,
            width: '80px',
            height: '80px',
            zIndex: '2000',
            opacity: '0.8',
            pointerEvents: 'none',
            transform: 'scale(1.1)',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        });
        document.body.appendChild(preview);
        this.dragPreview = preview;
    }

    removeTouchFeedback() {
        if (this.dragPreview) {
            this.dragPreview.remove();
            this.dragPreview = null;
        }
        document.querySelectorAll('.puzzle-piece.dragging').forEach(p => p.classList.remove('dragging'));
    }

    updateDropZoneHighlight(element) {
        this.clearDropZoneHighlights();
        if (element && element.classList.contains('puzzle-slot')) {
            element.classList.add('touch-drop-zone');
        }
    }

    clearDropZoneHighlights() {
        document.querySelectorAll('.touch-drop-zone').forEach(slot => slot.classList.remove('touch-drop-zone'));
    }

    updatePiecesContainerVisibility() {
        const container = this.elements.piecesContainer;
        const piecesDiv = container.querySelector('#puzzlePieces');
        if (piecesDiv && piecesDiv.childElementCount === 0) {
            container.classList.add('hidden');
        } else {
            container.classList.remove('hidden');
        }
    }
}

class NinjaPuzzleGame {
    constructor() {
        this.ui = new PuzzleUI();
        this.soundManager = new SoundManager();
        this.currentDifficulty = 'easy';
        this.gridSize = DIFFICULTIES[this.currentDifficulty].gridSize;
        this.puzzleData = [];
        this.gameCompleted = false;
        this.puzzleImage = null;
        this.imageLoaded = false;
        
        this.createDefaultImage();
    }
    
    createDefaultImage() {
        this.puzzleImage = new Image();
        this.puzzleImage.onload = () => {
            this.imageLoaded = true;
            this.initializeGame();
            this.setupEventListeners();
        };
        this.puzzleImage.onerror = () => {
            alert('デフォルトの画像が見つかりませんでした。images/default.png を確認してください。');
        };
        this.puzzleImage.src = 'images/default.png';
    }
    
    initializeGame() {
        if (!this.imageLoaded) return;
        this.generatePuzzleData();
        this.ui.createPuzzleGrid(this.gridSize);
        this.ui.createPuzzlePieces(this.puzzleData);
        this.ui.createReferenceImage(this.puzzleImage.src);
        this.ui.updatePiecesContainerVisibility();
    }
    
    setupEventListeners() {
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.currentDifficulty = e.target.value;
            this.setGridSize();
            this.resetGame();
        });
        document.getElementById('shuffleBtn').addEventListener('click', () => this.shufflePieces());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        
        document.getElementById('uploadInput').addEventListener('change', (e) => this.loadUserImage(e));

        this.setupDragAndDrop();
    }
    
    async cropImageToSquare(imageSrc) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const size = Math.min(img.width, img.height);
                canvas.width = size;
                canvas.height = size;
                const sx = (img.width - size) / 2;
                const sy = (img.height - size) / 2;
                ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
                resolve(canvas.toDataURL());
            };
            img.onerror = reject;
            img.src = imageSrc;
        });
    }

    async loadUserImage(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            try {
                const reader = new FileReader();
                reader.onload = async (event) => {
                    try {
                        const originalImageSrc = event.target.result;
                        const squaredImageSrc = await this.cropImageToSquare(originalImageSrc);
                        
                        this.puzzleImage.onload = () => {
                            this.imageLoaded = true;
                            this.resetGame();
                        };
                        this.puzzleImage.src = squaredImageSrc;
                    } catch (error) {
                        console.error('Error processing image:', error);
                        alert('画像の処理中にエラーが発生しました。');
                    }
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Error reading file:', error);
                alert('ファイルの読み込み中にエラーが発生しました。');
            }
        } else {
            alert('画像ファイルを選択してください。');
        }
    }
    
    setGridSize() {
        this.gridSize = DIFFICULTIES[this.currentDifficulty].gridSize;
    }
    
    generatePuzzleData() {
        this.puzzleData = [];
        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            this.puzzleData.push({ id: i, correctPosition: i, currentPosition: null, isPlaced: false, imageData: null });
        }
        this.generatePieceImages();
    }
    
    generatePieceImages() {
        if (!this.puzzleImage) return;
        const pieceWidth = this.puzzleImage.width / this.gridSize;
        const pieceHeight = this.puzzleImage.height / this.gridSize;
        for (let i = 0; i < this.puzzleData.length; i++) {
            const row = Math.floor(i / this.gridSize);
            const col = i % this.gridSize;
            const canvas = document.createElement('canvas');
            canvas.width = pieceWidth;
            canvas.height = pieceHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(this.puzzleImage, col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
            this.puzzleData[i].imageData = canvas.toDataURL();
        }
    }
    
    setupDragAndDrop() {
        let draggedElement = null;
        let lastHoveredSlot = null;
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('puzzle-piece')) {
                draggedElement = e.target;
                setTimeout(() => e.target.classList.add('dragging'), 0);
            }
        });
        document.addEventListener('dragend', (e) => {
            if (draggedElement) {
                e.target.classList.remove('dragging');
                this.ui.resetPieceStyles(e.target);
                draggedElement = null;
            }
            if (lastHoveredSlot) {
                lastHoveredSlot.classList.remove('drop-zone');
                lastHoveredSlot = null;
            }
        });
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            const currentSlot = e.target.closest('.puzzle-slot');
            if (currentSlot !== lastHoveredSlot) {
                if (lastHoveredSlot) lastHoveredSlot.classList.remove('drop-zone');
                if (currentSlot) currentSlot.classList.add('drop-zone');
                lastHoveredSlot = currentSlot;
            }
        });
        document.addEventListener('drop', (e) => {
            e.preventDefault();
            const dropTarget = e.target.closest('.puzzle-slot');
            if (dropTarget && draggedElement) {
                this.handlePieceDrop(draggedElement, dropTarget);
            }
            if (lastHoveredSlot) {
                lastHoveredSlot.classList.remove('drop-zone');
                lastHoveredSlot = null;
            }
        });
        this.setupTouchEvents();
    }
    
    setupTouchEvents() {
        let touchedPiece = null;
        let initialTouch = null;
        document.addEventListener('touchstart', (e) => {
            const piece = e.target.closest('.puzzle-piece');
            if (piece) {
                console.log('Puzzle piece touched! The connection is working.'); // Add this line for debugging
                touchedPiece = piece;
                initialTouch = e.touches[0];
                piece.classList.add('dragging');
                this.ui.createTouchFeedback(piece, initialTouch);
            }
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (touchedPiece && initialTouch) {
                e.preventDefault();
                
                const touch = e.touches[0];
                if (this.ui.dragPreview) {
                    this.ui.dragPreview.style.left = `${touch.clientX - 40}px`;
                    this.ui.dragPreview.style.top = `${touch.clientY - 40}px`;
                }
                const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                this.ui.updateDropZoneHighlight(elementBelow);
            }
        }, { passive: false });

        document.addEventListener('touchend', (e) => {
            if (touchedPiece) {
                const touch = e.changedTouches[0];
                const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                const slotBelow = elementBelow ? elementBelow.closest('.puzzle-slot') : null;

                if (slotBelow) {
                    this.handlePieceDrop(touchedPiece, slotBelow);
                }
                
                this.ui.resetPieceStyles(touchedPiece);
                this.ui.removeTouchFeedback();
                this.ui.clearDropZoneHighlights();
                
                touchedPiece = null;
                initialTouch = null;
            }
        });
    }
    
    handlePieceDrop(draggedElement, targetSlotElement) {
        const draggedPieceId = parseInt(draggedElement.dataset.pieceId);
        const draggedPieceData = this.puzzleData[draggedPieceId];
        const sourceElement = draggedElement.parentElement;
        const sourceIsSlot = sourceElement.classList.contains('puzzle-slot');

        const existingPieceElement = targetSlotElement.querySelector('.puzzle-piece');
        if (existingPieceElement) {
            const existingPieceId = parseInt(existingPieceElement.dataset.pieceId);
            const existingPieceData = this.puzzleData[existingPieceId];
            
            this.ui.elements.piecesContainer.appendChild(existingPieceElement);
            existingPieceData.currentPosition = null;
            existingPieceData.isPlaced = false;
        }

        if (sourceIsSlot) {
            sourceElement.classList.remove('occupied');
        }

        targetSlotElement.appendChild(draggedElement);
        targetSlotElement.classList.add('occupied');
        draggedPieceData.currentPosition = parseInt(targetSlotElement.dataset.position);
        draggedPieceData.isPlaced = true;

        this.ui.updatePiecesContainerVisibility();
        if (this.checkWinCondition()) {
            this.gameCompleted = true;
            this.playSound('complete');
            this.ui.createCelebrationEffects();
            this.ui.showInGameMessage('🎉 おめでとう！ 🎉');
            setTimeout(() => {
                this.ui.highlightNextActions();
            }, 3000);
        } else if (draggedPieceData.currentPosition === draggedPieceData.correctPosition) {
            this.playSound('correct');
        }
    }
    
    checkWinCondition() {
        return this.puzzleData.every(p => p.isPlaced && p.currentPosition === p.correctPosition);
    }
    
    shufflePieces() {
        this.ui.removeNextActionsHighlight();
        document.querySelectorAll('.puzzle-slot').forEach(slot => {
            const piece = slot.querySelector('.puzzle-piece');
            if (piece) {
                this.ui.elements.piecesContainer.appendChild(piece);
                const pieceId = parseInt(piece.dataset.pieceId);
                this.puzzleData[pieceId].currentPosition = null;
                this.puzzleData[pieceId].isPlaced = false;
            }
            slot.classList.remove('occupied');
            slot.innerHTML = '';
        });
        const shuffled = Array.from(this.ui.elements.piecesContainer.children).sort(() => Math.random() - 0.5);
        shuffled.forEach(piece => this.ui.elements.piecesContainer.appendChild(piece));
        this.ui.updatePiecesContainerVisibility();
    }
    
    resetGame() {
        this.ui.removeNextActionsHighlight();
        this.gameCompleted = false;
        this.setGridSize();
        this.initializeGame();
    }

    playSound(type) {
        this.soundManager.play(type);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NinjaPuzzleGame();
});