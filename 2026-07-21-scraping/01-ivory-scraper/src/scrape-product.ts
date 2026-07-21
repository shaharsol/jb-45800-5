import axios = require("axios")
import * as cheerio from 'cheerio';

async function scrapeProduct() {
    try {
        const { data } = await axios.get('https://www.ivory.co.il/catalog.php?id=113259')
        // const barcodeSpecificAreaIndex = data.lastIndexOf('barcode-specific-area');
        // const nextTagCloserIndex = data.indexOf('>', barcodeSpecificAreaIndex)
        // const nextTagOpenerIndex = data.indexOf('<', nextTagCloserIndex)
        // const result = data.substring(nextTagCloserIndex + 1, nextTagOpenerIndex)
        const $ = cheerio.load(data);
        const result = $('.barcode-specific-area').html()


        console.log(result)


        // we don't want to scrape using string functions because
        // 1. it is bad performance to search strings, better traverse a DOM object
        // 2. it creates unreadable code
        // const h1Index = data.indexOf('<h1')
        // const h1Closer = data.indexOf('>', h1Index)
        // const nextOpener = data.indexOf('<', h1Closer)
        // const productTitle = data.substring(h1Closer + 1, nextOpener)
        // console.log(productTitle)
    } catch (e) {
        console.error(e)
    }
}

scrapeProduct()


