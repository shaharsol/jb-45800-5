import axios = require("axios")

async function scrapeProduct() {
    try {
        const { data } = await axios.get('https://www.ivory.co.il/catalog.php?id=113259')
        const barcodeSpecificAreaIndex = data.lastIndexOf('barcode-specific-area');
        console.log(barcodeSpecificAreaIndex)
    } catch (e) {
        console.error(e)
    }
}

scrapeProduct()


