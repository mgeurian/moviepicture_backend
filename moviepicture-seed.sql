-- both test users have the password "password"


INSERT INTO users (password, first_name, last_name, email, is_public)
VALUES ('$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User1',
        'mgeurian@gmail.com',
        FALSE),
       ('$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User2',
        'mgeurian@gmail.com',
        TRUE);


INSERT INTO movie (imdb_id, title, year, genre, plot, director, poster, imdb_rating)
VALUES ('tt0076759', 'Star Wars', 1977,'Action, Adventure, Fantasy', "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vad", 'George Lucas', 'https://m.media-amazon.com/images/M/MV5BNzVlY2MwMjktM2E4OS00Y2Y3LWE3ZjctYzhkZGM3YzA1ZWM2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg', 8.6),
        ('tt0073195', "Jaws", 1975, 'Adventure', 'Thriller', "When a killer shark unleashes chaos on a beach community, it's up to a local sheriff, a marine biologist, and an old seafarer to hunt the beast down.", "Steven Spielberg", "https://m.media-amazon.com/images/M/MV5BMmVmODY1MzEtYTMwZC00MzNhLWFkNDMtZjAwM2EwODUxZTA5XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg", 8.0),
        ('tt0088763', 'Back to the Future', 1985, 'Adventure', 'Comedy, Sci-Fi', 'Marty McFly, a 17-year-old high school student, is accidentally sent thirty years into the past in a time-traveling DeLorean invented by his close friend, the eccentric scientist Doc Brown.', 'Robert Zemeckis', 'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg', 8.5),
        ('tt0379786', 'Serenity', 2005, 'Action, Adventure, Sci-Fi', 'The crew of the ship Serenity try to evade an assassin sent to recapture telepath River', 'Joss Whedon', 'https://m.media-amazon.com/images/M/MV5BOWE2MDAwZjEtODEyOS00ZjYyLTgzNDUtYmNiY2VmNWRiMTQxXkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_SX300.jpg', 7.8),
        ('tt2239822', 'Valerian and the City of a Thousand Planets', 2017, 'Action, Adventure, Fantasy', 'A dark force threatens Alpha, a vast metropolis and home to species from a thousand planets. Special operatives Valerian and Laureline must race to identify the marauding menace and safeguard not just Alpha, but the future of the uni', 'Luc Besson', 'https://m.media-amazon.com/images/M/MV5BMTkxMDAxNDUyNV5BMl5BanBnXkFtZTgwOTc3MzcxMjI@._V1_SX300.jpg', 6.5),
        ('tt0437086', 'Alita: Battle Angel', 2019, 'Action', 'Adventure, Sci-Fi', "A deactivated cyborg's revived, but can't remember anything of her past and goes on a quest to find out who she is.", 'Robert Rodriguez', 'https://m.media-amazon.com/images/M/MV5BMTQzYWYwYjctY2JhZS00NTYzLTllM2UtZWY5ZTk0NmYwYzIyXkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_SX300.jpg', 7.3),
        ('tt1677720', 'Ready Player One', 2018, 'Action, Adventure, Sci-Fi', 'When the creator of a virtual reality called the OASIS dies, he makes a posthumous challenge to all OASIS users to find his Easter Egg, which will give the finder his fortune and control of his world.', 'Steven Spielberg' , 'https://m.media-amazon.com/images/M/MV5BY2JiYTNmZTctYTQ1OC00YjU4LWEwMjYtZjkwY2Y5MDI0OTU3XkEyXkFqcGdeQXVyNTI4MzE4MDU@._V1_SX300.jpg', 7.4),
        ('tt3228774', 'Cruella', 2021, 'Comedy, Crime', 'A live-action prequel feature film following a young Cruella de Vil.', 'Craig Gillespie', 'https://m.media-amazon.com/images/M/MV5BOWI5YTUxOWEtZmRiZS00ZmQxLWE2NzctYTRiODA2NzE1ZjczXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg', 7.4),
        ('tt0409459', 'Watchmen', 2009, 'Action, Drama, Mystery', 'In 1985 where former superheroes exist, the murder of a colleague sends active vigilante Rorschach into his own sprawling investigation, uncovering something that could completely change the course of history as we know it.', 'Zack Snyder', 'https://m.media-amazon.com/images/M/MV5BY2IzNGNiODgtOWYzOS00OTI0LTgxZTUtOTA5OTQ5YmI3NGUzXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg', 7.6),
        ('tt1981677', 'Pitch Perfect', 2012, 'Comedy, Music, Romance', "Beca, a freshman at Barden University, is cajoled into joining The Bellas, her school's all-girls singing group. Injecting some much needed energy into their repertoire, The Bellas take on their male rivals in a campus competition.", 'Jason Moore', 'https://m.media-amazon.com/images/M/MV5BMTcyMTMzNzE5N15BMl5BanBnXkFtZTcwNzg5NjM5Nw@@._V1_SX300.jpg', 7.1),
        ('tt0118715', 'The Big Lebowski', 1998, 'Comedy, Crime, Sport', 'Jeff "The Dude" Lebowski, mistaken for a millionaire of the same name, seeks restitution for his ruined rug and enlists his bowling buddies to help get it.', 'Joel Coen, Ethan Coen',  'https://m.media-amazon.com/images/M/MV5BMTQ0NjUzMDMyOF5BMl5BanBnXkFtZTgwODA1OTU0MDE@._V1_SX300.jpg', 8.1);


INSERT INTO user_movie (user_id, movie_id, viewed)
VALUES (1, 1, TRUE),
       (1, 2, TRUE),
       (1, 3, TRUE),
       (1, 4, TRUE),
       (1, 5, TRUE),
       (1, 6, TRUE),  
       (1, 7, TRUE),
       (1, 8, TRUE),
       (1, 9, TRUE),
       (1, 10, TRUE);
