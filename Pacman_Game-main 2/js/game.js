'use strict';
const WALL = 'w';
const WALLPRO = 'p';
const FOOD = '&bull;';
const EMPTY = ' ';
const CHERRY = '🍒';
var gIntervalEmptyCell;
var gCherry = [];
var gPlayMusic;
var gPlayEatSound;
var gBoard;
var gTimerInterval;

var gTimer = {
    msec: 0,
    sec: 0,
    min: 0,
    hur: 0
};
var gGame = {
    score: 0,
    eatingCounter: 0,
    isOn: false
};
window.onload=init;
function init() {
    document.addEventListener('keydown', changeMoveImgPac);
    gBoard = buildBoard();
    createPacman(gBoard);
    createGhosts(gBoard);
    printMat(gBoard, '.board-container');
    gGame.isOn = true;
    cherryRandom();
    gGame.eatingCounter = 0;

}

function resetTimer() {
    clearInterval(gTimerInterval);
    gTimerInterval = null;
    gTimer.msec = 0;
    gTimer.sec = 0;
    gTimer.min = 0;
    gTimer.hur = 0;

}

function myTimer() {
    gTimer.msec = gTimer.msec + 1;
    if (gTimer.msec === 1000) {
        gTimer.msec = 0;
        gTimer.sec += 1;
    }
    if (gTimer.sec === 60) {
        gTimer.sec = 0;
        gTimer.min += 1;
    }
    if (gTimer.min === 60) {
        gTimer.min = 0;
        gTimer.hur += 1;
    }
    if (gTimer.hur === 24) {
        gTimer.hur = 0;
        clearInterval(gTimerInterval);
        liveTimer = null;
    }
    var theTime = gTimer.hur + ':' + gTimer.min + ':' + gTimer.sec + ':' + gTimer.msec;
    var getTimer = document.querySelector('.timer')
    getTimer.innerHTML = theTime;
}

function cherryRandom() {
    gIntervalEmptyCell = setInterval(() => {
        var emptyCells = findEmptyCell();
        if (emptyCells.length === 0) {
            return;
        }
        var randomIdx = getRandomInt(0, emptyCells.length - 1);
        var cell = emptyCells[randomIdx];
        gBoard[cell.i][cell.j] = CHERRY;
        renderCell(cell, CHERRY);
    }, 15000);
}

function findEmptyCell() {
    var emptyCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j] === EMPTY) {
                var emptyCell = { i: i, j: j };
                emptyCells.push(emptyCell);
            }
        }
    }
    return emptyCells;
}

function restart() {
    //score be 0.
    gGame.score = 0;
    var elScore = document.querySelector('h2 span');
    elScore.innerText = gGame.score;

    //display none to  game over + button.
    var elmodalNone = document.querySelector('.modal');
    elmodalNone.style.display = 'none';
    // reseat timer clock 
    var theTime = gTimer.hur + ':' + gTimer.min + ':' + gTimer.sec + ':' + gTimer.msec;
    var getTimer = document.querySelector('.timer')
    getTimer.innerHTML = theTime;
    //init -
    init();
}

function buildBoard() {
    var SIZE = 11;
    var SIZEJ = 32;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZEJ; j++) {
            board[i][j] = FOOD;
            if (i === 0 || i === SIZE - 1 ||
                j === 0 || j === SIZEJ - 1 ||
                (j === 12 && i > 2 && i < SIZE - 3) ||
                (j === 19 && i > 2 && i < SIZE - 3) ||
                (i === 7 && j > 12 && j < SIZEJ - 13) ||
                (i === 3 && j > 12 && j < SIZEJ - 13) ||
                (i === 2 && j > 2 && j < SIZEJ - 21) ||
                (i === 2 && j > 20 && j < SIZEJ - 3) ||
                (i === SIZE - 3 && j > 2 && j < SIZEJ - 21) ||
                (i === SIZE - 3 && j > 20 && j < SIZEJ - 3) ||
                (j === 2 && i > 3 && i < SIZE - 4) ||
                (j === SIZEJ - 3 && i > 3 && i < SIZE - 4)
            ) {
                board[i][j] = WALL;
            }
            if ((i > 3 && j > 3 && i < 7 && j < 11) ||
                (i > 3 && j > SIZEJ - 12 && i < 7 && j < SIZEJ - 4)
            ) {
                board[i][j] = WALLPRO;
            }
            if (
                (i > 3 && j > 12 && i < 7 && j < 19)
            ) {
                board[i][j] = EMPTY;
            }
        }
    }
    board[3][15] = board[3][16] = FOOD;
    board[0][15] = board[0][16] = FOOD;
    board[SIZE - 1][15] = board[SIZE - 1][16] = FOOD;
    board[2][0] = board[1][0] = FOOD;
    board[SIZE - 3][SIZEJ - 1] = board[SIZE - 2][SIZEJ - 1] = FOOD;

    board[1][SIZEJ - 2] = board[3][7] = POWER_FOOD;
    board[SIZE - 4][SIZEJ - 8] = board[9][1] = POWER_FOOD;

    return board;
}

function eatFood() {
    gPlayEatSound = new Audio('./audio/eatsound.mp3');
    gPlayEatSound.play();
    if (gGame.eatingCounter === 1) {
        gTimerInterval = setInterval(myTimer, 1);
        gPlayMusic = new Audio('./audio/pac.mp3');
        gPlayMusic.play();
    }

    updateScore(1);
    gGame.eatingCounter++;
    if (gGame.eatingCounter === 155) {
        gameOver('Game Over <br> You Win');
        console.log(gGame.eatingCounter);
        return;
    }
}
// update model and dom
function updateScore(diff) {
    console.log(diff);
    //model
    gGame.score += diff;
    //dom
    var elScore = document.querySelector('h2 span');
    elScore.innerText = gGame.score;
}

function moveUnderGround(nextLocation) {
    if (nextLocation.i === gBoard.length) {
        nextLocation.i = 0;
        return nextLocation;
    }
    if (nextLocation.i === -1) {
        nextLocation.i = gBoard.length - 1;
        return nextLocation;
    }
    if (nextLocation.j === gBoard[0].length) {
        nextLocation.j = 0;
        nextLocation.i = 1;
        return nextLocation;
    }
    if (nextLocation.j === -1) {
        nextLocation.j = gBoard[0].length - 1;
        nextLocation.i = gBoard.length - 2;
        return nextLocation;
    }
}

function gameOver(winLoos) {
    //display game over/win/looser and restart button.
    var elEndGame = document.querySelector('.modal h2');
    elEndGame.innerHTML = winLoos;
    var elmodal = document.querySelector('.modal');
    elmodal.style.display = 'inline-block';

    clearInterval(gIntervalEmptyCell);
    gIntervalEmptyCell = null;
    gGame.isOn = false;
    clearInterval(gIntervalGhosts);
    gIntervalGhosts = null;
    resetTimer();
    setTimeout(function() {
        gPlayMusic.pause()
    }, 1000)
}
