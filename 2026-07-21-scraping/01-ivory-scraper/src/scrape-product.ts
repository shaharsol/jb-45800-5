import axios = require("axios")

async function scrapeProduct() {
    try {
        const { data } = await axios.get('https://www.ivory.co.il/catalog.php?id=113259')
        const barcodeSpecificAreaIndex = data.lastIndexOf('barcode-specific-area');
        const nextTagCloserIndex = data.indexOf('>', barcodeSpecificAreaIndex)
        const nextTagOpenerIndex = data.indexOf('<', nextTagCloserIndex)
        const result = data.substring(nextTagCloserIndex + 1, nextTagOpenerIndex)
        console.log(result)
    } catch (e) {
        console.error(e)
    }
}

scrapeProduct()


