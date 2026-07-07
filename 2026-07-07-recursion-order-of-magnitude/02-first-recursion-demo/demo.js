// a function that prints n stars
// const printNStars = (n) => {
//     for(let i=0; i < n; i++) {
//         console.log('*')
//     }
// }

const printNStars = (n) => {
    // 2. exit condition. this prevents the process from becoming
    //      an endless loop (=== stack overflow)
    if( n===0 ) return 
    // 3. process a single iteration
    console.log('*')
    // 4. invoke the rest of the process
    printNStars(n-1)
}

// 1. the function consumer can't tell if the function
//      it invokes is recursive or not
printNStars(+process.argv[2])