const ROWS = 3;
const COLS = 3;
const IMAGE_SRC = 'ninja_cup.png';

const puzzleContainer = document.getElementById('puzzle-container');
const messageDiv = document.getElementById('message');

let pieces = [];
let emptyIndex = null;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createPieces() {
  pieces = [];
  for (let i = 0; i < ROWS * COLS; i++) {
    pieces.push(i);
  }
  do {
    shuffle(pieces);
  } while (!isSolvable(pieces) || isCompleted());
}

function isSolvable(arr) {
  // 3x3パズルの可解判定
  let inv = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) inv++;
    }
  }
  return inv % 2 === 0;
}

function isCompleted() {
  for (let i = 0; i < pieces.length; i++) {
    if (pieces[i] !== i) return false;
  }
  return true;
}

function renderPuzzle() {
  puzzleContainer.innerHTML = '';
  for (let i = 0; i < pieces.length; i++) {
    const piece = document.createElement('canvas');
    piece.width = 100;
    piece.height = 100;
    piece.className = 'puzzle-piece';
    piece.draggable = true;
    piece.dataset.index = i;
    drawPiece(piece, pieces[i]);
    piece.addEventListener('dragstart', handleDragStart);
    piece.addEventListener('dragover', handleDragOver);
    piece.addEventListener('drop', handleDrop);
    piece.addEventListener('dragend', handleDragEnd);
    puzzleContainer.appendChild(piece);
  }
}

function drawPiece(canvas, n) {
  const img = new Image();
  img.src = IMAGE_SRC;
  img.onload = () => {
    const ctx = canvas.getContext('2d');
    const sx = (n % COLS) * (img.width / COLS);
    const sy = Math.floor(n / COLS) * (img.height / ROWS);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      sx, sy, img.width / COLS, img.height / ROWS,
      0, 0, canvas.width, canvas.height
    );
  };
}

let dragSrcIndex = null;

function handleDragStart(e) {
  dragSrcIndex = Number(this.dataset.index);
  this.classList.add('dragging');
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  const targetIndex = Number(this.dataset.index);
  if (dragSrcIndex !== null && dragSrcIndex !== targetIndex) {
    [pieces[dragSrcIndex], pieces[targetIndex]] = [pieces[targetIndex], pieces[dragSrcIndex]];
    renderPuzzle();
    if (isCompleted()) {
      messageDiv.textContent = '完成！おめでとう！';
    } else {
      messageDiv.textContent = '';
    }
  }
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
  dragSrcIndex = null;
}

function startGame() {
  messageDiv.textContent = '';
  createPieces();
  renderPuzzle();
}

startGame();