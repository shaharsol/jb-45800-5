import axios from "axios"
import * as cheerio from 'cheerio';


async function scrapeCategoryProducts(href: string) {

    const { data } = await axios.get(href)
    const $ = cheerio.load(data);
    const products = ($('.product-box-view a')).map((i, p) => $(p).attr('data-product-id')).get()
    console.log(products)


    
}

(async() => {
    const categories = await scrapeCategoryProducts('https://www.ivory.co.il/catalog.php?act=cat&id=2590&f=28905')
})()