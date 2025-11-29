-- ============================================================
--   FAKE USERS (ORIGINAL + NEW)
-- ============================================================
INSERT INTO users (username, password, fname, lname, email, role)
VALUES 
('spiderhit', 'pass', 'Rohit', 'Shafe', 'rohit@hotmail.com', 'user'),
('dd', 'pass', 'Donald', 'Duck', 'Donald@duck.com', 'user'),
('doublem', 'pass', 'Mickey', 'Mouse', 'Mickey@mouse.com', 'user'),
('owca', 'pass', 'Major', 'Monogram', 'mm@owca.com', 'user'),

-- New requested users
('colins', 'pass', 'Colin', 'Smith', 'colin@example.com', 'user'),
('seanwalsh', 'pass', 'Sean', 'Walsh', 'sean@example.com', 'user'),

-- Fun characters
('jwick', 'pass', 'John', 'Wick', 'john@continental.com', 'user'),
('frodo', 'pass', 'Frodo', 'Baggins', 'frodo@shire.me', 'user'),
('shrek', 'pass', 'Shrek', 'Ogre', 'shrek@swamp.com', 'user'),
('harryp', 'pass', 'Harry', 'Potter', 'harry@hogwarts.edu', 'user'),
('buzzl', 'pass', 'Buzz', 'Lightyear', 'buzz@starcommand.org', 'user'),
('barbie', 'pass', 'Barbie', '', 'barbie@malibu.com', 'user'),
('toretto', 'pass', 'Dominic', 'Toretto', 'dom@family.com', 'user'),
('scooby', 'pass', 'Scooby', 'Doo', 'scooby@snacks.net', 'user'),
('yoda', 'pass', 'Master', 'Yoda', 'yoda@jedi.gov', 'user'),
('ironman', 'pass', 'Tony', 'Stark', 'tony@starkindustries.com', 'user');


-- ============================================================
--   FAKE EVENTS
-- ============================================================
INSERT INTO events (name, tags, description, organizer_id)
VALUES
("Rohit's B-Day!", JSON_ARRAY('fun', 'party'), 'Celebration event', 1),
("Generic Event",  JSON_ARRAY('fun'), 'A simple event', 3),

("Study Session: Algorithms", JSON_ARRAY('study', 'serious'), '3-hour grind sesh', 5),
("Boys Night: Pizza & COD", JSON_ARRAY('gaming', 'fun'), 'LAN party + pizza', 6),
("Continental Meetup", JSON_ARRAY('action', 'serious'), 'No guns on company property.', 7),
("Council of Elrond", JSON_ARRAY('fantasy', 'middle-earth'), 'Discussing ring-related issues.', 8),
("Swamp BBQ", JSON_ARRAY('food', 'chaos'), 'You’re invited. Donkey not included.', 9),
("Dueling Club", JSON_ARRAY('magic', 'danger'), 'Expelliarmus only... please.', 10),
("Star Command Briefing", JSON_ARRAY('space'), 'To infinity... AND BEYOND!', 11),
("Malibu Dream Party", JSON_ARRAY('pink', 'fashion'), 'Dress code: Fabulous.', 12),
("Family Cookout", JSON_ARRAY('family', 'cars'), 'Nothing stronger than family.', 13),
("Scooby Snack Taste Test", JSON_ARRAY('food', 'mystery'), 'Ruh roh?', 14),
("Jedi Meditation Circle", JSON_ARRAY('force', 'calm'), 'Much peace. Very quiet.', 15),
("Stark Expo Demo", JSON_ARRAY('tech', 'showcase'), 'New tech reveal. No explosions expected.', 16);


-- ============================================================
--   EVENT ATTENDEES
-- ============================================================

-- Event 1: Rohit's B-Day
INSERT INTO event_attendees (event_id, user_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 5),
(1, 9);

-- Event 2: Generic Event    
INSERT INTO event_attendees (event_id, user_id) VALUES
(2, 3),
(2, 4),
(2, 10);

-- Algorithms Study Session
INSERT INTO event_attendees (event_id, user_id) VALUES
(3, 5),
(3, 6),
(3, 16);

-- Boys Night
INSERT INTO event_attendees (event_id, user_id) VALUES
(4, 5),
(4, 6),
(4, 7);

-- Continental Meetup (John Wick)
INSERT INTO event_attendees (event_id, user_id) VALUES
(5, 7),
(5, 13),
(5, 16);

-- Council of Elrond
INSERT INTO event_attendees (event_id, user_id) VALUES
(6, 8),
(6, 9),
(6, 7);

-- Swamp BBQ
INSERT INTO event_attendees (event_id, user_id) VALUES
(7, 9),
(7, 14),
(7, 5);

-- Dueling Club
INSERT INTO event_attendees (event_id, user_id) VALUES
(8, 10),
(8, 15),
(8, 12);

-- Star Command Briefing  
INSERT INTO event_attendees (event_id, user_id) VALUES
(9, 11),
(9, 12),
(9, 5);

-- Malibu Dream Party
INSERT INTO event_attendees (event_id, user_id) VALUES
(10, 12),
(10, 6),
(10, 13);

-- Family Cookout
INSERT INTO event_attendees (event_id, user_id) VALUES
(11, 13),
(11, 5),
(11, 9),
(11, 7);

-- Scooby Snack Taste Test
INSERT INTO event_attendees (event_id, user_id) VALUES
(12, 14),
(12, 9),
(12, 2);

-- Jedi Meditation Circle
INSERT INTO event_attendees (event_id, user_id) VALUES
(13, 15),
(13, 10),
(13, 1);

-- Stark Expo Demo
INSERT INTO event_attendees (event_id, user_id) VALUES
(14, 16),
(14, 5),
(14, 11);
