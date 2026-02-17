// data can now either be:
// - a parsed version of the json that is stored in the localstorage
// - if nothing is stored in the localstorage, the value will be []
// this saves us from writing code such as:
// if(!data) {
//     data = []
// }

const LOCAL_STORAGE_KEY = 'products'

function saveProducts(data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
}

function deleteProduct(productId) {
    if(confirm(`are you sure you want to delete product ${productId}?`)) {
        const data = getData()
        let index = 0;
        for (const product of data) {
            if(product.catalogNumber === productId) {
                data.splice(index, 1)
                saveProducts(data)
                syncDataToDOM()
                return
            }
            index++
        }
    }
}

function updateProduct(idx) {
    console.log(`updateProduct invoked with ${idx}`)
    const data = getData()
    let index = 0;
    for (const product of data) {
        if(index === idx) {
            // populate the form with the product details

            // when i assign INTO a value property of an input DOM element, I effectively populate
            // the field with data
            document.getElementById('catalogNumber').value = product.catalogNumber
            document.getElementById('title').value = product.title
            document.getElementById('description').value = product.description
            document.getElementById('price').value = product.price
            document.getElementById('category').value = product.category
            document.getElementById('otherDescription').value = product.otherDescription
            document.getElementById('color').value = product.color
            document.getElementById('imageURL').value = product.imageURL
            document.getElementById('when').value = product.when
            document.getElementById('isUpdate').value = "true"

        }
        index++
    }
}

function getData() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || []
}

function getPriceAverage() {
    let sum = 0
    for(const product of getData()) {
        // sum = sum + data.price
        // a shorter version to the line above with +=:
        sum += product.price
    }
    return getData().length ? sum / getData().length : 0
}

function syncDataToDOM() {
    let htmlString = ''
    let idx = 0
    for(const product of getData()) {

        // const color = price < 200 ? 'green' : price < 700 ? 'red'./..

        htmlString += `
            <tr>
                <td>${product.catalogNumber}</td>
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td style="color: ${color};">${product.price}</td>
                <td>${product.category}</td>
                <td style="background-color: ${product.color};">${product.color}</td>
                <td><img src="${product.imageURL}" /></td>
                <td>
                    <button onclick="deleteProduct(${idx})" class="button deleteButton">delete</button>
                    <button onclick="updateProduct(${idx})" class="button updateButton">update</button>
                </td>
            </tr>
    
        `

        idx += 1
    }
    document.getElementById('data').innerHTML = htmlString

    // set total
    document.getElementById('total').innerHTML = getData().length

    // set average
    document.getElementById('averagePrice').innerHTML = getPriceAverage()


}

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

function addOrUpdateProduct(event) {

    // tell the browser: you are old and now is 2026 and not 1994
    // and i want to take control, so dont submit to any server...
    event.preventDefault()

    // input
    const catalogNumber = document.getElementById('catalogNumber').value
    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const price = document.getElementById('price').value
    const category = document.getElementById('category').value
    const otherDescription = document.getElementById('otherDescription').value
    const color = document.getElementById('color').value
    const imageURL = document.getElementById('imageURL').value
    const when = document.getElementById('when').value
    const isUpdate = document.getElementById('isUpdate').value

    console.log(`when is ${when}`)

    // validation
    if(!isValidURL(imageURL)) {
        alert('please enter a valid url for image')
        // this return exits the function,
        // essentially prevents the DHTML stage to occur
        return
    }

    if(category === 'other' && !otherDescription) {
        alert('if you choose other you must describe it')
        return
    }


    // prevent input of a future date
    const today = (new Date()).toLocaleDateString('en-CA')
    console.log(`today is ${today}`)
    if(when > today) {
        alert('you must not enter a date in the future...')
    }


    // process
    // data.push({
    //     catalogNumber: catalogNumber,
    //     title: title,
    //     description: description,
    //     price: price,
    //     category: category,
    //     color: color,
    //     imageURL: imageURL
    // })

    // if we have key-value pairs where the key name is identical
    // to a variable name, then we can omit the variable name 
    const data = getData()

    if(isUpdate === 'true') {
        console.log(`updating product...`)
        let index = 0;
        for (const product of data) {
            console.log(`catalog number from form is ${catalogNumber}`)
            console.log(`current catalog number in loop is ${product.catalogNumber}`)
            if(product.catalogNumber === catalogNumber) {

                console.log('found item to update....')                    

                product.title = title
                product.description = description,
                product.price = +price,
                product.category = category,
                product.color = color,
                product.imageURL = imageURL

                break
            }
            index++
        }
    } else {
        console.log(`adding product...`)
        data.push({
            catalogNumber,
            title,
            description,
            price: +price,
            category,
            color,
            imageURL
        })
    }

    console.log(`data before saving is:`, data)

    saveProducts(data)


    // output
    syncDataToDOM()

    // reset the form for next product
    document.getElementById('isUpdate').value = 'false'
    document.getElementById('productForm').reset()

}

function drawMenu() {
    document.getElementById('menu').innerHTML = `
        <a href="index.html">Home</a>
        <a href="products.html">Products</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
        <a href="careers.html">Careers</a>
    `
}

drawMenu()
syncDataToDOM()
