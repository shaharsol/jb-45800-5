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

    // process
    const newHTMLString = `
        <tr>
            <td>${catalogNumber}</td>
            <td>${title}</td>
            <td>${description}</td>
            <td>${price}</td>
            <td>${category}</td>
            <td>${color}</td>
        </tr>
    `

    // output
    document.getElementById('data').innerHTML += newHTMLString

    // reset the form for next product
    document.getElementById('productForm').reset()

}