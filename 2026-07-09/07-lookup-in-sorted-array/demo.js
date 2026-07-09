// const arr = [2, 6, 9, 12, 15, 23, 45, 67, 89, 99, 112, 234, 567, 987, 1004, 1324]

const arr = []
for(let i=1; i <= 10000; i++) {
    arr.push(i)
}

// startIndex 0
// finishIndex 7
// [2, 6, 9, 12, 15, 23, 45] 
// [2, 6, 9]  


// [2, 6, 9, 12, 15, 23, 45, 67, 89, 99, 112, 234, 567, 987, 1004, 1324]
// [2, 6, 9, 12, 15, 23, 45] ???? [89, 99, 112, 234, 567, 987, 1004, 1324]
// [2, 6, 9, 12, 15, 23, 45, 67, 89] [99, 112, 234, 567, 987, 1004, 1324]
// [99, 112, 234, 567] [ 987, 1004, 1324]
// [ 987] [1004, 1324]
// [1004][1324]

// write the algorithm to find the index of a given input in the array without using indexOf
// input = 9, output = 2
// input = 1324, output = 15
// what was the Order of magnitude of your solution?

// a solution using O(n):
// let idx;
// for(let i=0; i < arr.length ; i++) {
//     if(arr[i] === +process.argv[2]) {
//         idx = i;
//         break;
//     }
// }

// a solution using O(log2(n))
let startIndex = 0;
let finishIndex = arr.length - 1 
let count = 0;
let found = false;
do {

    count++
    let currentIndex = Math.floor((startIndex + finishIndex)/2)
    if(arr[currentIndex] === +process.argv[2]) {
        console.log(`index is ${currentIndex}, took me ${count} iterations`)
        found = true
    }

    if(arr[currentIndex] > +process.argv[2]) finishIndex = currentIndex - 1
    else startIndex = currentIndex + 1

} while (finishIndex >= startIndex)

if (!found) console.log('the item is not in the array')
