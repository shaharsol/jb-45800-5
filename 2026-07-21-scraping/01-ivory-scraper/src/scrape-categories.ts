import axios from "axios"
import * as cheerio from 'cheerio';


async function scrapeCategories() {

    const { data } = await axios.get(`https://www.ivory.co.il/catalog.php?act=all_categories`)
    const $ = cheerio.load(data);
    const categories = ($('.category_list > a')).map((i, cat) => $(cat).attr('href')).get()
    console.log(categories)

}

(async() => {
    const categories = await scrapeCategories()
})()