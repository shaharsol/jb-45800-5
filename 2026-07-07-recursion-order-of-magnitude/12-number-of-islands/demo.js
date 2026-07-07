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

// in the mapa, there are islands and oceans
// '1' represent land
// '0' represent water
// an island is considered a group of '1' that are connected
// in straight lines (not diagonal)
// write a program to echo the number of islands in the mapa