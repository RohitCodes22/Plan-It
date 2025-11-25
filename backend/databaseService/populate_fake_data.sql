-- Fake users
INSERT INTO users (username, password, fname, lname, email)
VALUES 
('spiderhit)))', 'pass', 'Rohit', 'Shafe', 'rohit@hotmail.com'),
('dd', 'pass', 'Donald', 'Duck', 'Donald@duck.com'),
('double m', 'pass', 'Mickey', 'Mouse', 'Mickey@mouse.com');

-- Fake events
INSERT INTO events (name, tags, description)
VALUES
("Rohit's B-Day!", JSON_ARRAY('fun'), ''),
("event name",     JSON_ARRAY('fun'), '');

-- Fake test user for task list
INSERT INTO users (username, password, fname, lname, email)
VALUES ('testuser', 'pass', 'Test', 'User', 'test@example.com');

-- Tasks for test user
INSERT INTO tasks (user_id, task, completed)
VALUES
(LAST_INSERT_ID(), 'Task 1', FALSE),
(LAST_INSERT_ID(), 'Task 2', TRUE);
