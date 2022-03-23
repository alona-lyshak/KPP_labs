let started = false;
let timer;
let evolutionSpeed = 1000;

const rows = 30;
const cols = 30;

let currGen = [rows];
let nextGen = [rows];

function createGenArrays() {
    for (let i = 0; i < rows; i++) {
        currGen[i] = new Array(cols);
        nextGen[i] = new Array(cols);
    }
}

function initGenArrays() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            currGen[i][j] = 0;
            nextGen[i][j] = 0;
        }
    }
}

function createWorld() {
    let world = document.querySelector('#world');
    let table = document.createElement('table');
    table.setAttribute('id', 'worldgrid');
    for (let i = 0; i < rows; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement('td');
            cell.setAttribute('id', i + '_' + j);
            cell.setAttribute('class', 'dead');
            cell.addEventListener('click', cellClick);
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    world.appendChild(table);
}

function createNextGen() {
    for (row in currGen) {
        for (col in currGen[row]) {
            let neighbours = getNeighborCount(row, col);
            //checking the rules for a living cell
            if (currGen[row][col] == 1) {
                if (neighbours < 2) {
                    nextGen[row][col] = 0;
                } else if (neighbours == 2 || neighbours == 3) {
                    nextGen[row][col] = 1;
                } else if (neighbours > 3) {
                    nextGen[row][col] = 0;
                }
                //check the rules for the dead cell
            } else if (currGen[row][col] == 0) {
                if (neighbours == 3) {
                    nextGen[row][col] = 1;
                }
            }
        }
    }
}

function getNeighborCount(row, col) {
    let count = 0;
    let nrow = Number(row);
    let ncol = Number(col);

    //check if we are not in the first line
    if (nrow - 1 >= 0) {
        //check the upper neighbor
        if (currGen[nrow - 1][ncol] == 1) {
            count++;
        }
    }
    // check if we are not in the first cell (upper left corner)
    if (nrow - 1 >= 0 && ncol - 1 >= 0) {
        //check the upper left neighbor
        if (currGen[nrow - 1][ncol - 1] == 1) {
            count++;
        }
    }
    //check if we are not in the first row of the last column (top right corner)
    if (nrow - 1 >= 0 && ncol + 1 < cols) {
        //check the upper right neighbor
        if (currGen[nrow - 1][ncol + 1] == 1) {
            count++;
        }
    }
    //check if we are not in the first column
    if (ncol - 1 >= 0) {
        //check the left neighbor
        if (currGen[nrow][ncol - 1] == 1) {
            count++;
        }
    }
    //check if we are not in the last column
    if (ncol + 1 < cols) {
        //check the right neighbor
        if (currGen[nrow][ncol + 1] == 1) {
            count++;
        }
    }
    //check if we are not in the lower left corner
    if (nrow + 1 < rows && ncol - 1 >= 0) {
        //check the lower left neighbor
        if (currGen[nrow + 1][ncol - 1] == 1) {
            count++;
        }
    }
    //check if we are not in the lower right corner
    if (nrow + 1 < rows && ncol + 1 < cols) {
        //check the lower right neighbor
        if (currGen[nrow + 1][ncol + 1] == 1) {
            count++;
        }
    }
    //check if we are not in the last line
    if (nrow + 1 < rows) {
        //check the lower neighbor
        if (currGen[nrow + 1][ncol] == 1) {
            count++;
        }
    }
    return count;
}

function updateCurrGen() {
    for (row in currGen) {
        for (col in currGen[row]) {
            currGen[row][col] = nextGen[row][col];
            nextGen[row][col] = 0;
        }
    }
}

function updateWorld() {
    let cell = '';
    for (row in currGen) {
        for (col in currGen[row]) {
            cell = document.getElementById(row + '_' + col);
            if (currGen[row][col] == 0) {
                cell.setAttribute('class', 'dead');
            } else {
                cell.setAttribute('class', 'alive');
            }
        }
    }
}

function cellClick() {
    let loc = this.id.split("_");
    let row = Number(loc[0]);
    let col = Number(loc[1]);

    if (this.className === 'alive') {
        this.setAttribute('class', 'dead');
        currGen[row][col] = 0;
    } else {
        this.setAttribute('class', 'alive');
        currGen[row][col] = 1;
    }
}

function startStopGol() {
    let startstop = document.querySelector('#btnStartStop');
    if (!started) {
        started = true;
        startstop.value = 'Stop Reproducing';
        evolve();
    } else {
        started = false;
        startstop.value = 'Start Reproducing';
        clearTimeout(timer);
    }
}

function evolve() {
    createNextGen();
    updateCurrGen();
    updateWorld();
    if (started) {
        timer = setTimeout(evolve, evolutionSpeed);
    }
}

function resetWorld() {
    location.reload();
}

window.onload = () => {
    createWorld();
    createGenArrays();
    initGenArrays();
}