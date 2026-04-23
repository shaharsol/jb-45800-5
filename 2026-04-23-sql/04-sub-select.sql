-- get all products where price is larger than the average product price
-- subselect is in the where (ok performance, 1 more disk access)
select name, price
from products
where price > (select avg(price) from products);

-- get the products with the category name instead of category_id 
-- subselect in the select (very bad performance, disk access per each result set row)
select name, price, (select name from categories where id = categoryId) as category_name
from products
order by category_name asc;

-- example of subselect inside the from
-- this actually creates a temproray table from which
-- we can select data
select  avg(rs1.price)
from    (	select name, price
		    from products   ) as rs1;