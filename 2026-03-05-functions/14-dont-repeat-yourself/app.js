// expected input: 2+2, 3*4, 10/5, 4-3
const problem = prompt('enter math problem')

if (problem.includes('+')) {
    const parts = problem.split('+')
    console.log(`the result of ${problem} is ${+parts[0] + +parts[1]}`)
} else if (problem.includes('-')) {
    const parts = problem.split('-')
    console.log(`the result ${problem} is ${+parts[0] - +parts[1]}`)
} else if (problem.includes('*')) {
    const parts = problem.split('*')
    console.log(`the result of ${problem} is ${+parts[0] * +parts[1]}`)
} else if (problem.includes('/')) {
    const parts = problem.split('/')
    console.log(`the result of ${problem} is ${+parts[0] / +parts[1]}`)
}



