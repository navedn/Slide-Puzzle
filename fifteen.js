class Game {
  constructor() {
    this.cols = 4; // Number of columns
    this.rows = 4; // Number of rows
    this.count = this.cols * this.rows; // Total number, including empty spot (16)
    this.emptyBlockCoords = [3, 3]; // The coordinates of the empty spot, which is initially at the bottom right until shuffled.
    this.indexes = Array.from({ length: this.count }, (_, i) => i); // Keeps track of the positions of the blocks (initially in sequential order).
    this.init();
  }

  init() {
    const container = document.getElementById("puzzle_container");
    container.innerHTML = "";

    // backgroundPosition is modified using a formula that determines how to show off that specific part of the image. Found the formula online, should work for all tile types.
    for (let i = 0; i < this.count - 1; i++) {
      const block = document.createElement("div");
      block.className = "puzzle_block";
      block.textContent = i + 1;
      block.style.backgroundPosition = `-${(i % this.cols) * 100}px -${
        Math.floor(i / this.cols) * 100
      }px`;
      container.appendChild(block);
      this.indexes[i] = i;
    }

    this.indexes[this.count - 1] = this.count - 1;
    this.blocks = document.getElementsByClassName("puzzle_block");

    for (let i = 0; i < this.blocks.length; i++) {
      const x = i % this.cols;
      const y = Math.floor(i / this.cols);
      this.positionBlockAtCoord(i, x, y);
      this.blocks[i].addEventListener("click", () => this.onClickOnBlock(i));
      this.blocks[i].addEventListener("mouseover", () =>
        this.onMouseOverBlock(i)
      );
      this.blocks[i].addEventListener("mouseout", () =>
        this.onMouseOutBlock(i)
      );
    }

    document
      .getElementById("shuffle")
      .addEventListener("click", () => this.randomize(100));
  }

  randomize(iterationCount) {
    for (let i = 0; i < iterationCount; i++) {
      let neighbors = this.getMovableBlocks();
      let randomIdx = Math.floor(Math.random() * neighbors.length);
      this.moveBlock(neighbors[randomIdx]);
    }
  }

  getMovableBlocks() {
    const [ex, ey] = this.emptyBlockCoords;
    const neighbors = [];

    if (ex > 0) neighbors.push(ey * this.cols + (ex - 1));
    if (ex < this.cols - 1) neighbors.push(ey * this.cols + (ex + 1));
    if (ey > 0) neighbors.push((ey - 1) * this.cols + ex);
    if (ey < this.rows - 1) neighbors.push((ey + 1) * this.cols + ex);

    return neighbors;
  }

  moveBlock(blockIdx) {
    let block = this.blocks[blockIdx];
    let blockCoords = this.canMoveBlock(block);
    if (blockCoords != null) {
      this.positionBlockAtCoord(
        blockIdx,
        this.emptyBlockCoords[0],
        this.emptyBlockCoords[1]
      );
      this.indexes[
        this.emptyBlockCoords[0] + this.emptyBlockCoords[1] * this.cols
      ] = this.indexes[blockCoords[0] + blockCoords[1] * this.cols];
      this.emptyBlockCoords = blockCoords;
      return true;
    }
    return false;
  }

  canMoveBlock(block) {
    let blockPos = [parseInt(block.style.left), parseInt(block.style.top)];
    let blockWidth = block.clientWidth;
    let blockCoords = [blockPos[0] / blockWidth, blockPos[1] / blockWidth];
    let diff = [
      Math.abs(blockCoords[0] - this.emptyBlockCoords[0]),
      Math.abs(blockCoords[1] - this.emptyBlockCoords[1]),
    ];
    return (diff[0] === 1 && diff[1] === 0) || (diff[0] === 0 && diff[1] === 1)
      ? blockCoords
      : null;
  }

  positionBlockAtCoord(blockIdx, x, y) {
    let block = this.blocks[blockIdx];
    block.style.left = x * block.clientWidth + "px";
    block.style.top = y * block.clientWidth + "px";
  }

  onClickOnBlock(blockIdx) {
    if (this.moveBlock(blockIdx)) {
      if (this.checkPuzzleSolved()) {
        setTimeout(() => alert("Puzzle Solved!!"), 600);
      }
    }
  }

  onMouseOverBlock(blockIdx) {
    if (this.canMoveBlock(this.blocks[blockIdx])) {
      this.blocks[blockIdx].classList.add("movablepiece");
    }
  }

  onMouseOutBlock(blockIdx) {
    this.blocks[blockIdx].classList.remove("movablepiece");
  }

  checkPuzzleSolved() {
    for (let i = 0; i < this.indexes.length; i++) {
      if (i === this.emptyBlockCoords[0] + this.emptyBlockCoords[1] * this.cols)
        continue;
      if (this.indexes[i] !== i) return false;
    }
    return true;
  }
}

new Game();
