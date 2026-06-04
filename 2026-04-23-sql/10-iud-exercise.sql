-- Congrats! You were accepted to work in Northwind. Add yourself to the employees table
insert into countries(name) values('Isarel');

update countries set name = 'Israel' where name = 'Isarel';

insert into cities(countryId, name) 
values((select id from countries where name = 'Israel'), 'Tel Aviv');


insert into employees(firstName, lastName, phone, countryId, cityId)
values(
    'Shahar', 
    'Solomianik', 
    '555-5555-5555', 
    (select id from countries where name = 'Israel'), 
    (select id from cities where name = 'Tel Aviv' and countryId = (select id from countries where name = 'Israel'))
);

-- Congrats! You had a good year in northwind and you got a raise! Now you can fulfill your dream and move to live in Las Vegas. Update your employee record to reflect the fact that you had moved to las vegas
insert into cities(countryId, name) 
values((select id from countries where name = 'USA'), 'Las Vegas');

update  employees
set     countryId = (select id from countries where name = 'USA'),
        cityId = (select id from cities where name = 'Las Vegas' and countryId = (select id from countries where name = 'USA'))
where   firstName = 'Shahar'
and     lastName = 'Solomianik'

-- Congrats! You have a birthday, and the employees threw you a surprise party. Alas! You got drunk… delete the order details table “by mistake”
delete from `order-details`;

-- Condolences! Your deletion of the table got you fired. Delete yourself from the employees table as the last authorized thing you do
delete from employees
where   firstName = 'Shahar'
and     lastName = 'Solomianik';

-- However, you are still an Israeli and never a FRYER. Therefore, avenge Northwind for firing you, and delete all bosses records
delete from employees
where   reportsTo is null;