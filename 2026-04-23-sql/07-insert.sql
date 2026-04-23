-- the most simple insert
INSERT INTO countries VALUES(1000001, 'Westeros');

-- if i have an autoincrement field, i can add NULL as the value, and then the 
-- rdbms will use the autoincrement mechanism
INSERT INTO countries VALUES(NULL, 'Essos');

-- now lets say i want to insert a row to a table with a long list of fields, and i don't
-- need values to nullable fields
-- it means i need to explicitly add null for each column there is
insert into products values(null, 'shawarma', 60, 100, null, null, null, null)

-- so if i want to not be forced to explicitly mention "null", i can list a list of fields
insert into products(price, name, stock) values(60, 'shawarma', 100)

-- if i want to insert multiple records, i dont need separate insert statements
-- in other words: if i have the info more multiple new records
-- i can insert them all in a single insert statement
insert into products(price, name, stock) 
values 
(85, 'sushi', 20),
(15, 'Crystal Cola', 10),
(115, 'Entrecote', 20)
;

-- i can use select as the source of data for insert statement
insert into products(name, price, stock)
SELECT concat(name, '-new'), price * 2, stock * 4 FROM 
`products`;



