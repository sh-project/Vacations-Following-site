INSERT INTO jbh_travel.permissions(permission)
VALUES ('user'),('admin');

-- insert admin
INSERT INTO jbh_travel.users(first_name, last_name, user_name, password, permission)
VALUES ("admin","adminov","admin","$2b$10$UI/LvXOO6Tuqz5w8a/nM1.wLCSyMsR6BSUsM13u7vvvvF7XXFfiDK",2);
-- password: ab1234

INSERT INTO jbh_travel.users(first_name, last_name, user_name, password, permission)
VALUES ('John','Doe','JohnDoe','$2b$10$UI/LvXOO6Tuqz5w8a/nM1.wLCSyMsR6BSUsM13u7vvvvF7XXFfiDK',1);

INSERT INTO jbh_travel.vacations(destination, slogan, image, description, date_from, date_to, price)
VALUES ('London','A perfect vacation in the capital of England','london.jpg','','2020-10-26 00:00:00','2020-10-28 00:00:00','2500'),
		('Barcelona','Football or antiques? Just enjoy','Barcelona.jpg','','2020-10-26 00:00:00','2020-10-28 00:00:00','2500'),
		('Europe','Conquering Europe from side to side','Europe.jpg','','2020-10-26 00:00:00','2020-10-28 00:00:00','3500'),
        ('Hong Kong','Hong Kong from top to bottom','HongKong.jpg','','2020-10-26 00:00:00','2020-10-28 00:00:00','1500'),
        ('Jaffa','Old Jaffa, with an innovative look','Jaffa.jpg','','2020-10-26 00:00:00','2020-10-28 00:00:00','10000'),
        ('paris','From the heights of the Eiffel Tower, to the depths of honey','paris.jpg','','2020-10-26 00:00:00','2020-10-28 00:00:00','8000'),
        ('toronto','Toronto, the city and the legend','toronto.jpg','','2020-10-26 00:00:00','2020-10-28 00:00:00','780'),
        ('Venice','Sail across your dreams','Venice.jpg','','2020-10-26 00:00:00','2020-10-28 00:00:00','1200');
                
UPDATE vacations
SET description ='the destination is full of pageantry and tradition, and nowhere else is that on display so vividly than in the destination. Yet is hardly living in the past, continually courting innovation and growth in its art, architecture, restaurants, and hotels.'
WHERE id > 0;
 
INSERT INTO jbh_travel.follow(vacation, user)
VALUES (1, 2),(2, 2),(5, 2);
