-- Drop existing tables if they exist
DROP TABLE IF EXISTS event_attendees;
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
    role VARCHAR(50) NOT NULL DEFAULT 'user'
);

-- Events table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tags JSON,
    description TEXT,
    organizer_id INT NOT NULL,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Join table to track event attendees (many-to-many)
CREATE TABLE event_attendees (
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
