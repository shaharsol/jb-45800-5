start = +prompt('enter start number')
end = +prompt('enter end number')

if (end < start) {
    // 1   5
    // replace the values of end and start
    // take the value of start, and put it in end
    // and
    // take the value of end, and put it in start
    helper = start // 5
    start = end // 1
    end = helper // 5
}

for(count = start; count <= end ; count = count + 1) {
    console.log(count)
}

