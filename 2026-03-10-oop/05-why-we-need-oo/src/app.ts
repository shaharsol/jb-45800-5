import { getCount } from './products.js'

import iChooseTheNameOfTheDefaultExportWhenIImport, { getCount as getUserCount } from './users.js'
// i can choose how to import 
// import iChooseTheNameOfTheDefaultExportWhenIImport from './users.js'
// import { getCount as getUserCount } from './users.js'


const numberOfProducts = getCount()
const numberOfUsers = getUserCount()

console.log(`number of products is ${numberOfProducts}`)
console.log(`number of users is ${numberOfUsers}`)
iChooseTheNameOfTheDefaultExportWhenIImport()