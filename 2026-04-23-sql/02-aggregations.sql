-- select all prices from products, split to groups based on catagoryId, and calc the avg for each group
SELECT avg(price), categoryId FROM `products` group by categoryId;

-- same query, order by calculated average price per group
SELECT avg(price) as avg_price, categoryId 
FROM `products`
group by categoryId
order by avg_price desc;

-- the average price for a category within a supplier
SELECT avg(price) as avg_price, supplierId , categoryId
FROM `products`
group by supplierId, categoryId
order by supplierId asc, avg_price desc;

-- the average price per supplier, where the average price is more than 20
-- "having" is like a "where" that runs on the aggregated result set
-- not on the initial result set
-- (this is a classical job interview exercise)
SELECT avg(price) as avg_price, supplierId
FROM `products`
group by supplierId
having avg_price > 20
order by supplierId asc, avg_price desc;
