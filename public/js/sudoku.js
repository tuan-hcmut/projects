/// INITIALIZE

var board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

let markRow = new Array(9);
let markCol = new Array(9);
let boardChild = new Array(3);

for (let i = 0; i < 9; i++) {
  markRow[i] = new Array(9);
  markCol[i] = new Array(9);
}

for (let i = 0; i < 3; i++) {
  boardChild[i] = new Array(3);
}
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) boardChild[i][j] = new Array(9);
}

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    markRow[i][j] = false;
    markCol[i][j] = false;
  }
}

for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    for (let z = 0; z < 9; z++) boardChild[i][j][z] = false;
  }
}

//// HANDLE

// solve(0, 0);

////

const numInContainers = function (val, j) {
  for (let i = 0; i < document.getElementById('board').children.length; i++) {
    document
      .getElementById('board')
      .children[i].addEventListener('click', (e) => {
        e.preventDefault();
        if (i < 9) {
          board[0][i] = Number(val);
        } else {
          board[Math.floor(i / 9)][i - Math.floor(i / 9) * 9] = Number(val);
        }
        document.getElementById('board').children[i].textContent = String(val);
        document
          .getElementById('number-container')
          .children[j].classList.remove('selected');
      });
  }
};

export const check = () => {
  for (
    let i = 0;
    i < document.getElementById('number-container').children.length;
    i++
  ) {
    document
      .getElementById('number-container')
      .children[i].addEventListener('click', (e) => {
        e.preventDefault();
        document
          .getElementById('number-container')
          .children[i].classList.add('selected');
        window.setTimeout(() => {}, 1000);
        numInContainers(
          document.getElementById('number-container').children[i].textContent,
          i
        );
      });
  }
};
// board = [
//   [2, 0, 0, 0, 4, 9, 0, 8, 3],
//   [0, 1, 0, 5, 0, 0, 0, 0, 0],
//   [0, 0, 8, 0, 0, 0, 9, 0, 5],
//   [8, 0, 2, 4, 6, 1, 7, 0, 9],
//   [5, 0, 6, 8, 9, 0, 3, 2, 1],
//   [7, 0, 1, 0, 0, 0, 0, 4, 0],
//   [0, 2, 4, 9, 7, 0, 0, 0, 0],
//   [0, 8, 0, 0, 1, 5, 2, 0, 0],
//   [0, 0, 9, 0, 0, 0, 0, 3, 0],
// ];

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    if (board[i][j] !== 0) {
      const num = board[i][j];
      markRow[i][num - 1] = true;
      markCol[j][num - 1] = true;
      boardChild[Math.floor(i / 3)][Math.floor(j / 3)][num - 1] = true;
    }
  }
}

const solve = function (i, j, board) {
  if (i < 9 && j < 9) {
    if (board[i][j] === 0) {
      for (let z = 1; z <= 9; z++) {
        if (
          !markCol[j][z - 1] &&
          !markRow[i][z - 1] &&
          !boardChild[Math.floor(i / 3)][Math.floor(j / 3)][z - 1]
        ) {
          markRow[i][z - 1] = true;
          markCol[j][z - 1] = true;
          boardChild[Math.floor(i / 3)][Math.floor(j / 3)][z - 1] = true;
          board[i][j] = z;
          //   console.log(board[i][j]);
          solve(i, j + 1, board);
          markRow[i][z - 1] = false;
          markCol[j][z - 1] = false;
          boardChild[Math.floor(i / 3)][Math.floor(j / 3)][z - 1] = false;
          board[i][j] = 0;
        }
      }
    } else {
      solve(i, j + 1, board);
    }
  } else if (i < 9 && j >= 9) {
    solve(i + 1, 0, board);
  } else {
    for (let i = 0; i < document.getElementById('board').children.length; i++) {
      if (i < 9) {
        document.getElementById('board').children[i].textContent = board[0][i];
      } else {
        document.getElementById('board').children[i].textContent =
          board[Math.floor(i / 9)][i - Math.floor(i / 9) * 9];
      }
    }
  }
};
const solveBtn = document.querySelector('.solve-btn');
if (solveBtn) {
  solveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== 0) {
          const num = board[i][j];
          markRow[i][num - 1] = true;
          markCol[j][num - 1] = true;
          boardChild[Math.floor(i / 3)][Math.floor(j / 3)][num - 1] = true;
        }
      }
    }
    solve(0, 0, board);
  });
}
