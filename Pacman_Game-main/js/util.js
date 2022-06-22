'use strict';

function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = 'cell cell' + i + '-' + j;
            if (cell === WALL)
                className += ' wall';
            else if (cell === WALLPRO)
                className += ' wallPro';
            if ((i === 0 && (j < 15 || (j > 16 && j < 31))) ||
                (i === mat.length - 1 && ((j > 0 && j < 15) || j > 16)) ||
                ((i === 2 || i === 8) && ((j > 2 && j < 11) || (j > 20 && j < 29))))
                className += ' wallRow';
            if ((i === 0 || i === mat.length - 1) && j === 14 || ((i === 2 || i === 8) && (j === 10 || j === 28)) ||
                (i === 10 && j === 31) || (i === 0 && j === 31) || ((i > 3 && i < 7) && (j === 10 || j === 27)))
                className += ' wallColRight';
            if (((i === 0 || i === 10) && (j === 0 || j === 17)) || ((i === 2 || i === 8) && (j === 3 || j === 21)) || ((i > 3 && i < 7) && (j === 4 || j === 21)))
                className += ' wallColLeft';
            if ((i > 2 && i < 10 && j === 0) || (i > 0 && i < 8 && j === 31) || ((i > 3 && i < 7 && (j === 2 || j === 29))))
                className += ' wallColBothSide';
            if (((i === 10) && j == 0) || (i === 7 && j === 31) || ((i === 6) && (j === 2 || j === 29)) || (i === 6 && (((j > 3 && j < 11)) || (j > 20 && j < 28))))
                className += ' wallRowDown';
            if ((i === 0 && j === 31) || (i === 4 && (((j > 3 && j < 11)) || (j > 20 && j < 28))) || (i === 4 && (j === 2 || j === 29)) || (i === 3 && j === 0))
                className += ' wallRowUP';
            if ((i === 2 || i === 1) && j === 0)
                className += ' walloutLeft';
            if (i === 0 && (j === 15 || j === 16))
                className += ' walloutTop';
            if (i === 10 && (j === 15 || j === 16))
                className += ' walloutBottom';
            if ((i === 9 || i === 8) && j === 31)
                className += ' walloutRight';

            strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value, ghostColor = null) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    // var originalColor = elCell.style.color;
    if (value === GHOST) {
        elCell.classList.add('ghost');

        if (gPacman.isSuper) {
            elCell.style.backgroundColor = 'blue';

        } else {
            elCell.style.backgroundColor = ghostColor;
        }
    } else {
        if (elCell.classList.contains('ghost')) {
            elCell.classList.remove('ghost');
            elCell.style.backgroundColor = 'black';
        }
    }
    elCell.innerHTML = value;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// function getRandomGhost() {

// }
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}