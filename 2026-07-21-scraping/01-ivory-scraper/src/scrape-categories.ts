import axios from "axios"
import * as cheerio from 'cheerio';


export async function scrapeCategories(): Promise<string[]> {

    const { data } = await axios.get(`https://www.ivory.co.il/catalog.php?act=all_categories`)
    const $ = cheerio.load(data);
    const categories = ($('.category_list > a')).map((i, cat) => $(cat).attr('href')).get()
    return categories

}

(async() => {
    const categories = await scrapeCategories()
    console.log(categories)
})()