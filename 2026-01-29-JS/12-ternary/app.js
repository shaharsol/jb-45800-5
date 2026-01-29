grade = +prompt('enter grade')

// if (grade > 60) {
//     alert('you passed the test')
// } else {
//     alert('you failed the test')
// }

alert( grade > 60 ? `you passed the test by ${grade - 60}` : `you failed the test, you missed by ${60-grade}` )

alert ( grade > 90 ? 'excellent score' : (grade > 60 ? 'pass' : 'fail'))