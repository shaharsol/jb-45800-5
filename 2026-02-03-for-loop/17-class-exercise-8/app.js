for(row = 1; row < 6; row = row + 1) {
    column = '' // <- empty string
    for(columns = 1; columns < row + 1; columns = columns + 1) {
        column = column + '*'
    }
    console.log(column)
}