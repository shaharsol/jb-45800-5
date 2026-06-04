function showFirstName(event) {

    // tell the browser: you are old and now is 2026 and not 1994
    // and i want to take control, so dont submit to any server...
    event.preventDefault()

    const firstName = document.getElementById('firstName')
    // in order to fetch inputs values, we must use the .value property
    console.log(firstName.value)


    const bio = document.getElementById('bio')
    // in order to fetch inputs values, we must use the .value property
    console.log(bio.value)

    const country = document.getElementById('country')
    // in order to fetch inputs values, we must use the .value property
    console.log(country.value)


}