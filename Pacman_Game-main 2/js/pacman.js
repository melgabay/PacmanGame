'use strict';
const PACMAN = '<img class="miniPac" src="./img/pac.png">';
const POWER_FOOD = '<img class="buttonpower" src="./img/power.svg">';
var gPacman;

function createPacman(board) {
    gPacman = {
        location: {
            i: 8,
            j: 17
        },
        isSuper: false
    };
    board[gPacman.location.i][gPacman.location.j] = PACMAN;
}

function powerFood() {
    gPacman.isSuper = true;
    console.log('power food');
    // console.log(elButtonPower);
    setTimeout(function() {
        gPacman.isSuper = false;
    }, 5000);
}


function movePacman(ev) {
    if (!gGame.isOn) return;
    // : use getNextLocation(), nextCell
    var nextLocation = getNextLocation(ev);
    if (nextLocation.i === -1 || nextLocation.i === gBoard.length ||
        nextLocation.j === -1 || nextLocation.j === gBoard[0].length) moveUnderGround(nextLocation);

    //  nextLocation.i = gBoard.length - 1;
    var nextCellContent = gBoard[nextLocation.i][nextLocation.j];

    // : return if cannot move
    if (nextCellContent === WALL) return;
    if (nextCellContent === WALLPRO) return;
    if (nextCellContent === FOOD) eatFood();
    if (nextCellContent === CHERRY) updateScore(15);
    if (nextCellContent === POWER_FOOD && gPacman.isSuper) return;
    if (nextCellContent === POWER_FOOD) powerFood();

    // : hitting a ghost?  call gameOver

    if (nextCellContent === GHOST && !gPacman.isSuper) {
        gameOver('looser <br>Game Over');
        return;
    }
    if (nextCellContent === GHOST && gPacman.isSuper) {
        return killGhost(nextLocation);
    }

    // : moving from corrent position:
    // : update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
    // : update the DOM
    renderCell(gPacman.location, EMPTY);
    // : Move the pacman to new location
    gPacman.location = nextLocation;
    // : update the model
    gBoard[nextLocation.i][nextLocation.j] = PACMAN;
    // : update the DOM
    renderCell(nextLocation, PACMAN);
}

function getNextLocation(ev) {
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    };
    // : figure out nextLocation
    switch (ev.key) {
        case 'ArrowDown':
            nextLocation.i++;

            break;
        case 'ArrowUp':
            nextLocation.i--;

            break;
        case 'ArrowRight':
            nextLocation.j++;

            break;
        case 'ArrowLeft':
            nextLocation.j--;
            break;
    }
    return nextLocation;
}

function changeMoveImgPac(ev) {
    var elImgPac = document.querySelector('.miniPac');
    switch (ev.key) {
        case 'ArrowDown':
            elImgPac.style.transform = 'rotate(90deg)';
            break;
        case 'ArrowUp':
            elImgPac.style.transform = 'rotate(270deg)';

            break;
        case 'ArrowRight':
            elImgPac.style.transform = 'rotate(0deg)';

            break;
        case 'ArrowLeft':
            elImgPac.style.transform = 'rotate(180deg)';
            break;
    }

}
