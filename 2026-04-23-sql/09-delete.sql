-- basic delete of a single record
delete from products
where id = 82;

-- i can delete many rows with a broader where condition
delete from products
where price < 20

-- the most dangerous thing to do, more dangerous than update without where
-- is delete without where
delete from products;