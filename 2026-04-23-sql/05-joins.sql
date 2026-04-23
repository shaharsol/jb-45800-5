-- join is a result set that is made from data from 2 or more tables
-- a join will usually be followed by "on" which describes
-- how to perform the join. if there is no "on", there will be
-- a cartesian multiply which is not the result you usually want
-- so always include "on" when using "join"
-- a very very very important notice: joins SHOULD be made on foreign keys
-- if i have a join not on a foreign key it means either:
-- 1. the data is invalid
-- 2. there's a foreign key missing
select	products.name, 
		price, 
        categoryId, 
        categories.id, 
        categories.name
from 	products 
join 	categories on products.categoryId = categories.id;