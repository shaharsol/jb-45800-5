-- all orders from USA
select * 
from orders 
join countries 
on orders.countryId = countries.id 
and countries.name = 'USA';

-- all products ordered from USA
select DISTINCT products.name 
from orders 
join countries 
on orders.countryId = countries.id 
and countries.name = 'USA'
join `order-details` as order_details on order_details.orderId = orders.id
join products on products.id = order_details.productId
order by products.name;

-- Generate a list of suppliers and the number of their products we sold in the USA, sorted from most popular to least
select suppliers.companyName, sum(order_details.quantity) as sum_quantity
from orders 
join countries 
on orders.countryId = countries.id 
and countries.name = 'USA'
join `order-details` as order_details on order_details.orderId = orders.id
join products on products.id = order_details.productId
join suppliers on suppliers.id = products.supplierId
group by suppliers.id
order by sum_quantity desc;