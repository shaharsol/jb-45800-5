-- customers from USA
SELECT * FROM customers where countryId = 24;

-- employess from London who started working in 1993 onward
SELECT * from employees where cityId=45 and year(hireDate) >= '1993';

-- all products that have more than 1 word in their names
SELECT name FROM `products` where locate(' ', name) > 0;

-- all products sorted by price ascending with a pseudo column of price incl. vat
SELECT name, price, price * 1.18 as price_including_vat ,  stock 
FROM `products`
order by price asc;

-- 10 most expensive products
SELECT name, price FROM `products` order by price desc limit 10;
    



