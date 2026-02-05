function logCalc(expression) {
    console.log(`the arithmetic calculation result of ${problem} is ${expression}`)
}

// expected input: 2+2, 3*4, 10/5, 4-3
const problem = prompt('enter math problem')

if (problem.includes('+')) {
    const parts = problem.split('+')
    logCalc(+parts[0] + +parts[1])
} else if (problem.includes('-')) {
    const parts = problem.split('-')
    logCalc(+parts[0] - +parts[1])
} else if (problem.includes('*')) {
    const parts = problem.split('*')
    logCalc(+parts[0] * +parts[1])
} else if (problem.includes('/')) {
    const parts = problem.split('/')
    logCalc(+parts[0] / +parts[1])
}



