class NinjaPuzzleGame {
    constructor() {
        this.currentDifficulty = 'easy';
        this.gridSize = 3;
        this.puzzleData = [];
        this.startTime = null;
        this.timerInterval = null;
        this.gameCompleted = false;
        this.puzzleImage = null;
        this.imageLoaded = false;
        
        this.createDefaultImage();
    }
    
    createDefaultImage() {
        // Create a canvas with a default ninja coffee cup image
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        // Draw a colorful default image
        this.drawDefaultImage(ctx, canvas.width, canvas.height);
        
        // Convert canvas to image
        this.puzzleImage = new Image();
        this.puzzleImage.onload = () => {
            this.imageLoaded = true;
            this.initializeGame();
            this.setupEventListeners();
        };
        this.puzzleImage.src = canvas.toDataURL();
    }
    
    drawDefaultImage(ctx, width, height) {
        // Clear canvas
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, width, height);
        
        // Draw background gradient
        const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
        gradient.addColorStop(0, '#FFE4B5');
        gradient.addColorStop(1, '#DEB887');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Draw coffee cup body
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(width*0.3, height*0.4, width*0.4, height*0.45);
        
        // Draw coffee inside cup
        ctx.fillStyle = '#2F1B14';
        ctx.fillRect(width*0.32, height*0.42, width*0.36, height*0.35);
        
        // Draw coffee foam
        ctx.fillStyle = '#F5DEB3';
        ctx.beginPath();
        ctx.ellipse(width*0.5, height*0.45, width*0.16, height*0.08, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw cup handle
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(width*0.75, height*0.6, width*0.08, Math.PI * 0.3, Math.PI * 1.7, false);
        ctx.stroke();
        
        // Draw ninja mask
        ctx.fillStyle = '#2C3E50';
        ctx.beginPath();
        ctx.ellipse(width*0.5, height*0.25, width*0.25, height*0.12, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw ninja eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(width*0.42, height*0.25, width*0.04, height*0.06, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(width*0.58, height*0.25, width*0.04, height*0.06, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw ninja eye pupils
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(width*0.42, height*0.25, width*0.02, height*0.03, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(width*0.58, height*0.25, width*0.02, height*0.03, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw decorative stars
        this.drawStar(ctx, width*0.15, height*0.15, 5, width*0.03, width*0.015, '#FFD700');
        this.drawStar(ctx, width*0.85, height*0.2, 5, width*0.025, width*0.0125, '#FFD700');
        this.drawStar(ctx, width*0.2, height*0.8, 5, width*0.02, width*0.01, '#FFD700');
        this.drawStar(ctx, width*0.8, height*0.85, 5, width*0.025, width*0.0125, '#FFD700');
    }
    
    drawStar(ctx, x, y, spikes, outerRadius, innerRadius, color) {
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;
        
        ctx.beginPath();
        ctx.moveTo(x, y - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
            rot += step;
            ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
            rot += step;
        }
        
        ctx.lineTo(x, y - outerRadius);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }
    
    initializeGame() {
        if (!this.imageLoaded) return;
        
        this.generatePuzzleData();
        this.createPuzzleGrid();
        this.createPuzzlePieces();
        this.createReferenceImage();
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
                imageData: null
            });
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
            canvas.width = pieceWidth + 40; // Extra space for tabs
            canvas.height = pieceHeight + 40;
            const ctx = canvas.getContext('2d');
            
            // Create puzzle piece shape with tabs
            this.createPuzzlePieceShape(ctx, canvas.width, canvas.height, row, col);
            
            // Clip and draw the image
            ctx.clip();
            ctx.drawImage(
                this.puzzleImage,
                col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight,
                20, 20, pieceWidth, pieceHeight
            );
            
            this.puzzleData[i].imageData = canvas.toDataURL();
            this.puzzleData[i].clipPath = this.generateClipPath(row, col);
        }
    }
    
    createPuzzlePieceShape(ctx, width, height, row, col) {
        const centerX = width / 2;
        const centerY = height / 2;
        const tabSize = 15;
        const pieceWidth = width - 40;
        const pieceHeight = height - 40;
        
        ctx.beginPath();
        
        // Start from top-left
        ctx.moveTo(20, 20);
        
        // Top edge with potential tab
        if (row === 0) {
            // Top edge - no tab
            ctx.lineTo(width - 20, 20);
        } else {
            // Top edge with tab
            const hasTab = (row + col) % 2 === 0;
            ctx.lineTo(centerX - tabSize, 20);
            if (hasTab) {
                ctx.arc(centerX, 20, tabSize, Math.PI, 0, false);
            } else {
                ctx.arc(centerX, 20, tabSize, 0, Math.PI, false);
            }
            ctx.lineTo(width - 20, 20);
        }
        
        // Right edge with potential tab
        if (col === this.gridSize - 1) {
            // Right edge - no tab
            ctx.lineTo(width - 20, height - 20);
        } else {
            // Right edge with tab
            const hasTab = (row + col + 1) % 2 === 0;
            ctx.lineTo(width - 20, centerY - tabSize);
            if (hasTab) {
                ctx.arc(width - 20, centerY, tabSize, -Math.PI/2, Math.PI/2, false);
            } else {
                ctx.arc(width - 20, centerY, tabSize, Math.PI/2, -Math.PI/2, false);
            }
            ctx.lineTo(width - 20, height - 20);
        }
        
        // Bottom edge with potential tab
        if (row === this.gridSize - 1) {
            // Bottom edge - no tab
            ctx.lineTo(20, height - 20);
        } else {
            // Bottom edge with tab
            const hasTab = (row + col + 2) % 2 === 0;
            ctx.lineTo(centerX + tabSize, height - 20);
            if (hasTab) {
                ctx.arc(centerX, height - 20, tabSize, 0, Math.PI, false);
            } else {
                ctx.arc(centerX, height - 20, tabSize, Math.PI, 0, false);
            }
            ctx.lineTo(20, height - 20);
        }
        
        // Left edge with potential tab
        if (col === 0) {
            // Left edge - no tab
            ctx.lineTo(20, 20);
        } else {
            // Left edge with tab
            const hasTab = (row + col + 3) % 2 === 0;
            ctx.lineTo(20, centerY + tabSize);
            if (hasTab) {
                ctx.arc(20, centerY, tabSize, Math.PI/2, -Math.PI/2, false);
            } else {
                ctx.arc(20, centerY, tabSize, -Math.PI/2, Math.PI/2, false);
            }
            ctx.lineTo(20, 20);
        }
        
        ctx.closePath();
    }
    
    generateClipPath(row, col) {
        // Generate CSS clip-path for puzzle piece shape
        const centerX = 50;
        const centerY = 50;
        const tabSize = 7;
        
        let path = `polygon(`;
        let points = [];
        
        // Top edge
        if (row === 0) {
            points.push(`10% 10%`, `90% 10%`);
        } else {
            const hasTab = (row + col) % 2 === 0;
            points.push(`10% 10%`, `${centerX - tabSize}% 10%`);
            if (hasTab) {
                points.push(`${centerX - tabSize}% 5%`, `${centerX + tabSize}% 5%`);
            } else {
                points.push(`${centerX - tabSize}% 15%`, `${centerX + tabSize}% 15%`);
            }
            points.push(`${centerX + tabSize}% 10%`, `90% 10%`);
        }
        
        // Right edge
        if (col === this.gridSize - 1) {
            points.push(`90% 90%`);
        } else {
            const hasTab = (row + col + 1) % 2 === 0;
            points.push(`90% ${centerY - tabSize}%`);
            if (hasTab) {
                points.push(`95% ${centerY - tabSize}%`, `95% ${centerY + tabSize}%`);
            } else {
                points.push(`85% ${centerY - tabSize}%`, `85% ${centerY + tabSize}%`);
            }
            points.push(`90% ${centerY + tabSize}%`, `90% 90%`);
        }
        
        // Bottom edge
        if (row === this.gridSize - 1) {
            points.push(`10% 90%`);
        } else {
            const hasTab = (row + col + 2) % 2 === 0;
            points.push(`${centerX + tabSize}% 90%`);
            if (hasTab) {
                points.push(`${centerX + tabSize}% 95%`, `${centerX - tabSize}% 95%`);
            } else {
                points.push(`${centerX + tabSize}% 85%`, `${centerX - tabSize}% 85%`);
            }
            points.push(`${centerX - tabSize}% 90%`, `10% 90%`);
        }
        
        // Left edge
        if (col === 0) {
            points.push(`10% 10%`);
        } else {
            const hasTab = (row + col + 3) % 2 === 0;
            points.push(`10% ${centerY + tabSize}%`);
            if (hasTab) {
                points.push(`5% ${centerY + tabSize}%`, `5% ${centerY - tabSize}%`);
            } else {
                points.push(`15% ${centerY + tabSize}%`, `15% ${centerY - tabSize}%`);
            }
            points.push(`10% ${centerY - tabSize}%`, `10% 10%`);
        }
        
        return `polygon(${points.join(', ')})`;
    }
    
    createReferenceImage() {
        const referenceContainer = document.querySelector('.ninja-cup-reference');
        referenceContainer.innerHTML = '';
        referenceContainer.className = 'ninja-cup-reference';
        
        const img = document.createElement('img');
        img.src = this.puzzleImage.src;
        img.className = 'reference-image-display';
        img.style.width = '200px';
        img.style.height = '200px';
        img.style.objectFit = 'contain';
        img.style.border = '2px solid #333';
        img.style.borderRadius = '10px';
        
        referenceContainer.appendChild(img);
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
        
        // Shuffle pieces for initial placement
        const shuffledPieces = [...this.puzzleData].sort(() => Math.random() - 0.5);
        
        shuffledPieces.forEach(piece => {
            const pieceElement = document.createElement('div');
            pieceElement.className = 'puzzle-piece';
            pieceElement.draggable = true;
            pieceElement.dataset.pieceId = piece.id;
            
            // Create image element for the piece
            const img = document.createElement('img');
            img.src = piece.imageData;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.pointerEvents = 'none'; // Prevent image from interfering with drag
            
            // Apply puzzle piece shape
            pieceElement.style.clipPath = piece.clipPath || 'none';
            
            pieceElement.appendChild(img);
            piecesContainer.appendChild(pieceElement);
        });
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
                // Force visual update
                e.target.style.transform = '';
                e.target.style.opacity = '';
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
        let initialTouch = null;
        let dragPreview = null;
        
        document.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('puzzle-piece') || e.target.parentElement.classList.contains('puzzle-piece')) {
                const piece = e.target.classList.contains('puzzle-piece') ? e.target : e.target.parentElement;
                touchedPiece = piece;
                initialTouch = e.touches[0];
                
                piece.classList.add('dragging');
                
                // Create visual feedback for mobile
                this.createTouchFeedback(piece, initialTouch);
                
                if (!this.startTime && !this.gameCompleted) {
                    this.startTimer();
                }
                
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
            if (touchedPiece && initialTouch) {
                e.preventDefault();
                
                const touch = e.touches[0];
                
                // Update drag preview position
                if (dragPreview) {
                    dragPreview.style.left = (touch.clientX - 40) + 'px';
                    dragPreview.style.top = (touch.clientY - 40) + 'px';
                }
                
                // Highlight potential drop zones
                const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                this.updateDropZoneHighlight(elementBelow);
            }
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            if (touchedPiece) {
                const touch = e.changedTouches[0];
                const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                
                if (elementBelow && elementBelow.classList.contains('puzzle-slot')) {
                    this.handlePieceDrop(touchedPiece, elementBelow);
                }
                
                // Clean up
                touchedPiece.classList.remove('dragging');
                this.removeTouchFeedback();
                this.clearDropZoneHighlights();
                
                touchedPiece = null;
                initialTouch = null;
                dragPreview = null;
            }
        });
    }
    
    createTouchFeedback(piece, touch) {
        // Create a visual preview that follows the finger
        const preview = piece.cloneNode(true);
        preview.classList.add('touch-preview');
        preview.style.position = 'fixed';
        preview.style.left = (touch.clientX - 40) + 'px';
        preview.style.top = (touch.clientY - 40) + 'px';
        preview.style.width = '80px';
        preview.style.height = '80px';
        preview.style.zIndex = '2000';
        preview.style.opacity = '0.8';
        preview.style.pointerEvents = 'none';
        preview.style.transform = 'scale(1.1)';
        preview.style.borderRadius = '12px';
        preview.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
        
        document.body.appendChild(preview);
        dragPreview = preview;
    }
    
    removeTouchFeedback() {
        if (dragPreview) {
            dragPreview.remove();
            dragPreview = null;
        }
        
        // Remove any remaining dragging classes
        document.querySelectorAll('.puzzle-piece.dragging').forEach(piece => {
            piece.classList.remove('dragging');
        });
        
        // Force redraw to prevent visual artifacts
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
    }
    
    updateDropZoneHighlight(element) {
        // Clear previous highlights
        this.clearDropZoneHighlights();
        
        // Highlight current drop zone
        if (element && element.classList.contains('puzzle-slot')) {
            element.classList.add('touch-drop-zone');
        }
    }
    
    clearDropZoneHighlights() {
        document.querySelectorAll('.touch-drop-zone').forEach(slot => {
            slot.classList.remove('touch-drop-zone');
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