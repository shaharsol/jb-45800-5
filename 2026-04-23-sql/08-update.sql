-- simple update of a single record
update  products
set     categoryId = 6
where   id = 82;

-- update is one of the most dangerous commands.
-- the most dangerous practice is forgetting the where
update  products
set     categoryId = 6
;

-- i can update as many values as i want in a record
update  products
set     categoryId = 4,
        stock=0,
        price=210
where   id = 82;

-- using the where i can create a controlled multi update
update  products
set     price = price * 1.2
where   price < 20