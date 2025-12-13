-- Drop existing tables if they exist
DROP TABLE IF EXISTS event_attendees;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

-- Users table
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


-- Events table with spatial index
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tags JSON,
    description TEXT,
    organizer_id INT NOT NULL,
    location POINT NOT NULL SRID 4326,
    SPATIAL INDEX(location),
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
);


-- Comments table
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

-- Join table to track event attendees (many-to-many)
CREATE TABLE event_attendees (
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ============================================================
--   FAKE USERS (ORIGINAL + NEW)
-- ============================================================
INSERT INTO users (username, password, fname, lname, email, bio, role)
VALUES 
('spiderhit', 'pass', 'Rohit', 'Shafe', 'rohit@hotmail.com',
 'Loves organizing events and pretending they will be chill.', 'user'),

('dd', 'pass', 'Donald', 'Duck', 'Donald@duck.com',
 'Quacks loudly, attends events louder.', 'user'),

('doublem', 'pass', 'Mickey', 'Mouse', 'Mickey@mouse.com',
 'Cheese enthusiast. Will host anything if snacks are involved.', 'user'),

('owca', 'pass', 'Major', 'Monogram', 'mm@owca.com',
 'Runs a tight ship. Dislikes chaos. Often surrounded by chaos.', 'user'),

('colins', 'youWillNeverGuess', 'Colin', 'Smith', 'colin@example.com',
 'Computer science student. Probably debugging something right now.', 'user'),

('seanwalsh', 'pass', 'Sean', 'Walsh', 'sean@example.com',
 'Always down for a boys night or a study session.', 'user'),

('jwick', 'pass', 'John', 'Wick', 'john@continental.com',
 'Professional problem solver. Strict rules apply.', 'user'),

('frodo', 'pass', 'Frodo', 'Baggins', 'frodo@shire.me',
 'Just a simple hobbit who somehow got invited to everything.', 'user'),

('shrek', 'pass', 'Shrek', 'Ogre', 'shrek@swamp.com',
 'Swamp owner. BBQ specialist. Donkey tolerated.', 'user'),

('harryp', 'pass', 'Harry', 'Potter', 'harry@hogwarts.edu',
 'Wizard in training. Prone to dramatic events.', 'user'),

('buzzl', 'pass', 'Buzz', 'Lightyear', 'buzz@starcommand.org',
 'Space ranger. Buzzwords guaranteed.', 'user'),

('barbie', 'pass', 'Barbie', '', 'barbie@malibu.com',
 'Fashion-forward. Party-ready. Always iconic.', 'user'),

('toretto', 'pass', 'Dominic', 'Toretto', 'dom@family.com',
 'Lives by three rules: cars, food, and family.', 'user'),

('scooby', 'pass', 'Scooby', 'Doo', 'scooby@snacks.net',
 'Snack-focused investigator. Easily distracted.', 'user'),

('yoda', 'pass', 'Master', 'Yoda', 'yoda@jedi.gov',
 'Speaks in riddles. Surprisingly calming presence.', 'user'),

('ironman', 'pass', 'Tony', 'Stark', 'tony@starkindustries.com',
 'Tech genius. Mild explosion risk.', 'user');


-- ============================================================
--   FAKE EVENTS (ALL NEAR ROLLA, MO)
-- ============================================================
INSERT INTO events (name, tags, description, organizer_id, location)
VALUES
("Rohit's B-Day!", JSON_ARRAY('fun', 'party'), 'Celebration event', 1,
    ST_SRID(POINT(-91.771530, 37.948544), 4326)
),

("Generic Event", JSON_ARRAY('fun'), 'A simple event', 3,
    ST_SRID(POINT(-91.773100, 37.949200), 4326)
),

("Study Session: Algorithms", JSON_ARRAY('study', 'serious'), '3-hour grind sesh', 5,
    ST_SRID(POINT(-91.770400, 37.947900), 4326)
),

("Boys Night: Pizza & COD", JSON_ARRAY('gaming', 'fun'), 'LAN party + pizza', 6,
    ST_SRID(POINT(-91.772800, 37.946300), 4326)
),

("Continental Meetup", JSON_ARRAY('action', 'serious'), 'No guns on company property.', 7,
    ST_SRID(POINT(-91.769900, 37.949900), 4326)
),

("Council of Elrond", JSON_ARRAY('fantasy', 'middle-earth'), 'Discussing ring-related issues.', 8,
    ST_SRID(POINT(-91.770800, 37.950400), 4326)
),

("Swamp BBQ", JSON_ARRAY('food', 'chaos'), 'You’re invited. Donkey not included.', 9,
    ST_SRID(POINT(-91.771200, 37.947300), 4326)
),

("Dueling Club", JSON_ARRAY('magic', 'danger'), 'Expelliarmus only... please.', 10,
    ST_SRID(POINT(-91.772200, 37.948800), 4326)
),

("Star Command Briefing", JSON_ARRAY('space'), 'To infinity... AND BEYOND!', 11,
    ST_SRID(POINT(-91.770500, 37.949100), 4326)
),

("Malibu Dream Party", JSON_ARRAY('pink', 'fashion'), 'Dress code: Fabulous.', 12,
    ST_SRID(POINT(-91.773500, 37.947700), 4326)
),

("Family Cookout", JSON_ARRAY('family', 'cars'), 'Nothing stronger than family.', 13,
    ST_SRID(POINT(-91.772600, 37.949500), 4326)
),

("Scooby Snack Taste Test", JSON_ARRAY('food', 'mystery'), 'Ruh roh?', 14,
    ST_SRID(POINT(-91.771800, 37.948200), 4326)
),

("Jedi Meditation Circle", JSON_ARRAY('force', 'calm'), 'Much peace. Very quiet.', 15,
    ST_SRID(POINT(-91.769300, 37.948700), 4326)
),

("Stark Expo Demo", JSON_ARRAY('tech', 'showcase'), 'New tech reveal. No explosions expected.', 16,
    ST_SRID(POINT(-91.770900, 37.946900), 4326)
);


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


-- ============================================================
--   COMMENTS
-- ============================================================
INSERT INTO comments (event_id, user_id, contents) VALUES
(1, 6, "unc."),
(1, 5, "No Crumbl Cookies. 0/10."),
(1, 9, "Thank you Rohit, very cool.");
