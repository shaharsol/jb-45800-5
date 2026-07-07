const mapa = [
    ['1','1','1','1','1','1','1','0','0'],
    ['1','1','1','1','0','0','0','0','0'],
    ['1','1','1','0','0','0','0','0','1'],
    ['1','1','0','1','0','0','0','0','0'],
    ['1','1','0','1','0','0','0','0','0'],
    ['1','1','0','1','1','0','1','1','0'],
    ['1','0','0','1','1','0','1','1','0'],
    ['0','0','0','1','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0'],
]

// const mapa = [
//     ['0','0'],
//     ['0','0'],
// ]


// const mapa = [
//     ['1','0'],
//     ['0','0'],
// ]

// const mapa = [
//     ['0','0','0'],
//     ['0','0','0'],
//     ['0','0','1'],
// ]

// const mapa = [
//     ['0','0','0'],
//     ['1','0','1'],
//     ['0','0','0'],
// ]

// in the mapa, there are islands and oceans
// '1' represent land
// '0' represent water
// an island is considered a group of '1' that are connected
// in straight lines (not diagonal)
// write a program to echo the number of islands in the mapa
let cnt = 0;
const flattenIsland = (row, col) => {
    // exit conditions
    if(row < 0) return
    if(row >= mapa.length) return
    if(col < 0) return
    if(col >= mapa[row].length) return
    if(mapa[row][col] === '0') return

    // single iteration
    // console.log(`before: [${row},${col}]: ${mapa[row][col]}`)
    mapa[row][col] = '0'
    // console.log(`after: [${row},${col}]: ${mapa[row][col]}`)

    // processing the rest of the recursion
    // top
    flattenIsland(row - 1, col)
    // right
    flattenIsland(row, col + 1)
    // bottom
    flattenIsland(row + 1, col)
    // left
    flattenIsland(row, col - 1)

    return
}


const getNumberOfIslands = () => {
    let islands = 0;
    for(let row = 0; row < mapa.length; row++) {
        for(let col = 0; col < mapa[row].length; col++) {
            if(mapa[row][col] === '1') {
                // flatten the island
                flattenIsland(row, col)
                // count the flattenned island as 1
                islands++
            }
        }
    }
    return islands;
}

console.log(`number of islands is ${getNumberOfIslands()}`)