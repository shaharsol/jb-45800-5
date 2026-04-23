-- Calc the average quantity of an order
SELECT avg(quantity) FROM `order-details`;


-- Calc the average quantity of an order per product Id
SELECT productId, avg(quantity) FROM `order-details` group by productId;


-- Calc the average quantity of an order per product Id but only where the average quantity is between 20 and 40
SELECT productId, avg(quantity) as avg_quantity FROM `order-details` group by productId having avg_quantity between 20 and 40;

