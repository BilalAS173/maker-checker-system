CREATE DATABASE IF NOT EXISTS maker_checker;
USE maker_checker;

CREATE TABLE users (
user_id INT  AUTO_INCREMENT PRIMARY KEY,
employee_id VARCHAR(50) NOT NULL UNIQUE,
password VARCHAR(250) NOT NULL,
name VARCHAR(100) NOT NULL


);
CREATE TABLE projects (
project_id INT AUTO_INCREMENT PRIMARY KEY,
project_name VARCHAR(150) NOT NULL
);

CREATE TABLE user_projects (
user_project_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
project_id INT NOT NULL,
role ENUM ('maker', 'checker') NOT NULL,
FOREIGN KEY (user_id) REFERENCES users(user_id),
FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

CREATE TABLE requests (
request_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
project_id INT NOT NULL,
description TEXT NOT NULL,
created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
status ENUM ('Approved', 'Pending', 'Rejected') DEFAULT 'Pending',
FOREIGN KEY (project_id) REFERENCES projects(project_id),
FOREIGN KEY (user_id) REFERENCES users(user_id)
);