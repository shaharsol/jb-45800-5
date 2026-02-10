function getUserInput() {
    return +prompt('enter a number')
}

function displaySquare(size) {
    for (let row = 0; row < size; row = row + 1) {
        displayRow(size)
    }
}

function displayRow(size) {
    let row = '';
    for (let col = 0; col < size; col = col + 1) {
        row = row + '*'
    }
    console.log(row)
}

const size = getUserInput()
displaySquare(size)



