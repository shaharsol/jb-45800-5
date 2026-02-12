function isValidURL(url) {
    if(!url.startsWith('http')) {
        return false
    }

    if(url.includes(' ')) {
        return false
    }

    if(!url.includes('://')) {
        return false
    }

    return true    
}

function addProduct(event) {

    // tell the browser: you are old and now is 2026 and not 1994
    // and i want to take control, so dont submit to any server...
    event.preventDefault()

    // input
    const catalogNumber = document.getElementById('catalogNumber').value
    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const price = document.getElementById('price').value
    const category = document.getElementById('category').value
    const color = document.getElementById('color').value
    const imageURL = document.getElementById('imageURL').value

    // validation
    if(!isValidURL(imageURL)) {
        alert('please enter a valid url for image')
        // this return exits the function,
        // essentially prevents the DHTML stage to occur
        return
    }

    // process
    const newHTMLString = `
        <tr>
            <td>${catalogNumber}</td>
            <td>${title}</td>
            <td>${description}</td>
            <td>${price}</td>
            <td>${category}</td>
            <td>${color}</td>
            <td><img src="${imageURL}" /></td>
        </tr>
    `

    // output
    document.getElementById('data').innerHTML += newHTMLString

    // reset the form for next product
    document.getElementById('productForm').reset()

}