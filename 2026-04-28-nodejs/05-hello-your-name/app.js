const namesParts = [...process.argv]
namesParts.splice(0, 2)
console.log(`hello ${namesParts.join(' ')}`)


console.log(process.argv)