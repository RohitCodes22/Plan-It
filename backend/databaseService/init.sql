-- ============================================================
-- DROP TABLES
-- ============================================================
DROP TABLE IF EXISTS event_attendees;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fname VARCHAR(255),
    lname VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    bio TEXT,
    role VARCHAR(50) NOT NULL DEFAULT 'user'
);

-- ============================================================
-- EVENTS TABLE
-- ============================================================
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tags JSON,
    description TEXT,
    organizer_id INT NOT NULL,
    e_date DATE,
    location POINT NOT NULL SRID 4326,
    SPATIAL INDEX(location),
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- COMMENTS TABLE
-- ============================================================
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT,
    user_id INT NOT NULL,
    contents VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    been_updated BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============================================================
-- EVENT ATTENDEES TABLE
-- ============================================================
CREATE TABLE event_attendees (
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- ORIGINAL USERS (UNCHANGED)
-- ============================================================
INSERT INTO users (username,password,fname,lname,email,bio,role) VALUES
('spiderhit','pass','Rohit','Shafe','rohit@hotmail.com','Loves organizing events and pretending they will be chill.','user'),
('dd','pass','Donald','Duck','donald@duck.com','Quacks loudly, attends events louder.','user'),
('doublem','pass','Mickey','Mouse','mickey@mouse.com','Cheese enthusiast.','user'),
('owca','pass','Major','Monogram','mm@owca.com','Runs a tight ship.','user'),
('colins','youWillNeverGuess','Colin','Smith','colin@example.com','Probably debugging something right now.','user'),
('seanwalsh','pass','Sean','Walsh','sean@example.com','Always down for a boys night.','user'),
('jwick','pass','John','Wick','john@continental.com','Professional problem solver.','user'),
('frodo','pass','Frodo','Baggins','frodo@shire.me','Accidentally invited to everything.','user'),
('shrek','pass','Shrek','Ogre','shrek@swamp.com','Swamp BBQ master.','user'),
('harryp','pass','Harry','Potter','harry@hogwarts.edu','Wizard in training.','user'),
('buzzl','pass','Buzz','Lightyear','buzz@starcommand.org','To infinity and beyond.','user'),
('barbie','pass','Barbie','','barbie@malibu.com','Always iconic.','user'),
('toretto','pass','Dominic','Toretto','dom@family.com','Nothing stronger than family.','user'),
('scooby','pass','Scooby','Doo','scooby@snacks.net','Snack-focused investigator.','user'),
('yoda','pass','Master','Yoda','yoda@jedi.gov','Speaks in riddles.','user'),
('ironman','pass','Tony','Stark','tony@starkindustries.com','Tech genius.','user');

-- ============================================================
-- POP-CULTURE USERS (BLOCK 1)
-- ============================================================
INSERT INTO users (username,password,fname,lname,email,bio,role) VALUES
('lukes','pass','Luke','Skywalker','luke@force.net','Trying to keep balance.','user'),
('leiao','pass','Leia','Organa','leia@rebellion.org','Born leader.','user'),
('hsolo','pass','Han','Solo','han@falcon.space','Smuggler energy.','user'),
('rey','pass','Rey','Skywalker','rey@force.net','Finding her place.','user'),
('anakin','pass','Anakin','Skywalker','ani@sith.org','Emotional extremes.','user'),
('percyj','pass','Percy','Jackson','percy@camp.com','Water problems.','user'),
('annabeth','pass','Annabeth','Chase','annabeth@camp.com','Plans everything.','user'),
('grover','pass','Grover','Underwood','grover@camp.com','Protector type.','user'),
('nico','pass','Nico','di Angelo','nico@underworld.com','Dark vibes.','user'),
('jason','pass','Jason','Grace','jason@camp.com','Lightning guy.','user');

-- ============================================================
-- POP-CULTURE USERS (BLOCK 2)
-- ============================================================
INSERT INTO users (username,password,fname,lname,email,bio,role) VALUES
('thor','pass','Thor','Odinson','thor@asgard.gov','God of thunder.','user'),
('loki','pass','Loki','Odinson','loki@chaos.gov','Trust issues.','user'),
('cap','pass','Steve','Rogers','cap@avengers.com','Leader energy.','user'),
('nat','pass','Natasha','Romanoff','nat@avengers.com','Spy stuff.','user'),
('brucew','pass','Bruce','Wayne','bruce@wayne.com','No powers, still scary.','user'),
('clarkk','pass','Clark','Kent','clark@dailyplanet.com','Mildly strong.','user'),
('barrya','pass','Barry','Allen','barry@ccpd.gov','Always late.','user'),
('aragorn','pass','Aragorn','Elessar','aragorn@gondor.gov','Reluctant king.','user'),
('legolas','pass','Legolas','Greenleaf','legolas@mirkwood.me','Perfect aim.','user'),
('gimli','pass','Gimli','SonofGloin','gimli@erebor.me','Axe enthusiast.','user');

-- ============================================================
-- GENERIC FILLER USERS (BLOCK 3)
-- ============================================================
INSERT INTO users (username,password,fname,lname,email,bio,role) VALUES
('alex1','pass','Alex','Miller','alex1@test.com','Just here.','user'),
('sam2','pass','Sam','Nguyen','sam2@test.com','Attends everything.','user'),
('jordan3','pass','Jordan','Lee','jordan3@test.com','Event hopper.','user'),
('taylor4','pass','Taylor','Smith','taylor4@test.com','Social butterfly.','user'),
('morgan5','pass','Morgan','Davis','morgan5@test.com','Always busy.','user');

-- ============================================================
-- EVENTS (MISSOURI CLUSTER)
-- ============================================================
INSERT INTO events (name,tags,description,organizer_id,e_date,location) VALUES
('Rohit''s B-Day!',JSON_ARRAY('party','fun'),'Celebration',1,'2025-12-14',ST_SRID(POINT(-91.77153,37.94854),4326)),
('Study Grind',JSON_ARRAY('study'),'3-hour grind',5,'2025-12-20',ST_SRID(POINT(-91.77040,37.94790),4326)),
('LAN Night',JSON_ARRAY('gaming'),'Pizza + games',6,'2025-12-21',ST_SRID(POINT(-91.77280,37.94630),4326)),
('Jedi Meditation',JSON_ARRAY('force'),'Calm vibes',15,'2026-01-06',ST_SRID(POINT(-91.76930,37.94870),4326)),
('Camp Half-Blood Meetup',JSON_ARRAY('myth'),'Training day',19,'2026-01-07',ST_SRID(POINT(-91.77310,37.94920),4326));

-- ============================================================
-- EVENTS (US + WORLD SCATTER)
-- ============================================================
INSERT INTO events (name,tags,description,organizer_id,e_date,location) VALUES
('Avengers Briefing',JSON_ARRAY('action'),'Save the world',16,'2026-01-05',ST_SRID(POINT(-74.0060,40.7128),4326)), -- NYC
('Stark Expo',JSON_ARRAY('tech'),'New tech',16,'2026-02-01',ST_SRID(POINT(-118.2437,34.0522),4326)), -- LA
('Gotham Watch',JSON_ARRAY('vigilante'),'Night patrol',26,'2026-02-10',ST_SRID(POINT(-75.1652,39.9526),4326)), -- Philly-ish
('Asgard Summit',JSON_ARRAY('myth'),'God politics',21,'2026-03-01',ST_SRID(POINT(10.7522,59.9139),4326)), -- Oslo
('Middle Earth Council',JSON_ARRAY('fantasy'),'Ring talk',27,'2026-03-15',ST_SRID(POINT(174.7633,-36.8485),4326)); -- NZ

-- ============================================================
-- EVENT ATTENDEES (MULTIPLE EVENTS PER USER)
-- ============================================================
INSERT INTO event_attendees VALUES
(1,1),(1,2),(1,3),(1,17),(1,18),
(2,5),(2,6),(2,20),(2,21),
(3,6),(3,7),(3,22),(3,23),
(4,15),(4,17),(4,18),
(5,19),(5,20),(5,21),
(6,16),(6,22),(6,23),
(7,16),(7,21),(7,22),
(8,26),(8,27),(8,28),
(9,21),(9,22),(9,23),
(10,27),(10,28),(10,29);

-- ============================================================
-- COMMENTS (LOTS OF ACTIVITY)
-- ============================================================
INSERT INTO comments (event_id,user_id,contents) VALUES
(1,6,'unc.'),
(1,5,'No cookies.'),
(1,9,'Very cool.'),
(2,20,'Why am I here.'),
(2,21,'Worth it.'),
(3,6,'Pizza carried.'),
(4,15,'Much peace.'),
(5,19,'Training was intense.'),
(6,16,'Minimal explosions.'),
(7,21,'Tech was insane.'),
(8,26,'Gotham is stressful.'),
(9,22,'Asgard politics wild.'),
(10,27,'This meeting could have been an email.');
