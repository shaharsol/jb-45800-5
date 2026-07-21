import axios from "axios"
import * as cheerio from 'cheerio';
import { numericQuantity } from 'numeric-quantity';

interface IvoryProduct {
    title: string,
    barcode: string,
    price: number
}

async function scrapeProduct(id: number): Promise<IvoryProduct> {
    try {
        const { data } = await axios.get(`https://www.ivory.co.il/catalog.php?id=${id}`)
        const $ = cheerio.load(data);
        const title = $('h1').html()
        const barcode = $('.barcode-specific-area').html()
        
        const prices = [
            numericQuantity($('.print-no-eilat-price').html()),
            numericQuantity($('.print-actual-price').html()),
            numericQuantity($('.price_product_page').html()),
        ]

        const price = prices.find(p => !isNaN(p))

        return {
            title,
            barcode,
            price
        }


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

(async() => {
    const data = await scrapeProduct(129333)
    console.log(data)
})()





