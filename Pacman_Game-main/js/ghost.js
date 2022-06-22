'use strict';
const GHOST = 'g';
var gGhosts;
var gIntervalGhosts;
// 3 ghosts and an interval
function createGhosts(board) {
    gGhosts = [];
    createGhost(board);
    createGhost(board);
    createGhost(board);
    gIntervalGhosts = setInterval(moveGhosts, 200);
}

function createGhost(board) {
    var ghost = {
        location: {
            i: 5,
            j: 15
        },
        currCellContent: EMPTY,
        ghostColor: getRandomColor()
    };
    gGhosts.push(ghost);

    board[ghost.location.i][ghost.location.j] = GHOST;
}

// : loop through ghosts
function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        moveGhost(gGhosts[i], i);
    }
}
// : figure out moveDiff, nextLocation, nextCell
function moveGhost(ghost, ghostIdx) {
    // { i: 0, j: 1 }
    var moveDiff = getMoveDiff();
    var nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j,
    };
    if (nextLocation.i === -1 || nextLocation.i === gBoard.length ||
        nextLocation.j === -1 || nextLocation.j === gBoard[0].length) { moveUnderGround(nextLocation) };
    var nextCellContent = gBoard[nextLocation.i][nextLocation.j];

    // : return if cannot move
    if (nextCellContent === WALL) return;
    if (nextCellContent === WALLPRO) return;
    if (nextCellContent === GHOST) return;
    // : hitting a pacman?  call gameOver
    if (nextCellContent === PACMAN && gPacman.isSuper === false) {
        gameOver('looser <br>Game Over');
        return;
    }
    if (nextCellContent === PACMAN && gPacman.isSuper) {
        return ghostDeadByPac(nextLocation, ghostIdx, ghost);
    }
    // : update the model
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent;
    // : update the DOM
    renderCell(ghost.location, ghost.currCellContent);
    // : Move the ghost to new location
    ghost.currCellContent = nextCellContent
    ghost.location = nextLocation;
    // : update the model
    gBoard[nextLocation.i][nextLocation.j] = GHOST;
    // : update the DOM
    renderCell(nextLocation, GHOST, ghost.ghostColor);
}


function ghostDeadByPac(nextLocation, ghostIdx, ghost) {
    console.log('ghost');
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent;
    // : update the DOM
    renderCell(ghost.location, ghost.currCellContent);
    ghost.location = nextLocation;
    var deadGhost = gGhosts.splice(ghostIdx, 1)[0]; // [0] splice return an array ;
    var interval = setInterval(() => {
        if (!gPacman.isSuper) {
            gGhosts.push(deadGhost);
            clearInterval(interval);
        }
    }, 1);
}

function killGhost(nextLocation) {
    console.log('pacmen eat ghost');

    // : update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
    // : update the DOM
    renderCell(gPacman.location, EMPTY);
    var currGhost = null;
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === nextLocation.i && gGhosts[i].location.j === nextLocation.j) {
            currGhost = gGhosts.splice(i, 1)[0];
            if (currGhost.currCellContent === FOOD) eatFood();
            if (currGhost.currCellContent === CHERRY) updateScore(15);
            currGhost.currCellContent = EMPTY;
            gPacman.location = nextLocation;
            gBoard[nextLocation.i][nextLocation.j] = PACMAN;
            renderCell(nextLocation, PACMAN);
            break;
        }
    }
    if (currGhost !== [] || !currGhost) {
        var interval = setInterval(() => {
            if (!gPacman.isSuper) {
                gGhosts.push(currGhost);
                clearInterval(interval);
            }
        }, 1);
    }
}

function getMoveDiff() {
    var randNum = getRandomInt(1, 100);
    if (randNum <= 25) {
        return { i: 0, j: 1 };
    } else if (randNum <= 50) {
        return { i: -1, j: 0 };
    } else if (randNum <= 75) {
        return { i: 0, j: -1 };
    } else {
        return { i: 1, j: 0 };
    }
}

// function getGhostHTML(ghost) {
//     return `<span>${GHOST}</span>`;
// }