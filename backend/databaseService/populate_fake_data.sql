-- ============================================================
--   FAKE USERS
-- ============================================================
INSERT INTO users (username, password, fname, lname, email, role)
VALUES 
('spiderhit', 'pass', 'Rohit', 'Shafe', 'rohit@hotmail.com', 'user'),
('dd', 'pass', 'Donald', 'Duck', 'Donald@duck.com', 'user'),
('doublem', 'pass', 'Mickey', 'Mouse', 'Mickey@mouse.com', 'user'),
('owca', 'pass', 'major', 'monogram', 'mm@owca.com', 'user');


-- ============================================================
--   FAKE EVENTS (Mickey = organizer)
-- ============================================================
INSERT INTO events (name, tags, description, organizer_id)
VALUES
("Rohit's B-Day!", JSON_ARRAY('fun', 'party'), 'Celebration event', 1),
("Generic Event",  JSON_ARRAY('fun'), 'A simple event', 3);

-- Save first event ID for attendees
SET @event1 = 1;
SET @event2 = 2;

-- ============================================================
--   EVENT ATTENDEES (Users attending event #1)
-- ============================================================
INSERT INTO event_attendees (event_id, user_id)
VALUES
(@event1, 1),  -- Rohit
(@event1, 2),  -- Donald
(@event1, 3);  -- Mickey

