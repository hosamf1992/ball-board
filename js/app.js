var WALL = 'WALL';
var PASSAGE = 'PASSAGE';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = '☘';
var collectedBalls = 0;
var counterBalls = 0;
var intBallsIndex = 0;
var intGlueIndex = 0;
var gEmptyCells = [];
var gBoard;
var gluePos = { i: 0, j: 0 };

// var emptyCells = [];

var GAMER_IMG = '<img src="img/gamer.png">';
var BALL_IMG = '<img src="img/ball.png">';
var GLUE_IMG = '☘';




var gGamerPos = { i: 2, j: 9 };

init();
function init() {
	gBoard = buildBoard();
	renderBoard(gBoard);
	randomBalls(BALL);
	randomGlue();

}







function buildBoard() {
	// Create the Matrix 10 * 12 
	var board = new Array(10);
	for (var i = 0; i < board.length; i++) {
		board[i] = new Array(12);
	}
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR everywhere and WALL at edges
			board[i][j] = { type: 'FLOOR', gameElement: null }
			if (i === 0 || j === 0 ||
				i === board.length - 1 || j === board[0].length - 1) {
				board[i][j].type = WALL;

			}


		}
	}
	// Place the gamer
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
	board[5][0].type = PASSAGE;
	board[5][11].type = PASSAGE;
	board[0][5].type = PASSAGE;
	board[9][5].type = PASSAGE;





	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j }) // e.g. - cell-3-8

			if (currCell.type === FLOOR) cellClass += ' floor';
			if (currCell.type === PASSAGE) cellClass += ' passage';

			else if (currCell.type === WALL) cellClass += ' wall';

			strHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}
			else if (currCell.gameElement === GLUE) {
				strHTML += GLUE_IMG;

			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	// console.log('strHTML is:');
	// console.log(strHTML);
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;

	var elCounter = document.querySelector('.balls-counter');
	elCounter.innerText = collectedBalls;
}

// Move the player to a specific location
function moveTo(i, j) {

	var targetCell = gBoard[i][j];
	// debugger;
	console.log(targetCell);


	if (targetCell.type === WALL) return;

	// Calculate distance to ake sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	// if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {
	if (iAbsDiff + jAbsDiff === 1) {
		// console.log('Moving to: ', i, j);

		if (targetCell.type === PASSAGE) {
			console.log('i:', i);
			console.log('j:', j);

			if (i == 5) {
				j = 12 - 1 - j;
			}
			if (j === 5) {
				i = 10 - 1 - i;
			}


		}

		if (targetCell.gameElement === BALL) {
			playSound();
			console.log('Collecting!');
			collectedBalls++;
			ifWin();
			renderBoard(gBoard)
		}

		if (targetCell.gameElement === GLUE) {
			delayUser(3000);
			//console.log('glue');
		}


		// Move the gamer

		// Update the MODEL and DOM
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		renderCell(gGamerPos, '');

		gGamerPos.i = i;
		gGamerPos.j = j;

		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		renderCell(gGamerPos, GAMER_IMG);


	} else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

function playSound() {
	var audio = new Audio('sound/pop.mp3');

	return audio.play();
}

function rndNum(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function ifWin() {
	var elBtn = document.querySelector('button');
	var i = gGamerPos.i;
	var j = gGamerPos.j;
	if (counterBalls === collectedBalls) {

		elBtn.classList.remove('hide');
		clearInterval(intBallsIndex);
		clearInterval(intGlueIndex);
		// clearInterval(intGlueIndex);



	}
}

function resetGame() {

	collectedBalls = 0;
	counterBalls = 0;
	intBallsIndex = 0;
	intGlueIndex = 0;



	var elBtn = document.querySelector('button');
	elBtn.classList.add('hide');
	init();
}

function delayUser(delay) {
	var start = new Date().getTime();
	while (new Date().getTime() < start + delay);
}



function randomBalls() {
	var timer = setInterval(function () {
		addElements(BALL);

	}, 6000);

	intBallsIndex = timer;
	return timer;
}

function randomGlue() {
	var timer = setInterval(function () {
		addGlue();
		setTimeout(function () { clearGlue(); }, 2000);

	}, 5000);
	intGlueIndex = timer;



}



function clearGlue() {

	gBoard[gluePos.i][gluePos.j].gameElement = null;


	return renderBoard(gBoard);
}
function addGlue() {
	addElements(GLUE);
}

function checkEmpty() {

	var res = [];
	for (var i = 1; i <= 8; i++) {
		var pos = { i: 0, j: 0 };

		for (var j = 1; j <= 10; j++) {

			if (gBoard[i][j].type !== WALL && gBoard[i][j].gameElement === null) {

				pos = { i: i, j: j };
				res.push(pos);
			}
		}

	}
	return res;

}

function addElements(element) {

	gEmptyCells = checkEmpty();
	var rndIndex = rndNum(0, gEmptyCells.length - 1);
	var iIndex = null;
	var jIndex = null;

	iIndex = gEmptyCells[rndIndex].i;
	jIndex = gEmptyCells[rndIndex].j;

	if (element === BALL) {
		element = BALL;
		counterBalls++;
	}
	if (element === GLUE) {
		element = GLUE;
		gluePos = { i: iIndex, j: jIndex };
	}

	gBoard[iIndex][jIndex].gameElement = element;

	renderBoard(gBoard);
}

