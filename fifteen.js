class Game {
  constructor() {
    this.cols = 4; // Number of columns
    this.rows = 4; // Number of rows
    this.count = this.cols * this.rows; // Total number, including empty spot (16)

    this.emptyBlockCoords = [3, 3]; // The coordinates of the empty tile, which is initially at the bottom right
    this.indexes = Array.from({ length: this.count }, (_, i) => i); // Keeps track of the positions of the tiles

    this.backgrounds = [
      "background1.jpg",
      "background2.jpg",
      "background3.jpg",
      "background4.jpg",
    ];
    this.currentBackground =
      this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)];

    this.init();
  }

  init() {
    this.render();
    this.addEventListeners();
    this.setBackground();
  }

  render() {
    const container = document.getElementById("puzzle_container");
    container.innerHTML = "";

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
    this.tiles = document.getElementsByClassName("puzzle_block");

    for (let i = 0; i < this.tiles.length; i++) {
      const x = i % this.cols;
      const y = Math.floor(i / this.cols);
      this.positionBlockAtCoord(i, x, y);
      this.tiles[i].addEventListener("click", () => this.onClickOnBlock(i));
      this.tiles[i].addEventListener("mouseover", () =>
        this.onMouseOverBlock(i)
      );
      this.tiles[i].addEventListener("mouseout", () => this.onMouseOutBlock(i));
    }
  }

  addEventListeners() {
    document
      .getElementById("shuffle")
      .addEventListener("click", () => this.randomize(5000));

    const selector = document.getElementById("background_selector");
    selector.addEventListener("change", (e) => {
      this.currentBackground = e.target.value;
      this.setBackground();
    });
  }

  setBackground() {
    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].style.backgroundImage = `url('${this.currentBackground}')`;
    }
  }

  randomize(moveCount) {
    for (let i = 0; i < moveCount; i++) {
      let neighbors = this.getMovableBlocks();

      if (neighbors.length > 0) {
        let randomIdx = Math.floor(Math.random() * neighbors.length);
        this.moveBlock(neighbors[randomIdx]);
      }
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
    let block = this.tiles[blockIdx];
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

  updateEmptyBlockCoords() {
    for (let i = 0; i < this.indexes.length; i++) {
      if (this.indexes[i] === this.count - 1) {
        this.emptyBlockCoords = [i % this.cols, Math.floor(i / this.cols)];
        break;
      }
    }
  }

  canMoveBlock(block) {
    let blockPos = [parseInt(block.style.left), parseInt(block.style.top)];
    let blockWidth = block.clientWidth + 4; // Include border in width
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
    let block = this.tiles[blockIdx];
    block.style.left = x * 100 + "px";
    block.style.top = y * 100 + "px";
  }

  onClickOnBlock(blockIdx) {
    if (this.moveBlock(blockIdx)) {
      if (this.checkPuzzleSolved()) {
        this.showWinNotification();
      }
    }
  }

  onMouseOverBlock(blockIdx) {
    if (this.canMoveBlock(this.tiles[blockIdx])) {
      this.tiles[blockIdx].classList.add("movablepiece");
    }
  }

  onMouseOutBlock(blockIdx) {
    this.tiles[blockIdx].classList.remove("movablepiece");
  }

  checkPuzzleSolved() {
    for (let i = 0; i < this.indexes.length; i++) {
      if (i === this.emptyBlockCoords[0] + this.emptyBlockCoords[1] * this.cols)
        continue;
      if (this.indexes[i] !== i) return false;
    }

    return true;
  }

  showWinNotification() {
    const notification = document.getElementById("win_notification");
    notification.style.display = "block";
    setTimeout(() => {
      notification.style.display = "none";
    }, 3000); // Hide after 3 seconds

    const description = document.getElementById("description");
    description.textContent = "Congratulations on solving the Fifteen Puzzle.";

    const container = document.getElementById("puzzle_container");
    container.innerHTML = ""; // Remove all tiles

    const fullImage = document.createElement("div");
    fullImage.style.backgroundImage = `url('${this.currentBackground}')`;
    fullImage.style.width = "400px";
    fullImage.style.height = "400px";
    fullImage.style.backgroundSize = "cover";

    container.appendChild(fullImage);
  }
}

new Game();
