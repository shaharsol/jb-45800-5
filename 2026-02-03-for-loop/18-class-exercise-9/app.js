for(row = 1; row < 6; row = row + 1) {
    column = ''
    for(columns = 1; columns <= 2**row; columns = columns + 1) {
        column = column + '*'
    }
    console.log(column)
}