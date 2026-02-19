// promise has 3 possible states:
// - pending
// - rejected: promise will be rejected when the reject callback is invoked
// - fulfilled: promise will be fulfilled when the resolve callback is invoked

// promise manufacturing
const getLocation = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
        position => resolve(position), 
        error => reject(error)
    )
})

// promise consumption
getLocation
    .then(position => console.log(position))
    .catch(error => console.log(error))




