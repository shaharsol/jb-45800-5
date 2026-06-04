export const products = [
    {}, {}
];
export function getCount() {
    return products.length;
}
// when i export "something" i actually add the "something" top an object
// that is exported from the file
// so if i am exporting `products` and `getCount`
// i am actually exporting:
// {
//      products,
//      getCount
// }
