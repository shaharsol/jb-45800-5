import Vehicle from './vehicle-better.js'

const skoda = new Vehicle('skoda', 1600, 200, 'blue', 1990, 1000)


console.log(`engine volume is now ${skoda.engineVolume}`)
skoda.engineVolume = 2000
console.log(`engine volume is now ${skoda.engineVolume}`)
