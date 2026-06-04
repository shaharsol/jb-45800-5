function isMatrixValid(matrix) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
                if ((row + 1) * (col + 1) != matrix[row][col]) {
                // return terminates the function execution
                return false
            }
        }
    }
    return true    
}

const validMatrix = [
    [1, 2, 3],
    [2, 4, 6],
    [3, 6, 9]
]

const invalidMatrix = [
    [1, 2, 3],
    [2, 5, 6],
    [3, 6, 9]
]

console.log(`is matrix valid? ${isMatrixValid(validMatrix) ? 'yes' : 'no'}`)
console.log(`is matrix valid? ${isMatrixValid(invalidMatrix) ? 'yes' : 'no'}`)