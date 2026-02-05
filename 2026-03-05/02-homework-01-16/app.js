pyramidSize = +prompt('enter pyramid size')

for (row = 1; row <= pyramidSize; row = row + 1) {
    rowChars = ''
    leftSpacesToDraw = pyramidSize - row

    for (space = 1; space <=     leftSpacesToDraw; space = space + 1) {
        rowChars = rowChars + ' '
    }

    for (counter = 1; counter <= row; counter = counter + 1) {
        rowChars = rowChars + counter 
    }

    for (counter = row - 1; counter > 0; counter = counter - 1) {
        rowChars = rowChars + counter
    }

    console.log(rowChars)

}