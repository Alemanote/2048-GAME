function Game2048 () {
  this.board = [
    [null,null,null,null],
    [null,null,null,null],
    [null,null,null,null],
    [null,null,null,null]
  ];
	
  this.score = 0;
  this.won   = false;
  this.lost  = false;
//   Esta funcion es privada porque no le dices al juego como jugar, es el juego en si (marca la logica del juego).
  this._generateTile();
};

//Aqui se genera la primera ficha del juego, 2 o 4

Game2048.prototype._generateTile = function () {
  var initialValue = (Math.random() < 0.8) ? 2 : 4;
  var emptyTile = this._getAvailablePosition();

  if (emptyTile) {
    this.board[emptyTile.x][emptyTile.y] = initialValue;
  }
};

//Aqui se averigua la posiciones libres del tablero 

Game2048.prototype._getAvailablePosition = function () {
  var emptyTiles = [];

  this.board.forEach(function(row, rowIndex){
    row.forEach(function(elem, colIndex){
      if (!elem) emptyTiles.push({ x: rowIndex, y: colIndex });
    });
  });

  //Esta parte te saca de la funcion una vez el matrix esta lleno!!
  if (emptyTiles.length === 0)
    return false;

  var randomPosition = Math.floor(Math.random() * emptyTiles.length);
  return emptyTiles[randomPosition];
};

//Genera la tabla para jugar

Game2048.prototype._renderBoard = function () {
  this.board.forEach(function(row){ console.log(row); });
};

var game = new Game2048();
game._renderBoard();


// Esta funcion describe el movimiento a la izquierda:

Game2048.prototype.moveLeft = function () {
  var newBoard = [];
  var that = this;
  var boardChanged = false;

  this.board.forEach (function (row) {
    var newRow = row.filter(function (i) {
      return i !== null;
    });

    for(i = 0; i < newRow.length - 1; i++) {
      if (newRow[i+1] === newRow[i]) {
        newRow[i]   = newRow[i] * 2;
        newRow[i+1] = null;
      }
    }

    var merged = newRow.filter(function (i) {
      return i !== null;
    });
		
    while(merged.length < 4) {
      merged.push(null);
    }
    
    if (newRow.length !== row.length)
      boardChanged = true;

    newBoard.push(merged);
  });

  this.board = newBoard;
  return boardChanged;
};

// Mover a la derecha:

for (i=newRow.length - 1; i>0; i--) {
  if (newRow[i-1] === newRow[i]) {
    newRow[i]   = newRow[i] * 2;
    newRow[i-1] = null;
    that._updateScore(newRow[i]);
  }
      
  if (newRow.length !== row.length) boardChanged = true;
}

var merged = newRow.filter(function (i) {
  return i !== null;
});

while(merged.length < 4) {
  merged.unshift(null);
}

newBoard.push(merged);

// Mover hacia arriba

Game2048.prototype._transposeMatrix = function () {
  for (var row = 0; row < this.board.length; row++) {
    for (var column = row+1; column < this.board.length; column++) {
      var temp = this.board[row][column];
      this.board[row][column] = this.board[column][row];
      this.board[column][row] = temp;
    }
  }
};

Game2048.prototype.moveUp = function () {
  this._transposeMatrix();
  var boardChanged = this._moveLeft();
  this._transposeMatrix();
  return boardChanged;
};

// Mover hacia abajo

Game2048.prototype.moveDown = function () {
  this._transposeMatrix();
  var boardChanged = this._moveRight();
  this._transposeMatrix();
  return boardChanged;
};

// Moverse, utiliza las funciones de arriba!!!

Game2048.prototype.move = function (direction) {
  if (!this._gameFinished()) {
    switch (direction) {
      case "up":    boardChanged = this._moveUp();    break;
      case "down":  boardChanged = this._moveDown();  break;
      case "left":  boardChanged = this._moveLeft();  break;
      case "right": boardChanged = this._moveRight(); break;
    }

    if (boardChanged) {
      this._generateTile();
    }
  }
};

// Score

Game2048.prototype._updateScore = function (value) {
  this.score += value;
};

